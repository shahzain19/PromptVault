import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Compass,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Folder,
  Layers,
  Star,
  MessageSquare,
  Cpu
} from "lucide-react";
import { useAuth } from "../features/auth/useAuth";
import { usePrompts } from "../features/prompts/PromptContext";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Sidebar() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { folders, collections, setFilterType, setSelectedFolderId } = usePrompts();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard", type: 'all' },
    { icon: Star, label: "Favorites", path: "/dashboard", type: 'favorites' },
    { icon: Compass, label: "Explore", path: "/explore", type: 'explore' },
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
          const isActive = location.pathname === item.path && (item.type === 'explore' || (item.type === 'all' && location.pathname === '/dashboard'));
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={() => {
                if (item.type === 'favorites') setFilterType('favorites');
                else if (item.type === 'all') { setFilterType('all'); setSelectedFolderId(null); }
                navigate(item.path);
              }}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group ${isActive
                  ? "bg-black text-white shadow-lg shadow-black/5"
                  : "text-gray-400 hover:text-black hover:bg-gray-50"
                }`}
            >
              <Icon size={20} className={isActive ? "text-white" : "group-hover:text-black"} />
              {!isCollapsed && <span className="text-sm font-medium tracking-tight">{item.label}</span>}
            </button>
          );
        })}

        {!isCollapsed && folders.length > 0 && (
          <div className="pt-8 pb-2">
            <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Folders</p>
          </div>
        )}

        {folders.map((folder) => (
          <button
            key={folder.id}
            onClick={() => {
              setFilterType('folder');
              setSelectedFolderId(folder.id);
              navigate('/dashboard');
            }}
            className="w-full flex items-center gap-4 px-4 py-2.5 rounded-xl text-gray-400 hover:text-black hover:bg-gray-50 transition-all group"
          >
            <Folder size={18} className="group-hover:text-black" />
            {!isCollapsed && <span className="text-sm font-medium tracking-tight truncate">{folder.name}</span>}
          </button>
        ))}

        {!isCollapsed && collections.length > 0 && (
          <div className="pt-8 pb-2">
            <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Collections</p>
          </div>
        )}

        {collections.map((collection) => (
          <button
            key={collection.id}
            onClick={() => navigate(`/collections/${collection.id}`)}
            className="w-full flex items-center gap-4 px-4 py-2.5 rounded-xl text-gray-400 hover:text-black hover:bg-gray-50 transition-all group"
          >
            <Layers size={18} className="group-hover:text-black" />
            {!isCollapsed && <span className="text-sm font-medium tracking-tight truncate">{collection.name}</span>}
          </button>
        ))}
      </nav>

      <div className="px-4 pb-4 space-y-2">
        <Link
          to="/chat"
          className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group ${location.pathname === '/chat'
              ? "bg-black text-white shadow-lg shadow-black/5"
              : "text-gray-400 hover:text-black hover:bg-gray-50"
            }`}
        >
          <MessageSquare size={20} className={location.pathname === '/chat' ? "text-white" : "group-hover:text-black"} />
          {!isCollapsed && <span className="text-sm font-medium tracking-tight">AI Chat</span>}
        </Link>
        <Link
          to="/agents/build"
          className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group ${location.pathname === '/agents/build'
              ? "bg-black text-white shadow-lg shadow-black/5"
              : "text-gray-400 hover:text-black hover:bg-gray-50"
            }`}
        >
          <Cpu size={20} className={location.pathname === '/agents/build' ? "text-white" : "group-hover:text-black"} />
          {!isCollapsed && <span className="text-sm font-medium tracking-tight">Agents</span>}
        </Link>
        <Link
          to="/settings"
          className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group ${location.pathname === '/settings'
              ? "bg-black text-white shadow-lg shadow-black/5"
              : "text-gray-400 hover:text-black hover:bg-gray-50"
            }`}
        >
          <Settings size={20} className={location.pathname === '/settings' ? "text-white" : "group-hover:text-black"} />
          {!isCollapsed && <span className="text-sm font-medium tracking-tight">Settings</span>}
        </Link>
      </div>

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
