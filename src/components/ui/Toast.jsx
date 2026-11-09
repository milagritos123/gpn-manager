import { createContext, useCallback, useContext, useRef, useState } from 'react'
import Icon from './Icon'
import styles from './Toast.module.css'

const ToastContext = createContext(() => {})

const TONE_ICON = { success: 'check', danger: 'x', info: 'file' }

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const nextId = useRef(0)

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const notify = useCallback((message, { tone = 'success', detail } = {}) => {
    const id = ++nextId.current
    setToasts((prev) => [...prev.slice(-2), { id, message, detail, tone }])
    setTimeout(() => dismiss(id), 4000)
  }, [dismiss])

  return (
    <ToastContext.Provider value={notify}>
      {children}
      <div className={styles.region} role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`${styles.toast} ${styles[t.tone]}`}>
            <span className={styles.icon}><Icon name={TONE_ICON[t.tone]} size={14} strokeWidth={2.5} /></span>
            <div className={styles.body}>
              <p className={styles.message}>{t.message}</p>
              {t.detail && <p className={styles.detail}>{t.detail}</p>}
            </div>
            <button className={styles.close} onClick={() => dismiss(t.id)} aria-label="Cerrar notificación">
              <Icon name="close" size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
