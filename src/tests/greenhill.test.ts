
import { assert, describe, test } from "vitest"
import { Greenhill } from "../Greenhill.js";





describe('Greenhill Tests', () => {
    test('Calculate Twist', () => {
        let g = new Greenhill(0.5, 1.5, 1, 150);
        assert.strictEqual(g.calculateTwist(), 7.5722816601922833);

        g = new Greenhill(0, 1.5, 1,150);
        assert.strictEqual(g.calculateTwist(), 0);
    });
});