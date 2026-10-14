import { useEffect, useMemo, useState } from 'react'
import { Search, X, SlidersHorizontal, ChevronDown, UtensilsCrossed } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { useDemo } from '../context/DemoContext'
import { Image, Button, EmptyState, Field, PageIntro, SectionEyebrow } from '../components/UI'
import { ProductCard } from '../components/ProductCard'
import { ProductQuickView } from '../components/ProductQuickView'
import type { Category, MenuItem } from '../types'
import { CATEGORIES } from '../types'

export default function MenuPage() {
  const { state } = useDemo()
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeCategory, setActiveCategory] = useState<string>(searchParams.get('category') ?? 'All')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('popular')
  const [vegetarian, setVegetarian] = useState(false)
  const [spicy, setSpicy] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [selected, setSelected] = useState<MenuItem | null>(null)
  useEffect(() => {
    const fromUrl = searchParams.get('category')
    setActiveCategory(fromUrl && (CATEGORIES as readonly string[]).includes(fromUrl) ? fromUrl : 'All')
  }, [searchParams])
  const selectCategory = (category: string) => {
    setActiveCategory(category)
    const next = new URLSearchParams(searchParams)
    category === 'All' ? next.delete('category') : next.set('category', category)
    setSearchParams(next, { replace: true })
  }
  const filtered = useMemo(() => {
    let result = state.menu.filter(item => item.isAvailable || activeCategory === 'All')
    if (activeCategory !== 'All') result = result.filter(item => item.category === activeCategory)
    const query = search.trim().toLowerCase()
    if (query) result = result.filter(item => `${item.name} ${item.description} ${item.category}`.toLowerCase().includes(query))
    if (vegetarian) result = result.filter(item => item.isVegetarian)
    if (spicy) result = result.filter(item => item.isSpicy)
    if (sort === 'price-low') result = [...result].sort((a, b) => a.price - b.price)
    else if (sort === 'price-high') result = [...result].sort((a, b) => b.price - a.price)
    else if (sort === 'name') result = [...result].sort((a, b) => a.name.localeCompare(b.name))
    else result = [...result].sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured))
    return result
  }, [state.menu, activeCategory, search, vegetarian, spicy, sort])
  const resetFilters = () => { setSearch(''); setVegetarian(false); setSpicy(false); setSort('popular'); selectCategory('All') }
  return <>
    <section className="menu-hero"><div className="menu-hero-copy"><SectionEyebrow>THE KORU TABLE</SectionEyebrow><h1>A menu for<br /><em>every mood.</em></h1><p>Thoughtful favourites, ingredients worth celebrating, and a little something for the sweet tooth.</p><div className="menu-hero-meta"><span><UtensilsCrossed size={15} /> {state.menu.length} sample dishes</span><span>MADE TO BE SHARED</span></div></div><div className="menu-hero-image"><Image src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1300&q=85" alt="Fresh ingredients prepared for a restaurant menu" loading="eager" /><div className="menu-photo-caption">FRESH IDEAS · KORU MENU CONCEPT</div></div></section>
    <section className="menu-listing section-pad"><div className="menu-listing-heading"><div><SectionEyebrow>FIND YOUR FAVOURITE</SectionEyebrow><h2>Explore <em>the menu.</em></h2></div><p>Menu items and prices are illustrative sample data, not verified restaurant pricing.</p></div>
      <div className="menu-controls"><div className="category-tabs" role="tablist" aria-label="Menu categories">{['All', ...CATEGORIES].map(category => <button role="tab" aria-selected={activeCategory === category} key={category} className={activeCategory === category ? 'category-tab active' : 'category-tab'} onClick={() => selectCategory(category)}>{category}</button>)}</div><div className="menu-search-row"><label className="search-field"><Search size={17} /><input type="search" value={search} placeholder="Search the menu…" aria-label="Search dishes" onChange={event => setSearch(event.target.value)} />{search && <button aria-label="Clear search" onClick={() => setSearch('')}><X size={15} /></button>}</label><button className={`filter-toggle ${showFilters ? 'active' : ''}`} onClick={() => setShowFilters(!showFilters)}><SlidersHorizontal size={16} /> Filters <ChevronDown size={15} /></button><label className="sort-field"><span>Sort by</span><select value={sort} onChange={event => setSort(event.target.value)}><option value="popular">Popular</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="name">Name A–Z</option></select></label></div>
      {showFilters && <div className="filters-panel"><label className="filter-check"><input type="checkbox" checked={vegetarian} onChange={event => setVegetarian(event.target.checked)} /><span className="fake-check" /> Vegetarian <span className="filter-count">{state.menu.filter(item => item.isVegetarian).length}</span></label><label className="filter-check"><input type="checkbox" checked={spicy} onChange={event => setSpicy(event.target.checked)} /><span className="fake-check" /> Spicy <span className="filter-count">{state.menu.filter(item => item.isSpicy).length}</span></label>{(vegetarian || spicy) && <button className="clear-filters" onClick={() => { setVegetarian(false); setSpicy(false) }}>Clear filters</button>}</div>}</div>
      <div className="menu-results-line"><span>{filtered.length} {filtered.length === 1 ? 'dish' : 'dishes'} to explore</span>{(search || activeCategory !== 'All' || vegetarian || spicy) && <button onClick={resetFilters}>Clear all <X size={13} /></button>}</div>
      {filtered.length ? <div className="product-grid menu-product-grid">{filtered.map(item => <ProductCard key={item.id} item={item} onQuickView={setSelected} />)}</div> : <EmptyState icon={<Search />} title="Nothing on the menu just yet" description="Try another dish name, category, or clear the filters to see everything." action={<Button variant="secondary" onClick={resetFilters}>Clear search & filters</Button>} />}
      <div className="menu-demo-note"><span>i</span><p><strong>A note on this menu</strong> Everything shown here, including dish names, descriptions, customization options and prices, is sample demo content designed to show how a digital ordering experience could work.</p></div>
    </section><ProductQuickView item={selected} open={Boolean(selected)} onClose={() => setSelected(null)} />
  </>
}
