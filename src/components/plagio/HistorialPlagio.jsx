import styles from './HistorialPlagio.module.css'

const RISK_CFG = {
  Alto:  { badgeCls: styles.riskAlto,  simCls: styles.simAlto,  dot: '#EF4444', label: 'Alto riesgo' },
  Medio: { badgeCls: styles.riskMedio, simCls: styles.simMedio, dot: '#F59E0B', label: 'Riesgo medio' },
  Bajo:  { badgeCls: styles.riskBajo,  simCls: styles.simBajo,  dot: '#10B981', label: 'Bajo riesgo' },
}

const ESTADO_CFG = {
  Pendiente: { cls: styles.estadoPendiente, icon: '⏱' },
  Revisión:  { cls: styles.estadoRevision,  icon: '⚠' },
  Aprobado:  { cls: styles.estadoAprobado,  icon: '✓' },
}

function HistorialPlagio({ historial, onVer }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.title}>Historial de análisis</h2>
        <p className={styles.subtitle}>{historial.length} análisis realizados</p>
      </div>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th className={styles.th}>Documento</th>
            <th className={styles.th}>Fecha</th>
            <th className={styles.th}>Autor</th>
            <th className={styles.th}>Carrera</th>
            <th className={styles.th}>Similitud</th>
            <th className={styles.th}>Riesgo</th>
            <th className={styles.th}>Estado</th>
            <th className={styles.th}></th>
          </tr>
        </thead>
        <tbody>
          {historial.map((item) => {
            const risk = RISK_CFG[item.riesgo] || RISK_CFG.Bajo
            const estado = ESTADO_CFG[item.estado] || ESTADO_CFG.Pendiente
            return (
              <tr key={item.id} className={styles.tr}>
                <td className={styles.td}>
                  <div className={styles.docCell}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                    <span className={styles.docName} title={item.archivo}>{item.archivo}</span>
                  </div>
                </td>
                <td className={styles.td}>{item.fecha}</td>
                <td className={styles.td}>{item.autor}</td>
                <td className={styles.td}>{item.carrera}</td>
                <td className={styles.td}>
                  <span className={risk.simCls}>{item.similitud}%</span>
                </td>
                <td className={styles.td}>
                  <span className={`${styles.riskBadge} ${risk.badgeCls}`}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: risk.dot, display: 'inline-block' }} />
                    {risk.label}
                  </span>
                </td>
                <td className={styles.td}>
                  <span className={`${styles.estadoBadge} ${estado.cls}`}>
                    {estado.icon} {item.estado}
                  </span>
                </td>
                <td className={styles.td}>
                  <button
                    id={`ver-analisis-${item.id}`}
                    className={styles.viewBtn}
                    onClick={() => onVer(item)}
                    title="Ver análisis"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default HistorialPlagio
