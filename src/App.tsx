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
  PUBLIC_AUDIENCE_LABELS_FA,
  TIME_RANGES,
} from './domain/schedule'
import {
  addCalendarDays,
  getLatestSaturdayInTehran,
  getWeekOffsetFromAnchor,
} from './domain/tehranTime'

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

function App() {
  const now = new Date()
  const weekStart = getLatestSaturdayInTehran(now)
  const weekOffset = getWeekOffsetFromAnchor(now)
  const schedule = resolveWeeklySchedule(weekOffset)
  const days = schedule.days.map((day) => {
    const date = addCalendarDays(weekStart, day.dayIndex)

    return {
      ...day,
      dateLabel: formatJalaliConcise(date),
    }
  })

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

        <div className="week-summary" aria-label="بازه هفته جاری">
          <span className="week-summary__label">هفته جاری</span>
          <strong>{formatJalaliWeekRange(weekStart)}</strong>
          <span className="week-summary__timezone">به وقت تهران</span>
        </div>
      </header>

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
      </ul>

      <section className="mobile-schedule" aria-label="برنامه روزهای هفته">
        {days.map((day) => (
          <article className="day-card" key={day.key}>
            <header className="day-card__header">
              <h2>{day.labelFa}</h2>
              <p>{day.dateLabel}</p>
            </header>

            <div className="day-card__slots">
              {day.slots.map((slot, slotIndex) => {
                const timeRange = TIME_RANGES[slotIndex]

                return (
                  <div className="slot-row" key={timeRange.id}>
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
        ))}
      </section>

      <section className="desktop-schedule" aria-label="جدول برنامه هفتگی">
        <div className="schedule-table-wrap">
          <table className="schedule-table">
            <caption className="sr-only">برنامه کامل هفته جاری استخر</caption>
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
              {days.map((day) => (
                <tr key={day.key}>
                  <th className="schedule-table__day" scope="row">
                    <strong>{day.labelFa}</strong>
                    <span>{day.dateLabel}</span>
                  </th>
                  {day.slots.map((slot, slotIndex) => (
                    <td
                      className={`schedule-cell schedule-cell--${slot.kind}`}
                      key={`${day.key}-${TIME_RANGES[slotIndex].id}`}
                    >
                      {getSlotLabel(slot)}
                    </td>
                  ))}
                </tr>
              ))}
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
