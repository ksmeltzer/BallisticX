import { AngleUnits, convert, MeasureUnits } from "./util/MeasurmentUnit.js";
import type { PointBlankRangeResult } from "./BalisticX.js";
import { DragFunction, GRAVITY } from "./BalisticX.js";
import { Retard } from "./Retard.js";
import logger from "./util/Logger.js";


     class PointBlankRange {
        /**
         * Solves for the maximum Point Blank Range (PBR) and associated details
         *
         * @param Drag The drag function you wish to use for the solution (G1, G2, G3, etc.)
         * @param DragCoefficient The coefficient of drag for the projectile you wish to model.
         * @param Vi The projectile initial velocity.
         * @param SightHeight The height of the sighting system above the bore centerline.
         * @param VitalSize Size in inches of the target at which the point of impact must remain in.
         *
         * @return A PbrResult object containing our five results.
         */
        public static pbr(
            Drag: DragFunction,
            DragCoefficient: number,
            Vi: number,
            SightHeight: number,
            VitalSize: number
        ): PointBlankRangeResult {
            const result: PointBlankRangeResult = {
                near_zero: 0,
                far_zero: 0,
                min_pbr: 0,
                max_pbr: 0,
                sight_in_height: 0
            };

            let t = 0;
            let dt = 0.5 / Vi;
            let v = 0;
            let vx: number, vx1: number, vy: number, vy1: number;
            let dv = 0, dvx = 0, dvy = 0;
            let x: number, y: number;
            let ShootingAngle = 0;
            let ZAngle = 0;
            let Step = 10;

            let quit = false;

            let vertex_keep = false;
            let y_vertex = 0;
            let x_vertex = 0;

            let min_pbr_range = 0;
            let min_pbr_keep = false;

            let max_pbr_range = 0;
            let max_pbr_keep = false;

            let tin100 = 0;

            let zero = -1;
            let farzero = 0;
            let zero_keep = false, farzero_keep = false, tinkeep = false;

            let Gx: number, Gy: number;

            while (!quit) {
                Gy = GRAVITY * Math.cos(convert(MeasureUnits.ANGLE, AngleUnits.DEGREE, AngleUnits.RADIAN, ShootingAngle + ZAngle));
                Gx = GRAVITY * Math.sin(convert(MeasureUnits.ANGLE, AngleUnits.DEGREE, AngleUnits.RADIAN, ShootingAngle + ZAngle));

                vx = Vi * Math.cos(convert(MeasureUnits.ANGLE, AngleUnits.DEGREE, AngleUnits.RADIAN, ZAngle));
                vy = Vi * Math.sin(convert(MeasureUnits.ANGLE, AngleUnits.DEGREE, AngleUnits.RADIAN, ZAngle));

                x = 0;
                y = -SightHeight / 12.0;

                min_pbr_keep = false;
                max_pbr_keep = false;
                vertex_keep = false;

                tin100 = 0;
                tinkeep = false;
                zero_keep = false;
                farzero_keep = false;

                for (t = 0; ; t = t + dt) {
                    vx1 = vx;
                    vy1 = vy;
                    v = Math.sqrt(vx * vx + vy * vy);
                    dt = 0.5 / v;

                    // Compute acceleration using the drag function retardation
                    dv = Retard.CalcRetard(Drag, DragCoefficient, v);
                    dvx = -(vx / v) * dv;
                    dvy = -(vy / v) * dv;

                    // Compute velocity, including the resolved gravity vectors
                    vx += dt * dvx + dt * Gx;
                    vy += dt * dvy + dt * Gy;

                    // Compute position based on average velocity
                    x += dt * (vx + vx1) / 2.0;
                    y += dt * (vy + vy1) / 2.0;

                    if ((y > 0) && !zero_keep && (vy >= 0)) {
                        zero = x;
                        zero_keep = true;
                    }

                    if ((y < 0) && !farzero_keep && (vy <= 0)) {
                        farzero = x;
                        farzero_keep = true;
                    }

                    if ((12 * y > -(VitalSize / 2)) && !min_pbr_keep) {
                        min_pbr_range = x;
                        min_pbr_keep = true;
                    }

                    if ((12 * y < -(VitalSize / 2)) && min_pbr_keep && !max_pbr_keep) {
                        max_pbr_range = x;
                        max_pbr_keep = true;
                    }

                    if ((x >= 300) && !tinkeep) {
                        tin100 = 100.0 * y * 12.0;
                        tinkeep = true;
                    }

                    if (Math.abs(vy) > Math.abs(3 * vx)) {
                        // FIXME this should produce an error
                        break;
                    }

                    // The PBR will be maximum at the point where the vertex is 1/2 vital zone size
                    if ((vy < 0) && !vertex_keep) {
                        y_vertex = y;
                        x_vertex = x;
                        vertex_keep = true;
                    }

                    if (zero_keep && farzero_keep && min_pbr_keep && max_pbr_keep && vertex_keep && tinkeep) {
                        break;
                    }
                }

                logger.debug(`y_vertex ${y_vertex}`);
                if ((y_vertex * 12) > (VitalSize / 2.0)) {
                    // Vertex too high. Go downwards.
                    if (Step > 0) {
                        Step = -Step / 2.0;
                    }
                } else if ((y_vertex * 12) <= (VitalSize / 2.0)) {
                    // Vertex too low. Go upwards.
                    if (Step < 0) {
                        Step = -Step / 2.0;
                    }
                }

                ZAngle += Step;

                if (Math.abs(Step) < (0.01 / 60)) {
                    quit = true;
                }
            }

            result.near_zero = zero / 3;
            result.far_zero = farzero / 3;
            result.min_pbr = min_pbr_range / 3;
            result.max_pbr = max_pbr_range / 3;
            // At 100 yards (in 100ths of an inch)
            result.sight_in_height = tin100 / 100;

            return result;
        }
    }