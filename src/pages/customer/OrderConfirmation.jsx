import React from 'react'
import { useParams, Link } from 'react-router-dom'

const OrderConfirmation = () => {
  const { id } = useParams()

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Commande confirmée !</h1>
        <p className="text-gray-600 mb-2">Votre commande a été passée avec succès.</p>
        <p className="text-gray-600 mb-6">Numéro de commande: <strong>{id}</strong></p>

        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Détails de la commande</h2>
          <div className="text-left space-y-2">
            <div className="flex justify-between">
              <span>Statut:</span>
              <span className="text-green-600 font-semibold">Confirmée</span>
            </div>
            <div className="flex justify-between">
              <span>Temps estimé:</span>
              <span>25-35 minutes</span>
            </div>
            <div className="flex justify-between">
              <span>Mode de paiement:</span>
              <span>Carte bancaire</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Link
            to="/"
            className="block bg-orange-500 text-white py-3 px-6 rounded-md hover:bg-orange-600"
          >
            Commander à nouveau
          </Link>
          <Link
            to="/"
            className="block border border-gray-300 text-gray-700 py-3 px-6 rounded-md hover:bg-gray-50"
          >
            Retour à l'accueil
          </Link>
        </div>

        <p className="text-sm text-gray-500 mt-6">
          Vous recevrez une notification lorsque votre commande sera en cours de livraison.
        </p>
      </div>
    </div>
  )
}

export default OrderConfirmation