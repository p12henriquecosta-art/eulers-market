import { Outlet, Link, useNavigate } from 'react-router-dom';
import { User, signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { LayoutGrid, LogIn, LogOut, User as UserIcon, ShieldCheck, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface ShellProps {
  user: User | null;
}

export default function Shell({ user }: ShellProps) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-10">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/20">
                  Σ
                </div>
                <span className="text-xl font-bold text-slate-900 tracking-tight">Euler's Market</span>
              </Link>

              <nav className="hidden md:flex items-center gap-8">
                <Link to="/" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Market</Link>
                <Link to="/beta" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Beta</Link>
                {user && (
                    <Link to="/admin" className="text-sm font-semibold text-slate-600 flex items-center gap-1.5 hover:text-indigo-600 transition-colors">
                        <ShieldCheck size={16} /> Admin
                    </Link>
                )}
              </nav>
            </div>

            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-100 border border-slate-200 rounded-full">
                    <UserIcon size={14} className="text-slate-500" />
                    <span className="text-xs font-medium text-slate-700 truncate max-w-[120px]">{user.email}</span>
                  </div>
                  <button 
                    onClick={handleSignOut}
                    className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all rounded-xl border border-transparent hover:border-red-100"
                    title="Logout"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <Link 
                  to="/login"
                  className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
                >
                  <LogIn size={16} /> Beta Login
                </Link>
              )}
            </div>

            <button className="md:hidden p-2 text-slate-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={window.location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-16 px-4 text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-500 rounded flex items-center justify-center text-white font-bold text-sm">Σ</div>
              <h4 className="text-xl font-bold tracking-tight">Euler's Market</h4>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              Next-generation digital marketplace for premium subscription products. Managed with precision.
            </p>
          </div>
          <div className="col-span-2 hidden md:block"></div>
          <div className="flex flex-col gap-3">
            <h5 className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-2">Compliance & Support</h5>
            <div className="space-y-2">
              <a href="mailto:support@euler.life" className="text-sm text-slate-300 hover:text-indigo-400 block transition-colors underline decoration-slate-700 underline-offset-4">support@euler.life</a>
              <a href="mailto:sales@euler.life" className="text-sm text-slate-300 hover:text-indigo-400 block transition-colors underline decoration-slate-700 underline-offset-4">sales@euler.life</a>
              <span className="text-[11px] text-slate-500 font-medium bg-slate-800/50 px-2 py-1 rounded inline-block">GDPR & CCPA COMPLIANT</span>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-slate-500 font-medium">© 2026 EULER LABS. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8 text-xs font-semibold text-slate-400">
            <Link to="/privacy" className="hover:text-indigo-400 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-indigo-400 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
