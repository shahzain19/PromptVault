import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { usePrompts } from "../features/prompts/PromptContext";
import { supabase } from "../lib/supabaseClient";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import LoadingSpinner from "../components/LoadingSpinner";
import { Globe, User, Grid, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import type { Profile as ProfileType, Prompt } from "../types/prompt";
import ExplorePromptCard from "../components/ExplorePromptCard";

export default function Profile() {
    const { username } = useParams();
    const { getProfile } = usePrompts();
    const [profile, setProfile] = useState<ProfileType | null>(null);
    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadProfile() {
            if (!username) return;
            setLoading(true);
            try {
                const profileData = await getProfile(username);
                if (!profileData) {
                    setError("Profile not found");
                    return;
                }
                setProfile(profileData);

                // Fetch user's public prompts
                const { data: promptData, error: promptError } = await supabase
                    .from("prompts")
                    .select("*, author:profiles(*)")
                    .eq("user_id", profileData.id)
                    .eq("is_public", true)
                    .order("created_at", { ascending: false });

                if (promptError) throw promptError;
                setPrompts(promptData || []);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        loadProfile();
    }, [username, getProfile]);

    if (loading) return (
        <div className="flex min-h-screen bg-white">
            <Sidebar />
            <div className="flex-1">
                <Navbar />
                <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)]">
                    <LoadingSpinner size="lg" />
                    <p className="text-gray-400 mt-6 font-medium tracking-tight">Fetching profile...</p>
                </div>
            </div>
        </div>
    );

    if (error || !profile) return (
        <div className="flex min-h-screen bg-white">
            <Sidebar />
            <div className="flex-1">
                <Navbar />
                <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)] space-y-6">
                    <div className="p-6 bg-red-50 rounded-[32px] text-red-500">
                        <User size={48} />
                    </div>
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-semibold tracking-tighter">{error || "User not found"}</h2>
                        <Link to="/explore" className="text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
                            Back to Community
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-white">
            <Sidebar />
            <div className="flex-1">
                <Navbar />

                {/* Cover Image */}
                <div className="h-64 sm:h-80 lg:h-96 w-full bg-gray-50 overflow-hidden relative border-b border-gray-100">
                    {profile.cover_url ? (
                        <img src={profile.cover_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 flex items-center justify-center opacity-50" />
                    )}
                </div>

                <main className="max-w-7xl mx-auto px-4 sm:px-8 -mt-24 relative z-10 pb-20">
                    <div className="grid lg:grid-cols-[380px,1fr] gap-16 items-start">
                        {/* Profile Info */}
                        <motion.aside
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-10 sticky top-32 bg-white p-10 rounded-[48px] border border-gray-100 shadow-2xl shadow-black/5"
                        >
                            <div className="space-y-6">
                                <div className="w-32 h-32 rounded-[40px] bg-white p-2 border border-gray-100 shadow-xl overflow-hidden -mt-20">
                                    <div className="w-full h-full rounded-[32px] overflow-hidden bg-gray-50 flex items-center justify-center">
                                        {profile.avatar_url ? (
                                            <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <User size={40} className="text-gray-200" />
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <h1 className="text-3xl font-bold tracking-tighter leading-none">{profile.full_name || username}</h1>
                                    <p className="text-gray-400 font-medium tracking-tight">@{profile.username}</p>
                                </div>
                            </div>

                            {profile.bio && (
                                <p className="text-lg text-gray-500 font-medium leading-relaxed tracking-tight">
                                    {profile.bio}
                                </p>
                            )}

                            <div className="flex flex-wrap gap-4">
                                {profile.website && (
                                    <a
                                        href={profile.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-6 py-3 bg-gray-50 rounded-full text-sm font-semibold hover:bg-black hover:text-white transition-all"
                                    >
                                        <Globe size={16} />
                                        Website
                                        <ExternalLink size={12} className="opacity-50" />
                                    </a>
                                )}
                            </div>

                            <div className="pt-8 border-t border-gray-100 flex gap-12">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300 mb-1">Prompts</p>
                                    <p className="text-2xl font-bold tracking-tighter">{prompts.length}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300 mb-1">Status</p>
                                    <div className="flex items-center gap-2">
                                        <p className="text-2xl font-bold tracking-tighter">{profile.is_pro ? "Pro" : "Free"}</p>
                                        {profile.is_pro && <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />}
                                    </div>
                                </div>
                            </div>
                        </motion.aside>

                        {/* Public Content */}
                        <div className="space-y-12">
                            <div className="flex items-center gap-8 border-b border-gray-100 pb-6">
                                <button className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-black">
                                    <Grid size={16} />
                                    Public Prompts
                                </button>
                            </div>

                            {prompts.length > 0 ? (
                                <div className="grid gap-8 sm:grid-cols-2">
                                    {prompts.map((prompt) => (
                                        <ExplorePromptCard
                                            key={prompt.id}
                                            id={prompt.id}
                                            title={prompt.title}
                                            content={prompt.content}
                                            description={prompt.description}
                                            date={new Date(prompt.created_at).toLocaleDateString()}
                                            author={prompt.author!}
                                            tags={prompt.tags}
                                            copyCount={prompt.copy_count}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="py-32 text-center bg-gray-50/50 rounded-[40px] border border-dashed border-gray-100">
                                    <p className="text-gray-400 font-medium tracking-tight">No public prompts to show yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
