import { convert, MeasureUnits, TempatureUnits } from "./util/MeasurmentUnit.js";
import logger from "./util/Logger.js";
import { STANDARD_PRESSURE, STANDARD_TEMPATURE } from "./BalisticX.js";

/**
 * @function
 * @name calculateRefraction
 * @description calculate the atmospheric standardized refraction
 *
 * @param {number} temperature
 * @param {number} pressure
 * @param {number} relativeHumidity
 *
 * @return {number} standardized refraction
 */
export function calculateRefraction(temperature: number, pressure: number, relativeHumidity: number): number {
    const VPw = 4e-6 * Math.pow(temperature, 3) - 0.0004 * Math.pow(temperature, 2) + 0.0234 * temperature - 0.2517;
    const FRH = 0.995 * (pressure / (pressure - (0.3783) * relativeHumidity * VPw));

    logger.debug(`Standardized Refraction: ${FRH}`);
    return FRH;
}


/**
 * 
* @function
 * @name calculateStandrdizedPressure
 * @description standerdized pressure calculation
 * 
 * @param {number} pressure
 *
 * @return {number} the pressure standardized pressure for atmospherics
 */
export function calculateStandrdizedPressure(pressure: number): number {
    const FP = (pressure - STANDARD_PRESSURE) / STANDARD_PRESSURE;

    logger.debug(`Standardized Pressure: ${FP}`);
    return FP;
}


/**
 * @function
 * @name calculateStanderdizedTemperature
 * @description Standard temperature at altitude using lapse rate
 * 
 * @param {number} tempature the current tempature
 * @param {number} altitude the current altitude
 *
 * @return {number} the standardized tempature adjusted via lapse rate.
 * 
 * @see http://en.wikipedia.org/wiki/Lapse_rate
 */
export function calculateStanderdizedTemperature(tempature: number, altitude: number): number {
    const Tstd = -0.0036 * altitude + STANDARD_TEMPATURE;

    // Divide by "standard temp" above converted to Rankine
    const FT = (tempature - Tstd) / convert(MeasureUnits.TEMPATURE, TempatureUnits.FAHRENHEIT, TempatureUnits.RANKINE, Tstd);

    logger.debug(`Standardized Temperature: ${FT}`);
    return FT;
}



/**
 * @function
 * @name calculateStandardizedAltitude
 * @description calculates standard altitude
 * 
 * @param {number} altitude the current altitude
 *
 * @return {number} the standardized altitude.
 * 
 */
export function calculateStandardizedAltitude(altitude: number): number {
    const fa = -4e-15 * Math.pow(altitude, 3) + 4e-10 * Math.pow(altitude, 2) - 3e-5 * altitude + 1;

    logger.debug(`Standardized altitude: ${1 / fa}`);
    return 1 / fa;
}



/**
 * @function
 * @name correctDragCoefficient
 * @description Corrects a "standard" Drag Coefficient for differing atmospheric conditions.
 * 
 * @param {number} dragCoefficient The coefficient of drag for a given projectile.
 * @param {number} altitude The altitude above sea level in feet.  Standard altitude is 0 feet above sea level.
 * @param {number} barometer The barometric pressure in inches of mercury (in Hg). Standard pressure is 29.53 in Hg.
 * @param {number} temperature The temperature in Fahrenheit.  Standard temperature is 59 degrees.
 * @param {number} relativeHumidity The relative humidity fraction.  Ranges from 0.00 to 1.00, with 0.50 being 50% relative humidity. Standard humidity is 78%
 *
 * @return {number} the corrected drag coefficient for supplied drag coefficient and atmospheric conditions.
 * 
 */
export function correctDragCoefficient(
    dragCoefficient: number,
    altitude: number,
    barometer: number,
    temperature: number,
    relativeHumidity: number
): number {
    const fAltitude = calculateStandardizedAltitude(altitude);
    const fTempature = calculateStanderdizedTemperature(temperature, altitude);
    const fRefraction = calculateRefraction(temperature, barometer, relativeHumidity);
    const fPressure = calculateStandrdizedPressure(barometer);

    // Calculate the atmospheric correction factor
    const correctedDrag = fAltitude * (1 + fTempature - fPressure) * fRefraction;

    logger.debug(`Calculated Atmospheric Correction Factor: ${correctedDrag}`);
    logger.debug(`Atmospheric Correction Factor * Drag: ${dragCoefficient * correctedDrag}`);

    return dragCoefficient * correctedDrag;
}