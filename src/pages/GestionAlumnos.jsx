import { useState, useMemo } from 'react'
import alumnosData from '../data/alumnos.json'
import AlumnoDrawer from '../components/alumnos/AlumnoDrawer'
import styles from './GestionAlumnos.module.css'

const GRUPOS = [...new Set(alumnosData.map((a) => a.grupo))].sort()
const INITIAL_FILTERS = { search: '', grupo: '', estado: '' }

const ESTADO_CLASSES = {
  'Activo':    styles.estadoActivo,
  'En riesgo': styles.estadoEnRiesgo,
  'Irregular': styles.estadoIrregular,
}

const ESTADO_DOTS = {
  'Activo':    '#059669',
  'En riesgo': '#B45309',
  'Irregular': '#DC2626',
}

function GestionAlumnos() {
  const [filters, setFilters]       = useState(INITIAL_FILTERS)
  const [selectedAlumno, setSelected] = useState(null)

  const handleFilter = (key, val) => setFilters((p) => ({ ...p, [key]: val }))

  const filtered = useMemo(() => {
    return alumnosData.filter((a) => {
      const q = filters.search.toLowerCase()
      const matchesSearch = q === '' || a.nombre.toLowerCase().includes(q) || a.legajo.toLowerCase().includes(q)
      const matchesGrupo  = filters.grupo  === '' || a.grupo  === filters.grupo
      const matchesEstado = filters.estado === '' || a.estado === filters.estado
      return matchesSearch && matchesGrupo && matchesEstado
    })
  }, [filters])

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Gestión de Alumnos</h1>
        <p className={styles.pageSubtitle}>
          Seguimiento del desempeño de los alumnos durante la cursada
        </p>
      </div>

      {/* Filters */}
      <div className={styles.filterSection}>
        <div className={styles.filterTitle}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
          Filtros
        </div>
        <div className={styles.filterRow}>
          {/* Search */}
          <div className={styles.searchWrapper}>
            <svg className={styles.searchIcon} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              id="alumno-search"
              type="text"
              className={styles.searchInput}
              placeholder="Buscar alumno..."
              value={filters.search}
              onChange={(e) => handleFilter('search', e.target.value)}
            />
          </div>

          {/* Grupo */}
          <select
            id="alumno-filter-grupo"
            className={styles.select}
            value={filters.grupo}
            onChange={(e) => handleFilter('grupo', e.target.value)}
          >
            <option value="">Todos los grupos</option>
            {GRUPOS.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>

          {/* Estado */}
          <select
            id="alumno-filter-estado"
            className={styles.select}
            value={filters.estado}
            onChange={(e) => handleFilter('estado', e.target.value)}
          >
            <option value="">Todos los estados</option>
            <option value="Activo">Activo</option>
            <option value="En riesgo">En riesgo</option>
            <option value="Irregular">Irregular</option>
          </select>

          <button
            id="alumno-filter-clear"
            className={styles.clearBtn}
            onClick={() => setFilters(INITIAL_FILTERS)}
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      {/* Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th className={styles.th}>Alumno</th>
              <th className={styles.th}>Legajo</th>
              <th className={styles.th}>Grupo</th>
              <th className={styles.th}>TP Entregados</th>
              <th className={styles.th}>Estado</th>
              <th className={styles.th}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr className={styles.emptyRow}>
                <td colSpan={6}>No se encontraron alumnos para los filtros aplicados.</td>
              </tr>
            ) : (
              filtered.map((alumno) => (
                <tr
                  key={alumno.id}
                  className={styles.tr}
                  onClick={() => setSelected(alumno)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Alumno */}
                  <td className={styles.td}>
                    <div className={styles.studentCell}>
                      <div
                        className={styles.avatar}
                        style={{ backgroundColor: alumno.avatarColor }}
                      >
                        {alumno.iniciales}
                      </div>
                      <span className={styles.studentName}>{alumno.nombre}</span>
                    </div>
                  </td>

                  {/* Legajo */}
                  <td className={styles.td}>{alumno.legajo}</td>

                  {/* Grupo */}
                  <td className={styles.td}>{alumno.grupo}</td>

                  {/* TP Entregados */}
                  <td className={styles.td} style={{ textAlign: 'center', fontWeight: 700 }}>
                    {alumno.tpEntregados}
                  </td>

                  {/* Estado */}
                  <td className={styles.td}>
                    <span className={`${styles.estadoBadge} ${ESTADO_CLASSES[alumno.estado] || ''}`}>
                      <span style={{ width: 7, height: 7, borderRadius: '50%', background: ESTADO_DOTS[alumno.estado], display: 'inline-block' }} />
                      {alumno.estado}
                    </span>
                  </td>

                  {/* Acción */}
                  <td className={styles.td} onClick={(e) => e.stopPropagation()}>
                    <button
                      id={`ver-alumno-${alumno.id}`}
                      className={styles.viewBtn}
                      onClick={() => setSelected(alumno)}
                      title="Ver detalle"
                    >
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Drawer */}
      {selectedAlumno && (
        <AlumnoDrawer alumno={selectedAlumno} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}

export default GestionAlumnos
