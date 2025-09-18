import type { BulletSpecificGravity } from "./BallisticX.js";


/**
 * @function 
 * @name calculateGreenhillTwist
 * @description Calculate the twist of the bullet, via Greenhill's Rifling Formula
*
 * @param {number} diameter The bullet's diameter
 * @param {number} length The bullet's length
 * @param {BulletSpecificGravity | number} specificGravity The bullet's specific gravity.
 * @param muzzleVelocity An integer value used in place of knowing the bullet's velocity. Bullets up to 2800 ft/s use 150. For higher velocities use 180.
 * 
 * @return {number} The calculated twist via Greenhill's formula
 * 
 * @see https://www.vcalc.com/wiki/Greenhill-Formula
 */

export function calculateGreenhillTwist(diameter: number, length: number, specificGravity: BulletSpecificGravity | number, muzzleVelocity: number): number {
    return (muzzleVelocity * Math.pow(diameter, 2) / length) * Math.sqrt(specificGravity / 10.9);
}