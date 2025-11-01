import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "../pages/Landing";
import Dashboard from "../pages/Dashboard";
import Login from "../features/auth/Login";
import Signup from "../features/auth/Signup";
import Settings from "../pages/Settings";
import ProtectedRoute from "../features/auth/ProtectedRoute";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
       <Route path="/dashboard" element={<Dashboard />} />
        
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}