import { useMemo, useState } from 'react'
import { ArrowDownRight, ArrowRight, ArrowUpRight, ChevronRight, Clock3, MapPin, MoveUpRight, Star } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useDemo } from '../context/DemoContext'
import { Image, Button, SectionEyebrow } from '../components/UI'
import { ProductCard } from '../components/ProductCard'
import { ProductQuickView } from '../components/ProductQuickView'
import type { MenuItem } from '../types'

const interior = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=85'
const table = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1300&q=85'
const diningDetail = 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1000&q=85'
const categories = [
  { label: 'Starters', image: 'https://images.unsplash.com/photo-1541014741259-de529411b96a?auto=format&fit=crop&w=800&q=85', number: '01' },
  { label: 'Main Course', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=85', number: '02' },
  { label: 'Grills', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=85', number: '03' },
  { label: 'Desserts', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=85', number: '04' },
]

export default function HomePage() {
  const { state } = useDemo()
  const navigate = useNavigate()
  const [selected, setSelected] = useState<MenuItem | null>(null)
  const featured = useMemo(() => state.menu.filter(item => item.isFeatured && item.isAvailable).slice(0, 4), [state.menu])
  const gallery = [state.menu[1]?.image, interior, state.menu[6]?.image, diningDetail].filter(Boolean) as string[]
  return <>
    <section className="home-hero">
      <div className="hero-image"><Image src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1800&q=90" alt="Beautifully plated fresh seasonal food on a restaurant table" loading="eager" /></div>
      <div className="hero-overlay" />
      <div className="hero-content"><SectionEyebrow light>AN INVITATION TO THE TABLE</SectionEyebrow><h1>A taste worth<br /><em>slowing down</em> for.</h1><p>Thoughtfully prepared dishes, warm hospitality, and moments made to be shared.</p><div className="hero-actions"><Button size="lg" onClick={() => navigate('/menu')}>Explore the menu <ArrowRight size={16} /></Button><Link to="/story" className="hero-text-link">Discover KORU <MoveUpRight size={15} /></Link></div><div className="hero-note"><MapPin size={14} /><span>Lahore, Pakistan</span><span className="hero-note-sep">/</span><span>Made for lingering</span></div></div>
      <div className="hero-vertical">A MOMENT TO SAVOR <span /> KORU LAHORE</div><div className="hero-scroll"><span>SCROLL TO EXPLORE</span><ArrowDownRight size={17} /></div>
    </section>

    <section className="intro-section section-pad"><div className="intro-image-wrap"><Image src={table} alt="Intimate dining table set for a restaurant dinner" /><div className="image-index"><span>01</span><span>THE KORU EXPERIENCE</span></div></div><div className="intro-copy"><SectionEyebrow>MORE THAN A MEAL</SectionEyebrow><h2>Come as you are.<br /><em>Stay a little longer.</em></h2><p className="lead-copy">Some of the best moments happen when the table is full, the conversation is easy, and there’s no reason to rush.</p><p>At KORU, every detail is an invitation to settle in. Explore a thoughtful menu, find a new favourite, and make room for one more story.</p><Link to="/story" className="underlined-link">A little about us <ArrowUpRight size={15} /></Link><div className="intro-small-image"><Image src={diningDetail} alt="Warm restaurant interior with carefully arranged tables" /><span>GOOD FOOD, GOOD COMPANY.</span></div></div></section>

    <section className="featured-section section-pad"><div className="section-heading-row"><div><SectionEyebrow>FROM THE KITCHEN</SectionEyebrow><h2>A few things<br /><em>we love.</em></h2></div><div className="section-heading-side"><p>Seasonal favourites and familiar comforts, prepared with care. A sample menu made to be explored.</p><Link to="/menu" className="underlined-link">View the full menu <ArrowRight size={15} /></Link></div></div><div className="product-grid featured-grid">{featured.map(item => <ProductCard item={item} onQuickView={setSelected} key={item.id} />)}</div><div className="mobile-center-link"><Link to="/menu" className="underlined-link">Explore all dishes <ArrowRight size={15} /></Link></div></section>

    <section className="category-section section-pad"><div className="category-top"><div><SectionEyebrow>FIND YOUR FAVOURITE</SectionEyebrow><h2>What are you<br /><em>in the mood for?</em></h2></div><p>Start with a little something, stay for the main event, and leave a little room for sweet.</p></div><div className="category-grid">{categories.map(cat => <Link key={cat.label} to={`/menu?category=${encodeURIComponent(cat.label)}`} className="category-tile"><Image src={cat.image} alt={`${cat.label} menu selection`} /><div className="category-shade" /><span className="category-number">{cat.number}</span><div className="category-label"><h3>{cat.label}</h3><span><ArrowUpRight size={17} /></span></div></Link>)}</div><div className="category-bottom"><span>THE MENU · SAMPLE CATEGORIES</span><Link to="/menu" className="underlined-link">Browse everything <ArrowRight size={15} /></Link></div></section>

    <section className="experience-section"><div className="experience-image"><Image src={interior} alt="Warm, contemporary restaurant interior with natural textures" /></div><div className="experience-copy"><SectionEyebrow light>THE KORU FEELING</SectionEyebrow><h2>A place to<br /><em>make a moment.</em></h2><p>Soft light, considered details, and a table ready for whatever brings you together. From a quiet dinner to a long-overdue catch-up, make yourself at home.</p><Link to="/gallery" className="light-link">Step inside <ArrowRight size={16} /></Link><div className="experience-number">02 <span>THE SPACE</span></div></div><div className="experience-inset"><Image src={diningDetail} alt="Close-up of a softly lit restaurant table setting" /></div></section>

    <section className="story-teaser section-pad"><div className="story-teaser-copy"><SectionEyebrow>A TABLE WITH ROOM FOR EVERYONE</SectionEyebrow><h2>Thoughtful food.<br /><em>Easy company.</em></h2><p>This is a concept built around the simple pleasure of sharing something good. The menu, setting, and service all come back to one thing: making time together feel special.</p><Link to="/story" className="underlined-link">Discover the KORU story <ArrowRight size={15} /></Link></div><div className="story-teaser-image"><Image src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1000&q=85" alt="Fresh ingredients and herbs arranged for a meal" /><span>GOOD THINGS TAKE TIME.</span></div></section>

    <section className="private-banner"><Image src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1800&q=85" alt="Elegant long dining table prepared for a private celebration" /><div className="private-banner-overlay" /><div className="private-banner-content"><SectionEyebrow light>MAKE IT YOURS</SectionEyebrow><h2>Gather around<br /><em>something special.</em></h2><p>Big moments deserve a thoughtful setting. Explore the private dining concept for celebrations, dinners, and get-togethers.</p><Button variant="light" onClick={() => navigate('/private-dining')}>Plan your event <ArrowRight size={16} /></Button></div></section>

    <section className="gallery-preview section-pad"><div className="section-heading-row"><div><SectionEyebrow>A CLOSER LOOK</SectionEyebrow><h2>Little details.<br /><em>Lasting memories.</em></h2></div><div className="section-heading-side"><p>From the first dish to the last light of the evening, take a look around the KORU concept.</p><Link to="/gallery" className="underlined-link">Visit the gallery <ArrowRight size={15} /></Link></div></div><div className="gallery-preview-grid">{gallery.map((src, index) => <Link to="/gallery" key={`${src}-${index}`} className={`gallery-preview-item gallery-preview-item-${index + 1}`}><Image src={src} alt={['A dish prepared with care', 'A view of the dining space', 'A beautifully plated main course', 'A small detail of restaurant design'][index]} /><span>0{index + 1} <ArrowUpRight size={15} /></span></Link>)}</div></section>

    <section className="visit-section section-pad"><div className="visit-copy"><SectionEyebrow>YOUR TABLE AWAITS</SectionEyebrow><h2>Meet us<br /><em>at the table.</em></h2><p>We’re building a little corner of Lahore for memorable meals and easy company. The details below are placeholders for this website demo.</p><div className="visit-details"><div><MapPin size={17} /><span><small>FIND US</small>{state.settings.address}</span></div><div><Clock3 size={17} /><span><small>WHEN TO VISIT</small>{state.settings.openingHours}</span></div></div><Link to="/contact" className="underlined-link">Contact & visit details <ArrowRight size={15} /></Link></div><div className="visit-map-demo"><div className="map-lines map-lines-one"/><div className="map-lines map-lines-two"/><div className="map-road road-one"/><div className="map-road road-two"/><div className="map-road road-three"/><div className="map-pin"><span className="map-pin-mark">K</span><div><strong>KORU Lahore</strong><small>Sample location preview</small></div></div><span className="map-caption">ILLUSTRATIVE MAP · NOT A VERIFIED ADDRESS</span></div></section>
    <ProductQuickView item={selected} open={Boolean(selected)} onClose={() => setSelected(null)} />
  </>
}
