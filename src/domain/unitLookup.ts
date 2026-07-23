import { TIME_RANGES, UNIT_COUNT, type TimeRange } from './schedule'
import {
  type ResolvedDayScheduleDefinition,
  type ResolvedPrivateSlotDefinition,
  type ResolvedWeeklySchedule,
} from './resolvedSchedule'
import { addCalendarDays, type CalendarDate } from './tehranTime'

export const SELECTED_UNIT_STORAGE_KEY = 'swimming-pool:selected-unit' as const

export interface UnitSelectionStorage {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

export interface UnitSchedulePosition {
  readonly unitNumber: number
  readonly dayIndex: number
  readonly slotIndex: number
  readonly date: CalendarDate
  readonly day: ResolvedDayScheduleDefinition
  readonly slot: ResolvedPrivateSlotDefinition
  readonly timeRange: TimeRange
}

export function isValidUnitNumber(value: unknown): value is number {
  return (
    typeof value === 'number' &&
    Number.isInteger(value) &&
    value >= 1 &&
    value <= UNIT_COUNT
  )
}

export function parseStoredUnitNumber(value: string | null): number | null {
  if (value === null) {
    return null
  }

  const normalized = value.trim()

  if (!/^(?:[1-9]|[12]\d|3\d)$/.test(normalized)) {
    return null
  }

  const unitNumber = Number(normalized)
  return isValidUnitNumber(unitNumber) ? unitNumber : null
}

export function readSelectedUnit(
  storage: UnitSelectionStorage,
): number | null {
  try {
    const storedValue = storage.getItem(SELECTED_UNIT_STORAGE_KEY)
    const unitNumber = parseStoredUnitNumber(storedValue)

    if (storedValue !== null && unitNumber === null) {
      try {
        storage.removeItem(SELECTED_UNIT_STORAGE_KEY)
      } catch {
        // A blocked storage cleanup should not prevent the schedule from loading.
      }
    }

    return unitNumber
  } catch {
    return null
  }
}

export function persistSelectedUnit(
  storage: UnitSelectionStorage,
  unitNumber: number | null,
): boolean {
  if (unitNumber !== null && !isValidUnitNumber(unitNumber)) {
    throw new Error(
      `Unit number must be an integer between 1 and ${UNIT_COUNT}: ${unitNumber}`,
    )
  }

  try {
    if (unitNumber === null) {
      storage.removeItem(SELECTED_UNIT_STORAGE_KEY)
    } else {
      storage.setItem(SELECTED_UNIT_STORAGE_KEY, String(unitNumber))
    }

    return true
  } catch {
    return false
  }
}

export function findUnitSchedulePosition(
  displayedWeekStart: CalendarDate,
  schedule: ResolvedWeeklySchedule,
  unitNumber: number,
): UnitSchedulePosition {
  if (!isValidUnitNumber(unitNumber)) {
    throw new Error(
      `Unit number must be an integer between 1 and ${UNIT_COUNT}: ${unitNumber}`,
    )
  }

  let result: UnitSchedulePosition | null = null

  for (const day of schedule.days) {
    for (let slotIndex = 0; slotIndex < day.slots.length; slotIndex += 1) {
      const slot = day.slots[slotIndex]

      if (slot.kind !== 'private' || slot.unitNumber !== unitNumber) {
        continue
      }

      const timeRange = TIME_RANGES[slotIndex]

      if (!timeRange) {
        throw new Error(
          `Missing time range for day ${day.dayIndex}, slot ${slotIndex}.`,
        )
      }

      if (result) {
        throw new Error(`Unit ${unitNumber} appears more than once in the week.`)
      }

      result = {
        unitNumber,
        dayIndex: day.dayIndex,
        slotIndex,
        date: addCalendarDays(displayedWeekStart, day.dayIndex),
        day,
        slot,
        timeRange,
      }
    }
  }

  if (!result) {
    throw new Error(`Unit ${unitNumber} does not appear in the displayed week.`)
  }

  return result
}
