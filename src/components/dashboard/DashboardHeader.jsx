import styles from './DashboardHeader.module.css'

function getFormattedDate() {
  const str = new Date().toLocaleDateString('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function DashboardHeader({ user }) {
  return (
    <header className={`page-header ${styles.header}`}>
      <div>
        <p className="eyebrow">
          <time dateTime={new Date().toISOString().slice(0, 10)}>{getFormattedDate()}</time>
        </p>
        <h1 className={`page-title ${styles.title}`}>Bienvenida, {user.nombre}</h1>
      </div>
    </header>
  )
}

export default DashboardHeader
