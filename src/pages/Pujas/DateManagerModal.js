import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { X, Plus, Trash2, Save } from 'lucide-react';

// type = 'pujas' or 'temples' or 'priests'
export default function DateManagerModal({ item, type, onClose, onSaved }) {
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [saving, setSaving] = useState(false);

  // Load existing dates when modal opens
  useEffect(() => {
    if (item.availableDates) {
      setDates(item.availableDates.map(d => new Date(d)));
    }
  }, [item]);

  const addDate = () => {
    if (!selectedDate) {
      toast.error('Please select a date first');
      return;
    }
    // Check if date already in the list
    const alreadyExists = dates.some(
      d => d.toDateString() === selectedDate.toDateString()
    );
    if (alreadyExists) {
      toast.error('This date is already in the list');
      return;
    }
    setDates(prev => [...prev, selectedDate]);
    setSelectedDate(null);  // Clear the picker
  };

  const removeDate = (dateToRemove) => {
    setDates(prev =>
      prev.filter(d => d.toDateString() !== dateToRemove.toDateString())
    );
  };

  const saveDates = async () => {
    setSaving(true);
    try {
      await API.put(`/${type}/${item._id}/dates`, { availableDates: dates });
      toast.success('✅ Dates saved! The app will show updated dates immediately.');
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save dates');
    } finally {
      setSaving(false);
    }
  };

  // Sort dates chronologically for display
  const sortedDates = [...dates].sort((a, b) => a - b);

  return (
    // Backdrop
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      {/* Modal Box */}
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Manage Available Dates</h2>
            <p className="text-sm text-gray-500 mt-1">{item.name}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {/* Date Picker + Add Button */}
          <div className="flex gap-3 mb-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select a date to add
              </label>
              <DatePicker
                selected={selectedDate}
                onChange={date => setSelectedDate(date)}
                minDate={new Date()}       // Cannot pick past dates
                dateFormat="dd MMM yyyy"
                placeholderText="Pick a date..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <button
              onClick={addDate}
              className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 self-end"
            >
              <Plus size={15} /> Add
            </button>
          </div>

          {/* List of added dates */}
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Available Dates ({dates.length} total)
            </p>
            {sortedDates.length === 0 ? (
              <div className="text-center py-8 text-gray-400 border-2 border-dashed rounded-lg">
                <div className="text-3xl mb-2">📅</div>
                <p className="text-sm">No dates added yet</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {sortedDates.map((date, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg px-4 py-2.5"
                  >
                    <span className="text-sm font-medium text-blue-800">
                      {date.toLocaleDateString('en-IN', {
                        weekday: 'short',
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                    <button
                      onClick={() => removeDate(date)}
                      className="text-red-400 hover:text-red-600 ml-3"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Save Button */}
          <button
            onClick={saveDates}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? 'Saving...' : 'Save All Dates'}
          </button>
        </div>
      </div>
    </div>
  );
}