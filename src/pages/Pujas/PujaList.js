import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { Pencil, Trash2, CalendarDays, Plus } from 'lucide-react';
import DateManagerModal from './DateManagerModal';

export default function PujaList() {
  const [pujas, setPujas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateModalPuja, setDateModalPuja] = useState(null); // Which puja's dates to manage

  useEffect(() => { fetchPujas(); }, []);

  const fetchPujas = async () => {
    try {
      const { data } = await API.get('/pujas');
      setPujas(data.data);
    } catch (err) {
      toast.error('Could not load pujas');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Deactivate "${name}"?`)) return;
    try {
      await API.delete(`/pujas/${id}`);
      toast.success('Puja deactivated');
      fetchPujas();
    } catch {
      toast.error('Could not deactivate puja');
    }
  };

  if (loading) return <div className="flex justify-center mt-20"><div className="text-4xl animate-spin">🕉️</div></div>;

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Pujas</h1>
        <Link
          to="/pujas/new"
          className="flex items-center gap-2 bg-saffron-500 hover:bg-saffron-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          <Plus size={16} /> Add New Puja
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-6 py-3 text-gray-600 font-medium">Puja Name</th>
              <th className="text-left px-6 py-3 text-gray-600 font-medium">Category</th>
              <th className="text-left px-6 py-3 text-gray-600 font-medium">Price</th>
              <th className="text-left px-6 py-3 text-gray-600 font-medium">Available Dates</th>
              <th className="text-left px-6 py-3 text-gray-600 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pujas.map(puja => (
              <tr key={puja._id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-800">{puja.name}</td>
                <td className="px-6 py-4">
                  <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full">
                    {puja.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">₹{puja.price}</td>
                <td className="px-6 py-4">
                  <span className="text-blue-600 font-medium">
                    {puja.availableDates?.length || 0} dates
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {/* Manage Dates — the KEY feature */}
                    <button
                      onClick={() => setDateModalPuja(puja)}
                      title="Manage available dates"
                      className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                    >
                      <CalendarDays size={15} />
                    </button>
                    {/* Edit */}
                    <Link
                      to={`/pujas/${puja._id}/edit`}
                      className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
                    >
                      <Pencil size={15} />
                    </Link>
                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(puja._id, puja.name)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {pujas.length === 0 && (
          <p className="text-center text-gray-400 py-12">No pujas found. Add one!</p>
        )}
      </div>

      {/* Date Manager Modal */}
      {dateModalPuja && (
        <DateManagerModal
          item={dateModalPuja}
          type="pujas"
          onClose={() => setDateModalPuja(null)}
          onSaved={fetchPujas}
        />
      )}
    </div>
  );
}