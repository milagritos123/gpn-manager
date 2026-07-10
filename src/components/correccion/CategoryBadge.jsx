import styles from './CategoryBadge.module.css'

const categoryMap = {
  'Regular': { cls: styles.regular, dot: '#EF4444' },
  'Bueno': { cls: styles.bueno, dot: '#F59E0B' },
  'Muy Bueno': { cls: styles.muybueno, dot: '#7C3AED' },
  'Excelente': { cls: styles.excelente, dot: '#10B981' },
}

function CategoryBadge({ categoria }) {
  const config = categoryMap[categoria] || categoryMap['Bueno']
  return (
    <span className={`${styles.badge} ${config.cls}`}>
      <span className={styles.dot} style={{ backgroundColor: config.dot }} />
      {categoria}
    </span>
  )
}

export default CategoryBadge
