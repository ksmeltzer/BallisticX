import { describe, it, expect, vi, beforeEach } from 'vitest';
import { solveAll } from '../Solve.js';
import { DragFunction } from '../BallisticX.js';
import * as Retard from '../Retard.js';
import * as Windage from '../Windage.js';
// Mock the dependencies
vi.mock('../Retard');
vi.mock('../Windage');
vi.mock('../util/Logger');

describe('solveAll', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();
    
    // Setup default mock implementations
    vi.mocked(Retard.calculateRetard).mockReturnValue(32.174); // Standard drag value
    vi.mocked(Windage.headWind).mockReturnValue(0);
    vi.mocked(Windage.crossWind).mockReturnValue(0);
    vi.mocked(Windage.calculateWindage).mockReturnValue(0);
  });

  it('should return an array of ballistic computation units', () => {
    const result = solveAll(
      DragFunction.G1,
      0.5,      // dragCoefficient
      2800,     // initialVelocity (fps)
      1.5,      // sightHeight (inches)
      0,        // shootingAngle (degrees)
      0,        // zeroAngle (degrees)
      0,        // windSpeed (mph)
      0,        // windAngle (degrees)
      100       // zero range (yards)
    );

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('should have correct structure for each ballistic computation unit', () => {
    const result = solveAll(
      DragFunction.G1,
      0.5,
      2800,
      1.5,
      0,
      0,
      0,
      0,
      100
    );

    const firstUnit = result[0];
    
    expect(firstUnit).toHaveProperty('range');
    expect(firstUnit).toHaveProperty('drop');
    expect(firstUnit).toHaveProperty('correction');
    expect(firstUnit).toHaveProperty('time');
    expect(firstUnit).toHaveProperty('windageInches');
    expect(firstUnit).toHaveProperty('windageMOA');
    expect(firstUnit).toHaveProperty('velocityCompensated');
    expect(firstUnit).toHaveProperty('horizontalVelocity');
    expect(firstUnit).toHaveProperty('verticalVelocity');
  });

  it('should start at range 0 yards', () => {
    const result = solveAll(
      DragFunction.G1,
      0.5,
      2800,
      1.5,
      0,
      0,
      0,
      0,
      100
    );

    expect(result[0].range).toBe(0);
  });

  it('should increment range by 1 yard for each unit', () => {
    const result = solveAll(
      DragFunction.G1,
      0.5,
      2800,
      1.5,
      0,
      0,
      0,
      0,
      100
    );

    // Check first few increments
    for (let i = 0; i < Math.min(5, result.length); i++) {
      expect(result[i].range).toBe(i);
    }
  });

  it('should show negative drop initially due to sight height', () => {
    const result = solveAll(
      DragFunction.G1,
      0.5,
      2800,
      1.5,      // Sight is 1.5 inches above bore
      0,
      0,
      0,
      0,
      100
    );

    // At muzzle, projectile should be below line of sight (negative drop)
    expect(result[0].drop).toBeLessThan(0);
    expect(result[0].drop).toBeCloseTo(-1.5, 1);
  });

  it('should show velocity decreasing over distance', () => {
    const result = solveAll(
      DragFunction.G1,
      0.5,
      2800,
      1.5,
      0,
      0,
      0,
      0,
      100
    );

    // Velocity should decrease as bullet travels
    const velocityAtStart = result[0].velocityCompensated;
    const velocityAtMidpoint = result[Math.floor(result.length / 2)].velocityCompensated;
    const velocityAtEnd = result[result.length - 1].velocityCompensated;

    expect(velocityAtStart).toBeGreaterThan(velocityAtMidpoint);
    expect(velocityAtMidpoint).toBeGreaterThan(velocityAtEnd);
  });

  it('should show increasing drop over distance', () => {
    const result = solveAll(
      DragFunction.G1,
      0.5,
      2800,
      1.5,
      0,
      0,
      0,
      0,
      100
    );

    // Drop should increase (become more negative) as bullet travels
    const dropAtStart = result[10].drop; // Skip first few due to sight height
    const dropAtEnd = result[result.length - 1].drop;

    expect(dropAtEnd).toBeLessThan(dropAtStart);
  });

  it('should show increasing time over distance', () => {
    const result = solveAll(
      DragFunction.G1,
      0.5,
      2800,
      1.5,
      0,
      0,
      0,
      0,
      100
    );

    // Time should monotonically increase
    for (let i = 1; i < result.length; i++) {
      expect(result[i].time).toBeGreaterThan(result[i - 1].time);
    }
  });

  it('should call calculateRetard with correct drag function and coefficient', () => {
    solveAll(
      DragFunction.G7,
      0.25,
      2800,
      1.5,
      0,
      0,
      0,
      0,
      100
    );

    expect(Retard.calculateRetard).toHaveBeenCalled();
    const firstCall = vi.mocked(Retard.calculateRetard).mock.calls[0];
    expect(firstCall[0]).toBe(DragFunction.G7);
    expect(firstCall[1]).toBe(0.25);
  });

  it('should calculate wind components when wind is present', () => {
    solveAll(
      DragFunction.G1,
      0.5,
      2800,
      1.5,
      0,
      0,
      10,       // 10 mph wind
      90,       // 90 degree angle (full crosswind)
      100
    );

    expect(Windage.headWind).toHaveBeenCalledWith(10, 90);
    expect(Windage.crossWind).toHaveBeenCalledWith(10, 90);
    expect(Windage.calculateWindage).toHaveBeenCalled();
  });

  it('should apply headwind effect to drag calculation', () => {
    // Mock headwind to return 10 mph
    vi.mocked(Windage.headWind).mockReturnValue(10);
    
    solveAll(
      DragFunction.G1,
      0.5,
      2800,
      1.5,
      0,
      0,
      10,
      0,        // Direct headwind
      100
    );

    // Check that calculateRetard was called with velocity adjusted for headwind
    const calls = vi.mocked(Retard.calculateRetard).mock.calls;
    expect(calls.length).toBeGreaterThan(0);
    
    // Headwind should increase effective velocity (10 mph = 14.67 fps)
    const velocityWithWind = calls[0][2];
    expect(velocityWithWind).toBeGreaterThan(2800);
  });

  it('should handle uphill shooting angle', () => {
    const uphillResult = solveAll(
      DragFunction.G1,
      0.5,
      2800,
      1.5,
      15,       // 15 degree uphill angle
      0,
      0,
      0,
      100
    );

    const flatResult = solveAll(
      DragFunction.G1,
      0.5,
      2800,
      1.5,
      0,        // Flat shooting
      0,
      0,
      0,
      100
    );

    // Uphill shooting should result in less drop at same range
    const uphillDrop = uphillResult[100]?.drop || uphillResult[uphillResult.length - 1].drop;
    const flatDrop = flatResult[100]?.drop || flatResult[flatResult.length - 1].drop;
    
    expect(uphillDrop).toBeGreaterThan(flatDrop);
  });

  it('should handle downhill shooting angle', () => {
    const downhillResult = solveAll(
      DragFunction.G1,
      0.5,
      2800,
      1.5,
      -15,      // 15 degree downhill angle
      0,
      0,
      0,
      100
    );

    const flatResult = solveAll(
      DragFunction.G1,
      0.5,
      2800,
      1.5,
      0,
      0,
      0,
      0,
      100
    );

    // Downhill shooting should also result in less drop at same range
    const downhillDrop = downhillResult[100]?.drop || downhillResult[downhillResult.length - 1].drop;
    const flatDrop = flatResult[100]?.drop || flatResult[flatResult.length - 1].drop;
    
    expect(downhillDrop).toBeGreaterThan(flatDrop);
  });

  it('should handle zero angle correctly', () => {
    const result = solveAll(
      DragFunction.G1,
      0.5,
      2800,
      1.5,
      0,
      2,        // 2 degree zero angle (barrel pointing up)
      0,
      0,
      100
    );

    // With positive zero angle, bullet should rise initially
    const earlyDrop = result[5].drop;
    expect(earlyDrop).toBeGreaterThan(result[0].drop);
  });

  it('should stop when projectile trajectory becomes too steep', () => {
    // Use very low velocity to ensure steep trajectory
    const result = solveAll(
      DragFunction.G1,
      0.5,
      500,      // Very low velocity
      1.5,
      0,
      45,       // High angle
      0,
      0,
      100
    );

    // Should terminate before max range due to steep trajectory
    expect(result.length).toBeLessThan(1000);
  });

  it('should produce consistent results with same inputs', () => {
    const result1 = solveAll(
      DragFunction.G1,
      0.5,
      2800,
      1.5,
      0,
      0,
      0,
      0,
      100
    );

    const result2 = solveAll(
      DragFunction.G1,
      0.5,
      2800,
      1.5,
      0,
      0,
      0,
      0,
      100
    );

    expect(result1.length).toBe(result2.length);
    expect(result1[0].drop).toBe(result2[0].drop);
    expect(result1[result1.length - 1].velocityCompensated)
      .toBe(result2[result2.length - 1].velocityCompensated);
  });

  it('should handle high drag coefficient (slower velocity decay)', () => {
    const highDragResult = solveAll(
      DragFunction.G1,
      0.8,      // High drag
      2800,
      1.5,
      0,
      0,
      0,
      0,
      100
    );

    const lowDragResult = solveAll(
      DragFunction.G1,
      0.3,      // Low drag
      2800,
      1.5,
      0,
      0,
      0,
      0,
      100
    );

    // High drag should result in more velocity loss
    const highDragFinalVelocity = highDragResult[highDragResult.length - 1].velocityCompensated;
    const lowDragFinalVelocity = lowDragResult[lowDragResult.length - 1].velocityCompensated;

    expect(lowDragFinalVelocity).toBeGreaterThan(highDragFinalVelocity);
  });

  it('should have all positive time values', () => {
    const result = solveAll(
      DragFunction.G1,
      0.5,
      2800,
      1.5,
      0,
      0,
      0,
      0,
      100
    );

    result.forEach((unit: { time: number; }) => {
      expect(unit.time).toBeGreaterThanOrEqual(0);
    });
  });

  it('should calculate correction angle in MOA', () => {
    const result = solveAll(
      DragFunction.G1,
      0.5,
      2800,
      1.5,
      0,
      0,
      0,
      0,
      100
    );

    // Correction should be negative (aiming up to compensate for drop)
    const correctionAt100Yards = result[100]?.correction;
    if (correctionAt100Yards !== undefined) {
      expect(correctionAt100Yards).toBeLessThan(0);
      expect(typeof correctionAt100Yards).toBe('number');
    }
  });
});