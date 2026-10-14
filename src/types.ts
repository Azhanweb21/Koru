export const CATEGORIES = ['Starters', 'Salads', 'Main Course', 'Grills', 'Pasta', 'Desserts', 'Beverages'] as const
export type Category = typeof CATEGORIES[number]
export type OrderStatus = 'Received' | 'Confirmed' | 'Preparing' | 'Ready' | 'Out for Delivery' | 'Completed' | 'Cancelled'
export type PaymentMethod = 'Online Payment (Demo)' | 'Cash on Delivery'
export type Fulfilment = 'Delivery' | 'Pickup'

export type CustomOption = { name: string; extra?: number }
export type CustomizationGroup = { label: string; options: CustomOption[] }
export type MenuItem = {
  id: string
  slug: string
  name: string
  category: Category
  description: string
  price: number
  image: string
  isFeatured: boolean
  isAvailable: boolean
  isVegetarian: boolean
  isSpicy: boolean
  customizations: CustomizationGroup[]
}
export type CartLine = {
  key: string
  productId: string
  name: string
  image: string
  unitPrice: number
  basePrice: number
  quantity: number
  customizations: string[]
  specialInstructions?: string
}
export type CustomerInfo = { name: string; phone: string; email?: string }
export type DemoOrder = {
  id: string
  customer: CustomerInfo
  items: CartLine[]
  subtotal: number
  deliveryFee: number
  total: number
  fulfilment: Fulfilment
  address?: string
  area?: string
  deliveryInstructions?: string
  specialInstructions?: string
  paymentMethod: PaymentMethod
  paymentStatus: 'Paid (Demo)' | 'Cash on Delivery' | 'Failed (Demo)' | 'Not paid'
  status: OrderStatus
  createdAt: string
}
export type RestaurantSettings = {
  restaurantName: string
  description: string
  phone: string
  email: string
  address: string
  openingHours: string
  deliveryFee: number
  freeDeliveryThreshold: number
  pickupAvailable: boolean
  deliveryAvailable: boolean
}
export type Enquiry = { id: string; kind: 'Event' | 'Contact'; name: string; email: string; phone?: string; message: string; createdAt: string; eventType?: string; date?: string; guests?: number }
export type DemoState = {
  menu: MenuItem[]
  cart: CartLine[]
  orders: DemoOrder[]
  settings: RestaurantSettings
  enquiries: Enquiry[]
}
