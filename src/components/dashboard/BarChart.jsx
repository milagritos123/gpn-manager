import styles from './BarChart.module.css'

const chartData = [
  { label: 'Regular', value: 4, color: '#EF4444' },
  { label: 'Bueno', value: 8, color: '#F59E0B' },
  { label: 'Muy Bueno', value: 12, color: '#7C3AED' },
  { label: 'Excelente', value: 7, color: '#10B981' },
]

const MAX_VALUE = 12
const CHART_HEIGHT = 130 // px for 100%
const GRID_STEPS = [0, 3, 6, 9, 12]

function BarChart() {
  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <h2 className={styles.title}>Distribución de Trabajos Prácticos</h2>
          <p className={styles.subtitle}>Clasificación por categoría de desempeño</p>
        </div>
        <div className={styles.improvement}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            <polyline points="17 6 23 6 23 12" />
          </svg>
          Mejora del 12%
        </div>
      </div>

      <div className={styles.chartArea}>
        {/* Chart with grid */}
        <div className={styles.chartContainer}>
          {/* Grid lines */}
          <div className={styles.gridLines}>
            {[...GRID_STEPS].reverse().map((step) => (
              <div key={step} className={styles.gridLine}>
                <span className={styles.gridLineLabel}>{step}</span>
                <div className={styles.gridLineSep} />
              </div>
            ))}
          </div>

          {/* Bars */}
          <div className={styles.barsWrapper}>
            {chartData.map((item) => {
              const heightPercent = (item.value / MAX_VALUE) * 100
              return (
                <div key={item.label} className={styles.barGroup}>
                  <div className={styles.barContainer}>
                    <div
                      className={styles.bar}
                      style={{
                        height: `${heightPercent}%`,
                        backgroundColor: item.color,
                      }}
                      title={`${item.label}: ${item.value}`}
                    />
                  </div>
                  <span className={styles.barLabel}>{item.label}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Legend */}
        <div className={styles.legend}>
          {chartData.map((item) => (
            <div key={item.label} className={styles.legendItem}>
              <div className={styles.legendDot} style={{ backgroundColor: item.color }} />
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BarChart
