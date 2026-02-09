import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../store/slices/authSlice.jsx'

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const { items } = useSelector(state => state.cart)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  const isActive = (path) => location.pathname === path

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl blur opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <div className="relative bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-2xl transform group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">🍽️</span>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                SellExpress
              </h1>
              <p className="text-xs text-gray-500 font-medium">Cuisine Béninoise</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <Link
              to="/"
              className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                isActive('/')
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Accueil
              </span>
            </Link>

            {user && (
              <>
                <Link
                  to="/orders"
                  className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                    isActive('/orders')
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Commandes
                  </span>
                </Link>

                <Link
                  to="/profile"
                  className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                    isActive('/profile')
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profil
                  </span>
                </Link>
              </>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-all duration-300 group"
            >
              <svg className="w-6 h-6 text-gray-700 group-hover:text-orange-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {totalItems > 0 && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-black w-6 h-6 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  {totalItems}
                </div>
              )}
            </Link>

            {/* Auth Buttons */}
            {user ? (
              <div className="hidden md:flex items-center space-x-3">
                <div className="px-4 py-2 bg-gray-100 rounded-xl">
                  <span className="text-sm font-semibold text-gray-700">👋 {user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-xl hover:from-red-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-6 py-2 text-gray-700 font-semibold hover:text-orange-600 transition-colors"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  S'inscrire
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 animate-fadeInUp">
            <div className="flex flex-col space-y-2">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                  isActive('/') ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                🏠 Accueil
              </Link>
              
              {user && (
                <>
                  <Link
                    to="/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                      isActive('/orders') ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    📋 Commandes
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                      isActive('/profile') ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    👤 Profil
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout()
                      setMobileMenuOpen(false)
                    }}
                    className="px-4 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-colors text-left"
                  >
                    🚪 Déconnexion
                  </button>
                </>
              )}

              {!user && (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 text-gray-700 font-semibold hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    🔑 Connexion
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-red-600 transition-all"
                  >
                    ✨ S'inscrire
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar