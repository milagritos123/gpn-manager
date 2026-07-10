import styles from './FilterBar.module.css'

function FilterBar({ filters, onFilterChange, onClear }) {
  return (
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
          <svg
            className={styles.searchIcon}
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            id="filter-search"
            type="text"
            className={styles.searchInput}
            placeholder="Buscar alumno..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
          />
        </div>

        {/* Comisión */}
        <select
          id="filter-comision"
          className={styles.select}
          value={filters.comision}
          onChange={(e) => onFilterChange('comision', e.target.value)}
        >
          <option value="">Todas las comisiones</option>
          <option value="A - Turno Noche">A - Turno Noche</option>
          <option value="B - Turno Mañana">B - Turno Mañana</option>
          <option value="C - Turno Tarde">C - Turno Tarde</option>
        </select>

        {/* Categoría */}
        <select
          id="filter-categoria"
          className={styles.select}
          value={filters.categoria}
          onChange={(e) => onFilterChange('categoria', e.target.value)}
        >
          <option value="">Todas las categorías</option>
          <option value="Regular">Regular</option>
          <option value="Bueno">Bueno</option>
          <option value="Muy Bueno">Muy Bueno</option>
          <option value="Excelente">Excelente</option>
        </select>

        {/* Estado */}
        <select
          id="filter-estado"
          className={styles.select}
          value={filters.estado}
          onChange={(e) => onFilterChange('estado', e.target.value)}
        >
          <option value="">Todos los estados</option>
          <option value="Pendiente">Pendiente</option>
          <option value="Aceptado">Aceptado</option>
          <option value="Rechazado">Rechazado</option>
        </select>

        <button id="filter-clear" className={styles.clearBtn} onClick={onClear}>
          Limpiar filtros
        </button>
      </div>
    </div>
  )
}

export default FilterBar
