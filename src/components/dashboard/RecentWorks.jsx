import CategoryBadge from '../correccion/CategoryBadge'
import Icon from '../ui/Icon'
import styles from './Recent.module.css'

// Últimos trabajos prácticos corregidos por la IA.
function RecentWorks({ trabajos, onNavigate }) {
  return (
    <section className={`panel ${styles.panel}`} aria-labelledby="recent-works-title">
      <header className={styles.header}>
        <h2 id="recent-works-title" className="section-title">Trabajos recientes</h2>
        <button className="link" onClick={() => onNavigate('correccion')}>
          Ver todos
          <Icon name="arrowRight" />
        </button>
      </header>

      <ul className={styles.list}>
        {trabajos.map((tp) => (
          <li key={tp.id}>
            <button className={styles.row} onClick={() => onNavigate('correccion', { search: tp.grupoLabel })}>
              <span className={styles.rowText}>
                <span className={styles.primary}>{tp.grupoLabel}</span>
                <span className={styles.secondary}>{tp.tp}</span>
              </span>
              <CategoryBadge categoria={tp.categoria} />
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default RecentWorks
