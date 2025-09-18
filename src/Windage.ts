
import { convert, MeasureUnits, AngleUnits } from "./util/MeasurementUnit.js";
import logger from "./util/Logger.js";



/**
 * @function
 * @name calculateWindage
 * @description Compute the windage deflection for a given crosswind speed, given flight time in a vacuum, and given flight time in real life.
 *
 * @param {number} windSpeed The wind velocity in mi/hr.
 * @param {number} initialVelocity The initial velocity of the projectile (muzzle velocity).
 * @param {number} rangeInFt The range at which you wish to determine windage, in feet.
 * @param {number} timeToRangeInSec The time it has taken the projectile to traverse the range x, in seconds.
 * 
 * @returns {number} The amount of windage correction, in inches, required to achieve zero on a target at the given range.
 */
export function calculateWindage(windSpeed: number, initialVelocity: number, rangeInFt: number, timeToRangeInSec: number): number {
    // Convert to inches per second
    const Vw = windSpeed * 17.60;
    logger.debug(`Vw: ${Vw}`);
    return Vw * (timeToRangeInSec - rangeInFt / initialVelocity);
}

/**
 * @function
 * @name headWind
 * @description Headwind is positive at WindAngle = 0
 * 
 * @param {number} windSpeed
 * @param {number} windAngle
 * @returns {number} HeadWind
 */
export function headWind(windSpeed: number, windAngle: number): number {
    const Wangle = convert(MeasureUnits.ANGLE, AngleUnits.DEGREE, AngleUnits.RADIAN, windAngle);
    const headwind = Math.cos(Wangle) * windSpeed;
    logger.debug(`Headwind: ${headwind}`);
    return headwind;
}

/**
 * @function
 * @name crossWind
 * @description Positive is from Shooter's Right to Left (Wind from 90 degree)
 *
 * @param {number} windSpeed The wind velocity, in mi/hr.
 * @param {number} windAngle The angle from which the wind is coming, in degrees.
 *                      0 degrees is from straight ahead
 *                      90 degrees is from right to left
 *                      180 degrees is from directly behind
 *                      270 or -90 degrees is from left to right
 * @returns {number} The crosswind velocity component, in mi/hr.
 */
export function crossWind(windSpeed: number, windAngle: number): number {
    const Wangle = convert(MeasureUnits.ANGLE, AngleUnits.DEGREE, AngleUnits.RADIAN, windAngle);
    const crosswind = Math.sin(Wangle) * windSpeed;
    logger.debug(`Crosswind: ${crosswind}`);
    return crosswind;
}
