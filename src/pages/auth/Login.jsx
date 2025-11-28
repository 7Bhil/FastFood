import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { loginSuccess } from '../../store/slices/authSlice.jsx'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'L\'email n\'est pas valide'
    }

    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Dans la fonction handleSubmit, remplacez la détection du rôle par :
const handleSubmit = async (e) => {
  e.preventDefault()
  
  if (!validateForm()) {
    return
  }

  setLoading(true)

  try {
    // Simulation de connexion
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Détection du rôle basé sur l'email (version corrigée)
    let role = 'customer'
    const email = formData.email.toLowerCase()
    
    if (email.includes('restaurant') || email.includes('resto')) {
      role = 'restaurant'
    } else if (email.includes('livreur') || email.includes('delivery')) {
      role = 'delivery'
    } else if (email.includes('admin')) {
      role = 'admin'
    }

    // Pour la démo, créer un utilisateur mock avec les bonnes données
    const mockUser = {
      id: 'user-' + Date.now(),
      name: formData.email.split('@')[0],
      email: formData.email,
      role: role,
      phone: '+229 01 00 00 00 00'
    }

    // Ajouter les données spécifiques au rôle
    if (role === 'restaurant') {
      mockUser.restaurantName = "Mon Restaurant"
      mockUser.restaurantAddress = "123 Rue du Commerce, Cotonou"
      mockUser.restaurantId = 'resto-' + Date.now()
    }

    if (role === 'delivery') {
      mockUser.vehicleType = 'scooter'
      mockUser.status = 'available'
    }

    // Connecter l'utilisateur avec les données complètes
    dispatch(loginSuccess({ role: role, user: mockUser }))

    // Redirection selon le rôle
    switch(role) {
      case 'customer':
        navigate('/')
        break
      case 'restaurant':
        navigate('/restaurant/dashboard')
        break
      case 'delivery':
        navigate('/delivery/dashboard')
        break
      case 'admin':
        navigate('/admin/dashboard')
        break
      default:
        navigate('/')
    }

  } catch (error) {
    console.error('Erreur lors de la connexion:', error)
    setErrors({ submit: 'Email ou mot de passe incorrect' })
  } finally {
    setLoading(false)
  }
}

  // Comptes de démonstration pour tester
  const demoAccounts = [
    { email: 'client@demo.com', password: 'demo123', role: 'Client' },
    { email: 'restaurant@demo.com', password: 'demo123', role: 'Restaurateur' },
    { email: 'livreur@demo.com', password: 'demo123', role: 'Livreur' },
    { email: 'admin@demo.com', password: 'demo123', role: 'Administrateur' }
  ]

  const fillDemoAccount = (account) => {
    setFormData({
      email: account.email,
      password: account.password
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Connexion
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Accédez à votre compte
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
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
                placeholder="Votre mot de passe"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
          </div>

          {/* Options supplémentaires */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Se souvenir de moi
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-orange-600 hover:text-orange-500">
                Mot de passe oublié ?
              </a>
            </div>
          </div>

          {/* Erreur générale */}
          {errors.submit && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{errors.submit}</p>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-orange-400 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Connexion en cours...
                </div>
              ) : (
                'Se connecter'
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Pas encore de compte ?{' '}
              <Link to="/register" className="font-medium text-orange-600 hover:text-orange-500">
                S'inscrire
              </Link>
            </p>
          </div>
        </form>

        {/* Comptes de démonstration */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">Comptes de démonstration</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-2">
            {demoAccounts.map((account, index) => (
              <button
                key={index}
                onClick={() => fillDemoAccount(account)}
                className="w-full text-left p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <div className="text-sm font-medium text-gray-900">{account.role}</div>
                <div className="text-xs text-gray-600">
                  Email: {account.email} | Mot de passe: {account.password}
                </div>
              </button>
            ))}
          </div>

          <p className="mt-3 text-xs text-center text-gray-500">
            Cliquez sur un compte pour remplir automatiquement le formulaire
          </p>
        </div>

        {/* Informations de sécurité */}
        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <h3 className="text-sm font-medium text-green-800 mb-2">
            💡 Pour la démonstration
          </h3>
          <ul className="text-xs text-green-700 space-y-1">
            <li>• Utilisez n'importe quel email/mot de passe valides</li>
            <li>• Le rôle est détecté automatiquement selon l'email</li>
            <li>• Ou utilisez les comptes de démo ci-dessus</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Login