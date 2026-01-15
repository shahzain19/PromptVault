import { useAuth } from "../features/auth/useAuth";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { supabase } from "../lib/supabaseClient";
import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Mail, Trash2, LogOut } from "lucide-react";

export default function Settings() {
  const { user, signOut } = useAuth();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
