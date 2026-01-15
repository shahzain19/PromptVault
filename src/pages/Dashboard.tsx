import { usePrompts } from "../features/prompts/PromptContext";
import { AddPromptModal } from "../features/prompts/AddPromptModal";
import { EditPromptModal } from "../features/prompts/EditPromptModal";
import PromptList from "../features/prompts/PromptList";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { isAddOpen, setFilterType } = usePrompts();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'favorites' | 'public'>('all');

  const handleTabChange = (tab: 'all' | 'favorites' | 'public') => {
    setActiveTab(tab);
    setFilterType(tab);
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-10 space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <h2 className="text-3xl font-semibold tracking-tighter">
              Your Prompts
            </h2>
            <div className="flex items-center justify-between gap-4">
              <p className="text-gray-400 font-medium tracking-tight">Manage and refine your collection.</p>

              <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-full">
                {([
                  { id: 'all', label: 'All' },
                  { id: 'favorites', label: 'Favorites' },
                  { id: 'public', label: 'Public' }
                ] as const).map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-black'}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          <PromptList
            setSelectedPrompt={setSelectedPrompt}
            setIsEditOpen={setIsEditOpen}
          />
        </main>
      </div>

      {isAddOpen && <AddPromptModal />}
      {isEditOpen && (
        <EditPromptModal
          prompt={selectedPrompt}
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
        />
      )}
    </div>
  );
}
