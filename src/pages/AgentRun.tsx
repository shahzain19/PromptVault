import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { runAgentWorkflow } from "../lib/agentRuntime";
import {
    Sparkles,
    Send,
    ChevronLeft,
    Brain,
    CheckCircle2,
    AlertCircle,
    Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LoadingSpinner from "../components/LoadingSpinner";
import type { Agent } from "../types/prompt";
import Markdown from "../components/Markdown";

export default function AgentRun() {
    const { id } = useParams();
    const [agent, setAgent] = useState<Agent | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [inputs, setInputs] = useState<Record<string, string>>({});
    const [results, setResults] = useState<Record<string, any> | null>(null);
    const [isExecuting, setIsExecuting] = useState(false);

    useEffect(() => {
        async function fetchAgent() {
            try {
                const { data, error } = await supabase
                    .from("agents")
                    .select("*, profiles(*)")
                    .eq("id", id)
                    .single();

                if (error) throw error;
                if (!data.is_public) throw new Error("This agent is private or not deployed.");

                setAgent(data);

                const initialInputs: Record<string, string> = {};
                data.config.nodes.forEach((node: any) => {
                    if (node.type === 'trigger') {
                        initialInputs[node.id] = "";
                    }
                });
                setInputs(initialInputs);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchAgent();
    }, [id]);

    const handleExecute = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsExecuting(true);
        setResults(null);
        try {
            const flowResults = await runAgentWorkflow(agent!.config, inputs, agent!.user_id);
            setResults(flowResults);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsExecuting(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center space-y-4">
                <LoadingSpinner size="lg" />
                <p className="text-sm font-bold uppercase tracking-widest text-gray-400">Initializing Agent...</p>
            </div>
        </div>
    );

    if (error || !agent) return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6">
            <div className="max-w-md w-full text-center space-y-8">
                <div className="w-20 h-20 bg-red-50 text-red-500 rounded-[32px] flex items-center justify-center mx-auto shadow-xl">
                    <AlertCircle size={32} />
                </div>
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tighter">Connection Failed</h1>
                    <p className="text-gray-400 font-medium tracking-tight">{error || "Agent not found"}</p>
                </div>
                <Link to="/explore" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
                    <ChevronLeft size={16} /> Return to Explore
                </Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50/50 flex flex-col">
            <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-black text-white rounded-2xl flex items-center justify-center shadow-xl">
                        <Brain size={20} />
                    </div>
                    <div>
                        <h1 className="text-sm font-bold tracking-tight">{agent.name}</h1>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Deployed Agent</p>
                    </div>
                </div>
                <Link to="/explore" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-all">
                    Powered by PromptVault
                </Link>
            </nav>

            <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12 lg:py-20 grid lg:grid-cols-[1fr,350px] gap-12 items-start">
                <div className="space-y-12">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-bold uppercase tracking-widest">
                            <CheckCircle2 size={12} /> Live / Production
                        </div>
                        <h2 className="text-5xl font-black tracking-tighter leading-none">
                            {agent.description || "Deploying intelligence to your workflow."}
                        </h2>
                    </div>

                    <form onSubmit={handleExecute} className="space-y-8 bg-white p-10 rounded-[48px] border border-gray-100 shadow-2xl shadow-black/5">
                        <div className="space-y-6">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Input Parameters</p>
                            {Object.keys(inputs).map((key) => (
                                <div key={key} className="space-y-3">
                                    <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Parameter {key}</label>
                                    <textarea
                                        required
                                        value={inputs[key]}
                                        onChange={(e) => setInputs(prev => ({ ...prev, [key]: e.target.value }))}
                                        placeholder="Enter context or instructions..."
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm font-medium outline-none focus:border-black focus:bg-white transition-all min-h-[120px] resize-none"
                                    />
                                </div>
                            ))}
                        </div>

                        <button
                            type="submit"
                            disabled={isExecuting}
                            className="w-full bg-black text-white py-6 rounded-[24px] font-bold text-lg tracking-tight hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {isExecuting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Executing Workflow...
                                </>
                            ) : (
                                <>
                                    <Sparkles size={20} />
                                    Launch Agent
                                </>
                            )}
                        </button>
                    </form>

                    <AnimatePresence>
                        {results && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Execution Log</p>
                                <div className="space-y-4">
                                    {Object.entries(results).map(([nodeId, res], idx) => {
                                        const node = agent.config.nodes.find((n: any) => n.id === nodeId);
                                        return (
                                            <div key={nodeId} className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-xl shadow-black/5 flex gap-4">
                                                <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-[10px] font-bold text-gray-300 shrink-0">
                                                    {idx + 1}
                                                </div>
                                                <div className="space-y-1 flex-1">
                                                    <p className="text-[10px] font-bold uppercase tracking-widest text-black/40">{node?.data.label || 'Task'}</p>
                                                    <div className="text-sm font-medium text-gray-700 leading-relaxed break-words">
                                                        <Markdown content={typeof res === 'string' ? res : JSON.stringify(res, null, 2)} />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <aside className="space-y-8 sticky top-32">
                    <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-xl shadow-black/5 space-y-6">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Performance Metrics</p>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-gray-400">
                                    <Clock size={14} />
                                    <span className="text-xs font-semibold">Avg. Latency</span>
                                </div>
                                <span className="text-xs font-bold">1.2s</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-gray-400">
                                    <Send size={14} />
                                    <span className="text-xs font-semibold">Reliability</span>
                                </div>
                                <span className="text-xs font-bold text-green-500">99.9%</span>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 rounded-[40px] bg-black text-white space-y-4 shadow-2xl">
                        <p className="text-sm font-bold tracking-tight">Need a custom agent?</p>
                        <p className="text-[11px] text-gray-400 font-medium leading-relaxed">Join 10,000+ developers building the future of AI workflows on PromptVault.</p>
                        <Link to="/signup" className="block w-full py-3 bg-white text-black text-center rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-100 transition-colors">
                            Get Started Free
                        </Link>
                    </div>
                </aside>
            </main>
        </div>
    );
}
