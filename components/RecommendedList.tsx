import { ContentCard } from './ContentCard'
import type { ProductSummary } from '@/lib/types'

interface RecommendedListProps {
  products: ProductSummary[]
}

export function RecommendedList({ products }: RecommendedListProps) {
  if (products.length === 0) {
    return null
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <ContentCard key={product.id} product={product} />
      ))}
    </div>
  )
}
