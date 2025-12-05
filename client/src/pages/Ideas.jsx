import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getIdeas, createIdea, upvoteIdea } from '../utils/api';
import { Alert, RateLimitWarning } from '../components/Alert';

export default function Ideas() {
  const navigate = useNavigate();
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [userUpvotes, setUserUpvotes] = useState({});
  const [rateLimitWarning, setRateLimitWarning] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) navigate('/login');
    else fetchIdeas();
  }, [token, navigate]);

  const fetchIdeas = async () => {
    try {
      setLoading(true);
      const data = await getIdeas();
      setIdeas(data);
      const upvoted = {};
      data.forEach(idea => {
        if (localStorage.getItem(`idea_upvote_${idea.id}`)) {
          upvoted[idea.id] = true;
        }
      });
      setUserUpvotes(upvoted);
    } catch (err) {
      setAlert({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async (ideaId) => {
    if (userUpvotes[ideaId]) {
      setAlert({ type: 'warning', message: 'Вече сте подкрепили тази идея' });
      return;
    }

    try {
      await upvoteIdea(ideaId);
      setUserUpvotes({ ...userUpvotes, [ideaId]: true });
      localStorage.setItem(`idea_upvote_${ideaId}`, '1');
      setAlert({ type: 'success', message: 'Идея подкрепена!' });
      setTimeout(() => fetchIdeas(), 500);
    } catch (err) {
      if (err.message.includes('Rate limit')) {
        setRateLimitWarning(err.message);
      } else {
        setAlert({ type: 'error', message: err.message });
      }
    }
  };

  const handleCreateIdea = async (e) => {
    e.preventDefault();
    try {
      await createIdea(formData.title, formData.description);
      setAlert({ type: 'success', message: 'Идея предложена успешно!' });
      setFormData({ title: '', description: '' });
      setShowForm(false);
      setTimeout(() => fetchIdeas(), 500);
    } catch (err) {
      if (err.message.includes('Rate limit')) {
        setRateLimitWarning(err.message);
      } else {
        setAlert({ type: 'error', message: err.message });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}
      {rateLimitWarning && <RateLimitWarning message={rateLimitWarning} onClose={() => setRateLimitWarning(null)} />}

      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="text-primary font-semibold hover:underline">← Начало</button>
          <h1 className="text-2xl font-oswald font-bold text-primary">Идеи</h1>
          <button onClick={() => localStorage.clear()} className="btn-outline text-sm">Изход</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary mb-8"
        >
          {showForm ? 'Откажи' : '+ Нова идея'}
        </button>

        {/* Create Form */}
        {showForm && (
          <div className="card p-6 mb-8">
            <h2 className="text-xl font-oswald font-bold mb-4">Предложи идея</h2>
            <form onSubmit={handleCreateIdea} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Заглавие</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Описание</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field resize-none"
                  rows="4"
                />
              </div>
              <button type="submit" disabled={!formData.title} className="btn-primary w-full disabled:opacity-50">
                Предложи идея
              </button>
            </form>
          </div>
        )}

        {/* Ideas List */}
        {loading ? (
          <div className="text-center text-gray-500 py-8">Зареждане...</div>
        ) : ideas.length === 0 ? (
          <div className="card p-8 text-center text-gray-500">Няма идеи</div>
        ) : (
          <div className="space-y-6">
            {ideas.map((idea) => (
              <div key={idea.id} className="card p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-oswald font-bold text-lg mb-1">{idea.title}</h3>
                    <p className="text-sm text-gray-500">
                      Предложена от: {idea.author}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-secondary">{idea.upvotes}</div>
                    <div className="text-xs text-gray-500">подкрепа</div>
                  </div>
                </div>

                {idea.description && (
                  <p className="text-gray-600 mb-4">{idea.description}</p>
                )}

                <div className="flex items-center gap-3">
                  <span className={`badge ${idea.status === 'approved' ? 'bg-green-100 text-green-800' : idea.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {idea.status === 'approved' ? 'Одобрена' : idea.status === 'rejected' ? 'Отхвърлена' : 'В преглед'}
                  </span>

                  <button
                    onClick={() => handleUpvote(idea.id)}
                    disabled={userUpvotes[idea.id]}
                    className={`font-semibold py-2 px-4 rounded-lg transition-colors ${
                      userUpvotes[idea.id]
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-secondary text-white hover:bg-purple-700'
                    }`}
                  >
                    {userUpvotes[idea.id] ? '✓ Подкрепена' : '👍 Подкрепи'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
