import { useAuth } from "../features/auth/useAuth";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { supabase } from "../lib/supabaseClient";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Mail, Trash2, LogOut, Key, ChevronRight, User, Globe } from "lucide-react";
import { Link } from "react-router-dom";

import { usePrompts } from "../features/prompts/PromptContext";

export default function Settings() {
  const { user, signOut } = useAuth();
  const { updateProfile } = usePrompts();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Profile Form State
  const [profileData, setProfileData] = useState({
    username: "",
    full_name: "",
    bio: "",
    website: "",
    avatar_url: "",
    cover_url: ""
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        username: user.user_metadata?.username || "",
        full_name: user.user_metadata?.full_name || "",
        bio: user.user_metadata?.bio || "",
        website: user.user_metadata?.website || "",
        avatar_url: user.user_metadata?.avatar_url || "",
        cover_url: user.user_metadata?.cover_url || ""
      });
    }
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    setLoading(true);
    try {
      await updateProfile(profileData);
      setStatus("Profile updated successfully.");
    } catch (err: any) {
      setStatus(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (newPassword.trim().length < 6) {
      setStatus("Minimum 6 characters required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatus("Passwords do not match.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setLoading(false);

    if (error) setStatus(error.message);
    else {
      setStatus("Password updated successfully.");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete your account?"
    );
    if (!confirmDelete) return;

    const { error } = await supabase
      .from("profiles")
      .delete()
      .eq("id", user?.id);

    if (error) {
      setStatus("Failed to delete account: " + error.message);
    } else {
      await signOut();
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="max-w-4xl mx-auto w-full px-4 sm:px-8 py-10 space-y-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <h1 className="text-3xl font-semibold tracking-tighter">Settings</h1>
            <p className="text-gray-400 font-medium tracking-tight">Configure your environment.</p>
          </motion.div>

          <div className="grid gap-16">
            {/* Profile Section */}
            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gray-50 rounded-3xl text-gray-400">
                  <User size={24} />
                </div>
                <div className="space-y-0.5">
                  <h2 className="text-xl font-semibold tracking-tight">Profile</h2>
                  <p className="text-sm text-gray-400 font-medium tracking-tight">Your public identity in the community.</p>
                </div>
              </div>

              <form onSubmit={handleProfileUpdate} className="space-y-8">
                <div className="grid sm:grid-cols-2 gap-8">
                  <div className="bg-gray-50/50 p-8 rounded-[32px] border border-gray-100 flex flex-col gap-6">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Profile Picture</p>
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-3xl bg-white border border-gray-100 flex items-center justify-center overflow-hidden">
                        {profileData.avatar_url ? (
                          <img src={profileData.avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <User size={24} className="text-gray-200" />
                        )}
                      </div>
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Avatar URL"
                          value={profileData.avatar_url}
                          onChange={(e) => setProfileData({ ...profileData, avatar_url: e.target.value })}
                          className="w-full py-2 bg-transparent border-b border-gray-100 focus:border-black transition-colors outline-none text-sm font-medium tracking-tight placeholder:text-gray-200"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50/50 p-8 rounded-[32px] border border-gray-100 flex flex-col gap-6">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Cover Image</p>
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center overflow-hidden">
                        {profileData.cover_url ? (
                          <img src={profileData.cover_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Globe size={24} className="text-gray-200" />
                        )}
                      </div>
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Cover URL"
                          value={profileData.cover_url}
                          onChange={(e) => setProfileData({ ...profileData, cover_url: e.target.value })}
                          className="w-full py-2 bg-transparent border-b border-gray-100 focus:border-black transition-colors outline-none text-sm font-medium tracking-tight placeholder:text-gray-200"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Username</p>
                    <input
                      type="text"
                      placeholder="username"
                      value={profileData.username}
                      onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                      className="w-full py-4 bg-transparent border-b border-gray-100 focus:border-black transition-colors outline-none text-lg font-medium tracking-tight placeholder:text-gray-200"
                    />
                  </div>
                  <div className="space-y-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Full Name</p>
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={profileData.full_name}
                      onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                      className="w-full py-4 bg-transparent border-b border-gray-100 focus:border-black transition-colors outline-none text-lg font-medium tracking-tight placeholder:text-gray-200"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Bio</p>
                  <textarea
                    placeholder="Tell the community about yourself..."
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    className="w-full py-4 bg-transparent border-b border-gray-100 focus:border-black transition-colors outline-none text-lg font-medium tracking-tight placeholder:text-gray-200 resize-none min-h-[100px]"
                  />
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-300">Website</p>
                  <input
                    type="url"
                    placeholder="https://yourwebsite.com"
                    value={profileData.website}
                    onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                    className="w-full py-4 bg-transparent border-b border-gray-100 focus:border-black transition-colors outline-none text-lg font-medium tracking-tight placeholder:text-gray-200"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-4 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition-all active:scale-[0.98] disabled:opacity-30"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </section>
            {/* Identity Section */}
            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gray-50 rounded-3xl text-gray-400">
                  <Mail size={24} />
                </div>
                <div className="space-y-0.5">
                  <h2 className="text-xl font-semibold tracking-tight">Identity</h2>
                  <p className="text-sm text-gray-400 font-medium tracking-tight">Your primary account information.</p>
                </div>
              </div>

              <div className="bg-gray-50/50 p-8 rounded-[32px] border border-gray-100">
                <p className="text-sm font-bold uppercase tracking-widest text-gray-300 mb-2">Email Address</p>
                <p className="text-xl font-medium tracking-tight truncate">{user?.email}</p>
              </div>
            </section>

            {/* Security Section */}
            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gray-50 rounded-3xl text-gray-400">
                  <Shield size={24} />
                </div>
                <div className="space-y-0.5">
                  <h2 className="text-xl font-semibold tracking-tight">Security</h2>
                  <p className="text-sm text-gray-400 font-medium tracking-tight">Manage your access credentials.</p>
                </div>
              </div>

              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    type="password"
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full py-5 bg-transparent border-b border-gray-100 focus:border-black transition-colors outline-none text-lg font-medium tracking-tight placeholder:text-gray-200"
                  />
                  <input
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full py-5 bg-transparent border-b border-gray-100 focus:border-black transition-colors outline-none text-lg font-medium tracking-tight placeholder:text-gray-200"
                  />
                </div>

                {status && (
                  <p className={`text-xs font-bold uppercase tracking-widest ${status.includes("successfully") ? "text-green-500" : "text-red-500"}`}>
                    {status}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading || !newPassword}
                  className="px-8 py-4 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition-all active:scale-[0.98] disabled:opacity-30"
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </form>
            </section>

            {/* Developer Section */}
            <section className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gray-50 rounded-3xl text-gray-400">
                  <Key size={24} />
                </div>
                <div className="space-y-0.5">
                  <h2 className="text-xl font-semibold tracking-tight">Developer</h2>
                  <p className="text-sm text-gray-400 font-medium tracking-tight">Access your vault programmatically.</p>
                </div>
              </div>

              <Link
                to="/settings/api-keys"
                className="flex items-center justify-between p-8 bg-gray-50/50 rounded-[32px] border border-gray-100 hover:border-black/10 transition-all group"
              >
                <div className="space-y-1">
                  <p className="font-semibold tracking-tight">API Management</p>
                  <p className="text-sm text-gray-400 font-medium tracking-tight">Generate and manage your API keys.</p>
                </div>
                <ChevronRight size={20} className="text-gray-300 group-hover:text-black transition-colors" />
              </Link>
            </section>

            {/* Actions Section */}
            <section className="space-y-8 pt-8 border-t border-gray-100">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={signOut}
                  className="flex items-center justify-center gap-3 px-8 py-5 border border-gray-100 rounded-full font-semibold text-gray-400 hover:text-black hover:bg-gray-50 transition-all"
                >
                  <LogOut size={20} />
                  Sign out
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="flex items-center justify-center gap-3 px-8 py-5 border border-red-50 rounded-full font-semibold text-red-300 hover:text-red-500 hover:bg-red-50/50 transition-all"
                >
                  <Trash2 size={20} />
                  Delete Account
                </button>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
