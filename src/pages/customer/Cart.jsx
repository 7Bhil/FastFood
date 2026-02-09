import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { removeFromCart, updateQuantity, clearCart } from '../../store/slices/cartSlice.jsx'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'

const Cart = () => {
  const { items, restaurant, total } = useSelector(state => state.cart)
  const { user, isAuthenticated } = useSelector(state => state.auth)
  const dispatch = useDispatch()

  const EUR_TO_XOF = 655.95
  const deliveryFee = restaurant?.deliveryFee || 500
  const finalTotal = total + deliveryFee

  const handleRemoveItem = (index) => {
    dispatch(removeFromCart(index))
  }

  const handleUpdateQuantity = (index, quantity) => {
    if (quantity >= 1) {
      dispatch(updateQuantity({ index, quantity }))
    }
  }

  const handleClearCart = () => {
    dispatch(clearCart())
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="text-6xl mb-6">🛒</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Connectez-vous pour commander</h2>
          <p className="text-gray-600 mb-8">Vous devez être connecté pour accéder à votre panier et passer commande</p>
          <Link to="/login">
            <Button variant="primary" className="w-full">
              Se connecter
            </Button>
          </Link>
          <p className="text-gray-500 text-sm mt-4">
            Pas encore de compte ?{' '}
            <Link to="/register" className="text-orange-600 hover:text-orange-700 font-medium">
              Inscrivez-vous
            </Link>
          </p>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="text-6xl mb-6 animate-bounce">🛒</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Votre panier est vide</h2>
          <p className="text-gray-600 mb-8">Découvrez nos délicieux plats et remplissez votre panier</p>
          <Link to="/">
            <Button variant="primary" className="w-full">
              Explorer les restaurants
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Votre Panier</h1>
          <p className="text-gray-600">Vos plats sélectionnés avec amour</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <div 
                key={index} 
                className="animate-fadeInUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Card hover={false} className="overflow-hidden">
                  <div className="p-6">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-xl"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                              {item.name}
                            </h3>
                            <p className="text-gray-600 text-sm line-clamp-2">
                              {item.description}
                            </p>
                          </div>
                          
                          <button
                            onClick={() => handleRemoveItem(index)}
                            className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-lg hover:bg-red-50"
                            title="Supprimer"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>

                        {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                          <div className="mb-3">
                            <div className="flex flex-wrap gap-2">
                              {Object.entries(item.selectedOptions).map(([key, value]) => (
                                <span key={key} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                  {key}: {value}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => handleUpdateQuantity(index, Math.max(1, item.quantity - 1))}
                              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                              </svg>
                            </button>
                            
                            <span className="font-bold text-xl w-12 text-center">{item.quantity}</span>
                            
                            <button
                              onClick={() => handleUpdateQuantity(index, item.quantity + 1)}
                              className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center hover:bg-orange-200 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                            </button>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-2xl font-bold text-orange-600">
                              {Math.round(item.price * item.quantity * EUR_TO_XOF)}f
                            </div>
                            <div className="text-sm text-gray-500">
                              {Math.round(item.price * EUR_TO_XOF)}f × {item.quantity}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {restaurant && (
                <Card>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Restaurant</h3>
                    <div className="flex items-center space-x-3">
                      <img 
                        src={restaurant.image} 
                        alt={restaurant.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900">{restaurant.name}</h4>
                        <p className="text-sm text-gray-600">{restaurant.deliveryTime} • {deliveryFee}f</p>
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Récapitulatif</h3>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Sous-total</span>
                      <span className="font-medium">{Math.round(total * EUR_TO_XOF)}f</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Frais de livraison</span>
                      <span className="font-medium">{deliveryFee}f</span>
                    </div>
                    
                    <div className="border-t pt-3">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span className="text-orange-600">{Math.round(finalTotal * EUR_TO_XOF)}f</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Link to="/checkout">
                      <Button variant="primary" className="w-full">
                        Passer la commande
                      </Button>
                    </Link>
                    
                    <button
                      onClick={handleClearCart}
                      className="w-full px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors font-medium"
                    >
                      Vider le panier
                    </button>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Ajouter plus de plats</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Continuez vos achats et découvrez d'autres délices
                  </p>
                  <Link to={`/restaurant/${restaurant?.id}`}>
                    <Button variant="secondary" className="w-full">
                      Voir le menu
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
