import React, { useState, useEffect } from 'react'
import MobileService from '../../services/mobileService.js'

const MobileFeatures = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false)
  const [location, setLocation] = useState(null)
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    const checkMobile = () => {
      const mobile = MobileService.isMobile()
      setIsMobile(mobile)
      
      if (mobile) {
        // Initialiser les fonctionnalités mobiles
        initializeMobileFeatures()
      }
    }

    checkMobile()
    
    // Écouter les changements de connexion
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const initializeMobileFeatures = async () => {
    // Demander les permissions de géolocalisation
    try {
      const position = await MobileService.getCurrentPosition()
      setLocation(position)
    } catch (error) {
      console.log('Géolocalisation non disponible')
    }

    // Demander les permissions de notifications
    await MobileService.requestPushNotifications()
    await MobileService.addNotificationListeners()
  }

  const handleTakePicture = async () => {
    const photo = await MobileService.takePicture()
    if (photo) {
      console.log('Photo prise:', photo)
      // Utiliser la photo pour le profil ou les plats
    }
  }

  const handleShare = async () => {
    const success = await MobileService.shareContent(
      'SellExpress - Livraison de nourriture',
      'Découvrez les meilleurs restaurants près de chez vous!',
      window.location.origin
    )
    if (success) {
      console.log('Contenu partagé avec succès')
    }
  }

  return (
    <div className="mobile-features">
      {/* Indicateur de connexion */}
      {!isOnline && (
        <div className="fixed top-14 left-0 right-0 bg-red-500 text-white text-center py-2 z-50">
          📵 Hors connexion - Vérifiez votre internet
        </div>
      )}

      {/* Boutons flottants pour mobile */}
      {isMobile && (
        <div className="fixed bottom-20 right-4 z-40 space-y-2">
          {/* Bouton de localisation */}
          {location && (
            <button
              onClick={() => MobileService.openMaps(`${location.latitude},${location.longitude}`)}
              className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600"
              title="Ma position"
            >
              📍
            </button>
          )}

          {/* Bouton photo (pour les restaurants) */}
          <button
            onClick={handleTakePicture}
            className="bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600"
            title="Prendre une photo"
          >
            📸
          </button>

          {/* Bouton partage */}
          <button
            onClick={handleShare}
            className="bg-purple-500 text-white p-3 rounded-full shadow-lg hover:bg-purple-600"
            title="Partager l'app"
            >
              📤
            </button>
        </div>
      )}

      {/* Contenu principal */}
      {children}

      {/* Overlay d'initialisation mobile */}
      {isMobile && !location && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold mb-4">📱 Configuration Mobile</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <span>📍</span>
                <span>Géolocalisation pour trouver les restaurants proches</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>🔔</span>
                <span>Notifications pour suivre vos commandes</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>📸</span>
                <span>Caméra pour les photos de profil et plats</span>
              </div>
            </div>
            <button
              onClick={() => setLocation({ latitude: 0, longitude: 0 })}
              className="w-full bg-orange-500 text-white py-2 rounded-lg mt-4 hover:bg-orange-600"
            >
              Continuer
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default MobileFeatures
