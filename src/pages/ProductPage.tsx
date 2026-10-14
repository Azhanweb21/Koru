import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Flame, Leaf, ShoppingBag } from 'lucide-react'
import { useDemo } from '../context/DemoContext'
import { Image, Button, EmptyState, SectionEyebrow } from '../components/UI'
import { ProductCustomizer, ProductQuickView } from '../components/ProductQuickView'
import { ProductCard } from '../components/ProductCard'
import { useState } from 'react'
import type { MenuItem } from '../types'
import { money } from '../lib/format'

export default function ProductPage() {
  const { slug } = useParams()
  const { state } = useDemo()
  const [quickView, setQuickView] = useState<MenuItem | null>(null)
  const item = state.menu.find(product => product.slug === slug)
  if (!item) return <div className="standard-page section-pad"><EmptyState title="We couldn't find that dish" description="It may have moved off this sample menu. Browse the full menu to find something else." action={<Link to="/menu" className="button button-primary">Back to the menu <ArrowRight size={15} /></Link>} /></div>
  const related = state.menu.filter(product => product.category === item.category && product.id !== item.id && product.isAvailable).slice(0, 3)
  return <><div className="breadcrumbs page-wide"><Link to="/">Home</Link><span>/</span><Link to="/menu">Menu</Link><span>/</span><span>{item.name}</span></div><section className="product-detail-page page-wide"><div className="product-detail-photo"><Image src={item.image} alt={item.name} loading="eager" /><span className="photo-caption">A KORU menu concept</span></div><div className="product-detail-copy"><SectionEyebrow>{item.category.toUpperCase()}</SectionEyebrow><h1>{item.name}</h1><div className="product-detail-attributes">{item.isVegetarian && <span><Leaf size={14} /> Vegetarian</span>}{item.isSpicy && <span><Flame size={14} /> Spicy</span>}<span><ShoppingBag size={14} /> Sample menu item</span></div><p className="product-detail-description">{item.description}</p><div className="product-detail-base-price">{money(item.price)}</div><ProductCustomizer item={item} /><Link to="/menu" className="back-to-menu"><ArrowLeft size={15} /> Back to menu</Link></div></section>{related.length > 0 && <section className="related-section section-pad"><div className="section-heading-row"><div><SectionEyebrow>KEEP EXPLORING</SectionEyebrow><h2>More to <em>love.</em></h2></div><Link to={`/menu?category=${encodeURIComponent(item.category)}`} className="underlined-link">More {item.category.toLowerCase()} <ArrowRight size={15} /></Link></div><div className="product-grid">{related.map(product => <ProductCard key={product.id} item={product} onQuickView={setQuickView} />)}</div></section>}<ProductQuickView item={quickView} open={Boolean(quickView)} onClose={() => setQuickView(null)} /></>
}
