import { NavLink, Link, useNavigate } from 'react-router-dom'
import { ArrowLeftRight, LogOut, ShieldCheck, Wallet, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Logo from './Logo'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  const navItems = isAdmin
    ? [{ to: '/admin', icon: ShieldCheck, label: 'Administration' }]
    : [
        { to: '/dashboard', icon: Wallet, label: 'Mes comptes' },
        { to: '/transactions', icon: ArrowLeftRight, label: 'Transactions' },
      ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside
      className={`fixed top-0 left-0 h-[100dvh] w-60 bg-white border-r border-slate-100 flex flex-col z-30 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
    >
      {/* Logo + close button on mobile */}
      <div className="px-5 py-5 border-b border-slate-100 flex items-center justify-between">
        <Link to="/" onClick={onClose}>
          <Logo size={26} />
        </Link>
        <button
          onClick={onClose}
          className="md:hidden p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all"
        >
          <X size={18} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[#0DAF87] text-white'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all"
        >
          <LogOut size={17} />
          Déconnexion
        </button>
      </div>
    </aside>
  )
}
