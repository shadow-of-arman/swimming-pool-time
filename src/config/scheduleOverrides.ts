import type { ScheduleOverrideConfiguration } from '../domain/scheduleOverrides'

/**
 * Manual exceptions keyed by the Gregorian Saturday that begins the week.
 *
 * Keep this object empty when the generated rotation is correct. To add an
 * exception, use a canonical key such as `2026-07-18` and replace only the
 * affected day/slot positions. The override domain validates the final week
 * before it is displayed.
 */
export const SCHEDULE_OVERRIDES = {} satisfies ScheduleOverrideConfiguration
