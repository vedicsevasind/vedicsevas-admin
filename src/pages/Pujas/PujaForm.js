cat > src/pages/Pujas/PujaForm.js << 'EOF'
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../../api/axios';
import toast from 'react-hot-toast';

export default function PujaForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: '', description: '', significance: '',
    benefits: '',
    whenToPerform: '', duration: '',
    price: '', category: 'Special'
  });

  useEffect(() => {
    if (isEditing) {
      API.get(`/pujas/${id}`).then(({ data }) => {
        const p = data.data;
        setForm({
          name: p.name, description: p.description,
          significance: p.significance, benefits: p.benefits.join(', '),
          whenToPerform: p.whenToPerform, duration: p.duration,
          price: p.price, category: p.category
        });
      });
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        benefits: form.benefits.split(',').map(b => b.trim()).filter(Boolean)
      };
      if (isEditing) {
        await API.put(`/pujas/${id}`, payload);
        toast.success('Puja updated!');
      } else {
        await API.post('/pujas', payload);
        toast.success('Puja created!');
      }
      navigate('/pujas');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'name',          label: 'Puja Name',       type: 'text',   required: true },
    { name: 'price',         label: 'Price (₹)',        type: 'number', required: true },
    { name: 'duration',      label: 'Duration',         type: 'text',   placeholder: 'e.g. 2-3 hours' },
    { name: 'whenToPerform', label: 'When to Perform',  type: 'text',   placeholder: 'e.g. Purnima, Mondays' },
  ];

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {isEditing ? 'Edit Puja' : 'Add New Puja'}
      </h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm space-y-4">
        {fields.map(f => (
          <div key={f.name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
            <input
              type={f.type}
              name={f.name}
              value={form[f.name]}
              onChange={handleChange}
              placeholder={f.placeholder}
              required={f.required}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500"
            />
          </div>
        ))}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500"
          >
            {['Vratham','Daily','Festival','Special','Griha Pravesh','Wedding','Other'].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        {[
          { name: 'description',  label: 'Description',                rows: 4 },
          { name: 'significance', label: 'Significance',               rows: 3 },
          { name: 'benefits',     label: 'Benefits (comma-separated)', rows: 2 },
        ].map(f => (
          <div key={f.name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
            <textarea
              name={f.name}
              value={form[f.name]}
              onChange={handleChange}
              rows={f.rows}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500"
            />
          </div>
        ))}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/pujas')}
            className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-lg text-sm hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-saffron-500 hover:bg-saffron-600 text-white font-semibold py-2.5 rounded-lg text-sm disabled:opacity-50"
          >
            {loading ? 'Saving...' : isEditing ? 'Update Puja' : 'Create Puja'}
          </button>
        </div>
      </form>
    </div>
  );
}
EOF