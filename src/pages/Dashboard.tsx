import { usePrompts } from "../features/prompts/PromptContext";
import { AddPromptModal } from "../features/prompts/AddPromptModal";
import { EditPromptModal } from "../features/prompts/EditPromptModal";
import PromptList from "../features/prompts/PromptList";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { isAddOpen } = usePrompts();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<any>(null);

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
            <p className="text-gray-400 font-medium tracking-tight">Manage and refine your collection.</p>
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
