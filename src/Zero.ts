import { DragFunction, GRAVITY } from "./BallisticX.js";
import { calculateRetard } from "./Retard.js";
import { AngleUnits, convert, MeasureUnits } from "./util/MeasurementUnit.js";

/**
 * @function
 * @name zeroAngle
 * @description Determines the bore angle needed to achieve a target zero at `zeroRange` yards
 *              (assumes standard conditions and level ground; returns angle in degrees).
 *
 * @param {DragFunction} drag enum value (drag model selector)
 * @param {number} dragCoefficient The coefficient of drag for the projectile
 * @param {number} initialVelocity The muzzle / initial velocity of the projectile, in feet/s
 * @param {number} sightHeightInches The height of the sighting system above the bore centerline, in inches
 * @param {number} zeroRangeYards The range in yards at which you wish the projectile to intersect yIntercept
 * @param {number} yInterceptInches The height, in inches, you wish for the projectile to be when it crosses zeroRangeYards
 *
 * @returns {number} The required bore-to-sight angle, in degrees
 */
export function zeroAngle(
    drag: DragFunction,
    dragCoefficient: number,
    initialVelocity: number,
    sightHeightInches: number,
    zeroRangeYards: number,
    yInterceptInches: number
): number {
    // --- Numerical integration / iterative approximation setup ---

    // time (seconds) and timestep (seconds)
    let time = 0;
    // initial timestep chosen as 1 / initial velocity (sec) — will be adjusted per-step by actual speed
    let timeStep = 1 / initialVelocity;

    // vertical position (feet) — initialize to minus sight height (sight is above bore),
    // convert inches to feet for internal computations
    let verticalPositionFeet = -sightHeightInches / 12;

    // horizontal range (feet) from muzzle
    let horizontalRangeFeet = 0;

    // initial angle step (radians) for the outer successive-approximation loop.
    // This converts 14 degrees to radians and uses it as the initial step size.
    let angleStepRadians = convert(MeasureUnits.ANGLE, AngleUnits.DEGREE, AngleUnits.RADIAN, 14);

    // --- State variables used during the per-step integration ---
    let speed = 0;              // instantaneous speed magnitude (ft/s)
    let velocityX = 0;          // horizontal component of velocity (ft/s)
    let velocityY = 0;          // vertical component of velocity (ft/s)
    let prevVelocityX = 0;      // previous-step horizontal velocity (ft/s) used for trapezoidal integration
    let prevVelocityY = 0;      // previous-step vertical velocity (ft/s)
    let retardation = 0;        // magnitude of deceleration from drag (ft/s^2)
    let deltaVx = 0;            // change in horizontal velocity over the step (ft/s)
    let deltaVy = 0;            // change in vertical velocity over the step (ft/s)
    let gravityAlongX = 0;      // gravity component along the X axis (ft/s^2)
    let gravityAlongY = 0;      // gravity component along the Y axis (ft/s^2)

    // current trial angle (radians)
    let angleRadians = 0;
    // loop control for successive approximation
    let done = false;

    // Convert the target y intercept (given in inches) to feet for internal calculations
    const yInterceptFeet = yInterceptInches / 12;
    // Convert the zero range from yards to feet for comparisons
    const zeroRangeFeet = zeroRangeYards * 3; // 1 yard = 3 feet — NOTE: original code uses zeroRange * 3 as termination

    // --- Successive approximation (outer) loop:
    // increment/decrement the launch angle and converge using halving of angleStepRadians
    for (angleRadians = 0; !done; angleRadians = angleRadians + angleStepRadians) {
        // Initialize velocity components for this trial angle
        velocityY = initialVelocity * Math.sin(angleRadians);
        velocityX = initialVelocity * Math.cos(angleRadians);

        // Resolve gravity into components relative to the projectile's orientation
        // GRAVITY is a magnitude; project into axes aligned with the launch angle.
        gravityAlongX = GRAVITY * Math.sin(angleRadians);
        gravityAlongY = GRAVITY * Math.cos(angleRadians);

        // --- Time-stepping numerical integration loop for this trial angle ---
        // Reset time and positions for each trial angle
        for (
            time = 0, 
            horizontalRangeFeet = 0, 
            verticalPositionFeet = -sightHeightInches / 12; 
            horizontalRangeFeet <= zeroRangeFeet; 
            time = time + timeStep
        ) {
            // store previous velocities for trapezoidal position integration
            prevVelocityY = velocityY;
            prevVelocityX = velocityX;

            // instantaneous speed magnitude and adaptive timestep
            speed = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
            // keep timestep proportional to 1 / speed (smaller timestep when faster)
            timeStep = 1 / speed;

            // compute magnitude of deceleration (retardation) from the chosen drag model
            retardation = calculateRetard(drag, dragCoefficient, speed);

            // components of velocity change due to drag during this small time step
            // dvx = - (retardation * vx / v ) * dt  (drag opposite to motion)
            deltaVy = -retardation * velocityY / speed * timeStep;
            deltaVx = -retardation * velocityX / speed * timeStep;

            // update velocity components adding gravity components (note directions)
            velocityY += (deltaVy + timeStep * gravityAlongY);
            velocityX += (deltaVx + timeStep * gravityAlongX);

            // integrate positions using trapezoidal rule (average current and previous velocity)
            horizontalRangeFeet += (timeStep * (velocityX + prevVelocityX) / 2);
            verticalPositionFeet += (timeStep * (velocityY + prevVelocityY) / 2);

            // --- Early exit checks to save CPU if the projectile cannot reach the target yIntercept ---

            // If projectile is descending (vy < 0) and already below target intercept, break:
            if ((velocityY < 0) && (verticalPositionFeet < yInterceptFeet)) {
                break;
            }

            // Safety guard: if vertical velocity becomes unreasonably large compared to horizontal velocity,
            // break to avoid pathological cases (preserves original behavior).
            if (velocityY > 3 * velocityX) {
                break;
            }
        } // end per-angle integration loop

        // --- Successive-approximation adjustment of angleStepRadians ---
        // If the vertical position at the termination of the integration is above the target
        // and we were stepping positively, reverse direction and halve the step (binary search-like).
        if ((verticalPositionFeet > yInterceptFeet) && (angleStepRadians > 0)) {
            angleStepRadians = -angleStepRadians / 2;
        }

        // If below target and we were stepping negatively, reverse direction and halve step
        if ((verticalPositionFeet < yInterceptFeet) && (angleStepRadians < 0)) {
            angleStepRadians = -angleStepRadians / 2;
        }

        // Stopping criterion: if angle step is sufficiently small (converted from MOA to radians),
        // consider the solution converged.
        if (Math.abs(angleStepRadians) < convert(MeasureUnits.ANGLE, AngleUnits.MOA, AngleUnits.RADIAN, 0.01)) {
            done = true;
        }

        // Failsafe: if trial angle exceeds 45 degrees (converted to radians), stop — projectile won't reach target
        if (angleRadians > convert(MeasureUnits.ANGLE, AngleUnits.DEGREE, AngleUnits.RADIAN, 45)) {
            done = true;
        }
    } // end successive approximation loop

    // Convert final angle from radians to degrees before returning
    return convert(MeasureUnits.ANGLE, AngleUnits.RADIAN, AngleUnits.DEGREE, angleRadians);
}
