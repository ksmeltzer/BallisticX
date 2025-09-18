

import type { BallisticComputationUnit } from "./BallisticX.js";
import { DragFunction, GRAVITY, BALLISTIC_COMPENSATION_MAX_RANGE } from "./BallisticX.js";
import { Windage } from "./Windage.js";
import logger from "./util/Logger.js";
import { convert, MeasureUnits, AngleUnits } from "./util/MeasurementUnit.js";


/**
 * @function
 * @name solveAll
 * @description Generate a ballistic solution table in 1 yard increments, up to BALLISTIC_COMPENSATION_MAX_RANGE.
 *
 * @param {DragFunction} drag DragFunction enum value
 * @param {number} dragCoefficient The coefficient of drag for the projectile
 * @param {number} initialVelocity The projectile's initial velocity
 * @param {number} sightHeight Height of the sighting system above the bore centerline
 * @param {number} shootingAngle Uphill or downhill shooting angle in degrees
 * @param {number} zeroAngle Angle of the sighting system relative to the bore in degrees
 * @param {number} windSpeed Wind velocity in miles per hour
 * @param {number} windAngle Angle at which the wind is approaching from, in degrees
 * @param {number} zero The range in yards away from the muzzle at which the rifle is zeroed
 * @return An array of CompUnit objects calculated over the entire estimated range
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
    zero: number
): Array<BallisticComputationUnit> {
    let t = 0;
    let dt = 0.5 / initialVelocity;
    let v = 0;
    let vx = 0, vx1 = 0, vy = 0, vy1 = 0;
    let dv = 0, dvx = 0, dvy = 0;
    let x = 0, y = 0;

    const headwind = Windage.HeadWind(windSpeed, windAngle);
    const crosswind = Windage.CrossWind(windSpeed, windAngle);

    const Gy = GRAVITY * Math.cos(convert(MeasureUnits.ANGLE, AngleUnits.DEGREE, AngleUnits.RADIAN, shootingAngle + zeroAngle));
    const Gx = GRAVITY * Math.sin(convert(MeasureUnits.ANGLE, AngleUnits.DEGREE, AngleUnits.RADIAN, shootingAngle + zeroAngle));

    logger.debug(`Gy: ${Gy}`);
    logger.debug(`Gx: ${Gx}`);

    vx = initialVelocity * Math.cos(convert(MeasureUnits.ANGLE, AngleUnits.DEGREE, AngleUnits.RADIAN, zeroAngle));
    vy = initialVelocity * Math.sin(convert(MeasureUnits.ANGLE, AngleUnits.DEGREE, AngleUnits.RADIAN, zeroAngle));
    logger.debug(`vx: ${vx}`);
    logger.debug(`vy: ${vy}`);

    y = -sightHeight / 12;
    logger.debug(`y: ${y}`);

    const solution: Array<BallisticComputationUnit> = [];
    let n = 0;
    for (t = 0; ; t = t + dt) {
        vx1 = vx;
        vy1 = vy;
        v = Math.sqrt(vx * vx + vy * vy);
        dt = 0.5 / v;

        // Compute acceleration using the drag function retardation
        dv = Retard.CalcRetard(drag, dragCoefficient, v + headwind * 5280.0 / 3600.0);
        dvx = -(vx / v) * dv;
        dvy = -(vy / v) * dv;

        // Compute velocity, including the resolved gravity vectors
        vx += dt * dvx + dt * Gx;
        vy += dt * dvy + dt * Gy;

        if (x / 3 >= n) {
            const wind_tmp = Windage.CalcWindage(crosswind, initialVelocity, x, t + dt);
            const unit: BallisticComputationUnit = {
                range: x / 3,
                drop: y * 12,
                correction: - convert(MeasureUnits.ANGLE, AngleUnits.RADIAN, AngleUnits.MOA, Math.atan(y / x)),
                time: t + dt,
                windageIn: wind_tmp,
                windageMOA: convert(MeasureUnits.ANGLE, AngleUnits.RADIAN, AngleUnits.MOA, Math.atan(wind_tmp / (12 * x))),
                velocityCompensated: v,
                horizontalVelocity: vx,
                verticalVelocity: vy
            };

            solution.push(unit);
            n++;
        }

        // Compute position based on average velocity
        x = x + dt * (vx + vx1) / 2;
        y = y + dt * (vy + vy1) / 2;
        logger.debug(`Updated Position x: ${x}`);
        logger.debug(`Updated Position y: ${y}`);

        if (Math.abs(vy) > Math.abs(3 * vx)) {
            break;
        }

        if (n >= BALLISTIC_COMPENSATION_MAX_RANGE + 1) {
            logger.debug("Reached max range for calculation");
            break;
        }
    }

    return solution;
}