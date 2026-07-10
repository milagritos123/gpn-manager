import Sidebar from './Sidebar'
import styles from './Layout.module.css'

function Layout({ children, activePage, onNavigate, fullHeight }) {
  return (
    <div className={styles.layout}>
      <Sidebar activePage={activePage} onNavigate={onNavigate} />
      <main className={fullHeight ? styles.mainFull : styles.main}>
        {children}
      </main>
    </div>
  )
}

export default Layout
