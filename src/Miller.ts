/**
 * An implementation of the Miller twist rule
 * @see https://en.wikipedia.org/wiki/Miller_twist_rule
 * @see https://www.vcalc.com/wiki/miller-twist-rule
 */


          /**
         * @function calculateTwist 
         *
         * @param diameter @type number @default 1.0 The bullet's diameter
         * @param length @type @default 1.0 number The bullet's length
         * @param mass @type number @default 1.0 The bullet's mass
         * @param safeValue @type @default 2 number The "safe value". Generally 2.
         * 
         * @return @type number The calculated twist
         */
        export function calculateTwist(diameter: number = 1.0, length: number = 1.0, mass: number = 1.0, safeValue: number = 2): number {
            const temp1 = 30.0 * mass;
            const temp2 = safeValue * Math.pow(diameter, 3) * length * (1.0 + Math.pow(length, 2));

            return Math.sqrt(temp1 / temp2) * diameter;
        }


 

         /**
         * @function calculateStability 
         *
         * @param diameter @type number @default 1.0 The bullet's diameter
         * @param length @type @default 1.0 number The bullet's length
         * @param mass @type number @default 1.0 The bullet's mass
         * @param safeValue @type @default 2 number The "safe value". Generally 2.
         * 
         * @return @type number The calculated stability
         */
        export function calculateStability(diameter: number = 1.0, length: number = 1.0, mass: number = 1.0, safeValue: number = 2): number {
            const temp1 = 30.0 * mass;
            const temp2 = Math.pow(calculateTwist(diameter, length, mass, safeValue), 2) * Math.pow(diameter, 3) * length * (1.0 + Math.pow(length, 2));

            return temp1 / temp2;
        }