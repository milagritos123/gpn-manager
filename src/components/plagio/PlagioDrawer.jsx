import { useEffect, useState } from 'react'
import ResultCard from './ResultCard'
import FragmentosSimilares from './FragmentosSimilares'
import Icon from '../ui/Icon'
import { useToast } from '../ui/Toast'
import { ESTADO, needsDecision } from './risk'
import styles from './PlagioDrawer.module.css'

export function usePlagioDecision(analisis, onDone) {
  const notify = useToast()
  return (action) => {
    const messages = {
      aprobar: ['Trabajo aprobado', 'success'],
      revision: ['Revisión solicitada al grupo', 'info'],
      rechazar: ['Trabajo rechazado', 'danger'],
    }
    const [message, tone] = messages[action]
    notify(message, { detail: analisis.archivo, tone })
    onDone?.()
  }
}

export function DecisionButtons({ onDecide }) {
  return (
    <>
      <button id="btn-rechazar" className="btn btn-danger" onClick={() => onDecide('rechazar')}>
        Rechazar
      </button>
      <span className="spacer" />
      <button id="btn-revision" className="btn btn-secondary" onClick={() => onDecide('revision')}>
        Solicitar revisión
      </button>
      <button id="btn-aprobar" className="btn btn-primary" onClick={() => onDecide('aprobar')}>
        <Icon name="check" strokeWidth={2.25} />
        Aprobar trabajo
      </button>
    </>
  )
}

function PlagioDrawer({ analisis, onClose }) {
  const [observaciones, setObservaciones] = useState('')
  const decide = usePlagioDecision(analisis, onClose)

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  if (!analisis) return null

  const estado = ESTADO[analisis.estado] || ESTADO.Pendiente
  const pending = needsDecision(analisis.estado)

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <aside id="plagio-drawer" className="drawer" role="dialog" aria-modal="true" aria-labelledby="plagio-drawer-title">
        <div className="drawer-header">
          <div className="drawer-header-top">
            <span className={`tag tag--${estado.tone}`}>{estado.label}</span>
            <button className="btn btn-icon" onClick={onClose} id="plagio-drawer-close" aria-label="Cerrar">
              <Icon name="close" size={18} />
            </button>
          </div>
          <h2 id="plagio-drawer-title" className="drawer-title">{analisis.archivo}</h2>
          <p className="drawer-meta">{analisis.grupo} · Analizado el {analisis.fecha}</p>
        </div>

        <div className="drawer-body">
          <section className="drawer-section">
            <ResultCard analisis={analisis} showFile={false} />
          </section>
          <section className="drawer-section">
            <FragmentosSimilares fragmentos={analisis.fragmentos} coincidencias={analisis.coincidencias} />
          </section>
          {pending && (
            <section className={`drawer-section ${styles.decision}`}>
              <label htmlFor="plagio-obs" className="drawer-section-title">Observaciones de la docente</label>
              <textarea
                id="plagio-obs"
                className="field"
                placeholder="Registrá el criterio de tu decisión (opcional)."
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
              />
            </section>
          )}
        </div>

        {pending && (
          <div className="drawer-footer">
            <DecisionButtons onDecide={decide} />
          </div>
        )}
      </aside>
    </>
  )
}

export default PlagioDrawer
