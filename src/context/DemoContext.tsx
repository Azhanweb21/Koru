import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { CartLine, DemoOrder, DemoState, Enquiry, Fulfilment, MenuItem, OrderStatus, PaymentMethod, RestaurantSettings } from '../types'
import { createInitialOrders, initialMenu, initialSettings } from '../data/menuData'

const STORAGE_KEY = 'koru-demo-v1'

function readState(): DemoState {
  if (typeof window !== 'undefined') {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<DemoState>
        if (Array.isArray(parsed.menu) && Array.isArray(parsed.cart) && Array.isArray(parsed.orders) && parsed.settings) {
          return { menu: parsed.menu, cart: parsed.cart, orders: parsed.orders, settings: { ...initialSettings, ...parsed.settings }, enquiries: Array.isArray(parsed.enquiries) ? parsed.enquiries : [] }
        }
      }
    } catch {
      try { window.localStorage.removeItem(STORAGE_KEY) } catch { /* storage can be disabled */ }
    }
  }
  return { menu: initialMenu, cart: [], orders: createInitialOrders(), settings: initialSettings, enquiries: [] }
}

type AddToCartOptions = { customizations?: string[]; quantity?: number; specialInstructions?: string; unitPrice?: number }
type CreateOrderInput = {
  name: string; phone: string; email?: string; fulfilment: Fulfilment; address?: string; area?: string; deliveryInstructions?: string;
  specialInstructions?: string; paymentMethod: PaymentMethod; paymentStatus: DemoOrder['paymentStatus']
}
type DemoContextValue = {
  state: DemoState
  cartCount: number
  subtotal: number
  deliveryFeeFor: (subtotal: number, fulfilment?: Fulfilment) => number
  addToCart: (item: MenuItem, options?: AddToCartOptions) => void
  setCartQuantity: (key: string, quantity: number) => void
  removeFromCart: (key: string) => void
  clearCart: () => void
  createOrder: (input: CreateOrderInput) => DemoOrder
  updateOrder: (id: string, patch: Partial<DemoOrder>) => void
  updateOrderStatus: (id: string, status: OrderStatus) => void
  saveMenuItem: (item: MenuItem) => void
  deleteMenuItem: (id: string) => void
  updateSettings: (settings: RestaurantSettings) => void
  addEnquiry: (enquiry: Omit<Enquiry, 'id' | 'createdAt'>) => void
  resetDemo: () => void
}

