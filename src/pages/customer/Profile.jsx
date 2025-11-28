import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

const Profile = () => {
  const { user } = useSelector(state => state.auth)
  const [isEditing, setIsEditing] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    restaurantName: '',
    restaurantAddress: '',
    vehicleType: ''
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        restaurantName: user.restaurantName || '',
        restaurantAddress: user.restaurantAddress || '',
        vehicleType: user.vehicleType || ''
      })
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Pour l'instant, juste simuler la mise à jour
    alert('Profil mis à jour! (Fonctionnalité en développement)')
    setIsEditing(false)
  }

  const getRoleLabel = (role) => {
    switch(role) {
      case 'customer': return '👤 Client'
      case 'restaurant': return '🏪 Restaurateur' 
      case 'delivery': return '🚗 Livreur'
      default: return '👤 Utilisateur'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-14 pb-16">
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mon Profil</h1>
              <p className="text-gray-600 mt-1">{getRoleLabel(user?.role)}</p>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-orange-600"
            >
              {isEditing ? 'Annuler' : 'Modifier'}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6">
          <div className="space-y-6">
            {/* Votre formulaire existant */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations personnelles</h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom complet
                  </label>
                  <input
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>

            {isEditing && (
              <button
                type="submit"
                className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 font-medium"
              >
                Enregistrer les modifications
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default Profile