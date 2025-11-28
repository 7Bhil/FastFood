import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
  total: 0,
  restaurant: null,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { item, restaurant } = action.payload
      
      if (state.restaurant && state.restaurant.id !== restaurant.id) {
        state.items = []
        state.restaurant = restaurant
      } else if (!state.restaurant) {
        state.restaurant = restaurant
      }
      
      const existingItem = state.items.find(i => 
        i.id === item.id && 
        JSON.stringify(i.selectedOptions) === JSON.stringify(item.selectedOptions)
      )
      
      if (existingItem) {
        existingItem.quantity += item.quantity
      } else {
        state.items.push(item)
      }
      
      state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload)
      state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      
      if (state.items.length === 0) {
        state.restaurant = null
      }
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload
      const item = state.items.find(item => item.id === id)
      if (item) {
        item.quantity = quantity
        state.total = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      }
    },
    clearCart: (state) => {
      state.items = []
      state.total = 0
      state.restaurant = null
    },
  },
})

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions
export default cartSlice.reducer