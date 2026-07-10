import { useState, useRef } from 'react'
import styles from './DropZone.module.css'

function DropZone({ onFileAnalyzed, analyzing }) {
  const [isDragOver, setIsDragOver] = useState(false)
  const inputRef = useRef(null)

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) onFileAnalyzed(file.name)
  }

  const handleChange = (e) => {
    const file = e.target.files[0]
    if (file) onFileAnalyzed(file.name)
  }

  if (analyzing) {
    return (
      <div className={`${styles.dropzone} ${styles.analyzing}`}>
        <div className={styles.spinner} />
        <p className={styles.analyzingText}>Analizando documento...</p>
        <p className={styles.analyzingSubtext}>Comparando con la base de TFI históricos</p>
      </div>
    )
  }

  return (
    <div
      id="dropzone-area"
      className={`${styles.dropzone} ${isDragOver ? styles.dropzoneActive : ''}`}
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        style={{ display: 'none' }}
        onChange={handleChange}
        id="file-input-pdf"
      />
      <div className={styles.iconWrapper}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2">
          <polyline points="16 16 12 12 8 16" />
          <line x1="12" y1="12" x2="12" y2="21" />
          <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
        </svg>
      </div>
      <p className={styles.title}>Subir nuevo TFI para análisis</p>
      <p className={styles.subtitle}>Arrastrá un archivo PDF o hacé clic para seleccionar</p>
    </div>
  )
}

export default DropZone
