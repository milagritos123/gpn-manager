import { useEffect } from 'react'
import ResultCard from './ResultCard'
import FragmentosSimilares from './FragmentosSimilares'
import styles from './PlagioDrawer.module.css'

function PlagioDrawer({ analisis, onClose }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  if (!analisis) return null

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <aside id="plagio-drawer" className={styles.drawer}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.fileName}>{analisis.archivo}</h1>
            <p className={styles.meta}>{analisis.autor} · {analisis.carrera} · {analisis.fecha}</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose} id="plagio-drawer-close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className={styles.body}>
          <ResultCard analisis={analisis} />
          <FragmentosSimilares
            fragmentos={analisis.fragmentos}
            coincidencias={analisis.coincidencias}
          />
        </div>
      </aside>
    </>
  )
}

export default PlagioDrawer
