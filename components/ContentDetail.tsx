import Image from 'next/image'
import Link from 'next/link'
import type { ProductDetail } from '@/lib/types'
import { PaymentButton } from './PaymentButton'

interface ContentDetailProps {
  product: ProductDetail
}

export function ContentDetail({ product }: ContentDetailProps) {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* 이미지 섹션 */}
      <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800">
        {product.thumbnailUrl ? (
          <Image
            src={product.thumbnailUrl}
            alt={product.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        ) : (
          <div className="flex h-full items-center justify-center text-zinc-400">
            이미지 없음
          </div>
        )}
      </div>

      {/* 상세 정보 섹션 */}
      <div className="space-y-6">
        <div>
          <h1 className="mb-4 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            {product.title}
          </h1>
          <div className="mb-4 flex items-center gap-4">
            <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              ${product.price.toFixed(2)}
            </span>
            {product.currency && (
              <span className="text-lg text-zinc-500 dark:text-zinc-400">
                {product.currency}
              </span>
            )}
          </div>
          {product.fileType && (
            <span className="inline-block rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              {product.fileType.toUpperCase()}
            </span>
          )}
        </div>

        <div>
          <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            설명
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            {product.fullDescription || product.description}
          </p>
        </div>

        {/* 결제 버튼 */}
        <div className="pt-4">
          <PaymentButton product={product} />
        </div>
      </div>
    </div>
  )
}
