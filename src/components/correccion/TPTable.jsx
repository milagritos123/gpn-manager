import CategoryBadge from './CategoryBadge'
import StatusBadge from './StatusBadge'
import Icon from '../ui/Icon'
import { groupColor } from '../ui/groupColor'
import styles from './TPTable.module.css'

const NOTA_COLOR = {
  'Regular': 'var(--cat-regular)',
  'Bueno': 'var(--cat-bueno)',
  'Muy Bueno': 'var(--cat-muybueno)',
  'Excelente': 'var(--cat-excelente)',
}

function TPTable({ trabajos, onVerDetalle }) {
  const onRowKey = (e, tp) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onVerDetalle(tp)
    }
  }

  return (
    <div className="table-scroll">
      <table className="data-table">
        <thead>
          <tr>
            <th>Grupo</th>
            <th>Trabajo práctico</th>
            <th className="is-num">Nota IA</th>
            <th>Categoría</th>
            <th>Estado</th>
            <th><span className="visually-hidden">Acción</span></th>
          </tr>
        </thead>
        <tbody>
          {trabajos.length === 0 ? (
            <tr className="empty">
              <td colSpan={6}>No hay trabajos que coincidan con los filtros aplicados.</td>
            </tr>
          ) : (
            trabajos.map((tp) => {
              const pendiente = tp.estado === 'Pendiente'
              return (
                <tr
                  key={tp.id}
                  className="is-clickable"
                  tabIndex={0}
                  onClick={() => onVerDetalle(tp)}
                  onKeyDown={(e) => onRowKey(e, tp)}
                >
                  <td>
                    <div className={styles.group}>
                      <span className={`${styles.groupNum} num`} style={groupColor(tp.grupoNum)}>G{tp.grupoNum}</span>
                      <div className={styles.groupInfo}>
                        <div className="cell-primary">{tp.grupoLabel}</div>
                        <div className={`cell-secondary ${styles.members}`} title={tp.integrantes.join(', ')}>
                          {tp.integrantes.join(' · ')}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div>{tp.tp}</div>
                    <div className="cell-secondary">Entregado el {tp.fecha}</div>
                  </td>
                  <td className="is-num">
                    <span className={styles.nota} style={{ color: NOTA_COLOR[tp.categoria] }}>{tp.nota}</span>
                    <span className={styles.notaMax}>/10</span>
                  </td>
                  <td><CategoryBadge categoria={tp.categoria} /></td>
                  <td><StatusBadge estado={tp.estado} /></td>
                  <td className={styles.actionCell}>
                    <button
                      id={`ver-tp-${tp.id}`}
                      className={`btn btn-sm ${pendiente ? 'btn-secondary' : 'btn-ghost'}`}
                      onClick={(e) => { e.stopPropagation(); onVerDetalle(tp) }}
                      tabIndex={-1}
                    >
                      {pendiente ? 'Revisar' : 'Ver'}
                      <Icon name="arrowRight" />
                    </button>
                  </td>
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}

export default TPTable
