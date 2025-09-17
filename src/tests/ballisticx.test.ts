

import { describe, test, assert } from "vitest";
import  { DragFunction } from "../BalisticX.js";
import  { Retard } from "../Retard.js";
import  { Windage } from "../Windage.js";
import  { Zero } from "../Zero.js";

describe('ballisticx Tests', () => {
    test('Zero Calculation', () => {
        const G1 = Zero.ZeroAngle(DragFunction.G1, 0.465, 2650, 1.6, 200, 0);
        const G2 = Zero.ZeroAngle(DragFunction.G2, 0.465, 2650, 1.6, 200, 0);
        const G5 = Zero.ZeroAngle(DragFunction.G5, 0.465, 2650, 1.6, 200, 0);
        const G6 = Zero.ZeroAngle(DragFunction.G6, 0.465, 2650, 1.6, 200, 0);
        const G7 = Zero.ZeroAngle(DragFunction.G7, 0.465, 2650, 1.6, 200, 0);
        const G8 = Zero.ZeroAngle(DragFunction.G8, 0.465, 2650, 1.6, 200, 0);
        const I = Zero.ZeroAngle(DragFunction.I, 0.465, 2650, 1.6, 200, 0);
        const B = Zero.ZeroAngle(DragFunction.B, 0.465, 2650, 1.6, 200, 0);

        assert.strictEqual(G1, 0.0998687744140625);
        assert.strictEqual(G2, 0.095596313476562514);
        assert.strictEqual(G5, 0.0968780517578125);
        assert.strictEqual(G6, 0.0960235595703125);
        assert.strictEqual(G7, 0.095596313476562514);
        assert.strictEqual(G8, 0.0958099365234375);
        assert.strictEqual(I, 0.10029602050781251);
        assert.strictEqual(B, 0.1000823974609375);
    });

    test('Calculate Retard', () => {
        const G1 = Retard.CalcRetard(DragFunction.G1, 0.465, 2650);
        const G2 = Retard.CalcRetard(DragFunction.G2, 0.465, 2650);
        const G5 = Retard.CalcRetard(DragFunction.G5, 0.465, 2650);
        const G6 = Retard.CalcRetard(DragFunction.G6, 0.465, 2650);
        const G7 = Retard.CalcRetard(DragFunction.G7, 0.465, 2650);
        const G8 = Retard.CalcRetard(DragFunction.G8, 0.465, 2650);
        const I = Retard.CalcRetard(DragFunction.I, 0.465, 2650);
        const B = Retard.CalcRetard(DragFunction.B, 0.465, 2650);

        assert.strictEqual(G1, 1700.6101549599655);
        assert.strictEqual(G2, 836.74681264648268);
        assert.strictEqual(G5, 1091.469144250384);
        assert.strictEqual(G6, 949.69767441680813);
        assert.strictEqual(G7, 846.55271847810116);
        assert.strictEqual(G8, 912.72086631572529);
        assert.strictEqual(I, 1768.585858301544);
        assert.strictEqual(B, 1721.5850610419966);
    });

    test('Calculate Windate', () => {
        const val = Windage.CalcWindage(2.0, 1200, 100, 3);
        assert.strictEqual(val, 102.66666666666667);
    });

    test('Calculate Head Wind', () => {
        const val = Windage.HeadWind(2.0, 0);
        assert.strictEqual(val, 2);
    });

    test('Calculate Cross Wind', () => {
        const val = Windage.CrossWind(2.0, 0);
        assert.strictEqual(val, 0);
    });
});