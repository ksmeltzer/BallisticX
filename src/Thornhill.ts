

     export class Thornhill {
        /**
         * Calculate barrel heat loss.
         *
         * @param D Bore diameter in inches.
         * @param Area Area of the bore in inches squared.
         * @param Hr Hydrodynamic roughness factor. Between 1.25 and 1.4.
         * @param Vol Total volume of the gun in inches cubed.
         * @param C Total charge in pounds.
         * @param GasTemp Gas temperature.
         * @return Barrel heat loss.
         */
        public static barrel_heat_loss(
            D: number,
            Area: number,
            Hr: number,
            Vol: number,
            C: number,
            GasTemp: number
        ): number {
            // maximum temperature in the barrel
            const T = (GasTemp - 300.0) / (1.7 + 0.38 * Math.pow(D, 0.5) * Math.pow(Math.pow(D, 2) / C, 0.86));

            return 0.397 * Math.pow(D, 1.5) * Vol / Area * T * Hr;
        }
    }