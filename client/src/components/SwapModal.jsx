import { useState, useEffect } from 'react';
import { getUserSkills, sendRequest } from '../api';

export default function SwapModal({ targetUser, targetSkill, onClose }) {
  const myId = Number(localStorage.getItem('userId'));
  const [mySkills, setMySkills] = useState([]);
  const [offeredSkillId, setOfferedSkillId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUserSkills(myId)
      .then((r) => setMySkills(r.data.filter((s) => s.type === 'offer')))
      .catch(() => {});
  }, [myId]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await sendRequest({
        receiverId: targetUser.id,
        offeredSkillId: Number(offeredSkillId),
        wantedSkillId: targetSkill.id,
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send request');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Propose a Swap</h2>
            <button onClick={onClose} className="text-white/70 hover:text-white text-2xl leading-none">
              ×
            </button>
          </div>
          <p className="text-indigo-200 text-sm mt-1">
            You want <strong className="text-white">{targetSkill.title}</strong> from{' '}
            <strong className="text-white">{targetUser.name}</strong>
          </p>
        </div>

        <div className="p-6">
          {success ? (
            <div className="text-center py-6">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Request Sent!</h3>
              <p className="text-slate-500 text-sm mb-6">
                {targetUser.name} will be notified. Check your profile for updates.
              </p>
              <button onClick={onClose} className="btn-primary w-full text-center">
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Offer one of your skills in return:
                </label>
                {mySkills.length === 0 ? (
                  <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-xl p-3">
                    You have no skills listed as "offer" yet. Add some to your profile first.
                  </div>
                ) : (
                  <select
                    value={offeredSkillId}
                    onChange={(e) => setOfferedSkillId(e.target.value)}
                    required
                    className="input"
                  >
                    <option value="">Select a skill you offer...</option>
                    {mySkills.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title} · {s.category}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || mySkills.length === 0}
                  className="flex-1 btn-primary text-center disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Send Request'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
