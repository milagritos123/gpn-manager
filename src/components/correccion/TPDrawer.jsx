import { useEffect } from 'react'
import CategoryBadge from './CategoryBadge'
import StatusBadge from './StatusBadge'
import styles from './TPDrawer.module.css'

function TPDrawer({ tp, onClose }) {
  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  if (!tp) return null

  return (
    <>
      {/* Overlay */}
      <div
        id="drawer-overlay"
        className={styles.overlay}
        onClick={onClose}
        aria-label="Cerrar panel"
      />

      {/* Drawer */}
      <aside
        id="tp-drawer"
        className={styles.drawer}
        role="complementary"
        aria-label="Detalle del Trabajo Práctico"
      >
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <div className={styles.badges}>
              <CategoryBadge categoria={tp.categoria} />
              <StatusBadge estado={tp.estado} />
            </div>
            <button
              id="drawer-close"
              className={styles.closeBtn}
              onClick={onClose}
              aria-label="Cerrar drawer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <h1 className={styles.studentName}>{tp.nombre}</h1>
          <p className={styles.tpSubtitle}>
            {tp.tp} · {tp.comision}
          </p>
        </div>

        {/* Body */}
        <div className={styles.body}>
          {/* Documento completo */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <svg
                className={styles.sectionIcon}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#7C3AED"
                strokeWidth="2"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              Documento completo
            </h2>
            <div className={styles.documentBox}>
              <p className={styles.documentText}>{tp.documento}</p>
            </div>
          </div>

          {/* Comentarios de la IA */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <svg
                className={styles.sectionIcon}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#7C3AED"
                strokeWidth="2"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Comentarios de la IA
            </h2>
            <div className={styles.commentsBox}>
              <p className={styles.commentsText}>{tp.comentariosIA}</p>
            </div>
          </div>

          {/* Errores detectados */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <svg
                className={styles.sectionIcon}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#EF4444"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              Errores detectados
            </h2>
            {tp.errores.length === 0 ? (
              <p className={styles.emptyList}>No se detectaron errores significativos.</p>
            ) : (
              <ul className={styles.itemList}>
                {tp.errores.map((error, idx) => (
                  <li key={idx} className={styles.errorItem}>
                    <span className={styles.errorDot} />
                    {error}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Fortalezas */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <svg
                className={styles.sectionIcon}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#10B981"
                strokeWidth="2"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Fortalezas
            </h2>
            {tp.fortalezas.length === 0 ? (
              <p className={styles.emptyList}>No se registraron fortalezas destacadas.</p>
            ) : (
              <ul className={styles.itemList}>
                {tp.fortalezas.map((f, idx) => (
                  <li key={idx} className={styles.errorItem}>
                    <span className={styles.strengthDot} />
                    {f}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button
            id="drawer-reject"
            className={styles.btnReject}
            onClick={onClose}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            Rechazar
          </button>

          <button
            id="drawer-save"
            className={styles.btnSave}
            onClick={onClose}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            Guardar
          </button>

          <button
            id="drawer-accept"
            className={styles.btnAccept}
            onClick={onClose}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Aceptar corrección
          </button>
        </div>
      </aside>
    </>
  )
}

export default TPDrawer
