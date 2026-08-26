import activityData from '../../data/activity.json'
import styles from './ActivityPanel.module.css'

const iconConfig = {
  correction: {
    bg: '#EDE9FE',
    color: '#7C3AED',
    svg: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    ),
  },
  alert: {
    bg: '#FEF2F2',
    color: '#EF4444',
    svg: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  accepted: {
    bg: '#ECFDF5',
    color: '#10B981',
    svg: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="12" cy="12" r="10" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
  },
  resource: {
    bg: '#FEF3C7',
    color: '#D97706',
    svg: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
}

function ActivityPanel({ onNavigate }) {
  const handleItemClick = (type) => {
    if (!onNavigate) return
    if (type === 'correction' || type === 'accepted') {
      onNavigate('correccion')
    } else if (type === 'alert') {
      onNavigate('plagio')
    } else if (type === 'resource') {
      onNavigate('asistente')
    }
  }

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <svg
          className={styles.headerIcon}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        <h3 className={styles.title}>Actividad reciente</h3>
      </div>

      <ul className={styles.list}>
        {activityData.map((item) => {
          const cfg = iconConfig[item.type] || iconConfig.correction
          return (
            <li
              key={item.id}
              className={styles.item}
              onClick={() => handleItemClick(item.type)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleItemClick(item.type)
                }
              }}
            >
              <div
                className={styles.itemIcon}
                style={{ backgroundColor: cfg.bg, color: cfg.color }}
              >
                {cfg.svg}
              </div>
              <div className={styles.itemContent}>
                <p className={styles.itemText}>{item.text}</p>
                <span className={styles.itemTime}>{item.time}</span>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default ActivityPanel
