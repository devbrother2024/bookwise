import Link from 'next/link'
import Image from 'next/image'
import type { ProductSummary } from '@/lib/types'
import { ShoppingCart } from 'lucide-react'

interface ContentCardProps {
  product: ProductSummary
}

export function ContentCard({ product }: ContentCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-lg border border-zinc-200 bg-white transition-shadow hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
      {/* 썸네일 */}
      <Link href={`/${product.slug}`} className="block">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          {product.thumbnailUrl ? (
            <Image
              src={product.thumbnailUrl}
              alt={product.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-zinc-400">
              이미지 없음
            </div>
          )}
          {product.status === 'published' && (
            <div className="absolute right-2 top-2 rounded-full bg-green-500 px-2 py-1 text-xs font-medium text-white">
              판매중
            </div>
          )}
        </div>
      </Link>

      {/* 카드 내용 */}
      <div className="p-4">
        <Link href={`/${product.slug}`}>
          <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50 hover:underline">
            {product.title}
          </h3>
        </Link>
        <p className="mb-4 line-clamp-3 text-sm text-zinc-600 dark:text-zinc-400">
          {product.description}
        </p>

        {/* 가격 및 CTA */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
              ${product.price.toFixed(2)}
            </span>
            {product.currency && (
              <span className="ml-1 text-sm text-zinc-500 dark:text-zinc-400">
                {product.currency}
              </span>
            )}
          </div>
          <Link
            href={`/${product.slug}`}
            className="flex items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            <ShoppingCart className="h-4 w-4" />
            구매하기
          </Link>
        </div>
      </div>
    </div>
  )
}
