import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, Zap, ShieldCheck, BarChart3, Layers, ArrowRight } from 'lucide-react'
import Logo from '../components/Logo'

const features = [
  {
    icon: Zap,
    title: 'Virements instantanés',
    desc: "Transférez de l'argent entre vos comptes en temps réel grâce à notre architecture événementielle.",
  },
  {
    icon: Layers,
    title: 'Compte Courant & Livret A',
    desc: 'Gérez votre argent du quotidien et votre épargne réglementée depuis un seul endroit.',
  },
  {
    icon: ShieldCheck,
    title: 'Sécurité avancée',
    desc: 'Authentification JWT, chiffrement des données et audit immuable de chaque opération.',
  },
  {
    icon: BarChart3,
    title: 'Historique complet',
    desc: "Consultez toutes vos transactions avec leur statut en temps réel, de l'initiation à la validation.",
  },
]

const checks = [
  'Virements instantanés',
  'Audit DSP2 & RGPD',
  'Livret A réglementé',
  'Interface sécurisée',
]

const chipSvg = (
  <svg width="30" height="22" viewBox="0 0 40 30" fill="none">
    <rect width="40" height="30" rx="5" fill="#D4A843" opacity="0.9"/>
    <rect x="14" y="0" width="12" height="30" fill="#B8892A" opacity="0.4"/>
    <rect x="0" y="10" width="40" height="10" fill="#B8892A" opacity="0.4"/>
    <rect x="14" y="10" width="12" height="10" fill="#E8C060" opacity="0.6"/>
  </svg>
)

