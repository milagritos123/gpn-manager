import { useState, useEffect, useId } from 'react'
import alumnosData from '../../data/alumnos.json'
import CategoryBadge from '../correccion/CategoryBadge'
import Icon from '../ui/Icon'
import { useToast } from '../ui/Toast'
import { groupColor } from '../ui/groupColor'
import { ESTADO_TONE, TP_ESTADO_TONE, promedio } from './alumnoUtils'
import styles from './AlumnoDrawer.module.css'

const W = 480
const H = 210
const PAD = { top: 38, right: 24, bottom: 30, left: 30 }

const CAT_COLOR = {
  'Regular': 'var(--cat-regular)',
  'Bueno': 'var(--cat-bueno)',
  'Muy Bueno': 'var(--cat-muybueno)',
  'Excelente': 'var(--cat-excelente)',
}

const LOADER_MS = 800

const fmt = (n) => n.toLocaleString('es-AR', { maximumFractionDigits: 1 })

// Curva suave (Catmull-Rom → Bézier) que pasa por todos los puntos
function smoothPath(pts, minY, maxY) {
  if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`
  const clamp = (v) => Math.min(maxY, Math.max(minY, v))
  let d = `M ${pts[0].x} ${pts[0].y}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] || p2
    const c1x = p1.x + (p2.x - p0.x) / 6
    const c1y = clamp(p1.y + (p2.y - p0.y) / 6)
    const c2x = p2.x - (p3.x - p1.x) / 6
    const c2y = clamp(p2.y - (p3.y - p1.y) / 6)
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`
  }
  return d
}

// Variación entre las dos últimas notas, para el chip de tendencia
function trendOf(history) {
  const notas = history.filter((tp) => typeof tp.nota === 'number').slice().reverse().map((tp) => tp.nota)
  if (notas.length < 2) return null
  const delta = notas[notas.length - 1] - notas[notas.length - 2]
  if (delta > 0) return { tone: 'up', text: `↑ +${fmt(delta)} vs TP anterior` }
  if (delta < 0) return { tone: 'down', text: `↓ −${fmt(Math.abs(delta))} vs TP anterior` }
  return { tone: 'flat', text: '= sin cambios' }
}

function EvolutionChart({ history }) {
  const uid = useId().replace(/:/g, '')
  const tps = history.filter((tp) => typeof tp.nota === 'number').slice().reverse() // más antiguo primero
  if (tps.length === 0) return <p className={styles.empty}>Todavía no hay notas para graficar.</p>

  const innerW = W - PAD.left - PAD.right
  const innerH = H - PAD.top - PAD.bottom
  const baseY = PAD.top + innerH
  const INSET = 28
  const x = (i) => PAD.left + (tps.length === 1 ? innerW / 2 : INSET + (i / (tps.length - 1)) * (innerW - 2 * INSET))
  const y = (n) => PAD.top + innerH - (n / 10) * innerH
  const points = tps.map((tp, i) => ({
    x: x(i),
    y: y(tp.nota),
    nota: tp.nota,
    label: tp.tp.split(':')[0],
    color: CAT_COLOR[tp.categoria] || 'var(--violet-600)',
  }))
  const line = smoothPath(points, PAD.top, baseY)
  const area = points.length > 1
    ? `${line} L ${points[points.length - 1].x} ${baseY} L ${points[0].x} ${baseY} Z`
    : null

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={styles.chart} role="img"
      aria-label={`Evolución de notas: ${points.map((p) => `${p.label} ${p.nota}`).join(', ')}`}>
      <defs>
        <linearGradient id={`area-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7C4AE6" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#7C4AE6" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`stroke-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#5A2DBA" />
        </linearGradient>
      </defs>

      {/* Zona de riesgo: por debajo de la nota de aprobación */}
      <rect x={PAD.left} y={y(6)} width={innerW} height={baseY - y(6)} className={styles.riskZone} rx="8" />
      <text x={PAD.left + 10} y={baseY - 8} className={styles.riskLabel}>Zona de riesgo</text>

      {[0, 5, 10].map((t) => (
        <g key={t}>
          <line x1={PAD.left} x2={W - PAD.right} y1={y(t)} y2={y(t)} className={t === 0 ? styles.axis : styles.grid} />
          <text x={PAD.left - 8} y={y(t)} className={styles.tick} textAnchor="end" dominantBaseline="middle">{t}</text>
        </g>
      ))}
      <line x1={PAD.left} x2={W - PAD.right} y1={y(6)} y2={y(6)} className={styles.passLine} />
      <text x={W - PAD.right - 8} y={y(6) + 15} className={styles.passLabel} textAnchor="end">Aprobación 6</text>

      {area && <path d={area} fill={`url(#area-${uid})`} className={styles.area} />}
      <path d={line} className={styles.line} stroke={`url(#stroke-${uid})`} />

      {points.map((p, i) => {
        const isLast = i === points.length - 1
        return (
          <g key={i} className={styles.pointGroup} style={{ animationDelay: `${0.55 + i * 0.08}s` }}>
            <circle cx={p.x} cy={p.y} r="11" className={styles.halo} style={{ fill: p.color }} />
            <circle cx={p.x} cy={p.y} r="6" className={styles.point} style={{ fill: p.color }}>
              <title>{`${p.label}: ${p.nota}`}</title>
            </circle>
            <g className={isLast ? styles.pillLast : styles.pill}>
              <rect x={p.x - 17} y={p.y - 34} width="34" height="22" rx="11" />
              <text x={p.x} y={p.y - 23} textAnchor="middle" dominantBaseline="central">{fmt(p.nota)}</text>
            </g>
            <text x={p.x} y={H - 8} className={styles.tick} textAnchor="middle">{p.label}</text>
          </g>
        )
      })}
    </svg>
  )
}

