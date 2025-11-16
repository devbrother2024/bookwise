import {
  lemonSqueezySetup,
  listProducts,
  createCheckout as createLemonCheckout,
} from '@lemonsqueezy/lemonsqueezy.js'
import type {
  ProductSummary,
  ProductDetail,
  FilterParams,
  CheckoutResponse,
} from './types'

// Lemon Squeezy SDK 초기화
const apiKey = process.env.LEMON_SQUEEZY_API_KEY
const storeId = process.env.LEMON_SQUEEZY_STORE_ID

if (!apiKey) {
  throw new Error('LEMON_SQUEEZY_API_KEY 환경 변수가 설정되지 않았습니다.')
}

if (!storeId) {
  throw new Error('LEMON_SQUEEZY_STORE_ID 환경 변수가 설정되지 않았습니다.')
}

lemonSqueezySetup({
  apiKey,
  onError: (error) => {
    console.error('Lemon Squeezy API Error:', error)
  },
})

// HTML 태그 제거 헬퍼
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim()
}

// Lemon Squeezy API 응답을 내부 타입으로 변환
function transformProduct(
  productData: any,
  variantId?: number,
): ProductSummary {
  const attributes = productData.attributes
  const price = attributes.price || attributes.from_price || 0

  return {
    id: productData.id,
    slug: attributes.slug,
    title: attributes.name,
    description: stripHtml(attributes.description || '').substring(0, 180),
    price: price / 100, // 센트를 원화로 변환
    currency: 'USD', // 기본값
    status: attributes.status === 'published' ? 'published' : 'draft',
    category: undefined, // Lemon Squeezy에는 카테고리가 없음
    language: undefined, // Lemon Squeezy에는 언어 필드가 없음
    thumbnailUrl: attributes.large_thumb_url || attributes.thumb_url,
    variantId: variantId || 0,
    storeId: attributes.store_id || parseInt(storeId),
  }
}

function transformProductDetail(
  productData: any,
  variantId?: number,
): ProductDetail {
  const summary = transformProduct(productData, variantId)
  const attributes = productData.attributes

  return {
    ...summary,
    fullDescription: stripHtml(attributes.description || ''),
    fileType: 'pdf', // 기본값
    tags: [],
    createdAt: attributes.created_at,
    updatedAt: attributes.updated_at,
  }
}

/**
 * 모든 상품 목록을 가져옵니다 (ISR: 15분 캐시)
 */
export async function getProducts(
  params?: FilterParams,
): Promise<ProductSummary[]> {
  try {
    const { data, error } = await listProducts({
      filter: {
        storeId: storeId,
      },
      include: ['variants'],
    })

    if (error) {
      console.error('Failed to fetch products:', error)
      return []
    }

    let products = (data?.data || []).map((productData: any) => {
      // variants에서 첫 번째 variant ID 가져오기
      const variants = productData.relationships?.variants?.data
      const variantId =
        variants && variants.length > 0 ? parseInt(variants[0].id) : undefined

      return transformProduct(productData, variantId)
    })

    // 상태 필터링
    if (params?.status) {
      products = products.filter((p) => p.status === params.status)
    } else {
      // 기본적으로 published만 표시
      products = products.filter((p) => p.status === 'published')
    }

    // 클라이언트 측 필터링 (검색, 카테고리, 언어)
    if (params?.search) {
      const searchLower = params.search.toLowerCase()
      products = products.filter(
        (p) =>
          p.title.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower),
      )
    }

    if (params?.category) {
      products = products.filter((p) => p.category === params.category)
    }

    if (params?.language) {
      products = products.filter((p) => p.language === params.language)
    }

    return products
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

/**
 * 슬러그로 특정 상품을 가져옵니다
 */
export async function getProductBySlug(
  slug: string,
): Promise<ProductDetail | null> {
  try {
    // Lemon Squeezy는 slug로 직접 조회가 안 되므로, 목록에서 찾아야 함
    const { data, error } = await listProducts({
      filter: {
        storeId: storeId,
      },
      include: ['variants'],
    })

    if (error || !data) {
      console.error('Failed to fetch products:', error)
      return null
    }

    const productData = data.data.find((p: any) => p.attributes.slug === slug)

    if (!productData) {
      return null
    }

    // variants 정보 가져오기
    const variants = productData.relationships?.variants?.data || []
    const variantId =
      variants && variants.length > 0 ? parseInt(variants[0].id) : undefined

    return transformProductDetail(productData, variantId)
  } catch (error) {
    console.error('Error fetching product by slug:', error)
    return null
  }
}

/**
 * 체크아웃 URL을 생성합니다
 */
export async function createCheckout(
  variantId: number,
  customPrice?: number,
): Promise<CheckoutResponse | null> {
  try {
    const { data, error } = await createLemonCheckout(storeId, variantId, {
      customPrice: customPrice ? customPrice * 100 : undefined, // 원화를 센트로 변환
    })

    if (error || !data) {
      console.error('Failed to create checkout:', error)
      return null
    }

    return {
      id: parseInt(data.data.id),
      url: data.data.attributes.url,
      expiresAt: undefined, // SDK 응답에 없을 수 있음
    }
  } catch (error) {
    console.error('Error creating checkout:', error)
    return null
  }
}
