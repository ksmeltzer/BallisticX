/**
 * Implementation of Greengill's Rifling Formula
 * 
 * @see https://www.vcalc.com/wiki/Greenhill-Formula
 * @see https://en.wikipedia.org/wiki/Rifling
 * 
 */
     export class Greenhill {
        public muzzleVelocity: number;
        public diameter: number;
        public length: number;
        public specificGravity: number;

        /**
         * Full constructor
         *
         * @param diameter The bullet's diameter as a double
         * @param length The bullet's length as a double
         * @param specificGravity The bullet's specific gravity as a double. Typical values:
         *           11.3 - lead
         *           8.9  - copper
         *           8.5  - brass
         *           7.8  - steel
         * @param muzzleVelocity An integer value used in place of knowing the bullet's velocity.
         *          For bullets up to 2800 ft/s 150 is a safe value. Beyond that most sources suggest 180.
         */
        constructor(diameter: number, length: number, specGravity: number, muzzleVelocity: number) {
            this.diameter = diameter;
            this.length = length;
            this.specificGravity = specGravity;
            this.muzzleVelocity = muzzleVelocity;
        }

        /**
         * Calculate the twist of the bullet
         *
         * @return The calculated twist as a double
         */
        public calculateTwist(): number {
            return (this.muzzleVelocity * Math.pow(this.diameter, 2) / this.length) * Math.sqrt(this.specificGravity / 10.9);
        }
    }