function AlumnoDrawer({ alumno, onClose }) {
  const notify = useToast()
  const [activeAlumno, setActiveAlumno] = useState(alumno)
  const [notaTFI, setNotaTFI] = useState(activeAlumno?.notaTFI ?? '')
  const [concepto, setConcepto] = useState(activeAlumno?.conceptoExposicion ?? '')

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

  // Aviso visible al cambiar de integrante: aparece tras la carga y se oculta a los 2,5 s
  const [switchedTo, setSwitchedTo] = useState(null)
  useEffect(() => {
    if (!switchedTo) return
    const t = setTimeout(() => setSwitchedTo(null), LOADER_MS + 2500)
    return () => clearTimeout(t)
  }, [switchedTo])

  // Pantalla de carga breve con el logo al cambiar de integrante
  const [loadingName, setLoadingName] = useState(null)
  useEffect(() => {
    if (!loadingName) return
    const t = setTimeout(() => setLoadingName(null), LOADER_MS)
    return () => clearTimeout(t)
  }, [loadingName])

  const switchTo = (intg) => {
    if (intg.id === activeAlumno?.id) return
    setActiveAlumno(intg)
    setLoadingName(intg.nombre)
    setSwitchedTo({ id: intg.id, nombre: intg.nombre })
  }

  if (!activeAlumno) return null

  const tps = activeAlumno.historialTPs || []
  const tpAprobados = tps.filter((tp) => tp.estado === 'Aceptado').length
  const tpPendientes = tps.filter((tp) => tp.estado === 'Pendiente' || tp.estado === 'Revisión').length
  const prom = promedio(activeAlumno)
  const trend = trendOf(tps)

  const grupoIntegrantes = alumnosData.filter((a) => a.grupoNum === activeAlumno.grupoNum)
  const notasGrupo = grupoIntegrantes.flatMap((i) => i.historialTPs.map((tp) => tp.nota)).filter((n) => typeof n === 'number')
  const promedioGrupo = notasGrupo.length ? (notasGrupo.reduce((a, b) => a + b, 0) / notasGrupo.length).toFixed(1) : '—'
  const tpRealizadosGrupo = Math.max(...grupoIntegrantes.map((i) => i.tpEntregados || 0))

  const stats = [
    { label: 'Promedio', value: prom === null ? '—' : prom.toFixed(1) },
    { label: 'Aprobados', value: tpAprobados },
    { label: 'Pendientes', value: tpPendientes },
    { label: 'Entregados', value: tps.length },
  ]

  const handleSave = () => {
    notify('Concepto del TFI guardado', {
      detail: `${activeAlumno.nombre}${notaTFI ? ` · Calificación ${notaTFI}` : ''}`,
    })
  }

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />

      <aside id="alumno-drawer" className="drawer" role="dialog" aria-modal="true" aria-labelledby="alumno-drawer-title">
        {loadingName && (
          <div className={styles.switchLoader} role="status" aria-live="polite">
            <span className={styles.loaderOrb} aria-hidden="true">
              <span className={styles.loaderRing} />
              <img src="/logo.jpg" alt="" className={styles.loaderImg} />
            </span>
            <p className={styles.loaderText}>Cargando a <strong>{loadingName}</strong>…</p>
            <span className={styles.loaderBar} aria-hidden="true"><span /></span>
          </div>
        )}

        {/* ── Header ── */}
        <div className="drawer-header">
          {switchedTo && !loadingName && <span key={switchedTo.id} className={styles.headerFlash} aria-hidden="true" />}
          <div className="drawer-header-top">
            <span className={`tag tag--${ESTADO_TONE[activeAlumno.estado] || 'neutral'}`}>{activeAlumno.estado}</span>
            <button id="alumno-drawer-close" className="btn btn-icon" onClick={onClose} aria-label="Cerrar">
              <Icon name="close" size={18} />
            </button>
          </div>
          <div key={loadingName ? 'cargando' : activeAlumno.id} className={`${styles.identity} ${switchedTo ? styles.identitySwitched : ''}`}>
            <span className={styles.bigAvatar} style={groupColor(activeAlumno.grupoNum)} aria-hidden="true">
              {activeAlumno.iniciales}
            </span>
            <div className={styles.identityText}>
              <h2 id="alumno-drawer-title" className="drawer-title">{activeAlumno.nombre}</h2>
              <p className="drawer-meta num">Legajo {activeAlumno.legajo} · {activeAlumno.grupo}</p>
            </div>
          </div>
          <p className={styles.switchLive} role="status" aria-live="polite">
            {switchedTo && !loadingName && (
              <span key={switchedTo.id} className={styles.switchChip}>
                <Icon name="swap" size={14} strokeWidth={2.25} />
                Cambiaste a <strong>{switchedTo.nombre}</strong>
              </span>
            )}
          </p>
        </div>

        {/* ── Body ── (key: al cambiar de integrante vuelve arriba y repite las animaciones) */}
        <div key={loadingName ? 'cargando' : activeAlumno.id} className="drawer-body">
          {/* Desempeño */}
          <section className="drawer-section">
            <h3 className="drawer-section-title">Desempeño en la cursada</h3>
            <dl className={styles.stats}>
              {stats.map((s) => (
                <div key={s.label}>
                  <dt>{s.label}</dt>
                  <dd className="num">{s.value}</dd>
                </div>
              ))}
            </dl>
            <div className={styles.chartBox}>
              <div className={styles.chartHead}>
                <p className={styles.chartTitle}>Evolución de notas por TP</p>
                {trend && <span className={`${styles.trend} ${styles[`trend-${trend.tone}`]}`}>{trend.text}</span>}
              </div>
              <EvolutionChart history={tps} />
            </div>
          </section>

          {/* Historial */}
          <section className="drawer-section">
            <h3 className="drawer-section-title">Trabajos prácticos</h3>
            <div className={`table-scroll ${styles.tableBox}`}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>TP</th>
                    <th className="is-num">Nota</th>
                    <th>Categoría</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {tps.map((tp) => (
                    <tr key={tp.id}>
                      <td>
                        <div>{tp.tp}</div>
                        <div className="cell-secondary">{tp.fecha}</div>
                      </td>
                      <td className="is-num"><b className={styles.tpNota}>{tp.nota ?? '—'}</b></td>
                      <td><CategoryBadge categoria={tp.categoria} /></td>
                      <td>
                        <span className={`tag tag--plain tag--${TP_ESTADO_TONE[tp.estado] || 'neutral'}`}>{tp.estado}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Concepto TFI */}
          <section className={`drawer-section ${styles.tfi}`}>
            <h3 className="drawer-section-title">Exposición del TFI</h3>
            <p className={styles.help}>
              El TFI es grupal, pero el concepto de la exposición es individual.
            </p>
            <label htmlFor="tfi-concepto" className={styles.fieldLabel}>Concepto</label>
            <textarea
              id="tfi-concepto"
              className="field"
              placeholder="Desempeño durante la exposición, dominio del tema, respuestas a preguntas…"
              value={concepto}
              onChange={(e) => setConcepto(e.target.value)}
            />
            <div className={styles.gradeRow}>
              <label htmlFor="tfi-nota" className={styles.fieldLabel}>Calificación</label>
              <input
                id="tfi-nota"
                type="number"
                min="1"
                max="10"
                placeholder="—"
                className={`field num ${styles.gradeInput}`}
                value={notaTFI}
                onChange={(e) => setNotaTFI(e.target.value)}
              />
              <span className={styles.help}>de 1 a 10</span>
            </div>
          </section>

          {/* Grupo */}
          <section className="drawer-section">
            <h3 className="drawer-section-title">{activeAlumno.grupo}</h3>
            <dl className={`${styles.stats} ${styles.statsCompact}`}>
              <div><dt>TP realizados</dt><dd className="num">{tpRealizadosGrupo}</dd></div>
              <div><dt>Promedio del grupo</dt><dd className="num">{promedioGrupo}</dd></div>
            </dl>
            <ul className={styles.members}>
              {grupoIntegrantes.map((intg) => {
                const isCurrent = intg.id === activeAlumno.id
                return (
                  <li key={intg.id}>
                    <button
                      className={`${styles.member} ${isCurrent ? styles.memberActive : ''}`}
                      onClick={() => switchTo(intg)}
                      aria-current={isCurrent ? 'true' : undefined}
                    >
                      <span className={styles.memberAvatar} style={groupColor(intg.grupoNum)}>{intg.iniciales}</span>
                      <span className={styles.memberInfo}>
                        <span className={styles.memberName}>{intg.nombre}</span>
                        <span className="cell-secondary num">{intg.legajo}</span>
                      </span>
                      <span className={`tag tag--${ESTADO_TONE[intg.estado] || 'neutral'}`}>{intg.estado}</span>
                      <Icon name="chevronRight" size={16} className={styles.memberChevron} />
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>
        </div>

        {/* ── Footer ── */}
        <div className="drawer-footer">
          <span className="spacer" />
          <button id="alumno-drawer-save" className="btn btn-primary" onClick={handleSave}>
            Guardar concepto del TFI
          </button>
        </div>
      </aside>
    </>
  )
}

export default AlumnoDrawer
