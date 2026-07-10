import { useState, useMemo } from 'react'
import FilterBar from '../components/correccion/FilterBar'
import TPTable from '../components/correccion/TPTable'
import TPDrawer from '../components/correccion/TPDrawer'
import trabajosData from '../data/trabajos.json'
import styles from './CorreccionTP.module.css'

const INITIAL_FILTERS = {
  search: '',
  comision: '',
  categoria: '',
  estado: '',
}

function CorreccionTP() {
  const [filters, setFilters] = useState(INITIAL_FILTERS)
  const [selectedTP, setSelectedTP] = useState(null)

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setFilters(INITIAL_FILTERS)
  }

  const filteredTrabajos = useMemo(() => {
    return trabajosData.filter((tp) => {
      const matchesSearch =
        filters.search === '' ||
        tp.nombre.toLowerCase().includes(filters.search.toLowerCase())

      const matchesComision =
        filters.comision === '' || tp.comision === filters.comision

      const matchesCategoria =
        filters.categoria === '' || tp.categoria === filters.categoria

      const matchesEstado =
        filters.estado === '' || tp.estado === filters.estado

      return matchesSearch && matchesComision && matchesCategoria && matchesEstado
    })
  }, [filters])

  return (
    <div className={styles.page}>
      {/* Page header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Corrección Inteligente de Trabajos Prácticos</h1>
        <p className={styles.pageSubtitle}>
          Revisión de correcciones automáticas realizadas por el agente de IA
        </p>
      </div>

      {/* Filters */}
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onClear={handleClearFilters}
      />

      {/* Table */}
      <TPTable
        trabajos={filteredTrabajos}
        onVerDetalle={setSelectedTP}
      />

      {/* Drawer */}
      {selectedTP && (
        <TPDrawer
          tp={selectedTP}
          onClose={() => setSelectedTP(null)}
        />
      )}
    </div>
  )
}

export default CorreccionTP
