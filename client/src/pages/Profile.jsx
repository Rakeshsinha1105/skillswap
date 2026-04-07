import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getUser, createSkill, deleteSkill, respondToRequest, getMyRequests, getUserReviews } from '../api';
import SkillCard from '../components/SkillCard';
import SwapModal from '../components/SwapModal';
import ReviewModal from '../components/ReviewModal';

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
  const idx = (name || 'A').charCodeAt(0) % gradients.length;
  return gradients[idx];
}

export default function Profile() {
  const { id } = useParams();
  const myId = Number(localStorage.getItem('userId'));
  const isOwner = myId === Number(id);

  const [user, setUser] = useState(null);
  const [swapTarget, setSwapTarget] = useState(null);
  const [swapRequests, setSwapRequests] = useState([]);
  const [reviewTarget, setReviewTarget] = useState(null); // { swap, revieweeId, revieweeName }
  const [reviewedSwapIds, setReviewedSwapIds] = useState([]);
  const [newSkill, setNewSkill] = useState({ title: '', category: '', type: 'offer', description: '' });
  const [showSkillForm, setShowSkillForm] = useState(false);
  const [activeTab, setActiveTab] = useState('skills');

  function loadUser() {
    getUser(id).then((r) => setUser(r.data)).catch(() => {});
  }

  useEffect(() => {
    loadUser();
    if (isOwner) {
      getMyRequests().then((r) => setSwapRequests(r.data)).catch(() => {});
      getUserReviews(myId).then((r) => setReviewedSwapIds(r.data.map((rev) => rev.swapId))).catch(() => {});
    }
  }, [id]);

  async function handleAddSkill(e) {
    e.preventDefault();
    try {
      await createSkill(newSkill);
      setNewSkill({ title: '', category: '', type: 'offer', description: '' });
      setShowSkillForm(false);
      loadUser();
    } catch {}
  }

  async function handleDeleteSkill(skillId) {
    await deleteSkill(skillId);
    loadUser();
  }

  async function handleRespondToSwap(swapId, status) {
    await respondToRequest(swapId, status);
    getMyRequests().then((r) => setSwapRequests(r.data)).catch(() => {});
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-slate-400 text-center">
          <div className="text-4xl mb-3">⏳</div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  const pending = swapRequests.filter((r) => r.status === 'pending' && r.receiverId === myId);
  const accepted = swapRequests.filter((r) => r.status === 'accepted');
  const offerSkills = user.skills.filter((s) => s.type === 'offer');
  const wantSkills = user.skills.filter((s) => s.type === 'want');

  const tabs = [
    { key: 'skills', label: `Skills (${user.skills.length})` },
    ...(isOwner ? [{ key: 'requests', label: `Requests${pending.length > 0 ? ` (${pending.length})` : ''}` }] : []),
    ...(isOwner ? [{ key: 'accepted', label: `Accepted${accepted.length > 0 ? ` (${accepted.length})` : ''}` }] : []),
    { key: 'reviews', label: `Reviews (${user.reviewsReceived?.length || 0})` },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Profile header card */}
      <div className="card overflow-hidden mb-6">
        {/* Banner */}
        <div className={`h-28 bg-gradient-to-r ${getGradient(user.name)}`} />

        <div className="px-6 pb-6">
          {/* Avatar */}
          <div className="flex items-end justify-between -mt-10 mb-4">
            <div
              className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${getGradient(user.name)} border-4 border-white flex items-center justify-center text-3xl font-black text-white shadow-lg`}
            >
              {user.name[0].toUpperCase()}
            </div>
            {isOwner && (
              <button className="text-xs px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition font-medium">
                Edit Profile
              </button>
            )}
          </div>

          <h1 className="text-2xl font-bold text-slate-800">{user.name}</h1>
          {user.location && (
            <p className="text-sm text-slate-400 flex items-center gap-1 mt-0.5">
              📍 {user.location}
            </p>
          )}
          {user.bio && <p className="text-sm text-slate-600 mt-3 leading-relaxed">{user.bio}</p>}

          {/* Stats */}
          <div className="flex gap-6 mt-4 pt-4 border-t border-slate-100">
            <div className="text-center">
              <p className="text-lg font-bold text-slate-800">{offerSkills.length}</p>
              <p className="text-xs text-slate-400">Offering</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-slate-800">{wantSkills.length}</p>
              <p className="text-xs text-slate-400">Wanting</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-slate-800">{user.reviewsReceived?.length || 0}</p>
              <p className="text-xs text-slate-400">Reviews</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-6">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition ${
              activeTab === t.key
                ? 'bg-white text-violet-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab: Skills */}
      {activeTab === 'skills' && (
        <div>
          {isOwner && (
            <div className="mb-4">
              <button
                onClick={() => setShowSkillForm(!showSkillForm)}
                className="btn-primary !py-2 !px-4 !text-sm"
              >
                {showSkillForm ? '✕ Cancel' : '+ Add Skill'}
              </button>
            </div>
          )}

          {showSkillForm && (
            <form onSubmit={handleAddSkill} className="card p-5 mb-5 space-y-3">
              <h3 className="font-semibold text-slate-700">New Skill</h3>
              <input
                type="text"
                placeholder="Skill title (e.g. React, Piano, Spanish)"
                value={newSkill.title}
                onChange={(e) => setNewSkill({ ...newSkill, title: e.target.value })}
                required
                className="input"
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={newSkill.category}
                  onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                  required
                  className="input"
                >
                  <option value="">Category</option>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
                <select
                  value={newSkill.type}
                  onChange={(e) => setNewSkill({ ...newSkill, type: e.target.value })}
                  className="input"
                >
                  <option value="offer">I offer this</option>
                  <option value="want">I want to learn</option>
                </select>
              </div>
              <textarea
                placeholder="Short description (optional)"
                value={newSkill.description}
                onChange={(e) => setNewSkill({ ...newSkill, description: e.target.value })}
                className="input resize-none"
                rows={2}
              />
              <button type="submit" className="btn-primary w-full text-center">
                Add Skill
              </button>
            </form>
          )}

          {user.skills.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p className="text-4xl mb-3">🎯</p>
              <p>No skills listed yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {offerSkills.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2 flex items-center gap-1">
                    ↑ Offering
                  </p>
                  <div className="space-y-2">
                    {offerSkills.map((skill) => (
                      <div key={skill.id} className="flex items-start gap-2">
                        <div className="flex-1"><SkillCard skill={skill} /></div>
                        {!isOwner ? (
                          <button
                            onClick={() => setSwapTarget({ targetUser: user, targetSkill: skill })}
                            className="shrink-0 mt-1 text-xs px-3 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition font-medium"
                          >
                            Swap
                          </button>
                        ) : (
                          <button
                            onClick={() => handleDeleteSkill(skill.id)}
                            className="shrink-0 mt-1 text-xs px-3 py-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {wantSkills.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-bold text-sky-600 uppercase tracking-widest mb-2">
                    ↓ Wanting to Learn
                  </p>
                  <div className="space-y-2">
                    {wantSkills.map((skill) => (
                      <div key={skill.id} className="flex items-start gap-2">
                        <div className="flex-1"><SkillCard skill={skill} /></div>
                        {isOwner && (
                          <button
                            onClick={() => handleDeleteSkill(skill.id)}
                            className="shrink-0 mt-1 text-xs px-3 py-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab: Requests */}
      {activeTab === 'requests' && isOwner && (
        <div>
          {pending.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p className="text-4xl mb-3">📭</p>
              <p>No pending swap requests.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pending.map((req) => (
                <div key={req.id} className="card p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-800">{req.sender.name}</p>
                      <p className="text-sm text-slate-500 mt-1">
                        Offers <span className="font-medium text-emerald-600">{req.offeredSkill.title}</span>{' '}
                        in exchange for your{' '}
                        <span className="font-medium text-violet-600">{req.wantedSkill.title}</span>
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => handleRespondToSwap(req.id, 'accepted')}
                        className="text-xs px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleRespondToSwap(req.id, 'rejected')}
                        className="text-xs px-3 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition font-medium"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Accepted Swaps */}
      {activeTab === 'accepted' && isOwner && (
        <div>
          {accepted.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p className="text-4xl mb-3">🤝</p>
              <p>No accepted swaps yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {accepted.map((req) => {
                const otherUser = req.senderId === myId ? req.receiver : req.sender;
                return (
                  <div key={req.id} className="card p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getGradient(otherUser.name)} flex items-center justify-center font-bold text-white`}>
                        {otherUser.name[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{otherUser.name}</p>
                        <p className="text-xs text-slate-500">
                          {req.offeredSkill.title} ↔ {req.wantedSkill.title}
                        </p>
                      </div>
                      <span className="ml-auto text-xs font-semibold px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">
                        Accepted
                      </span>
                    </div>
                    <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-4 py-3 flex items-center gap-3 mb-3">
                      <span className="text-indigo-500 text-lg">✉</span>
                      <div>
                        <p className="text-xs text-indigo-500 font-medium">Contact via email</p>
                        <a
                          href={`mailto:${otherUser.email}`}
                          className="text-sm font-semibold text-indigo-700 hover:underline"
                        >
                          {otherUser.email}
                        </a>
                      </div>
                    </div>
                    {reviewedSwapIds.includes(req.id) ? (
                      <p className="text-xs text-emerald-600 font-medium">✓ You have reviewed this swap</p>
                    ) : (
                      <button
                        onClick={() => setReviewTarget({ swap: req, revieweeId: otherUser.id, revieweeName: otherUser.name })}
                        className="w-full py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold rounded-xl hover:from-amber-600 hover:to-orange-600 transition"
                      >
                        Leave a Review
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab: Reviews */}
      {activeTab === 'reviews' && (
        <div>
          {!user.reviewsReceived?.length ? (
            <div className="text-center py-12 text-slate-400">
              <p className="text-4xl mb-3">⭐</p>
              <p>No reviews yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {user.reviewsReceived.map((review) => (
                <div key={review.id} className="card p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`w-9 h-9 rounded-xl bg-gradient-to-br ${getGradient(review.reviewer.name)} flex items-center justify-center font-bold text-white text-sm`}
                    >
                      {review.reviewer.name[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-slate-800">{review.reviewer.name}</p>
                      <p className="text-yellow-500 text-sm leading-none">
                        {'★'.repeat(review.rating)}
                        <span className="text-slate-200">{'★'.repeat(5 - review.rating)}</span>
                      </p>
                    </div>
                  </div>
                  {review.comment && <p className="text-sm text-slate-600 leading-relaxed">{review.comment}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Swap Modal */}
      {swapTarget && (
        <SwapModal
          targetUser={swapTarget.targetUser}
          targetSkill={swapTarget.targetSkill}
          onClose={() => setSwapTarget(null)}
        />
      )}

      {/* Review Modal */}
      {reviewTarget && (
        <ReviewModal
          swap={reviewTarget.swap}
          revieweeId={reviewTarget.revieweeId}
          revieweeName={reviewTarget.revieweeName}
          onClose={() => setReviewTarget(null)}
          onDone={() => {
            setReviewedSwapIds((prev) => [...prev, reviewTarget.swap.id]);
            setReviewTarget(null);
          }}
        />
      )}
    </div>
  );
}
