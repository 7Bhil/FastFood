import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { addToCart } from '../../store/slices/cartSlice.jsx'
import Card from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import { getRestaurantById } from '../../services/restaurantService.jsx'

const Restaurant = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { items } = useSelector(state => state.cart)
  const [restaurant, setRestaurant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [addedItems, setAddedItems] = useState(new Set())

  useEffect(() => {
    loadRestaurant()
  }, [id])

  const loadRestaurant = async () => {
    try {
      const restaurantData = await getRestaurantById(id)
      setRestaurant(restaurantData)
    } catch (error) {
      console.error('Erreur chargement restaurant:', error)
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (item) => {
    const cartItem = {
      ...item,
      quantity: 1,
      selectedOptions: {},
      restaurantId: id,
      restaurantName: restaurant?.name
    }
    dispatch(addToCart(cartItem))
    setAddedItems(prev => new Set([...prev, item.id]))
    
    // Animation feedback
    setTimeout(() => {
      setAddedItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(item.id)
        return newSet
      })
    }, 2000)
  }

  const filteredMenu = restaurant?.menu?.filter(item => {
    const matchesSearch = !searchTerm || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    
    return matchesSearch && matchesCategory
  }) || []

  const categories = [
    { id: 'all', name: 'Tous les plats', emoji: '🍽️', color: 'from-gray-500 to-gray-600' },
    { id: 'pates_tubercules', name: 'Pâtes & Tubercules', emoji: '🍠', color: 'from-yellow-500 to-orange-500' },
    { id: 'cereales_haricots', name: 'Céréales & Haricots', emoji: '🌾', color: 'from-amber-500 to-yellow-600' },
    { id: 'grillades_fritures', name: 'Grillades & Fritures', emoji: '🍗', color: 'from-red-500 to-orange-600' },
    { id: 'sauces_locales', name: 'Sauces Locales', emoji: '🥘', color: 'from-green-500 to-emerald-600' },
    { id: 'pdj_boissons', name: 'PDJ & Boissons', emoji: '☕', color: 'from-blue-500 to-indigo-600' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-orange-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="mt-6 text-gray-600 font-medium">Chargement du restaurant...</p>
        </div>
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-6">🍽️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Restaurant non trouvé</h2>
          <p className="text-gray-600 mb-6">Ce restaurant n'existe pas ou a été supprimé</p>
          <Button onClick={() => navigate('/')} variant="primary">
            Retour aux restaurants
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      {/* Restaurant Header */}
      <div className="relative">
        {/* Hero Image */}
        <div className="relative h-64 md:h-80 overflow-hidden">
          <img 
            src={restaurant.image} 
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm p-3 rounded-full shadow-lg hover:bg-white transition-all duration-200 z-10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Restaurant Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold mb-2 animate-fadeInUp">
                {restaurant.name}
              </h1>
              <p className="text-lg md:text-xl text-orange-100 mb-4 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                {restaurant.description}
              </p>
              
              <div className="flex flex-wrap items-center gap-4 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
                <div className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <span className="text-yellow-300 mr-2">⭐</span>
                  <span className="font-semibold">{restaurant.rating}</span>
                </div>
                <div className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <span className="text-orange-200 mr-2">🕐</span>
                  <span className="font-semibold">{restaurant.deliveryTime}</span>
                </div>
                <div className="flex items-center bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <span className="text-orange-200 mr-2">🚴</span>
                  <span className="font-semibold">{restaurant.deliveryFee}f</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-gray-400">🔍</span>
                </div>
                <input
                  type="text"
                  placeholder="Rechercher un plat..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex space-x-2 overflow-x-auto pb-2 md:pb-0">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex-shrink-0 px-4 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                    selectedCategory === category.id
                      ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                      : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md border border-gray-200'
                  }`}
                >
                  <span className="text-lg mr-2">{category.emoji}</span>
                  <span className="whitespace-nowrap">{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMenu.map((item, index) => (
            <div 
              key={item.id} 
              className="animate-fadeInUp"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Card hover={true} className="h-full">
                <div className="relative">
                  {/* Item Image */}
                  <div className="relative h-48 overflow-hidden rounded-t-2xl">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                    
                    {/* Badge */}
                    {item.isPopular && (
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                        🔥 Populaire
                      </div>
                    )}
                    
                    {item.isNew && (
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                        ✨ Nouveau
                      </div>
                    )}
                  </div>

                  {/* Item Info */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {item.name}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Price and Add Button */}
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-orange-600">
                        {Math.round(item.price * 655.95)}f
                      </div>
                      
                      <button
                        onClick={() => handleAddToCart(item)}
                        disabled={addedItems.has(item.id)}
                        className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                          addedItems.has(item.id)
                            ? 'bg-green-500 text-white cursor-not-allowed'
                            : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl'
                        }`}
                      >
                        {addedItems.has(item.id) ? (
                          <span className="flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Ajouté
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Ajouter
                          </span>
                        )}
                      </button>
                    </div>

                    {/* Category Badge */}
                    <div className="mt-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800">
                        {categories.find(cat => cat.id === item.category)?.emoji || '🍽️'}
                        <span className="ml-1">
                          {categories.find(cat => cat.id === item.category)?.name.replace(/^.[^ ]* /, '') || item.category}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredMenu.length === 0 && (
          <div className="text-center py-16 animate-fadeInUp">
            <div className="text-6xl mb-6">🍽️</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Aucun plat trouvé</h3>
            <p className="text-gray-600 mb-6">Essayez d'autres termes de recherche ou une autre catégorie</p>
            <Button 
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('all')
              }}
              variant="primary"
            >
              Voir tous les plats
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Restaurant
