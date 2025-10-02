import { DragFunction, GRAVITY, BALLISTIC_COMPENSATION_MAX_RANGE } from "./BallisticX.js";
import { calculateRetard } from "./Retard.js";
import type { BallisticComputationUnit } from "./types/BallisticComputationUnit.js";
import logger from "./util/Logger.js";
import { convert, MeasureUnits, AngleUnits } from "./util/MeasurementUnit.js";
import { headWind, crossWind, calculateWindage } from "./Windage.js";


/**
 * @function
 * @name solveAll
 * @description Generate a ballistic solution table in 1 yard increments, up to BALLISTIC_COMPENSATION_MAX_RANGE.
 * Uses numerical integration (Euler's method) to simulate projectile trajectory accounting for:
 * - Gravity (with angle compensation)
 * - Air resistance (drag)
 * - Wind effects (headwind and crosswind)
 *
 * @param {DragFunction} drag DragFunction enum value
 * @param {number} dragCoefficient The coefficient of drag for the projectile
 * @param {number} initialVelocity The projectile's initial velocity
 * @param {number} sightHeight Height of the sighting system above the bore centerline
 * @param {number} shootingAngle Uphill or downhill shooting angle in degrees
 * @param {number} zeroAngle Angle of the sighting system relative to the bore in degrees
 * @param {number} windSpeed Wind velocity in miles per hour
 * @param {number} windAngle Angle at which the wind is approaching from, in degrees
 * @param {number} _zero The range in yards away from the muzzle at which the rifle is zeroed
 * @return An array of CompUnit objects calculated over the entire estimated range
 * 
 * @see {@link https://en.wikipedia.org/wiki/Euler_method|Euler's Method}
 */

