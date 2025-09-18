/**
 * An implementation of the Miller twist rule

 */


/**
* @function calculateMillerTwist 
* @description Twist calculation based on Millers twist rules.
* 
* @param {number} diameter @default 1.0 The bullet's diameter
* @param {number} length @default 1.0 number The bullet's length
* @param {number} mass @default 1.0 The bullet's mass
* @param {number} safeValue @default 2 number The "safe value". Generally 2.
* 
* @return {number} The calculated twist
* 
* @see https://en.wikipedia.org/wiki/Miller_twist_rule
* @see https://www.vcalc.com/wiki/miller-twist-rule
*/
export function calculateMillerTwist(diameter: number = 1.0, length: number = 1.0, mass: number = 1.0, safeValue: number = 2): number {
    const temp1 = 30.0 * mass;
    const temp2 = safeValue * Math.pow(diameter, 3) * length * (1.0 + Math.pow(length, 2));

    return Math.sqrt(temp1 / temp2) * diameter;
}




/**
* @function calculateStability 
* @description the calculated stability bases off of Miller's twist rate rules.
* 
* @param {number} diameter @default 1.0 The bullet's diameter
* @param {number} length @default 1.0 number The bullet's length
* @param {number} mass @default 1.0 The bullet's mass
* @param {number} safeValue @default 2 number The "safe value". Generally 2.
* 
* @return {number} The calculated stability
*/
export function calculateStability(diameter: number = 1.0, length: number = 1.0, mass: number = 1.0, safeValue: number = 2): number {
    const temp1 = 30.0 * mass;
    const temp2 = Math.pow(calculateMillerTwist(diameter, length, mass, safeValue), 2) * Math.pow(diameter, 3) * length * (1.0 + Math.pow(length, 2));

    return temp1 / temp2;
}