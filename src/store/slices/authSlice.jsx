import { createSlice } from '@reduxjs/toolkit'

// Données mock pour la démo
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
  },
  admin: {
    id: '4',
    name: 'Admin System',
    email: 'admin@demo.com',
    phone: '+229 93 33 33 33',
    role: 'admin',
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
      
      // Utiliser l'utilisateur fourni ou créer un par défaut
      if (action.payload.user) {
        state.user = action.payload.user
      } else {
        // Détection automatique du rôle si fourni dans l'action
        const role = action.payload.role
        if (role && mockUsers[role]) {
          state.user = mockUsers[role]
        } else {
          // Fallback vers client par défaut
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
    // AJOUTER CETTE ACTION MANQUANTE
    updateProfile: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
      }
    }
  },
})

// BIEN EXPORTER updateProfile
export const { 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  logout, 
  updateProfile  // AJOUTÉ ICI
} = authSlice.actions

export default authSlice.reducer