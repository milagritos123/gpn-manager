import { useState, useCallback } from 'react'
import DropZone from '../components/plagio/DropZone'
import ResultCard from '../components/plagio/ResultCard'
import FragmentosSimilares from '../components/plagio/FragmentosSimilares'
import HistorialPlagio from '../components/plagio/HistorialPlagio'
import PlagioDrawer, { DecisionButtons, usePlagioDecision } from '../components/plagio/PlagioDrawer'
import Icon from '../components/ui/Icon'
import { RISK } from '../components/plagio/risk'
import historialData from '../data/historialPlagio.json'
import styles from './DeteccionPlagio.module.css'

// Simulated result shown after "uploading"
const DEMO_RESULT = historialData[0]

const STATES = { IDLE: 'idle', ANALYZING: 'analyzing', RESULT: 'result' }

const riskCounts = ['Alto', 'Medio', 'Bajo'].map((r) => ({
  key: r,
  ...RISK[r],
  count: historialData.filter((h) => h.riesgo === r).length,
}))

function RiskSummary() {
  const total = historialData.length
  return (
    <section className={`panel ${styles.summary}`} aria-labelledby="risk-title">
      <h2 id="risk-title" className="eyebrow">Riesgo en TFI analizados</h2>
      <div className={styles.summaryBar} role="img" aria-label={riskCounts.map((r) => `${r.count} ${r.label}`).join(', ')}>
        {riskCounts.filter((r) => r.count > 0).map((r) => (
          <span key={r.key} style={{ flexGrow: r.count, background: r.color }} title={`${r.label}: ${r.count}`} />
        ))}
      </div>
      <ul className={styles.summaryList}>
        {riskCounts.map((r) => (
          <li key={r.key}>
            <span className={styles.summaryKey}><i style={{ background: r.color }} />{r.label}</span>
            <span className={`${styles.summaryVal} num`}>{r.count}</span>
            <span className={`${styles.summaryPct} num`}>{Math.round((r.count / total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

function DeteccionPlagio() {
  const [status, setStatus] = useState(STATES.IDLE)
  const [analisis, setAnalisis] = useState(null)
  const [pendingFile, setPendingFile] = useState('')
  const [observaciones, setObservaciones] = useState('')
  const [selectedHistorial, setSelectedHistorial] = useState(null)

  const handleFileAnalyzed = useCallback((fileName) => {
    setPendingFile(fileName)
    setStatus(STATES.ANALYZING)
    setTimeout(() => {
      setAnalisis({ ...DEMO_RESULT, archivo: fileName || DEMO_RESULT.archivo })
      setObservaciones('')
      setStatus(STATES.RESULT)
    }, 2000)
  }, [])

  const reset = () => {
    setStatus(STATES.IDLE)
    setAnalisis(null)
  }

  const decide = usePlagioDecision(analisis || DEMO_RESULT, reset)

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1 className="page-title">Detección de Plagio</h1>
          <p className="page-lede">
            Compará cada Trabajo Final Integrador con la base histórica de la cátedra antes de evaluarlo.
          </p>
        </div>
      </header>

      <div className={styles.top}>
        <DropZone
          onFileAnalyzed={handleFileAnalyzed}
          analyzing={status === STATES.ANALYZING}
          fileName={pendingFile}
        />
        <RiskSummary />
      </div>

      {/* Resultado del análisis recién hecho */}
      {status === STATES.RESULT && analisis && (
        <section className={`panel ${styles.result}`} aria-labelledby="result-title">
          <header className={styles.resultHeader}>
            <div>
              <p className="eyebrow">Nuevo análisis</p>
              <h2 id="result-title" className={styles.resultTitle}>{analisis.archivo}</h2>
            </div>
            <button className="btn btn-icon" onClick={reset} aria-label="Descartar resultado">
              <Icon name="close" size={18} />
            </button>
          </header>

          <div className={styles.resultGrid}>
            <ResultCard analisis={analisis} showFile={false} />
            <FragmentosSimilares fragmentos={analisis.fragmentos} coincidencias={analisis.coincidencias} />
          </div>

          <div className={styles.resultDecision}>
            <label htmlFor="observaciones-textarea" className={styles.obsLabel}>Observaciones de la docente</label>
            <textarea
              id="observaciones-textarea"
              className="field"
              placeholder="Registrá el criterio de tu decisión (opcional)."
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
            />
            <div className={styles.actions}>
              <DecisionButtons onDecide={decide} />
            </div>
          </div>
        </section>
      )}

      <HistorialPlagio historial={historialData} onVer={setSelectedHistorial} />

      {selectedHistorial && (
        <PlagioDrawer analisis={selectedHistorial} onClose={() => setSelectedHistorial(null)} />
      )}
    </div>
  )
}

export default DeteccionPlagio
