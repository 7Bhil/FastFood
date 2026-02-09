import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchRestaurants } from '../../services/restaurantService.jsx'

const Home = () => {
  const [restaurants, setRestaurants] = useState([])
  const [filteredRestaurants, setFilteredRestaurants] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRestaurants()
  }, [])

  useEffect(() => {
    filterRestaurants()
  }, [searchTerm, selectedCategory, restaurants])

  const loadRestaurants = async () => {
    try {
      const restaurantsData = await fetchRestaurants()
      setRestaurants(restaurantsData)
      setFilteredRestaurants(restaurantsData)
    } catch (error) {
      console.error('Erreur chargement restaurants:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterRestaurants = () => {
    let filtered = restaurants

    if (searchTerm) {
      filtered = filtered.filter(restaurant =>
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(restaurant => 
        restaurant.category === selectedCategory
      )
    }

    setFilteredRestaurants(filtered)
  }

  const categories = [
    { id: 'all', name: 'Tout', emoji: '🍽️', gradient: 'from-slate-600 to-slate-700' },
    { id: 'pates_tubercules', name: 'Pâtes & Tubercules', emoji: '🍠', gradient: 'from-amber-500 to-orange-600' },
    { id: 'cereales_haricots', name: 'Céréales', emoji: '🌾', gradient: 'from-yellow-500 to-amber-600' },
    { id: 'grillades_fritures', name: 'Grillades', emoji: '🍗', gradient: 'from-red-500 to-rose-600' },
    { id: 'sauces_locales', name: 'Sauces', emoji: '🥘', gradient: 'from-emerald-500 to-teal-600' },
    { id: 'pdj_boissons', name: 'Petit-déj', emoji: '☕', gradient: 'from-blue-500 to-indigo-600' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="w-20 h-20 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="mt-8 text-lg text-gray-600 font-medium">Chargement des restaurants...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50">
      {/* Hero Section - Ultra Modern */}
      <div className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600 via-red-600 to-pink-600">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
            <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
          </div>
        </div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-white mb-8 animate-fadeInUp">
              <span className="text-2xl mr-2">🇧🇯</span>
              <span className="font-semibold">Cuisine Authentique Béninoise</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 animate-fadeInUp leading-tight" style={{ animationDelay: '0.1s' }}>
              Savourez le Bénin
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                à Domicile
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto animate-fadeInUp leading-relaxed" style={{ animationDelay: '0.2s' }}>
              Découvrez les saveurs authentiques du Bénin livrées directement chez vous
            </p>

            {/* Search Bar - Ultra Modern */}
            <div className="max-w-2xl mx-auto animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
                <div className="relative flex items-center bg-white rounded-2xl shadow-2xl overflow-hidden">
                  <div className="pl-6 pr-4">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Rechercher un restaurant ou un plat..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 py-5 text-lg text-gray-900 placeholder-gray-400 focus:outline-none"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="px-4 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                  <button className="m-2 px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-300 shadow-lg">
                    Rechercher
                  </button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-8 max-w-3xl mx-auto animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
              <div className="text-center">
                <div className="text-4xl font-black text-white mb-2">{restaurants.length}+</div>
                <div className="text-white/80 font-medium">Restaurants</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-white mb-2">50+</div>
                <div className="text-white/80 font-medium">Plats</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-white mb-2">4.8⭐</div>
                <div className="text-white/80 font-medium">Note Moyenne</div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z" fill="white"/>
          </svg>
        </div>
      </div>

      {/* Categories - Modern Pills */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center space-x-3 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map((category, index) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex-shrink-0 group relative px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 animate-slideInRight ${
                selectedCategory === category.id
                  ? 'text-white shadow-xl'
                  : 'bg-white text-gray-700 hover:shadow-lg'
              }`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {selectedCategory === category.id && (
                <div className={`absolute inset-0 bg-gradient-to-r ${category.gradient} rounded-2xl`}></div>
              )}
              <span className="relative flex items-center">
                <span className="text-2xl mr-2">{category.emoji}</span>
                <span>{category.name}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Search Results Info */}
      {searchTerm && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-6 border-2 border-orange-200">
            <p className="text-orange-900 font-semibold text-lg flex items-center">
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="font-black text-2xl mr-2">{filteredRestaurants.length}</span>
              restaurant{filteredRestaurants.length > 1 ? 's' : ''} trouvé{filteredRestaurants.length > 1 ? 's' : ''} pour "{searchTerm}"
            </p>
          </div>
        </div>
      )}

      {/* Restaurants Grid - Ultra Modern Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredRestaurants.map((restaurant, index) => (
            <Link
              key={restaurant.id}
              to={`/restaurant/${restaurant.id}`}
              className="group block animate-fadeInUp"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Rating Badge */}
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg">
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-500 text-lg">⭐</span>
                      <span className="font-black text-gray-900">{restaurant.rating}</span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="absolute top-4 left-4">
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                      restaurant.isOpen 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-500 text-white'
                    }`}>
                      {restaurant.isOpen ? '🟢 Ouvert' : '🔴 Fermé'}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-black text-gray-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-1">
                    {restaurant.name}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4 leading-relaxed">
                    {restaurant.description}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-sm mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center text-gray-500">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {restaurant.deliveryTime}
                      </span>
                      <span className="flex items-center font-bold text-orange-600">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        {restaurant.deliveryFee}f
                      </span>
                    </div>
                  </div>

                  {/* Category Badge */}
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${
                      categories.find(cat => cat.id === restaurant.category)?.gradient || 'from-gray-500 to-gray-600'
                    } text-white`}>
                      <span className="mr-1">{categories.find(cat => cat.id === restaurant.category)?.emoji || '🍽️'}</span>
                      {categories.find(cat => cat.id === restaurant.category)?.name || restaurant.category}
                    </span>
                  </div>
                </div>

                {/* Hover Button */}
                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                  <button className="w-full py-3 bg-white text-orange-600 font-black rounded-xl hover:bg-orange-50 transition-colors">
                    Voir le menu →
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredRestaurants.length === 0 && (
          <div className="text-center py-20 animate-fadeInUp">
            <div className="text-8xl mb-6">🔍</div>
            <h3 className="text-3xl font-black text-gray-900 mb-4">Aucun restaurant trouvé</h3>
            <p className="text-xl text-gray-600 mb-8">Essayez d'autres termes de recherche ou une autre catégorie</p>
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('all')
              }}
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-300 shadow-xl"
            >
              Voir tous les restaurants
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
