import { useEffect, useState } from 'react'
import {
  formatJalaliConcise,
  formatJalaliWeekRange,
  toPersianDigits,
} from './domain/persianFormatting'
import {
  resolveWeeklySchedule,
  type ResolvedScheduleSlotDefinition,
} from './domain/resolvedSchedule'
import {
  getDisplayedWeekStatus,
  isSchedulePosition,
  type ScheduleSlotPosition,
} from './domain/scheduleStatus'
import {
  PUBLIC_AUDIENCE_LABELS_FA,
  TIME_RANGES,
  UNIT_COUNT,
} from './domain/schedule'
import {
  addCalendarDays,
  getLatestSaturdayInTehran,
  getWeekOffsetFromAnchor,
} from './domain/tehranTime'
import {
  findUnitSchedulePosition,
  isValidUnitNumber,
  persistSelectedUnit,
  readSelectedUnit,
} from './domain/unitLookup'
import { getDisplayedWeekSelection } from './domain/weekNavigation'

const UNIT_OPTIONS = Array.from({ length: UNIT_COUNT }, (_, index) => index + 1)

function getSlotLabel(slot: ResolvedScheduleSlotDefinition): string {
  switch (slot.kind) {
    case 'public':
      return PUBLIC_AUDIENCE_LABELS_FA[slot.audience]
    case 'private':
      return `واحد ${toPersianDigits(slot.unitNumber)}`
    case 'cleaning':
      return 'نظافت'
  }
}

function getPositionDetails(position: ScheduleSlotPosition) {
  return {
    slotLabel: getSlotLabel(position.slot),
    dayLabel: position.day.labelFa,
    dateLabel: formatJalaliConcise(position.date),
    timeLabel: position.timeRange.labelFa,
  }
}

function getInitialSelectedUnit(): number | null {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    return readSelectedUnit(window.localStorage)
  } catch {
    return null
  }
}

function saveSelectedUnit(unitNumber: number | null): void {
  if (typeof window === 'undefined') {
    return
  }

  try {
    persistSelectedUnit(window.localStorage, unitNumber)
  } catch {
    // Storage availability must not prevent schedule use.
  }
}

function useCurrentTime(): Date {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30_000)
    return () => window.clearInterval(timer)
  }, [])

  return now
}

