import { useState, useEffect } from 'react'
import CategoryBadge from './CategoryBadge'
import StatusBadge from './StatusBadge'
import styles from './TPDrawer.module.css'

/* ── Icon helpers ── */
const IconDoc = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
)

const IconAI = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)

const IconError = () => (
  <svg className={styles.listIcon} viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5">
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
)

const IconCheck = () => (
  <svg className={styles.listIcon} viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const IconTip = () => (
  <svg className={styles.listIcon} viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2.5">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
)

const IconNote = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)

const IconObs = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
)

function SectionTitle({ icon, title }) {
  return (
    <div className={styles.sectionHeader}>
      {icon}
      <h3 className={styles.sectionTitle}>{title}</h3>
    </div>
  )
}

function TPDrawer({ tp, onClose }) {
  const [nota, setNota] = useState(tp?.notaSugerida ?? tp?.nota ?? 0)
  const [observaciones, setObservaciones] = useState('')

  // Reset state when TP changes
  useEffect(() => {
    setNota(tp?.notaSugerida ?? tp?.nota ?? 0)
    setObservaciones('')
  }, [tp?.id])

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  if (!tp) return null

  const handleAction = (action) => {
    alert(`Acción: ${action}`)
  }

  const handleNotaChange = (e) => {
    const val = Math.min(10, Math.max(0, Number(e.target.value)))
    setNota(val)
  }

  return (
    <>
      {/* Overlay */}
      <div className={styles.overlay} onClick={onClose} />

      {/* Drawer */}
      <aside id="tp-drawer" className={styles.drawer}>

        {/* ── Header ── */}
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <div className={styles.badges}>
              <CategoryBadge category={tp.categoria} />
              <StatusBadge status={tp.estado} />
            </div>
            <button
              id="drawer-close-btn"
              className={styles.closeBtn}
              onClick={onClose}
              title="Cerrar"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <h2 className={styles.studentName}>{tp.nombre}</h2>

          <div className={styles.tpInfoRow}>
            <span className={styles.tpInfoPill}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              {tp.tp}
            </span>
            <span className={styles.tpInfoDivider} />
            <span className={styles.tpInfoPill}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              {tp.comision}
            </span>
            <span className={styles.tpInfoDivider} />
            <span className={styles.tpInfoPill}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {tp.fecha}
            </span>
          </div>
        </div>

        {/* ── Scrollable body ── */}
        <div className={styles.body}>

          {/* 1. Documento */}
          <div className={styles.section}>
            <SectionTitle icon={<IconDoc />} title="Documento completo" />
            <div className={styles.documentBox}>
              <p className={styles.documentText}>{tp.documento}</p>
            </div>
          </div>

          {/* 2. Comentarios IA */}
          <div className={styles.section}>
            <SectionTitle icon={<IconAI />} title="Comentarios de la IA" />
            <div className={styles.aiBox}>
              <p className={styles.aiText}>{tp.comentariosIA}</p>
            </div>
          </div>

          {/* 3. Errores */}
          <div className={styles.section}>
            <SectionTitle
              icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>}
              title={`Errores encontrados${tp.errores?.length ? ` (${tp.errores.length})` : ''}`}
            />
            {tp.errores?.length > 0 ? (
              <ul className={styles.itemList}>
                {tp.errores.map((err, i) => (
                  <li key={i} className={styles.listItem}>
                    <IconError />
                    <span>{err}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.emptyList}>No se encontraron errores.</p>
            )}
          </div>

          {/* 4. Fortalezas */}
          <div className={styles.section}>
            <SectionTitle
              icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>}
              title={`Fortalezas detectadas${tp.fortalezas?.length ? ` (${tp.fortalezas.length})` : ''}`}
            />
            {tp.fortalezas?.length > 0 ? (
              <ul className={styles.itemList}>
                {tp.fortalezas.map((f, i) => (
                  <li key={i} className={styles.listItem}>
                    <IconCheck />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.emptyList}>No se detectaron fortalezas.</p>
            )}
          </div>

          {/* 5. Recomendaciones */}
          {tp.recomendaciones?.length > 0 && (
            <div className={styles.section}>
              <SectionTitle
                icon={<IconTip />}
                title={`Recomendaciones de mejora (${tp.recomendaciones.length})`}
              />
              <ul className={styles.itemList}>
                {tp.recomendaciones.map((r, i) => (
                  <li key={i} className={styles.listItem}>
                    <IconTip />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 6. Nota sugerida */}
          <div className={styles.section}>
            <SectionTitle icon={<IconNote />} title="Nota sugerida" />
            <div className={styles.notaRow}>
              <input
                id="nota-sugerida-input"
                type="number"
                min="0"
                max="10"
                className={styles.notaInput}
                value={nota}
                onChange={handleNotaChange}
              />
              <span className={styles.notaLabel}>/ 10</span>
              <span className={styles.notaRange}>Podés modificar la nota antes de guardar</span>
            </div>
          </div>

          {/* 7. Observaciones */}
          <div className={styles.section}>
            <SectionTitle icon={<IconObs />} title="Observaciones de la docente" />
            <textarea
              id="observaciones-docente"
              className={styles.textarea}
              placeholder="Agregá observaciones o comentarios para el/la estudiante..."
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
            />
          </div>

        </div>

        {/* ── Fixed footer ── */}
        <div className={styles.footer}>
          <button
            id="drawer-btn-rechazar"
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
          <button
            id="drawer-btn-guardar"
            className={styles.btnSave}
            onClick={() => handleAction('Guardar')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            Guardar
          </button>
          <button
            id="drawer-btn-aceptar"
            className={styles.btnAccept}
            onClick={() => handleAction('Aceptar corrección')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Aceptar corrección
          </button>
        </div>
      </aside>
    </>
  )
}

export default TPDrawer
