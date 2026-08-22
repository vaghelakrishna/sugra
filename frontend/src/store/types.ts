export type Variant = {
  _id: string
  name: string
  price?: number
  sku?: string
  stock?: number
}

export type Product = {
  _id: string
  slug: string
  title: string
  price: number
  compareAtPrice?: number
  sku?: string
  stock?: number
  material?: string
  tags?: string[]
  description?: string
  images?: string[]
  category?: { name: string; slug?: string }
  variants?: Variant[]
  rating?: number
  reviewsCount?: number
}

export type WishlistItem = {
  _id: string
  product: Product
  variantId?: string
  quantity: number
}

export type Category = {
  _id: string
  name: string
  slug: string
  image?: string
}

export type Review = {
  _id: string
  rating: number
  title?: string
  comment: string
  createdAt: string
  user?: { name: string }
  verified?: boolean
}

export type CartItem = {
  id: string
  product: Product
  variant?: { name: string }
  unitPrice: number
  quantity: number
  availableStock: number
}

export type CartData = {
  items: CartItem[]
  summary: {
    subtotal: number
  }
}
