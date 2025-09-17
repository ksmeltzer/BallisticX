import { describe, test, assert } from "vitest";
import { calculateSectionalDensity } from "../SectionalDensity.js";

describe('Sectional Density', () => {
    test('Calculate Sectional Density Test', () => {
        const val = calculateSectionalDensity(250, 0.338);
        assert.strictEqual(Number(val.toFixed(4)), 0.3126);
    });
}); 