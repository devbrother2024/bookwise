'use client'

import { useState } from 'react'
import { ShoppingCart, Loader2 } from 'lucide-react'
import type { ProductDetail } from '@/lib/types'
import { PaymentStatus } from './PaymentStatus'

interface PaymentButtonProps {
  product: ProductDetail
}

export function PaymentButton({ product }: PaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCheckout = async () => {
    if (!product.variantId) {
      setError('상품 정보를 불러올 수 없습니다.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          variantId: product.variantId,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create checkout')
      }

      const checkout = await response.json()

      if (!checkout || !checkout.url) {
        setError('결제 페이지를 생성할 수 없습니다. 다시 시도해주세요.')
        setIsLoading(false)
        return
      }

      // 결제 페이지로 리디렉션
      window.location.href = checkout.url
    } catch (err) {
      console.error('Checkout error:', err)
      setError(
        err instanceof Error
          ? err.message
          : '결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.',
      )
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <button
        onClick={handleCheckout}
        disabled={isLoading || !product.variantId}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-900 px-6 py-4 text-lg font-semibold text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            처리 중...
          </>
        ) : (
          <>
            <ShoppingCart className="h-5 w-5" />
            구매하기
          </>
        )}
      </button>

      <PaymentStatus isLoading={isLoading} error={error} />
    </div>
  )
}
