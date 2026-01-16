import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "../pages/LandingPage";
import Dashboard from "../pages/Dashboard";
import Explore from "../pages/Explore";
import Login from "../features/auth/Login";
import Signup from "../features/auth/Signup";
import Settings from "../pages/Settings";
import ApiKeys from "../pages/ApiKeys";
import Profile from "../pages/Profile";
import Chat from "../pages/Chat";
import AgentBuilder from "../pages/AgentBuilder";
import AgentRun from "../pages/AgentRun";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "../features/auth/ProtectedRoute";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        <Route path="/explore" element={
          <ProtectedRoute>
            <Explore />
          </ProtectedRoute>
        } />

        <Route path="/chat" element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        } />

        <Route path="/agents/build" element={
          <ProtectedRoute>
            <AgentBuilder />
          </ProtectedRoute>
        } />

        <Route path="/a/:id" element={
          <AgentRun />
        } />

        <Route path="/settings" element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } />

        <Route path="/api-keys" element={
          <ProtectedRoute>
            <ApiKeys />
          </ProtectedRoute>
        } />

        <Route path="/u/:username" element={
          <Profile />
        } />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}