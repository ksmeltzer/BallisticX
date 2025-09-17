
import { assert, describe, test } from "vitest";
import { PropellentGasVelocity } from "../BalisticX.js";
import { calculateFreeRecoil } from "../FreeRecoil.js";

describe('Free Recoil Tests', () => {
    test('Calculate Free Recoil', () => {
        const val = calculateFreeRecoil(
            589.9, // EjectaWeight
            1275,  // EjectaVelocity
            33.4,  // PropellentWeight
            PropellentGasVelocity.sal, // PropellentGasVelocity
            7      // FirearmWeight
        );
        assert.strictEqual(val, -25.6449580558118);
    });
});