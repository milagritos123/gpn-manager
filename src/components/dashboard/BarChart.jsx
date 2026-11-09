import styles from './BarChart.module.css'

// Orden ordinal: de menor a mayor desempeño
const chartData = [
  { label: 'Regular', value: 4, color: 'var(--cat-regular)' },
  { label: 'Bueno', value: 8, color: 'var(--cat-bueno)' },
  { label: 'Muy Bueno', value: 12, color: 'var(--cat-muybueno)' },
  { label: 'Excelente', value: 7, color: 'var(--cat-excelente)' },
]

const TOTAL = chartData.reduce((sum, d) => sum + d.value, 0)
const MAX_VALUE = Math.max(...chartData.map((d) => d.value))
// Eje Y en cuatro tramos enteros
const STEP = Math.max(1, Math.ceil(MAX_VALUE / 4))
const AXIS_MAX = STEP * 4
const TICKS = [4, 3, 2, 1, 0].map((i) => i * STEP)
const pct = (v) => Math.round((v / TOTAL) * 100)

function BarChart({ onNavigate }) {
  return (
    <section className={`panel ${styles.panel}`} aria-labelledby="dist-title">
      <header>
        <h2 id="dist-title" className="section-title">Distribución de calificaciones</h2>
        <p className={styles.subtitle}>{TOTAL} trabajos prácticos corregidos, por categoría</p>
      </header>

      <div className={styles.chart}>
        <ul className={styles.axis} aria-hidden="true">
          {TICKS.map((t) => <li key={t} className="num">{t}</li>)}
        </ul>

        <div className={styles.plot}>
          <div className={styles.grid} aria-hidden="true">
            {TICKS.map((t) => <span key={t} />)}
          </div>

          <ul className={styles.bars}>
            {chartData.map((item) => (
              <li key={item.label}>
                <button
                  className={styles.col}
                  onClick={() => onNavigate('correccion', { categoria: item.label })}
                  aria-label={`${item.label}: ${item.value} trabajos, ${pct(item.value)}%. Ver en Corrección de TP`}
                >
                  <span
                    className={styles.bar}
                    style={{ height: `${(item.value / AXIS_MAX) * 100}%`, background: item.color }}
                  >
                    <span className={`${styles.barValue} num`}>{item.value}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <span />
        <ul className={styles.labels} aria-hidden="true">
          {chartData.map((item) => <li key={item.label}>{item.label}</li>)}
        </ul>
      </div>
    </section>
  )
}

export default BarChart
