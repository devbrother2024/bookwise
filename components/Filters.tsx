'use client'

import { useFilters } from '@/hooks/useFilters'
import { Search } from 'lucide-react'
import { useDebouncedCallback } from 'use-debounce'

export function Filters() {
  const { filters, updateFilters, clearFilters } = useFilters()

  const debouncedSearch = useDebouncedCallback((value: string) => {
    updateFilters({ search: value || undefined })
  }, 300)

  return (
    <div className="mb-8 space-y-4">
      {/* 검색 바 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          placeholder="제목 또는 설명으로 검색..."
          defaultValue={filters.search}
          onChange={(e) => debouncedSearch(e.target.value)}
          className="w-full rounded-lg border border-zinc-200 bg-white px-10 py-3 text-sm placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:placeholder:text-zinc-500 dark:focus:border-zinc-600"
        />
      </div>

      {/* 필터 칩들 */}
      <div className="flex flex-wrap gap-2">
        {filters.search && (
          <button
            onClick={() => updateFilters({ search: undefined })}
            className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            검색: {filters.search} ×
          </button>
        )}
        {filters.category && (
          <button
            onClick={() => updateFilters({ category: undefined })}
            className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            카테고리: {filters.category} ×
          </button>
        )}
        {filters.language && (
          <button
            onClick={() => updateFilters({ language: undefined })}
            className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            언어: {filters.language} ×
          </button>
        )}
        {(filters.search || filters.category || filters.language) && (
          <button
            onClick={clearFilters}
            className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            모두 지우기
          </button>
        )}
      </div>
    </div>
  )
}
