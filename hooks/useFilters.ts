'use client'

import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import type { FilterParams } from '@/lib/types'

export function useFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const filters = useMemo<FilterParams>(() => {
    return {
      search: searchParams.get('search') || undefined,
      category: searchParams.get('category') || undefined,
      language: searchParams.get('language') || undefined,
      status: searchParams.get('status') || undefined,
    }
  }, [searchParams])

  const updateFilters = useCallback(
    (newFilters: Partial<FilterParams>) => {
      const params = new URLSearchParams(searchParams.toString())

      // 필터 업데이트
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value) {
          params.set(key, value)
        } else {
          params.delete(key)
        }
      })

      router.replace(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams],
  )

  const clearFilters = useCallback(() => {
    router.replace(pathname)
  }, [router, pathname])

  return {
    filters,
    updateFilters,
    clearFilters,
  }
}
