import { useState, useEffect } from "react";
import { Key, Plus, Trash2, Copy, Check, ShieldAlert, Github, Cpu, Globe } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../features/auth/useAuth";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import LoadingSpinner from "../components/LoadingSpinner";
import { motion, AnimatePresence } from "framer-motion";

type ApiKey = {
    id: string;
    name: string;
    key_hash: string;
    last_used_at: string | null;
    created_at: string;
    service?: string;
};

export default function ApiKeys() {
    const { user } = useAuth();
    const [keys, setKeys] = useState<ApiKey[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [service, setService] = useState("vault");
    const [newKeyName, setNewKeyName] = useState("");
    const [generatedKey, setGeneratedKey] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchKeys();
    }, []);

    const fetchKeys = async () => {
        setLoading(true);
        const { data, error: fetchError } = await supabase
            .from("api_keys")
            .select("*")
            .order("created_at", { ascending: false });

        if (fetchError) setError(fetchError.message);
        else setKeys(data || []);
        setLoading(false);
    };

    const generateKey = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newKeyName.trim()) return;

        setError(null);
        // If it's a Vault key, we generate one. Otherwise we just store what the user provides.
        const rawKey = service === "vault"
            ? `pv_${Math.random().toString(36).slice(2, 10)}${Math.random().toString(36).slice(2, 10)}`
            : "";

        const { error } = await supabase
            .from("api_keys")
            .insert([{
                user_id: user?.id,
                name: newKeyName.trim(),
                key_hash: rawKey || newKeyName.trim(), // In V3 we might want a separate table or encrypt these
                service: service
            }]);

        if (error) setError(error.message);
        else {
            if (service === "vault") setGeneratedKey(rawKey);
            else setIsCreating(false);
            setNewKeyName("");
            fetchKeys();
        }
    };

    const revokeKey = async (id: string) => {
        const { error } = await supabase.from("api_keys").delete().eq("id", id);
        if (error) setError(error.message);
        else fetchKeys();
    };

    const copyToClipboard = () => {
        if (!generatedKey) return;
        navigator.clipboard.writeText(generatedKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const services = [
        { id: 'vault', name: 'PromptVault', icon: Key, color: 'bg-black text-white' },
        { id: 'github', name: 'GitHub', icon: Github, color: 'bg-gray-100 text-black' },
        { id: 'openai', name: 'OpenAI', icon: Cpu, color: 'bg-green-100 text-green-700' },
        { id: 'custom', name: 'Webhook/Custom', icon: Globe, color: 'bg-blue-100 text-blue-700' }
    ];

    return (
        <div className="flex min-h-screen bg-white">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0">
                <Navbar />
                <main className="max-w-5xl mx-auto w-full px-6 sm:px-10 py-12 space-y-16">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-end justify-between"
                    >
                        <div className="space-y-4">
                            <h1 className="text-5xl font-black tracking-tighter">API Ecosystem</h1>
                            <p className="text-gray-400 font-medium tracking-tight text-lg">Manage keys for internal access and external integrations.</p>
                        </div>
                        <button
                            onClick={() => setIsCreating(true)}
                            className="flex items-center gap-3 px-8 py-4 bg-black text-white rounded-full font-bold uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-2xl active:scale-95"
                        >
                            <Plus size={18} />
                            Add Secret key
                        </button>
                    </motion.div>

                    <AnimatePresence>
                        {isCreating && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.98, y: 20 }}
                                className="bg-gray-50 p-10 rounded-[48px] border border-gray-100 space-y-10 shadow-2xl"
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className="text-2xl font-black tracking-tighter">New Integration</h3>
                                    <button onClick={() => { setIsCreating(false); setGeneratedKey(null); }} className="text-xs font-bold uppercase tracking-widest text-gray-300 hover:text-black transition-colors">
                                        Dismiss
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {services.map(s => (
                                        <button
                                            key={s.id}
                                            onClick={() => setService(s.id)}
                                            className={`p-6 rounded-3xl border transition-all flex flex-col items-center gap-4 ${service === s.id ? 'bg-white border-black shadow-xl ring-4 ring-black/5' : 'bg-transparent border-gray-200 hover:border-black'}`}
                                        >
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${s.color}`}>
                                                <s.icon size={24} />
                                            </div>
                                            <span className="text-[11px] font-bold uppercase tracking-widest leading-none">{s.name}</span>
                                        </button>
                                    ))}
                                </div>

                                {!generatedKey ? (
                                    <form onSubmit={generateKey} className="space-y-6">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-2">
                                                {service === 'vault' ? 'Label your key' : 'Enter Secret Key / Token'}
                                            </label>
                                            <input
                                                autoFocus
                                                type={service === 'vault' ? 'text' : 'password'}
                                                placeholder={service === 'vault' ? 'e.g. My Coding App' : 'sk_... or ghp_...'}
                                                value={newKeyName}
                                                onChange={(e) => setNewKeyName(e.target.value)}
                                                className="w-full bg-white px-8 py-5 rounded-[24px] border border-gray-100 outline-none focus:border-black transition-all text-lg font-medium shadow-sm"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={!newKeyName.trim()}
                                            className="w-full py-5 bg-black text-white rounded-[24px] font-bold uppercase tracking-widest text-xs hover:scale-[1.01] transition-all disabled:opacity-20 shadow-xl"
                                        >
                                            Save Integration
                                        </button>
                                    </form>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="p-8 bg-black text-white rounded-[32px] flex items-start gap-6 shadow-2xl">
                                            <ShieldAlert size={28} className="text-yellow-400 mt-1 shrink-0" />
                                            <div className="space-y-2">
                                                <p className="text-lg font-bold tracking-tight">Protect this key</p>
                                                <p className="text-sm text-gray-400 font-medium leading-relaxed">
                                                    This key will only be shown once. Copy it now to use in your applications.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6 bg-white p-6 rounded-[32px] border border-gray-200 font-mono text-xl break-all shadow-xl">
                                            <span className="flex-1 px-4">{generatedKey}</span>
                                            <button
                                                onClick={copyToClipboard}
                                                className={`p-5 rounded-2xl transition-all ${copied ? 'bg-green-500 text-white' : 'bg-gray-50 text-gray-400 hover:text-black'}`}
                                            >
                                                {copied ? <Check size={24} /> : <Copy size={24} />}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {loading ? (
                        <div className="py-20 flex justify-center">
                            <LoadingSpinner size="lg" />
                        </div>
                    ) : keys.length === 0 ? (
                        <div className="py-32 text-center space-y-6 bg-gray-50/50 rounded-[48px] border border-dashed border-gray-200">
                            <div className="p-8 bg-white rounded-3xl inline-block text-gray-200 shadow-sm">
                                <Key size={48} />
                            </div>
                            <div className="space-y-2">
                                <p className="text-xl font-bold tracking-tight">No keys found</p>
                                <p className="text-gray-400 font-medium tracking-tight">Start by adding your first PromptVault or GitHub key.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {keys.map((key) => (
                                <div key={key.id} className="flex items-center justify-between p-10 bg-white border border-gray-100 rounded-[48px] hover:border-black/20 transition-all group shadow-sm hover:shadow-2xl">
                                    <div className="flex items-center gap-8">
                                        <div className={`p-5 rounded-[24px] transition-all group-hover:scale-110 ${key.service === 'github' ? 'bg-gray-900 text-white' :
                                            key.service === 'openai' ? 'bg-green-50 text-green-600' :
                                                'bg-gray-50 text-gray-400'
                                            }`}>
                                            {key.service === 'github' ? <Github size={28} /> :
                                                key.service === 'openai' ? <Cpu size={28} /> :
                                                    <Key size={28} />}
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-3">
                                                <h4 className="text-xl font-bold tracking-tighter">{key.name}</h4>
                                                <span className="px-2 py-0.5 bg-gray-100 rounded-md text-[9px] font-black uppercase tracking-widest text-gray-400">{key.service || 'Vault'}</span>
                                            </div>
                                            <p className="text-sm font-mono text-gray-300 tracking-tight">
                                                •••••••••••• {key.key_hash.slice(-4)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-12">
                                        <div className="text-right hidden sm:block">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300 mb-1">Status</p>
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                                <p className="text-xs font-bold uppercase tracking-widest text-black">Active</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => revokeKey(key.id)}
                                            className="p-5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-[24px] transition-all active:scale-90"
                                            title="Revoke Key"
                                        >
                                            <Trash2 size={24} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="fixed bottom-10 right-10 p-6 bg-red-50 border border-red-100 rounded-3xl shadow-2xl flex items-center gap-4 z-50"
                        >
                            <ShieldAlert className="text-red-500" />
                            <p className="text-sm text-red-600 font-semibold">{error}</p>
                            <button onClick={() => setError(null)} className="ml-4 text-red-300 hover:text-red-500 font-bold">×</button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
