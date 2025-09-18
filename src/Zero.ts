import { DragFunction, GRAVITY } from "./BalisticX.js";
import { calculateRetard } from "./Retard.js";
import { AngleUnits, convert, MeasureUnits } from "./util/MeasurmentUnit.js";


        /**
         * @function 
         * @name zeroAngle
         * @description Determines the bore angle needed to achieve a target zero at Range yards (at standard conditions and on level ground.)
         *
         * @param {DragFunction} drag enum value
         * @param {number} dragCoefficient The coefficient of drag for the projectile
         * @param {number} vi The initial velocity of the projectile, in feet/s
         * @param {number} sightHeight The height of the sighting system above the bore centerline, in inches
         * @param {number} zeroRange The range in yards at which you wish the projectile to intersect yIntercept
         * @param {number} yIntercept The height, in inches, you wish for the projectile to be when it crosses ZeroRange yards
         * 
         * @returns {number} The angle of the bore relative to the sighting system, in degrees
         */
        export function zeroAngle(
            drag: DragFunction,
            dragCoefficient: number,
            vi: number,
            sightHeight: number,
            zeroRange: number,
            yIntercept: number
        ): number {
            // Numerical Integration variables
            let t = 0;
            let dt = 1 / vi;
            let y = -sightHeight / 12;
            let x = 0;
            let da = convert(MeasureUnits.ANGLE, AngleUnits.DEGREE, AngleUnits.RADIAN, 14);

            // State variables for each integration
            let v = 0, vx = 0, vy = 0;
            let vx1 = 0, vy1 = 0;
            let dv = 0, dvx = 0, dvy = 0;
            let Gx = 0, Gy = 0;

            let angle = 0;
            let quit = false;

            // Successive approximation loop
            for (angle = 0; !quit; angle = angle + da) {
                vy = vi * Math.sin(angle);
                vx = vi * Math.cos(angle);
                Gx = GRAVITY * Math.sin(angle);
                Gy = GRAVITY * Math.cos(angle);

                for (t = 0, x = 0, y = -sightHeight / 12; x <= zeroRange * 3; t = t + dt) {
                    vy1 = vy;
                    vx1 = vx;
                    v = Math.sqrt(vx * vx + vy * vy);
                    dt = 1 / v;

                    dv = calculateRetard(drag, dragCoefficient, v);
                    dvy = -dv * vy / v * dt;
                    dvx = -dv * vx / v * dt;

                    vy += (dvy + dt * Gy);
                    vx += (dvx + dt * Gx);

                    x += (dt * (vx + vx1) / 2);
                    y += (dt * (vy + vy1) / 2);

                    // Break early to save CPU time if we won't find a solution
                    if ((vy < 0) && (y < yIntercept)) {
                        break;
                    }

                    if (vy > 3 * vx) {
                        break;
                    }
                }

                if ((y > yIntercept) && (da > 0)) {
                    da = -da / 2;
                }

                if ((y < yIntercept) && (da < 0)) {
                    da = -da / 2;
                }

                // If our accuracy is sufficient, we can stop approximating
                if (Math.abs(da) < convert(MeasureUnits.ANGLE, AngleUnits.MOA, AngleUnits.RADIAN, 0.01)) {
                    quit = true;
                }

                // If we exceed the 45 degree launch angle, then the projectile just won't get there
                
                if (angle > convert(MeasureUnits.ANGLE, AngleUnits.DEGREE, AngleUnits.RADIAN, 45)) {
                    quit = true;
                }
            }

            // Convert to degrees for return value.
            return convert(MeasureUnits.ANGLE, AngleUnits.RADIAN, AngleUnits.DEGREE, angle);
        }