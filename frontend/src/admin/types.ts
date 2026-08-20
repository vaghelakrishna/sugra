export type User = { name: string; role: string }
export type Product = { _id: string; title: string; price: number; stock: number; sku?: string; status: string; images?: string[]; category?: { name: string }; updatedAt?: string }
export type Order = { _id: string; orderNumber: string; total: number; status: string; payment: { status: string }; createdAt: string; user?: { name: string }; items: { title: string; image?: string }[] }
export type Category = { _id: string; name: string; slug?: string; description?: string; image?: string; isActive: boolean; productCount?: number; updatedAt?: string }
export type Review = { _id: string; rating: number; comment: string; status: string; createdAt: string; user?: { name: string }; product?: { title: string; images?: string[] } }
export type Dashboard = { totalSales: number; totalOrders: number; totalCustomers: number; totalProducts: number; lowStockProducts: Product[]; recentOrders: Order[]; topProducts: { _id: string; title: string; image?: string; unitsSold: number; revenue: number }[] }
