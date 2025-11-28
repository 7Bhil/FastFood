import React, { useState, useEffect } from 'react'

const Dashboard = () => {
  const [availableDeliveries, setAvailableDeliveries] = useState([
    {
      id: 'DEL-001',
      restaurant: 'Pizza Italia',
      customer: 'Jean Dupont',
      address: '3e von a droite apres le campus, Etage carolée',
      amount: 2500,
      distance: '1.2km',
      estimatedTime: '15 min'
    },
    {
      id: 'DEL-002', 
      restaurant: 'Burger House',
      customer: 'Marie Martin',
      address: '456 Avenue Etoiles rouges',
      amount: 1850,
      distance: '0.8km',
      estimatedTime: '10 min'
    }
  ])

  const [currentDelivery, setCurrentDelivery] = useState(null)
  const [deliveryStatus, setDeliveryStatus] = useState('available')

  const acceptDelivery = (deliveryId) => {
    const delivery = availableDeliveries.find(d => d.id === deliveryId)
    setCurrentDelivery(delivery)
    setDeliveryStatus('accepted')
    setAvailableDeliveries(prev => prev.filter(d => d.id !== deliveryId))
  }

  const updateDeliveryStatus = (status) => {
    setDeliveryStatus(status)
    if (status === 'delivered') {
      setTimeout(() => {
        setCurrentDelivery(null)
        setDeliveryStatus('available')
      }, 3000)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Livreur</h1>

      {deliveryStatus === 'available' && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Livraisons disponibles</h2>
          <div className="space-y-4">
            {availableDeliveries.map(delivery => (
              <div key={delivery.id} className="bg-white p-6 rounded-lg shadow-md border">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{delivery.restaurant}</h3>
                    <p className="text-gray-600">Pour {delivery.customer}</p>
                    <p className="text-sm text-gray-500">{delivery.address}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-orange-600">{delivery.amount}f</p>
                    <p className="text-sm text-gray-500">{delivery.distance} • {delivery.estimatedTime}</p>
                  </div>
                </div>
                <button
                  onClick={() => acceptDelivery(delivery.id)}
                  className="w-full bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600"
                >
                  Accepter la livraison
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {currentDelivery && (
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Livraison en cours</h2>
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">Restaurant:</span>
              <span>{currentDelivery.restaurant}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">Client:</span>
              <span>{currentDelivery.customer}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">Adresse:</span>
              <span className="text-right">{currentDelivery.address}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">Montant:</span>
              <span className="text-orange-600 font-bold">{currentDelivery.amount}f</span>
            </div>
          </div>

          {/* Barre de progression */}
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className={`text-sm ${deliveryStatus === 'accepted' ? 'font-bold text-orange-600' : 'text-gray-500'}`}>
                Acceptée
              </span>
              <span className={`text-sm ${deliveryStatus === 'picked_up' ? 'font-bold text-orange-600' : 'text-gray-500'}`}>
                Récupérée
              </span>
              <span className={`text-sm ${deliveryStatus === 'in_transit' ? 'font-bold text-orange-600' : 'text-gray-500'}`}>
                En route
              </span>
              <span className={`text-sm ${deliveryStatus === 'delivered' ? 'font-bold text-green-600' : 'text-gray-500'}`}>
                Livrée
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: deliveryStatus === 'accepted' ? '25%' :
                         deliveryStatus === 'picked_up' ? '50%' :
                         deliveryStatus === 'in_transit' ? '75%' : '100%'
                }}
              ></div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="space-y-2">
            {deliveryStatus === 'accepted' && (
              <button
                onClick={() => updateDeliveryStatus('picked_up')}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
              >
                Marquer comme récupérée
              </button>
            )}
            {deliveryStatus === 'picked_up' && (
              <button
                onClick={() => updateDeliveryStatus('in_transit')}
                className="w-full bg-purple-500 text-white py-2 px-4 rounded-md hover:bg-purple-600"
              >
                Commencer la livraison
              </button>
            )}
            {deliveryStatus === 'in_transit' && (
              <button
                onClick={() => updateDeliveryStatus('delivered')}
                className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
              >
                Marquer comme livrée
              </button>
            )}
            {deliveryStatus === 'delivered' && (
              <div className="text-center py-4">
                <p className="text-green-600 font-semibold">✅ Livraison terminée !</p>
                <p className="text-gray-600">Retour au tableau de bord...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard