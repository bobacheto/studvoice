import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getVotes, createVote, voteOnPoll } from '../utils/api';
import { Alert, RateLimitWarning } from '../components/Alert';

export default function Votes() {
  const navigate = useNavigate();
  const [votes, setVotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ question: '', optionYes: 'Да', optionNo: 'Не' });
  const [userVotes, setUserVotes] = useState({});
  const [rateLimitWarning, setRateLimitWarning] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) navigate('/login');
    else fetchVotes();
  }, [token, navigate]);

  const fetchVotes = async () => {
    try {
      setLoading(true);
      const data = await getVotes();
      setVotes(data);
      const voted = {};
      data.forEach(v => {
        const voteData = localStorage.getItem(`vote_${v.id}`);
        if (voteData) voted[v.id] = voteData;
      });
      setUserVotes(voted);
    } catch (err) {
      setAlert({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (voteId, choice) => {
    if (userVotes[voteId]) {
      setAlert({ type: 'warning', message: 'Вече сте гласували на това поле' });
      return;
    }

    try {
      await voteOnPoll(voteId, choice);
      setUserVotes({ ...userVotes, [voteId]: choice });
      localStorage.setItem(`vote_${voteId}`, choice);
      setAlert({ type: 'success', message: `Гласували сте: ${choice === 'yes' ? 'Да' : 'Не'}` });
      setTimeout(() => fetchVotes(), 500);
    } catch (err) {
      if (err.message.includes('Rate limit')) {
        setRateLimitWarning(err.message);
      } else {
        setAlert({ type: 'error', message: err.message });
      }
    }
  };

  const handleCreateVote = async (e) => {
    e.preventDefault();
    try {
      await createVote(formData.question, formData.optionYes, formData.optionNo);
      setAlert({ type: 'success', message: 'Поле създадено успешно!' });
      setFormData({ question: '', optionYes: 'Да', optionNo: 'Не' });
      setShowForm(false);
      setTimeout(() => fetchVotes(), 500);
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
          <h1 className="text-2xl font-oswald font-bold text-primary">Гласувания</h1>
          <button onClick={() => localStorage.clear()} className="btn-outline text-sm">Изход</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary mb-8"
        >
          {showForm ? 'Откажи' : '+ Ново поле'}
        </button>

        {/* Create Form */}
        {showForm && (
          <div className="card p-6 mb-8">
            <h2 className="text-xl font-oswald font-bold mb-4">Създай ново поле</h2>
            <form onSubmit={handleCreateVote} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Въпрос</label>
                <input
                  type="text"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <button type="submit" disabled={!formData.question} className="btn-primary w-full disabled:opacity-50">
                Създай поле
              </button>
            </form>
          </div>
        )}

        {/* Votes List */}
        {loading ? (
          <div className="text-center text-gray-500 py-8">Зареждане...</div>
        ) : votes.length === 0 ? (
          <div className="card p-8 text-center text-gray-500">Няма полета</div>
        ) : (
          <div className="space-y-6">
            {votes.map((vote) => {
              const total = vote.countYes + vote.countNo;
              const yesPercent = total > 0 ? Math.round((vote.countYes / total) * 100) : 0;
              const noPercent = total > 0 ? Math.round((vote.countNo / total) * 100) : 0;
              const hasVoted = !!userVotes[vote.id];

              return (
                <div key={vote.id} className="card p-6">
                  <h3 className="font-oswald font-bold text-lg mb-4">{vote.question}</h3>

                  {/* Progress Bars */}
                  <div className="space-y-4 mb-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-green-700">{vote.optionYes}</span>
                        <span className="text-sm text-gray-600">{vote.countYes} гласа ({yesPercent}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-green-500 h-full transition-all duration-300"
                          style={{ width: `${yesPercent}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-red-700">{vote.optionNo}</span>
                        <span className="text-sm text-gray-600">{vote.countNo} гласа ({noPercent}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-red-500 h-full transition-all duration-300"
                          style={{ width: `${noPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Voting Buttons */}
                  {hasVoted ? (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center text-blue-700 font-semibold">
                      ✓ Вече сте гласували
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => handleVote(vote.id, 'yes')}
                        className="btn-primary bg-green-600 hover:bg-green-700"
                      >
                        {vote.optionYes}
                      </button>
                      <button
                        onClick={() => handleVote(vote.id, 'no')}
                        className="btn-primary bg-red-600 hover:bg-red-700"
                      >
                        {vote.optionNo}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
