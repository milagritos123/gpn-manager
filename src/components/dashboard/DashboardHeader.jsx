import styles from './DashboardHeader.module.css'

function getFormattedDate() {
  const now = new Date()
  return now.toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
    .replace(/^\w/, (c) => c.toUpperCase()) // Capitalize first letter
    .replace(/ de (\w)/, (_, c) => ` De ${c.toUpperCase()}`) // "De Julio"
}

function DashboardHeader({ user }) {
  const dateStr = getFormattedDate()

  return (
    <div className={styles.header}>
      <p className={styles.date}>{dateStr}</p>
      <h1 className={styles.welcome}>Bienvenida, {user.nombre}</h1>
      <p className={styles.subtitle}>
        Gestión de Procesos de Negocio — Panel de control académico
      </p>
    </div>
  )
}

export default DashboardHeader
