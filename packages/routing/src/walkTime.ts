import { WALK_SPEED_M_PER_MIN } from '@transit/shared';

export function computeWalkTime(distanceMeters: number): number {
  return Math.round(distanceMeters / WALK_SPEED_M_PER_MIN);
}
