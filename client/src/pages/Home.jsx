import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-3xl font-oswald font-bold text-primary">StudVoice</h1>
          {token && (
            <button
              onClick={() => {
                localStorage.clear();
                navigate('/login');
              }}
              className="btn-outline text-sm"
            >
              Изход
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-oswald font-bold text-gray-900 mb-4">
            Твоят глас има значение
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Участвай в студентските гласувания, предложи идеи и форми бъдещето на нашата школа
          </p>
        </div>

        {/* Action Buttons */}
        {!token ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-md mx-auto mb-16">
            <button
              onClick={() => navigate('/login')}
              className="btn-primary"
            >
              Вход
            </button>
            <button
              onClick={() => navigate('/register')}
              className="btn-secondary"
            >
              Регистрация
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-16">
            <button
              onClick={() => navigate('/votes')}
              className="card hover:shadow-lg transition-shadow p-6 text-center cursor-pointer"
            >
              <div className="text-4xl mb-2">🗳️</div>
              <h3 className="text-xl font-oswald font-bold text-primary mb-2">Гласувания</h3>
              <p className="text-gray-600">Участвай в студентските полета</p>
            </button>

            <button
              onClick={() => navigate('/ideas')}
              className="card hover:shadow-lg transition-shadow p-6 text-center cursor-pointer"
            >
              <div className="text-4xl mb-2">💡</div>
              <h3 className="text-xl font-oswald font-bold text-primary mb-2">Идеи</h3>
              <p className="text-gray-600">Предложи нови идеи за школата</p>
            </button>
          </div>
        )}

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
          <div className="card p-6">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="font-oswald font-bold text-lg mb-2">Прозрачност</h3>
            <p className="text-gray-600 text-sm">Вижте реални резултати от гласувания в реално време</p>
          </div>

          <div className="card p-6">
            <div className="text-3xl mb-3">🤝</div>
            <h3 className="font-oswald font-bold text-lg mb-2">Общност</h3>
            <p className="text-gray-600 text-sm">Присъедини се с други студенти и направи разлика</p>
          </div>

          <div className="card p-6">
            <div className="text-3xl mb-3">🔒</div>
            <h3 className="font-oswald font-bold text-lg mb-2">Анонимност</h3>
            <p className="text-gray-600 text-sm">Твоето мнение е защитено и можеш да говориш свободно</p>
          </div>
        </div>
      </div>
    </div>
  );
}
