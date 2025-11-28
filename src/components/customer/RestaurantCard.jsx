import React from 'react'

const RestaurantCard = ({ restaurant }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <img 
        src={restaurant.image} 
        alt={restaurant.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{restaurant.name}</h3>
          <span className="flex items-center bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
            ⭐ {restaurant.rating}
          </span>
        </div>
        <p className="text-gray-600 text-sm mb-3">{restaurant.description}</p>
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>🕒 {restaurant.deliveryTime}</span>
          <span>🚴 {restaurant.deliveryFee}f</span>
          <span className={restaurant.isOpen ? "text-green-600" : "text-red-600"}>
            {restaurant.isOpen ? "Ouvert" : "Fermé"}
          </span>
        </div>
      </div>
    </div>
  )
}

export default RestaurantCard