function App() {
  const now = useCurrentTime()
  const [relativeWeekOffset, setRelativeWeekOffset] = useState(0)
  const [selectedUnit, setSelectedUnit] = useState<number | null>(
    getInitialSelectedUnit,
  )
  const liveWeekStart = getLatestSaturdayInTehran(now)
  const liveWeekOffset = getWeekOffsetFromAnchor(now)
  const displayedWeek = getDisplayedWeekSelection(
    liveWeekStart,
    liveWeekOffset,
    relativeWeekOffset,
  )
  const schedule = resolveWeeklySchedule(displayedWeek.weekOffsetFromAnchor)
  const status = getDisplayedWeekStatus(now, displayedWeek.weekStart, schedule)
  const activeDetails = status.activeSlot
    ? getPositionDetails(status.activeSlot)
    : null
  const nextDetails = status.nextSlot
    ? getPositionDetails(status.nextSlot)
    : null
  const selectedUnitPosition =
    selectedUnit === null
      ? null
      : findUnitSchedulePosition(
          displayedWeek.weekStart,
          schedule,
          selectedUnit,
        )
  const selectedUnitDetails = selectedUnitPosition
    ? getPositionDetails(selectedUnitPosition)
    : null
  const days = schedule.days.map((day) => {
    const date = addCalendarDays(displayedWeek.weekStart, day.dayIndex)

    return {
      ...day,
      dateLabel: formatJalaliConcise(date),
    }
  })

  const handleSelectedUnitChange = (value: string) => {
    const parsedUnit = value === '' ? null : Number(value)

    if (parsedUnit !== null && !isValidUnitNumber(parsedUnit)) {
      return
    }

    setSelectedUnit(parsedUnit)
    saveSelectedUnit(parsedUnit)
  }

  return (
    <main className="app-shell">
      <header className="page-header">
        <div className="page-heading">
          <p className="eyebrow">استخر ساختمان</p>
          <h1>برنامه هفتگی استخر</h1>
          <p className="page-summary">
            برنامه به‌صورت خودکار بر اساس ساعت تهران محاسبه می‌شود و هر هفته
            از روز شنبه آغاز می‌شود.
          </p>
        </div>

        <div
          className="week-summary"
          aria-label={`بازه ${displayedWeek.labelFa}`}
        >
          <span className="week-summary__label">{displayedWeek.labelFa}</span>
          <strong>{formatJalaliWeekRange(displayedWeek.weekStart)}</strong>
          <span className="week-summary__timezone">به وقت تهران</span>
        </div>
      </header>

      <nav className="week-navigation" aria-label="جابجایی بین هفته‌ها">
        <button
          type="button"
          onClick={() => setRelativeWeekOffset((offset) => offset - 1)}
        >
          هفته قبل
        </button>
        <button
          className="week-navigation__current"
          type="button"
          disabled={displayedWeek.isCurrentWeek}
          onClick={() => setRelativeWeekOffset(0)}
        >
          هفته جاری
        </button>
        <button
          type="button"
          onClick={() => setRelativeWeekOffset((offset) => offset + 1)}
        >
          هفته بعد
        </button>
      </nav>

      <section className="unit-lookup" aria-labelledby="unit-lookup-title">
        <div className="unit-lookup__intro">
          <div>
            <p className="unit-lookup__eyebrow">جستجوی نوبت شخصی</p>
            <h2 id="unit-lookup-title">نوبت واحد من</h2>
            <p>
              شماره واحد را انتخاب کنید تا نوبت آن در هفته نمایش‌داده‌شده مشخص
              شود.
            </p>
          </div>

          <label className="unit-lookup__selector">
            <span>شماره واحد</span>
            <select
              value={selectedUnit ?? ''}
              onChange={(event) =>
                handleSelectedUnitChange(event.currentTarget.value)
              }
            >
              <option value="">انتخاب واحد</option>
              {UNIT_OPTIONS.map((unitNumber) => (
                <option value={unitNumber} key={unitNumber}>
                  واحد {toPersianDigits(unitNumber)}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div
          className={`unit-lookup__result${selectedUnitDetails ? '' : ' unit-lookup__result--empty'}`}
          aria-live="polite"
        >
          {selectedUnitDetails && selectedUnit !== null ? (
            <>
              <span className="unit-lookup__result-label">
                نوبت {displayedWeek.labelFa}
              </span>
              <strong>واحد {toPersianDigits(selectedUnit)}</strong>
              <p>
                {selectedUnitDetails.dayLabel}، {selectedUnitDetails.dateLabel}
              </p>
              <bdi className="unit-lookup__time" dir="rtl">
                {selectedUnitDetails.timeLabel}
              </bdi>
            </>
          ) : (
            <p>
              پس از انتخاب شماره واحد، روز و ساعت نوبت آن در این بخش نمایش داده
              می‌شود.
            </p>
          )}
        </div>
      </section>

      {displayedWeek.isCurrentWeek ? (
        <section
          className="period-status"
          aria-label="وضعیت نوبت‌های استخر"
          aria-live="polite"
        >
          <article className="period-card period-card--current">
            <span className="period-card__label">نوبت در حال اجرا</span>
            <strong>
              {activeDetails?.slotLabel ?? 'در حال حاضر نوبتی در جریان نیست'}
            </strong>
            {activeDetails ? (
              <p className="period-card__meta">
                {activeDetails.dayLabel}، {activeDetails.dateLabel}
                <bdi className="period-card__time" dir="rtl">
                  {activeDetails.timeLabel}
                </bdi>
              </p>
            ) : (
              <p className="period-card__meta">
                {nextDetails
                  ? 'در فاصله بین نوبت‌ها یا پیش از شروع برنامه روزانه هستید.'
                  : 'برنامه این هفته به پایان رسیده است.'}
              </p>
            )}
          </article>

          <article className="period-card period-card--next">
            <span className="period-card__label">نوبت بعدی</span>
            <strong>
              {nextDetails?.slotLabel ??
                'نوبت دیگری در این هفته باقی نمانده است'}
            </strong>
            {nextDetails ? (
              <p className="period-card__meta">
                {nextDetails.dayLabel}، {nextDetails.dateLabel}
                <bdi className="period-card__time" dir="rtl">
                  {nextDetails.timeLabel}
                </bdi>
              </p>
            ) : (
              <p className="period-card__meta">
                هفته بعد از روز شنبه آغاز می‌شود.
              </p>
            )}
          </article>
        </section>
      ) : (
        <section className="browsing-week-note" aria-live="polite">
          <strong>در حال مشاهده {displayedWeek.labelFa}</strong>
          <p>
            وضعیت زنده، امروز و نوبت بعدی فقط هنگام نمایش هفته جاری مشخص
            می‌شوند.
          </p>
        </section>
      )}

      <ul className="schedule-legend" aria-label="راهنمای برنامه">
        <li>
          <span className="legend-mark legend-mark--public" />
          زمان عمومی
        </li>
        <li>
          <span className="legend-mark legend-mark--private" />
          نوبت واحدها
        </li>
        <li>
          <span className="legend-mark legend-mark--cleaning" />
          نظافت
        </li>
        {selectedUnit !== null ? (
          <li>
            <span className="legend-mark legend-mark--selected-unit" />
            واحد انتخاب‌شده
          </li>
        ) : null}
        {displayedWeek.isCurrentWeek ? (
          <>
            <li>
              <span className="legend-mark legend-mark--active" />
              نوبت در حال اجرا
            </li>
            <li>
              <span className="legend-mark legend-mark--next" />
              نوبت بعدی
            </li>
          </>
        ) : null}
      </ul>

      <section className="mobile-schedule" aria-label="برنامه روزهای هفته">
        {days.map((day) => {
          const isToday = status.currentDayIndex === day.dayIndex

          return (
            <article
              className={`day-card${isToday ? ' day-card--today' : ''}`}
              key={day.key}
              aria-current={isToday ? 'date' : undefined}
            >
              <header className="day-card__header">
                <div className="day-card__title">
                  <h2>{day.labelFa}</h2>
                  {isToday ? <span className="today-badge">امروز</span> : null}
                </div>
                <p>{day.dateLabel}</p>
              </header>

              <div className="day-card__slots">
                {day.slots.map((slot, slotIndex) => {
                  const timeRange = TIME_RANGES[slotIndex]
                  const isActive = isSchedulePosition(
                    status.activeSlot,
                    day.dayIndex,
                    slotIndex,
                  )
                  const isNext = isSchedulePosition(
                    status.nextSlot,
                    day.dayIndex,
                    slotIndex,
                  )
                  const isSelectedUnit =
                    selectedUnit !== null &&
                    slot.kind === 'private' &&
                    slot.unitNumber === selectedUnit

                  return (
                    <div
                      className={`slot-row${isActive ? ' slot-row--active' : ''}${isNext ? ' slot-row--next' : ''}${isSelectedUnit ? ' slot-row--selected-unit' : ''}`}
                      key={timeRange.id}
                      aria-current={isActive ? 'time' : undefined}
                    >
                      <bdi className="slot-time" dir="rtl">
                        {timeRange.labelFa}
                      </bdi>
                      <span className={`slot-value slot-value--${slot.kind}`}>
                        {getSlotLabel(slot)}
                      </span>
                    </div>
                  )
                })}
              </div>
            </article>
          )
        })}
      </section>

      <section className="desktop-schedule" aria-label="جدول برنامه هفتگی">
        <div className="schedule-table-wrap">
          <table className="schedule-table">
            <caption className="sr-only">
              برنامه کامل {displayedWeek.labelFa} استخر
            </caption>
            <thead>
              <tr>
                <th className="schedule-table__day-heading" scope="col">
                  روز
                </th>
                {TIME_RANGES.map((timeRange) => (
                  <th scope="col" key={timeRange.id}>
                    <bdi dir="rtl">{timeRange.labelFa}</bdi>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {days.map((day) => {
                const isToday = status.currentDayIndex === day.dayIndex

                return (
                  <tr
                    className={
                      isToday ? 'schedule-table__row--today' : undefined
                    }
                    key={day.key}
                  >
                    <th
                      className="schedule-table__day"
                      scope="row"
                      aria-current={isToday ? 'date' : undefined}
                    >
                      <div className="schedule-table__day-name">
                        <strong>{day.labelFa}</strong>
                        {isToday ? (
                          <span className="table-today-badge">امروز</span>
                        ) : null}
                      </div>
                      <span className="schedule-table__date">
                        {day.dateLabel}
                      </span>
                    </th>
                    {day.slots.map((slot, slotIndex) => {
                      const isActive = isSchedulePosition(
                        status.activeSlot,
                        day.dayIndex,
                        slotIndex,
                      )
                      const isNext = isSchedulePosition(
                        status.nextSlot,
                        day.dayIndex,
                        slotIndex,
                      )
                      const isSelectedUnit =
                        selectedUnit !== null &&
                        slot.kind === 'private' &&
                        slot.unitNumber === selectedUnit

                      return (
                        <td
                          className={`schedule-cell schedule-cell--${slot.kind}${isActive ? ' schedule-cell--active' : ''}${isNext ? ' schedule-cell--next' : ''}${isSelectedUnit ? ' schedule-cell--selected-unit' : ''}`}
                          key={`${day.key}-${TIME_RANGES[slotIndex].id}`}
                          aria-current={isActive ? 'time' : undefined}
                        >
                          {getSlotLabel(slot)}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      <p className="schedule-note">
        این برنامه بر اساس الگوی چرخش هفتگی واحدها نمایش داده می‌شود.
      </p>
    </main>
  )
}

export default App
