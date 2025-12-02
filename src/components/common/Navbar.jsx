import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../store/slices/authSlice.jsx'

const Navbar = () => {
  const { isAuthenticated, user } = useSelector(state => state.auth)
  const { items } = useSelector(state => state.cart)
  const [showMenu, setShowMenu] = useState(false)
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(logout())
    setShowMenu(false)
  }

  const getRoleLabel = (role) => {
    switch(role) {
      case 'customer': return 'Client'
      case 'restaurant': return 'Restaurateur'
      case 'delivery': return 'Livreur'
      case 'admin': return 'Administrateur'
      default: return 'Utilisateur'
    }
  }

  const getDashboardLink = () => {
    switch(user?.role) {
      case 'restaurant': return '/restaurant/dashboard'
      case 'delivery': return '/delivery/dashboard'
      case 'admin': return '/admin/dashboard'
      default: return '/profile'
    }
  }

  // Calculer le total d'articles dans le panier
  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0)

  return (
    <div className="sticky top-0 z-50 bg-white shadow-lg safe-area-top">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center" onClick={() => setShowMenu(false)}>
          <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
             FoodApp
          </span>
        </Link>

        {/* Actions droite */}
        <div className="flex items-center space-x-2">
          {isAuthenticated ? (
            <>


              {/* Badge panier - visible pour tous les rôles */}
              <Link 
                to="/cart" 
                className="relative p-2 active:bg-orange-50 rounded-full transition-colors" 
                onClick={() => setShowMenu(false)}
              >
                <span className="text-2xl">🛒</span>
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full min-w-[20px] h-5 px-1 text-xs flex items-center justify-center font-bold shadow-lg">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
              
              {/* Menu utilisateur */}
              <div className="relative">
                <button 
                  className="flex items-center space-x-1 p-2 active:bg-orange-50 rounded-full transition-colors"
                  onClick={() => setShowMenu(!showMenu)}
                >
                  <span className="text-2xl">👤</span>
                </button>
                
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                    <div className="p-5 bg-gradient-to-r from-orange-500 to-red-500 text-white">
                      <p className="text-base font-bold mb-1">{user?.name || 'Utilisateur'}</p>
                      <p className="text-sm opacity-90 mb-3">{user?.email}</p>
                      <div className="inline-flex items-center bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-3 py-1.5">
                        <span className="text-xs font-medium">{getRoleLabel(user?.role)}</span>
                      </div>
                    </div>
                    <div className="p-3">
                      <Link
                        to={getDashboardLink()}
                        className="flex items-center px-4 py-3 text-base hover:bg-orange-50 rounded-2xl transition-colors font-medium mb-1"
                        onClick={() => setShowMenu(false)}
                      >
                        <span className="mr-3 text-xl">{user?.role === 'customer' ? '👤' : '📊'}</span>
                        <span>{user?.role === 'customer' ? 'Mon profil' : 'Mon dashboard'}</span>
                      </Link>
                      <Link
                        to="/cart"
                        className="flex items-center px-4 py-3 text-base hover:bg-orange-50 rounded-2xl transition-colors font-medium mb-1"
                        onClick={() => setShowMenu(false)}
                      >
                        <span className="mr-3 text-xl">📦</span>
                        <span>Mes commandes</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-3 text-base hover:bg-red-50 rounded-2xl transition-colors font-medium text-red-600"
                      >
                        <span className="mr-3 text-xl">🚪</span>
                        <span>Déconnexion</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Panier accessible même déconnecté */}
              <Link 
                to="/cart" 
                className="relative p-2 active:bg-orange-50 rounded-full transition-colors" 
                onClick={() => setShowMenu(false)}
              >
                <span className="text-2xl">🛒</span>
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full min-w-[20px] h-5 px-1 text-xs flex items-center justify-center font-bold shadow-lg">
                    {cartItemsCount}
                  </span>
                )}
              </Link>

              {/* Bouton connexion */}
              <Link 
                to="/login" 
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg active:scale-95 transition-all"
              >
                Connexion
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Overlay pour fermer le menu */}
      {showMenu && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 z-40" 
          onClick={() => setShowMenu(false)}
        ></div>
      )}
    </div>
  )
}

export default Navbar