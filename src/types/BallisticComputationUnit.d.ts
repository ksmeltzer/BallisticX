/**
 * @interface
 * @name BallisticComputationUnit
 * @description Contains all calculated ballistic values for a projectile at a given range: trajectory properties (drop, velocity, time) and scope/sight corrections (elevation and windage) needed to hit the target.
 */
export interface BallisticComputationUnit {
    range: number;
    drop: number;
    correction: number;
    time: number;
    windageInches: number;
    windageMOA: number;
    velocityCompensated: number;
    horizontalVelocity: number;
    verticalVelocity: number;
}