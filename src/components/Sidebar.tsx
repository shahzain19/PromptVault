import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Compass,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useAuth } from "../features/auth/useAuth";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Sidebar() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

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
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      className="hidden md:flex flex-col bg-white border-r border-gray-100 h-screen sticky top-0 transition-all duration-500 ease-[0.2,0,0,1]"
    >
      <div className="p-8 flex justify-between items-center">
        {!isCollapsed && (
          <Link to="/dashboard" className="text-sm font-semibold tracking-tighter">PROMPTVAULT</Link>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 hover:bg-gray-50 rounded-lg transition-colors text-gray-400 hover:text-black mx-auto"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-2 pt-8">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group ${isActive
                  ? "bg-black text-white shadow-lg shadow-black/5"
                  : "text-gray-400 hover:text-black hover:bg-gray-50"
                }`}
            >
              <Icon size={20} className={isActive ? "text-white" : "group-hover:text-black"} />
              {!isCollapsed && <span className="text-sm font-medium tracking-tight">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-4 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all group"
        >
          <LogOut size={20} className="group-hover:text-red-500" />
          {!isCollapsed && <span className="text-sm font-medium tracking-tight">Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
}
