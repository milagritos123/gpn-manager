import { useState, useEffect } from 'react'
import styles from './AlumnoDrawer.module.css'
import alumnosData from '../../data/alumnos.json'

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

function EvolutionChart({ history }) {
  const tps = history.filter(tp => tp.nota !== null && tp.nota !== undefined).reverse() // Older first
  if (tps.length === 0) return <div className={styles.tfiEmpty}>No hay datos suficientes para el gráfico.</div>

  const maxNota = 10

  // Map to points 0 to 100 for X and Y percentages
  // Y goes from 10% (top, note=10) to 90% (bottom, note=0) to leave padding
  const points = tps.map((tp, idx) => {
    const x = tps.length === 1 ? 50 : (idx / (tps.length - 1)) * 100
    const y = 90 - (tp.nota / maxNota) * 80
    return { x, y, label: tp.tp.split(':')[0], nota: tp.nota }
  })

  return (
    <div className={styles.graphContainer}>
      <svg style={{ width: '100%', height: '100%', overflow: 'visible' }}>
        {/* Grid lines */}
        <line x1="0%" y1="10%" x2="100%" y2="10%" stroke="#E5E7EB" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="0%" y1="90%" x2="100%" y2="90%" stroke="#E5E7EB" strokeWidth="1" strokeDasharray="4 4" />
        
        {/* Y Axis Labels (rendered only once) */}
        <text x="-10" y="10%" fontSize="11" fill="#9CA3AF" textAnchor="end" dominantBaseline="middle">10</text>
        <text x="-10" y="90%" fontSize="11" fill="#9CA3AF" textAnchor="end" dominantBaseline="middle">0</text>
        
        {/* Connecting lines */}
        {points.map((p, i) => {
          if (i === points.length - 1) return null;
          const next = points[i + 1];
          return (
            <line
              key={`line-${i}`}
              x1={`${p.x}%`}
              y1={`${p.y}%`}
              x2={`${next.x}%`}
              y2={`${next.y}%`}
              className={styles.graphLine}
            />
          )
        })}

        {/* Points and X Axis Labels */}
        {points.map((p, i) => (
          <g key={`point-${i}`}>
            <circle cx={`${p.x}%`} cy={`${p.y}%`} r="4" className={styles.graphPoint} />
            <text x={`${p.x}%`} y="100%" dy="14" fontSize="11" fill="#6B7280" textAnchor="middle">{p.label}</text>
          </g>
        ))}
      </svg>
    </div>
  )
}

