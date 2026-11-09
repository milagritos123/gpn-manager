import Icon from '../ui/Icon'
import styles from './FilterBar.module.css'

/**
 * Barra de filtros compartida.
 * - `statusKey` + `statusOptions`: filtro principal como control segmentado (con conteos).
 * - `selects`: filtros secundarios como desplegables.
 */
function FilterBar({
  filters,
  onFilterChange,
  onClear,
  searchPlaceholder = 'Buscar...',
  statusKey,
  statusOptions = [],
  selects = [],
  resultCount,
}) {
  const hasFilters = Object.values(filters).some((v) => v !== '')

  return (
    <div className={styles.bar}>
      {statusOptions.length > 0 && (
        <div className="segmented" role="group" aria-label="Filtrar por estado">
          {statusOptions.map((opt) => (
            <button
              key={opt.value || 'all'}
              aria-pressed={filters[statusKey] === opt.value}
              onClick={() => onFilterChange(statusKey, opt.value)}
            >
              {opt.label}
              <span className="count">{opt.count}</span>
            </button>
          ))}
        </div>
      )}

      <div className={styles.secondary}>
        <label className={`search ${styles.search}`}>
          <Icon name="search" />
          <span className="visually-hidden">{searchPlaceholder}</span>
          <input
            id="filter-search"
            type="search"
            className="field"
            placeholder={searchPlaceholder}
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
          />
        </label>

        {selects.map((s) => (
          <label key={s.key} className={styles.selectWrap}>
            <span className="visually-hidden">{s.placeholder}</span>
            <select
              id={`filter-${s.key}`}
              className={`field ${filters[s.key] ? styles.selectActive : ''}`}
              value={filters[s.key]}
              onChange={(e) => onFilterChange(s.key, e.target.value)}
            >
              <option value="">{s.placeholder}</option>
              {s.options.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </label>
        ))}

        {hasFilters && (
          <button id="filter-clear" className="btn btn-ghost" onClick={onClear}>
            <Icon name="close" />
            Limpiar
          </button>
        )}
      </div>

      {typeof resultCount === 'number' && (
        <p className={styles.count} aria-live="polite">
          {resultCount} {resultCount === 1 ? 'resultado' : 'resultados'}
        </p>
      )}
    </div>
  )
}

export default FilterBar
