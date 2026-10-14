import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, CreditCard, MapPin, ShieldCheck, ShoppingBag, Truck, Wallet, XCircle } from 'lucide-react'
import { useDemo } from '../context/DemoContext'
import { Button, Dialog, Field, Image, SectionEyebrow, notify } from '../components/UI'
import { money } from '../lib/format'
import type { Fulfilment, PaymentMethod } from '../types'

type CheckoutFields = { name: string; phone: string; email: string; fulfilment: Fulfilment; address: string; area: string; deliveryInstructions: string; specialInstructions: string; paymentMethod: PaymentMethod }
const defaultFields: CheckoutFields = { name: '', phone: '', email: '', fulfilment: 'Delivery', address: '', area: '', deliveryInstructions: '', specialInstructions: '', paymentMethod: 'Cash on Delivery' }

export default function CheckoutPage() {
  const { state, subtotal, deliveryFeeFor, createOrder } = useDemo()
  const navigate = useNavigate()
  const [fields, setFields] = useState<CheckoutFields>(() => ({ ...defaultFields, fulfilment: state.settings.deliveryAvailable ? 'Delivery' : 'Pickup' }))
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [paymentOpen, setPaymentOpen] = useState(false)
  const [paymentError, setPaymentError] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const deliveryFee = deliveryFeeFor(subtotal, fields.fulfilment)
  const total = subtotal + deliveryFee
  const update = <K extends keyof CheckoutFields>(key: K, value: CheckoutFields[K]) => setFields(current => ({ ...current, [key]: value }))

  const validate = () => {
    const next: Record<string, string> = {}
    if (!fields.name.trim()) next.name = 'Please enter your full name.'
    const phone = fields.phone.replace(/[^0-9+]/g, '')
    if (!fields.phone.trim()) next.phone = 'A phone number is required.'
    else if (phone.replace(/\D/g, '').length < 7 || phone.replace(/\D/g, '').length > 15) next.phone = 'Enter a valid phone number.'
    if (fields.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) next.email = 'Enter a valid email address.'
    if (fields.fulfilment === 'Delivery' && !fields.address.trim()) next.address = 'Please enter your delivery address.'
    if (fields.fulfilment === 'Delivery' && !fields.area.trim()) next.area = 'Please enter your area or neighbourhood.'
    if (!state.cart.length) next.cart = 'Your bag is empty.'
    setErrors(next)
    return Object.keys(next).length === 0
  }
  const finishOrder = (paymentStatus: 'Paid (Demo)' | 'Cash on Delivery') => {
    setSubmitting(true)
    const order = createOrder({ name: fields.name, phone: fields.phone, email: fields.email, fulfilment: fields.fulfilment, address: fields.address, area: fields.area, deliveryInstructions: fields.deliveryInstructions, specialInstructions: fields.specialInstructions, paymentMethod: fields.paymentMethod, paymentStatus })
    setSubmitting(false)
    setPaymentOpen(false)
    navigate(`/order-confirmation/${order.id}`)
  }
  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!validate()) { notify('Please check the highlighted fields', 'error'); return }
    if (fields.paymentMethod === 'Online Payment (Demo)') { setPaymentError(false); setPaymentOpen(true) }
    else finishOrder('Cash on Delivery')
  }

  if (!state.cart.length) return <main className="standard-page section-pad"><div className="breadcrumbs"><Link to="/">Home</Link><span>/</span><span>Checkout</span></div><div className="page-intro"><SectionEyebrow>CHECKOUT</SectionEyebrow><h1>Let’s make it <em>official.</em></h1></div><div className="checkout-empty"><div className="empty-icon"><ShoppingBag /></div><h3>Your bag is empty</h3><p>Choose a few favourites before heading to checkout.</p><Button onClick={() => navigate('/menu')}>Explore the menu <ArrowRight size={15} /></Button></div></main>

  return <main className="standard-page section-pad checkout-page"><div className="breadcrumbs"><Link to="/">Home</Link><span>/</span><Link to="/cart">Your bag</Link><span>/</span><span>Checkout</span></div><div className="page-intro checkout-intro"><SectionEyebrow>ONE LAST THING</SectionEyebrow><h1>Let’s make it <em>easy.</em></h1><p>Your details are used only to complete this local demo flow. Nothing is sent to the restaurant.</p></div>
    <form onSubmit={onSubmit} noValidate><div className="checkout-layout"><div className="checkout-form-column">
      <section className="checkout-card"><div className="checkout-card-head"><span className="step-number">01</span><div><h2>Your details</h2><p>How can we get in touch?</p></div></div><div className="form-grid"><Field label="Full name" error={errors.name}><input value={fields.name} autoComplete="name" placeholder="e.g. Areeba Khan" onChange={event => update('name', event.target.value)} /></Field><Field label="Phone number" error={errors.phone}><input value={fields.phone} inputMode="tel" autoComplete="tel" placeholder="03xx xxxxxxx" onChange={event => update('phone', event.target.value)} /></Field><Field label="Email address" optional error={errors.email}><input type="email" value={fields.email} autoComplete="email" placeholder="you@example.com" onChange={event => update('email', event.target.value)} /></Field></div></section>
      <section className="checkout-card"><div className="checkout-card-head"><span className="step-number">02</span><div><h2>How would you like it?</h2><p>Pick the option that suits your plan.</p></div></div><div className="selection-cards"><button type="button" className={`selection-card ${fields.fulfilment === 'Delivery' ? 'selected' : ''}`} onClick={() => update('fulfilment', 'Delivery')} disabled={!state.settings.deliveryAvailable}><span className="selection-icon"><Truck size={18} /></span><span><strong>Delivery</strong><small>To your door · sample fee {money(state.settings.deliveryFee)}</small></span><span className="selection-radio">{fields.fulfilment === 'Delivery' && <i />}</span></button><button type="button" className={`selection-card ${fields.fulfilment === 'Pickup' ? 'selected' : ''}`} onClick={() => update('fulfilment', 'Pickup')} disabled={!state.settings.pickupAvailable}><span className="selection-icon"><ShoppingBag size={18} /></span><span><strong>Pickup</strong><small>Collect your order · no delivery fee</small></span><span className="selection-radio">{fields.fulfilment === 'Pickup' && <i />}</span></button></div>{fields.fulfilment === 'Delivery' && <div className="form-grid address-fields"><Field label="Delivery address" error={errors.address}><input value={fields.address} autoComplete="street-address" placeholder="House / building, street" onChange={event => update('address', event.target.value)} /></Field><Field label="Area or neighbourhood" error={errors.area}><input value={fields.area} placeholder="e.g. Gulberg, Lahore" onChange={event => update('area', event.target.value)} /></Field><Field label="Delivery instructions" optional><textarea rows={2} value={fields.deliveryInstructions} placeholder="Landmark, gate code, or other notes" onChange={event => update('deliveryInstructions', event.target.value)} /></Field></div>}<Field label="Notes for the kitchen" optional><textarea rows={3} value={fields.specialInstructions} maxLength={240} placeholder="Any special requests? Please note this is a demo and requests are not sent to the kitchen." onChange={event => update('specialInstructions', event.target.value)} /></Field></section>
      <section className="checkout-card"><div className="checkout-card-head"><span className="step-number">03</span><div><h2>Payment method</h2><p>Choose how you’d like to simulate payment.</p></div></div><div className="payment-options"><button type="button" className={`payment-option ${fields.paymentMethod === 'Cash on Delivery' ? 'selected' : ''}`} onClick={() => update('paymentMethod', 'Cash on Delivery')}><span className="selection-icon"><Wallet size={18} /></span><span><strong>Cash on Delivery</strong><small>Pay when you receive your order</small></span><span className="selection-radio">{fields.paymentMethod === 'Cash on Delivery' && <i />}</span></button><button type="button" className={`payment-option ${fields.paymentMethod === 'Online Payment (Demo)' ? 'selected' : ''}`} onClick={() => update('paymentMethod', 'Online Payment (Demo)')}><span className="selection-icon"><CreditCard size={18} /></span><span><strong>Online payment <em className="demo-pill">DEMO</em></strong><small>Try the simulated payment journey</small></span><span className="selection-radio">{fields.paymentMethod === 'Online Payment (Demo)' && <i />}</span></button></div>{fields.paymentMethod === 'Online Payment (Demo)' && <div className="payment-disclosure"><ShieldCheck size={16} /><span>Demo only. No card details are requested, and no real payment will be processed.</span></div>}</section>
      <div className="checkout-submit-row"><Button type="submit" size="lg" disabled={submitting}>{fields.paymentMethod === 'Online Payment (Demo)' ? 'Continue to demo payment' : 'Place demo order'} <ArrowRight size={16} /></Button><p><ShieldCheck size={14} /> No real order or payment is processed.</p></div>
    </div><aside className="order-summary checkout-summary"><div className="summary-title"><span>ORDER SUMMARY</span><span className="summary-sample">SAMPLE</span></div><div className="checkout-summary-lines">{state.cart.map(line => <div className="checkout-summary-item" key={line.key}><Image src={line.image} alt={line.name} /><div><strong>{line.name}</strong><small>Qty {line.quantity}{line.customizations.length ? ` · ${line.customizations.join(', ')}` : ''}</small></div><b>{money(line.unitPrice * line.quantity)}</b></div>)}</div><div className="summary-divider"/><div className="summary-row"><span>Subtotal</span><strong>{money(subtotal)}</strong></div><div className="summary-row"><span>{fields.fulfilment === 'Pickup' ? 'Pickup' : 'Delivery fee'}</span><strong>{deliveryFee ? money(deliveryFee) : 'Free'}</strong></div><div className="summary-total"><span>Total</span><strong>{money(total)}</strong></div><div className="summary-delivery-chip"><MapPin size={14} /><span>{fields.fulfilment === 'Delivery' ? (fields.area || 'Delivery area not entered') : 'Pickup selected'} </span></div><div className="summary-sample-note">This is a frontend concept demo. Sample order data is stored only in this browser.</div><Link to="/cart" className="back-to-bag"><ArrowLeft size={14} /> Edit your bag</Link></aside></div></form>
    <Dialog open={paymentOpen} onClose={() => setPaymentOpen(false)} title="Simulated online payment" size="md"><div className="mock-payment"><div className="mock-payment-brand"><span className="mock-payment-icon"><CreditCard size={22} /></span><div><strong>KORU checkout</strong><small>Secure payment demo</small></div><span className="demo-pill">TEST FLOW</span></div><div className="mock-payment-amount"><span>Order total</span><strong>{money(total)}</strong><small>Amount shown for demonstration only</small></div>{paymentError && <div className="payment-error"><XCircle size={17} /><div><strong>Demo payment wasn't completed</strong><span>You can retry the simulation or go back and choose Cash on Delivery.</span></div></div>}<div className="payment-disclosure prominent"><ShieldCheck size={17} /><span>No card or banking details are collected. These buttons only simulate a payment response.</span></div><Button block onClick={() => finishOrder('Paid (Demo)')}><Check size={16} /> Simulate successful payment</Button><Button block variant="secondary" onClick={() => setPaymentError(true)}><XCircle size={16} /> Simulate payment failure</Button><button className="continue-link" onClick={() => { setPaymentOpen(false); setPaymentError(false) }}>Return to checkout</button></div></Dialog>
  </main>
}
