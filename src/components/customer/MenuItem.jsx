import React, { useState } from 'react'

const MenuItem = ({ item, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1)
  const [selectedOptions, setSelectedOptions] = useState({}) // Toujours initialiser comme objet

  const handleOptionChange = (optionId, choiceId) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionId]: choiceId
    }))
  }

  const handleAddToCart = () => {
    onAddToCart(item, selectedOptions, quantity)
    setQuantity(1)
    setSelectedOptions({}) // Réinitialiser en objet vide
  }

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border">
      <div className="flex space-x-4">
        <img 
          src={item.image} 
          alt={item.name}
          className="w-20 h-20 object-cover rounded-xl"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{item.name}</h3>
          <p className="text-gray-600 text-sm mt-1">{item.description}</p>
          
          {/* Options */}
          {item.options && item.options.map(option => (
            <div key={option.id} className="mt-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {option.name} {option.isRequired && '*'}
              </label>
              <div className="space-y-1">
                {option.choices.map(choice => (
                  <label key={choice.id} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name={`option-${option.id}`}
                      value={choice.id}
                      onChange={() => handleOptionChange(option.id, choice.name)}
                      required={option.isRequired}
                      className="text-orange-500"
                    />
                    <span className="text-sm">
                      {choice.name} {choice.price > 0 && `(+${choice.price}f)`}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
              >
                -
              </button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
              >
                +
              </button>
            </div>
            
            <button
              onClick={handleAddToCart}
              disabled={!item.isAvailable}
              className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium disabled:bg-gray-300"
            >
              {item.isAvailable ? 'Ajouter' : 'Indisponible'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MenuItem