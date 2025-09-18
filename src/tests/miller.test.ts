
import { describe, test, assert } from "vitest";
import { calculateStability, calculateMillerTwist } from "../Miller.js";



describe('Miller Tests', () => {
    test('Calculate Twist', () => {

        assert.strictEqual(calculateMillerTwist(0.308, 3.83, 180, 2), 12.086147286066234);

        assert.strictEqual(calculateMillerTwist(1.0, 1.0, 1.0, 2), 2.7386127875258306);
    });

    test('Calculate Stability', () => {

        assert.strictEqual(calculateStability(0.308, 3.83, 180, 2), 21.0828132906055);

        assert.strictEqual(calculateStability(1.0, 1.0, 1.0, 2), 2);
    });
});