import { RISK } from '../plagio/risk'
import Icon from '../ui/Icon'
import styles from './Recent.module.css'

// Últimos TFI analizados en Detección de plagio.
function RecentPlagio({ analisis, onNavigate }) {
  return (
    <section className={`panel ${styles.panel}`} aria-labelledby="recent-plagio-title">
      <header className={styles.header}>
        <h2 id="recent-plagio-title" className="section-title">Análisis de plagio recientes</h2>
        <button className="link" onClick={() => onNavigate('plagio')}>
          Ver todos
          <Icon name="arrowRight" />
        </button>
      </header>

      <ul className={styles.cards}>
        {analisis.map((a) => {
          const risk = RISK[a.riesgo] || RISK.Bajo
          return (
            <li key={a.id}>
              <button className={styles.card} onClick={() => onNavigate('plagio')}>
                <span className={styles.primary} title={a.archivo}>{a.archivo}</span>
                <span className={styles.secondary}>{a.grupo} · {a.fecha}</span>
                <span className={styles.score}>
                  <span className="num" style={{ color: risk.text }}>{a.similitud}%</span>
                  <span className={`tag tag--plain tag--${risk.tone}`}>{a.riesgo}</span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default RecentPlagio
