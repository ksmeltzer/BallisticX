import { describe, it, expect } from "vitest";
import { calculatePointBlankRange } from "../PointBlankRange.js";
import { DragFunction, type DragFunctionType } from "../BallisticX.js";


describe("calculatePointBlankRange", () => {

  //dragFunctions.forEach((dragFn) => {
  for (const dragFn in DragFunction) {
    it.skip(`computes stable point blank range for ${dragFn}`, () => {
      const result = calculatePointBlankRange(DragFunction[dragFn as DragFunctionType], 0.5, 2800, 1.5, 10);

      // Basic sanity checks
      expect(result.nearZero).toBeGreaterThan(0);
      expect(result.farZero).toBeGreaterThan(result.nearZero);
      expect(result.minPointBlankRange).toBeGreaterThan(0);
      expect(result.maxPointBlankRange).toBeGreaterThan(result.minPointBlankRange);
      expect(Number.isFinite(result.sightInHeight)).toBe(true);
    });
  }
});