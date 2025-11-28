import React, { useState } from 'react'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 156,
    totalRevenue: 3245.50,
    activeRestaurants: 23,
    activeDrivers: 15
  })

  const [recentOrders, setRecentOrders] = useState([
    { id: 'ORD-001', customer: 'Jean Dupont', amount: 25.99, status: 'delivered', date: '2024-01-15' },
    { id: 'ORD-002', customer: 'Marie Martin', amount: 18.50, status: 'preparing', date: '2024-01-15' },
    { id: 'ORD-003', customer: 'Pierre Lambert', amount: 32.75, status: 'in delivery', date: '2024-01-15' }
  ])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard Administrateur</h1>
      
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Commandes totales</h3>
          <p className="text-3xl font-bold text-orange-600">{stats.totalOrders}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Revenus totaux</h3>
          <p className="text-3xl font-bold text-green-600">{stats.totalRevenue}f</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Restaurants actifs</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.activeRestaurants}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Livreurs actifs</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.activeDrivers}</p>
        </div>
      </div>

      {/* Commandes récentes */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Commandes récentes</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentOrders.map(order => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.amount}f</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'preparing' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <button className="bg-orange-500 text-white py-3 px-4 rounded-md hover:bg-orange-600">
          Gérer Restaurants
        </button>
        <button className="bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600">
          Gérer Livreurs
        </button>
        <button className="bg-green-500 text-white py-3 px-4 rounded-md hover:bg-green-600">
          Voir Rapports
        </button>
        <button className="bg-purple-500 text-white py-3 px-4 rounded-md hover:bg-purple-600">
          Paramètres
        </button>
      </div>
    </div>
  )
}

export default Dashboard