export default function Home() {
  const scrollEls = useRef<NodeListOf<Element> | null>(null)

  useEffect(() => {
    scrollEls.current = document.querySelectorAll('.scroll-anim')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 }
    )
    scrollEls.current.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-white font-['Inter',sans-serif]">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeRight {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-12px); }
        }

        .nav-anim   { animation: fadeDown 0.55s ease both; }
        .hero-1     { animation: fadeUp 0.65s ease both; animation-delay: 0.08s; }
        .hero-2     { animation: fadeUp 0.65s ease both; animation-delay: 0.22s; }
        .hero-3     { animation: fadeUp 0.65s ease both; animation-delay: 0.38s; }
        .hero-4     { animation: fadeUp 0.65s ease both; animation-delay: 0.52s; }
        .hero-cards { animation: fadeRight 0.75s ease both; animation-delay: 0.18s; }
        .card-float { animation: float 5s ease-in-out infinite; }

        .scroll-anim           { opacity: 0; transform: translateY(28px); }
        .scroll-anim.in-view   { animation: fadeUp 0.65s ease forwards; }
        .scroll-anim.d1.in-view { animation-delay: 0.08s; }
        .scroll-anim.d2.in-view { animation-delay: 0.18s; }
        .scroll-anim.d3.in-view { animation-delay: 0.28s; }
        .scroll-anim.d4.in-view { animation-delay: 0.38s; }

        .btn-glow:hover {
          box-shadow: 0 0 22px 4px rgba(13,175,135,0.28);
        }
        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px -8px rgba(13,175,135,0.15);
        }
        .feature-card { transition: transform 0.25s ease, box-shadow 0.25s ease; }
      `}</style>

      {/* Navbar */}
      <nav className="nav-anim flex items-center justify-between px-4 sm:px-10 py-4 sm:py-5 border-b border-gray-100">
        <Logo size={24} />
        <div className="hidden md:flex items-center gap-8 text-sm text-slate-500 font-medium">
          <a href="#features" className="hover:text-slate-900 transition-colors">Fonctionnalités</a>
          <a href="#security" className="hover:text-slate-900 transition-colors">Sécurité</a>
          <a href="#about" className="hover:text-slate-900 transition-colors">À propos</a>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link to="/login" className="text-sm font-semibold text-slate-700 hover:text-slate-900 px-3 sm:px-4 py-2 transition-colors">
            Connexion
          </Link>
          <Link to="/register" className="btn-glow text-sm font-semibold bg-[#0DAF87] hover:bg-[#0C9E79] text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl transition-all whitespace-nowrap">
            <span className="hidden sm:inline">Ouvrir un compte</span>
            <span className="sm:hidden">S'inscrire</span>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-10 pt-10 pb-16 sm:pt-20 sm:pb-24 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center overflow-visible">
        {/* Left */}
        <div>
          <h1 className="hero-1 text-3xl sm:text-5xl font-extrabold text-slate-900 leading-tight mb-4 sm:mb-6">
            La banque <br />commence ici.
          </h1>
          <p className="hero-2 text-slate-500 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8 max-w-md">
            EuroPay est une plateforme bancaire moderne, sécurisée et événementielle. Gérez vos comptes, effectuez vos virements et suivez vos finances en temps réel.
          </p>

          <div className="hero-3 grid grid-cols-2 gap-2 sm:gap-3 mb-8 sm:mb-10">
            {checks.map((c, i) => (
              <div
                key={c}
                className="flex items-center gap-2 text-sm text-slate-600"
                style={{ animationDelay: `${0.38 + i * 0.07}s` }}
              >
                <CheckCircle2 size={16} className="text-[#0DAF87] flex-shrink-0" />
                {c}
              </div>
            ))}
          </div>

          <div className="hero-4 flex items-center gap-3 sm:gap-4">
            <Link
              to="/register"
              className="btn-glow flex items-center gap-2 bg-[#0DAF87] hover:bg-[#0C9E79] text-white font-semibold px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl transition-all text-sm"
            >
              Ouvrir un compte
            </Link>
            <Link
              to="/login"
              className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              Se connecter <ArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* Right — cartes flottantes */}
        <div className="hero-cards flex justify-center lg:justify-center mt-6 lg:mt-0 overflow-visible py-6">
          <div className="card-float relative overflow-visible" style={{ width: 340, height: 310 }}>

            {/* Carte Livret A — derrière */}
            <div
              className="absolute bg-gradient-to-br from-[#0DAF87] to-[#07896a] rounded-2xl p-4 text-white overflow-hidden shadow-xl"
              style={{ width: 280, aspectRatio: '1.5 / 1', top: 32, left: 50, transform: 'rotate(7deg)', zIndex: 1 }}
            >
              <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10" />
              <div className="absolute -bottom-10 -left-6 w-44 h-44 rounded-full bg-white/10" />
              <div className="relative h-full flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white/80">Livret A</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/20 text-white">ACTIVE</span>
                </div>
                <div>{chipSvg}</div>
                <div>
                  <p className="text-[9px] text-white/50 uppercase tracking-widest mb-0.5">Solde</p>
                  <p className="text-xl font-bold tracking-tight">4 920,00 €</p>
                </div>
                <div>
                  <p className="text-[9px] text-white/50 uppercase tracking-widest mb-0.5">Titulaire</p>
                  <p className="text-xs font-semibold text-white/90 uppercase tracking-wide">Jean Dupont</p>
                </div>
                <p className="text-xs font-mono tracking-[0.14em] text-white/70">FR76  ••••  ••••  ••••  9012</p>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[9px] text-white/45 uppercase tracking-widest mb-0.5">Expiration</p>
                    <p className="text-xs font-bold font-mono">07/27</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <p className="text-xs font-bold tracking-widest text-white/60">EUROPAY</p>
                    <div className="flex items-center">
                      <div className="w-5 h-5 rounded-full bg-white/25" />
                      <div className="w-5 h-5 rounded-full bg-white/35 -ml-2.5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Carte Compte Courant — devant */}
            <div
              className="absolute bg-gradient-to-br from-[#0D1B2A] to-[#1B3055] rounded-2xl p-4 text-white shadow-2xl overflow-hidden"
              style={{ width: 280, aspectRatio: '1.5 / 1', top: 0, left: 0, transform: 'rotate(-3deg)', zIndex: 2 }}
            >
              <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5" />
              <div className="absolute -bottom-12 -left-6 w-48 h-48 rounded-full bg-white/5" />
              <div className="relative h-full flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white/70">Compte Courant</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100/90 text-emerald-700">ACTIVE</span>
                </div>
                <div>{chipSvg}</div>
                <div>
                  <p className="text-[9px] text-white/45 uppercase tracking-widest mb-0.5">Solde disponible</p>
                  <p className="text-xl font-bold tracking-tight">4 658,50 €</p>
                </div>
                <div>
                  <p className="text-[9px] text-white/40 uppercase tracking-widest mb-0.5">Titulaire</p>
                  <p className="text-xs font-semibold tracking-wide text-white/85 uppercase">Jean Dupont</p>
                </div>
                <p className="text-xs font-mono tracking-[0.14em] text-white/70">FR76  ••••  ••••  ••••  5678</p>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[9px] text-white/40 uppercase tracking-widest mb-0.5">Expiration</p>
                    <p className="text-xs font-bold font-mono">04/28</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <p className="text-xs font-bold tracking-widest text-white/60">EUROPAY</p>
                    <div className="flex items-center">
                      <div className="w-5 h-5 rounded-full bg-white/20" />
                      <div className="w-5 h-5 rounded-full bg-white/30 -ml-2.5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-[#F0FDF9] py-14 sm:py-24 px-4 sm:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="scroll-anim mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight mb-3 sm:mb-4">
              Une app.<br />Une banque.
            </h2>
            <p className="text-slate-500 text-base sm:text-lg max-w-md">
              Tout ce dont vous avez besoin pour gérer vos finances au quotidien.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <div
                key={title}
                className={`scroll-anim d${i + 1} feature-card bg-white rounded-2xl p-5 sm:p-6 border border-slate-100`}
              >
                <div className="w-10 h-10 rounded-xl bg-[#E6FAF5] flex items-center justify-center mb-4">
                  <Icon size={18} className="text-[#0DAF87]" />
                </div>
                <p className="font-semibold text-slate-900 mb-2">{title}</p>
                <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="about" className="py-14 sm:py-24 px-4 sm:px-10">
        <div className="scroll-anim max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mb-3 sm:mb-4">
            Prêt à commencer ?
          </h2>
          <p className="text-slate-500 text-base sm:text-lg mb-8 sm:mb-10">
            Créez votre compte gratuitement et accédez à votre espace bancaire en quelques secondes.
          </p>
          <Link
            to="/register"
            className="btn-glow inline-flex items-center gap-2 bg-[#0DAF87] hover:bg-[#0C9E79] text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-xl transition-all text-sm"
          >
            Ouvrir un compte <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 px-4 sm:px-10 py-5 sm:py-6 flex items-center justify-between text-xs text-slate-400 gap-4">
        <Logo size={20} />
        <span className="text-right">© 2026 EuroPay - Système bancaire fictif</span>
      </footer>
    </div>
  )
}
