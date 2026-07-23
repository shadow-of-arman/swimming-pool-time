import { describe, expect, it } from 'vitest'
import {
  formatJalaliConcise,
  formatJalaliFull,
  formatJalaliNumeric,
  formatJalaliWeekRange,
  getPersianCalendarDateParts,
  toPersianDigits,
} from './persianFormatting'

const firstAnchorSaturday = { year: 2026, month: 7, day: 11 }
const secondAnchorSaturday = { year: 2026, month: 7, day: 18 }

describe('Persian number and Jalali date formatting', () => {
  it('converts Latin and Arabic-Indic digits to Persian digits', () => {
    expect(toPersianDigits('39 - 2026/07/11')).toBe('۳۹ - ۲۰۲۶/۰۷/۱۱')
    expect(toPersianDigits('١٢٣٤٥٦٧٨٩٠')).toBe('۱۲۳۴۵۶۷۸۹۰')
    expect(toPersianDigits(-12.5)).toBe('-۱۲.۵')
  })

  it('extracts the two documented Jalali anchor Saturdays', () => {
    expect(getPersianCalendarDateParts(firstAnchorSaturday)).toEqual({
      year: 1405,
      month: 4,
      day: 20,
      monthNameFa: 'تیر',
      weekday: 'saturday',
      weekdayLabelFa: 'شنبه',
    })

    expect(getPersianCalendarDateParts(secondAnchorSaturday)).toEqual({
      year: 1405,
      month: 4,
      day: 27,
      monthNameFa: 'تیر',
      weekday: 'saturday',
      weekdayLabelFa: 'شنبه',
    })
  })

  it('formats numeric, concise, and full Persian date labels', () => {
    expect(formatJalaliNumeric(firstAnchorSaturday)).toBe('۱۴۰۵/۰۴/۲۰')
    expect(formatJalaliConcise(firstAnchorSaturday)).toBe('۲۰ تیر ۱۴۰۵')
    expect(formatJalaliFull(firstAnchorSaturday)).toBe('شنبه ۲۰ تیر ۱۴۰۵')
  })

  it('formats same-month and cross-month Saturday-to-Friday ranges', () => {
    expect(formatJalaliWeekRange(firstAnchorSaturday)).toBe(
      '۲۰ تا ۲۶ تیر ۱۴۰۵',
    )
    expect(formatJalaliWeekRange(secondAnchorSaturday)).toBe(
      '۲۷ تیر تا ۲ مرداد ۱۴۰۵',
    )
  })

  it('handles Persian month and year boundaries without local-time drift', () => {
    expect(
      getPersianCalendarDateParts({ year: 2026, month: 7, day: 22 }),
    ).toMatchObject({ year: 1405, month: 4, day: 31, monthNameFa: 'تیر' })

    expect(
      getPersianCalendarDateParts({ year: 2026, month: 7, day: 23 }),
    ).toMatchObject({ year: 1405, month: 5, day: 1, monthNameFa: 'مرداد' })

    expect(
      getPersianCalendarDateParts({ year: 2026, month: 3, day: 20 }),
    ).toMatchObject({ year: 1404, month: 12, day: 29, monthNameFa: 'اسفند' })

    expect(
      getPersianCalendarDateParts({ year: 2026, month: 3, day: 21 }),
    ).toMatchObject({
      year: 1405,
      month: 1,
      day: 1,
      monthNameFa: 'فروردین',
    })
  })

  it('rejects a week range that does not begin on Saturday', () => {
    expect(() =>
      formatJalaliWeekRange({ year: 2026, month: 7, day: 12 }),
    ).toThrow('must begin on Saturday')
  })
})
