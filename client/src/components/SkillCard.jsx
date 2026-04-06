const categoryIcons = {
  Programming: '💻',
  Design: '🎨',
  Music: '🎵',
  Language: '🌐',
  Cooking: '🍳',
  Fitness: '💪',
  Writing: '✍️',
  Other: '✨',
};

export default function SkillCard({ skill }) {
  const isOffer = skill.type === 'offer';
  const icon = categoryIcons[skill.category] || '✨';

  return (
    <div
      className={`rounded-xl p-3 border flex items-start gap-3 ${
        isOffer
          ? 'bg-emerald-50 border-emerald-200'
          : 'bg-sky-50 border-sky-200'
      }`}
    >
      <span className="text-xl shrink-0 mt-0.5">{icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-sm text-slate-800 truncate">{skill.title}</span>
          <span className={isOffer ? 'badge-offer' : 'badge-want'}>
            {isOffer ? '↑ Offers' : '↓ Wants'}
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">{skill.category}</p>
        {skill.description && (
          <p className="text-xs text-slate-600 mt-1 line-clamp-2">{skill.description}</p>
        )}
      </div>
    </div>
  );
}
