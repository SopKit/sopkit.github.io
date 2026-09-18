/**
 * @file packages/cli/src/core/hit-box.ts
 * @description 2D spatial coordinate hit-tester for terminal mouse interactions.
 */

export interface HitZone {
  id: string;
  x1: number; // Start column (1-indexed)
  x2: number; // End column (inclusive)
  y1: number; // Start row (1-indexed)
  y2: number; // End row (inclusive)
  data?: any;
  onClick?: () => void;
}

export class HitManager {
  private zones: HitZone[] = [];

  /**
   * Clears all registered hit zones (called before each frame render).
   */
  public clear(): void {
    this.zones = [];
  }

  /**
   * Registers a clickable 2D rectangular zone.
   */
  public register(zone: HitZone): void {
    this.zones.push(zone);
  }

  /**
   * Finds the hit zone matching the given mouse coordinates.
   */
  public find(col: number, row: number): HitZone | undefined {
    return this.zones.find(
      (z) => col >= z.x1 && col <= z.x2 && row >= z.y1 && row <= z.y2
    );
  }
}
