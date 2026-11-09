import { useEffect, useRef } from 'react'
import TopBar from './TopBar'
import styles from './Layout.module.css'

function Layout({ children, activePage, onNavigate, fullHeight }) {
  const mainRef = useRef(null)

  // Cada sección arranca desde arriba
  useEffect(() => {
    mainRef.current?.scrollTo(0, 0)
  }, [activePage])

  return (
    <div className={styles.shell}>
      <TopBar activePage={activePage} onNavigate={onNavigate} />
      <main ref={mainRef} className={fullHeight ? styles.mainFull : styles.main}>
        {children}
      </main>
    </div>
  )
}

export default Layout
