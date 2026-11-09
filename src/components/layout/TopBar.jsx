import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../ui/Icon'
import metricsData from '../../data/metrics.json'
import userData from '../../data/user.json'
import styles from './TopBar.module.css'

const metric = (id) => metricsData.find((m) => m.id === id)?.value ?? 0

// `count` solo aparece donde hay trabajo esperando a la docente.
const navItems = [
  { id: 'dashboard', label: 'Dashboard', short: 'Inicio' },
  { id: 'correccion', label: 'Corrección de TP', short: 'Corrección', count: metric('tp-pendientes'), countLabel: 'TP pendientes' },
  { id: 'plagio', label: 'Detección de Plagio', short: 'Plagio', count: metric('casos-plagio'), countLabel: 'casos a revisar', alert: true },
  { id: 'alumnos', label: 'Gestión de Alumnos', short: 'Alumnos' },
  { id: 'asistente', label: 'Asistente Inteligente', short: 'Asistente' },
]

function useDismiss(open, setOpen, ref) {
  useEffect(() => {
    if (!open) return
    const onPointer = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, setOpen, ref])
}

function TopBar({ activePage, onNavigate }) {
  const navigate = useNavigate()
  const [profileOpen, setProfileOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const profileRef = useRef(null)
  const menuRef = useRef(null)

  useDismiss(profileOpen, setProfileOpen, profileRef)
  useDismiss(menuOpen, setMenuOpen, menuRef)

  const go = (id) => {
    onNavigate(id)
    setMenuOpen(false)
  }

  return (
    <header className={styles.topbar}>
      <div className={styles.inner}>
        {/* Marca */}
        <button className={styles.brand} onClick={() => go('dashboard')} aria-label="CoraIA, ir al inicio">
          <img src="/logo.jpg" alt="" className={styles.logo} />
          <span className={styles.brandName}>Cora<span className={styles.brandIA}>IA</span></span>
        </button>

        {/* Navegación principal */}
        <nav className={styles.nav} aria-label="Secciones">
          {navItems.map((item) => {
            const active = activePage === item.id
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                className={`${styles.navItem} ${active ? styles.active : ''}`}
                aria-current={active ? 'page' : undefined}
                onClick={() => go(item.id)}
              >
                <span className={styles.labelFull}>{item.label}</span>
                <span className={styles.labelShort}>{item.short}</span>
                {item.count > 0 && (
                  <span className={`${styles.count} ${item.alert ? styles.countAlert : ''}`}>
                    {item.count}
                    <span className="visually-hidden"> {item.countLabel}</span>
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Perfil */}
        <div className={styles.profile} ref={profileRef}>
          <button
            className={styles.profileBtn}
            onClick={() => setProfileOpen((v) => !v)}
            aria-expanded={profileOpen}
            aria-haspopup="menu"
          >
            <span className={styles.avatar}>{userData.iniciales}</span>
            <span className={styles.profileText}>
              <span className={styles.profileName}>{userData.nombre}</span>
              <span className={styles.profileRole}>{userData.rol}</span>
            </span>
            <Icon name="chevronDown" size={14} className={styles.chevron} />
          </button>

          {profileOpen && (
            <div className={styles.popover} role="menu">
              <div className={styles.popoverHead}>
                <span className={styles.popoverName}>{userData.nombre}</span>
                <span className={styles.popoverEmail}>{userData.email}</span>
              </div>
              <button className={styles.popoverItem} role="menuitem" onClick={() => navigate('/')}>
                <Icon name="logout" size={15} />
                Cerrar sesión
              </button>
            </div>
          )}
        </div>

        {/* Menú compacto (pantallas chicas) */}
        <div className={styles.mobile} ref={menuRef}>
          <button
            className={styles.menuBtn}
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            <Icon name={menuOpen ? 'close' : 'menu'} size={20} />
            {!menuOpen && navItems.some((i) => i.alert && i.count > 0) && <span className={styles.menuDot} />}
          </button>

          {menuOpen && (
            <div className={styles.sheet}>
              <nav aria-label="Secciones">
                {navItems.map((item) => {
                  const active = activePage === item.id
                  return (
                    <button
                      key={item.id}
                      className={`${styles.sheetItem} ${active ? styles.sheetActive : ''}`}
                      aria-current={active ? 'page' : undefined}
                      onClick={() => go(item.id)}
                    >
                      {item.label}
                      {item.count > 0 && (
                        <span className={`${styles.count} ${item.alert ? styles.countAlert : ''}`}>{item.count}</span>
                      )}
                    </button>
                  )
                })}
              </nav>
              <div className={styles.sheetFoot}>
                <span className={styles.avatar}>{userData.iniciales}</span>
                <span className={styles.profileText} style={{ display: 'flex' }}>
                  <span className={styles.profileName}>{userData.nombre}</span>
                  <span className={styles.profileRole}>{userData.email}</span>
                </span>
                <button className="btn btn-ghost btn-sm" onClick={() => navigate('/')}>
                  <Icon name="logout" />
                  Salir
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default TopBar
