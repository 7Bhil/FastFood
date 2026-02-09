// Service pour les fonctionnalités mobiles natives
import { Camera, CameraResultType } from '@capacitor/camera'
import { Geolocation, Position } from '@capacitor/geolocation'
import { PushNotifications } from '@capacitor/push-notifications'
import { Preferences } from '@capacitor/preferences'

class MobileService {
  // 📸 Gestion de la caméra
  static async takePicture() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri
      })
      return image.webPath
    } catch (error) {
      console.error('Erreur caméra:', error)
      return null
    }
  }

  // 📍 Géolocalisation
  static async getCurrentPosition() {
    try {
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000
      })
      return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy
      }
    } catch (error) {
      console.error('Erreur géolocalisation:', error)
      return null
    }
  }

  // 🔔 Notifications Push
  static async requestPushNotifications() {
    try {
      const result = await PushNotifications.requestPermissions()
      if (result.receive === 'granted') {
        await PushNotifications.register()
        return true
      }
      return false
    } catch (error) {
      console.error('Erreur notifications:', error)
      return false
    }
  }

  static async addNotificationListeners() {
    await PushNotifications.addListener('registration', (token) => {
      console.log('Token push:', token.value)
      // Envoyer ce token à votre backend
    })

    await PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('Notification reçue:', notification)
    })
  }

  // 💾 Stockage local
  static async setStorage(key, value) {
    try {
      await Preferences.set({
        key,
        value: JSON.stringify(value)
      })
    } catch (error) {
      console.error('Erreur stockage:', error)
    }
  }

  static async getStorage(key) {
    try {
      const { value } = await Preferences.get({ key })
      return value ? JSON.parse(value) : null
    } catch (error) {
      console.error('Erreur lecture stockage:', error)
      return null
    }
  }

  static async removeStorage(key) {
    try {
      await Preferences.remove({ key })
    } catch (error) {
      console.error('Erreur suppression stockage:', error)
    }
  }

  // 📱 Vérifier si on est sur mobile
  static isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  }

  // 🌐 Vérifier la connexion internet
  static async checkConnection() {
    try {
      if (!navigator.onLine) {
        return false
      }
      
      // Test simple de connexion
      const response = await fetch('https://api.github.com', { 
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-cache'
      })
      return true
    } catch (error) {
      return false
    }
  }

  // 📞 Appeler un numéro (mobile uniquement)
  static async makePhoneCall(phoneNumber) {
    if (this.isMobile()) {
      window.location.href = `tel:${phoneNumber}`
      return true
    }
    return false
  }

  // 📧 Ouvrir client email
  static openEmailClient(email, subject = '', body = '') {
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.open(mailtoUrl, '_blank')
  }

  // 🗺️ Ouvrir application de navigation
  static openMaps(address) {
    const encodedAddress = encodeURIComponent(address)
    if (this.isMobile()) {
      // Essayer Google Maps d'abord
      window.open(`https://maps.google.com/?q=${encodedAddress}`, '_blank')
    } else {
      // Ouvrir dans une nouvelle fenêtre
      window.open(`https://maps.google.com/?q=${encodedAddress}`, '_blank')
    }
  }

  // 📱 Partager contenu
  static async shareContent(title, text, url) {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url
        })
        return true
      } catch (error) {
        console.error('Erreur partage:', error)
        return false
      }
    }
    return false
  }

  // 📊 Analytiques mobiles
  static trackEvent(eventName, properties = {}) {
    // Intégrer avec Firebase Analytics ou autre service
    console.log('Event tracked:', eventName, properties)
  }

  // 🔐 Authentification biométrique (optionnel)
  static async authenticateBiometric() {
    try {
      // Nécessite @capacitor/local-authentication
      // const { LocalAuthentication } = await import('@capacitor/local-authentication')
      // const result = await LocalAuthentication.authenticate({
      //   reason: 'Veuillez vous authentifier pour accéder à SellExpress'
      // })
      // return result
      return true // Placeholder
    } catch (error) {
      console.error('Erreur authentification biométrique:', error)
      return false
    }
  }
}

export default MobileService
