import { useEffect, useState } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const statusColors = {
  pending:   'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  completed: 'bg-blue-100 text-blue-700',
};

export default function BookingList() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await API.get('/bookings');
      setBookings(data.data);
    } catch { toast.error('Could not load bookings'); }
    finally { setLoading(false); }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/bookings/${id}/status`, { status });
      toast.success('Status updated');
      fetchBookings();
    } catch { toast.error('Update failed'); }
  };

  if (loading) return <div className="text-center mt-20 text-4xl animate-spin">🕉️</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        All Bookings ({bookings.length})
      </h1>

      <div className="space-y-4">
        {bookings.map(b => (
          <div key={b._id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-gray-800">
                  {b.puja?.name || b.temple?.name || b.priest?.name || 'Booking'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Customer: {b.user?.name} ({b.user?.email})
                </p>
                <p className="text-sm text-gray-500">
                  Date: {new Date(b.bookingDate).toLocaleDateString('en-IN', {
                    day:'2-digit', month:'long', year:'numeric'
                  })}
                </p>
                <p className="text-sm font-medium text-saffron-500 mt-1">₹{b.amount}</p>
              </div>
              <div className="text-right space-y-2">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[b.status]}`}>
                  {b.status}
                </span>
                <div>
                  <select
                    value={b.status}
                    onChange={e => updateStatus(b._id, e.target.value)}
                    className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none"
                  >
                    {['pending','confirmed','cancelled','completed'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}