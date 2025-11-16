'use client'

import { AlertCircle } from 'lucide-react'

interface PaymentStatusProps {
  isLoading: boolean
  error: string | null
}

export function PaymentStatus({ isLoading, error }: PaymentStatusProps) {
  if (isLoading) {
    return (
      <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
        <p>Lemon Squeezy 결제 페이지로 이동 중...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-start gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-300">
        <AlertCircle className="h-5 w-5 flex-shrink-0" />
        <div>
          <p className="font-medium">오류가 발생했습니다</p>
          <p className="mt-1">{error}</p>
        </div>
      </div>
    )
  }

  return null
}
