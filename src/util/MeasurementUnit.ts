import * as Temperature from 'temperature-util';
import {
    ok,
    err,
    Result,

} from 'neverthrow';


/**
 * NOTICE: 
 * This entire measurement converter util is a very rough implementation of an idea I had mid project where I could built a very extensible measurement converter, that can convert any compatible units to and fro. This is very much rough and hard-coded, and eventually this whole util will be removed from this project and moved into it’s own npm library. 
 * The idea is that arbitrary unit translators could be built in json or code and injected into the measurement converter. To support things as vast as say converting DnD D20 rules to other systems and vice versa. Eventually it will be expanded via generics to even allow for custom objects to be returned for more complex conversions.
 * As well the idea is to utilize a combination of AJV, TS-Morph the TS AST to create a generator that will generate hard implementation interface functions for the conversions. I am well aware that using enums and associative arrays in loose parameters is not an idea API, that is not the focus of this project and it suffices for now. I implemented this way for now to flesh out the rough idea. This is not completed code nor will the solution look anything like it when it was done. 
 */



interface IUnitConverter {
    (val: number): number;
}

export enum MeasureUnits {
    ANGLE = "ANGLE",
    MASS = "MASS",
    TEMPERATURE = "TEMPERATURE"
}

const measures: Record<string, Record<string, Record<string, IUnitConverter>>> = {};

export const convert = (measure: string, fromUnit: string, toUnit: string, amount: number): Result<number, Error> => {
    const m = measures[measure];
    if (m) {
        const from = m[fromUnit];
        if (from && from[toUnit]) {
            const calcFunc: IUnitConverter = from[toUnit];
            return ok(calcFunc(amount));
        }
        const e = new Error("fromUnit not found in dictionary of units.")
        return err(e);
    }
    const e = new Error("fromUnit not found in dictionary of units.")
    return err(e);
}

export const addConverter = (measure: string, fromUnit: string, toUnit: string, formula: IUnitConverter) => {
    if (!measures[measure]) {
        measures[measure] = {};
    }
    if (!measures[measure][fromUnit]) {
        measures[measure][fromUnit] = {};
    }
    measures[measure][fromUnit][toUnit] = formula;
}



export enum AngleUnits {
    DEGREE = "DEGREE",
    MOA = "MOA",
    RADIAN = "RADIAN",
}


addConverter(MeasureUnits.ANGLE, AngleUnits.DEGREE, AngleUnits.MOA, (val: number) => {
    return val * 60;
});

addConverter(MeasureUnits.ANGLE, AngleUnits.DEGREE, AngleUnits.RADIAN, (val: number) => {
    return val * Math.PI / 180;
});

addConverter(MeasureUnits.ANGLE, AngleUnits.MOA, AngleUnits.DEGREE, (val: number) => {
    return val / 60;
});

addConverter(MeasureUnits.ANGLE, AngleUnits.MOA, AngleUnits.RADIAN, (val: number) => {
    return val / 60 * Math.PI / 180;
});

addConverter(MeasureUnits.ANGLE, AngleUnits.RADIAN, AngleUnits.DEGREE, (val: number) => {
    return val * 180 / Math.PI;
});

addConverter(MeasureUnits.ANGLE, AngleUnits.RADIAN, AngleUnits.MOA, (val: number) => {
    return val * 60 * 180 / Math.PI;
});



export enum MassUnits {
    GRAIN = "GRAIN",
    POUND = "POUND",
    OUNCE = "OUNCE",
    MILLIGRAM = "MILLIGRAM"
}


addConverter(MeasureUnits.MASS, MassUnits.GRAIN, MassUnits.POUND, (val: number) => {
    return val / 7000;
});

addConverter(MeasureUnits.MASS, MassUnits.GRAIN, MassUnits.OUNCE, (val: number) => {
    return val / 437.5;
});

