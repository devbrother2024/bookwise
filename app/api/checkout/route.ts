import { NextRequest, NextResponse } from 'next/server'
import { createCheckout } from '@/lib/contentClient'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { variantId, customPrice } = body

    if (!variantId) {
      return NextResponse.json(
        { error: 'variantId is required' },
        { status: 400 },
      )
    }

    const checkout = await createCheckout(variantId, customPrice)

    if (!checkout) {
      return NextResponse.json(
        { error: 'Failed to create checkout' },
        { status: 500 },
      )
    }

    return NextResponse.json(checkout)
  } catch (error) {
    console.error('Checkout API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
