import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, Clock3, Copy, MapPin, PackageCheck, ShoppingBag, Truck, Wallet, XCircle } from 'lucide-react'
import { useDemo } from '../context/DemoContext'
import { Button, EmptyState, Image, SectionEyebrow } from '../components/UI'
import { NotificationPreview } from '../components/Navigation'
import { money, shortDate } from '../lib/format'
import type { DemoOrder, OrderStatus } from '../types'

const statusText: Record<OrderStatus, string> = {
  Received: 'Order received', Confirmed: 'Confirmed', Preparing: 'Preparing', Ready: 'Ready', 'Out for Delivery': 'Out for delivery', Completed: 'Completed', Cancelled: 'Cancelled',
}

function UnknownOrder({ tracking = false }: { tracking?: boolean }) {
  const navigate = useNavigate()
  return <main className="standard-page section-pad"><div className="checkout-empty"><div className="empty-icon"><ShoppingBag /></div><h3>We couldn’t find that demo order</h3><p>This order number may be incorrect, or the order may have been cleared from this browser’s demo data.</p><div className="empty-actions"><Button onClick={() => navigate('/menu')}>Return to menu <ArrowRight size={15} /></Button>{tracking && <Button variant="secondary" onClick={() => navigate('/admin/orders')}>View demo orders</Button>}</div></div></main>
}

function OrderItems({ order }: { order: DemoOrder }) {
  return <div className="order-item-list">{order.items.map(item => <div className="order-item-row" key={item.key}><Image src={item.image} alt={item.name} /><div><strong>{item.name}</strong><small>Qty {item.quantity}{item.customizations.length ? ` · ${item.customizations.join(' · ')}` : ''}</small></div><b>{money(item.unitPrice * item.quantity)}</b></div>)}</div>
}

export function OrderConfirmationPage() {
  const { orderId } = useParams()
  const { state } = useDemo()
  const [notifyOpen, setNotifyOpen] = useState(false)
  const order = state.orders.find(item => item.id.toLowerCase() === orderId?.toLowerCase())
  if (!order) return <UnknownOrder />
  return <main className="standard-page section-pad confirmation-page"><div className="confirmation-heading"><div className="confirmation-symbol"><Check size={25} strokeWidth={1.5} /></div><SectionEyebrow>DEMO ORDER CREATED</SectionEyebrow><h1>That’s a wrap.<br /><em>For now.</em></h1><p>Thank you, {order.customer.name.split(' ')[0]}. Your demo order has been created successfully in this browser.</p><div className="order-id-pill">ORDER <strong>#{order.id}</strong><button aria-label="Copy order ID" onClick={async () => { try { await navigator.clipboard.writeText(order.id); window.dispatchEvent(new CustomEvent('koru-toast', { detail: { message: 'Order ID copied' } })) } catch { window.dispatchEvent(new CustomEvent('koru-toast', { detail: { message: `Order ID: ${order.id}`, kind: 'error' } })) } }}><Copy size={13} /></button></div></div>
    <div className="confirmation-layout"><section className="confirmation-card"><div className="confirmation-card-head"><div><span className="card-overline">ORDER DETAILS</span><h2>Here’s what you chose.</h2></div><span className="order-status-tag"><span className="status-dot" />{statusText[order.status]}</span></div><OrderItems order={order} /><div className="summary-divider"/><div className="summary-row"><span>Subtotal</span><strong>{money(order.subtotal)}</strong></div><div className="summary-row"><span>Delivery fee</span><strong>{order.deliveryFee ? money(order.deliveryFee) : 'Free'}</strong></div><div className="summary-total"><span>Demo total</span><strong>{money(order.total)}</strong></div></section><aside className="confirmation-side"><div className="confirmation-side-card"><div className="confirmation-icon-row"><span><MapPin size={17} /></span><div><small>FULFILMENT</small><strong>{order.fulfilment}</strong></div></div>{order.address && <p className="confirmation-address">{order.address}{order.area ? `, ${order.area}` : ''}</p>}<div className="confirmation-icon-row"><span><Wallet size={17} /></span><div><small>PAYMENT METHOD</small><strong>{order.paymentMethod}</strong></div></div><div className="payment-status-line">Payment status <span>{order.paymentStatus}</span></div><div className="confirmation-icon-row"><span><Clock3 size={17} /></span><div><small>ORDER PLACED</small><strong>{shortDate(order.createdAt)}</strong></div></div><div className="confirmation-disclosure">This is a simulated order. KORU has not received it and no payment has been taken.</div></div><Button block onClick={() => window.location.assign(`/track-order/${order.id}`)}>View order status <ArrowRight size={16} /></Button><Button block variant="secondary" onClick={() => setNotifyOpen(true)}>Preview WhatsApp notification <ArrowRight size={16} /></Button><Link to="/menu" className="confirmation-menu-link">Order something else <ArrowRight size={14} /></Link></aside></div><NotificationPreview order={order} open={notifyOpen} onClose={() => setNotifyOpen(false)} />
  </main>
}

