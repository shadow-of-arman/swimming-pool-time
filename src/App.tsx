const projectFacts = [
  { label: 'شروع هفته', value: 'شنبه' },
  { label: 'منطقه زمانی', value: 'تهران' },
  { label: 'به‌روزرسانی برنامه', value: 'خودکار' },
]

function App() {
  return (
    <main className="app-shell">
      <section className="hero-card" aria-labelledby="page-title">
        <div className="status-badge">نسخه اولیه</div>
        <p className="eyebrow">استخر ساختمان</p>
        <h1 id="page-title">برنامه هفتگی استخر</h1>
        <p className="intro">
          این صفحه به‌زودی برنامه صحیح هر هفته را بر اساس ساعت تهران نمایش
          می‌دهد.
        </p>

        <dl className="facts-grid">
          {projectFacts.map((fact) => (
            <div className="fact-card" key={fact.label}>
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>

        <div className="notice" role="status">
          پیاده‌سازی محاسبه خودکار نوبت واحدها در مرحله بعد انجام می‌شود.
        </div>
      </section>
    </main>
  )
}

export default App
