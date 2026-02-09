import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { removeFromCart, updateQuantity, clearCart } from '../../store/slices/cartSlice.jsx'

const Cart = () => {
  const { items, total, restaurant } = useSelector(state => state.cart)
  const { isAuthenticated, user } = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const EUR_TO_XOF = 655
  const deliveryFee = 500
  const totalXOF = Math.round(total * EUR_TO_XOF)
  const finalTotalXOF = totalXOF + deliveryFee

  const handleCheckout = () => {
    // Rediriger vers checkout même si non connecté
    navigate('/checkout')
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-14 pb-16 px-4">
        <div className="max-w-md mx-auto text-center pt-8">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Votre panier est vide</h1>
          <p className="text-gray-600 mb-8">Ajoutez des plats délicieux pour commencer !</p>
          <Link
            to="/"
            className="bg-orange-500 text-white px-6 py-3 rounded-full hover:bg-orange-600"
          >
            Découvrir les restaurants
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-14 pb-16">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Votre panier</h1>

        {/* Message pour utilisateur non connecté */}
        {!isAuthenticated && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-4">
            <div className="flex items-center">
              <span className="text-blue-500 text-lg mr-2">ℹ️</span>
              <div>
                <p className="text-blue-800 font-medium">Commande sans compte</p>
                <p className="text-blue-600 text-sm">
                  Vous pouvez passer commande sans créer de compte. Vos informations seront demandées à l'étape suivante.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Liste des articles du panier */}
        <div className="space-y-4 mb-6">
          {items.map((item, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-sm p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {Math.round(item.price * EUR_TO_XOF)}f x {item.quantity}
                  </p>
                  {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                    <div className="mt-2 text-xs text-gray-500">
                      {Object.entries(item.selectedOptions).map(([key, value]) => (
                        <span key={key} className="mr-2">
                          {key}: {value}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => dispatch(removeFromCart(index))}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Supprimer
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => dispatch(updateQuantity({ index, quantity: Math.max(1, item.quantity - 1) }))}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                  >
                    -
                  </button>
                  <span className="font-medium w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => dispatch(updateQuantity({ index, quantity: item.quantity + 1 }))}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                  >
                    +
                  </button>
                </div>
                <span className="font-semibold text-gray-900">
                  {Math.round(item.price * item.quantity * EUR_TO_XOF)}f
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Restaurant info */}
        {restaurant && (
          <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
            <div className="flex items-center">
              <img 
                src={restaurant.image} 
                alt={restaurant.name}
                className="w-12 h-12 object-cover rounded-lg mr-3"
              />
              <div>
                <h4 className="font-semibold text-gray-900">{restaurant.name}</h4>
                <p className="text-sm text-gray-600">{restaurant.deliveryTime} • {restaurant.deliveryFee}f</p>
              </div>
            </div>
          </div>
        )}

        {/* Récapitulatif */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-4">
          <h3 className="font-semibold text-gray-900 mb-3">Récapitulatif</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Sous-total</span>
              <span>{totalXOF}f</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Frais de livraison</span>
              <span>{deliveryFee}f</span>
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span className="text-orange-600">{finalTotalXOF}f</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bouton de commande modifié */}
        <div className="bg-white rounded-2xl shadow-sm p-4 sticky bottom-4">
          <button
            onClick={handleCheckout}
            className="w-full bg-orange-500 text-white text-center py-3 px-4 rounded-lg hover:bg-orange-600 mb-3 font-semibold"
          >
            {isAuthenticated ? 'Commander maintenant' : 'Continuer sans compte'}
          </button>

          {!isAuthenticated && (
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Vous avez un compte ?</p>
              <Link
                to="/login"
                className="text-orange-500 font-medium text-sm"
              >
                Se connecter pour une expérience optimale
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Cart