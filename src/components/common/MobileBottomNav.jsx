import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

const MobileBottomNav = () => {
  const location = useLocation()
  const { items } = useSelector(state => state.cart)
  const { user } = useSelector(state => state.auth)

  const navItems = [
    { 
      path: '/', 
      icon: '🏠', 
      label: 'Accueil',
      active: location.pathname === '/'
    },
    { 
      path: '/search', 
      icon: '🔍', 
      label: 'Recherche',
      active: location.pathname === '/search'
    },
    { 
      path: '/cart', 
      icon: '🛒', 
      label: 'Panier',
      active: location.pathname === '/cart',
      badge: items.length > 0 ? items.length : null
    },
    { 
      path: '/orders', 
      icon: '📦', 
      label: 'Commandes',
      active: location.pathname === '/orders'
    },
{ 
  path: '/profile', 
  icon: '👤', 
  label: 'Profil',
  active: location.pathname === '/profile'
}
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom">
      <div className="flex justify-around mb-7 items-center h-16">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center w-16 ${
              item.active ? 'text-orange-500' : 'text-gray-500'
            }`}
          >
            <div className="relative">
              <span className="text-xl">{item.icon}</span>
              {item.badge && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default MobileBottomNav