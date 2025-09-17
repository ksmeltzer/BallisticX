/**
 * Implementation of Greenhill's Rifling Formula
 * 
 * @see https://www.vcalc.com/wiki/Greenhill-Formula
 * @see https://en.wikipedia.org/wiki/Rifling
 * 
 */


/**
 * @function calculateTwist
 * @description Calculate the twist of the bullet
*
 * @param diameter @type number The bullet's diameter
 * @param length @type number The bullet's length
 * @param specificGravity @type number The bullet's specific gravity. Typical values:
 *           11.3 - lead
 *           8.9  - copper
 *           8.5  - brass
 *           7.8  - steel
 * @param muzzleVelocity An integer value used in place of knowing the bullet's velocity.
 *          For bullets up to 2800 ft/s 150 is a safe value. Beyond that most sources suggest 180.
 * 
 * @return The calculated twist as a number
 */

export function calculateTwist(diameter: number, length: number, specificGravity: number, muzzleVelocity: number): number {
    return (muzzleVelocity * Math.pow(diameter, 2) / length) * Math.sqrt(specificGravity / 10.9);
}