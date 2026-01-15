import { Search, Plus, User, Menu, X, LayoutDashboard, Compass, Settings, LogOut } from "lucide-react";
import { usePrompts } from "../features/prompts/PromptContext";
import { useAuth } from "../features/auth/useAuth";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { searchQuery, setSearchQuery, setIsAddOpen } = usePrompts();
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Compass, label: "Explore", path: "/explore" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <Link to="/dashboard" className="md:hidden text-sm font-semibold tracking-tighter">PV</Link>
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            <input
              type="text"
              placeholder="Quick search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-gray-50/50 rounded-full text-sm outline-none focus:bg-white focus:ring-1 focus:ring-gray-200 transition-all font-medium placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-all active:scale-[0.98] shadow-lg shadow-black/5"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">New Prompt</span>
          </button>

          <div className="h-8 w-[1px] bg-gray-100 mx-2 hidden md:block"></div>

          <div className="hidden md:flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 uppercase font-semibold text-xs tracking-tighter overflow-hidden">
              {user?.email?.[0] || <User size={18} />}
            </div>
          </div>

          <button
            className="md:hidden p-2 text-gray-500"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden border-t border-gray-100 bg-white p-6 absolute w-full left-0 shadow-2xl"
          >
            <div className="flex flex-col gap-2">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${isActive ? "bg-black text-white" : "text-gray-500 hover:bg-gray-50"
                      }`}
                  >
                    <Icon size={20} />
                    <span className="font-semibold tracking-tight">{item.label}</span>
                  </Link>
                );
              })}
              <button
                onClick={handleLogout}
                className="flex items-center gap-4 px-6 py-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all font-semibold tracking-tight mt-4 border-t border-gray-50 pt-6"
              >
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}