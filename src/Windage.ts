
import { convert, MeasureUnits, AngleUnits } from "./util/MeasurmentUnit.js";
import logger from "./util/Logger.js";


    export class Windage {
        /**
         * Compute the windage deflection for a given crosswind speed,
         * given flight time in a vacuum, and given flight time in real life.
         *
         * @param WindSpeed The wind velocity in mi/hr.
         * @param Vi The initial velocity of the projectile (muzzle velocity).
         * @param xx The range at which you wish to determine windage, in feet.
         * @param t The time it has taken the projectile to traverse the range x, in seconds.
         * @return The amount of windage correction, in inches, required to achieve zero on a target at the given range.
         */
        public static CalcWindage(WindSpeed: number, Vi: number, xx: number, t: number): number {
            // Convert to inches per second
            const Vw = WindSpeed * 17.60;
            logger.debug(`Vw: ${Vw}`);
            return Vw * (t - xx / Vi);
        }

        /**
         * Headwind is positive at WindAngle = 0
         * @param WindSpeed
         * @param WindAngle
         * @return HeadWind
         */
        public static HeadWind(WindSpeed: number, WindAngle: number): number {
            const Wangle = convert(MeasureUnits.ANGLE, AngleUnits.DEGREE, AngleUnits.RADIAN, WindAngle);
            const headwind = Math.cos(Wangle) * WindSpeed;
            logger.debug(`Headwind: ${headwind}`);
            return headwind;
        }

        /**
         * Positive is from Shooter's Right to Left (Wind from 90 degree)
         *
         * @param WindSpeed The wind velocity, in mi/hr.
         * @param WindAngle The angle from which the wind is coming, in degrees.
         *                      0 degrees is from straight ahead
         *                      90 degrees is from right to left
         *                      180 degrees is from directly behind
         *                      270 or -90 degrees is from left to right
         * @return The crosswind velocity component, in mi/hr.
         */
        public static CrossWind(WindSpeed: number, WindAngle: number): number {
            const Wangle = convert(MeasureUnits.ANGLE, AngleUnits.DEGREE, AngleUnits.RADIAN, WindAngle);
            const crosswind = Math.sin(Wangle) * WindSpeed;
            logger.debug(`Crosswind: ${crosswind}`);
            return crosswind;
        }
    }