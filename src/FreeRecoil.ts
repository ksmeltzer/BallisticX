import { convert, MassUnits, MeasureUnits } from "./util/MeasurmentUnit.js";
import logger from "./util/Logger.js";
import { GRAVITY } from "./BalisticX.js";


        /**
         * Calculate the free recoil energy of a firearm being fired.
         *
         * @param EjectaWeight Weight in grains of the ejecta (bullet, wad, etc.).
         * @param EjectaVelocity Velocity of the ejecta in feet per second.
         * @param PropellentWeight Weight of propellent in grains.
         * @param PropellentGasVelocity Velocity of propellent gases in feet per second.
         * @param FirearmWeight Weight of firearm in pounds.
         *
         * @return The free recoil energy in ft-lb.
         */
        export function calculateFreeRecoil(
            EjectaWeight: number,
            EjectaVelocity: number,
            PropellentWeight: number,
            PropellentGasVelocity: number,
            FirearmWeight: number
        ): number {
            const M = (FirearmWeight / (GRAVITY * 2));
            
            const V = (((EjectaWeight * EjectaVelocity) + (PropellentWeight * PropellentGasVelocity)) / convert(MeasureUnits.MASS, MassUnits.POUND, MassUnits.GRAIN, FirearmWeight));

            logger.debug(`M: ${M}`);
            logger.debug(`V: ${V}`);

            return M * V * V;
        }
