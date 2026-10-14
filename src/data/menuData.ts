import type { MenuItem, DemoOrder, RestaurantSettings } from '../types'

const img = (id: string, width = 1000) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`

export const initialMenu: MenuItem[] = [
  { id: 'm01', slug: 'truffle-parmesan-fries', name: 'Truffle Parmesan Fries', category: 'Starters', description: 'Crisp golden fries, shaved parmesan, truffle oil and garden herbs.', price: 1150, image: img('photo-1573080496219-bb080dd4f877'), isFeatured: true, isAvailable: true, isVegetarian: true, isSpicy: false, customizations: [{ label: 'Dip', options: [{ name: 'Garlic aioli' }, { name: 'Smoky tomato' }, { name: 'No dip' }] }] },
  { id: 'm02', slug: 'burrata-heirloom-tomato', name: 'Burrata & Heirloom Tomato', category: 'Starters', description: 'Creamy burrata, ripe tomatoes, basil oil and toasted sourdough.', price: 1850, image: img('photo-1608039829572-78524f79c4c7'), isFeatured: true, isAvailable: true, isVegetarian: true, isSpicy: false, customizations: [{ label: 'Bread', options: [{ name: 'Sourdough' }, { name: 'Gluten-free crackers', extra: 200 }] }] },
  { id: 'm03', slug: 'crispy-chicken-bites', name: 'Crispy Chicken Bites', category: 'Starters', description: 'Buttermilk-marinated chicken, a light crunch and house dip.', price: 1450, image: img('photo-1626082927389-6cd097cdc6ec'), isFeatured: false, isAvailable: true, isVegetarian: false, isSpicy: true, customizations: [{ label: 'Heat', options: [{ name: 'Mild' }, { name: 'House spicy' }, { name: 'Extra spicy' }] }] },
  { id: 'm04', slug: 'garden-crunch-salad', name: 'Garden Crunch Salad', category: 'Salads', description: 'Seasonal greens, cucumber, radish, seeds and lemon herb dressing.', price: 1350, image: img('photo-1512621776951-a57141f2eefd'), isFeatured: false, isAvailable: true, isVegetarian: true, isSpicy: false, customizations: [{ label: 'Dressing', options: [{ name: 'Lemon herb' }, { name: 'Balsamic' }, { name: 'On the side' }] }] },
  { id: 'm05', slug: 'grilled-chicken-caesar', name: 'Grilled Chicken Caesar', category: 'Salads', description: 'Chargrilled chicken, crisp lettuce, parmesan and classic Caesar dressing.', price: 1750, image: img('photo-1547592180-85f173990554'), isFeatured: true, isAvailable: true, isVegetarian: false, isSpicy: false, customizations: [{ label: 'Croutons', options: [{ name: 'Regular' }, { name: 'No croutons' }] }] },
  { id: 'm06', slug: 'slow-roasted-chicken', name: 'Slow-Roasted Chicken', category: 'Main Course', description: 'Herb-roasted chicken, silky mash and pan jus with seasonal vegetables.', price: 2850, image: img('photo-1532550907401-a500c9a57435'), isFeatured: true, isAvailable: true, isVegetarian: false, isSpicy: false, customizations: [{ label: 'Side', options: [{ name: 'Creamy mash' }, { name: 'Roasted potatoes' }, { name: 'Seasonal greens' }] }] },
  { id: 'm07', slug: 'miso-glazed-salmon', name: 'Miso-Glazed Salmon', category: 'Main Course', description: 'Pan-seared salmon, sesame greens and ginger-lime rice.', price: 3450, image: img('photo-1467003909585-2f8a72700288'), isFeatured: true, isAvailable: true, isVegetarian: false, isSpicy: false, customizations: [{ label: 'Rice', options: [{ name: 'Ginger-lime rice' }, { name: 'Steamed rice' }, { name: 'No rice' }] }] },
  { id: 'm08', slug: 'wild-mushroom-risotto', name: 'Wild Mushroom Risotto', category: 'Main Course', description: 'Slow-stirred Arborio rice, wild mushrooms, thyme and parmesan.', price: 2450, image: img('photo-1476124369491-e7addf5db371'), isFeatured: false, isAvailable: true, isVegetarian: true, isSpicy: false, customizations: [{ label: 'Finish', options: [{ name: 'Parmesan' }, { name: 'Vegan herb oil' }] }] },
  { id: 'm09', slug: 'koru-chargrilled-steak', name: 'Chargrilled Steak', category: 'Grills', description: 'A tender chargrilled cut, peppercorn sauce and rosemary potatoes.', price: 4650, image: img('photo-1544025162-d76694265947'), isFeatured: true, isAvailable: true, isVegetarian: false, isSpicy: false, customizations: [{ label: 'Doneness', options: [{ name: 'Medium rare' }, { name: 'Medium' }, { name: 'Well done' }] }, { label: 'Sauce', options: [{ name: 'Peppercorn' }, { name: 'Garlic butter' }, { name: 'No sauce' }] }] },
  { id: 'm10', slug: 'smoky-grilled-prawns', name: 'Smoky Grilled Prawns', category: 'Grills', description: 'Charcoal-kissed prawns, chilli-lime butter and fresh herbs.', price: 3250, image: img('photo-1559737558-2f5a35f4523b'), isFeatured: false, isAvailable: true, isVegetarian: false, isSpicy: true, customizations: [{ label: 'Heat', options: [{ name: 'Mild' }, { name: 'Spicy' }] }] },
  { id: 'm11', slug: 'herb-chicken-alfredo', name: 'Herb Chicken Alfredo', category: 'Pasta', description: 'Fettuccine in a parmesan cream sauce with grilled chicken.', price: 2350, image: img('photo-1645112411341-6c4fd023714a'), isFeatured: true, isAvailable: true, isVegetarian: false, isSpicy: false, customizations: [{ label: 'Pasta', options: [{ name: 'Fettuccine' }, { name: 'Penne' }] }] },
  { id: 'm12', slug: 'roasted-tomato-linguine', name: 'Roasted Tomato Linguine', category: 'Pasta', description: 'Slow-roasted tomatoes, basil, garlic and extra virgin olive oil.', price: 1950, image: img('photo-1473093295043-cdd812d0e601'), isFeatured: false, isAvailable: true, isVegetarian: true, isSpicy: false, customizations: [{ label: 'Add-on', options: [{ name: 'None' }, { name: 'Burrata', extra: 650 }, { name: 'Grilled chicken', extra: 550 }] }] },
  { id: 'm13', slug: 'spicy-arrabbiata', name: 'Spicy Arrabbiata', category: 'Pasta', description: 'Penne, slow-simmered tomato, garlic, chilli and basil.', price: 1850, image: img('photo-1551183053-bf91a1d81141'), isFeatured: false, isAvailable: true, isVegetarian: true, isSpicy: true, customizations: [{ label: 'Heat', options: [{ name: 'Medium' }, { name: 'Hot' }] }] },
  { id: 'm14', slug: 'roasted-vegetable-bowl', name: 'Roasted Vegetable Bowl', category: 'Main Course', description: 'Seasonal roasted vegetables, pearl couscous, herbs and tahini.', price: 1850, image: img('photo-1547592180-85f173990554'), isFeatured: false, isAvailable: true, isVegetarian: true, isSpicy: false, customizations: [{ label: 'Base', options: [{ name: 'Pearl couscous' }, { name: 'Quinoa' }] }] },
  { id: 'm15', slug: 'dark-chocolate-torte', name: 'Dark Chocolate Torte', category: 'Desserts', description: 'A rich chocolate slice with berries and lightly whipped cream.', price: 1050, image: img('photo-1578985545062-69928b1d9587'), isFeatured: true, isAvailable: true, isVegetarian: true, isSpicy: false, customizations: [{ label: 'Cream', options: [{ name: 'On the side' }, { name: 'No cream' }] }] },
  { id: 'm16', slug: 'pistachio-cheesecake', name: 'Pistachio Cheesecake', category: 'Desserts', description: 'Silky cheesecake, roasted pistachio crumb and a buttery biscuit base.', price: 1150, image: img('photo-1533134242443-d4fd215305ad'), isFeatured: false, isAvailable: true, isVegetarian: true, isSpicy: false, customizations: [] },
  { id: 'm17', slug: 'vanilla-bean-panna-cotta', name: 'Vanilla Bean Panna Cotta', category: 'Desserts', description: 'Delicate vanilla cream, seasonal fruit and a bright berry coulis.', price: 950, image: img('photo-1488477181946-6428a0291777'), isFeatured: false, isAvailable: true, isVegetarian: true, isSpicy: false, customizations: [] },
  { id: 'm18', slug: 'citrus-garden-cooler', name: 'Citrus Garden Cooler', category: 'Beverages', description: 'Fresh citrus, mint, sparkling water and a little garden sweetness.', price: 650, image: img('photo-1513558161293-cdaf765edfd7'), isFeatured: true, isAvailable: true, isVegetarian: true, isSpicy: false, customizations: [{ label: 'Sweetness', options: [{ name: 'Regular' }, { name: 'Less sweet' }, { name: 'No added sugar' }] }] },
  { id: 'm19', slug: 'berry-basil-spritz', name: 'Berry Basil Spritz', category: 'Beverages', description: 'Crushed berries, fresh basil and a sparkling citrus finish.', price: 750, image: img('photo-1536935338788846bb9981813'), isFeatured: false, isAvailable: true, isVegetarian: true, isSpicy: false, customizations: [{ label: 'Ice', options: [{ name: 'Regular ice' }, { name: 'Light ice' }, { name: 'No ice' }] }] },
  { id: 'm20', slug: 'iced-spanish-latte', name: 'Iced Spanish Latte', category: 'Beverages', description: 'Double espresso, chilled milk and a smooth touch of sweetness.', price: 680, image: img('photo-1461023058943-07fcbe16d735'), isFeatured: false, isAvailable: true, isVegetarian: true, isSpicy: false, customizations: [{ label: 'Milk', options: [{ name: 'Regular' }, { name: 'Oat milk', extra: 180 }] }] },
  { id: 'm21', slug: 'crispy-cauliflower', name: 'Crispy Cauliflower', category: 'Starters', description: 'Lightly crisp cauliflower, sesame, herbs and a tangy house glaze.', price: 1250, image: img('photo-1563805042-7684c019e1cb'), isFeatured: false, isAvailable: true, isVegetarian: true, isSpicy: true, customizations: [{ label: 'Heat', options: [{ name: 'Mild' }, { name: 'Spicy' }] }] },
  { id: 'm22', slug: 'loaded-koru-burger', name: 'KORU House Burger', category: 'Grills', description: 'A juicy house patty, aged cheddar, lettuce and our signature sauce.', price: 2250, image: img('photo-1568901346375-23c9450c58cd'), isFeatured: false, isAvailable: true, isVegetarian: false, isSpicy: false, customizations: [{ label: 'Patty', options: [{ name: 'Beef' }, { name: 'Crispy chicken' }, { name: 'Plant-based', extra: 250 }] }, { label: 'Add-on', options: [{ name: 'No add-on' }, { name: 'Extra cheddar', extra: 250 }, { name: 'Caramelized onion', extra: 180 }] }] },
]

export const initialSettings: RestaurantSettings = {
  restaurantName: 'KORU Lahore',
  description: 'Thoughtfully prepared dishes, warm hospitality, and moments made to be shared.',
  phone: '+92 300 000 0000 · sample number',
  email: 'hello@koru-demo.example',
  address: 'Lahore, Pakistan · sample location for demonstration',
  openingHours: 'Daily, 12 pm – 11 pm · sample hours',
  deliveryFee: 250,
  freeDeliveryThreshold: 5000,
  pickupAvailable: true,
  deliveryAvailable: true,
}

const orderItem = (item: MenuItem, quantity: number, key: string) => ({
  key, productId: item.id, name: item.name, image: item.image, unitPrice: item.price, basePrice: item.price, quantity, customizations: [], specialInstructions: '',
})

export const createInitialOrders = (): DemoOrder[] => {
  const items = initialMenu
  const makeOrder = (id: string, name: string, phone: string, item: MenuItem, quantity: number, status: DemoOrder['status'], paymentMethod: DemoOrder['paymentMethod'], fulfilment: DemoOrder['fulfilment'], hoursAgo: number): DemoOrder => {
    const lines = [orderItem(item, quantity, `${item.id}-${id}`)]
    const subtotal = lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0)
    const deliveryFee = fulfilment === 'Delivery' && subtotal < initialSettings.freeDeliveryThreshold ? initialSettings.deliveryFee : 0
    return {
      id, customer: { name, phone }, items: lines, subtotal, deliveryFee, total: subtotal + deliveryFee,
      fulfilment, address: fulfilment === 'Delivery' ? 'Sample address, Gulberg, Lahore' : undefined,
      area: fulfilment === 'Delivery' ? 'Gulberg' : undefined, paymentMethod,
      paymentStatus: paymentMethod === 'Online Payment (Demo)' ? 'Paid (Demo)' : 'Cash on Delivery', status,
      createdAt: new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString(),
    }
  }
  return [
    makeOrder('KORU-1043', 'Areeba Khan', '0300 000 1043', items[8], 1, 'Preparing', 'Cash on Delivery', 'Delivery', 0.8),
    makeOrder('KORU-1042', 'Hamza Ali', '0300 000 1042', items[10], 2, 'Confirmed', 'Online Payment (Demo)', 'Pickup', 3),
    makeOrder('KORU-1041', 'Maham Siddiqui', '0300 000 1041', items[14], 2, 'Completed', 'Cash on Delivery', 'Delivery', 26),
  ]
}
