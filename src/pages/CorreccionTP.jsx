import { useState, useMemo } from 'react'
import FilterBar from '../components/correccion/FilterBar'
import TPTable from '../components/correccion/TPTable'
import TPDrawer from '../components/correccion/TPDrawer'
import trabajosData from '../data/trabajosGrupales.json'
import styles from './CorreccionTP.module.css'

const EMPTY_FILTERS = { search: '', categoria: '', estado: '' }
const CATEGORIAS = ['Regular', 'Bueno', 'Muy Bueno', 'Excelente']

const countBy = (key, value) => trabajosData.filter((tp) => tp[key] === value).length

const STATUS_OPTIONS = [
  { value: '', label: 'Todos', count: trabajosData.length },
  { value: 'Pendiente', label: 'Pendientes', count: countBy('estado', 'Pendiente') },
  { value: 'Aceptado', label: 'Aceptados', count: countBy('estado', 'Aceptado') },
  { value: 'Rechazado', label: 'Rechazados', count: countBy('estado', 'Rechazado') },
]

function CorreccionTP({ initialFilters }) {
  const [filters, setFilters] = useState({ ...EMPTY_FILTERS, ...initialFilters })
  const [selectedTP, setSelectedTP] = useState(null)

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const filteredTrabajos = useMemo(() => {
    return trabajosData.filter((tp) => {
      const q = filters.search.toLowerCase()
      const matchesSearch =
        q === '' ||
        tp.grupoLabel.toLowerCase().includes(q) ||
        tp.integrantes.some((m) => m.toLowerCase().includes(q))

      const matchesCategoria =
        filters.categoria === '' || tp.categoria === filters.categoria

      const matchesEstado =
        filters.estado === '' || tp.estado === filters.estado

      return matchesSearch && matchesCategoria && matchesEstado
    })
  }, [filters])

  return (
    <div className="page page--fill">
      <header className="page-header">
        <div>
          <h1 className="page-title">Corrección de TP</h1>
          <p className="page-lede">
            Revisá las correcciones que el agente de IA hizo sobre cada entrega. Ninguna nota se publica sin tu confirmación.
          </p>
        </div>
      </header>

      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onClear={() => setFilters(EMPTY_FILTERS)}
        searchPlaceholder="Buscar grupo o integrante"
        statusKey="estado"
        statusOptions={STATUS_OPTIONS}
        selects={[{ key: 'categoria', placeholder: 'Todas las categorías', options: CATEGORIAS }]}
        resultCount={filteredTrabajos.length}
      />

      <div className={`panel ${styles.tablePanel}`}>
        <TPTable trabajos={filteredTrabajos} onVerDetalle={setSelectedTP} />
      </div>

      {selectedTP && (
        <TPDrawer tp={selectedTP} onClose={() => setSelectedTP(null)} />
      )}
    </div>
  )
}

export default CorreccionTP
