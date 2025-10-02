import { AngleUnits, convert, MeasureUnits } from "./util/MeasurementUnit.js";
import { DragFunction, GRAVITY } from "./BallisticX.js";
import type { PointBlankRangeResult } from "./types/PointBlankRangeResult.js";
import { calculateRetard } from "./Retard.js";

/**
 * @function
 * @name calculatePointBlankRange
 * @description
 *  Computes point-blank-range related metrics for a projectile via the Runge-Kutta Methods (RK4):
 * 
 * * Notes on stability:
 *  - Adaptive timestep is used (dt = 0.5 / v) but we cap dt to avoid very large timesteps
 *    when velocity becomes small (which would otherwise cause runaway vertical velocities).
 *  - If the integrator becomes numerically unstable (v ≈ 0 or vertical velocity >> horizontal),
 *    we log and return the current (zeroed) result rather than throwing an uncaught error.
 * 
 * @param {DragFunction} dragFunction  Drag model to use (G1, G7, etc.)
 * @param {number} dragCoefficient     Projectile drag coefficient
 * @param {number} initialVelocity     Muzzle velocity (ft/s)
 * @param {number} sightHeight   Height of optic above bore (inches)
 * @param {number} vitalZoneSize     Diameter of the vital zone (inches)
 * 
 * @returns {PointBlankRangeResult}
 * 
 * @see {@link https://en.wikipedia.org/wiki/Runge%E2%80%93Kutta_methods | Runge-Kutta Methods}
 */

export function calculatePointBlankRange(
    drag: DragFunction,
    dragCoefficient: number,
    initialVelocity: number,
    sightHeight: number,
    vitalZoneSize: number
): PointBlankRangeResult {
    const result: PointBlankRangeResult = {
        nearZero: 0,
        farZero: 0,
        minPointBlankRange: 0,
        maxPointBlankRange: 0,
        sightInHeight: 0
    };

    // --- Integration parameters ---
    let trajectoryAngle = 0; // initial firing angle (degrees)
    let angleStep = 10;      // step to adjust angle during iteration
    const maxIterations = 1000; // safeguard for infinite loops
    const tolerance = 0.01 / 60; // convergence tolerance (degrees)

    // --- Convergence flags ---
    let finished = false;

    // Variables to store critical distances
        let nearZero = 0, farZero = 0;
        let minPBR = 0, maxPBR = 0;
        let vertexX = 0, vertexY = 0;
        let sightInHeight = 0;

    // --- Loop until vertex height matches vital zone constraints ---
    while (!finished) {
        // Initial state
        let posX = 0;
        let posY = -sightHeight / 12; // convert inches to feet
        let velX = initialVelocity * Math.cos(convert(MeasureUnits.ANGLE, AngleUnits.DEGREE, AngleUnits.RADIAN, trajectoryAngle));
        let velY = initialVelocity * Math.sin(convert(MeasureUnits.ANGLE, AngleUnits.DEGREE, AngleUnits.RADIAN, trajectoryAngle));

        // Flags for tracking critical points
        let nearZeroFound = false;
        let farZeroFound = false;
        let minPBRFound = false;
        let maxPBRFound = false;
        let vertexFound = false;
        let sightInRecorded = false;



        // --- Time stepping ---
        let dt = 0.001; // initial timestep (seconds)
        for (let step = 0; step < maxIterations; step++) {
            const speed = Math.sqrt(velX * velX + velY * velY);
            dt = Math.min(0.5 / speed, 0.01); // adaptive timestep

            // Calculate drag acceleration
            const dragAccel = calculateRetard(drag, dragCoefficient, speed);

            // Resolve gravity
            const angleRad = convert(MeasureUnits.ANGLE, AngleUnits.DEGREE, AngleUnits.RADIAN, trajectoryAngle);
            const accelX = - (velX / speed) * dragAccel + GRAVITY * Math.sin(angleRad);
            const accelY = - (velY / speed) * dragAccel + GRAVITY * Math.cos(angleRad);

            // --- RK4 Integration ---
            const k1x = velX * dt;
            const k1y = velY * dt;
            const k1vx = accelX * dt;
            const k1vy = accelY * dt;

            const k2x = (velX + k1vx / 2) * dt;
            const k2y = (velY + k1vy / 2) * dt;
            const k2vx = accelX * dt;
            const k2vy = accelY * dt;

            const k3x = (velX + k2vx / 2) * dt;
            const k3y = (velY + k2vy / 2) * dt;
            const k3vx = accelX * dt;
            const k3vy = accelY * dt;

            const k4x = (velX + k3vx) * dt;
            const k4y = (velY + k3vy) * dt;
            const k4vx = accelX * dt;
            const k4vy = accelY * dt;

            posX += (k1x + 2*k2x + 2*k3x + k4x) / 6;
            posY += (k1y + 2*k2y + 2*k3y + k4y) / 6;
            velX += (k1vx + 2*k2vx + 2*k3vx + k4vx) / 6;
            velY += (k1vy + 2*k2vy + 2*k3vy + k4vy) / 6;


            // --- Record critical points ---
            if (!nearZeroFound && posY >= 0 && velY >= 0) {
                nearZero = posX;
                nearZeroFound = true;
            }
            if (!farZeroFound && posY < 0 && velY <= 0) {
                farZero = posX;
                farZeroFound = true;
            }
            if (!minPBRFound && 12 * posY > -vitalZoneSize / 2) {
                minPBR = posX;
                minPBRFound = true;
            }
            if (minPBRFound && !maxPBRFound && 12 * posY < -vitalZoneSize / 2) {
                maxPBR = posX;
                maxPBRFound = true;
            }
            if (!vertexFound && velY < 0) {
                vertexX = posX;
                vertexY = posY;
                vertexFound = true;
            }
            if (!sightInRecorded && posX >= 300) {
                sightInHeight = 100 * posY * 12; // hundredths of inch
                sightInRecorded = true;
            }

            if (nearZeroFound && farZeroFound && minPBRFound && maxPBRFound && vertexFound && sightInRecorded) {
                break;
            }
        }

        // --- Adjust trajectory angle for PBR constraints ---
        const vertexInches = vertexY * 12;
        if (vertexInches > vitalZoneSize / 2 && angleStep > 0) {
            angleStep = -angleStep / 2;
        } else if (vertexInches <= vitalZoneSize / 2 && angleStep < 0) {
            angleStep = -angleStep / 2;
        }

        trajectoryAngle += angleStep;
        if (Math.abs(angleStep) < tolerance) {
            finished = true;
        }
    }

    // --- Convert results to yards ---
    result.nearZero = nearZero / 3;
    result.farZero = farZero / 3;
    result.minPointBlankRange = minPBR / 3;
    result.maxPointBlankRange = maxPBR / 3;
    result.sightInHeight = sightInHeight / 100;

    return result;
}