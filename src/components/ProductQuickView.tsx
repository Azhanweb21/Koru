import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, Check, Flame, Leaf, Minus, Plus, ShoppingBag, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { MenuItem } from '../types'
import { useDemo } from '../context/DemoContext'
import { money } from '../lib/format'
import { Button, Dialog, Field, Image, QuantityControl, notify } from './UI'

export function ProductQuickView({ item, open, onClose }: { item: MenuItem | null; open: boolean; onClose: () => void }) {
  const { addToCart } = useDemo()
  const [quantity, setQuantity] = useState(1)
  const [choices, setChoices] = useState<Record<string, string>>({})
  const [instructions, setInstructions] = useState('')
  useEffect(() => { setQuantity(1); setChoices({}); setInstructions('') }, [item?.id, open])
  const customizations = useMemo(() => item?.customizations.map(group => {
    const selected = choices[group.label]
    const option = group.options.find(opt => opt.name === selected)
    return { label: group.label, selected, extra: option?.extra ?? 0 }
  }).filter(row => row.selected).map(row => `${row.label}: ${row.selected}`) ?? [], [item, choices])
  const unitPrice = useMemo(() => (item?.price ?? 0) + (item?.customizations.reduce((sum, group) => {
    const option = group.options.find(opt => opt.name === choices[group.label])
    return sum + (option?.extra ?? 0)
  }, 0) ?? 0), [item, choices])
  if (!item) return null
  const add = () => { addToCart(item, { quantity, customizations, specialInstructions: instructions, unitPrice }); notify(`${item.name} added to your bag`); onClose() }
  return <Dialog open={open} onClose={onClose} title="A closer look" size="lg"><div className="quick-view-layout"><div className="quick-view-photo"><Image src={item.image} alt={item.name} loading="eager" /><span className="photo-caption">A KORU menu concept</span></div><div className="quick-view-detail"><div className="product-meta"><span>{item.category}</span><div className="diet-icons">{item.isVegetarian && <Leaf size={14} />}{item.isSpicy && <Flame size={14} />}</div></div><h2>{item.name}</h2><p className="quick-view-desc">{item.description}</p><div className="quick-price">{money(unitPrice)} <small>per item</small></div>{!item.isAvailable ? <div className="notice notice-warm">This sample item is currently unavailable.</div> : <>
      {item.customizations.map(group => <Field key={group.label} label={group.label}><div className="option-pills">{group.options.map(option => <button key={option.name} type="button" className={`option-pill ${choices[group.label] === option.name ? 'selected' : ''}`} onClick={() => setChoices(current => ({ ...current, [group.label]: option.name }))}>{option.name}{option.extra ? <small> +{money(option.extra)}</small> : null}</button>)}</div></Field>)}
      <Field label="Special instructions" optional><textarea rows={2} maxLength={180} placeholder="Any notes for the kitchen…" value={instructions} onChange={event => setInstructions(event.target.value)} /></Field>
      <div className="quick-view-add"><QuantityControl quantity={quantity} onChange={setQuantity} /><Button onClick={add}><ShoppingBag size={16} /> Add · {money(unitPrice * quantity)}</Button></div></>}
      <div className="quick-demo-note">Menu item and pricing are sample data for this website demonstration.</div>
    </div></div></Dialog>
}

export function ProductCustomizer({ item }: { item: MenuItem }) {
  const { addToCart } = useDemo()
  const navigate = useNavigate()
  const [quantity, setQuantity] = useState(1)
  const [choices, setChoices] = useState<Record<string, string>>({})
  const [instructions, setInstructions] = useState('')
  const customizations = useMemo(() => item.customizations.map(group => ({ label: group.label, selected: choices[group.label], extra: group.options.find(opt => opt.name === choices[group.label])?.extra ?? 0 })).filter(row => row.selected).map(row => `${row.label}: ${row.selected}`), [item, choices])
  const unitPrice = useMemo(() => item.price + item.customizations.reduce((sum, group) => sum + (group.options.find(opt => opt.name === choices[group.label])?.extra ?? 0), 0), [item, choices])
  return <div className="product-customizer"><div className="customizer-price">{money(unitPrice)} <small>per item</small></div>{!item.isAvailable ? <div className="notice notice-warm">This sample item is currently unavailable.</div> : <>
    {item.customizations.map(group => <Field key={group.label} label={group.label}><div className="option-pills">{group.options.map(option => <button key={option.name} type="button" className={`option-pill ${choices[group.label] === option.name ? 'selected' : ''}`} onClick={() => setChoices(current => ({ ...current, [group.label]: option.name }))}>{option.name}{option.extra ? <small> +{money(option.extra)}</small> : null}</button>)}</div></Field>)}
    <Field label="Special instructions" optional><textarea rows={3} maxLength={180} placeholder="Any notes for the kitchen…" value={instructions} onChange={event => setInstructions(event.target.value)} /></Field>
    <div className="customizer-actions"><QuantityControl quantity={quantity} onChange={setQuantity} /><Button onClick={() => { addToCart(item, { quantity, customizations, specialInstructions: instructions, unitPrice }); notify(`${item.name} added to your bag`); navigate('/cart') }}><ShoppingBag size={16} /> Add to bag · {money(unitPrice * quantity)}</Button></div>
  </>}<p className="fine-print">Sample menu item, prices and customization options for demonstration.</p></div>
}
