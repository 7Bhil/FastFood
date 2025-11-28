import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../store/slices/authSlice.jsx'

const Navbar = () => {
  const { isAuthenticated, user } = useSelector(state => state.auth)
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

  return (
    <div className="sticky top-0 z-50 bg-white shadow-sm safe-area-top">
      <div className="flex items-center justify-between h-14 px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center" onClick={() => setShowMenu(false)}>
          <span className="text-xl font-bold text-orange-500">🍔 FoodApp</span>
        </Link>

        {/* Actions droite */}
        <div className="flex items-center space-x-3">
          {isAuthenticated ? (
            <>
              {/* Lien vers le dashboard selon le rôle */}
              {user?.role !== 'customer' && (
                <Link 
                  to={getDashboardLink()} 
                  className="bg-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-medium"
                  onClick={() => setShowMenu(false)}
                >
                  {user?.role === 'restaurant' && '📊 Dashboard'}
                  {user?.role === 'delivery' && '🚗 Livraisons'}
                  {user?.role === 'admin' && '⚙️ Admin'}
                </Link>
              )}

              {/* Badge panier pour mobile */}
              {user?.role === 'customer' && (
                <Link to="/cart" className="relative p-2" onClick={() => setShowMenu(false)}>
                  <span className="text-xl">🛒</span>
                </Link>
              )}
              
              {/* Menu utilisateur */}
              <div className="relative">
                <button 
                  className="flex items-center space-x-1 p-1"
                  onClick={() => setShowMenu(!showMenu)}
                >
                  <span className="text-xl">👤</span>
                </button>
                
                {showMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
                    <div className="p-3 border-b">
                      <p className="text-sm font-medium">{user?.name || 'Utilisateur'}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                      <p className="text-xs text-orange-500 mt-1">{getRoleLabel(user?.role)}</p>
                    </div>
                    <div className="p-1">
                      <Link
                        to={getDashboardLink()}
                        className="block px-3 py-2 text-sm hover:bg-gray-100 rounded"
                        onClick={() => setShowMenu(false)}
                      >
                        {user?.role === 'customer' ? 'Mon profil' : 'Mon dashboard'}
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                      >
                        Déconnexion
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link 
              to="/login" 
              className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium"
            >
              Connexion
            </Link>
          )}
        </div>
      </div>

      {/* Overlay pour fermer le menu */}
      {showMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowMenu(false)}
        ></div>
      )}
    </div>
  )
}

export default Navbar