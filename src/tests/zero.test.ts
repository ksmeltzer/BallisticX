import { describe, it, expect } from "vitest";
import { DragFunction } from "../BallisticX.js";
import { zeroAngle } from "../Zero.js";

// Helper for approximate assertions
function expectCloseTo(actual: number, expected: number, tolerance: number) {
  expect(Math.abs(actual - expected)).toBeLessThanOrEqual(tolerance);
}

describe("zeroAngle", () => {
  it("returns a finite number", () => {
    const angle = zeroAngle(
      DragFunction.G1, // drag model
      0.5,             // drag coefficient
      2800,            // initial velocity (ft/s)
      1.5,             // sight height (in)
      100,             // zero range (yards)
      0                // y intercept (in)
    );

    expect(typeof angle).toBe("number");
    expect(Number.isFinite(angle)).toBe(true);
  });

  it("produces higher angle for longer zero range", () => {
    const angleShort = zeroAngle(
      DragFunction.G1,
      0.5,
      2800,
      1.5,
      50,   // shorter zero range
      0
    );

    const angleLong = zeroAngle(
      DragFunction.G1,
      0.5,
      2800,
      1.5,
      300,  // longer zero range
      0
    );

    expect(angleLong).toBeGreaterThan(angleShort);
  });

  it("returns an angle between 0 and 45 degrees", () => {
    const angle = zeroAngle(
      DragFunction.G1,
      0.5,
      2800,
      1.5,
      200,
      0
    );
    expect(angle).toBeGreaterThanOrEqual(0);
    expect(angle).toBeLessThanOrEqual(45);
  });

  it("matches expected result within tolerance", () => {
    // Known test case (values here are illustrative; adjust if you have real expected results)
    const angle = zeroAngle(
      DragFunction.G1,
      0.5,
      2800,
      1.5,
      100,
      0
    );
    // Expect around ~0.5–1.5 degrees for a 100 yard zero depending on drag
    expectCloseTo(angle, 1.0, 1.0);
  });
});
