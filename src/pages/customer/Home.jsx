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
    { id: 'all', name: '🥡 Tous', emoji: '🥡' },
    { id: 'pates_tubercules', name: '🍠 Pâtes & Tubercules', emoji: '🍠' },
    { id: 'cereales_haricots', name: '🌾 Céréales & Haricots', emoji: '🌾' },
    { id: 'grillades_fritures', name: '🍗 Grillades & Fritures', emoji: '🍗' },
    { id: 'sauces_locales', name: '🥘 Sauces Locales', emoji: '🥘' },
    { id: 'pdj_boissons', name: '☕ PDJ & Boissons', emoji: '☕' }
  ]

  if (loading) {
    return (
      <div className="p-4 top-14 pt-2"> {/* Réduit l'espace ici aussi */}
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="mobile-container">
      {/* Header avec recherche - espacement réduit */}
      <div className="px-4 pt-4 pb-3 bg-white sticky z-40 border-b"> {/* pt-2 → pt-1, pb-4 → pb-3 */}
        <div className="relative">
          <input
            type="text"
            placeholder="🔍 Rechercher un restaurant..."
            className="w-full bg-gray-100 rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              ✕
            </button>
          )}
        </div>
        
        {/* Catégories - espacement réduit */}
        <div className="flex space-x-2 mt-2 overflow-x-auto no-scrollbar pb-1"> {/* space-x-3 → space-x-2, mt-3 → mt-2 */}
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap flex-shrink-0 flex items-center space-x-1 ${
                selectedCategory === category.id
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              <span>{category.emoji}</span>
              <span>{category.name.replace(/^.[^ ]* /, '')}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Résultats de recherche - espacement réduit */}
      {searchTerm && (
        <div className="px-4 py-1 bg-orange-50"> {/* py-2 → py-1 */}
          <p className="text-sm text-orange-700">
            {filteredRestaurants.length} restaurant(s) trouvé(s) pour "{searchTerm}"
          </p>
        </div>
      )}

      {/* Restaurants - espacement réduit */}
      <div className="p-3 space-y-3"> {/* p-4 → p-3, space-y-4 → space-y-3 */}
        {filteredRestaurants.map(restaurant => (
          <Link 
            key={restaurant.id} 
            to={`/restaurant/${restaurant.id}`}
            className="block bg-white rounded-2xl shadow-sm border active:bg-gray-50"
          >
            <div className="flex">
              <img 
                src={restaurant.image} 
                alt={restaurant.name}
                className="w-20 h-20 object-cover rounded-l-2xl"
              />
              <div className="flex-1 p-3">
                <h3 className="font-semibold text-base">{restaurant.name}</h3> {/* text-lg → text-base */}
                <p className="text-gray-600 text-xs mt-1 line-clamp-2">{restaurant.description}</p> {/* text-sm → text-xs */}
                <div className="flex items-center justify-between mt-1"> {/* mt-2 → mt-1 */}
                  <div className="flex items-center space-x-2">
                    <span className="bg-green-100 text-green-800 px-1.5 py-0.5 rounded text-xs">
                      ⭐ {restaurant.rating}
                    </span>
                    <span className="text-gray-500 text-xs">• {restaurant.deliveryTime}</span>
                  </div>
                  <span className="text-orange-600 font-semibold text-xs"> {/* text-sm → text-xs */}
                    {restaurant.deliveryFee}f
                  </span>
                </div>
                {restaurant.category && (
                  <div className="mt-1"> {/* mt-2 → mt-1 */}
                    <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded text-xs">
                      {categories.find(cat => cat.id === restaurant.category)?.name.replace(/^.[^ ]* /, '') || restaurant.category}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}

        {filteredRestaurants.length === 0 && (
          <div className="text-center py-8"> {/* py-12 → py-8 */}
            <div className="text-4xl mb-2">🔍</div> {/* text-6xl → text-4xl, mb-4 → mb-2 */}
            <p className="text-gray-500 text-base">Aucun restaurant trouvé</p> {/* text-lg → text-base */}
            <p className="text-gray-400 text-xs mt-1"> {/* text-sm → text-xs, mt-2 → mt-1 */}
              Essayez d'autres termes de recherche ou une autre catégorie
            </p>
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('all')
              }}
              className="mt-2 bg-orange-500 text-white px-4 py-1.5 rounded-full text-xs"
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