// Lemon Squeezy API 응답 타입 정의

export interface ProductSummary {
  id: string
  slug: string
  title: string
  description: string
  price: number
  currency: string
  status: 'published' | 'draft' | 'archived'
  category?: string
  language?: string
  thumbnailUrl?: string
  variantId: number
  storeId: number
}

export interface ProductDetail extends ProductSummary {
  fullDescription?: string
  fileType?: string
  tags?: string[]
  createdAt: string
  updatedAt: string
}

export interface FilterParams {
  search?: string
  category?: string
  language?: string
  status?: string
}

export interface CheckoutResponse {
  id: number
  url: string
  expiresAt?: string
}
