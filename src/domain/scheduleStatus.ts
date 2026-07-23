import {
  TIME_RANGES,
  type TimeRange,
} from './schedule'
import {
  type ResolvedDayScheduleDefinition,
  type ResolvedScheduleSlotDefinition,
  type ResolvedWeeklySchedule,
} from './resolvedSchedule'
import {
  addCalendarDays,
  calendarDateToUtcMilliseconds,
  getTehranDateParts,
  getTehranTimeParts,
  MILLISECONDS_PER_DAY,
  type CalendarDate,
} from './tehranTime'

export interface ScheduleSlotPosition {
  readonly dayIndex: number
  readonly slotIndex: number
  readonly date: CalendarDate
  readonly day: ResolvedDayScheduleDefinition
  readonly slot: ResolvedScheduleSlotDefinition
  readonly timeRange: TimeRange
}

export interface DisplayedWeekStatus {
  readonly isCurrentWeek: boolean
  readonly currentDayIndex: number | null
  readonly activeSlot: ScheduleSlotPosition | null
  readonly nextSlot: ScheduleSlotPosition | null
}

function getCalendarDayDifference(
  startDate: CalendarDate,
  endDate: CalendarDate,
): number {
  const difference =
    (calendarDateToUtcMilliseconds(endDate) -
      calendarDateToUtcMilliseconds(startDate)) /
    MILLISECONDS_PER_DAY

  if (!Number.isInteger(difference)) {
    throw new Error(`Expected an integer calendar-day difference: ${difference}`)
  }

  return difference
}

function validateDisplayedWeek(
  displayedWeekStart: CalendarDate,
  schedule: ResolvedWeeklySchedule,
): void {
  const weekStartWeekday = new Date(
    calendarDateToUtcMilliseconds(displayedWeekStart),
  ).getUTCDay()

  if (weekStartWeekday !== 6) {
    throw new Error('The displayed schedule week must begin on Saturday.')
  }

  if (schedule.days.length !== 7) {
    throw new Error(`Expected seven schedule days, received ${schedule.days.length}.`)
  }

  for (const day of schedule.days) {
    if (day.slots.length !== TIME_RANGES.length) {
      throw new Error(
        `Expected ${TIME_RANGES.length} slots for ${day.key}, received ${day.slots.length}.`,
      )
    }
  }
}

function createSlotPosition(
  displayedWeekStart: CalendarDate,
  schedule: ResolvedWeeklySchedule,
  dayIndex: number,
  slotIndex: number,
): ScheduleSlotPosition {
  const day = schedule.days[dayIndex]
  const slot = day?.slots[slotIndex]
  const timeRange = TIME_RANGES[slotIndex]

  if (!day || !slot || !timeRange) {
    throw new Error(`Invalid schedule position: day ${dayIndex}, slot ${slotIndex}.`)
  }

  return {
    dayIndex,
    slotIndex,
    date: addCalendarDays(displayedWeekStart, dayIndex),
    day,
    slot,
    timeRange,
  }
}

function findNextSlot(
  displayedWeekStart: CalendarDate,
  schedule: ResolvedWeeklySchedule,
  currentDayIndex: number,
  minutesSinceMidnight: number,
): ScheduleSlotPosition | null {
  for (let dayIndex = currentDayIndex; dayIndex < schedule.days.length; dayIndex += 1) {
    for (let slotIndex = 0; slotIndex < TIME_RANGES.length; slotIndex += 1) {
      const timeRange = TIME_RANGES[slotIndex]

      if (dayIndex === currentDayIndex && timeRange.startMinutes <= minutesSinceMidnight) {
        continue
      }

      return createSlotPosition(
        displayedWeekStart,
        schedule,
        dayIndex,
        slotIndex,
      )
    }
  }

  return null
}

export function getDisplayedWeekStatus(
  now: Date,
  displayedWeekStart: CalendarDate,
  schedule: ResolvedWeeklySchedule,
): DisplayedWeekStatus {
  validateDisplayedWeek(displayedWeekStart, schedule)

  const tehranDate = getTehranDateParts(now)
  const tehranTime = getTehranTimeParts(now)
  const currentDayIndex = getCalendarDayDifference(
    displayedWeekStart,
    tehranDate,
  )
  const isCurrentWeek =
    currentDayIndex >= 0 && currentDayIndex < schedule.days.length

  if (!isCurrentWeek) {
    return {
      isCurrentWeek: false,
      currentDayIndex: null,
      activeSlot: null,
      nextSlot: null,
    }
  }

  const activeSlotIndex = TIME_RANGES.findIndex(
    (timeRange) =>
      tehranTime.minutesSinceMidnight >= timeRange.startMinutes &&
      tehranTime.minutesSinceMidnight < timeRange.endMinutes,
  )

  return {
    isCurrentWeek: true,
    currentDayIndex,
    activeSlot:
      activeSlotIndex === -1
        ? null
        : createSlotPosition(
            displayedWeekStart,
            schedule,
            currentDayIndex,
            activeSlotIndex,
          ),
    nextSlot: findNextSlot(
      displayedWeekStart,
      schedule,
      currentDayIndex,
      tehranTime.minutesSinceMidnight,
    ),
  }
}

export function isSchedulePosition(
  position: ScheduleSlotPosition | null,
  dayIndex: number,
  slotIndex: number,
): boolean {
  return position?.dayIndex === dayIndex && position.slotIndex === slotIndex
}
