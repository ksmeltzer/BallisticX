
import { assert, describe, test } from "vitest"
import { calculateTwist } from "../Greenhill.js";


describe('Greenhill Tests', () => {
    test('Calculate Twist', () => {
        assert.strictEqual(calculateTwist(0.5, 1.5, 1, 150), 7.5722816601922833);
        assert.strictEqual(calculateTwist(0, 1.5, 1,150), 0);
    });
});