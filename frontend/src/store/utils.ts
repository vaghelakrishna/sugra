export const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
export const API_URL = API

export const headers = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
})
export const getAuthHeaders = headers

export const src = (image?: string) => {
  if (!image || /^https?:\/\//i.test(image) || image.startsWith('data:')) return image
  return `${API.replace(/\/api\/?$/, '')}/${image.replace(/^\/+/, '')}`
}
export const getImageUrl = src

export const money = (amount: number) => `$${amount.toFixed(2)}`
export const formatPrice = money

export const cartUpdated = () => window.dispatchEvent(new Event('cart:updated'))
export const notifyCartUpdated = cartUpdated

export const wishlistUpdated = () => window.dispatchEvent(new Event('wishlist:updated'))
export const notifyWishlistUpdated = wishlistUpdated
