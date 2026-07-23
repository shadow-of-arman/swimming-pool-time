import { describe, expect, it } from 'vitest'
import { resolveWeeklySchedule } from './resolvedSchedule'
import {
  applyScheduleOverrides,
  formatGregorianDateKey,
  type ScheduleOverrideConfiguration,
} from './scheduleOverrides'
import { ANCHOR_SATURDAY } from './tehranTime'

const anchorSchedule = resolveWeeklySchedule(0)

describe('manual schedule overrides', () => {
  it('keeps the generated schedule unchanged for empty configuration', () => {
    expect(applyScheduleOverrides(ANCHOR_SATURDAY, anchorSchedule, {})).toBe(
      anchorSchedule,
    )
  })

  it('swaps two unit assignments while preserving every unit exactly once', () => {
    const configuration: ScheduleOverrideConfiguration = {
      '2026-07-11': [
        {
          dayIndex: 0,
          slotIndex: 2,
          replacement: {
            kind: 'private',
            privateSlotIndex: 0,
            unitNumber: 1,
          },
        },
        {
          dayIndex: 0,
          slotIndex: 3,
          replacement: {
            kind: 'private',
            privateSlotIndex: 1,
            unitNumber: 39,
          },
        },
      ],
    }

    const result = applyScheduleOverrides(
      ANCHOR_SATURDAY,
      anchorSchedule,
      configuration,
    )

    expect(result.days[0].slots[2]).toMatchObject({
      kind: 'private',
      unitNumber: 1,
    })
    expect(result.days[0].slots[3]).toMatchObject({
      kind: 'private',
      unitNumber: 39,
    })
  })

  it('supports public and cleaning replacements without changing unit slots', () => {
    const result = applyScheduleOverrides(ANCHOR_SATURDAY, anchorSchedule, {
      '2026-07-11': [
        {
          dayIndex: 0,
          slotIndex: 0,
          replacement: { kind: 'public', audience: 'men' },
        },
        {
          dayIndex: 1,
          slotIndex: 7,
          replacement: { kind: 'public', audience: 'women' },
        },
      ],
    })

    expect(result.days[0].slots[0]).toEqual({
      kind: 'public',
      audience: 'men',
    })
    expect(result.days[1].slots[7]).toEqual({
      kind: 'public',
      audience: 'women',
    })
  })

  it('rejects invalid day and slot indexes', () => {
    expect(() =>
      applyScheduleOverrides(ANCHOR_SATURDAY, anchorSchedule, {
        '2026-07-11': [
          {
            dayIndex: 7,
            slotIndex: 0,
            replacement: { kind: 'cleaning' },
          },
        ],
      }),
    ).toThrow('day index is out of range')

    expect(() =>
      applyScheduleOverrides(ANCHOR_SATURDAY, anchorSchedule, {
        '2026-07-11': [
          {
            dayIndex: 0,
            slotIndex: 8,
            replacement: { kind: 'cleaning' },
          },
        ],
      }),
    ).toThrow('slot index is out of range')
  })

  it('rejects duplicate unit assignments in the final week', () => {
    expect(() =>
      applyScheduleOverrides(ANCHOR_SATURDAY, anchorSchedule, {
        '2026-07-11': [
          {
            dayIndex: 0,
            slotIndex: 2,
            replacement: {
              kind: 'private',
              privateSlotIndex: 0,
              unitNumber: 1,
            },
          },
        ],
      }),
    ).toThrow('every unit from 1 through 39 exactly once')
  })

  it('ignores overrides belonging to another valid week', () => {
    const result = applyScheduleOverrides(ANCHOR_SATURDAY, anchorSchedule, {
      '2026-07-18': [
        {
          dayIndex: 0,
          slotIndex: 0,
          replacement: { kind: 'cleaning' },
        },
      ],
    })

    expect(result).toBe(anchorSchedule)
  })

  it('validates canonical Saturday keys and date formatting', () => {
    expect(formatGregorianDateKey(ANCHOR_SATURDAY)).toBe('2026-07-11')

    expect(() =>
      applyScheduleOverrides(ANCHOR_SATURDAY, anchorSchedule, {
        '2026/07/11': [],
      }),
    ).toThrow('YYYY-MM-DD')

    expect(() =>
      applyScheduleOverrides(ANCHOR_SATURDAY, anchorSchedule, {
        '2026-07-12': [],
      }),
    ).toThrow('must be a Saturday')
  })
})