const DemoContext = createContext<DemoContextValue | null>(null)

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(readState)

  useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch { /* demo remains usable without persistence */ }
  }, [state])

  const subtotal = useMemo(() => state.cart.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0), [state.cart])
  const cartCount = useMemo(() => state.cart.reduce((sum, line) => sum + line.quantity, 0), [state.cart])

  const deliveryFeeFor = useCallback((amount: number, fulfilment: Fulfilment = 'Delivery') => {
    if (fulfilment === 'Pickup' || !state.settings.deliveryAvailable || amount >= state.settings.freeDeliveryThreshold) return 0
    return state.settings.deliveryFee
  }, [state.settings])

  const addToCart = useCallback((item: MenuItem, options: AddToCartOptions = {}) => {
    if (!item.isAvailable) return
    const chosen = options.customizations ?? []
    const specialInstructions = options.specialInstructions?.trim() ?? ''
    const unitPrice = options.unitPrice ?? item.price
    const key = `${item.id}::${chosen.join('|')}::${specialInstructions}`
    setState(current => {
      const existing = current.cart.find(line => line.key === key)
      const nextLine: CartLine = { key, productId: item.id, name: item.name, image: item.image, unitPrice, basePrice: item.price, quantity: options.quantity ?? 1, customizations: chosen, specialInstructions }
      return { ...current, cart: existing ? current.cart.map(line => line.key === key ? { ...line, quantity: line.quantity + nextLine.quantity } : line) : [...current.cart, nextLine] }
    })
  }, [])

  const setCartQuantity = useCallback((key: string, quantity: number) => {
    setState(current => ({ ...current, cart: quantity <= 0 ? current.cart.filter(line => line.key !== key) : current.cart.map(line => line.key === key ? { ...line, quantity: Math.min(99, quantity) } : line) }))
  }, [])
  const removeFromCart = useCallback((key: string) => setState(current => ({ ...current, cart: current.cart.filter(line => line.key !== key) })), [])
  const clearCart = useCallback(() => setState(current => ({ ...current, cart: [] })), [])

  const createOrder = useCallback((input: CreateOrderInput) => {
    const nextNumber = Math.max(1043, ...state.orders.map(order => Number(order.id.replace(/\D/g, '')) || 0)) + 1
    const itemSubtotal = state.cart.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0)
    const fulfilment = input.fulfilment
    const fee = fulfilment === 'Delivery' && state.settings.deliveryAvailable && itemSubtotal < state.settings.freeDeliveryThreshold ? state.settings.deliveryFee : 0
    const created: DemoOrder = {
      id: `KORU-${nextNumber}`,
      customer: { name: input.name.trim(), phone: input.phone.trim(), email: input.email?.trim() || undefined },
      items: state.cart.map(line => ({ ...line })), subtotal: itemSubtotal, deliveryFee: fee, total: itemSubtotal + fee,
      fulfilment, address: fulfilment === 'Delivery' ? input.address?.trim() : undefined,
      area: fulfilment === 'Delivery' ? input.area?.trim() : undefined,
      deliveryInstructions: fulfilment === 'Delivery' ? input.deliveryInstructions?.trim() : undefined,
      specialInstructions: input.specialInstructions?.trim(), paymentMethod: input.paymentMethod, paymentStatus: input.paymentStatus,
      status: 'Received', createdAt: new Date().toISOString(),
    }
    setState(current => ({ ...current, orders: [created, ...current.orders], cart: [] }))
    return created
  }, [state])

  const updateOrder = useCallback((id: string, patch: Partial<DemoOrder>) => setState(current => ({ ...current, orders: current.orders.map(order => order.id === id ? { ...order, ...patch } : order) })), [])
  const updateOrderStatus = useCallback((id: string, status: OrderStatus) => setState(current => ({ ...current, orders: current.orders.map(order => order.id === id ? { ...order, status } : order) })), [])
  const saveMenuItem = useCallback((item: MenuItem) => setState(current => {
    const exists = current.menu.some(existing => existing.id === item.id)
    return { ...current, menu: exists ? current.menu.map(existing => existing.id === item.id ? item : existing) : [item, ...current.menu] }
  }), [])
  const deleteMenuItem = useCallback((id: string) => setState(current => ({ ...current, menu: current.menu.filter(item => item.id !== id), cart: current.cart.filter(line => line.productId !== id) })), [])
  const updateSettings = useCallback((settings: RestaurantSettings) => setState(current => ({ ...current, settings })), [])
  const addEnquiry = useCallback((enquiry: Omit<Enquiry, 'id' | 'createdAt'>) => setState(current => ({ ...current, enquiries: [{ ...enquiry, id: `ENQ-${Date.now().toString().slice(-6)}`, createdAt: new Date().toISOString() }, ...current.enquiries] })), [])
  const resetDemo = useCallback(() => {
    setState({ menu: initialMenu, cart: [], orders: createInitialOrders(), settings: initialSettings, enquiries: [] })
  }, [])

  const value = useMemo(() => ({ state, cartCount, subtotal, deliveryFeeFor, addToCart, setCartQuantity, removeFromCart, clearCart, createOrder, updateOrder, updateOrderStatus, saveMenuItem, deleteMenuItem, updateSettings, addEnquiry, resetDemo }), [state, cartCount, subtotal, deliveryFeeFor, addToCart, setCartQuantity, removeFromCart, clearCart, createOrder, updateOrder, updateOrderStatus, saveMenuItem, deleteMenuItem, updateSettings, addEnquiry, resetDemo])
  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
}

export function useDemo() {
  const context = useContext(DemoContext)
  if (!context) throw new Error('useDemo must be used inside DemoProvider')
  return context
}