function timelineStatus(status: OrderStatus, fulfilment: DemoOrder['fulfilment'], step: OrderStatus) {
  const steps: OrderStatus[] = fulfilment === 'Pickup' ? ['Received', 'Confirmed', 'Preparing', 'Ready', 'Completed'] : ['Received', 'Confirmed', 'Preparing', 'Ready', 'Out for Delivery', 'Completed']
  const current = status === 'Cancelled' ? -1 : steps.indexOf(status)
  const index = steps.indexOf(step)
  if (status === 'Cancelled') return 'upcoming'
  if (index < current) return 'done'
  if (index === current) return 'current'
  if (status === 'Completed') return 'done'
  return 'upcoming'
}

export function TrackOrderPage() {
  const { orderId } = useParams()
  const { state } = useDemo()
  const [notifyOpen, setNotifyOpen] = useState(false)
  const order = state.orders.find(item => item.id.toLowerCase() === orderId?.toLowerCase())
  if (!order) return <UnknownOrder tracking />
  const steps: { status: OrderStatus; title: string; description: string; icon: typeof Check }[] = [
    { status: 'Received', title: 'Order received', description: 'Your demo order has been added to the local order list.', icon: Check },
    { status: 'Confirmed', title: 'Confirmed', description: 'The sample order is marked as confirmed.', icon: PackageCheck },
    { status: 'Preparing', title: 'Preparing', description: 'The sample order has moved into preparation.', icon: Clock3 },
    ...(order.fulfilment === 'Pickup' ? [{ status: 'Ready' as OrderStatus, title: 'Ready for pickup', description: 'The sample order is ready for collection.', icon: ShoppingBag }] : [{ status: 'Ready' as OrderStatus, title: 'Ready', description: 'The sample order is marked ready for dispatch.', icon: PackageCheck }, { status: 'Out for Delivery' as OrderStatus, title: 'Out for delivery', description: 'The sample order is marked as on its way.', icon: Truck }]),
    { status: 'Completed', title: 'Completed', description: 'The sample order journey is complete.', icon: Check },
  ]
  const currentStep = order.status === 'Cancelled' ? -1 : steps.findIndex(step => step.status === order.status)
  return <main className="standard-page section-pad tracking-page"><div className="breadcrumbs"><Link to="/">Home</Link><span>/</span><span>Track demo order</span></div><div className="tracking-heading"><div><SectionEyebrow>YOUR ORDER JOURNEY</SectionEyebrow><h1>On its way to <em>somewhere.</em></h1><p>Order updates are simulated for this website demonstration.</p></div><span className="order-id-pill">ORDER <strong>#{order.id}</strong></span></div><div className="tracking-layout"><section className="tracking-main"><div className="tracking-status-top"><div><span className="card-overline">CURRENT DEMO STATUS</span><h2>{statusText[order.status]}</h2><p>Placed {shortDate(order.createdAt)}</p></div><span className={`tracking-status-icon ${order.status === 'Cancelled' ? 'cancelled' : ''}`}>{order.status === 'Cancelled' ? <XCircle size={24} /> : <Truck size={24} />}</span></div>{order.status === 'Cancelled' && <div className="cancelled-notice"><XCircle size={17} /><span>This demo order has been marked as cancelled in the admin dashboard.</span></div>}<div className="tracking-timeline">{steps.map((step, index) => { const stateName = timelineStatus(order.status, order.fulfilment, step.status); const Icon = step.icon; return <div className={`timeline-step timeline-${stateName}`} key={step.status}><div className="timeline-track"><span className="timeline-marker">{stateName === 'done' ? <Check size={14} /> : <Icon size={15} />}</span>{index < steps.length - 1 && <i />}</div><div className="timeline-content"><div><h3>{step.title}</h3>{stateName === 'current' && <span className="timeline-current-pill">CURRENT</span>}</div><p>{step.description}</p></div></div> })}</div><div className="tracking-demo-note"><span>i</span><p><strong>Demo timeline</strong> Status changes made in the demo admin will appear here. There is no GPS, live courier connection, or real kitchen update.</p></div></section><aside className="tracking-order-card"><div className="summary-title"><span>ORDER SUMMARY</span><span className="summary-sample">SAMPLE</span></div><OrderItems order={order} /><div className="summary-divider"/><div className="summary-row"><span>Subtotal</span><strong>{money(order.subtotal)}</strong></div><div className="summary-row"><span>Delivery</span><strong>{order.deliveryFee ? money(order.deliveryFee) : 'Free'}</strong></div><div className="summary-total"><span>Total</span><strong>{money(order.total)}</strong></div><div className="tracking-order-meta"><span>Fulfilment</span><strong>{order.fulfilment}</strong><span>Payment</span><strong>{order.paymentMethod}</strong><span>Payment status</span><strong>{order.paymentStatus}</strong>{order.address && <><span>Address</span><strong>{order.address}{order.area ? `, ${order.area}` : ''}</strong></>}</div><Button block variant="secondary" onClick={() => setNotifyOpen(true)}>Preview WhatsApp notification</Button><Link to="/admin/orders" className="admin-demo-link">Manage in demo admin <ArrowRight size={13} /></Link></aside></div><NotificationPreview order={order} open={notifyOpen} onClose={() => setNotifyOpen(false)} />
  </main>
}
