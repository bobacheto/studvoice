import React, { useState, useMemo } from "react";
import { MessageSquare, Plus, Search, ThumbsUp, Filter, TrendingUp, Users, CheckCircle, AlertCircle, Lightbulb, Shield, Eye, EyeOff, Sparkles } from "lucide-react";

// 🎨 Brand Colors
const COLORS = {
  primary: "#4F46E5",    // Indigo - knowledge & authority
  secondary: "#22C55E",  // Green - change & voice
  accent: "#FACC15",     // Yellow - energy & positivity
  bg: "#F9FAFB"         // Light gray - clean & minimal
};

export default function App() {
  const [route, setRoute] = useState("home");
  const [filter, setFilter] = useState("Всички");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  
  // Mock data - TODO: Replace with Firebase Realtime Database
  // Firebase structure:
  // /schools/{schoolId}/opinions/{opinionId}
  // /schools/{schoolId}/users/{userId}
  // /schools/{schoolId}/votes/{opinionId}/{userId}
  const [opinions, setOpinions] = useState([
    {
      id: 1,
      text: "Да има проект вместо тест по математика в края на полугодието.",
      category: "Идея",
      school: "125 СУ",
      class: "10Б",
      anonymous: false,
      authorName: "Мария П.",
      votes: 24,
      timestamp: Date.now() - 7200000,
      status: "active"
    },
    {
      id: 2,
      text: "Засаждане на цветя във фоайето и създаване на зелен кът за отдих между часовете.",
      category: "Предложение",
      school: "125 СУ",
      class: "",
      anonymous: true,
      votes: 18,
      timestamp: Date.now() - 3600000,
      status: "active"
    },
    {
      id: 3,
      text: "Климатиците в кабинета по химия не работят. Лятото е невъзможно да се учи.",
      category: "Проблем",
      school: "125 СУ",
      class: "9А",
      anonymous: false,
      authorName: "Георги М.",
      votes: 32,
      timestamp: Date.now() - 1800000,
      status: "active"
    },
  ]);

  const [userVotes, setUserVotes] = useState(new Set());
  const [showWaveAnimation, setShowWaveAnimation] = useState(false);

  const publishOpinion = (payload) => {
    // TODO: Move to Firebase Cloud Functions for server-side validation
    const profanityList = ["***", "****", "глупост", "идиот"];
    const textLower = payload.text.toLowerCase();
    
    if (profanityList.some(word => textLower.includes(word))) {
      alert("❌ Публикацията съдържа неподходящи думи. Моля, редактирай текста.");
      return false;
    }

    if (payload.text.length < 10) {
      alert("⚠️ Мнението трябва да е поне 10 символа.");
      return false;
    }

    const newOpinion = {
      id: Date.now(),
      text: payload.text.trim(),
      category: payload.category,
      school: payload.school || "125 СУ",
      class: payload.class || "",
      anonymous: payload.anonymous,
      authorName: payload.anonymous ? "" : payload.authorName || "Ученик",
      votes: 0,
      timestamp: Date.now(),
      status: "active"
    };

    setOpinions(prev => [newOpinion, ...prev]);
    
    // Show voice wave animation
    setShowWaveAnimation(true);
    setTimeout(() => {
      setShowWaveAnimation(false);
      setRoute("feed");
    }, 2000);
    
    return true;
  };

  const toggleVote = (id) => {
    // TODO: Use Firebase transactions to prevent race conditions
    if (userVotes.has(id)) {
      setUserVotes(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      setOpinions(prev => prev.map(o => 
        o.id === id ? { ...o, votes: Math.max(0, o.votes - 1) } : o
      ));
    } else {
      setUserVotes(prev => new Set([...prev, id]));
      setOpinions(prev => prev.map(o => 
        o.id === id ? { ...o, votes: o.votes + 1 } : o
      ));
    }
  };

  const filteredAndSortedOpinions = useMemo(() => {
    let filtered = opinions;
    
    if (filter !== "Всички") {
      filtered = filtered.filter(o => o.category === filter);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(o => 
        o.text.toLowerCase().includes(query) ||
        o.category.toLowerCase().includes(query)
      );
    }

    if (sortBy === "popular") {
      return [...filtered].sort((a, b) => b.votes - a.votes);
    }
    return [...filtered].sort((a, b) => b.timestamp - a.timestamp);
  }, [opinions, filter, searchQuery, sortBy]);

  const stats = useMemo(() => ({
    totalOpinions: opinions.length,
    totalVotes: opinions.reduce((sum, o) => sum + o.votes, 0),
    activeUsers: 128,
    acceptedIdeas: opinions.filter(o => o.status === "accepted").length
  }), [opinions]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-green-50/20 text-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <header className="flex items-center justify-between mb-8 bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-green-500 flex items-center justify-center text-white font-bold shadow-lg">
                SV
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-green-600 bg-clip-text text-transparent">
                StudVoice
              </h1>
              <p className="text-xs text-gray-500">Гласът на учениците</p>
            </div>
          </div>
          
          <nav className="flex items-center gap-2">
            <NavButton 
              active={route === "home"}
              onClick={() => setRoute("home")}
              icon={<Users size={18} />}
              label="Начало"
            />
            
            <NavButton 
              active={route === "feed"}
              onClick={() => setRoute("feed")}
              icon={<MessageSquare size={18} />}
              label="Мнения"
            />
            
            <button 
              onClick={() => setRoute("add")}
              className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl flex items-center gap-2 shadow-lg hover:shadow-xl transition-all hover:scale-105 font-semibold"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Сподели мнение</span>
            </button>
          </nav>
        </header>

        {/* Voice Wave Animation Overlay */}
        {showWaveAnimation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-12 shadow-2xl text-center">
              <div className="mb-6">
                <Sparkles size={64} className="mx-auto text-yellow-400 animate-pulse" />
              </div>
              <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-green-600 bg-clip-text text-transparent">
                Гласът ти е чут!
              </h3>
              <VoiceWaveAnimation />
            </div>
          </div>
        )}

        {/* Main Content */}
        <main>
          {route === "home" && (
            <HomePage 
              onNavigate={setRoute}
              stats={stats}
              topOpinions={opinions.slice(0, 3).sort((a, b) => b.votes - a.votes)}
            />
          )}

          {route === "feed" && (
            <FeedPage 
              opinions={filteredAndSortedOpinions}
              filter={filter}
              setFilter={setFilter}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              sortBy={sortBy}
              setSortBy={setSortBy}
              onVote={toggleVote}
              userVotes={userVotes}
            />
          )}

          {route === "add" && (
            <AddOpinionPage 
              onPublish={publishOpinion}
              onCancel={() => setRoute("feed")}
            />
          )}
        </main>
      </div>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }) {
  return (
    <button 
      onClick={onClick}
      className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all font-medium ${
        active 
          ? "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-md" 
          : "hover:bg-gray-100 text-gray-700"
      }`}
    >
      {icon}
      <span className="hidden md:inline">{label}</span>
    </button>
  );
}

function HomePage({ onNavigate, stats, topOpinions }) {
  return (
    <div className="space-y-8">
      {/* Hero Section with Wave Background */}
      <div className="relative bg-white rounded-3xl p-12 shadow-xl overflow-hidden">
        {/* Decorative Wave Background */}
        <svg 
          className="absolute bottom-0 left-0 w-full h-32 opacity-20" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
        >
          <path 
            d="M0,50 C150,80 350,20 600,50 C850,80 1050,20 1200,50 L1200,120 L0,120 Z" 
            fill="url(#wave-gradient)"
          />
          <defs>
            <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{stopColor: COLORS.primary, stopOpacity: 1}} />
              <stop offset="50%" style={{stopColor: COLORS.secondary, stopOpacity: 1}} />
              <stop offset="100%" style={{stopColor: COLORS.accent, stopOpacity: 1}} />
            </linearGradient>
          </defs>
        </svg>

        <div className="relative z-10">
          <h2 className="text-5xl font-bold mb-4 leading-tight">
            Дай глас на <br />
            <span className="bg-gradient-to-r from-indigo-600 via-green-600 to-yellow-500 bg-clip-text text-transparent">
              своето училище.
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl">
            StudVoice е мястото, където мнението ти има значение. 
            <strong> Без страх. Без натиск.</strong> Само гласът на учениците.
          </p>
          
          <div className="flex gap-4 flex-wrap">
            <button 
              onClick={() => onNavigate("add")}
              className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center gap-3 text-lg font-semibold"
            >
              <Plus size={24} />
              Сподели мнение
            </button>
            <button 
              onClick={() => onNavigate("feed")}
              className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center gap-3 text-lg font-semibold"
            >
              <MessageSquare size={24} />
              Виж мненията
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard 
          icon={<Users size={28} className="text-indigo-500" />}
          value={stats.activeUsers}
          label="Активни ученици"
          color="indigo"
        />
        <StatCard 
          icon={<MessageSquare size={28} className="text-green-500" />}
          value={stats.totalOpinions}
          label="Публикации"
          color="green"
        />
        <StatCard 
          icon={<ThumbsUp size={28} className="text-yellow-500" />}
          value={stats.totalVotes}
          label="Гласувания"
          color="yellow"
        />
        <StatCard 
          icon={<CheckCircle size={28} className="text-green-600" />}
          value={stats.acceptedIdeas}
          label="Приети идеи"
          color="green"
        />
      </div>

      {/* Top Opinions */}
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold flex items-center gap-3">
            <TrendingUp size={28} className="text-green-500" />
            Топ мнения
          </h3>
          <button 
            onClick={() => onNavigate("feed")}
            className="text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-2"
          >
            Виж всички
            <span className="text-xl">→</span>
          </button>
        </div>
        <div className="space-y-4">
          {topOpinions.map((opinion, index) => (
            <div key={opinion.id} className="p-5 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-200 hover:shadow-lg transition-all">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-green-500 flex items-center justify-center text-white font-bold text-lg">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <CategoryBadge category={opinion.category} />
                  <p className="mt-2 text-gray-800">{opinion.text}</p>
                </div>
                <div className="flex items-center gap-2 text-green-600 font-semibold">
                  <ThumbsUp size={18} />
                  {opinion.votes}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mission Statement */}
      <div className="bg-gradient-to-br from-indigo-500 to-green-600 rounded-3xl p-8 shadow-xl text-white">
        <div className="flex items-start gap-6">
          <Shield size={48} className="flex-shrink-0" />
          <div>
            <h3 className="text-2xl font-bold mb-3">Анонимност с контрол</h3>
            <p className="text-indigo-100 leading-relaxed">
              StudVoice използва училищен имейл за регистрация, но името ти остава скрито публично. 
              Можеш да споделяш честно, докато модерация от избрани ученици поддържа уважителна среда.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, value, label, color }) {
  const colorClasses = {
    indigo: "from-indigo-50 to-indigo-100 border-indigo-200",
    green: "from-green-50 to-green-100 border-green-200",
    yellow: "from-yellow-50 to-yellow-100 border-yellow-200"
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105`}>
      <div className="mb-3">{icon}</div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-sm text-gray-600 font-medium">{label}</div>
    </div>
  );
}

