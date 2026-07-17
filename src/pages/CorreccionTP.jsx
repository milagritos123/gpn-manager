import { useState, useMemo } from 'react'
import FilterBar from '../components/correccion/FilterBar'
import TPTable from '../components/correccion/TPTable'
import TPDrawer from '../components/correccion/TPDrawer'
import trabajosData from '../data/trabajosGrupales.json'
import styles from './CorreccionTP.module.css'

const INITIAL_FILTERS = { search: '', categoria: '', estado: '' }

function CorreccionTP() {
  const [filters, setFilters] = useState(INITIAL_FILTERS)
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
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Corrección Inteligente de Trabajos Prácticos</h1>
        <p className={styles.pageSubtitle}>
          Revisión de correcciones automáticas realizadas por el agente de IA
        </p>
      </div>

      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onClear={() => setFilters(INITIAL_FILTERS)}
        searchPlaceholder="Buscar grupo o integrante..."
      />

      <TPTable trabajos={filteredTrabajos} onVerDetalle={setSelectedTP} />

      {selectedTP && (
        <TPDrawer tp={selectedTP} onClose={() => setSelectedTP(null)} />
      )}
    </div>
  )
}

export default CorreccionTP
