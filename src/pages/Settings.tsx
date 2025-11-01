import { useAuth } from "../features/auth/useAuth";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { supabase } from "../lib/supabaseClient";
import { useState } from "react";

export default function Settings() {
  const { user, logout } = useAuth();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Handle password update
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (newPassword.trim().length < 6) {
      setStatus("Password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatus("Passwords do not match");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setLoading(false);

    if (error) setStatus(error.message);
    else {
      setStatus("Password updated successfully");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  // Handle account deletion
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
      await logout();
    }
  };

  return (
    <div className="flex min-h-screen bg-white text-gray-800">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="max-w-3xl mx-auto w-full px-6 py-10 space-y-10">
          {/* Header */}
          <header>
            <h1 className="text-3xl font-semibold mb-2 text-black">
              Settings
            </h1>
            <p className="text-sm text-gray-500">
              Manage your account and security preferences.
            </p>
          </header>

          {/* Profile Section */}
          <section className="border border-gray-200 rounded-xl p-6 shadow-sm bg-white">
            <h2 className="text-lg font-medium mb-4 text-black">Profile</h2>
            <div className="text-sm text-gray-700">
              <p>
                <span className="font-medium text-black">Email:</span>{" "}
                {user?.email}
              </p>
            </div>
          </section>

          {/* Password Section */}
          <section className="border border-gray-200 rounded-xl p-6 shadow-sm bg-white">
            <h2 className="text-lg font-medium mb-4 text-black">
              Change Password
            </h2>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />

              {status && (
                <p
                  className={`text-sm ${
                    status.includes("successfully")
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {status}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
          </section>

          {/* Account Section */}
          <section className="border border-gray-200 rounded-xl p-6 shadow-sm bg-white">
            <h2 className="text-lg font-medium mb-4 text-black">Account</h2>
            <div className="flex flex-col gap-3 text-sm">
              <button
                onClick={logout}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Log out
              </button>
              <button
                onClick={handleDeleteAccount}
                className="text-red-500 hover:text-red-700 font-medium"
              >
                Delete account
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
