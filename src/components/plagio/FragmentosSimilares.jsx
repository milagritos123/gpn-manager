import { RISK, riskOf } from './risk'
import styles from './FragmentosSimilares.module.css'

// `riesgo` (si viene del análisis) manda sobre el umbral calculado
export function SimilarityCell({ value, riesgo }) {
  const risk = RISK[riesgo] || riskOf(value)
  return (
    <div className={styles.simCell}>
      <span className={`${styles.simValue} num`} style={{ color: risk.text }}>{value}%</span>
      <span className={styles.simTrack} aria-hidden="true">
        <span style={{ width: `${value}%`, background: risk.color }} />
      </span>
    </div>
  )
}

function FragmentosSimilares({ fragmentos = [], coincidencias = [] }) {
  return (
    <div className={styles.wrap}>
      <section>
        <h3 className={styles.title}>
          Fragmentos similares <span className="num">{fragmentos.length}</span>
        </h3>
        {fragmentos.length === 0 ? (
          <p className={styles.empty}>No se encontraron fragmentos similares significativos.</p>
        ) : (
          <ol className={styles.fragments}>
            {fragmentos.map((f, idx) => (
              <li key={idx} className={styles.fragment} style={{ borderColor: riskOf(f.porcentaje).color }}>
                <blockquote className={styles.quote}>“{f.cita}”</blockquote>
                <p className={styles.source}>
                  <span>{f.origen}</span>
                  <span className="num" style={{ color: riskOf(f.porcentaje).text }}>{f.porcentaje}% de coincidencia</span>
                </p>
              </li>
            ))}
          </ol>
        )}
      </section>

      {coincidencias.length > 0 && (
        <section>
          <h3 className={styles.title}>Trabajos con mayor coincidencia</h3>
          <div className={`table-scroll ${styles.tableBox}`}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Trabajo</th>
                  <th>Grupo</th>
                  <th className="is-num">Año</th>
                  <th>Similitud</th>
                </tr>
              </thead>
              <tbody>
                {coincidencias.map((c, idx) => (
                  <tr key={idx}>
                    <td className={styles.wrapCell}>{c.titulo}</td>
                    <td>{c.grupo}</td>
                    <td className="is-num">{c.anioCursada || c.anio}</td>
                    <td><SimilarityCell value={c.similitud} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  )
}

export default FragmentosSimilares
