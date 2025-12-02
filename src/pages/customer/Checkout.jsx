import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { clearCart } from '../../store/slices/cartSlice.jsx'
import axios from 'axios'

// ✅ CONFIGURATION API CORRECTE
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const Checkout = () => {
  const { items, total, restaurant } = useSelector(state => state.cart)
  const { user } = useSelector(state => state.auth)
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [deliveryTime, setDeliveryTime] = useState('asap')
  const [specialInstructions, setSpecialInstructions] = useState('')
  const [phoneNumber, setPhoneNumber] = useState(user?.phone || '')
  const [isProcessing, setIsProcessing] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Taux de conversion (approximatif)
  const EUR_TO_XOF = 1
  const totalXOF = Math.round(total * EUR_TO_XOF)

 const handlePayment = async () => {
  if (!deliveryAddress.trim()) {
    alert('❌ Veuillez indiquer votre adresse de livraison');
    return;
  }

  if (!phoneNumber.trim()) {
    alert('❌ Veuillez indiquer votre numéro de téléphone');
    return;
  }

  setIsProcessing(true);

  try {
    const token = localStorage.getItem('token');
    console.log('🔑 Token présent:', !!token);
    
    if (!token) {
      alert('🔐 Session expirée. Veuillez vous reconnecter.');
      navigate('/login');
      return;
    }

    // Vérifier les données du panier
    console.log('🛒 Items dans le panier:', items);
    console.log('🏪 Restaurant data:', restaurant);
    
    if (items.length === 0) {
      alert('🛒 Votre panier est vide');
      return;
    }

    // Préparer les données pour l'API
    const orderData = {
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        selectedOptions: item.selectedOptions || {},
        menuItemId: item.menuItemId || item.id
      })),
      deliveryInfo: {
        address: deliveryAddress.trim(),
        phone: phoneNumber.trim(),
        deliveryTime: deliveryTime,
        specialInstructions: specialInstructions.trim()
      },
      paymentMethod: paymentMethod,
      totals: {
        subtotal: totalXOF,
        deliveryFee: deliveryFee,
        total: finalTotalXOF
      }
    };

    // 🔥 CORRECTION : Ne pas envoyer restaurant.id s'il n'est pas un ObjectId valide
    // OU envoyer seulement le nom et l'adresse sans l'ID
    if (restaurant) {
      orderData.restaurant = {
        // ❌ NE PAS envoyer l'ID s'il n'est pas un ObjectId MongoDB valide
        // restaurantId: restaurant.id, // ← COMMENTEZ CETTE LIGNE
        name: restaurant.name,
        address: restaurant.address
      };
      console.log('🏪 Données restaurant envoyées (sans ID):', orderData.restaurant);
    }

    console.log('📤 Données FINALES envoyées:', JSON.stringify(orderData, null, 2));

    // Appel à l'API
    const response = await API.post('/orders', orderData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('✅ Réponse API réussie:', response.data);

    // Vider le panier
    dispatch(clearCart());

    // Redirection
    navigate(`/order-confirmation/${response.data.order._id}`);

  } catch (error) {
    console.error('❌ Erreur complète:', error);
    
    if (error.response) {
      const { status, data } = error.response;
      console.error(`❌ Erreur ${status}:`, data);
      
      if (data.errors) {
        const errorDetails = Object.entries(data.errors)
          .map(([field, message]) => `${field}: ${message}`)
          .join('\n');
        alert(`❌ Erreurs de validation:\n${errorDetails}`);
      } else if (data.message) {
        alert(`❌ ${data.message}`);
      }
    } else {
      alert('❌ Erreur de connexion au serveur');
    }
  } finally {
    setIsProcessing(false);
  }
};

  const deliveryFee = 500 // XOF
  const finalTotalXOF = totalXOF + deliveryFee

  // Heures de livraison disponibles
  const deliveryTimes = [
    { value: 'asap', label: '🌱 Livraison express (30-45 min)' },
    { value: '13:00', label: '🕐 13h00 - 14h00' },
    { value: '14:00', label: '🕑 14h00 - 15h00' },
    { value: '15:00', label: '🕒 15h00 - 16h00' },
    { value: '19:00', label: '🕖 19h00 - 20h00' },
    { value: '20:00', label: '🕗 20h00 - 21h00' }
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Finaliser la commande</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Colonne gauche - Informations */}
        <div className="space-y-6">
          {/* Récapitulatif de la commande */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Récapitulatif</h2>
            
            {restaurant && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold">{restaurant.name}</h3>
              </div>
            )}

            <div className="space-y-3 mb-4">
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-center border-b pb-3">
                  <div>
                    <span className="font-medium">{item.quantity}x {item.name}</span>
                    {Object.values(item.selectedOptions).length > 0 && (
                      <p className="text-sm text-gray-600">
                        {Object.values(item.selectedOptions).join(', ')}
                      </p>
                    )}
                  </div>
                  <span className="font-semibold">{(item.price * item.quantity * EUR_TO_XOF).toLocaleString()} FCFA</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Sous-total</span>
                <span>{totalXOF.toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between">
                <span>Frais de livraison</span>
                <span>{deliveryFee.toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total</span>
                <span className="text-orange-600">{finalTotalXOF.toLocaleString()} FCFA</span>
              </div>
            </div>
          </div>

          {/* Informations de livraison */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Informations de livraison</h2>
            
            <div className="space-y-4">
              {/* Numéro de téléphone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📞 Numéro de téléphone *
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  placeholder="+229 90 00 00 00"
                  required
                />
              </div>

              {/* Adresse de livraison */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🏠 Adresse de livraison précise *
                </label>
                <textarea
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Ex: Rue 123, Immeuble Jaune, 2ème étage, porte gauche, Cotonou"
                  rows="3"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Indiquez le quartier, la rue, le numéro, les repères, l'étage, etc.
                </p>
              </div>

              {/* Heure de livraison */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🕐 Heure de livraison souhaitée
                </label>
                <select
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                >
                  {deliveryTimes.map(time => (
                    <option key={time.value} value={time.value}>
                      {time.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Instructions spéciales */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📝 Instructions spéciales (allergies, préférences)
                </label>
                <textarea
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Ex: Sans gluten, pas trop épicé, allergique aux arachides..."
                  rows="3"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Colonne droite - Paiement */}
        <div className="space-y-6">
          {/* Méthode de paiement */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Méthode de paiement</h2>
            
            <div className="space-y-4">
              {/* Paiement à la livraison */}
              <label className="flex items-center space-x-3 p-4 border-2 border-orange-300 rounded-lg cursor-pointer hover:bg-orange-50 bg-orange-50">
                <input
                  type="radio"
                  name="payment"
                  value="cash"
                  checked={paymentMethod === 'cash'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-orange-500"
                />
                <div>
                  <span className="font-semibold">💰 Paiement à la livraison</span>
                  <p className="text-sm text-gray-600">Payez en espèces à la réception</p>
                </div>
              </label>

              {/* Mobile Money */}
              <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment"
                  value="momo"
                  checked={paymentMethod === 'momo'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-orange-500"
                />
                <div>
                  <span className="font-semibold">📱 Mobile Money (MoMo)</span>
                  <p className="text-sm text-gray-600">Paiement sécurisé via MTN MoMo</p>
                </div>
              </label>

              {/* Flooz */}
              <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment"
                  value="flooz"
                  checked={paymentMethod === 'flooz'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-orange-500"
                />
                <div>
                  <span className="font-semibold">💳 Flooz</span>
                  <p className="text-sm text-gray-600">Paiement via compte Flooz</p>
                </div>
              </label>

              {/* Carte bancaire */}
              <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-orange-500"
                />
                <div>
                  <span className="font-semibold">💳 Carte bancaire</span>
                  <p className="text-sm text-gray-600">Visa, Mastercard</p>
                </div>
              </label>
            </div>
          </div>

          {/* Bouton de confirmation */}
          <button
            onClick={handlePayment}
            disabled={isProcessing || items.length === 0 || !deliveryAddress.trim() || !phoneNumber.trim()}
            className="w-full bg-orange-500 text-white py-4 px-6 rounded-lg hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-lg font-semibold"
          >
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                Traitement en cours...
              </div>
            ) : (
              `Confirmer la commande - ${finalTotalXOF.toLocaleString()} FCFA`
            )}
          </button>

          <div className="text-center text-sm text-gray-500">
            <p>🔒 Paiement sécurisé - Livraison au Bénin</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout