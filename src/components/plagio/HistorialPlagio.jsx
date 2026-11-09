import { useState } from 'react'
import Icon from '../ui/Icon'
import { SimilarityCell } from './FragmentosSimilares'
import { RISK, ESTADO, needsDecision } from './risk'
import styles from './HistorialPlagio.module.css'

function HistorialPlagio({ historial, onVer }) {
  const [soloPendientes, setSoloPendientes] = useState(false)
  const pendientes = historial.filter((h) => needsDecision(h.estado))
  const rows = soloPendientes ? pendientes : historial

  return (
    <section className="panel" aria-labelledby="historial-title">
      <header className={styles.header}>
        <div>
          <h2 id="historial-title" className="section-title">Historial de análisis</h2>
          <p className={styles.subtitle}>{historial.length} TFI analizados</p>
        </div>
        <div className="segmented" role="group" aria-label="Filtrar historial">
          <button aria-pressed={!soloPendientes} onClick={() => setSoloPendientes(false)}>
            Todos <span className="count">{historial.length}</span>
          </button>
          <button aria-pressed={soloPendientes} onClick={() => setSoloPendientes(true)}>
            Requieren decisión <span className="count">{pendientes.length}</span>
          </button>
        </div>
      </header>

      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              <th>Documento</th>
              <th>Fecha</th>
              <th>Similitud</th>
              <th>Riesgo</th>
              <th>Estado</th>
              <th><span className="visually-hidden">Acción</span></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((item) => {
              const risk = RISK[item.riesgo] || RISK.Bajo
              const estado = ESTADO[item.estado] || ESTADO.Pendiente
              const open = () => onVer(item)
              return (
                <tr
                  key={item.id}
                  className="is-clickable"
                  tabIndex={0}
                  onClick={open}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open() } }}
                >
                  <td>
                    <div className={styles.doc}>
                      <Icon name="file" size={16} className={styles.docIcon} />
                      <div>
                        <div className="cell-primary">{item.archivo}</div>
                        <div className="cell-secondary">{item.grupo} · Cursada {item.anio}</div>
                      </div>
                    </div>
                  </td>
                  <td>{item.fecha}</td>
                  <td><SimilarityCell value={item.similitud} riesgo={item.riesgo} /></td>
                  <td><span className={`tag tag--${risk.tone}`}>{risk.label}</span></td>
                  <td>
                    <span className={`tag tag--plain tag--${estado.tone}`}>{estado.label}</span>
                  </td>
                  <td className={styles.actionCell}>
                    <button
                      id={`ver-analisis-${item.id}`}
                      className={`btn btn-sm ${needsDecision(item.estado) ? 'btn-secondary' : 'btn-ghost'}`}
                      onClick={(e) => { e.stopPropagation(); open() }}
                      tabIndex={-1}
                    >
                      {needsDecision(item.estado) ? 'Revisar' : 'Ver'}
                      <Icon name="arrowRight" />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default HistorialPlagio
