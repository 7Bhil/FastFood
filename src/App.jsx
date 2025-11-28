import React from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Home from './pages/customer/Home.jsx'
import Restaurant from './pages/customer/Restaurant.jsx'
import Cart from './pages/customer/Cart.jsx'
import Checkout from './pages/customer/Checkout.jsx'
import OrderConfirmation from './pages/customer/OrderConfirmation.jsx'
import Login from './pages/auth/Login.jsx'
import Register from './pages/auth/Register.jsx'
import Dashboard from './pages/restaurant/Dashboard.jsx'
import DeliveryDashboard from './pages/delivery/Dashboard.jsx'
import AdminDashboard from './pages/admin/Dashboard.jsx'
import Navbar from './components/common/Navbar.jsx'
import MobileBottomNav from './components/common/MobileBottomNav.jsx'
import Profile from './pages/customer/Profile.jsx'

function App() {
  const { isAuthenticated, user } = useSelector(state => state.auth)
  const location = useLocation()

  // Pages où on ne veut pas la bottom nav
  const noBottomNav = [
    '/login', 
    '/register', 
    '/restaurant/dashboard', 
    '/delivery/dashboard', 
    '/admin/dashboard',
    '/checkout',
    '/order-confirmation'
  ]

  const showBottomNav = isAuthenticated && 
                       user?.role === 'customer' && 
                       !noBottomNav.includes(location.pathname)

  return (
    <div className="min-h-screen bg-gray-50 safe-area">
      {/* Navbar du haut */}
      <Navbar />
      
      {/* Contenu principal */}
      <main className={`${showBottomNav ? 'pb-16' : 'pb-4'} pt-4`}>
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<Home />} />
          <Route path="/restaurant/:id" element={<Restaurant />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
  <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
  
  {/* Routes protégées (restent pour dashboard, etc.) */}
  {isAuthenticated && user?.role === 'restaurant' && (
    <Route path="/restaurant/dashboard" element={<Dashboard />} />
  )}

          {/* Routes protégées - Livreur */}
          <Route 
            path="/delivery/dashboard" 
            element={
              isAuthenticated && user?.role === 'delivery' ? 
              <DeliveryDashboard /> : 
              <Navigate to="/login" />
            } 
          />

          {/* Routes protégées - Admin */}
          <Route 
            path="/admin/dashboard" 
            element={
              isAuthenticated && user?.role === 'admin' ? 
              <AdminDashboard /> : 
              <Navigate to="/login" />
            } 
          />

          {/* Routes client avec bottom nav */}
          {isAuthenticated && user?.role === 'customer' && (
  <>
    <Route path="/search" element={<div className="p-4">Page Recherche</div>} />
    <Route path="/orders" element={<div className="p-4">Page Commandes</div>} />
    <Route path="/profile" element={<Profile />} /> {/* Ajouté */}
  </>
)}

          {/* Redirection pour accès non autorisé */}
          <Route path="/restaurant/*" element={<Navigate to="/login" />} />
          <Route path="/delivery/*" element={<Navigate to="/login" />} />
          <Route path="/admin/*" element={<Navigate to="/login" />} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      {/* Bottom Navigation - seulement pour les clients sur certaines pages */}
      {showBottomNav && <MobileBottomNav />}
    </div>
  )
}

export default App