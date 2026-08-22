export type User = { name: string; role: string; email?: string }

export type ProductVariant = {
  _id?: string;
  name: string;
  sku: string;
  price?: number;
  stock?: number;
  image?: string;
}

export type Product = {
  _id: string;
  title: string;
  slug?: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  unitPrice?: number;
  costPerItem?: number;
  stock: number;
  sku?: string;
  barcode?: string;
  status: string;
  images?: string[];
  category?: { _id?: string; name: string; slug?: string };
  productType?: string;
  chargeTax?: boolean;
  inventoryTracked?: boolean;
  continueSelling?: boolean;
  variants?: ProductVariant[];
  inventoryByLocation?: { name: string; quantity: number }[];
  channels?: string[];
  catalogs?: string[];
  shipping?: {
    physicalProduct?: boolean;
    packageName?: string;
    weight?: number;
    weightUnit?: string;
    countryOfOrigin?: string;
    hsCode?: string;
  };
  purchaseOptions?: {
    subscriptions?: boolean;
    preOrder?: boolean;
  };
  metafields?: {
    careInstructions?: string;
    material?: string;
    size?: string;
    snowboardLength?: string;
    snowboardBindingMount?: string;
    disclosures?: string;
  };
  seo?: {
    title?: string;
    description?: string;
  };
  updatedAt?: string;
  createdAt?: string;
  [key: string]: any;
}

export type OrderItem = {
  product: string;
  variantId?: string;
  title: string;
  sku?: string;
  image?: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export type OrderAddress = {
  label?: string;
  recipientName: string;
  phone?: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export type Order = {
  _id: string;
  orderNumber: string;
  subtotal?: number;
  shippingFee?: number;
  discount?: number;
  total: number;
  status: string;
  payment: { status: string; method?: string; razorpayOrderId?: string; razorpayPaymentId?: string };
  shippingAddress?: OrderAddress;
  createdAt: string;
  updatedAt?: string;
  user?: { _id?: string; name: string; email?: string };
  items: OrderItem[];
}

export type Category = {
  _id: string;
  name: string;
  slug?: string;
  description?: string;
  image?: string;
  isActive: boolean;
  productCount?: number;
  updatedAt?: string;
  createdAt?: string;
}

export type Review = {
  _id: string;
  rating: number;
  title?: string;
  comment: string;
  status: string;
  createdAt: string;
  user?: { name: string; email?: string };
  product?: { _id?: string; title: string; slug?: string; images?: string[] };
}

export type MonthlySales = {
  _id: string;
  monthIndex: number;
  year: number;
  total: number;
  count: number;
}

export type Dashboard = {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  lowStockProducts: Product[];
  recentOrders: Order[];
  topProducts: { _id: string; title: string; image?: string; unitsSold: number; revenue: number }[];
  recentReviews?: Review[];
  monthlySales?: MonthlySales[];
}
