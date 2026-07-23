import { describe, expect, it } from 'vitest'
import { UNIT_COUNT, WEEKLY_SCHEDULE } from './schedule'
import {
  getPrivateUnitSequence,
  getUnitNumberForPrivateSlot,
  positiveModulo,
  resolveWeeklySchedule,
  resolveWeeklyScheduleForDate,
} from './resolvedSchedule'

const ALL_UNITS = Array.from({ length: UNIT_COUNT }, (_, index) => index + 1)
const ANCHOR_SEQUENCE = [UNIT_COUNT, ...ALL_UNITS.slice(0, -1)]
const NEXT_WEEK_SEQUENCE = [
  UNIT_COUNT - 1,
  UNIT_COUNT,
  ...ALL_UNITS.slice(0, -2),
]

describe('resolved weekly schedule', () => {
  it('uses positive modulo for negative and wrapped values', () => {
    expect(positiveModulo(-1, UNIT_COUNT)).toBe(UNIT_COUNT - 1)
    expect(positiveModulo(-UNIT_COUNT, UNIT_COUNT)).toBe(0)
    expect(positiveModulo(UNIT_COUNT + 2, UNIT_COUNT)).toBe(2)
  })

  it('maps the first private slot correctly around the anchor', () => {
    expect(getUnitNumberForPrivateSlot(0, -1)).toBe(1)
    expect(getUnitNumberForPrivateSlot(0, 0)).toBe(39)
    expect(getUnitNumberForPrivateSlot(0, 1)).toBe(38)
    expect(getUnitNumberForPrivateSlot(1, 1)).toBe(39)
  })

  it('matches the complete unit sequence for the week beginning 1405/04/20', () => {
    expect(getPrivateUnitSequence(resolveWeeklySchedule(0))).toEqual(
      ANCHOR_SEQUENCE,
    )
  })

  it('matches the complete unit sequence for the week beginning 1405/04/27', () => {
    expect(getPrivateUnitSequence(resolveWeeklySchedule(1))).toEqual(
      NEXT_WEEK_SEQUENCE,
    )
  })

  it('assigns every unit exactly once for positive and negative offsets', () => {
    for (const weekOffset of [-80, -39, -1, 0, 1, 39, 80]) {
      const units = getPrivateUnitSequence(resolveWeeklySchedule(weekOffset))

      expect(units).toHaveLength(UNIT_COUNT)
      expect(new Set(units).size).toBe(UNIT_COUNT)
      expect([...units].sort((left, right) => left - right)).toEqual(ALL_UNITS)
    }
  })

  it('preserves public and cleaning slots while resolving private slots', () => {
    const resolved = resolveWeeklySchedule(1)

    for (const [dayIndex, fixedDay] of WEEKLY_SCHEDULE.entries()) {
      const resolvedDay = resolved.days[dayIndex]

      expect(resolvedDay.key).toBe(fixedDay.key)
      expect(resolvedDay.labelFa).toBe(fixedDay.labelFa)
      expect(resolvedDay.dayIndex).toBe(fixedDay.dayIndex)
      expect(resolvedDay.slots).toHaveLength(fixedDay.slots.length)

      for (const [slotIndex, fixedSlot] of fixedDay.slots.entries()) {
        const resolvedSlot = resolvedDay.slots[slotIndex]

        if (fixedSlot.kind === 'private') {
          expect(resolvedSlot).toEqual({
            ...fixedSlot,
            unitNumber: getUnitNumberForPrivateSlot(
              fixedSlot.privateSlotIndex,
              1,
            ),
          })
        } else {
          expect(resolvedSlot).toBe(fixedSlot)
        }
      }
    }
  })

  it('resolves a Date using the Tehran week offset', () => {
    const schedule = resolveWeeklyScheduleForDate(
      new Date('2026-07-18T12:00:00.000Z'),
    )

    expect(schedule.weekOffset).toBe(1)
    expect(getPrivateUnitSequence(schedule)).toEqual(NEXT_WEEK_SEQUENCE)
  })

  it('rejects invalid rotation inputs', () => {
    expect(() => positiveModulo(1.5, UNIT_COUNT)).toThrow()
    expect(() => positiveModulo(1, 0)).toThrow()
    expect(() => getUnitNumberForPrivateSlot(-1, 0)).toThrow()
    expect(() => getUnitNumberForPrivateSlot(UNIT_COUNT, 0)).toThrow()
    expect(() => resolveWeeklySchedule(0.5)).toThrow()
  })
})
