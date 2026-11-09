// Umbrales y presentación de riesgo compartidos por toda la sección de plagio.
export const RISK = {
  Alto: { label: 'Riesgo alto', tone: 'red', color: 'var(--red-600)', text: 'var(--red-700)' },
  Medio: { label: 'Riesgo medio', tone: 'amber', color: 'var(--amber-600)', text: 'var(--amber-700)' },
  Bajo: { label: 'Riesgo bajo', tone: 'green', color: 'var(--green-600)', text: 'var(--green-700)' },
}

export const THRESHOLDS = { medio: 40, alto: 70 }

export function riskOf(pct) {
  if (pct >= THRESHOLDS.alto) return RISK.Alto
  if (pct >= THRESHOLDS.medio) return RISK.Medio
  return RISK.Bajo
}

export const ESTADO = {
  Pendiente: { tone: 'amber', label: 'Pendiente' },
  Revisión: { tone: 'violet', label: 'En revisión' },
  Aprobado: { tone: 'green', label: 'Aprobado' },
  Rechazado: { tone: 'red', label: 'Rechazado' },
}

export const needsDecision = (estado) => estado === 'Pendiente' || estado === 'Revisión'
