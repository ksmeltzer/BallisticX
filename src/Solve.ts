

import type { CompUnit } from "./BalisticX.js";
import { DragFunction, GRAVITY, BCOMP_MAX_RANGE } from "./BalisticX.js";
import { Windage } from "./Windage.js";
import { Retard } from "./Retard.js"
import logger from "./util/Logger.js";
import { convert, MeasureUnits, AngleUnits } from "./util/MeasurmentUnit.js";

// This was originally part of the GNU Exterior Ballistics Computer.

     class Solve {
        /**
         * Generate a ballistic solution table in 1 yard increments, up to BCOMP_MAX_RANGE.
         *
         * @param drag DragFunction enum value
         * @param DragCoefficient The coefficient of drag for the projectile
         * @param Vi The projectile's initial velocity
         * @param SightHeight Height of the sighting system above the bore centerline
         * @param ShootingAngle Uphill or downhill shooting angle in degrees
         * @param ZeroAngle Angle of the sighting system relative to the bore in degrees
         * @param WindSpeed Wind velocity in miles per hour
         * @param WindAngle Angle at which the wind is approaching from, in degrees
         * @param Zero The range in yards away from the muzzle at which the rifle is zeroed
         * @return An array of CompUnit objects calculated over the entire estimated range
         */
        public static SolveAll(
            drag: DragFunction,
            DragCoefficient: number,
            Vi: number,
            SightHeight: number,
            ShootingAngle: number,
            ZeroAngle: number,
            WindSpeed: number,
            WindAngle: number,
            Zero: number
        ): Array<CompUnit> {
            let t = 0;
            let dt = 0.5 / Vi;
            let v = 0;
            let vx = 0, vx1 = 0, vy = 0, vy1 = 0;
            let dv = 0, dvx = 0, dvy = 0;
            let x = 0, y = 0;

            const headwind = Windage.HeadWind(WindSpeed, WindAngle);
            const crosswind = Windage.CrossWind(WindSpeed, WindAngle);

            const Gy = GRAVITY * Math.cos(convert(MeasureUnits.ANGLE, AngleUnits.DEGREE, AngleUnits.RADIAN, ShootingAngle + ZeroAngle));
            const Gx = GRAVITY * Math.sin(convert(MeasureUnits.ANGLE, AngleUnits.DEGREE, AngleUnits.RADIAN, ShootingAngle + ZeroAngle));

            logger.debug(`Gy: ${Gy}`);
            logger.debug(`Gx: ${Gx}`);

            vx = Vi * Math.cos(convert(MeasureUnits.ANGLE, AngleUnits.DEGREE, AngleUnits.RADIAN, ZeroAngle));
            vy = Vi * Math.sin(convert(MeasureUnits.ANGLE, AngleUnits.DEGREE, AngleUnits.RADIAN, ZeroAngle));
            logger.debug(`vx: ${vx}`);
            logger.debug(`vy: ${vy}`);

            y = -SightHeight / 12;
            logger.debug(`y: ${y}`);

            const solution: Array<CompUnit> = [];
            let n = 0;
            for (t = 0; ; t = t + dt) {
                vx1 = vx;
                vy1 = vy;
                v = Math.sqrt(vx * vx + vy * vy);
                dt = 0.5 / v;

                // Compute acceleration using the drag function retardation
                dv = Retard.CalcRetard(drag, DragCoefficient, v + headwind * 5280.0 / 3600.0);
                dvx = -(vx / v) * dv;
                dvy = -(vy / v) * dv;

                // Compute velocity, including the resolved gravity vectors
                vx += dt * dvx + dt * Gx;
                vy += dt * dvy + dt * Gy;

                if (x / 3 >= n) {
                    const wind_tmp = Windage.CalcWindage(crosswind, Vi, x, t + dt);
                    const unit: CompUnit = {
                        range: x / 3,
                        drop: y * 12,
                        correction: - convert(MeasureUnits.ANGLE, AngleUnits.RADIAN, AngleUnits.MOA, Math.atan(y / x)),
                        time: t + dt,
                        windage_in: wind_tmp,
                        windage_moa: convert(MeasureUnits.ANGLE, AngleUnits.RADIAN, AngleUnits.MOA, Math.atan(wind_tmp / (12 * x))),
                        velocity_com: v,
                        horizontal_velocity: vx,
                        vertical_velocity: vy
                    };

                    solution.push(unit);
                    n++;
                }

                // Compute position based on average velocity
                x = x + dt * (vx + vx1) / 2;
                y = y + dt * (vy + vy1) / 2;
                logger.debug(`Updated Position x: ${x}`);
                logger.debug(`Updated Position y: ${y}`);

                if (Math.abs(vy) > Math.abs(3 * vx)) {
                    break;
                }

                if (n >= BCOMP_MAX_RANGE + 1) {
                    logger.debug("Reached max range for calculation");
                    break;
                }
            }

            return solution;
        }
    }