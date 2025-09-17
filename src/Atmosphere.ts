import { convert, MeasureUnits, TempatureUnits } from "./util/MeasurmentUnit.js";
import logger from "./util/Logger.js";

const STANDARD_PRESSURE = 29.53; // in Hg
const STANDARD_TEMP = 59; // Fahrenheit

    /**
     * Refraction
     *
     * @param Temperature
     * @param Pressure
     * @param RelativeHumidity
     *
     * @return Standardized refraction
     */
    export function calculateRefraction(Temperature: number, Pressure: number, RelativeHumidity: number): number {
        const VPw = 4e-6 * Math.pow(Temperature, 3) - 0.0004 * Math.pow(Temperature, 2) + 0.0234 * Temperature - 0.2517;
        const FRH = 0.995 * (Pressure / (Pressure - (0.3783) * RelativeHumidity * VPw));

        logger.debug(`Standardized Refraction: ${FRH}`);
        return FRH;
    }

    /**
     * Pressure
     *
     * @param Pressure
     *
     * @return Standardized pressure
     */
    export function calculateStandrdizedPressure(Pressure: number): number {
        const FP = (Pressure - STANDARD_PRESSURE) / STANDARD_PRESSURE;

        logger.debug(`Standardized Pressure: ${FP}`);
        return FP;
    }

    /**
     * Temperature
     *
     * @param Temp
     * @param Altitude
     *
     * @return Standardized temperature
     */
    export function calculateStanderdizedTemperature(Temp: number, Altitude: number): number {
        // Standard temperature at altitude using lapse rate
        // http://en.wikipedia.org/wiki/Lapse_rate
        const Tstd = -0.0036 * Altitude + STANDARD_TEMP;

        // Divide by "standard temp" above converted to Rankine
        const FT = (Temp - Tstd) / convert(MeasureUnits.TEMPATURE, TempatureUnits.FAHRENHEIT, TempatureUnits.RANKINE, Tstd);

        logger.debug(`Standardized Temperature: ${FT}`);
        return FT;
    }

    /**
     * Altitude
     *
     * @param Altitude
     *
     * @return Standardized altitude
     */
    export function calculateStandardizedAltitude(Altitude: number): number {
        const fa = -4e-15 * Math.pow(Altitude, 3) + 4e-10 * Math.pow(Altitude, 2) - 3e-5 * Altitude + 1;

        logger.debug(`Standardized altitude: ${1 / fa}`);
        return 1 / fa;
    }



    /**
     * Corrects a "standard" Drag Coefficient for differing atmospheric conditions.
     * Returns the corrected drag coefficient for supplied drag coefficient and atmospheric conditions.
     *
     * @param DragCoefficient The coefficient of drag for a given projectile.
     * @param Altitude The altitude above sea level in feet.  Standard altitude is 0 feet above sea level.
     * @param Barometer The barometric pressure in inches of mercury (in Hg). Standard pressure is 29.53 in Hg.
     * @param Temperature The temperature in Fahrenheit.  Standard temperature is 59 degrees.
     * @param RelativeHumidity The relative humidity fraction.  Ranges from 0.00 to 1.00, with 0.50 being 50% relative humidity.
     *                         Standard humidity is 78%
     *
     * @return The function returns a ballistic coefficient, corrected for the supplied atmospheric conditions.
     */
    export function correctDragCoefficient(
        DragCoefficient: number,
        Altitude: number,
        Barometer: number,
        Temperature: number,
        RelativeHumidity: number
    ): number {
        const FA = calculateStandardizedAltitude(Altitude);
        const FT = calculateStanderdizedTemperature(Temperature, Altitude);
        const FR = calculateRefraction(Temperature, Barometer, RelativeHumidity);
        const FP = calculateStandrdizedPressure(Barometer);

        // Calculate the atmospheric correction factor
        const CD = FA * (1 + FT - FP) * FR;

        logger.debug(`Calculated Atmospheric Correction Factor: ${CD}`);
        logger.debug(`Atmospheric Correction Factor * Drag: ${DragCoefficient * CD}`);

        return DragCoefficient * CD;
    }