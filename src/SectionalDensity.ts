
import { convert, MassUnits, MeasureUnits } from "./util/MeasurmentUnit.js";

        /**
         * Calculate the sectional density of bullet.
         *
         * @param Weight Weight in grains of the bullet. Ex. 250
         * @param Diameter Diameter of the bullet in inches. Ex. .338
         *
         * @return The sectional density of a bullet.
         */
        export function calculateSectionalDensity(Weight: number, Diameter: number): number {
            return convert(MeasureUnits.MASS, MassUnits.GRAIN, MassUnits.POUND, Weight) / Math.pow(Diameter, 2);
        }