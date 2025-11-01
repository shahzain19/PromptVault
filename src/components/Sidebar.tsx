import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();
  const linkClasses = (path: string) =>
    `block px-4 py-2 rounded-lg ${
      location.pathname === path
        ? "bg-blue-600 text-white"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <aside className="w-64 h-screen border-r bg-white shadow-sm p-4">
      <h2 className="text-xl font-semibold mb-6 text-blue-600">PromptVault</h2>
      <nav className="flex flex-col gap-2">
        <Link to="/dashboard" className={linkClasses("/dashboard")}>
          Dashboard
        </Link>
        <Link to="/settings" className={linkClasses("/settings")}>
          Settings
        </Link>
      </nav>
    </aside>
  );
}
  