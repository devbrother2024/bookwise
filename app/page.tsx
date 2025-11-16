import { Suspense } from 'react'
import { getProducts } from '@/lib/contentClient'
import { Filters } from '@/components/Filters'
import { ContentCard } from '@/components/ContentCard'
import { EmptyState } from '@/components/EmptyState'
import type { FilterParams } from '@/lib/types'

interface PageProps {
  searchParams: Promise<{
    search?: string
    category?: string
    language?: string
    status?: string
  }>
}

async function ProductList({ filters }: { filters: FilterParams }) {
  const products = await getProducts(filters)

  if (products.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ContentCard key={product.id} product={product} />
      ))}
    </div>
  )
}

function ProductListSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-64 animate-pulse rounded-lg border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900"
        />
      ))}
    </div>
  )
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams
  const filters: FilterParams = {
    search: params.search,
    category: params.category,
    language: params.language,
    status: params.status,
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          BookWise 상품 목록
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          디지털 상품을 탐색하고 구매하세요
        </p>
      </div>

      <Filters />

      <Suspense fallback={<ProductListSkeleton />}>
        <ProductList filters={filters} />
      </Suspense>
    </div>
  )
}
