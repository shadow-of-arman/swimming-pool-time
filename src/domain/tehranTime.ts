import { WEEKDAY_KEYS, type WeekdayKey } from './schedule'

export const TEHRAN_TIME_ZONE = 'Asia/Tehran' as const
export const DAYS_PER_WEEK = 7 as const
export const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000

export interface CalendarDate {
  readonly year: number
  readonly month: number
  readonly day: number
}

export interface TehranDateParts extends CalendarDate {
  readonly weekday: WeekdayKey
  readonly weekdayIndex: number
}

export interface TehranTimeParts {
  readonly hour: number
  readonly minute: number
  readonly second: number
  readonly minutesSinceMidnight: number
}

export const ANCHOR_SATURDAY: CalendarDate = {
  year: 2026,
  month: 7,
  day: 11,
}

const tehranDateFormatter = new Intl.DateTimeFormat(
  'en-CA-u-ca-gregory-nu-latn',
  {
    timeZone: TEHRAN_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  },
)

const tehranTimeFormatter = new Intl.DateTimeFormat(
  'en-GB-u-ca-gregory-nu-latn',
  {
    timeZone: TEHRAN_TIME_ZONE,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  },
)

function assertValidDate(date: Date): void {
  if (Number.isNaN(date.getTime())) {
    throw new Error('Cannot extract Tehran date or time from an invalid Date.')
  }
}

function readIntegerPart(
  parts: readonly Intl.DateTimeFormatPart[],
  type: 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second',
  context: string,
): number {
  const value = parts.find((part) => part.type === type)?.value

  if (!value) {
    throw new Error(`Missing ${type} in ${context} formatting result.`)
  }

  const number = Number(value)

  if (!Number.isInteger(number)) {
    throw new Error(`Invalid ${type} in ${context} formatting result: ${value}`)
  }

  return number
}

export function calendarDateToUtcMilliseconds(date: CalendarDate): number {
  const value = Date.UTC(date.year, date.month - 1, date.day)
  const normalized = new Date(value)

  if (
    normalized.getUTCFullYear() !== date.year ||
    normalized.getUTCMonth() + 1 !== date.month ||
    normalized.getUTCDate() !== date.day
  ) {
    throw new Error(
      `Invalid Gregorian calendar date: ${date.year}-${date.month}-${date.day}`,
    )
  }

  return value
}

export function calendarDateFromUtcMilliseconds(value: number): CalendarDate {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid UTC timestamp: ${value}`)
  }

  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
  }
}

export function addCalendarDays(
  date: CalendarDate,
  dayOffset: number,
): CalendarDate {
  if (!Number.isInteger(dayOffset)) {
    throw new Error(`Day offset must be an integer: ${dayOffset}`)
  }

  return calendarDateFromUtcMilliseconds(
    calendarDateToUtcMilliseconds(date) + dayOffset * MILLISECONDS_PER_DAY,
  )
}

export function getTehranDateParts(date: Date): TehranDateParts {
  assertValidDate(date)

  const parts = tehranDateFormatter.formatToParts(date)
  const calendarDate: CalendarDate = {
    year: readIntegerPart(parts, 'year', 'Tehran date'),
    month: readIntegerPart(parts, 'month', 'Tehran date'),
    day: readIntegerPart(parts, 'day', 'Tehran date'),
  }
  const javaScriptWeekday = new Date(
    calendarDateToUtcMilliseconds(calendarDate),
  ).getUTCDay()
  const weekdayIndex = (javaScriptWeekday + 1) % DAYS_PER_WEEK
  const weekday = WEEKDAY_KEYS[weekdayIndex]

  return {
    ...calendarDate,
    weekday,
    weekdayIndex,
  }
}

export function getTehranTimeParts(date: Date): TehranTimeParts {
  assertValidDate(date)

  const parts = tehranTimeFormatter.formatToParts(date)
  const hour = readIntegerPart(parts, 'hour', 'Tehran time')
  const minute = readIntegerPart(parts, 'minute', 'Tehran time')
  const second = readIntegerPart(parts, 'second', 'Tehran time')

  if (hour < 0 || hour > 23 || minute < 0 || minute > 59 || second < 0 || second > 59) {
    throw new Error(
      `Invalid Tehran time values: ${hour}:${minute}:${second}`,
    )
  }

  return {
    hour,
    minute,
    second,
    minutesSinceMidnight: hour * 60 + minute,
  }
}

export function getLatestSaturdayInTehran(date: Date): CalendarDate {
  const tehranDate = getTehranDateParts(date)
  return addCalendarDays(tehranDate, -tehranDate.weekdayIndex)
}

export function getWeekOffsetFromAnchor(date: Date): number {
  const latestSaturday = getLatestSaturdayInTehran(date)
  const differenceInDays =
    (calendarDateToUtcMilliseconds(latestSaturday) -
      calendarDateToUtcMilliseconds(ANCHOR_SATURDAY)) /
    MILLISECONDS_PER_DAY

  if (
    !Number.isInteger(differenceInDays) ||
    differenceInDays % DAYS_PER_WEEK !== 0
  ) {
    throw new Error(
      `Expected a whole-week difference from anchor, received ${differenceInDays} days.`,
    )
  }

  return differenceInDays / DAYS_PER_WEEK
}
