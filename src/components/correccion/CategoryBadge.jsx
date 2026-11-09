const categoryTone = {
  'Regular': 'cat-regular',
  'Bueno': 'cat-bueno',
  'Muy Bueno': 'cat-muybueno',
  'Excelente': 'cat-excelente',
}

function CategoryBadge({ categoria }) {
  const tone = categoryTone[categoria] || 'neutral'
  return <span className={`tag tag--${tone}`}>{categoria}</span>
}

export default CategoryBadge
