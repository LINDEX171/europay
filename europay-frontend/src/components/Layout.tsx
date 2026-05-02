import { ReactNode, useState } from 'react'
import { Menu } from 'lucide-react'
import Sidebar from './Sidebar'
import Logo from './Logo'

export default function Layout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-x-hidden">
      {/* Overlay mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-20 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <Sidebar isOpen={open} onClose={() => setOpen(false)} />

      <main className="flex-1 min-h-screen md:ml-60 overflow-x-hidden w-0 min-w-0">
        {/* Header mobile */}
        <div className="md:hidden flex items-center gap-3 px-4 py-4 bg-white border-b border-slate-100 sticky top-0 z-10">
          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded-xl hover:bg-slate-100 transition-all text-slate-600"
          >
            <Menu size={20} />
          </button>
          <Logo size={22} />
        </div>

        {children}
      </main>
    </div>
  )
}
