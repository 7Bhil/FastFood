import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { loginSuccess } from '../../store/slices/authSlice.jsx'
import axios from 'axios'

// Configuration Axios
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      console.log('📤 Tentative de connexion avec:', { email: formData.email })

      // Appel à l'API Express
      const response = await API.post('/users/login', {
        email: formData.email,
        password: formData.password
      })

      console.log('📥 Réponse de l\'API:', response.data)

      // Vérification de la structure de réponse
      if (!response.data || !response.data.user) {
        throw new Error('Structure de réponse invalide')
      }

      const { user, token } = response.data

      console.log('✅ Connexion réussie - Utilisateur:', user)
      console.log('✅ Token reçu:', token)

      // Stocker le token et les infos utilisateur
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))

      // Dispatch Redux avec les données réelles du backend
      dispatch(loginSuccess({ 
        role: user.role, 
        user: user,
        token: token
      }))

      // Redirection selon le rôle
      switch(user.role) {
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
      console.error('❌ Erreur de connexion:', error)

      // Gestion détaillée des erreurs
      if (error.response) {
        const { status, data } = error.response
        
        switch(status) {
          case 401:
            setErrors({ submit: 'Email ou mot de passe incorrect' })
            break
          case 404:
            setErrors({ submit: 'Aucun compte trouvé avec cet email' })
            break
          case 400:
            setErrors({ submit: data.message || 'Données de connexion invalides' })
            break
          case 500:
            setErrors({ submit: 'Erreur serveur. Veuillez réessayer plus tard.' })
            break
          default:
            setErrors({ submit: data.message || 'Erreur lors de la connexion' })
        }
      } else if (error.request) {
        setErrors({ submit: 'Impossible de contacter le serveur. Vérifiez votre connexion.' })
      } else {
        setErrors({ submit: 'Erreur: ' + error.message })
      }
    } finally {
      setLoading(false)
    }
  }

  // Comptes de test réels créés par le backend
  const demoAccounts = [
    { 
      email: 'admin@sellexpress.com', 
      password: 'Admin123!', 
      role: '👑 Admin',
      description: 'Accès administration complète'
    },
    { 
      email: 'restaurant@sellexpress.com', 
      password: 'Restaurant123!', 
      role: '🍽️ Restaurateur',
      description: 'Chez Maman - Dashboard restaurant'
    },
    { 
      email: 'livreur@sellexpress.com', 
      password: 'Livreur123!', 
      role: '🚴 Livreur',
      description: 'Espace livreur avec scooter'
    },
    { 
      email: 'client@sellexpress.com', 
      password: 'Client123!', 
      role: '👤 Client',
      description: 'Compte client standard'
    }
  ]

  const fillDemoAccount = (account) => {
    setFormData({
      email: account.email,
      password: account.password
    })
    // Effacer les erreurs précédentes
    setErrors({})
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

          {/* Messages */}
          {errors.submit && (
            <div className={`rounded-md p-4 ${
              errors.submit.includes('succès') || errors.submit.includes('créé') 
                ? 'bg-green-50' 
                : 'bg-red-50'
            }`}>
              <p className={`text-sm ${
                errors.submit.includes('succès') || errors.submit.includes('créé')
                  ? 'text-green-800'
                  : 'text-red-800'
              }`}>
                {errors.submit}
              </p>
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

        {/* Comptes de test */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">Comptes de test disponibles</span>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {demoAccounts.map((account, index) => (
              <button
                key={index}
                onClick={() => fillDemoAccount(account)}
                className="w-full text-left p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-orange-50 hover:to-orange-100 transition-all duration-300 border border-gray-200 hover:border-orange-300 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-sm font-bold text-gray-900 mb-1">{account.role}</div>
                    <div className="text-xs text-gray-600 mb-1">{account.description}</div>
                    <div className="text-xs font-mono text-gray-500">
                      {account.email}
                    </div>
                  </div>
                  <div className="text-2xl opacity-50 group-hover:opacity-100 transition-opacity">
                    →
                  </div>
                </div>
              </button>
            ))}
          </div>

          <p className="mt-4 text-xs text-center text-gray-500">
            💡 Cliquez sur un compte pour remplir automatiquement le formulaire
          </p>
        </div>

        {/* Informations */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-sm font-medium text-blue-800 mb-2 flex items-center">
            <span className="mr-2">ℹ️</span>
            Informations importantes
          </h3>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Les comptes de test sont créés automatiquement au démarrage</li>
            <li>• Authentification réelle avec JWT et bcrypt</li>
            <li>• Redirection automatique selon le rôle</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Login