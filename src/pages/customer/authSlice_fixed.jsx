import { createSlice } from '@reduxjs/toolkit'

const mockUsers = {
  customer: {
    id: '1',
    name: 'Jean Client',
    email: 'client@demo.com',
    phone: '+229 90 00 00 00',
    role: 'customer',
    addresses: [],
    createdAt: new Date().toISOString()
  },
  restaurant: {
    id: '2', 
    name: 'Pierre Restaurant',
    email: 'restaurant@demo.com',
    phone: '+229 91 11 11 11',
    role: 'restaurant',
    restaurantId: 'resto-1',
    restaurantName: 'Pizza Italia',
    restaurantAddress: '123 Rue du Commerce, Cotonou',
    createdAt: new Date().toISOString()
  },
  delivery: {
    id: '3',
    name: 'Paul Livreur',
    email: 'livreur@demo.com',
    phone: '+229 92 22 22 22',
    role: 'delivery',
    vehicleType: 'scooter',
    status: 'available',
    createdAt: new Date().toISOString()
  }
}

const initialState = {
  user: null,
  token: 'mock-token',
  isAuthenticated: false,
  loading: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true
    },
    loginSuccess: (state, action) => {
      state.loading = false
      state.isAuthenticated = true
      
      if (action.payload.user) {
        state.user = action.payload.user
      } else {
        const role = action.payload.role
        if (role && mockUsers[role]) {
          state.user = mockUsers[role]
        } else {
          state.user = mockUsers.customer
        }
      }
      
      state.token = 'mock-token'
    },
    loginFailure: (state) => {
      state.loading = false
      state.isAuthenticated = false
      state.user = null
      state.token = null
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.user = null
      state.token = null
    },
    updateProfile: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
      }
    }
  },
})

// EXPORTS CORRECTS
export const loginStart = authSlice.actions.loginStart
export const loginSuccess = authSlice.actions.loginSuccess
export const loginFailure = authSlice.actions.loginFailure
export const logout = authSlice.actions.logout
export const updateProfile = authSlice.actions.updateProfile

export default authSlice.reducer