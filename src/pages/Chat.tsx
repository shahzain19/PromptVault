import { useState, useRef, useEffect } from "react";
import {
    Send, User, Bot, Sparkles, Wand2,
    Trash2, AlertCircle, Cpu, ChevronRight, LayoutGrid
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../features/auth/useAuth";
import { startChatSession, generateAgent } from "../lib/gemini";
import { useNavigate } from "react-router-dom";
import MarkdownRenderer from "../components/Markdown";

type Message = {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
    generatedAgent?: any;
};

export default function Chat() {
    useAuth();
    const navigate = useNavigate();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const currentInput = input.trim();
        setError(null);

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: currentInput,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            // Check if user is asking to build an agent
            const isAgentRequest = /agent|workflow|build|create bot/i.test(currentInput);

            let assistantContent = "";
            let generatedAgent = null;

            if (isAgentRequest) {
                generatedAgent = await generateAgent(currentInput);
                assistantContent = "I've architected a new agent workflow for you! You can preview the nodes below and import them directly into the builder.";
            } else {
                const history = messages.map(m => ({
                    role: m.role === 'user' ? 'user' as const : 'model' as const,
                    parts: [{ text: m.content }]
                }));
                const chat = await startChatSession(history);
                const result = await chat.sendMessage(currentInput);
                const response = await result.response;
                assistantContent = response.text();
            }

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: assistantContent,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                generatedAgent
            };
            setMessages(prev => [...prev, assistantMessage]);
        } catch (err: any) {
            console.error("Chat Error:", err);
            setError("Failed to get AI response. Please check your Gemini API key.");
        } finally {
            setIsLoading(false);
        }
    };

    const importAgent = (agentData: any) => {
        // Store in session or local storage for the builder to pick up
        localStorage.setItem('pending_agent_import', JSON.stringify(agentData));
        navigate('/agents/build');
    };

    const clearChat = () => {
        setMessages([]);
        setError(null);
    };

    return (
        <div className="flex min-h-screen bg-white">
            <Sidebar />
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <Navbar />

                <main className="flex-1 overflow-y-auto px-4 py-10 lg:px-0">
                    <div className="max-w-3xl mx-auto space-y-12">
                        {messages.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="py-20 text-center space-y-8"
                            >
                                <div className="w-20 h-20 bg-black text-white rounded-[40px] flex items-center justify-center mx-auto shadow-2xl relative overflow-hidden group">
                                    <Sparkles size={32} className="relative z-10" />
                                    <div className="absolute inset-0 bg-gradient-to-tr from-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div className="space-y-4">
                                    <h1 className="text-5xl font-black tracking-tighter">AI Architect</h1>
                                    <p className="text-gray-400 font-medium tracking-tight text-xl max-w-lg mx-auto leading-relaxed">
                                        Test your prompts or ask me to <span className="text-black font-bold">build an agent</span> for you.
                                    </p>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto pt-10">
                                    <button onClick={() => setInput("Build a GitHub coding agent that reviews PRs and summarizes them.")} className="bg-gray-50 p-8 rounded-[40px] border border-gray-100 text-left space-y-4 hover:border-black transition-all group">
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-gray-100 group-hover:bg-black group-hover:text-white transition-all shadow-sm">
                                            <Cpu size={24} />
                                        </div>
                                        <div>
                                            <p className="font-bold tracking-tight">Create Agent</p>
                                            <p className="text-xs text-gray-400 font-medium leading-relaxed">"Build a GitHub coding agent..."</p>
                                        </div>
                                    </button>
                                    <button onClick={() => setInput("How can I improve my prompt's variables?")} className="bg-gray-50 p-8 rounded-[40px] border border-gray-100 text-left space-y-4 hover:border-black transition-all group">
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-gray-100 group-hover:bg-black group-hover:text-white transition-all shadow-sm">
                                            <Wand2 size={24} />
                                        </div>
                                        <div>
                                            <p className="font-bold tracking-tight">Refine Logic</p>
                                            <p className="text-xs text-gray-400 font-medium leading-relaxed">"Improve my prompt variables..."</p>
                                        </div>
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="space-y-12 pb-32">
                                <AnimatePresence mode="popLayout">
                                    {messages.map((message) => (
                                        <motion.div
                                            key={message.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`grid gap-6 ${message.role === 'user' ? 'bg-gray-50/50 p-10 rounded-[48px]' : ''}`}
                                        >
                                            <div className="flex gap-6">
                                                <div className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center shadow-xl ${message.role === 'user' ? 'bg-black text-white' : 'bg-white text-black border border-gray-100'}`}>
                                                    {message.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                                                </div>
                                                <div className="space-y-4 flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-xs font-bold uppercase tracking-widest text-gray-300">
                                                            {message.role === 'user' ? 'User' : 'Architect AI'}
                                                        </p>
                                                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300">
                                                            {message.timestamp}
                                                        </p>
                                                    </div>
                                                    <div className="text-xl font-medium leading-relaxed tracking-tight text-gray-800 break-words">
                                                        <MarkdownRenderer content={message.content} />
                                                    </div>
                                                </div>
                                            </div>

                                            {message.generatedAgent && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className="ml-16 bg-white border border-gray-100 rounded-[40px] p-8 shadow-2xl shadow-black/5 space-y-6"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
                                                                <LayoutGrid size={20} />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold tracking-tight">Agent Workflow</p>
                                                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300">
                                                                    {message.generatedAgent.nodes.length} Nodes Generated
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => importAgent(message.generatedAgent)}
                                                            className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full text-xs font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
                                                        >
                                                            Open in Builder <ChevronRight size={14} />
                                                        </button>
                                                    </div>

                                                    <div className="flex gap-2 overflow-x-auto pb-2">
                                                        {message.generatedAgent.nodes.map((node: any, idx: number) => (
                                                            <div key={idx} className="shrink-0 p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-3">
                                                                <div className="w-2 h-2 rounded-full bg-black" />
                                                                <span className="text-[11px] font-bold uppercase tracking-widest text-gray-600">{node.data.label}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    ))}
                                </AnimatePresence>

                                {error && (
                                    <div className="flex gap-4 p-8 bg-red-50 text-red-500 rounded-[40px] items-center mx-10">
                                        <AlertCircle size={24} />
                                        <p className="text-lg font-bold tracking-tight">{error}</p>
                                    </div>
                                )}

                                {isLoading && (
                                    <div className="flex gap-6 px-10">
                                        <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center animate-pulse">
                                            <Bot size={20} />
                                        </div>
                                        <div className="flex gap-1.5 items-center pt-5">
                                            <div className="w-2.5 h-2.5 bg-gray-200 rounded-full animate-bounce" />
                                            <div className="w-2.5 h-2.5 bg-gray-200 rounded-full animate-bounce [animation-delay:0.2s]" />
                                            <div className="w-2.5 h-2.5 bg-gray-200 rounded-full animate-bounce [animation-delay:0.4s]" />
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        )}
                    </div>
                </main>

                <section className="p-10 bg-white border-t border-gray-100 relative z-20 shadow-2xl">
                    <div className="max-w-3xl mx-auto space-y-8">
                        <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-none">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300 shrink-0">Suggestions</p>
                            <button onClick={() => setInput("Build a customer support agent.")} className="px-5 py-2.5 bg-gray-50 rounded-full text-xs font-bold border border-gray-100 hover:border-black transition-all whitespace-nowrap">Support Bot</button>
                            <button onClick={() => setInput("Build a coding agent for GitHub.")} className="px-5 py-2.5 bg-gray-50 rounded-full text-xs font-bold border border-gray-100 hover:border-black transition-all whitespace-nowrap">GitHub Agent</button>
                            <button onClick={() => setInput("Explain variables to me.")} className="px-5 py-2.5 bg-gray-50 rounded-full text-xs font-bold border border-gray-100 hover:border-black transition-all whitespace-nowrap">Logic Help</button>
                            {messages.length > 0 && (
                                <button
                                    onClick={clearChat}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-500 rounded-full text-xs font-bold hover:bg-red-500 hover:text-white transition-all whitespace-nowrap"
                                >
                                    <Trash2 size={14} /> Clear
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleSend} className="relative group">
                            <input
                                autoFocus
                                type="text"
                                placeholder="Design your agent or ask a question..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="w-full bg-gray-50/50 border border-gray-200 rounded-[32px] pl-10 pr-20 py-8 outline-none focus:border-black focus:bg-white transition-all text-xl font-medium tracking-tight shadow-2xl"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className="absolute right-6 top-1/2 -translate-y-1/2 w-16 h-16 bg-black text-white rounded-[24px] flex items-center justify-center hover:bg-gray-800 transition-all disabled:opacity-30 disabled:scale-95 active:scale-90 shadow-xl shadow-black/20"
                            >
                                <Send size={24} />
                            </button>
                        </form>
                    </div>
                </section>
            </div>
        </div>
    );
}
