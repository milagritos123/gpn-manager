import { useState, useRef } from 'react'
import Icon from '../ui/Icon'
import styles from './DropZone.module.css'

function DropZone({ onFileAnalyzed, analyzing, fileName }) {
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
    e.target.value = ''
  }

  if (analyzing) {
    return (
      <div className={`${styles.dropzone} ${styles.analyzing}`} aria-busy="true">
        <div className={styles.copy}>
          <p className={styles.title}>Analizando {fileName || 'documento'}…</p>
          <p className={styles.subtitle}>Comparando con la base histórica de TFI de la cátedra</p>
          <div className={styles.progress}><span /></div>
        </div>
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
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        className="visually-hidden"
        onChange={handleChange}
        id="file-input-pdf"
        tabIndex={-1}
      />
      <span className={styles.icon}><Icon name="upload" size={22} /></span>
      <div className={styles.copy}>
        <p className={styles.title}>Analizar un nuevo TFI</p>
        <p className={styles.subtitle}>Arrastrá el PDF acá o seleccionalo desde tu equipo.</p>
      </div>
      <button className="btn btn-primary" onClick={() => inputRef.current?.click()}>
        Seleccionar PDF
      </button>
    </div>
  )
}

export default DropZone
