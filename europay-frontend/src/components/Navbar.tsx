import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-indigo-700 text-white shadow-md">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/dashboard" className="text-xl font-bold tracking-tight">
          EuroPay
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="text-sm hover:text-indigo-200 transition-colors">
            Comptes
          </Link>
          <Link to="/transactions" className="text-sm hover:text-indigo-200 transition-colors">
            Transactions
          </Link>
          <button
            onClick={handleLogout}
            className="text-sm bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded-md transition-colors"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </nav>
  )
}
