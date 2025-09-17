import { test, assert, describe } from 'vitest';
import * as Tempature from 'temperature-util';
import { convert, MeasureUnits, AngleUnits, MassUnits, TempatureUnits } from '../util/MeasurmentUnit.js';


describe('Conversion Tests', () => {
    test('Angle Degree to MOA', () => {
        assert.strictEqual(convert(MeasureUnits.ANGLE, AngleUnits.DEGREE, AngleUnits.MOA, 2), 120);
        assert.strictEqual(convert(MeasureUnits.ANGLE, AngleUnits.DEGREE, AngleUnits.MOA, 0), 0);
        assert.strictEqual(convert(MeasureUnits.ANGLE, AngleUnits.DEGREE, AngleUnits.MOA, -2), -120);
    });

    test('Angle Degree to Radian', () => {
        assert.strictEqual(convert(MeasureUnits.ANGLE, AngleUnits.DEGREE, AngleUnits.RADIAN, 2), 0.034906585039886591);
        assert.strictEqual(convert(MeasureUnits.ANGLE, AngleUnits.DEGREE, AngleUnits.RADIAN, 0), 0);
        assert.strictEqual(convert(MeasureUnits.ANGLE, AngleUnits.DEGREE, AngleUnits.RADIAN, -2), -0.034906585039886591);
    });


    test('Angle Radian To Degree', () => {
        assert.strictEqual(convert(MeasureUnits.ANGLE, AngleUnits.RADIAN, AngleUnits.DEGREE, 2), 114.59155902616465);
        assert.strictEqual(convert(MeasureUnits.ANGLE, AngleUnits.RADIAN, AngleUnits.DEGREE, 0), 0);
        assert.strictEqual(convert(MeasureUnits.ANGLE, AngleUnits.RADIAN, AngleUnits.DEGREE, -2), -114.59155902616465);
    });

    test('Angle Radian To MOA', () => {
        assert.strictEqual(convert(MeasureUnits.ANGLE, AngleUnits.RADIAN, AngleUnits.MOA, 2), 6875.4935415698792);
        assert.strictEqual(convert(MeasureUnits.ANGLE, AngleUnits.RADIAN, AngleUnits.MOA, 0), 0);
        assert.strictEqual(convert(MeasureUnits.ANGLE, AngleUnits.RADIAN, AngleUnits.MOA, -2), -6875.4935415698792);
    });

    test('Angle MOA to Radian', () => {
        assert.strictEqual(convert(MeasureUnits.ANGLE, AngleUnits.MOA, AngleUnits.RADIAN, 2), 0.00058177641733144316);
        assert.strictEqual(convert(MeasureUnits.ANGLE, AngleUnits.MOA, AngleUnits.RADIAN, 0), 0);
        assert.strictEqual(convert(MeasureUnits.ANGLE, AngleUnits.MOA, AngleUnits.RADIAN, -2), -0.00058177641733144316);
    });

    test('Angle MOA To Degree', () => {
        assert.strictEqual(convert(MeasureUnits.ANGLE, AngleUnits.MOA, AngleUnits.DEGREE, 2), 0.033333333333333333);
        assert.strictEqual(convert(MeasureUnits.ANGLE, AngleUnits.MOA, AngleUnits.DEGREE, 0), 0);
        assert.strictEqual(convert(MeasureUnits.ANGLE, AngleUnits.MOA, AngleUnits.DEGREE, -2), -0.033333333333333333);
    });


    test('Mass Grain to Pound', () => {
        assert.strictEqual(convert(MeasureUnits.MASS, MassUnits.GRAIN, MassUnits.POUND, 2), 0.00028571428571428574);
        assert.strictEqual(convert(MeasureUnits.MASS, MassUnits.GRAIN, MassUnits.POUND, 0), 0);
        assert.strictEqual(convert(MeasureUnits.MASS, MassUnits.GRAIN, MassUnits.POUND, -2), -0.00028571428571428574);
    });

    test('Mass Grain to Ounce', () => {
        assert.strictEqual(convert(MeasureUnits.MASS, MassUnits.GRAIN, MassUnits.OUNCE, 2), 0.0045714285714285718);
        assert.strictEqual(convert(MeasureUnits.MASS, MassUnits.GRAIN, MassUnits.OUNCE, 0), 0);
        assert.strictEqual(convert(MeasureUnits.MASS, MassUnits.GRAIN, MassUnits.OUNCE, -2), -0.0045714285714285718);
    });

    test('Mass Grain to Miligram', () => {
        assert.strictEqual(convert(MeasureUnits.MASS, MassUnits.GRAIN, MassUnits.MILIGRAM, 2), 129.59782000000001);
        assert.strictEqual(convert(MeasureUnits.MASS, MassUnits.GRAIN, MassUnits.MILIGRAM, 0), 0);
        assert.strictEqual(convert(MeasureUnits.MASS, MassUnits.GRAIN, MassUnits.MILIGRAM, -2), -129.59782000000001);
    });

    test('Mass Miligram to Grain', () => {
        assert.strictEqual(convert(MeasureUnits.MASS, MassUnits.MILIGRAM, MassUnits.GRAIN, 2), 0.030864716800000001);
        assert.strictEqual(convert(MeasureUnits.MASS, MassUnits.MILIGRAM, MassUnits.GRAIN, 0), 0);
        assert.strictEqual(convert(MeasureUnits.MASS, MassUnits.MILIGRAM, MassUnits.GRAIN, -2), -0.030864716800000001);
    });

    test('Mass Miligram to Pound', () => {
        assert.strictEqual(convert(MeasureUnits.MASS, MassUnits.MILIGRAM, MassUnits.POUND, 2), 4.4000000000000002e-06);
        assert.strictEqual(convert(MeasureUnits.MASS, MassUnits.MILIGRAM, MassUnits.POUND, 0), 0);
        assert.strictEqual(convert(MeasureUnits.MASS, MassUnits.MILIGRAM, MassUnits.POUND, -2), -4.4000000000000002e-06);
    });

    test('Mass Miligram To Ounce', () => {
        assert.strictEqual(convert(MeasureUnits.MASS, MassUnits.MILIGRAM, MassUnits.OUNCE, 2), 7.0548000000000003e-05);
        assert.strictEqual(convert(MeasureUnits.MASS, MassUnits.MILIGRAM, MassUnits.OUNCE, 0), 0);
        assert.strictEqual(convert(MeasureUnits.MASS, MassUnits.MILIGRAM, MassUnits.OUNCE, -2), -7.0548000000000003e-05);
    });

    test('Mass Pound to Grain', () => {
        assert.strictEqual(convert(MeasureUnits.MASS, MassUnits.POUND, MassUnits.GRAIN, 2), 14000);
        assert.strictEqual(convert(MeasureUnits.MASS, MassUnits.POUND, MassUnits.GRAIN, 0), 0);
        assert.strictEqual(convert(MeasureUnits.MASS, MassUnits.POUND, MassUnits.GRAIN, -2), -14000);
    });

    test('Mass Pound To Miligram', () => {
        assert.strictEqual(convert(MeasureUnits.MASS, MassUnits.POUND, MassUnits.MILIGRAM, 2), 907184);
        assert.strictEqual(convert(MeasureUnits.MASS, MassUnits.POUND, MassUnits.MILIGRAM, 0), 0);
        assert.strictEqual(convert(MeasureUnits.MASS, MassUnits.POUND, MassUnits.MILIGRAM, -2), -907184);
    });

    test('Mass Pound To Ounce', () => {
        assert.strictEqual(convert(MeasureUnits.MASS, MassUnits.POUND, MassUnits.OUNCE, 2), 32);
        assert.strictEqual(convert(MeasureUnits.MASS, MassUnits.POUND, MassUnits.OUNCE, 0), 0);
        assert.strictEqual(convert(MeasureUnits.MASS, MassUnits.POUND, MassUnits.OUNCE, -2), -32);
    });

    test('Mass Ounce To Grain', () => {
        assert.strictEqual(convert(MeasureUnits.MASS, MassUnits.OUNCE, MassUnits.GRAIN, 2), 875);
        assert.strictEqual(convert(MeasureUnits.MASS, MassUnits.OUNCE, MassUnits.GRAIN, 0), 0);
        assert.strictEqual(convert(MeasureUnits.MASS, MassUnits.OUNCE, MassUnits.GRAIN, -2), -875);
    });

    test('Mass Ounce To Miligram', () => {
        assert.strictEqual(convert(MeasureUnits.MASS, MassUnits.OUNCE, MassUnits.MILIGRAM, 2), 56699);
        assert.strictEqual(convert(MeasureUnits.MASS, MassUnits.OUNCE, MassUnits.MILIGRAM, 0), 0);
        assert.strictEqual(convert(MeasureUnits.MASS, MassUnits.OUNCE, MassUnits.MILIGRAM, -2), -56699);
    });

    test('Mass Ounce To Pound', () => {
        assert.strictEqual(convert(MeasureUnits.MASS, MassUnits.OUNCE, MassUnits.POUND, 2), 0.125);
        assert.strictEqual(convert(MeasureUnits.MASS, MassUnits.OUNCE, MassUnits.POUND, 0), 0);
        assert.strictEqual(convert(MeasureUnits.MASS, MassUnits.OUNCE, MassUnits.POUND, -2), -0.125);
    });


    test('Tempature Fahrenheit To Kelvin', () => {
        assert.strictEqual(convert(MeasureUnits.TEMPATURE, TempatureUnits.FAHRENHEIT, TempatureUnits.KELVIN, 2), 256.48333333333335);
        assert.strictEqual(convert(MeasureUnits.TEMPATURE, TempatureUnits.FAHRENHEIT, TempatureUnits.KELVIN, 0), 255.37222222222223);
        assert.strictEqual(convert(MeasureUnits.TEMPATURE, TempatureUnits.FAHRENHEIT, TempatureUnits.KELVIN, -2), 254.26111111111112);
    });

    test('Tempature Fahrenheit To Celsius', () => {
        assert.strictEqual(convert(MeasureUnits.TEMPATURE, TempatureUnits.FAHRENHEIT, TempatureUnits.CELSIUS, 2), -16.666666666666668);
        assert.strictEqual(convert(MeasureUnits.TEMPATURE, TempatureUnits.FAHRENHEIT, TempatureUnits.CELSIUS, 0), -17.777777777777779);
        assert.strictEqual(convert(MeasureUnits.TEMPATURE, TempatureUnits.FAHRENHEIT, TempatureUnits.CELSIUS, -2), -18.888888888888889);
    });

    test('Tempature Fahrenheit To Rankine', () => {
        assert.strictEqual(convert(MeasureUnits.TEMPATURE, TempatureUnits.FAHRENHEIT, TempatureUnits.RANKINE, 2), 461.67000000000002);
        assert.strictEqual(convert(MeasureUnits.TEMPATURE, TempatureUnits.FAHRENHEIT, TempatureUnits.RANKINE, 0), 459.67000000000002);
        assert.strictEqual(convert(MeasureUnits.TEMPATURE, TempatureUnits.FAHRENHEIT, TempatureUnits.RANKINE, -2), 457.67000000000002);
    });

    test('Tempature Kelvin To Fahrenheit', () => {
        assert.strictEqual(Tempature.kelvinToFahrenheit(2), -456.06999999999999);
        assert.strictEqual(Tempature.kelvinToFahrenheit(0), -459.67000000000002);
        assert.strictEqual(Tempature.kelvinToFahrenheit(-2), -463.27000000000004);
    });

    test('Tempature Kelvin To Celsius', () => {
        assert.strictEqual(Tempature.kelvinToCelsius(2), -271.14999999999998);
        assert.strictEqual(Tempature.kelvinToCelsius(0), -273.14999999999998);
        assert.strictEqual(Tempature.kelvinToCelsius(-2), -275.14999999999998);
    });

    test('Tempature Kelvin To Rankine', () => {
        assert.strictEqual(Tempature.kelvinToRankine(2), 3.6000000000000001);
        assert.strictEqual(Tempature.kelvinToRankine(0), 0);
        assert.strictEqual(Tempature.kelvinToRankine(-2), -3.6000000000000001);
    });

    test('Tempature Celsius To Fahrenheit', () => {
        assert.strictEqual(Tempature.celsiusToFahrenheit(2), 35.600000000000001);
        assert.strictEqual(Tempature.celsiusToFahrenheit(0), 32);
        assert.strictEqual(Tempature.celsiusToFahrenheit(-2), 28.399999999999999);
    });

    test('Tempature Celsius To Kelvin', () => {
        assert.strictEqual(Tempature.celsiusToKelvin(2), 275.14999999999998);
        assert.strictEqual(Tempature.celsiusToKelvin(0), 273.14999999999998);
        assert.strictEqual(Tempature.celsiusToKelvin(-2), 271.14999999999998);
    });

    test('Tempature Celsius To Rankine', () => {
        assert.strictEqual(Tempature.celsiusToRankine(2), 495.27000000000004);
        assert.strictEqual(Tempature.celsiusToRankine(0), 491.67);
        assert.strictEqual(Tempature.celsiusToRankine(-2), 488.06999999999999);
    });

    test('Tempature Rankine To Fahrenheit', () => {
        assert.strictEqual(Tempature.rankineToFahrenheit(2), -457.57);
        assert.strictEqual(Tempature.rankineToFahrenheit(0), -459.57);
        assert.strictEqual(Tempature.rankineToFahrenheit(-2), -461.57);
    });

    test('Tempature Rankine To Celsius', () => {
        assert.strictEqual(Tempature.rankineToCelsius(2), -272.03888888888889);
        assert.strictEqual(Tempature.rankineToCelsius(0), -273.14999999999998);
        assert.strictEqual(Tempature.rankineToCelsius(-2), -274.26111111111106);
    });

    test('Tempature Rankine To Kelvin', () => {
        assert.strictEqual(Tempature.rankineToKelvin(2), 1.1111111111111112);
        assert.strictEqual(Tempature.rankineToKelvin(0), 0);
        assert.strictEqual(Tempature.rankineToKelvin(-2), -1.1111111111111112);
    });
});