addConverter(MeasureUnits.MASS, MassUnits.GRAIN, MassUnits.MILLIGRAM, (val: number) => {
    return val * 64.79891;
});

addConverter(MeasureUnits.MASS, MassUnits.POUND, MassUnits.GRAIN, (val: number) => {
    return val * 7000;
});

addConverter(MeasureUnits.MASS, MassUnits.POUND, MassUnits.OUNCE, (val: number) => {
    return val * 16.0;
});

addConverter(MeasureUnits.MASS, MassUnits.POUND, MassUnits.MILLIGRAM, (val: number) => {
    return val * 453592;
});

addConverter(MeasureUnits.MASS, MassUnits.OUNCE, MassUnits.GRAIN, (val: number) => {
    return val * 437.5;
});
addConverter(MeasureUnits.MASS, MassUnits.OUNCE, MassUnits.POUND, (val: number) => {
    return val * 0.0625;
});
addConverter(MeasureUnits.MASS, MassUnits.OUNCE, MassUnits.MILLIGRAM, (val: number) => {
    return val * 28349.5;
});

addConverter(MeasureUnits.MASS, MassUnits.MILLIGRAM, MassUnits.GRAIN, (val: number) => {
    return val * 0.0154323584;
});
addConverter(MeasureUnits.MASS, MassUnits.MILLIGRAM, MassUnits.POUND, (val: number) => {
    return val * 0.0000022;
});
addConverter(MeasureUnits.MASS, MassUnits.MILLIGRAM, MassUnits.OUNCE, (val: number) => {
    return val * 0.000035274;
});


export enum TemperatureUnits {
    FAHRENHEIT = "FAHRENHEIT",
    KELVIN = "KELVIN",
    CELSIUS = "CELSIUS",
    RANKINE = "RANKINE"
}


addConverter(MeasureUnits.TEMPERATURE, TemperatureUnits.FAHRENHEIT, TemperatureUnits.KELVIN, Temperature.fahrenheitToKelvin);

addConverter(MeasureUnits.TEMPERATURE, TemperatureUnits.FAHRENHEIT, TemperatureUnits.CELSIUS, Temperature.fahrenheitToCelsius);

addConverter(MeasureUnits.TEMPERATURE, TemperatureUnits.FAHRENHEIT, TemperatureUnits.RANKINE, Temperature.fahrenheitToRankine);

addConverter(MeasureUnits.TEMPERATURE, TemperatureUnits.KELVIN, TemperatureUnits.FAHRENHEIT, Temperature.kelvinToFahrenheit);

addConverter(MeasureUnits.TEMPERATURE, TemperatureUnits.KELVIN, TemperatureUnits.CELSIUS, Temperature.kelvinToCelsius);

addConverter(MeasureUnits.TEMPERATURE, TemperatureUnits.KELVIN, TemperatureUnits.RANKINE, Temperature.kelvinToRankine);

addConverter(MeasureUnits.TEMPERATURE, TemperatureUnits.CELSIUS, TemperatureUnits.FAHRENHEIT, Temperature.celsiusToFahrenheit);

addConverter(MeasureUnits.TEMPERATURE, TemperatureUnits.CELSIUS, TemperatureUnits.KELVIN, Temperature.celsiusToKelvin);

addConverter(MeasureUnits.TEMPERATURE, TemperatureUnits.CELSIUS, TemperatureUnits.RANKINE, Temperature.celsiusToRankine);

addConverter(MeasureUnits.TEMPERATURE, TemperatureUnits.RANKINE, TemperatureUnits.FAHRENHEIT, Temperature.rankineToFahrenheit);

addConverter(MeasureUnits.TEMPERATURE, TemperatureUnits.RANKINE, TemperatureUnits.KELVIN, Temperature.rankineToKelvin);

addConverter(MeasureUnits.TEMPERATURE, TemperatureUnits.RANKINE, TemperatureUnits.CELSIUS, Temperature.rankineToCelsius);

