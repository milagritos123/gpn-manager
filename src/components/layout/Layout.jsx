import Sidebar from './Sidebar'
import styles from './Layout.module.css'

function Layout({
  children,
  activePage,
  onNavigate,
  fullHeight,
  conversations,
  activeConversationId,
  onSelectConversation,
  onCreateConversation
}) {
  return (
    <div className={styles.layout}>
      <Sidebar
        activePage={activePage}
        onNavigate={onNavigate}
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={onSelectConversation}
        onCreateConversation={onCreateConversation}
      />
      <main className={fullHeight ? styles.mainFull : styles.main}>
        {children}
      </main>
    </div>
  )
}

export default Layout