function FeedPage({ opinions, filter, setFilter, searchQuery, setSearchQuery, sortBy, setSortBy, onVote, userVotes }) {
  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Търси мнения..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Filter */}
          <div className="flex items-center gap-3">
            <Filter size={20} className="text-indigo-500" />
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none bg-white font-medium"
            >
              <option>Всички</option>
              <option>Идея</option>
              <option>Предложение</option>
              <option>Проблем</option>
            </select>
          </div>

          {/* Sort */}
          <div className="flex gap-2 bg-gray-100 rounded-xl p-1">
            <button 
              onClick={() => setSortBy("recent")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                sortBy === "recent" 
                  ? "bg-white text-indigo-600 shadow-md" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Нови
            </button>
            <button 
              onClick={() => setSortBy("popular")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                sortBy === "popular" 
                  ? "bg-white text-indigo-600 shadow-md" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Популярни
            </button>
          </div>
        </div>
      </div>

      {/* Opinions List */}
      <div className="space-y-4">
        {opinions.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
            <MessageSquare size={64} className="mx-auto mb-4 text-gray-300" />
            <p className="text-xl text-gray-500">Няма намерени мнения.</p>
          </div>
        ) : (
          opinions.map(opinion => (
            <OpinionCard 
              key={opinion.id}
              opinion={opinion}
              onVote={onVote}
              hasVoted={userVotes.has(opinion.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function CategoryBadge({ category }) {
  const styles = {
    "Идея": {
      bg: "from-yellow-400 to-orange-400",
      icon: <Lightbulb size={14} />
    },
    "Предложение": {
      bg: "from-indigo-400 to-purple-400",
      icon: <MessageSquare size={14} />
    },
    "Проблем": {
      bg: "from-red-400 to-pink-400",
      icon: <AlertCircle size={14} />
    }
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${styles[category].bg} shadow-md`}>
      {styles[category].icon}
      {category}
    </span>
  );
}

function OpinionCard({ opinion, onVote, hasVoted }) {
  const timeAgo = (timestamp) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return "току-що";
    if (seconds < 3600) return `преди ${Math.floor(seconds / 60)} мин`;
    if (seconds < 86400) return `преди ${Math.floor(seconds / 3600)} ч`;
    return `преди ${Math.floor(seconds / 86400)} дни`;
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100">
      <div className="flex gap-4">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3 flex-wrap">
            <CategoryBadge category={opinion.category} />
            {opinion.anonymous ? (
              <span className="flex items-center gap-1.5 text-sm text-gray-500">
                <EyeOff size={14} />
                Анонимен ученик
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-sm text-gray-500">
                <Eye size={14} />
                {opinion.authorName} • {opinion.class || opinion.school}
              </span>
            )}
            <span className="text-sm text-gray-400">• {timeAgo(opinion.timestamp)}</span>
          </div>
          
          <p className="text-gray-800 leading-relaxed text-lg">{opinion.text}</p>
        </div>

        <div className="flex flex-col items-center gap-2">
          <button 
            onClick={() => onVote(opinion.id)}
            className={`p-4 rounded-2xl transition-all ${
              hasVoted 
                ? "bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg scale-110" 
                : "border-2 border-gray-300 hover:border-green-500 hover:bg-green-50 text-gray-600"
            }`}
          >
            <ThumbsUp size={24} />
          </button>
          <span className={`text-lg font-bold ${hasVoted ? "text-green-600" : "text-gray-500"}`}>
            {opinion.votes}
          </span>
        </div>
      </div>
    </div>
  );
}

function AddOpinionPage({ onPublish, onCancel }) {
  const [text, setText] = useState("");
  const [category, setCategory] = useState("Идея");
  const [school, setSchool] = useState("125 СУ");
  const [classRoom, setClassRoom] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [anonymous, setAnonymous] = useState(false);

  const handleSubmit = () => {
    onPublish({ 
      text, 
      category, 
      school, 
      class: classRoom,
      authorName,
      anonymous 
    });
  };

  const charCount = text.length;
  const maxChars = 500;

  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
      <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-green-600 bg-clip-text text-transparent">
        Сподели своето мнение
      </h2>
      <p className="text-gray-600 mb-8">Твоят глас има значение. Бъди конструктивен и уважителен.</p>

      <div className="space-y-6">
        {/* Main Text */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Твоето мнение *
          </label>
          <textarea 
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Какво искаш да промениш или подобриш в училището?"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none resize-none transition-colors"
            rows="6"
            maxLength={maxChars}
          />
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className={`font-medium ${charCount > maxChars * 0.9 ? "text-orange-500" : "text-gray-500"}`}>
              {charCount} / {maxChars} символа
            </span>
            {charCount < 10 && charCount > 0 && (
              <span className="text-red-500">Минимум 10 символа</span>
            )}
          </div>
        </div>

        {/* Category & Class */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Категория *
            </label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none bg-white font-medium"
            >
              <option>Идея</option>
              <option>Предложение</option>
              <option>Проблем</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Училище
            </label>
            <input 
              type="text"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              placeholder="напр. 125 СУ"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Клас
            </label>
            <input 
              type="text"
              value={classRoom}
              onChange={(e) => setClassRoom(e.target.value)}
              placeholder="напр. 10Б"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Anonymous Toggle */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50 to-green-50 border-2 border-indigo-200">
          <label className="flex items-start gap-4 cursor-pointer">
            <input 
              type="checkbox"
              checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
              className="mt-1 w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex-1">
              <div className="font-semibold text-gray-900 flex items-center gap-2">
                <EyeOff size={18} />
                Публикувай анонимно
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Името ти няма да се показва публично, но администраторите ще могат да те идентифицират при нарушение.
              </div>
            </div>
          </label>
        </div>

        {/* Author Name (if not anonymous) */