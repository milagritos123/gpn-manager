import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Login.module.css'

// Simulated credentials — replace with real API call in the future
const DEMO_USER = { email: 'mfernandez@universidad.edu', password: '123456' }

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
    // Simulate login — any credentials work for demo, or match DEMO_USER for specificity
    if (!email.trim() || !password.trim()) {
      setError('Por favor completá todos los campos.')
      return
    }
    // Navigate to app
    navigate('/app')
  }

  return (
    <div className={styles.page}>
      {/* ── Left panel ── */}
      <div className={styles.left}>
        {/* Logo */}
        <div className={styles.logoArea}>
          <img
            src="/logo.png"
            alt="GPN Manager logo"
            className={styles.logoImg}
          />
          <span className={styles.logoName}>BPM Manager</span>
          <span className={styles.logoTagline}>Gestión de Procesos de Negocio</span>
        </div>

        {/* Quote */}
        <div className={styles.quoteArea}>
          <p className={styles.quoteText}>
            Gestión de Procesos y de Negocio
          </p>
        </div>

        {/* Bottom icons */}
        <div className={styles.decorIcons}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className={styles.right}>
        <div className={styles.formCard}>
          <div>
            <h1 className={styles.formTitle}>Iniciar sesión</h1>
            <p className={styles.formSubtitle}>
              Ingresá tus credenciales institucionales para continuar
            </p>
          </div>

          <form id="login-form" onSubmit={handleSubmit}>
            <div className={styles.fieldGroup}>
              {/* Email */}
              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="email-input">
                  Usuario institucional
                </label>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </span>
                  <input
                    id="email-input"
                    type="text"
                    className={styles.input}
                    placeholder="profesora@universidad.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* Password */}
              <div className={styles.field}>
                <div className={styles.fieldRow}>
                  <label className={styles.fieldLabel} htmlFor="password-input">
                    Contraseña
                  </label>
                  <button
                    type="button"
                    className={styles.forgotLink}
                    id="forgot-password-link"
                    tabIndex={-1}
                  >
                    ¿Olvidó su contraseña?
                  </button>
                </div>
                <div className={styles.inputWrapper}>
                  <span className={styles.inputIcon}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </span>
                  <input
                    id="password-input"
                    type={showPassword ? 'text' : 'password'}
                    className={styles.input}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className={styles.eyeBtn}
                    onClick={() => setShowPassword((v) => !v)}
                    id="toggle-password-btn"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Remember */}
              <label className={styles.checkRow} htmlFor="remember-checkbox">
                <input
                  id="remember-checkbox"
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <span className={styles.checkLabel}>Recordar sesión</span>
              </label>
            </div>

            {/* Error */}
            {error && <p className={styles.errorMsg} style={{ marginTop: '12px' }}>{error}</p>}

            {/* Submit */}
            <button
              id="login-submit-btn"
              type="submit"
              className={styles.submitBtn}
              style={{ marginTop: '20px' }}
            >
              Iniciar sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
