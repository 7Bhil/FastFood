import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToCart } from '../../store/slices/cartSlice.jsx'
import { getRestaurantById, getRestaurantMenu } from '../../services/restaurantService.jsx'

const Restaurant = () => {
  const { id } = useParams()
  const [restaurant, setRestaurant] = useState(null)
  const [menu, setMenu] = useState([])
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    loadRestaurantData()
  }, [id])

  const loadRestaurantData = async () => {
    try {
      const [restaurantData, menuData] = await Promise.all([
        getRestaurantById(id),
        getRestaurantMenu(id)
      ])
      setRestaurant(restaurantData)
      setMenu(menuData)
    } catch (error) {
      console.error('Erreur chargement restaurant:', error)
    } finally {
      setLoading(false)
    }
  }

  // Dans la fonction handleAddToCart, modifiez :
const handleAddToCart = (menuItem, selectedOptions = {}, quantity = 1) => {
  const cartItem = {
    id: `${menuItem.id}-${Date.now()}`,
    name: menuItem.name,
    price: menuItem.price,
    image: menuItem.image,
    quantity: quantity,
    selectedOptions: selectedOptions || {}, // S'assurer que c'est toujours un objet
    menuItemId: menuItem.id
  }

    dispatch(addToCart({
      item: cartItem,
      restaurant: restaurant
    }))

    // Feedback visuel
    alert(`✅ ${menuItem.name} ajouté au panier!`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Chargement du restaurant...</p>
        </div>
      </div>
    )
  }
    if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Restaurant non trouvé</p>
          <Link 
            to="/"
            className="mt-4 text-orange-600 hover:text-orange-700"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    )
  }


  return (
    <div className="mobile-container pb-20">
      {/* Header fixe */}
      <div className="bg-white sticky top-2 z-30 border-b">
        <div className="p-4">



<h1>{restaurant.name}</h1>
          <p className="text-gray-600 text-sm mt-1">{restaurant.description}</p>
          <div className="flex items-center space-x-3 mt-2">
            <span className="text-sm">⭐ {restaurant.rating}</span>
            <span className="text-sm">🕒 {restaurant.deliveryTime}</span>
            <span className="text-sm">🚴 {restaurant.deliveryFee}f</span>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="p-4 space-y-4">
        {menu.map(item => (
          <div key={item.id} className="bg-white rounded-2xl p-4 shadow-sm border">
            <div className="flex space-x-4">
              <img 
                src={item.image} 
                alt={item.name}
                className="w-20 h-20 object-cover rounded-xl"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-orange-600 font-bold text-lg">
                    {item.price}f
                  </span>
                  <button
                    onClick={() => handleAddToCart(item)}
                    disabled={!item.isAvailable}
                    className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium disabled:bg-gray-300"
                  >
                    {item.isAvailable ? 'Ajouter' : 'Indisponible'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Restaurant