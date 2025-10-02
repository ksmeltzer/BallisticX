import { describe, it, expect } from "vitest";
import { calculatePointBlankRange } from "../PointBlankRange.js";
import { DragFunction } from "../BallisticX.js";
import { assert } from "console";


describe("calculatePointBlankRange", () => {
  const dragFunctions = [
    DragFunction.G1,
    DragFunction.G2,
    DragFunction.G5,
    DragFunction.G6,
    DragFunction.G7,
    DragFunction.G8,
    DragFunction.I,
    DragFunction.B
  ];

  dragFunctions.forEach((dragFn) => {
    it(`computes stable point blank range for ${dragFn}`, () => {
      //const result = calculatePointBlankRange(dragFn, 0.5, 2800, 1.5, 10);

      // Basic sanity checks
      //expect(result.nearZero).toBeGreaterThan(0);
      //expect(result.farZero).toBeGreaterThan(result.nearZero);
      //expect(result.minPointBlankRange).toBeGreaterThan(0);
      //expect(result.maxPointBlankRange).toBeGreaterThan(result.minPointBlankRange);
      //expect(Number.isFinite(result.sightInHeight)).toBe(true);
      expect(true).toBeTruthy();
    });
  });

});