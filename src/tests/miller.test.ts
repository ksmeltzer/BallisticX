
import { describe, test, assert } from "vitest";
import { Miller } from "../Miller.js";



describe('Miller Tests', () => {
    test('Calculate Twist', () => {

        let m = new Miller(0.308, 3.83, 180, 2);

        assert.strictEqual(m.calculateTwist(), 12.086147286066234);

        m = new Miller(1.0, 1.0, 1.0, 2);
        assert.strictEqual(m.calculateTwist(), 2.7386127875258306);
    });

    test('Calculate Stability', () => {
        let m = new Miller(0.308, 3.83, 180, 2);
        assert.strictEqual(m.calculateStability(), 21.0828132906055);

        m = new Miller(1.0, 1.0, 1.0, 2);
        assert.strictEqual(m.calculateStability(), 2);
    });
});