/**
 * @interface
 * @name DragCoefficient
 * @description represents a velocity threshold with its corresponding A and M constants for the drag equation, for the G model.
 * 
 * @see {@link https://en.wikipedia.org/wiki/Ballistic_coefficient | Ballistic Coefficient}
 */
export interface DragCoefficient {
    velocityThreshold: number; // in ft/s
    A: number;
    M: number;
}