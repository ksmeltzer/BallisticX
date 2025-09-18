/**
 * @constant
 * @name GRAVITY
 * @type {number}
 * @default -32.1609
 * @description Gravity in feet per second squared, per: Wolfram Alpha
 */
export const GRAVITY: number = -32.1609;


/**
 * @constant {number} 
 * @name STANDARD_PRESSURE
 * @type {number}
 * @default 29.92
 * @description Standard Atmospheric Pressure in inches mercury, per: Wolfram Alpha
 */
export const STANDARD_PRESSURE: number = 29.92;


/**
 * @constant
 * @name STANDARD_TEMPERATURE
 * @type {number}
 * @default 59.0
 * @description Standard Temperature in degrees Fahrenheit, per: the US Ordnance Department as an average value over a wide range of altitudes
 */
export const STANDARD_TEMPERATURE: number = 59.0;


/**
 * @constant
 * @name BALLISTIC_COMPENSATION_MAX_RANGE
 * @type {number}
 * @default 50001
 * @description All good thing's have to come to an end, so this is a cutoff to the max range in yards that the system will calculate to. I saw it in another library and figured it is far enough.
 */
export const BALLISTIC_COMPENSATION_MAX_RANGE: number = 50001;


/**
 * @enum {number}
 * @name PropellentGasVelocity
 * @description enum for standard propellent and their associated average velocities.
 */
export enum PropellentGasVelocity {
    HIGH_POWER_RIFLE = 1.75,
    SHOTGUN = 1.50,
    SHOTGUN_LONG = 1.25,
    HANDGUN = 1.50
}


/**
 * @enum {string}
 * @name DragFunction
 * @description drag function names.
 */
export enum DragFunction {
    G1 = "G1",
    G2 = "G2",
    G3 = "G3",
    G4 = "G4",
    G5 = "G5",
    G6 = "G6",
    G7 = "G7",
    G8 = "G8",
    I = "Ingalls",
    B = "British"
}

/**
 * @enum {number}
 * @name BulletSpecificGravity
 * @description Common values for the specific gravity of bullet materials.
 */
export enum BulletSpecificGravity {
    LEAD = 11.3,
    COPPER = 8.9,
    BRASS = 8.5,
    STEEL = 7.8
}
