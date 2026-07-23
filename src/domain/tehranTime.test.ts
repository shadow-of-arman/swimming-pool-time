import { describe, expect, it } from 'vitest'
import {
  addCalendarDays,
  ANCHOR_SATURDAY,
  calendarDateToUtcMilliseconds,
  getLatestSaturdayInTehran,
  getTehranDateParts,
  getTehranTimeParts,
  getWeekOffsetFromAnchor,
} from './tehranTime'

describe('Tehran calendar-date primitives', () => {
  it('changes the calendar date exactly at Tehran midnight', () => {
    const fridayBeforeMidnight = getTehranDateParts(
      new Date('2026-07-17T20:29:59.000Z'),
    )
    const saturdayAtMidnight = getTehranDateParts(
      new Date('2026-07-17T20:30:00.000Z'),
    )

    expect(fridayBeforeMidnight).toEqual({
      year: 2026,
      month: 7,
      day: 17,
      weekday: 'friday',
      weekdayIndex: 6,
    })
    expect(saturdayAtMidnight).toEqual({
      year: 2026,
      month: 7,
      day: 18,
      weekday: 'saturday',
      weekdayIndex: 0,
    })
  })

  it('extracts Tehran time and minutes since midnight', () => {
    expect(getTehranTimeParts(new Date('2026-07-18T04:30:45.000Z'))).toEqual({
      hour: 8,
      minute: 0,
      second: 45,
      minutesSinceMidnight: 8 * 60,
    })
  })

  it('returns the latest Saturday for any Tehran date', () => {
    expect(
      getLatestSaturdayInTehran(new Date('2026-07-17T20:29:59.000Z')),
    ).toEqual({ year: 2026, month: 7, day: 11 })

    expect(
      getLatestSaturdayInTehran(new Date('2026-07-17T20:30:00.000Z')),
    ).toEqual({ year: 2026, month: 7, day: 18 })
  })

  it('calculates whole-week offsets before, at, and after the anchor', () => {
    expect(getWeekOffsetFromAnchor(new Date('2026-07-10T12:00:00.000Z'))).toBe(
      -1,
    )
    expect(getWeekOffsetFromAnchor(new Date('2026-07-11T12:00:00.000Z'))).toBe(
      0,
    )
    expect(getWeekOffsetFromAnchor(new Date('2026-07-18T12:00:00.000Z'))).toBe(
      1,
    )
  })

  it('uses UTC-safe date-only arithmetic across month boundaries', () => {
    expect(addCalendarDays({ year: 2026, month: 7, day: 31 }, 1)).toEqual({
      year: 2026,
      month: 8,
      day: 1,
    })
    expect(addCalendarDays({ year: 2026, month: 1, day: 1 }, -1)).toEqual({
      year: 2025,
      month: 12,
      day: 31,
    })
  })

  it('keeps the documented anchor as a valid Gregorian Saturday', () => {
    const anchorWeekday = new Date(
      calendarDateToUtcMilliseconds(ANCHOR_SATURDAY),
    ).getUTCDay()

    expect(anchorWeekday).toBe(6)
  })
})
