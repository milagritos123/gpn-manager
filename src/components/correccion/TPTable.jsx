import CategoryBadge from './CategoryBadge'
import StatusBadge from './StatusBadge'
import styles from './TPTable.module.css'

const GROUP_COLORS = ['#7C3AED', '#2563EB', '#059669', '#D97706', '#BE185D']

function GroupBadge({ num }) {
  const color = GROUP_COLORS[(num - 1) % GROUP_COLORS.length]
  return (
    <span className={styles.groupBadge} style={{ backgroundColor: color }}>
      {num}
    </span>
  )
}

function TPTable({ trabajos, onVerDetalle }) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th className={styles.th}>Grupo</th>
            <th className={styles.th}>Fecha</th>
            <th className={styles.th}>Trabajo Práctico</th>
            <th className={styles.th}>Nota</th>
            <th className={styles.th}>Categoría</th>
            <th className={styles.th}>Estado</th>
            <th className={styles.th}></th>
          </tr>
        </thead>
        <tbody>
          {trabajos.length === 0 ? (
            <tr className={styles.emptyRow}>
              <td colSpan={7}>No se encontraron resultados para los filtros aplicados.</td>
            </tr>
          ) : (
            trabajos.map((tp) => (
              <tr
                key={tp.id}
                className={styles.tr}
                onClick={() => onVerDetalle(tp)}
                style={{ cursor: 'pointer' }}
              >
                {/* Grupo */}
                <td className={styles.td}>
                  <div className={styles.groupCell}>
                    <GroupBadge num={tp.grupoNum} />
                    <div className={styles.groupInfo}>
                      <span className={styles.groupName}>{tp.grupoLabel}</span>
                      <span className={styles.groupMembers}>
                        {tp.integrantes.join(' · ')}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Fecha */}
                <td className={styles.td}>{tp.fecha}</td>

                {/* TP */}
                <td className={styles.td}>{tp.tp}</td>

                {/* Nota */}
                <td className={styles.td}>
                  <span className={styles.nota}>{tp.nota}</span>
                </td>

                {/* Categoría */}
                <td className={styles.td}>
                  <CategoryBadge categoria={tp.categoria} />
                </td>

                {/* Estado */}
                <td className={styles.td}>
                  <StatusBadge estado={tp.estado} />
                </td>

                {/* Acción */}
                <td className={styles.td} onClick={(e) => e.stopPropagation()}>
                  <button
                    id={`ver-tp-${tp.id}`}
                    className={styles.viewBtn}
                    onClick={() => onVerDetalle(tp)}
                    title="Ver detalle"
                  >
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default TPTable
