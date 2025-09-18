
import { describe, test, assert } from "vitest";
import { calculateStability, calculateTwist } from "../Miller.js";



describe('Miller Tests', () => {
    test('Calculate Twist', () => {

        assert.strictEqual(calculateTwist(0.308, 3.83, 180, 2), 12.086147286066234);

        assert.strictEqual(calculateTwist(1.0, 1.0, 1.0, 2), 2.7386127875258306);
    });

    test('Calculate Stability', () => {

        assert.strictEqual(calculateStability(0.308, 3.83, 180, 2), 21.0828132906055);

        assert.strictEqual(calculateStability(1.0, 1.0, 1.0, 2), 2);
    });
});