export function solveAll(
    drag: DragFunction,
    dragCoefficient: number,
    initialVelocity: number,
    sightHeight: number,
    shootingAngle: number,
    zeroAngle: number,
    windSpeed: number,
    windAngle: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _zero: number
): Array<BallisticComputationUnit> {
    // Time tracking variables
    let timeElapsed = 0; // Total time since projectile left the barrel (seconds)
    let timeStep = 0.5 / initialVelocity; // Adaptive time step for numerical integration (seconds)
    
    // Velocity variables (feet per second)
    let totalVelocity = 0; // Magnitude of velocity vector
    let horizontalVelocity = 0; // Velocity in horizontal (x) direction
    let previousHorizontalVelocity = 0; // Previous horizontal velocity for averaging
    let verticalVelocity = 0; // Velocity in vertical (y) direction
    let previousVerticalVelocity = 0; // Previous vertical velocity for averaging
    
    // Acceleration/deceleration variables (feet per second squared)
    let dragDeceleration = 0; // Total deceleration due to air resistance
    let horizontalAcceleration = 0; // Acceleration in horizontal direction
    let verticalAcceleration = 0; // Acceleration in vertical direction
    
    // Position variables (feet)
    let horizontalDistance = 0; // Distance traveled horizontally from muzzle
    let verticalDistance = 0; // Height relative to bore centerline

    // Calculate wind components
    // Headwind opposes forward motion, crosswind causes lateral drift
    const headwindComponent = headWind(windSpeed, windAngle);
    const crosswindComponent = crossWind(windSpeed, windAngle);

    // Calculate gravity vector components based on shooting angle
    // When shooting uphill/downhill, gravity affects trajectory differently
    const gravityVerticalComponent = GRAVITY * Math.cos(
        convert(MeasureUnits.ANGLE, AngleUnits.DEGREE, AngleUnits.RADIAN, shootingAngle + zeroAngle)
    );
    const gravityHorizontalComponent = GRAVITY * Math.sin(
        convert(MeasureUnits.ANGLE, AngleUnits.DEGREE, AngleUnits.RADIAN, shootingAngle + zeroAngle)
    );

    logger.debug(`Gravity Vertical Component: ${gravityVerticalComponent}`);
    logger.debug(`Gravity Horizontal Component: ${gravityHorizontalComponent}`);

    // Initialize velocity components based on zero angle
    // The projectile leaves at an angle relative to the bore axis
    horizontalVelocity = initialVelocity * Math.cos(
        convert(MeasureUnits.ANGLE, AngleUnits.DEGREE, AngleUnits.RADIAN, zeroAngle)
    );
    verticalVelocity = initialVelocity * Math.sin(
        convert(MeasureUnits.ANGLE, AngleUnits.DEGREE, AngleUnits.RADIAN, zeroAngle)
    );
    
    logger.debug(`Initial Horizontal Velocity: ${horizontalVelocity}`);
    logger.debug(`Initial Vertical Velocity: ${verticalVelocity}`);

    // Initialize starting height (negative because sight is above bore)
    // Divided by 12 to convert inches to feet
    verticalDistance = -sightHeight / 12;
    logger.debug(`Initial Vertical Distance: ${verticalDistance}`);

    // Array to store ballistic solution for each yard increment
    const solution: Array<BallisticComputationUnit> = [];
    
    // Counter for yard increments (solution is stored every yard)
    let yardsCounter = 0;
    
    // Safety counter to prevent infinite loops
    let iterationCount = 0;
    const MAX_ITERATIONS = 100000;
    
    // Main simulation loop - numerical integration of equations of motion
    for (timeElapsed = 0; ; timeElapsed = timeElapsed + timeStep) {
        // Safety check to prevent infinite loops
        iterationCount++;
        if (iterationCount > MAX_ITERATIONS) {
            logger.debug("Max iterations reached, terminating simulation");
            break;
        }
        // Store previous velocities for averaging (improves accuracy)
        previousHorizontalVelocity = horizontalVelocity;
        previousVerticalVelocity = verticalVelocity;
        
        // Calculate total velocity magnitude
        totalVelocity = Math.sqrt(horizontalVelocity * horizontalVelocity + verticalVelocity * verticalVelocity);
        
        // Recalculate time step based on current velocity
        // Slower projectiles need smaller time steps for accuracy
        timeStep = 0.5 / totalVelocity;

        // Calculate drag deceleration
        // Headwind is added to velocity (opposing motion increases relative air speed)
        // Convert headwind from mph to fps: mph * 5280 feet/mile / 3600 seconds/hour
        dragDeceleration = calculateRetard(
            drag, 
            dragCoefficient, 
            totalVelocity + headwindComponent * 5280.0 / 3600.0
        );
        
        // Resolve drag deceleration into horizontal and vertical components
        // Drag always opposes velocity direction
        horizontalAcceleration = -(horizontalVelocity / totalVelocity) * dragDeceleration;
        verticalAcceleration = -(verticalVelocity / totalVelocity) * dragDeceleration;

        // Update velocities with drag and gravity
        // Euler integration: new_velocity = old_velocity + acceleration * time_step
        horizontalVelocity += timeStep * horizontalAcceleration + timeStep * gravityHorizontalComponent;
        verticalVelocity += timeStep * verticalAcceleration + timeStep * gravityVerticalComponent;

        // Store solution at each yard increment (horizontalDistance is in feet, so /3 gives yards)
        // Use Math.floor to ensure we only record once per yard
        const currentYard = Math.floor(horizontalDistance / 3);
        if (currentYard >= yardsCounter && horizontalDistance > 0) {
            // Calculate wind drift at this range
            const windageInches = calculateWindage(
                crosswindComponent, 
                initialVelocity, 
                horizontalDistance, 
                timeElapsed + timeStep
            );
            
            // Avoid division by zero in angle calculations
            const correctionAngle = horizontalDistance > 0 
                ? Math.atan(verticalDistance / horizontalDistance)
                : 0;
            const windageMOAAngle = (horizontalDistance > 0 && windageInches !== 0)
                ? Math.atan(windageInches / (12 * horizontalDistance))
                : 0;
            
            // Create ballistic computation unit for this yard
            const unit: BallisticComputationUnit = {
                range: currentYard, // Integer yard value
                drop: verticalDistance * 12, // Convert feet to inches
                // Correction angle in MOA (negative because we measure drop below line of sight)
                correction: - convert(
                    MeasureUnits.ANGLE, 
                    AngleUnits.RADIAN, 
                    AngleUnits.MOA, 
                    correctionAngle
                ),
                time: timeElapsed + timeStep,
                windageInches: windageInches,
                // Convert windage to angular measurement (MOA)
                windageMOA: convert(
                    MeasureUnits.ANGLE, 
                    AngleUnits.RADIAN, 
                    AngleUnits.MOA, 
                    windageMOAAngle
                ),
                velocityCompensated: totalVelocity,
                horizontalVelocity: horizontalVelocity,
                verticalVelocity: verticalVelocity
            };

            solution.push(unit);
            yardsCounter = currentYard + 1; // Set counter to next yard to check
        }

        // Update position using average velocity (trapezoidal integration)
        // This improves accuracy over using instantaneous velocity
        horizontalDistance = horizontalDistance + timeStep * (horizontalVelocity + previousHorizontalVelocity) / 2;
        verticalDistance = verticalDistance + timeStep * (verticalVelocity + previousVerticalVelocity) / 2;
        
        logger.debug(`Updated Horizontal Position: ${horizontalDistance}`);
        logger.debug(`Updated Vertical Position: ${verticalDistance}`);

        // Exit condition 1: Horizontal velocity too low (projectile essentially stopped)
        if (Math.abs(horizontalVelocity) < 0.1) {
            logger.debug("Horizontal velocity too low, terminating simulation");
            break;
        }

        // Exit condition 2: Projectile trajectory becomes too steep
        // If vertical velocity exceeds 3x horizontal velocity, projectile is falling nearly straight down
        if (Math.abs(verticalVelocity) > Math.abs(3 * horizontalVelocity)) {
            logger.debug("Trajectory too steep, terminating simulation");
            break;
        }

        // Exit condition 3: Reached maximum calculation range
        if (yardsCounter >= BALLISTIC_COMPENSATION_MAX_RANGE + 1) {
            logger.debug("Reached max range for calculation");
            break;
        }
        
        // Exit condition 4: Velocity becomes invalid (NaN check)
        if (isNaN(horizontalVelocity) || isNaN(verticalVelocity) || isNaN(horizontalDistance)) {
            logger.debug("Invalid values detected, terminating simulation");
            break;
        }
        
        // Exit condition 5: Time step becomes too small (numerical instability)
        if (timeStep < 1e-10) {
            logger.debug("Time step too small, terminating simulation");
            break;
        }
    }

    return solution;
}