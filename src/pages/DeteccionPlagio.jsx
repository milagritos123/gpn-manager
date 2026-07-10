import { useState, useCallback } from 'react'
import DropZone from '../components/plagio/DropZone'
import ResultCard from '../components/plagio/ResultCard'
import FragmentosSimilares from '../components/plagio/FragmentosSimilares'
import HistorialPlagio from '../components/plagio/HistorialPlagio'
import PlagioDrawer from '../components/plagio/PlagioDrawer'
import historialData from '../data/historialPlagio.json'
import styles from './DeteccionPlagio.module.css'

// Simulated result shown after "uploading"
const DEMO_RESULT = historialData[0]

const STATES = { IDLE: 'idle', ANALYZING: 'analyzing', RESULT: 'result' }

function DeteccionPlagio() {
  const [status, setStatus] = useState(STATES.IDLE)
  const [analisis, setAnalisis] = useState(null)
  const [observaciones, setObservaciones] = useState('')
  const [selectedHistorial, setSelectedHistorial] = useState(null)

  const handleFileAnalyzed = useCallback((fileName) => {
    setStatus(STATES.ANALYZING)
    setTimeout(() => {
      setAnalisis({ ...DEMO_RESULT, archivo: fileName || DEMO_RESULT.archivo })
      setStatus(STATES.RESULT)
    }, 2000)
  }, [])

  const handleAction = (action) => {
    alert(`Acción: ${action}. En producción, esto actualizaría el estado en el backend.`)
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Detección Inteligente de Plagio en TFI</h1>
        <p className={styles.pageSubtitle}>
          Análisis de similitud con base histórica de Trabajos Finales Integradores
        </p>
      </div>

      {/* Drop zone */}
      <DropZone
        onFileAnalyzed={handleFileAnalyzed}
        analyzing={status === STATES.ANALYZING}
      />

      {/* Analysis result */}
      {status === STATES.RESULT && analisis && (
        <div className={styles.panel}>
          <ResultCard analisis={analisis} />
          <FragmentosSimilares
            fragmentos={analisis.fragmentos}
            coincidencias={analisis.coincidencias}
          />

          {/* Observations */}
          <div>
            <h3 className={styles.obsTitle}>Observaciones de la docente</h3>
            <textarea
              id="observaciones-textarea"
              className={styles.obsTextarea}
              placeholder="Agregar observaciones sobre el análisis..."
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className={styles.actions}>
            <button
              id="btn-aprobar"
              className={styles.btnApprove}
              onClick={() => handleAction('Aprobar trabajo')}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Aprobar trabajo
            </button>
            <button
              id="btn-revision"
              className={styles.btnRevision}
              onClick={() => handleAction('Solicitar revisión')}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              Solicitar revisión
            </button>
            <button
              id="btn-rechazar"
              className={styles.btnReject}
              onClick={() => handleAction('Rechazar')}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              Rechazar
            </button>
          </div>
        </div>
      )}

      {/* Historial */}
      <HistorialPlagio historial={historialData} onVer={setSelectedHistorial} />

      {/* Drawer */}
      {selectedHistorial && (
        <PlagioDrawer
          analisis={selectedHistorial}
          onClose={() => setSelectedHistorial(null)}
        />
      )}
    </div>
  )
}

export default DeteccionPlagio
