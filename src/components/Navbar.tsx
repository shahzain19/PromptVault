import { usePrompts } from "../features/prompts/PromptContext";
import Button from "./Button";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";

export default function Navbar() {
  const { setIsAddOpen, setSearchQuery } = usePrompts();
  const [query, setQuery] = useState("");

  // Keyboard shortcut (Ctrl + N)
  useEffect(() => {
    const handleShortcut = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "n") {
        e.preventDefault();
        setIsAddOpen(true);
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [setIsAddOpen]);

  // Search update
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSearchQuery?.(value);
  };

  return (
    <nav className="w-full bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm sticky top-0 z-40 px-6 py-3 flex items-center justify-between gap-4">
      {/* Left — Logo */}
      <div className="flex items-center gap-2">
        <img
          src="/PromptVaul.png"
          alt="PromptVault logo"
          className="h-10 w-10 object-contain"
        />
      </div>

      {/* Center — Search */}
      <div className="flex-1 flex justify-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search prompts..."
            value={query}
            onChange={handleSearch}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 
                       transition bg-white placeholder-gray-400"
          />
        </div>
      </div>

      {/* Right — Add Button */}
      <div className="flex-shrink-0">
        <Button onClick={() => setIsAddOpen(true)}>+ New Prompt</Button>
      </div>
    </nav>
  );
}