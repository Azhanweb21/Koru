import { Eye, Plus, Flame, Leaf } from 'lucide-react'
import type { MenuItem } from '../types'
import { Image, Button, notify } from './UI'
import { money } from '../lib/format'
import { useDemo } from '../context/DemoContext'

export function ProductCard({ item, onQuickView, compact = false }: { item: MenuItem; onQuickView: (item: MenuItem) => void; compact?: boolean }) {
  const { addToCart } = useDemo()
  return <article className={`product-card ${compact ? 'product-card-compact' : ''}`}>
    <div className="product-media" role="button" tabIndex={0} onClick={() => onQuickView(item)} onKeyDown={event => { if (event.key === 'Enter') onQuickView(item) }}>
      <Image src={item.image} alt={item.name} />
      {item.isFeatured && <span className="product-tag">KORU favourite</span>}
      {!item.isAvailable && <span className="unavailable-tag">Currently unavailable</span>}
      <button className="quick-view" aria-label={`Quick view ${item.name}`} onClick={event => { event.stopPropagation(); onQuickView(item) }}><Eye size={15} /><span>Quick view</span></button>
    </div>
    <div className="product-info">
      <div className="product-meta"><span>{item.category}</span><div className="diet-icons">{item.isVegetarian && <Leaf size={14} />}{item.isSpicy && <Flame size={14} />}</div></div>
      <button className="product-name-button" onClick={() => onQuickView(item)}><h3>{item.name}</h3></button>
      <p>{item.description}</p>
      <div className="product-bottom"><strong>{money(item.price)}</strong><Button variant="secondary" size="sm" disabled={!item.isAvailable} onClick={() => { addToCart(item); notify(`${item.name} added to your bag`) }}><Plus size={15} /> Add</Button></div>
    </div>
  </article>
}

