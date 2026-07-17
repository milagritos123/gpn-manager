import { useState, useEffect } from 'react'
import styles from './AlumnoDrawer.module.css'

const CAT_CLASSES = {
  'Regular':   styles.catRegular,
  'Bueno':     styles.catBueno,
  'Muy Bueno': styles.catMuyBueno,
  'Excelente': styles.catExcelente,
}

const ESTADO_CLASSES = {
  'Activo':    styles.estadoActivo,
  'En riesgo': styles.estadoEnRiesgo,
  'Irregular': styles.estadoIrregular,
}

function AlumnoDrawer({ alumno, onClose }) {
  const [notaTFI, setNotaTFI]       = useState(alumno?.notaTFI ?? '')
  const [concepto, setConcepto]     = useState(alumno?.conceptoExposicion ?? '')
  const [observaciones, setObs]     = useState(alumno?.observaciones ?? '')

  useEffect(() => {
    setNotaTFI(alumno?.notaTFI ?? '')
    setConcepto(alumno?.conceptoExposicion ?? '')
    setObs(alumno?.observaciones ?? '')
  }, [alumno?.id])

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  if (!alumno) return null

  const estadoClass = ESTADO_CLASSES[alumno.estado] || styles.estadoActivo

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />

      <aside id="alumno-drawer" className={styles.drawer}>

        {/* ── Header ── */}
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <span className={`${styles.estadoBadge} ${estadoClass}`}>
              {alumno.estado === 'Activo'    && <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#059669', display: 'inline-block' }} />}
              {alumno.estado === 'En riesgo' && <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#B45309', display: 'inline-block' }} />}
              {alumno.estado === 'Irregular' && <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#DC2626', display: 'inline-block' }} />}
              {alumno.estado}
            </span>
            <button
              id="alumno-drawer-close"
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

          <h2 className={styles.studentName}>{alumno.nombre}</h2>

          <div className={styles.infoRow}>
            <span className={styles.infoPill}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
              </svg>
              {alumno.legajo}
            </span>
            <span className={styles.infoDivider} />
            <span className={styles.infoPill}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              {alumno.grupo}
            </span>
            <span className={styles.infoDivider} />
            <span className={styles.infoPill}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              {alumno.tpEntregados} TPs entregados
            </span>
          </div>
        </div>

        {/* ── Body ── */}
        <div className={styles.body}>

          {/* Historial de TPs */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              <h3 className={styles.sectionTitle}>Historial de Trabajos Prácticos</h3>
            </div>
            <table className={styles.tpTable}>
              <thead>
                <tr>
                  <th className={styles.tpTh}>Trabajo Práctico</th>
                  <th className={styles.tpTh}>Nota</th>
                  <th className={styles.tpTh}>Categoría</th>
                  <th className={styles.tpTh}>Estado</th>
                  <th className={styles.tpTh}>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {alumno.historialTPs.map((tp) => (
                  <tr key={tp.id} className={styles.tpTr}>
                    <td className={styles.tpTd}>{tp.tp}</td>
                    <td className={styles.tpTd}>
                      <span className={styles.tpNota}>{tp.nota}</span>
                    </td>
                    <td className={styles.tpTd}>
                      <span className={`${styles.catBadge} ${CAT_CLASSES[tp.categoria] || ''}`}>
                        {tp.categoria}
                      </span>
                    </td>
                    <td className={styles.tpTd}>{tp.estado}</td>
                    <td className={styles.tpTd}>{tp.fecha}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Nota TFI + Concepto exposición */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <h3 className={styles.sectionTitle}>TFI y Exposición Final</h3>
            </div>
            {alumno.notaTFI === null && alumno.conceptoExposicion === null ? (
              <p className={styles.tfiEmpty}>Aún no se registró la nota del TFI ni el concepto de exposición.</p>
            ) : null}
            <div className={styles.tfiRow}>
              <div className={styles.tfiField}>
                <label className={styles.tfiLabel} htmlFor={`nota-tfi-${alumno.id}`}>Nota TFI (0–10)</label>
                <input
                  id={`nota-tfi-${alumno.id}`}
                  type="number"
                  min="0"
                  max="10"
                  className={styles.tfiInput}
                  placeholder="—"
                  value={notaTFI}
                  onChange={(e) => setNotaTFI(e.target.value)}
                />
              </div>
              <div className={styles.tfiField}>
                <label className={styles.tfiLabel} htmlFor={`concepto-${alumno.id}`}>Concepto de exposición</label>
                <input
                  id={`concepto-${alumno.id}`}
                  type="text"
                  className={styles.tfiInput}
                  placeholder="Ej: Muy Bueno"
                  value={concepto}
                  onChange={(e) => setConcepto(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Observaciones */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              <h3 className={styles.sectionTitle}>Observaciones de la docente</h3>
            </div>
            <textarea
              id={`observaciones-alumno-${alumno.id}`}
              className={styles.textarea}
              placeholder="Agregá observaciones o seguimiento del alumno..."
              value={observaciones}
              onChange={(e) => setObs(e.target.value)}
            />
          </div>
        </div>

        {/* ── Footer ── */}
        <div className={styles.footer}>
          <button
            id="alumno-drawer-save"
            className={styles.btnSave}
            onClick={() => alert('Observaciones guardadas')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            Guardar observaciones
          </button>
        </div>
      </aside>
    </>
  )
}

export default AlumnoDrawer
