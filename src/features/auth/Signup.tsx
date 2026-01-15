import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import { getErrorMessage, isValidationError } from "../../lib/errors";
import LoadingSpinner from "../../components/LoadingSpinner";
import { motion } from "framer-motion";

export default function Signup() {
  const { signUp, loading, error: authError, clearError } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (authError) clearError();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: "" }));
    }
    if (success) setSuccess(null);
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
    } else if (formData.password.length < 6) {
      errors.password = "Minimum 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setFieldErrors({});
    setSuccess(null);

    try {
      const data = await signUp(formData.email, formData.password);
      if (data?.user) {
        setSuccess("Check your email to verify your account.");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (error) {
      if (isValidationError(error)) {
        setFieldErrors({ [error.field || 'general']: error.message });
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
          <h1 className="text-4xl font-semibold tracking-tighter">Create account.</h1>
        </div>

        <form onSubmit={handleSignup} className="space-y-6" noValidate>
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
                autoComplete="new-password"
                disabled={isSubmitting}
              />
              {fieldErrors.password && <p className="mt-2 text-xs font-medium text-red-500 uppercase tracking-widest">{fieldErrors.password}</p>}
            </div>

            <div className="relative">
              <input
                type="password"
                placeholder="Confirm password"
                className={`w-full py-4 bg-transparent border-b ${fieldErrors.confirmPassword ? 'border-red-500' : 'border-gray-200'} focus:border-black transition-colors outline-none text-lg font-medium tracking-tight placeholder:text-gray-300`}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                autoComplete="new-password"
                disabled={isSubmitting}
              />
              {fieldErrors.confirmPassword && <p className="mt-2 text-xs font-medium text-red-500 uppercase tracking-widest">{fieldErrors.confirmPassword}</p>}
            </div>
          </div>

          {(fieldErrors.general || authError) && (
            <div className="p-4 bg-red-50 rounded-xl">
              <p className="text-sm text-red-600 font-medium">
                {fieldErrors.general || authError as string}
              </p>
            </div>
          )}

          {success && (
            <div className="p-4 bg-green-50 rounded-xl">
              <p className="text-sm text-green-600 font-medium">{success}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white py-5 rounded-full font-medium text-lg hover:bg-gray-800 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSubmitting ? <LoadingSpinner size="sm" color="white" /> : "Sign up"}
          </button>
        </form>

        <p className="text-gray-400 text-sm font-medium">
          Already have an account? <Link to="/login" className="text-black hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}
