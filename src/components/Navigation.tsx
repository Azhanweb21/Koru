import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, Check, ChevronRight, Camera, Menu as MenuIcon, Minus, Plus, ShoppingBag, X } from 'lucide-react'
import { useDemo } from '../context/DemoContext'
import { Image, Button, Dialog, QuantityControl, notify } from './UI'
import { money } from '../lib/format'
import type { DemoOrder } from '../types'

const publicLinks = [
  { to: '/', label: 'Home' }, { to: '/menu', label: 'Menu' }, { to: '/story', label: 'Our Story' },
  { to: '/gallery', label: 'Gallery' }, { to: '/private-dining', label: 'Private Dining' }, { to: '/contact', label: 'Contact' },
]

export function Header() {
  const { state, cartCount, subtotal, setCartQuantity, removeFromCart, deliveryFeeFor } = useDemo()
  const [cartOpen, setCartOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const fee = deliveryFeeFor(subtotal)
  useEffect(() => { setMobileOpen(false); setCartOpen(false) }, [location.pathname])
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') { setCartOpen(false); setMobileOpen(false) } }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return <>
    <div className="announcement"><span>Thoughtfully made. Beautifully shared.</span><span className="announcement-location">LAHORE, PAKISTAN <span>Â·</span> DEMO EXPERIENCE</span></div>
    <header className="site-header">
      <button className="mobile-menu-toggle icon-button" aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'} onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <X size={22} /> : <MenuIcon size={22} />}</button>
      <Link to="/" className="brand-lockup" aria-label="KORU homepage"><span className="brand-mark">K</span><span className="brand-word">KORU<small>LAHORE</small></span></Link>
      <nav className="desktop-nav" aria-label="Main navigation">{publicLinks.map(link => <NavLink key={link.to} to={link.to} end={link.to === '/'} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>{link.label}</NavLink>)}</nav>
      <div className="header-actions"><button className="cart-trigger" aria-label={`Open cart, ${cartCount} items`} onClick={() => setCartOpen(true)}><ShoppingBag size={19} /><span>Bag</span><b>{cartCount}</b></button><Button size="sm" onClick={() => navigate('/menu')}>Order now <ArrowRight size={14} /></Button></div>
    </header>
    {mobileOpen && <div className="mobile-menu" role="dialog" aria-label="Mobile navigation"><div className="mobile-menu-top"><span className="mobile-menu-title">Explore KORU</span><button className="icon-button" aria-label="Close menu" onClick={() => setMobileOpen(false)}><X size={20} /></button></div>{publicLinks.map((link, index) => <NavLink key={link.to} to={link.to} end={link.to === '/'} className="mobile-nav-link"><span>0{index + 1}</span>{link.label}<ChevronRight size={17} /></NavLink>)}<Button block onClick={() => navigate('/menu')}>Order online <ArrowRight size={16} /></Button><p className="mobile-menu-note">A premium dining concept Â· Lahore, Pakistan</p></div>}
    {cartOpen && <div className="cart-overlay" onMouseDown={event => { if (event.target === event.currentTarget) setCartOpen(false) }}>
      <aside className="cart-drawer" role="dialog" aria-modal="true" aria-label="Your bag">
        <div className="drawer-head"><div><span className="eyebrow">YOUR ORDER</span><h2>Your bag <span>({cartCount})</span></h2></div><button className="icon-button" aria-label="Close cart" onClick={() => setCartOpen(false)}><X size={20} /></button></div>
        {state.cart.length === 0 ? <div className="drawer-empty"><div className="empty-icon"><ShoppingBag /></div><h3>Your bag is waiting.</h3><p>Something lovely is on the menu.</p><Button onClick={() => { setCartOpen(false); navigate('/menu') }}>Explore the menu <ArrowRight size={15} /></Button></div> : <>
          <div className="drawer-lines">{state.cart.map(line => <div className="drawer-line" key={line.key}><Image src={line.image} alt={line.name} /><div className="drawer-line-info"><strong>{line.name}</strong>{line.customizations.length > 0 && <small>{line.customizations.join(' Â· ')}</small>}<span>{money(line.unitPrice)}</span><div className="drawer-line-qty"><QuantityControl quantity={line.quantity} onChange={next => setCartQuantity(line.key, next)} /><button className="remove-link" onClick={() => removeFromCart(line.key)}>Remove</button></div></div><b>{money(line.unitPrice * line.quantity)}</b></div>)}</div>
          <div className="drawer-foot"><div className="subtotal-row"><span>Subtotal</span><strong>{money(subtotal)}</strong></div><div className="subtotal-row muted"><span>Delivery estimate</span><span>{fee ? money(fee) : subtotal >= state.settings.freeDeliveryThreshold ? 'Free' : 'Calculated at checkout'}</span></div><p className="drawer-disclaimer">Sample prices and delivery rules for demonstration.</p><Button block onClick={() => { setCartOpen(false); navigate('/cart') }}>View bag & checkout <ArrowRight size={16} /></Button><button className="continue-link" onClick={() => { setCartOpen(false); navigate('/menu') }}>Continue browsing</button></div>
        </>}
      </aside>
    </div>}
  </>
}

export function Footer() {
  const { state } = useDemo()
  return <footer className="site-footer"><div className="footer-main"><div className="footer-brand"><Link to="/" className="brand-lockup footer-brand-lockup"><span className="brand-mark">K</span><span className="brand-word">KORU<small>LAHORE</small></span></Link><p>{state.settings.description}</p><div className="footer-socials"><a href="https://www.instagram.com/" aria-label="Camera" target="_blank" rel="noreferrer"><Camera size={17} /></a><a href="https://www.facebook.com/" aria-label="Facebook" target="_blank" rel="noreferrer"><span className="facebook-letter">f</span></a></div></div><div className="footer-column"><span className="footer-heading">Explore</span>{publicLinks.slice(1, 5).map(link => <Link key={link.to} to={link.to}>{link.label}</Link>)}</div><div className="footer-column"><span className="footer-heading">Come by</span><span>{state.settings.address}</span><span>{state.settings.openingHours}</span><span>{state.settings.phone}</span></div><div className="footer-note"><span className="footer-heading">A little more KORU</span><p>Good food has a way of bringing us back to the table.</p><Link to="/menu" className="footer-order-link">See the menu <ArrowRight size={14} /></Link></div></div><div className="footer-bottom"><span>Â© {new Date().getFullYear()} KORU Lahore Â· Concept demonstration</span><span>Menu, contact details, prices and transactions are sample data.</span><Link to="/admin">Demo admin <ArrowRight size={12} /></Link></div></footer>
}

export function NotificationPreview({ order, open, onClose }: { order: DemoOrder | null; open: boolean; onClose: () => void }) {
  const [manualCopy, setManualCopy] = useState(false)
  useEffect(() => { setManualCopy(false) }, [open, order?.id])
  if (!order) return null
  const message = [
    'KORU â€” New Demo Order', '', `Order: #${order.id}`, `Customer: ${order.customer.name}`, `Phone: ${order.customer.phone}`,
    `Fulfilment: ${order.fulfilment}`, '', 'Items:', ...order.items.map(item => `â€¢ ${item.name} Ã— ${item.quantity}`), '',
    `Subtotal: ${money(order.subtotal)}`, `Delivery: ${money(order.deliveryFee)}`, `Total: ${money(order.total)}`,
    `Payment: ${order.paymentMethod}`, `Payment status: ${order.paymentStatus}`,
    ...(order.address ? [`Address: ${order.address}${order.area ? `, ${order.area}` : ''}`] : []), `Status: ${order.status}`, '', 'This is a demo notification preview. It was not sent.'
  ].join('\n')
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message)
      notify('Notification preview copied')
      onClose()
    } catch {
      setManualCopy(true)
      notify('Clipboard unavailable. Select and copy the message below.', 'error')
    }
  }
  return <Dialog open={open} onClose={onClose} title="WhatsApp notification preview" size="md"><div className="notification-demo"><div className="notification-brand"><span className="notification-avatar">K</span><div><strong>KORU Lahore</strong><small>Notification preview Â· not sent</small></div><span className="demo-pill">DEMO</span></div><div className="chat-bubble"><p className="chat-eyebrow">KORU â€” New Demo Order</p><p><strong>Order:</strong> #{order.id}<br /><strong>Customer:</strong> {order.customer.name}<br /><strong>Phone:</strong> {order.customer.phone}<br /><strong>Fulfilment:</strong> {order.fulfilment}</p><div className="chat-items">{order.items.map(item => <div key={item.key}>{item.name} Ã— {item.quantity}<span>{money(item.unitPrice * item.quantity)}</span></div>)}</div><div className="chat-total"><span>Subtotal</span><span>{money(order.subtotal)}</span><span>Delivery</span><span>{money(order.deliveryFee)}</span><strong>Total</strong><strong>{money(order.total)}</strong></div><p><strong>Payment:</strong> {order.paymentMethod}<br /><strong>Status:</strong> {order.status}{order.address && <><br /><strong>Address:</strong> {order.address}</>}</p><small className="chat-time">Preview only Â· not transmitted</small></div>{manualCopy && <textarea className="manual-copy" aria-label="Selectable notification message" value={message} readOnly onFocus={event => event.currentTarget.select()} />}<div className="notification-actions"><Button variant="secondary" onClick={onClose}>Close</Button><Button onClick={copy}><Check size={15} /> Copy message</Button></div><p className="fine-print">No WhatsApp message is actually sent by this prototype.</p></div></Dialog>
}
