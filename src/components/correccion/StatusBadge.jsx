import styles from './StatusBadge.module.css'

const statusMap = {
  'Pendiente': styles.pendiente,
  'Aceptado': styles.aceptado,
  'Rechazado': styles.rechazado,
}

function StatusBadge({ estado }) {
  const cls = statusMap[estado] || styles.pendiente
  return (
    <span className={`${styles.badge} ${cls}`}>
      {estado}
    </span>
  )
}

export default StatusBadge
