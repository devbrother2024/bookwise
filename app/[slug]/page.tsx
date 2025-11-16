import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { getProductBySlug, getProducts } from '@/lib/contentClient'
import { ContentDetail } from '@/components/ContentDetail'
import { RecommendedList } from '@/components/RecommendedList'
import { FAQ } from '@/components/FAQ'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

async function ProductDetailPage({ slug }: { slug: string }) {
  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  // 추천 상품 가져오기 (같은 카테고리, 최대 4개)
  const allProducts = await getProducts()
  const recommended = allProducts.filter((p) => p.id !== product.id).slice(0, 4)

  return (
    <div className="container mx-auto px-4 py-8">
      <ContentDetail product={product} />
      {recommended.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            추천 상품
          </h2>
          <RecommendedList products={recommended} />
        </div>
      )}
      <div className="mt-16">
        <FAQ />
      </div>
    </div>
  )
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params

  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="h-96 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-900" />
        </div>
      }
    >
      <ProductDetailPage slug={slug} />
    </Suspense>
  )
}
