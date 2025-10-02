/**
 * @interface
 * @name PointBlankRangeResult
 * @description Results from point-blank range optimization calculation, containing the optimal zero distances, effective range boundaries, and sight-in height that provide the maximum flat-shooting performance.
 * @property {number} nearZero - distance (yd) where projectile first crosses line-of-sight.
 * @property {number} farZero - distance (yd) where projectile crosses line-of-sight again.
 * @property {number} minPointBlankRange - closest distance (yd) where impact is inside the vital zone.
 * @property {number} maxPointBlankRange - farthest distance (yd) where impact remains inside the vital zone.
 * @property {number} sightInHeight - sight-in offset (inches) at 100 yards.
 */
export interface PointBlankRangeResult {
    nearZero: number;
    farZero: number;
    minPointBlankRange: number;
    maxPointBlankRange: number;
    sightInHeight: number;
}