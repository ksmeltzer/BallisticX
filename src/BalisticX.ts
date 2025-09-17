
/**
 * Gravity in feet per second squared
 * Value according to Wolfram Alpha
 */
export const GRAVITY = -32.1609;

/**
 * Standard Atmospheric Pressure in inches mercury
 * Value according to Wolfram Alpha
 */
export const STANDARD_PRESSURE = 29.92;

/**
 * Standard Temperature in degrees Fahrenheit
 * This value was determined by the US Ordnance Department as an
 * average value over a wide range of altitudes
 */
export const STANDARD_TEMP = 59.0;

/**
 * Arbitrary constant used to denote the max range
 * of calculations
 */
export const BCOMP_MAX_RANGE = 50001;

/**
 * When computing a ballistics solution this holds
 * all the values from each computation interval.
 */
export interface CompUnit {
    range: number;
    drop: number;
    correction: number;
    time: number;
    windage_in: number;
    windage_moa: number;
    velocity_com: number;
    horizontal_velocity: number;
    vertical_velocity: number;
}

/**
 * Return value for a PBR optimization results
 */
 export interface PointBlankRangeResult {
    near_zero: number;
    far_zero: number;
    min_pbr: number;
    max_pbr: number;
    sight_in_height: number;
}

/**
 * PropellentGasVelocity enum and helpers
 */
 export enum PropellentGasVelocity {
    hpr = 1,
    sal,
    slb,
    pr
}

 function propellentGasVelocityToString(val: PropellentGasVelocity): string {
    switch (val) {
        case PropellentGasVelocity.hpr: return "High powered rifle";
        case PropellentGasVelocity.sal: return "Shotgun - average length";
        case PropellentGasVelocity.slb: return "Shotgun - long barrel";
        case PropellentGasVelocity.pr: return "Pistol & revolers";
        default: throw new Error("Invalid PropellentGasVelocity");
    }
}

 function propellentGasVelocityToDouble(val: PropellentGasVelocity): number {
    switch (val) {
        case PropellentGasVelocity.hpr: return 1.75;
        case PropellentGasVelocity.sal: return 1.50;
        case PropellentGasVelocity.slb: return 1.25;
        case PropellentGasVelocity.pr: return 1.50;
        default: throw new Error("Invalid PropellentGasVelocity");
    }
}

/**
 * The different drag functions you are allowed to pick from
 */
 export enum DragFunction {
    G1 = 1,
    G2,
    G3,
    G4,
    G5,
    G6,
    G7,
    G8,
    I,
    B
}

 function dragFunctionToString(val: DragFunction): string {
    switch (val) {
        case DragFunction.G1: return "G1";
        case DragFunction.G2: return "G2";
        case DragFunction.G3: return "G3";
        case DragFunction.G4: return "G4";
        case DragFunction.G5: return "G5";
        case DragFunction.G6: return "G6";
        case DragFunction.G7: return "G7";
        case DragFunction.G8: return "G8";
        case DragFunction.I: return "Ingalls";
        case DragFunction.B: return "British";
        default: throw new Error("Invalid DragFunction");
    }
}