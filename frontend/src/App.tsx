import { useState } from 'react'
import type { User } from './admin/types'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './home/HomePage'
import { CartPage, CheckoutPage, CollectionPage, ProductPage, SuccessPage, WishlistPage } from './store/StorePages'
import AdminLayout from './admin/components/AdminLayout'
import Login from './admin/components/Login'
import OverviewPage from './admin/pages/OverviewPage'
import ProductsPage from './admin/pages/ProductsPage'
import CategoriesPage from './admin/pages/CategoriesPage'
import InventoryPage from './admin/pages/InventoryPage'
import OrdersPage from './admin/pages/OrdersPage'
import ReviewsPage from './admin/pages/ReviewsPage'
import './App.css'
export default function App() {
  const [token, setToken] = useState(localStorage.admin_token || '');
  const [user, setUser] = useState<User | null>(() => JSON.parse(localStorage.admin_user || 'null'));
  const signIn = (u: User, t: string) => { localStorage.admin_token = t; localStorage.admin_user = JSON.stringify(u); setUser(u); setToken(t) };
  const signOut = () => { localStorage.removeItem('admin_token'); localStorage.removeItem('admin_user'); setToken(''); setUser(null) };
  return <BrowserRouter><Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/collections" element={<CollectionPage />} />
    <Route path="/products/:slug" element={<ProductPage />} />
    <Route path="/cart" element={<CartPage />} />
    <Route path="/wishlist" element={<WishlistPage />} />
    <Route path="/checkout" element={<CheckoutPage />} />
    <Route path="/order-success" element={<SuccessPage />} />
    <Route path="/admin" element={token && user ? <AdminLayout user={user} onSignOut={signOut} /> : <Login onSuccess={signIn} />}>
      <Route index element={<OverviewPage token={token} />} />
      <Route path="products" element={<ProductsPage token={token} />} />
      <Route path="categories" element={<CategoriesPage token={token} />} />
      <Route path="inventory" element={<InventoryPage token={token} />} />
      <Route path="orders" element={<OrdersPage token={token} />} />
      <Route path="reviews" element={<ReviewsPage token={token} />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
  </BrowserRouter>
}
