import { usePrompts } from "../features/prompts/PromptContext";
import { AddPromptModal } from "../features/prompts/AddPromptModal";
import { EditPromptModal } from "../features/prompts/EditPromptModal";
import PromptList from "../features/prompts/PromptList";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useState } from "react";

export default function Dashboard() {
  const { isAddOpen } = usePrompts();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<any>(null);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="max-w-5xl mx-auto w-full px-6 py-8 space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800 tracking-tight">
            Your Prompts
          </h2>

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
          setIsOpen={setIsEditOpen}
        />
      )}
    </div>
  );
}
