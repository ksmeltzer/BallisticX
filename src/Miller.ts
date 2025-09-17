/**
 * An implementation of the Miller twist rule
 * @see https://en.wikipedia.org/wiki/Miller_twist_rule
 * @see https://www.vcalc.com/wiki/miller-twist-rule
 */
     export class Miller {
        public diameter: number = 1.0;
        public length: number = 1.0;
        public mass: number = 1.0;
        public safeValue: number = 2;


        /**
         * Full constructor
         *
         * @param diameter The bullet's diameter as a double
         * @param length The bullet's length as a double
         * @param mass The bullet's mass as a double
         * @param safeValue The "safe value". Generally 2.
         */
        constructor(diameter: number, length: number, mass: number, safeValue: number) {

            this.diameter = diameter;
            this.length = length;
            this.mass = mass;
            this.safeValue = safeValue;

        }

        /**
         * Calculate bullet twist rate
         *
         * @return The calculated twist as a double
         */
        public calculateTwist(): number {
            const temp1 = 30.0 * this.mass;
            const temp2 = this.safeValue * Math.pow(this.diameter, 3) * this.length * (1.0 + Math.pow(this.length, 2));

            return Math.sqrt(temp1 / temp2) * this.diameter;
        }

        /**
         * Calculate bullet stability
         *
         * @return The calculated stability as a double
         */
        public calculateStability(): number {
            const temp1 = 30.0 * this.mass;
            const temp2 = Math.pow(this.calculateTwist(), 2) * Math.pow(this.diameter, 3) * this.length * (1.0 + Math.pow(this.length, 2));

            return temp1 / temp2;
        }
    }