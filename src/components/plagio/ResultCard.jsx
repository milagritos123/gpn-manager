import styles from './ResultCard.module.css'

const RISK_CONFIG = {
  Alto:  { cardCls: styles.cardAlto,  color: '#EF4444', trackColor: '#FECACA', label: 'Alto riesgo' },
  Medio: { cardCls: styles.cardMedio, color: '#F59E0B', trackColor: '#FDE68A', label: 'Riesgo medio' },
  Bajo:  { cardCls: styles.cardBajo,  color: '#10B981', trackColor: '#A7F3D0', label: 'Bajo riesgo' },
}

function CirclePercent({ value, color, trackColor }) {
  const r = 34
  const circ = 2 * Math.PI * r
  const dash = (value / 100) * circ
  return (
    <div className={styles.percentCircle}>
      <svg width="80" height="80" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={r} fill="none" stroke={trackColor} strokeWidth="7" />
        <circle
          cx="40" cy="40" r={r}
          fill="none"
          stroke={color}
          strokeWidth="7"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
        />
      </svg>
      <span className={styles.percentText}>{value}%</span>
    </div>
  )
}

function ResultCard({ analisis }) {
  const cfg = RISK_CONFIG[analisis.riesgo] || RISK_CONFIG.Bajo

  return (
    <div className={`${styles.card} ${cfg.cardCls}`}>
      {/* Top row: circle + info + filename */}
      <div className={styles.topRow}>
        <div className={styles.leftGroup}>
          <CirclePercent value={analisis.similitud} color={cfg.color} trackColor={cfg.trackColor} />
          <div>
            <p className={styles.similarityLabel}>Similitud detectada</p>
            <span className={styles.riskBadge} style={{ color: cfg.color }}>
              <span className={styles.riskDot} style={{ backgroundColor: cfg.color }} />
              {cfg.label}
            </span>
          </div>
        </div>
        <div className={styles.fileInfo}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          {analisis.archivo}
        </div>
      </div>

      {/* Alert */}
      {analisis.riesgo !== 'Bajo' && (
        <div className={styles.alert}>
          <div className={styles.alertMain}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            Posible caso de plagio detectado. Se recomienda revisión docente.
          </div>
          <p className={styles.alertSub}>
            El sistema no rechaza automáticamente el trabajo. La decisión final queda en manos de la docente.
          </p>
        </div>
      )}

      {/* Meta */}
      <div className={styles.metaRow}>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Autor
          </span>
          <span className={styles.metaValue}>{analisis.autor}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
            Carrera
          </span>
          <span className={styles.metaValue}>{analisis.carrera}</span>
        </div>
        <div className={styles.metaItem}>
          <span className={styles.metaLabel}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Fecha de análisis
          </span>
          <span className={styles.metaValue}>{analisis.fecha}</span>
        </div>
      </div>
    </div>
  )
}

export default ResultCard
