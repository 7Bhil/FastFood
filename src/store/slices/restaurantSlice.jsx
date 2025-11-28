import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  restaurants: [],
  currentRestaurant: null,
  loading: false,
  error: null
}

const restaurantSlice = createSlice({
  name: 'restaurants',
  initialState,
  reducers: {
    setRestaurants: (state, action) => {
      state.restaurants = action.payload
    },
    setCurrentRestaurant: (state, action) => {
      state.currentRestaurant = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    }
  }
})

export const { setRestaurants, setCurrentRestaurant, setLoading, setError } = restaurantSlice.actions
export default restaurantSlice.reducer