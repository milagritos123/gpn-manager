export const ESTADO_TONE = {
  'Activo': 'green',
  'En riesgo': 'amber',
  'Irregular': 'red',
}

export const TP_ESTADO_TONE = {
  'Aceptado': 'green',
  'Pendiente': 'amber',
  'Revisión': 'violet',
  'Rechazado': 'red',
}

export function promedio(alumno) {
  const notas = (alumno.historialTPs || []).map((tp) => tp.nota).filter((n) => typeof n === 'number')
  return notas.length ? notas.reduce((a, b) => a + b, 0) / notas.length : null
}
