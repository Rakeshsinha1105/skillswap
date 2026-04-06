import { Link } from 'react-router-dom';

const features = [
  {
    icon: '🎯',
    title: 'Find Your Match',
    desc: 'Browse thousands of skills offered by real people in your area and around the world.',
  },
  {
    icon: '🤝',
    title: 'Propose a Swap',
    desc: 'Send a swap request — offer what you know, get what you need. No money involved.',
  },
  {
    icon: '⭐',
    title: 'Build Reputation',
    desc: 'Leave reviews after each swap to build trust and grow your skill network.',
  },
];

const steps = [
  { number: '01', title: 'Create your profile', desc: 'List the skills you offer and what you want to learn.' },
  { number: '02', title: 'Browse & connect', desc: 'Find someone who offers what you need and wants what you have.' },
  { number: '03', title: 'Swap & grow', desc: 'Meet up or connect online, exchange knowledge, leave a review.' },
];

const avatarColors = [
  'from-violet-500 to-indigo-500',
  'from-emerald-500 to-teal-500',
  'from-orange-500 to-rose-500',
  'from-sky-500 to-blue-500',
];

const testimonials = [
  { name: 'Priya S.', skill: 'Taught Python, learned Guitar', color: avatarColors[0] },
  { name: 'Arjun M.', skill: 'Traded UI Design for Spanish', color: avatarColors[1] },
  { name: 'Sara K.', skill: 'Swapped Yoga for Web Dev', color: avatarColors[2] },
];

export default function Home() {
  return (
    <div className="-mt-8">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-700 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-400/20 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 py-24 text-center relative">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-1.5 rounded-full text-sm font-medium mb-8 border border-white/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Free to use · No credit card required
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6 tracking-tight">
            Trade Skills,
            <br />
            <span className="text-violet-200">Not Money</span>
          </h1>
          <p className="text-lg md:text-xl text-indigo-100 max-w-2xl mx-auto mb-10 leading-relaxed">
            SkillSwap connects people who want to exchange what they know.
            Teach what you're great at, learn what you've always wanted.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/browse"
              className="bg-white text-violet-700 font-bold px-8 py-4 rounded-xl hover:bg-violet-50 transition shadow-lg hover:shadow-xl"
            >
              Browse Skills →
            </Link>
            <Link
              to="/register"
              className="bg-white/10 backdrop-blur border border-white/30 text-white font-bold px-8 py-4 rounded-xl hover:bg-white/20 transition"
            >
              Join for Free
            </Link>
          </div>

          {/* Floating avatars */}
          <div className="flex justify-center gap-2 mt-12 items-center">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} border-2 border-white flex items-center justify-center text-sm font-bold text-white`}
              >
                {t.name[0]}
              </div>
            ))}
            <span className="ml-3 text-sm text-indigo-200">
              <strong className="text-white">2,400+</strong> swaps completed
            </span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-3">Why SkillSwap?</h2>
        <p className="text-slate-500 text-center mb-12">Exchange value directly — no platforms fees, no middlemen.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="card p-6 group hover:-translate-y-1 transition-transform">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-3">How it works</h2>
          <p className="text-slate-400 text-center mb-14">Three simple steps to your first swap.</p>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s) => (
              <div key={s.number} className="relative">
                <div className="text-6xl font-black text-white/5 absolute -top-4 left-0">{s.number}</div>
                <div className="relative pl-4 border-l-2 border-violet-500">
                  <p className="text-violet-400 text-xs font-bold uppercase tracking-widest mb-2">{s.number}</p>
                  <h3 className="font-bold text-lg mb-2">{s.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-14 text-white shadow-xl">
          <h2 className="text-3xl font-bold mb-4">Ready to start swapping?</h2>
          <p className="text-indigo-200 mb-8 max-w-lg mx-auto">
            Join thousands of learners and teachers who are already exchanging skills every day.
          </p>
          <Link
            to="/register"
            className="inline-block bg-white text-violet-700 font-bold px-10 py-4 rounded-xl hover:bg-violet-50 transition shadow-lg"
          >
            Create Free Account
          </Link>
        </div>
      </section>
    </div>
  );
}
