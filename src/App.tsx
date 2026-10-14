import { BrowserRouter, Link, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { DemoProvider } from './context/DemoContext'
import { Header, Footer } from './components/Navigation'
import ToastHost from './components/Toast'
import HomePage from './pages/HomePage'
import MenuPage from './pages/MenuPage'
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import { OrderConfirmationPage, TrackOrderPage } from './pages/OrderPages'
import { ContactPage, GalleryPage, PrivateDiningPage, StoryPage } from './pages/BrandPages'
import { AdminMenuPage, AdminOrdersPage, AdminOverviewPage, AdminSettingsPage, AdminShell } from './pages/AdminPages'

function PublicLayout() {
  return <div className="public-app"><Header /><Outlet /><Footer /></div>
}

function NotFound() {
  return <main className="not-found-page"><span className="not-found-code">404</span><h1>This page took<br /><em>a little detour.</em></h1><p>The page you’re looking for isn’t part of this demo experience.</p><Link to="/" className="button button-primary"><ArrowLeft size={15} /> Back to KORU</Link></main>
}

function AppRoutes() {
  return <><Routes>
    <Route element={<PublicLayout />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/menu" element={<MenuPage />} />
      <Route path="/menu/:slug" element={<ProductPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
      <Route path="/track-order/:orderId" element={<TrackOrderPage />} />
      <Route path="/story" element={<StoryPage />} />
      <Route path="/gallery" element={<GalleryPage />} />
      <Route path="/private-dining" element={<PrivateDiningPage />} />
      <Route path="/contact" element={<ContactPage />} />
    </Route>
    <Route path="/admin" element={<AdminShell title="Overview" eyebrow="RESTAURANT OPERATIONS"><AdminOverviewPage /></AdminShell>} />
    <Route path="/admin/orders" element={<AdminShell title="Orders" eyebrow="ORDER MANAGEMENT"><AdminOrdersPage /></AdminShell>} />
    <Route path="/admin/menu" element={<AdminShell title="Menu management" eyebrow="MENU & CATALOG"><AdminMenuPage /></AdminShell>} />
    <Route path="/admin/settings" element={<AdminShell title="Restaurant settings" eyebrow="SETUP & PREFERENCES"><AdminSettingsPage /></AdminShell>} />
    <Route path="/404" element={<NotFound />} />
    <Route path="*" element={<Navigate to="/404" replace />} />
  </Routes><ToastHost /></>
}

export default function App() {
  return <DemoProvider><BrowserRouter><AppRoutes /></BrowserRouter></DemoProvider>
}
