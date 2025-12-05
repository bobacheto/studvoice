import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../utils/api';
import { Alert } from '../components/Alert';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert(null);

    try {
      const response = await loginUser(formData.email, formData.password);
      localStorage.setItem('token', response.token);
      localStorage.setItem('userId', response.userId);
      localStorage.setItem('username', response.username);
      setAlert({ type: 'success', message: 'Успешен вход! Пренасочване...' });
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setAlert({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}
      
      <div className="w-full max-w-md card">
        <h1 className="text-4xl font-oswald font-bold text-primary mb-2">StudVoice</h1>
        <p className="text-gray-600 mb-6">Вход в платформата</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Имейл</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="input-field" required />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Парола</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} className="input-field" required />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full mt-6 disabled:opacity-50">
            {loading ? 'Вход...' : 'Вход'}
          </button>
        </form>

        <div className="mt-6 text-center text-gray-600">
          Нямате акаунт? <Link to="/register" className="text-primary font-semibold hover:underline">Регистрирайте се</Link>
        </div>
      </div>
    </div>
  );
}
