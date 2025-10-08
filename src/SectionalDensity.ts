
import { err, ok, type Result } from "neverthrow";
import { convert, MassUnits, MeasureUnits } from "./util/MeasurementUnit.js";

/**
 * @function calculateSectionalDensity
 * @description Calculate the sectional density of bullet.
 *
 * @param {number} weight Weight in grains of the bullet. Ex. 250
 * @param {number} diameter Diameter of the bullet in inches. Ex. .338
 *
 * @return {number} The sectional density of a bullet.
 * 
 * @see https://en.wikipedia.org/wiki/Sectional_density
 */
export function calculateSectionalDensity(weight: number, diameter: number): Result<number, Error> {
    const result = convert(MeasureUnits.MASS, MassUnits.GRAIN, MassUnits.POUND, weight);
    if (result.isOk()) {
        const ret = result.value / Math.pow(diameter, 2);
        return ok(ret);
    }
    else {
        const sourceErr = result.error;
        return err(new Error("conversion of weight for sectional density errored.", { cause: sourceErr }));
    }

}