import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/ui/Icon'
import styles from './Login.module.css'

const CAPABILITIES = [
  { title: 'Corrección de TP', text: 'La IA propone una nota y una devolución; vos confirmás.' },
  { title: 'Detección de plagio', text: 'Cada TFI se compara con la base histórica de la cátedra.' },
  { title: 'Asistente de clases', text: 'Responde solo con la bibliografía que cargaste.' },
]

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    // Simulate login — any credentials work for demo
    if (!email.trim() || !password.trim()) {
      setError('Completá tu usuario y contraseña para continuar.')
      return
    }
    navigate('/app')
  }

  return (
    <div className={styles.page}>
      {/* ── Marca ── */}
      <section className={styles.brandSide}>
        <div className={styles.brand}>
          <img src="/logo.jpg" alt="" className={styles.logo} />
          <span className={styles.brandName}>Cora<span className={styles.brandIA}>IA</span></span>
        </div>

        <h1 className={styles.headline}>
          Corrección inteligente de trabajos prácticos, <em>con la docente siempre al mando.</em>
        </h1>

        <ul className={styles.capabilities}>
          {CAPABILITIES.map((c, i) => (
            <li key={c.title}>
              <span className={`${styles.capIndex} num`}>0{i + 1}</span>
              <div>
                <p className={styles.capTitle}>{c.title}</p>
                <p className={styles.capText}>{c.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Formulario ── */}
      <section className={styles.formSide}>
        <form id="login-form" className={styles.form} onSubmit={handleSubmit} noValidate>
          <h2 className={styles.formTitle}>Iniciar sesión</h2>
          <p className={styles.formSubtitle}>Ingresá con tu cuenta institucional.</p>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="email-input">Usuario institucional</label>
            <input
              id="email-input"
              type="text"
              className="field"
              placeholder="nombre@universidad.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              aria-invalid={!!error && !email.trim()}
            />
          </div>

          <div className={styles.field}>
            <div className={styles.labelRow}>
              <label className={styles.label} htmlFor="password-input">Contraseña</label>
              <button type="button" className="link" id="forgot-password-link">
                ¿La olvidaste?
              </button>
            </div>
            <div className={styles.passwordWrap}>
              <input
                id="password-input"
                type={showPassword ? 'text' : 'password'}
                className="field"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                aria-invalid={!!error && !password.trim()}
              />
              <button
                type="button"
                className={styles.reveal}
                onClick={() => setShowPassword((v) => !v)}
                id="toggle-password-btn"
              >
                {showPassword ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
          </div>

          <label className={styles.checkRow} htmlFor="remember-checkbox">
            <input
              id="remember-checkbox"
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            Mantener la sesión iniciada
          </label>

          {error && (
            <p className={styles.error} role="alert">
              <Icon name="alert" size={15} />
              {error}
            </p>
          )}

          <button id="login-submit-btn" type="submit" className={`btn btn-primary ${styles.submit}`}>
            Ingresar
            <Icon name="arrowRight" />
          </button>
        </form>
      </section>
    </div>
  )
}

export default Login
