// Color fijo por grupo, compartido por Corrección, Alumnos y Plagio.
export function groupColor(num) {
  const n = ((Number(num) || 1) - 1) % 5 + 1
  return { color: `var(--g${n})`, background: `var(--g${n}-bg)` }
}

export const groupNumOf = (label) => Number(String(label).match(/\d+/)?.[0] || 1)
