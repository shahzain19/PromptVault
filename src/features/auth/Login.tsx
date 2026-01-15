import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";
import { getErrorMessage, isValidationError } from "../../lib/errors";
import LoadingSpinner from "../../components/LoadingSpinner";
import { motion } from "framer-motion";

interface LocationState {
  from?: {
    pathname: string;
  };
}

export default function Login() {
  const { signIn } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  const from = state?.from?.pathname || "/dashboard";

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!formData.password) {
      errors.password = "Password is required";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setFieldErrors({});

    try {
      await signIn(formData.email, formData.password);
      navigate(from, { replace: true });
    } catch (error) {
      if (isValidationError(error)) {
        setFieldErrors({ [error.field || "general"]: error.message });
      } else {
        setFieldErrors({ general: getErrorMessage(error) });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex items-center justify-center px-6 selection:bg-black selection:text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.2, 0, 0, 1] }}
        className="w-full max-w-[400px] space-y-12"
      >
        <div className="space-y-4">
          <Link to="/" className="text-sm font-semibold tracking-tighter hover:text-gray-400 transition-colors">PROMPTVAULT</Link>
          <h1 className="text-4xl font-semibold tracking-tighter">Welcome back.</h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-6" noValidate>
          <div className="space-y-4">
            <div className="relative">
              <input
                type="email"
                placeholder="Email address"
                className={`w-full py-4 bg-transparent border-b ${fieldErrors.email ? 'border-red-500' : 'border-gray-200'} focus:border-black transition-colors outline-none text-lg font-medium tracking-tight placeholder:text-gray-300`}
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                autoComplete="email"
                disabled={isSubmitting}
              />
              {fieldErrors.email && <p className="mt-2 text-xs font-medium text-red-500 uppercase tracking-widest">{fieldErrors.email}</p>}
            </div>

            <div className="relative">
              <input
                type="password"
                placeholder="Password"
                className={`w-full py-4 bg-transparent border-b ${fieldErrors.password ? 'border-red-500' : 'border-gray-200'} focus:border-black transition-colors outline-none text-lg font-medium tracking-tight placeholder:text-gray-300`}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                autoComplete="current-password"
                disabled={isSubmitting}
              />
              {fieldErrors.password && <p className="mt-2 text-xs font-medium text-red-500 uppercase tracking-widest">{fieldErrors.password}</p>}
            </div>
          </div>

          {fieldErrors.general && (
            <div className="p-4 bg-red-50 rounded-xl">
              <p className="text-sm text-red-600 font-medium">{fieldErrors.general}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white py-5 rounded-full font-medium text-lg hover:bg-gray-800 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSubmitting ? <LoadingSpinner size="sm" /> : "Sign in"}
          </button>
        </form>

        <p className="text-gray-400 text-sm font-medium">
          New here? <Link to="/signup" className="text-black hover:underline">Create an account</Link>
        </p>
      </motion.div>
    </div>
  );
}
