import { useState, useMemo } from 'react'
import alumnosData from '../data/alumnos.json'
import AlumnoDrawer from '../components/alumnos/AlumnoDrawer'
import FilterBar from '../components/correccion/FilterBar'
import Icon from '../components/ui/Icon'
import { ESTADO_TONE, promedio } from '../components/alumnos/alumnoUtils'
import { groupColor } from '../components/ui/groupColor'
import styles from './GestionAlumnos.module.css'

const GRUPOS = [...new Set(alumnosData.map((a) => a.grupo))].sort()
const EMPTY_FILTERS = { search: '', grupo: '', estado: '' }
const MAX_TP = Math.max(...alumnosData.map((a) => a.tpEntregados))

const countEstado = (e) => alumnosData.filter((a) => a.estado === e).length

const STATUS_OPTIONS = [
  { value: '', label: 'Todos', count: alumnosData.length },
  { value: 'Activo', label: 'Activos', count: countEstado('Activo') },
  { value: 'En riesgo', label: 'En riesgo', count: countEstado('En riesgo') },
  { value: 'Irregular', label: 'Irregulares', count: countEstado('Irregular') },
]

function TPPips({ value }) {
  return (
    <span className={styles.pips} aria-label={`${value} de ${MAX_TP} entregados`}>
      {Array.from({ length: MAX_TP }, (_, i) => (
        <i key={i} className={i < value ? styles.pipOn : ''} />
      ))}
      <span className={`${styles.pipText} num`}>{value}/{MAX_TP}</span>
    </span>
  )
}

function GestionAlumnos({ initialFilters }) {
  const [filters, setFilters] = useState({ ...EMPTY_FILTERS, ...initialFilters })
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
    <div className="page page--fill">
      <header className="page-header">
        <div>
          <h1 className="page-title">Gestión de Alumnos</h1>
          <p className="page-lede">
            Seguimiento individual del desempeño durante la cursada. Los alumnos en riesgo o irregulares aparecen marcados.
          </p>
        </div>
      </header>

      <FilterBar
        filters={filters}
        onFilterChange={handleFilter}
        onClear={() => setFilters(EMPTY_FILTERS)}
        searchPlaceholder="Buscar por nombre o legajo"
        statusKey="estado"
        statusOptions={STATUS_OPTIONS}
        selects={[{ key: 'grupo', placeholder: 'Todos los grupos', options: GRUPOS }]}
        resultCount={filtered.length}
      />

      <div className={`panel ${styles.tablePanel}`}>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Alumno</th>
                <th>Grupo</th>
                <th>TP entregados</th>
                <th className="is-num">Promedio</th>
                <th>Estado</th>
                <th><span className="visually-hidden">Acción</span></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr className="empty">
                  <td colSpan={6}>No hay alumnos que coincidan con los filtros aplicados.</td>
                </tr>
              ) : (
                filtered.map((alumno) => {
                  const prom = promedio(alumno)
                  const open = () => setSelected(alumno)
                  return (
                    <tr
                      key={alumno.id}
                      className="is-clickable"
                      tabIndex={0}
                      onClick={open}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open() } }}
                    >
                      <td>
                        <div className={styles.student}>
                          <span className={styles.avatar} style={groupColor(alumno.grupoNum)}>{alumno.iniciales}</span>
                          <div>
                            <div className="cell-primary">{alumno.nombre}</div>
                            <div className="cell-secondary num">Legajo {alumno.legajo}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={styles.groupChip} style={groupColor(alumno.grupoNum)}>{alumno.grupo}</span>
                      </td>
                      <td><TPPips value={alumno.tpEntregados} /></td>
                      <td className="is-num">
                        <span className={styles.prom}>{prom === null ? '—' : prom.toFixed(1)}</span>
                      </td>
                      <td>
                        <span className={`tag tag--${ESTADO_TONE[alumno.estado] || 'neutral'}`}>{alumno.estado}</span>
                      </td>
                      <td className={styles.actionCell}>
                        <button
                          id={`ver-alumno-${alumno.id}`}
                          className="btn btn-ghost btn-sm"
                          onClick={(e) => { e.stopPropagation(); open() }}
                          tabIndex={-1}
                        >
                          Ver ficha
                          <Icon name="arrowRight" />
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedAlumno && (
        <AlumnoDrawer alumno={selectedAlumno} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}

export default GestionAlumnos
