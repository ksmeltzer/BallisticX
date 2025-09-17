import * as Tempature from 'temperature-util';

interface IUnitConverter {
    (val: number): number;
}

export enum MeasureUnits {
    ANGLE = "ANGLE",
    MASS = "MASS",
    TEMPATURE = "TEMPATURE"
}

const mesures: Record<string, Record<string, Record<string, IUnitConverter>>> = {};

export const convert = (mesure: string, fromUnit: string, toUnit: string, amount: number): number  => {
    const m = mesures[mesure];
    if (m) {
        const from = m[fromUnit];
        if (from && from[toUnit]) {
            const calcFunc: IUnitConverter = from[toUnit];
            return calcFunc(amount);
        }
    }
    return 0;
}

export const addConverter = (mesure: string, fromUnit: string, toUnit: string, formula: IUnitConverter) => {
    if (!mesures[mesure]) {
        mesures[mesure] = {};
    }
    if (!mesures[mesure][fromUnit]) {
        mesures[mesure][fromUnit] = {};
    }
    mesures[mesure][fromUnit][toUnit] = formula;
}



export enum AngleUnits {
    DEGREE = "DEGREE",
    MOA = "MOA",
    RADIAN = "RADAN",
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
    MILIGRAM = "MILIGRAM"
}


addConverter(MeasureUnits.MASS, MassUnits.GRAIN, MassUnits.POUND, (val: number) => {
    return val / 7000;
});

addConverter(MeasureUnits.MASS, MassUnits.GRAIN, MassUnits.OUNCE, (val: number) => {
    return val / 437.5;
});

addConverter(MeasureUnits.MASS, MassUnits.GRAIN, MassUnits.MILIGRAM, (val: number) => {
    return val * 64.79891;
});

addConverter(MeasureUnits.MASS, MassUnits.POUND, MassUnits.GRAIN, (val: number) => {
    return val * 7000;
});

addConverter(MeasureUnits.MASS, MassUnits.POUND, MassUnits.OUNCE, (val: number) => {
    return val * 16.0;
});

addConverter(MeasureUnits.MASS, MassUnits.POUND, MassUnits.MILIGRAM, (val: number) => {
    return val * 453592;
});

addConverter(MeasureUnits.MASS, MassUnits.OUNCE, MassUnits.GRAIN, (val: number) => {
    return val * 437.5;
});
addConverter(MeasureUnits.MASS, MassUnits.OUNCE, MassUnits.POUND, (val: number) => {
    return val * 0.0625;
});
addConverter(MeasureUnits.MASS, MassUnits.OUNCE, MassUnits.MILIGRAM, (val: number) => {
    return val * 28349.5;
});

addConverter(MeasureUnits.MASS, MassUnits.MILIGRAM, MassUnits.GRAIN, (val: number) => {
    return val * 0.0154323584;
});
addConverter(MeasureUnits.MASS, MassUnits.MILIGRAM, MassUnits.POUND, (val: number) => {
    return val * 0.0000022;
});
addConverter(MeasureUnits.MASS, MassUnits.MILIGRAM, MassUnits.OUNCE, (val: number) => {
    return val * 0.000035274;
});


export enum TempatureUnits {
    FAHRENHEIT = "FAHRENHEIT",
    KELVIN = "KELVIN",
    CELSIUS = "CELSIUS",
    RANKINE = "RANKINE"
}


addConverter(MeasureUnits.TEMPATURE, TempatureUnits.FAHRENHEIT, TempatureUnits.KELVIN, Tempature.fahrenheitToKelvin);

addConverter(MeasureUnits.TEMPATURE, TempatureUnits.FAHRENHEIT, TempatureUnits.CELSIUS, Tempature.fahrenheitToCelsius);

addConverter(MeasureUnits.TEMPATURE, TempatureUnits.FAHRENHEIT, TempatureUnits.RANKINE, Tempature.fahrenheitToRankine);

addConverter(MeasureUnits.TEMPATURE, TempatureUnits.KELVIN, TempatureUnits.FAHRENHEIT, Tempature.kelvinToFahrenheit);

addConverter(MeasureUnits.TEMPATURE, TempatureUnits.KELVIN, TempatureUnits.CELSIUS, Tempature.kelvinToCelsius);

addConverter(MeasureUnits.TEMPATURE, TempatureUnits.KELVIN, TempatureUnits.RANKINE, Tempature.kelvinToRankine);

addConverter(MeasureUnits.TEMPATURE, TempatureUnits.CELSIUS, TempatureUnits.FAHRENHEIT, Tempature.celsiusToFahrenheit);

addConverter(MeasureUnits.TEMPATURE, TempatureUnits.CELSIUS, TempatureUnits.KELVIN, Tempature.celsiusToKelvin);

addConverter(MeasureUnits.TEMPATURE, TempatureUnits.CELSIUS, TempatureUnits.RANKINE, Tempature.celsiusToRankine);

addConverter(MeasureUnits.TEMPATURE, TempatureUnits.RANKINE, TempatureUnits.FAHRENHEIT, Tempature.rankineToFahrenheit);

addConverter(MeasureUnits.TEMPATURE, TempatureUnits.RANKINE, TempatureUnits.KELVIN, Tempature.rankineToKelvin);

addConverter(MeasureUnits.TEMPATURE, TempatureUnits.RANKINE, TempatureUnits.CELSIUS, Tempature.rankineToCelsius);

