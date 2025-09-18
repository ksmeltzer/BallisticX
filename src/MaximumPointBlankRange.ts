import { AngleUnits, convert, MeasureUnits } from "./util/MeasurementUnit.js";
import { DragFunction, GRAVITY } from "./BallisticX.js";
import logger from "./util/Logger.js";
import type { PointBlankRangeResult } from "./types/PointBlankRangeResult.js";
import { calculateRetard } from "./Retard.js";

/**
 * @function
 * @name calculatePointBlankRange
 * @description Solves for the corrected Point Blank Range values
 * 
 * @param {DragFunction} drag The drag function you wish to use for the solution (G1, G2, G3, etc.)
 * @param {number} dragCoefficient The coefficient of drag for the projectile you wish to model.
 * @param {number} initialVelocity The projectile initial velocity.
 * @param {number} sightHeight The height of the sighting system above the bore centerline.
 * @param {number} vitalSize Size in inches of the target at which the point of impact must remain in.
 *
 * @returns {PointBlankRangeResult}  A Point blank range result object containing our five results.
 * 
 * @see https://www.ronspomeroutdoors.com/blog/understanding-mpbr-for-better-shooting
 * @see https://shooterscalculator.com/point-blank-range.php
 */
export function calculatePointBlankRange(
    drag: DragFunction,
    dragCoefficient: number,
    initialVelocity: number,
    sightHeight: number,
    vitalSize: number
): PointBlankRangeResult {
    const result: PointBlankRangeResult = {
        nearZero: 0,
        farZero: 0,
        minPointBlankRange: 0,
        maxPointBlankRange: 0,
        sightInHeight: 0
    };

    let t = 0;
    let dt = 0.5 / initialVelocity;
    let v = 0;
    let vx: number, vx1: number, vy: number, vy1: number;
    let dv = 0, dvx = 0, dvy = 0;
    let x: number, y: number;
    let ShootingAngle = 0;
    let ZAngle = 0;
    let Step = 10;

    let quit = false;

    let vertex_keep = false;
    let yVertex = 0;
    let xVertex = 0;

    let minPbrRange = 0;
    let minPbrKeep = false;

    let maxPbrRange = 0;
    let maxPbrKeep = false;

    let tin100 = 0;

    let zero = -1;
    let fZero = 0;
    let zeroKeep = false, farZeroKeep = false, tinKeep = false;

    let Gx: number, Gy: number;

    while (!quit) {
        Gy = GRAVITY * Math.cos(convert(MeasureUnits.ANGLE, AngleUnits.DEGREE, AngleUnits.RADIAN, ShootingAngle + ZAngle));
        Gx = GRAVITY * Math.sin(convert(MeasureUnits.ANGLE, AngleUnits.DEGREE, AngleUnits.RADIAN, ShootingAngle + ZAngle));

        vx = initialVelocity * Math.cos(convert(MeasureUnits.ANGLE, AngleUnits.DEGREE, AngleUnits.RADIAN, ZAngle));
        vy = initialVelocity * Math.sin(convert(MeasureUnits.ANGLE, AngleUnits.DEGREE, AngleUnits.RADIAN, ZAngle));

        x = 0;
        y = -sightHeight / 12.0;

        minPbrKeep = false;
        maxPbrKeep = false;
        vertex_keep = false;

        tin100 = 0;
        tinKeep = false;
        zeroKeep = false;
        farZeroKeep = false;

        for (t = 0; ; t = t + dt) {
            vx1 = vx;
            vy1 = vy;
            v = Math.sqrt(vx * vx + vy * vy);
            dt = 0.5 / v;

            // Compute acceleration using the drag function retardation
            dv = calculateRetard(drag, dragCoefficient, v);
            dvx = -(vx / v) * dv;
            dvy = -(vy / v) * dv;

            // Compute velocity, including the resolved gravity vectors
            vx += dt * dvx + dt * Gx;
            vy += dt * dvy + dt * Gy;

            // Compute position based on average velocity
            x += dt * (vx + vx1) / 2.0;
            y += dt * (vy + vy1) / 2.0;

            if ((y > 0) && !zeroKeep && (vy >= 0)) {
                zero = x;
                zeroKeep = true;
            }

            if ((y < 0) && !farZeroKeep && (vy <= 0)) {
                fZero = x;
                farZeroKeep = true;
            }

            if ((12 * y > -(vitalSize / 2)) && !minPbrKeep) {
                minPbrRange = x;
                minPbrKeep = true;
            }

            if ((12 * y < -(vitalSize / 2)) && minPbrKeep && !maxPbrKeep) {
                maxPbrRange = x;
                maxPbrKeep = true;
            }

            if ((x >= 300) && !tinKeep) {
                tin100 = 100.0 * y * 12.0;
                tinKeep = true;
            }

            if (Math.abs(vy) > Math.abs(3 * vx)) {
                throw new Error("Velocity is wacky");
            }

            // The PBR will be maximum at the point where the vertex is 1/2 vital zone size
            if ((vy < 0) && !vertex_keep) {
                yVertex = y;
                xVertex = x;
                vertex_keep = true;
            }

            if (zeroKeep && farZeroKeep && minPbrKeep && maxPbrKeep && vertex_keep && tinKeep) {
                break;
            }
        }

        logger.debug(`yVertex ${yVertex}`);
        if ((yVertex * 12) > (vitalSize / 2.0)) {
            // Vertex too high. Go downwards.
            if (Step > 0) {
                Step = -Step / 2.0;
            }
        } else if ((yVertex * 12) <= (vitalSize / 2.0)) {
            // Vertex too low. Go upwards.
            if (Step < 0) {
                Step = -Step / 2.0;
            }
        }

        ZAngle += Step;

        if (Math.abs(Step) < (0.01 / 60)) {
            quit = true;
        }
    }

    result.nearZero = zero / 3;
    result.farZero = fZero / 3;
    result.minPointBlankRange = minPbrRange / 3;
    result.maxPointBlankRange = maxPbrRange / 3;
    // At 100 yards (in 100ths of an inch)
    result.sightInHeight = tin100 / 100;

    return result;
}