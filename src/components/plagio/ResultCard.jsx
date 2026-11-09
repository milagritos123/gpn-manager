import { RISK, THRESHOLDS } from './risk'
import styles from './ResultCard.module.css'

// Escala lineal con las zonas de riesgo: muestra dónde cae el valor y qué tan cerca está del siguiente umbral.
function SimilarityScale({ value, color }) {
  return (
    <div className={styles.scale} role="img" aria-label={`Similitud ${value}% sobre 100`}>
      <div className={styles.track}>
        <span className={styles.zoneLow} style={{ width: `${THRESHOLDS.medio}%` }} />
        <span className={styles.zoneMid} style={{ width: `${THRESHOLDS.alto - THRESHOLDS.medio}%` }} />
        <span className={styles.zoneHigh} style={{ flex: 1 }} />
        <span className={styles.marker} style={{ left: `${value}%`, borderColor: color }} />
      </div>
      <div className={styles.ticks}>
        <span style={{ left: 0 }}>0</span>
        <span style={{ left: `${THRESHOLDS.medio}%` }}>{THRESHOLDS.medio}</span>
        <span style={{ left: `${THRESHOLDS.alto}%` }}>{THRESHOLDS.alto}</span>
        <span style={{ left: '100%' }}>100%</span>
      </div>
    </div>
  )
}

function ResultCard({ analisis, showFile = true }) {
  const risk = RISK[analisis.riesgo] || RISK.Bajo

  return (
    <div className={styles.result}>
      <div className={styles.top}>
        <div className={styles.score}>
          <span className="eyebrow">Similitud detectada</span>
          <span className={`${styles.pct} num`} style={{ color: risk.text }}>{analisis.similitud}%</span>
          <span className={`tag tag--${risk.tone}`}>{risk.label}</span>
        </div>
        <SimilarityScale value={analisis.similitud} color={risk.color} />
      </div>

      {analisis.riesgo !== 'Bajo' && (
        <p className={styles.note}>
          <strong>Posible caso de plagio: se recomienda revisión docente.</strong>{' '}
          El sistema no rechaza trabajos automáticamente; la decisión final es tuya.
        </p>
      )}

      <dl className={styles.meta}>
        {showFile && (
          <div className={styles.metaWide}>
            <dt>Documento</dt>
            <dd>{analisis.archivo}</dd>
          </div>
        )}
        <div>
          <dt>Grupo</dt>
          <dd>{analisis.grupo}</dd>
        </div>
        <div>
          <dt>Año de cursada</dt>
          <dd className="num">{analisis.anio}</dd>
        </div>
        <div>
          <dt>Fecha de análisis</dt>
          <dd>{analisis.fecha}</dd>
        </div>
        {analisis.integrantes?.length > 0 && (
          <div className={styles.metaWide}>
            <dt>Integrantes</dt>
            <dd>{analisis.integrantes.join(', ')}</dd>
          </div>
        )}
      </dl>
    </div>
  )
}

export default ResultCard