function AlumnoDrawer({ alumno, onClose }) {
  const [activeAlumno, setActiveAlumno] = useState(alumno)
  const [notaTFI, setNotaTFI]       = useState(activeAlumno?.notaTFI ?? '')
  const [concepto, setConcepto]     = useState(activeAlumno?.conceptoExposicion ?? '')

  // Sync prop changes
  useEffect(() => {
    setActiveAlumno(alumno)
  }, [alumno])

  useEffect(() => {
    setNotaTFI(activeAlumno?.notaTFI ?? '')
    setConcepto(activeAlumno?.conceptoExposicion ?? '')
  }, [activeAlumno?.id])

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  if (!activeAlumno) return null

  // 1. Calculate stats for the individual student
  const tps = activeAlumno.historialTPs || []
  const tpEntregados = tps.length
  const tpAprobados = tps.filter(tp => tp.estado === 'Aceptado').length
  const tpPendientes = tps.filter(tp => tp.estado === 'Pendiente' || tp.estado === 'Revisión').length
  
  const notas = tps.filter(tp => typeof tp.nota === 'number').map(tp => tp.nota)
  const promedioNotas = notas.length > 0 ? (notas.reduce((a,b) => a + b, 0) / notas.length).toFixed(1) : '-'

  // 2. Find group members and calculate group stats
  const grupoIntegrantes = alumnosData.filter(a => a.grupoNum === activeAlumno.grupoNum)
  
  // Group average
  let totalNotasGrupo = 0
  let countNotasGrupo = 0
  grupoIntegrantes.forEach(intg => {
    intg.historialTPs.forEach(tp => {
      if (typeof tp.nota === 'number') {
        totalNotasGrupo += tp.nota
        countNotasGrupo++
      }
    })
  })
  const promedioGrupo = countNotasGrupo > 0 ? (totalNotasGrupo / countNotasGrupo).toFixed(1) : '-'

  // Max TPs done by the group (assuming they do it together, so max of entregados)
  const tpRealizadosGrupo = Math.max(...grupoIntegrantes.map(i => i.tpEntregados || 0))

  const estadoClass = ESTADO_CLASSES[activeAlumno.estado] || styles.estadoActivo

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />

      <aside id="alumno-drawer" className={styles.drawer}>

        {/* ── Header ── */}
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <span className={`${styles.estadoBadge} ${estadoClass}`}>
              {activeAlumno.estado === 'Activo'    && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#059669', display: 'inline-block' }} />}
              {activeAlumno.estado === 'En riesgo' && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#B45309', display: 'inline-block' }} />}
              {activeAlumno.estado === 'Irregular' && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#DC2626', display: 'inline-block' }} />}
              {activeAlumno.estado}
            </span>
            <button id="alumno-drawer-close" className={styles.closeBtn} onClick={onClose} title="Cerrar">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <h2 className={styles.studentName}>{activeAlumno.nombre}</h2>
          <div className={styles.headerSubtitle}>
            Legajo {activeAlumno.legajo} · {activeAlumno.grupo}
          </div>
        </div>

        {/* ── Body ── */}
        <div className={styles.body}>

          {/* 1. Información General */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <svg className={styles.sectionIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              <h3 className={styles.sectionTitle}>Información general</h3>
            </div>
            <div className={styles.infoGrid}>
              <div className={styles.infoCard}>
                <span className={styles.infoLabel}>Nombre completo</span>
                <span className={styles.infoValue}>{activeAlumno.nombre}</span>
              </div>
              <div className={styles.infoCard}>
                <span className={styles.infoLabel}>Legajo</span>
                <span className={styles.infoValue}>{activeAlumno.legajo}</span>
              </div>
              <div className={`${styles.infoCard} ${styles.infoCardFull}`}>
                <span className={styles.infoLabel}>Grupo actual</span>
                <span className={styles.infoValue}>{activeAlumno.grupo}</span>
              </div>
            </div>
          </div>

          {/* 2. Desempeño General */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <svg className={styles.sectionIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
              <h3 className={styles.sectionTitle}>Desempeño general</h3>
            </div>
            <div className={styles.infoGrid}>
              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: '#EFF6FF' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2.5">
                    <circle cx="12" cy="8" r="7" />
                    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                  </svg>
                </div>
                <div className={styles.statContent}>
                  <span className={styles.statValue}>{promedioNotas}</span>
                  <span className={styles.statLabel}>Promedio de notas</span>
                </div>
              </div>
              
              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: '#ECFDF5' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div className={styles.statContent}>
                  <span className={styles.statValue}>{tpAprobados}</span>
                  <span className={styles.statLabel}>TP aprobados</span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: '#FFFBEB' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div className={styles.statContent}>
                  <span className={styles.statValue}>{tpPendientes}</span>
                  <span className={styles.statLabel}>TP pendientes</span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ background: '#F3F4F6' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2.5">
                    <line x1="4" y1="9" x2="20" y2="9" />
                    <line x1="4" y1="15" x2="20" y2="15" />
                    <line x1="10" y1="3" x2="8" y2="21" />
                    <line x1="16" y1="3" x2="14" y2="21" />
                  </svg>
                </div>
                <div className={styles.statContent}>
                  <span className={styles.statValue}>{tpEntregados}</span>
                  <span className={styles.statLabel}>TP entregados</span>
                </div>
              </div>
            </div>

            {/* Evolución gráfico */}
            <div className={styles.graphCard}>
              <div className={styles.graphLabel}>Evolución del rendimiento</div>
              <EvolutionChart history={tps} />
            </div>
          </div>

          {/* 3. Historial de TPs */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <svg className={styles.sectionIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              <h3 className={styles.sectionTitle}>Historial de Trabajos Prácticos</h3>
            </div>
            <div className={styles.tableCard}>
              <table className={styles.tpTable}>
                <thead>
                  <tr>
                    <th className={styles.tpTh}>TP</th>
                    <th className={styles.tpTh}>Nota</th>
                    <th className={styles.tpTh}>Categoría</th>
                    <th className={styles.tpTh}>Estado</th>
                    <th className={styles.tpTh}>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {tps.map((tp) => (
                    <tr key={tp.id} className={styles.tpTr}>
                      <td className={styles.tpTd}>{tp.tp}</td>
                      <td className={styles.tpTd}>
                        <span className={styles.tpNota}>{tp.nota ?? '-'}</span>
                      </td>
                      <td className={styles.tpTd}>
                        <span className={`${styles.catBadge} ${CAT_CLASSES[tp.categoria] || ''}`}>
                          {tp.categoria}
                        </span>
                      </td>
                      <td className={styles.tpTd}>
                        <span style={{ color: tp.estado === 'Aceptado' ? '#059669' : tp.estado === 'Revisión' ? '#D97706' : '#6B7280', fontWeight: '500' }}>
                          {tp.estado}
                        </span>
                      </td>
                      <td className={styles.tpTd}>{tp.fecha}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 4. Concepto TFI */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <svg className={styles.sectionIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
              <h3 className={styles.sectionTitle}>Concepto para la exposición del TFI</h3>
            </div>
            
            <div className={styles.tfiCard}>
              <p className={styles.tfiDesc}>
                Concepto individual del alumno durante la exposición (el TFI es grupal, pero esta evaluación es individual).
              </p>
              <textarea
                className={styles.textarea}
                placeholder="Escribir concepto aquí..."
                value={concepto}
                onChange={(e) => setConcepto(e.target.value)}
              />
              <div className={styles.tfiGradeRow}>
                <span className={styles.tfiLabel} style={{ fontSize: '13px' }}>Calificación (1-10):</span>
                <input
                  type="number"
                  min="1" max="10"
                  className={styles.tfiInput}
                  value={notaTFI}
                  onChange={(e) => setNotaTFI(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* 5. Información del grupo */}
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <svg className={styles.sectionIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <h3 className={styles.sectionTitle}>Información del grupo — {activeAlumno.grupo}</h3>
            </div>
            <div className={styles.groupCard}>
              <div className={styles.groupStatsRow}>
                <div className={styles.groupStat}>
                  <span className={styles.groupStatLabel}>TP realizados por el grupo</span>
                  <span className={styles.groupStatValue}>{tpRealizadosGrupo}</span>
                </div>
                <div className={styles.groupStat}>
                  <span className={styles.groupStatLabel}>Promedio del grupo</span>
                  <span className={styles.groupStatValue}>{promedioGrupo}</span>
                </div>
              </div>
              
              <div className={styles.integrantesList}>
                <div className={styles.integrantesTitle}>Integrantes</div>
                {grupoIntegrantes.map(intg => {
                  const estadoCls = ESTADO_CLASSES[intg.estado] || styles.estadoActivo
                  // Check if it's the currently active student to highlight it slightly
                  const isCurrent = intg.id === activeAlumno.id
                  return (
                    <div 
                      key={intg.id} 
                      className={`${styles.integranteItem} ${isCurrent ? styles.integranteItemActive : ''}`}
                      onClick={() => setActiveAlumno(intg)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className={styles.integranteLeft}>
                        <div className={styles.integranteAvatar} style={{ background: intg.avatarColor, color: 'white' }}>
                          {intg.iniciales}
                        </div>
                        <div className={styles.integranteInfo}>
                          <span className={styles.integranteName}>{intg.nombre}</span>
                          <span className={styles.integranteLegajo}>{intg.legajo}</span>
                        </div>
                      </div>
                      <div className={styles.integranteRight}>
                        <span className={`${styles.estadoBadge} ${estadoCls}`} style={{ background: 'transparent', padding: 0 }}>
                          {intg.estado === 'Activo'    && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#059669', display: 'inline-block' }} />}
                          {intg.estado === 'En riesgo' && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#B45309', display: 'inline-block' }} />}
                          {intg.estado === 'Irregular' && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#DC2626', display: 'inline-block' }} />}
                          {intg.estado}
                        </span>
                        <svg className={styles.chevronIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

        </div>

        {/* ── Footer ── */}
        <div className={styles.footer}>
          <button
            id="alumno-drawer-save"
            className={styles.btnSave}
            onClick={() => alert('Concepto guardado')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            Guardar concepto TFI
          </button>
        </div>
      </aside>
    </>
  )
}

export default AlumnoDrawer
