import { convert, MeasureUnits, TemperatureUnits } from "./util/MeasurementUnit.js";
import logger from "./util/Logger.js";
import { STANDARD_PRESSURE, STANDARD_TEMPERATURE } from "./BallisticX.js"
import { err, ok, Ok, type Result } from "neverthrow";

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
 * @name calculateStandardizedPressure
 * @description standardized pressure calculation
 * 
 * @param {number} pressure
 *
 * @return {number} the pressure standardized pressure for atmospherics
 */
export function calculateStandardizedPressure(pressure: number): number {
    const FP = (pressure - STANDARD_PRESSURE) / STANDARD_PRESSURE;

    logger.debug(`Standardized Pressure: ${FP}`);
    return FP;
}


/**
 * @function
 * @name calculateStandardizedTemperature
 * @description Standard temperature at altitude using lapse rate
 * 
 * @param {number} temperature the current temperature
 * @param {number} altitude the current altitude
 *
 * @return {number} the standardized temperature adjusted via lapse rate.
 * 
 * @see http://en.wikipedia.org/wiki/Lapse_rate
 */
export function calculateStandardizedTemperature(temperature: number, altitude: number): Result<number, Error> {
    const tstd = -0.0036 * altitude + STANDARD_TEMPERATURE;

    // Divide by "standard temp" above converted to Rankine
    const result = convert(MeasureUnits.TEMPERATURE, TemperatureUnits.FAHRENHEIT, TemperatureUnits.RANKINE, tstd);
)
    if(result.isOk()) {
        const value = result.value
        const FT = (temperature - tstd) / value;
        logger.debug(`Standardized Temperature: ${FT}`);
        return ok(FT);
    }
    else {
        const value = result.error;
        const e = new Error("Measurement conversion error", { cause: err });
        return err(e);

    }
    
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
    const fTemperature = calculateStandardizedTemperature(temperature, altitude);
    const fRefraction = calculateRefraction(temperature, barometer, relativeHumidity);
    const fPressure = calculateStandardizedPressure(barometer);

    // Calculate the atmospheric correction factor
    const correctedDrag = fAltitude * (1 + fTemperature - fPressure) * fRefraction;

    logger.debug(`Calculated Atmospheric Correction Factor: ${correctedDrag}`);
    logger.debug(`Atmospheric Correction Factor * Drag: ${dragCoefficient * correctedDrag}`);

    return dragCoefficient * correctedDrag;
}