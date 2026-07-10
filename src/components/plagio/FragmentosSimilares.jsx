import styles from './FragmentosSimilares.module.css'

function getBarColor(pct) {
  if (pct >= 70) return '#EF4444'
  if (pct >= 40) return '#F59E0B'
  return '#10B981'
}

function FragmentosSimilares({ fragmentos, coincidencias }) {
  return (
    <>
      {/* Fragmentos */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2">
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
          Fragmentos similares encontrados
        </h3>

        {fragmentos.length === 0 ? (
          <p className={styles.emptyText}>No se encontraron fragmentos similares significativos.</p>
        ) : (
          fragmentos.map((f, idx) => (
            <div key={idx} className={styles.fragmentCard}>
              <p className={styles.quote}>{f.cita}</p>
              <div className={styles.fragmentFooter}>
                <span className={styles.origin}>
                  {f.origen} — {f.autor_origen}
                </span>
                <span className={styles.coincidencia}>{f.coincidencia}% coincidencia</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Coincidences table */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Trabajos con mayor coincidencia</h3>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th className={styles.th}>Título</th>
              <th className={styles.th}>Año</th>
              <th className={styles.th}>Autor</th>
              <th className={styles.th}>Carrera</th>
              <th className={styles.th}>Similitud</th>
            </tr>
          </thead>
          <tbody>
            {coincidencias.map((c, idx) => {
              const color = getBarColor(c.similitud)
              return (
                <tr key={idx} className={styles.tr}>
                  <td className={styles.td}>{c.titulo}</td>
                  <td className={styles.td}>{c.anio}</td>
                  <td className={styles.td}>{c.autor}</td>
                  <td className={styles.td}>{c.carrera}</td>
                  <td className={styles.td}>
                    <div className={styles.progressCell}>
                      <div className={styles.progressTrack}>
                        <div
                          className={styles.progressBar}
                          style={{ width: `${c.similitud}%`, backgroundColor: color }}
                        />
                      </div>
                      <span className={styles.progressValue} style={{ color }}>
                        {c.similitud}%
                      </span>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default FragmentosSimilares
