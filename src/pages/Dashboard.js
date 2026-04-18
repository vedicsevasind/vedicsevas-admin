import { useEffect, useState } from 'react';
import API from '../api/axios';

export default function Dashboard() {
  const [stats, setStats] = useState({
    pujas: 0, temples: 0, priests: 0, bookings: 0, revenue: 0
  });

  useEffect(() => {
    // Fetch counts from all endpoints
    Promise.all([
      API.get('/pujas'),
      API.get('/temples'),
      API.get('/priests'),
      API.get('/bookings')
    ]).then(([pujas, temples, priests, bookings]) => {
      const paidBookings = bookings.data.data.filter(b => b.paymentStatus === 'paid');
      const revenue = paidBookings.reduce((sum, b) => sum + b.amount, 0);
      setStats({
        pujas:    pujas.data.count,
        temples:  temples.data.count,
        priests:  priests.data.count,
        bookings: bookings.data.count,
        revenue
      });
    });
  }, []);

  const cards = [
    { label: 'Total Pujas',    value: stats.pujas,    icon: '🪔', color: 'bg-orange-100 text-orange-700' },
    { label: 'Temples',        value: stats.temples,  icon: '🛕', color: 'bg-yellow-100 text-yellow-700' },
    { label: 'Priests',        value: stats.priests,  icon: '👨‍🦳', color: 'bg-blue-100 text-blue-700' },
    { label: 'Total Bookings', value: stats.bookings, icon: '📅', color: 'bg-green-100 text-green-700' },
    { label: 'Revenue (₹)',    value: `₹${stats.revenue.toLocaleString('en-IN')}`, icon: '💰', color: 'bg-purple-100 text-purple-700' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map(card => (
          <div key={card.label} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className={`text-3xl w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${card.color}`}>
              {card.icon}
            </div>
            <p className="text-2xl font-bold text-gray-800">{card.value}</p>
            <p className="text-sm text-gray-500 mt-1">{card.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}