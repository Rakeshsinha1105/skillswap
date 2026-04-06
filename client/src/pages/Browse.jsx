import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { browseUsers } from '../api';
import SkillCard from '../components/SkillCard';

const CATEGORIES = ['Programming', 'Design', 'Music', 'Language', 'Cooking', 'Fitness', 'Writing', 'Other'];

const gradients = [
  'from-violet-500 to-indigo-500',
  'from-emerald-500 to-teal-500',
  'from-orange-500 to-rose-500',
  'from-sky-500 to-blue-500',
  'from-pink-500 to-rose-500',
  'from-amber-500 to-orange-500',
];

function getGradient(name) {
  const idx = name.charCodeAt(0) % gradients.length;
  return gradients[idx];
}

export default function Browse() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    browseUsers({ search: search || undefined, category: category || undefined, type: type || undefined })
      .then((r) => setUsers(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, category, type]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Browse Skills</h1>
        <p className="text-slate-500">Discover people to swap skills with.</p>
      </div>

      {/* Search + Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-8 flex flex-wrap gap-3 shadow-sm">
        <div className="relative flex-1 min-w-56">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base">🔍</span>
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-9"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="input w-auto min-w-40"
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="input w-auto min-w-40"
        >
          <option value="">Offers & Wants</option>
          <option value="offer">Offers only</option>
          <option value="want">Wants only</option>
        </select>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 flex-wrap mb-8">
        <button
          onClick={() => setCategory('')}
          className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
            category === '' ? 'bg-violet-600 text-white border-violet-600' : 'bg-white text-slate-600 border-slate-200 hover:border-violet-400'
          }`}
        >
          All
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c === category ? '' : c)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
              category === c ? 'bg-violet-600 text-white border-violet-600' : 'bg-white text-slate-600 border-slate-200 hover:border-violet-400'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Results */}
      {loading ? (
        <div className="text-center py-20 text-slate-400">Loading...</div>
      ) : users.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-slate-500 font-medium">No users found. Try a different filter.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => (
            <Link
              key={user.id}
              to={`/profile/${user.id}`}
              className="card p-5 flex flex-col gap-4 hover:-translate-y-0.5 transition-transform"
            >
              {/* User header */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getGradient(user.name)} flex items-center justify-center font-bold text-white text-lg shrink-0`}
                >
                  {user.name[0].toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-800 truncate">{user.name}</p>
                  {user.location && (
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      📍 {user.location}
                    </p>
                  )}
                </div>
              </div>

              {/* Skills */}
              <div className="flex flex-col gap-2">
                {user.skills.slice(0, 3).map((s) => <SkillCard key={s.id} skill={s} />)}
                {user.skills.length > 3 && (
                  <p className="text-xs text-slate-400 text-center">
                    +{user.skills.length - 3} more skills
                  </p>
                )}
                {user.skills.length === 0 && (
                  <p className="text-xs text-slate-400 italic">No skills listed yet</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
