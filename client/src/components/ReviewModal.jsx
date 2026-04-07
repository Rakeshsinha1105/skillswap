import { useState } from 'react';
import { createReview } from '../api';

export default function ReviewModal({ swap, revieweeId, revieweeName, onClose, onDone }) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (rating === 0) return setError('Please select a rating');
    setLoading(true);
    setError('');
    try {
      await createReview({ swapId: swap.id, revieweeId, rating, comment });
      onDone();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Leave a Review</h2>
            <button onClick={onClose} className="text-white/70 hover:text-white text-2xl leading-none">×</button>
          </div>
          <p className="text-amber-100 text-sm mt-1">How was your swap with <strong className="text-white">{revieweeName}</strong>?</p>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Star rating */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    className="text-3xl transition-transform hover:scale-110"
                  >
                    <span className={(hovered || rating) >= star ? 'text-amber-400' : 'text-slate-200'}>
                      ★
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Comment (optional)</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience..."
                className="input resize-none"
                rows={3}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button type="button" onClick={onClose} className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold py-3 rounded-xl hover:from-amber-600 hover:to-orange-600 transition disabled:opacity-60">
                {loading ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
