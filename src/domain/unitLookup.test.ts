import { describe, expect, it } from 'vitest'
import { resolveWeeklySchedule } from './resolvedSchedule'
import { ANCHOR_SATURDAY } from './tehranTime'
import {
  findUnitSchedulePosition,
  isValidUnitNumber,
  parseStoredUnitNumber,
  persistSelectedUnit,
  readSelectedUnit,
  SELECTED_UNIT_STORAGE_KEY,
  type UnitSelectionStorage,
} from './unitLookup'

class MemoryStorage implements UnitSelectionStorage {
  readonly values = new Map<string, string>()
  readonly removedKeys: string[] = []

  getItem(key: string): string | null {
    return this.values.get(key) ?? null
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value)
  }

  removeItem(key: string): void {
    this.removedKeys.push(key)
    this.values.delete(key)
  }
}

describe('unit number validation and persistence', () => {
  it('accepts only integer unit numbers from 1 through 39', () => {
    expect(isValidUnitNumber(1)).toBe(true)
    expect(isValidUnitNumber(39)).toBe(true)
    expect(isValidUnitNumber(0)).toBe(false)
    expect(isValidUnitNumber(40)).toBe(false)
    expect(isValidUnitNumber(2.5)).toBe(false)
    expect(isValidUnitNumber('12')).toBe(false)
  })

  it('parses only canonical stored unit values', () => {
    expect(parseStoredUnitNumber(null)).toBeNull()
    expect(parseStoredUnitNumber('1')).toBe(1)
    expect(parseStoredUnitNumber(' 39 ')).toBe(39)
    expect(parseStoredUnitNumber('01')).toBeNull()
    expect(parseStoredUnitNumber('0')).toBeNull()
    expect(parseStoredUnitNumber('40')).toBeNull()
    expect(parseStoredUnitNumber('واحد 12')).toBeNull()
  })

  it('reads a valid stored unit and removes malformed values', () => {
    const storage = new MemoryStorage()
    storage.values.set(SELECTED_UNIT_STORAGE_KEY, '18')

    expect(readSelectedUnit(storage)).toBe(18)

    storage.values.set(SELECTED_UNIT_STORAGE_KEY, 'invalid')
    expect(readSelectedUnit(storage)).toBeNull()
    expect(storage.removedKeys).toContain(SELECTED_UNIT_STORAGE_KEY)
  })

  it('persists and clears valid unit selections', () => {
    const storage = new MemoryStorage()

    expect(persistSelectedUnit(storage, 27)).toBe(true)
    expect(storage.getItem(SELECTED_UNIT_STORAGE_KEY)).toBe('27')

    expect(persistSelectedUnit(storage, null)).toBe(true)
    expect(storage.getItem(SELECTED_UNIT_STORAGE_KEY)).toBeNull()
    expect(() => persistSelectedUnit(storage, 40)).toThrow(
      'between 1 and 39',
    )
  })

  it('recovers when browser storage operations are unavailable', () => {
    const blockedStorage: UnitSelectionStorage = {
      getItem: () => {
        throw new Error('blocked')
      },
      setItem: () => {
        throw new Error('blocked')
      },
      removeItem: () => {
        throw new Error('blocked')
      },
    }

    expect(readSelectedUnit(blockedStorage)).toBeNull()
    expect(persistSelectedUnit(blockedStorage, 12)).toBe(false)
  })
})

describe('unit schedule lookup', () => {
  it('finds the documented first private slot in the anchor week', () => {
    const position = findUnitSchedulePosition(
      ANCHOR_SATURDAY,
      resolveWeeklySchedule(0),
      39,
    )

    expect(position.dayIndex).toBe(0)
    expect(position.slotIndex).toBe(2)
    expect(position.day.key).toBe('saturday')
    expect(position.date).toEqual({ year: 2026, month: 7, day: 11 })
    expect(position.timeRange.id).toBe('12:00-13:30')
  })

  it('finds units on later days with the correct date and time', () => {
    const position = findUnitSchedulePosition(
      ANCHOR_SATURDAY,
      resolveWeeklySchedule(0),
      6,
    )

    expect(position.day.key).toBe('sunday')
    expect(position.date).toEqual({ year: 2026, month: 7, day: 12 })
    expect(position.timeRange.id).toBe('12:00-13:30')
  })

  it('uses the selected week rotation while browsing another week', () => {
    const position = findUnitSchedulePosition(
      { year: 2026, month: 7, day: 18 },
      resolveWeeklySchedule(1),
      38,
    )

    expect(position.day.key).toBe('saturday')
    expect(position.slotIndex).toBe(2)
    expect(position.date).toEqual({ year: 2026, month: 7, day: 18 })
  })

  it('rejects invalid unit numbers', () => {
    expect(() =>
      findUnitSchedulePosition(
        ANCHOR_SATURDAY,
        resolveWeeklySchedule(0),
        0,
      ),
    ).toThrow('between 1 and 39')
  })
})
