# KORU Lahore · Restaurant Website Demo

A premium, frontend-only restaurant website concept built with React, TypeScript, Vite, React Router and Lucide icons. It is designed for a live demo, not production order processing.

## Run locally

Use Node.js 22+ and an internet connection for installing packages and loading remote photography/fonts.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

To create a production-style static build:

```bash
npm run build
npm run preview
```

## Included routes

### Customer website
- `/` — Home
- `/menu` — Interactive menu with category, search, sort and dietary filters
- `/menu/:slug` — Dish detail and customization
- `/cart` — Persistent cart and totals
- `/checkout` — Delivery or pickup, cash-on-delivery flow, simulated online payment success/failure
- `/order-confirmation/:orderId` — Order summary and notification preview
- `/track-order/:orderId` — Simulated order timeline
- `/story` — Brand story concept
- `/gallery` — Filterable photography grid and keyboard-operated lightbox
- `/private-dining` — Locally saved enquiry demo
- `/contact` — Contact form demo

### Demo admin
- `/admin` — Dashboard metrics, sample order activity and quick actions
- `/admin/orders` — Search, filters, detail view, status and demo payment status editing
- `/admin/menu` — Add, edit, toggle availability, feature and delete sample dishes
- `/admin/settings` — Editable sample settings and reset-demo-data action

## Demo behaviour and boundaries

- Menu data, cart, sample orders, settings and enquiry messages are saved in browser `localStorage` under the `koru-demo-v1` key.
- The initial dataset contains 22 sample menu items and 3 sample orders.
- All prices, contact information, operating hours, address labels, dishes and seeded orders are illustrative demo data, not verified KORU business information.
- Online payment is simulated. No card or banking details are requested and no money is charged.
- WhatsApp notification content can be previewed and copied, but is never sent.
- Checkout creates a local demo order only. It is not transmitted to a restaurant.
- Admin screens are not secured and must not be treated as a real restaurant operations system.
- Photography and fonts are loaded from remote URLs, so they require internet access. Image elements have a styled fallback if a photo fails.

## Reset the demo

Use **Admin → Restaurant settings → Reset demo data**. It restores the original menu/settings/sample orders and clears the cart and saved enquiries.
