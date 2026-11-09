import Icon from '../ui/Icon'

const statusMap = {
  'Pendiente': { tone: 'amber', icon: 'clock' },
  'Aceptado': { tone: 'green', icon: 'check' },
  'Rechazado': { tone: 'red', icon: 'x' },
}

// Estado de revisión: etiqueta con fondo + ícono (no depende solo del color).
function StatusBadge({ estado }) {
  const cfg = statusMap[estado] || statusMap.Pendiente
  return (
    <span className={`tag tag--plain tag--${cfg.tone}${estado === 'Pendiente' ? ' tag--pulse' : ''}`}>
      <Icon name={cfg.icon} size={13} strokeWidth={2.5} />
      {estado}
    </span>
  )
}

export default StatusBadge
