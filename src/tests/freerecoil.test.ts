
import { assert, describe, test } from "vitest";
import { PropellentGasVelocity } from "../BallisticX.js";
import { calculateFreeRecoil } from "../FreeRecoil.js";

describe('Free Recoil Tests', () => {
    test('Calculate Free Recoil', () => {
        const val = calculateFreeRecoil(
            589.9, 
            1275,  
            33.4,  
            PropellentGasVelocity.SHOTGUN, 
            7
        );
        assert.strictEqual(val, -25.643819337020314);
    });
});