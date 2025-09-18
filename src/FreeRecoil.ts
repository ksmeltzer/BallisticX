import { convert, MassUnits, MeasureUnits } from "./util/MeasurementUnit.js";
import logger from "./util/Logger.js";
import { GRAVITY } from "./BallisticX.js";


/**
 * @function
 * @name calculateFreeRecoil
 * @description Calculate the free recoil energy of a firearm being fired.
 *
 * @param {number} projectileWeight Weight in grains of the ejecta (bullet, wad, etc.).
 * @param {number} projectileVelocity Velocity of the ejecta in feet per second.
 * @param {number} propellentWeight Weight of propellent in grains.
 * @param {number} propellentGasVelocity Velocity of propellent gases in feet per second.
 * @param {number} firearmWeight Weight of firearm in pounds.
 *
 * @return {number} The free recoil energy in ft-lb.
 */
export function calculateFreeRecoil(
    projectileWeight: number,
    projectileVelocity: number,
    propellentWeight: number,
    propellentGasVelocity: number,
    firearmWeight: number
): number {
    const M = (firearmWeight / (GRAVITY * 2));

    const V = (((projectileWeight * projectileVelocity) + (propellentWeight * propellentGasVelocity)) / convert(MeasureUnits.MASS, MassUnits.POUND, MassUnits.GRAIN, firearmWeight));

    logger.debug(`M: ${M}`);
    logger.debug(`V: ${V}`);

    return M * V * V;
}
