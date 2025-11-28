import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { loginSuccess } from '../../store/slices/authSlice.jsx'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'customer',
    restaurantName: '', // Nouveau champ pour restaurateur
    restaurantAddress: '', // Nouveau champ pour restaurateur
    vehicleType: '' // Nouveau champ pour livreur
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Effacer l'erreur du champ quand l'utilisateur tape
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'L\'email n\'est pas valide'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Le téléphone est requis'
    }

    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas'
    }

    // Validation spécifique pour restaurateur
    if (formData.role === 'restaurant') {
      if (!formData.restaurantName.trim()) {
        newErrors.restaurantName = 'Le nom du restaurant est requis'
      }
      if (!formData.restaurantAddress.trim()) {
        newErrors.restaurantAddress = 'L\'adresse du restaurant est requise'
      }
    }

    // Validation spécifique pour livreur
    if (formData.role === 'delivery' && !formData.vehicleType) {
      newErrors.vehicleType = 'Le type de véhicule est requis'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      // Simulation d'inscription
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Créer l'utilisateur mock selon le rôle
      const mockUser = {
        id: 'user-' + Date.now(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        createdAt: new Date().toISOString()
      }

      // Ajouter les données spécifiques au rôle
      if (formData.role === 'restaurant') {
        mockUser.restaurantName = formData.restaurantName
        mockUser.restaurantAddress = formData.restaurantAddress
        mockUser.restaurantId = 'resto-' + Date.now()
      }

      if (formData.role === 'delivery') {
        mockUser.vehicleType = formData.vehicleType
        mockUser.status = 'available'
      }

      // Connecter l'utilisateur directement
      dispatch(loginSuccess({ role: formData.role, user: mockUser }))

      // Redirection selon le rôle
      switch(formData.role) {
        case 'customer':
          navigate('/')
          break
        case 'restaurant':
          navigate('/restaurant/dashboard')
          break
        case 'delivery':
          navigate('/delivery/dashboard')
          break
        default:
          navigate('/')
      }

    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error)
      setErrors({ submit: 'Une erreur est survenue lors de l\'inscription' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Créer un compte
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Rejoignez notre plateforme de livraison
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Nom */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nom complet *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Votre nom complet"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Adresse email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="votre@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Téléphone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Numéro de téléphone *
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="+229 90 00 00 00"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            {/* Rôle */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Je suis un *
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="customer">Client</option>
                <option value="restaurant">Restaurateur</option>
                <option value="delivery">Livreur</option>
              </select>
            </div>

            {/* Champs spécifiques pour RESTAURATEUR */}
            {formData.role === 'restaurant' && (
              <>
                <div>
                  <label htmlFor="restaurantName" className="block text-sm font-medium text-gray-700">
                    Nom du restaurant *
                  </label>
                  <input
                    id="restaurantName"
                    name="restaurantName"
                    type="text"
                    value={formData.restaurantName}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 ${
                      errors.restaurantName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Nom de votre restaurant"
                  />
                  {errors.restaurantName && (
                    <p className="mt-1 text-sm text-red-600">{errors.restaurantName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="restaurantAddress" className="block text-sm font-medium text-gray-700">
                    Adresse du restaurant *
                  </label>
                  <input
                    id="restaurantAddress"
                    name="restaurantAddress"
                    type="text"
                    value={formData.restaurantAddress}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 ${
                      errors.restaurantAddress ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Adresse complète de votre restaurant"
                  />
                  {errors.restaurantAddress && (
                    <p className="mt-1 text-sm text-red-600">{errors.restaurantAddress}</p>
                  )}
                </div>
              </>
            )}

            {/* Champs spécifiques pour LIVREUR */}
            {formData.role === 'delivery' && (
              <div>
                <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700">
                  Type de véhicule *
                </label>
                <select
                  id="vehicleType"
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 ${
                    errors.vehicleType ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Sélectionnez votre véhicule</option>
                  <option value="scooter">Scooter/Moto</option>
                  <option value="bicycle">Vélo</option>
                  <option value="car">Voiture</option>
                  <option value="electric_bike">Vélo électrique</option>
                </select>
                {errors.vehicleType && (
                  <p className="mt-1 text-sm text-red-600">{errors.vehicleType}</p>
                )}
              </div>
            )}

            {/* Mot de passe */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Minimum 6 caractères"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Confirmation mot de passe */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirmer le mot de passe *
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Retapez votre mot de passe"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          {/* Erreur générale */}
          {errors.submit && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{errors.submit}</p>
            </div>
          )}

          {/* Conditions */}
          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
              J'accepte les{' '}
              <a href="#" className="text-orange-600 hover:text-orange-500">
                conditions d'utilisation
              </a>{' '}
              et la{' '}
              <a href="#" className="text-orange-600 hover:text-orange-500">
                politique de confidentialité
              </a>
            </label>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-orange-400 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Inscription en cours...
                </div>
              ) : (
                `Créer mon compte ${formData.role === 'customer' ? 'client' : formData.role}`
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Déjà un compte ?{' '}
              <Link to="/login" className="font-medium text-orange-600 hover:text-orange-500">
                Se connecter
              </Link>
            </p>
          </div>
        </form>

        {/* Informations selon le rôle */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800 mb-2">
            Informations selon votre profil :
          </h3>
          <ul className="text-xs text-blue-700 space-y-1">
            {formData.role === 'customer' && (
              <>
                <li>• Commandez vos plats préférés en quelques clics</li>
                <li>• Suivez vos livraisons en temps réel</li>
                <li>• Payez en ligne ou à la livraison</li>
              </>
            )}
            {formData.role === 'restaurant' && (
              <>
                <li>• Gérez votre menu et vos commandes</li>
                <li>• Augmentez votre visibilité</li>
                <li>• Recevez des commandes 24h/24</li>
              </>
            )}
            {formData.role === 'delivery' && (
              <>
                <li>• Recevez des missions de livraison</li>
                <li>• Gagnez de l'argent en toute flexibilité</li>
                <li>• Travaillez selon vos disponibilités</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Register