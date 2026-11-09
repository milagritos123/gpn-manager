import Icon from '../ui/Icon'
import styles from './KpiStrip.module.css'

// Las cinco métricas del cuatrimestre, cada una en su tarjeta con ícono de color.
function KpiStrip({ metrics, onNavigate }) {
  const items = [
    {
      id: 'tp-pendientes',
      label: 'TP pendientes',
      icon: 'clock',
      tone: 'amber',
      go: () => onNavigate('correccion', { estado: 'Pendiente' }),
    },
    {
      id: 'tp-corregidos',
      label: 'TP corregidos',
      icon: 'checkCircle',
      tone: 'green',
      go: () => onNavigate('correccion', { estado: 'Aceptado' }),
    },
    {
      id: 'tfi-analizados',
      label: 'TFI analizados',
      icon: 'file',
      tone: 'blue',
      go: () => onNavigate('plagio'),
    },
    {
      id: 'casos-plagio',
      label: 'Casos de plagio',
      icon: 'alert',
      tone: 'red',
      go: () => onNavigate('plagio'),
    },
    {
      id: 'recursos-cargados',
      label: 'Recursos cargados',
      icon: 'book',
      tone: 'violet',
      go: () => onNavigate('asistente'),
    },
  ]

  return (
    <section className={styles.strip} aria-label="Resumen del cuatrimestre">
      {items.map((item) => (
        <button key={item.id} className={`panel ${styles.kpi}`} onClick={item.go}>
          <span className={styles.text}>
            <span className={styles.label}>{item.label}</span>
            <span className={`${styles.value} num`}>{metrics[item.id]}</span>
          </span>
          <span className={`${styles.icon} ${styles[item.tone]}`}>
            <Icon name={item.icon} size={20} />
          </span>
        </button>
      ))}
    </section>
  )
}

export default KpiStrip
