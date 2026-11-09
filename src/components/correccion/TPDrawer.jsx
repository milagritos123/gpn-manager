import { useState, useEffect } from 'react'
import StatusBadge from './StatusBadge'
import Icon from '../ui/Icon'
import { useToast } from '../ui/Toast'
import styles from './TPDrawer.module.css'

const TABS = [
  { id: 'evaluacion', label: 'Evaluación' },
  { id: 'documento', label: 'Documento' },
  { id: 'decision', label: 'Tu decisión' },
]

const categoryTone = {
  'Regular': 'var(--cat-regular)',
  'Bueno': 'var(--cat-bueno)',
  'Muy Bueno': 'var(--cat-muybueno)',
  'Excelente': 'var(--cat-excelente)',
}

const pad = (n) => String(n).padStart(2, '0')

/* ── 01 · Evaluación ── */
function EvaluacionTab({ tp }) {
  const errores = tp.errores ?? []
  const recomendaciones = tp.recomendaciones ?? []
  const fortalezas = tp.fortalezas ?? []
  const filas = Math.max(errores.length, recomendaciones.length)

  return (
    <div className={styles.pane}>
      <h3 className={styles.blockTitle}>
        <Icon name="sparkle" className={styles.iconViolet} />
        Evaluación del agente de IA
      </h3>
      <blockquote className={styles.aiSummary}>{tp.comentariosIA}</blockquote>

      {filas > 0 && (
        <div className={styles.matrix}>
          <div className={styles.matrixHead}>
            <span>Errores encontrados · {errores.length}</span>
            <span className={styles.headViolet}>Recomendaciones de mejora · {recomendaciones.length}</span>
          </div>
          {Array.from({ length: filas }, (_, i) => (
            <div key={i} className={styles.matrixRow}>
              <div className={styles.cell}>
                {errores[i] && (
                  <>
                    <span className={`${styles.errIndex} num`}>{pad(i + 1)}</span>
                    <p>{errores[i]}</p>
                  </>
                )}
              </div>
              <div className={styles.cell}>
                {recomendaciones[i] && (
                  <>
                    <Icon name="arrowRight" size={14} className={styles.iconViolet} />
                    <p>{recomendaciones[i]}</p>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <h3 className={styles.blockTitle}>
        <Icon name="checkCircle" className={styles.iconGreen} />
        Fortalezas · {fortalezas.length}
      </h3>
      {fortalezas.length > 0 ? (
        <ul className={styles.strengths}>
          {fortalezas.map((text, i) => (
            <li key={i}>
              <Icon name="check" size={14} strokeWidth={2.25} className={styles.iconGreen} />
              {text}
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.empty}>No se detectaron fortalezas.</p>
      )}
    </div>
  )
}

/* ── 02 · Documento ── */
function DocumentoTab({ tp }) {
  return (
    <div className={styles.pane}>
      <h2 className={styles.paneTitle}>Documento entregado</h2>
      <p className={styles.paneSubtitle}>El archivo del grupo está cargado en OneDrive.</p>

      <div className={styles.fileCard}>
        <span className={styles.fileIcon}><Icon name="file" size={20} /></span>
        <div className={styles.fileInfo}>
          <p className={styles.fileName}>{tp.documentoNombre ?? 'Documento entregado'}</p>
          <p className={styles.fileMeta}>OneDrive · Entregado el {tp.fecha}</p>
        </div>
        {tp.documentoUrl ? (
          <a className="btn btn-primary" href={tp.documentoUrl} target="_blank" rel="noopener noreferrer">
            Abrir en OneDrive
            <Icon name="external" />
          </a>
        ) : (
          <span className={styles.empty}>Sin link cargado</span>
        )}
      </div>

      {tp.documento && (
        <>
          <h3 className={styles.blockTitle}>Extracto</h3>
          <div className={styles.document}>{tp.documento}</div>
        </>
      )}
    </div>
  )
}

/* ── 03 · Tu decisión ── */
function DecisionTab({ nota, setNota, sugerida, observaciones, setObservaciones }) {
  const clamp = (v) => Math.min(10, Math.max(0, v))
  const modificada = nota !== sugerida

  return (
    <div className={styles.pane}>
      <h2 className={styles.paneTitle}>Tu decisión</h2>
      <p className={styles.paneSubtitle}>Revisá la nota final y sumá tus observaciones para el grupo.</p>

      <div className={styles.decisionBox}>
        <div className={styles.gradeCard}>
          <div>
            <label htmlFor="nota-sugerida-input" className={styles.gradeLabel}>Nota final</label>
            <p className={styles.gradeHint}>
              {modificada ? (
                <>
                  Modificada · la IA sugirió <b className="num">{sugerida}</b>{' '}
                  <button className="link" onClick={() => setNota(sugerida)}>Restablecer</button>
                </>
              ) : (
                'Sugerida por la IA'
              )}
            </p>
          </div>
          <div className={styles.gradeControl}>
            <div className={styles.stepper}>
              <button onClick={() => setNota((n) => clamp(n - 1))} aria-label="Bajar nota" disabled={nota <= 0}>−</button>
              <input
                id="nota-sugerida-input"
                type="number"
                min="0"
                max="10"
                className="num"
                value={nota}
                onChange={(e) => setNota(clamp(Number(e.target.value)))}
              />
              <button onClick={() => setNota((n) => clamp(n + 1))} aria-label="Subir nota" disabled={nota >= 10}>+</button>
            </div>
            <span className={styles.outOf}>/ 10</span>
          </div>
        </div>

        <label htmlFor="observaciones-docente" className={styles.fieldLabel}>
          Observaciones para el grupo <span className={styles.optional}>Opcional</span>
        </label>
        <textarea
          id="observaciones-docente"
          className={`field ${styles.textarea}`}
          placeholder="Se suman a la devolución de la IA que reciben los alumnos."
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
        />

        <p className={styles.notice}>
          <Icon name="shield" />
          Ninguna nota se publica sin tu confirmación.
        </p>
      </div>
    </div>
  )
}

function TPDrawer({ tp, onClose }) {
  const notify = useToast()
  const sugerida = tp?.notaSugerida ?? tp?.nota ?? 0
  const [nota, setNota] = useState(sugerida)
  const [observaciones, setObservaciones] = useState('')
  const [tab, setTab] = useState(0)

  // Reset state when TP changes
  useEffect(() => {
    setNota(tp?.notaSugerida ?? tp?.nota ?? 0)
    setObservaciones('')
    setTab(0)
  }, [tp?.id])

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  if (!tp) return null

  const handleAction = (action) => {
    const messages = {
      aceptar: [`Corrección aceptada · ${tp.grupoLabel}`, `Nota final ${nota}/10`, 'success'],
      guardar: ['Cambios guardados como borrador', `${tp.grupoLabel} sigue pendiente de confirmación`, 'info'],
      rechazar: [`Corrección rechazada · ${tp.grupoLabel}`, 'El trabajo vuelve a revisión manual', 'danger'],
    }
    const [message, detail, tone] = messages[action]
    notify(message, { detail, tone })
    if (action !== 'guardar') onClose()
  }

  const isLast = tab === TABS.length - 1

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />

      <aside id="tp-drawer" className={`drawer ${styles.drawer}`} role="dialog" aria-modal="true" aria-labelledby="tp-drawer-title">
        {/* ── Header ── */}
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <p className={styles.eyebrow}>Revisión de entrega</p>
            <button id="drawer-close-btn" className="btn btn-icon" onClick={onClose} aria-label="Cerrar">
              <Icon name="close" size={18} />
            </button>
          </div>

          <div className={styles.headerMain}>
            <div className={styles.headerInfo}>
              <div className={styles.groupRow}>
                <span className={styles.groupLabel}>{tp.grupoLabel}</span>
                <StatusBadge estado={tp.estado} />
              </div>
              <h2 id="tp-drawer-title" className={styles.title}>{tp.tp}</h2>
              <p className={styles.meta}>Entregado el {tp.fecha}</p>
              <p className={styles.members}>{tp.integrantes?.join(', ')}</p>
            </div>

            <div className={styles.scoreBox} style={{ '--cat': categoryTone[tp.categoria] }}>
              <p className={styles.scoreLabel}>Sugerida por la IA</p>
              <p className={`${styles.score} num`}>
                {sugerida}<span> / 10</span>
              </p>
              <p className={styles.scoreCat} style={{ color: categoryTone[tp.categoria] }}>{tp.categoria}</p>
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className={styles.tabs} role="tablist">
          {TABS.map((t, i) => (
            <button
              key={t.id}
              role="tab"
              id={`tp-tab-${t.id}`}
              aria-selected={tab === i}
              className={styles.tab}
              onClick={() => setTab(i)}
            >
              <span className={`${styles.tabIndex} num`}>{pad(i + 1)}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Scrollable body ── */}
        <div className="drawer-body" role="tabpanel" aria-labelledby={`tp-tab-${TABS[tab].id}`}>
          {tab === 0 && <EvaluacionTab tp={tp} />}
          {tab === 1 && <DocumentoTab tp={tp} />}
          {tab === 2 && (
            <DecisionTab
              nota={nota}
              setNota={setNota}
              sugerida={sugerida}
              observaciones={observaciones}
              setObservaciones={setObservaciones}
            />
          )}
        </div>

        {/* ── Fixed footer ── */}
        <div className="drawer-footer">
          {isLast ? (
            <>
              <button id="drawer-btn-rechazar" className="btn btn-danger" onClick={() => handleAction('rechazar')}>
                Rechazar
              </button>
              <span className="spacer" />
              <button id="drawer-btn-guardar" className="btn btn-secondary" onClick={() => handleAction('guardar')}>
                Guardar borrador
              </button>
              <button id="drawer-btn-aceptar" className="btn btn-primary" onClick={() => handleAction('aceptar')}>
                <Icon name="check" strokeWidth={2.25} />
                Aceptar corrección
              </button>
            </>
          ) : (
            <>
              <span className={`${styles.stepInfo} num`}>
                {pad(tab + 1)} / {pad(TABS.length)} · {TABS[tab].label}
              </span>
              <span className="spacer" />
              <button className="btn btn-secondary" onClick={() => setTab(tab + 1)}>
                <Icon name="arrowRight" className={styles.iconViolet} />
                {tab === 0 ? 'Ver documento' : 'Ir a tu decisión'}
              </button>
            </>
          )}
        </div>
      </aside>
    </>
  )
}

export default TPDrawer
