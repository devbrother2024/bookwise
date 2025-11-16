'use client'

import { useFilters } from '@/hooks/useFilters'
import { Search, X } from 'lucide-react'

export function EmptyState() {
  const { clearFilters } = useFilters()

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 rounded-full bg-zinc-100 p-4 dark:bg-zinc-800">
        <Search className="h-8 w-8 text-zinc-400" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        검색 결과가 없습니다
      </h3>
      <p className="mb-6 max-w-md text-sm text-zinc-600 dark:text-zinc-400">
        다른 검색어나 필터를 시도해보세요. 또는 필터를 초기화하여 모든 상품을
        확인하세요.
      </p>
      <button
        onClick={clearFilters}
        className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
      >
        <X className="h-4 w-4" />
        필터 초기화
      </button>
    </div>
  )
}
