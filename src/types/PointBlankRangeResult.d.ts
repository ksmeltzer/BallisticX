/**
 * @interface
 * @name PointBlankRangeResult
 * @description Results from point-blank range optimization calculation, containing the optimal zero distances, effective range boundaries, and sight-in height that provide the maximum flat-shooting performance.
 */
 export interface PointBlankRangeResult {
    nearZero: number;
    farZero: number;
    minPointBlankRange: number;
    maxPointBlankRange: number;
    sightInHeight: number;
}