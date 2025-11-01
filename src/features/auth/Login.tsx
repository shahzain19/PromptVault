import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";
import { getErrorMessage, isValidationError } from "../../lib/errors";
import LoadingSpinner from "../../components/LoadingSpinner";

interface LocationState {
  from?: {
    pathname: string;
  };
}

export default function Login() {
  const { signIn, loading, error: authError, clearError } = useAuth();
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

  // Clear errors when component mounts or auth error changes
  useEffect(() => {
    if (authError) {
      clearError();
    }
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: "" }));
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
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setFieldErrors({});

    try {
      await signIn(formData.email, formData.password);
      navigate(from, { replace: true });
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

  const isFormDisabled = isSubmitting || loading;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-2xl">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Welcome back</h2>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4" noValidate>
          <div>
            <input
              type="email"
              placeholder="Email"
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                fieldErrors.email
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              disabled={isFormDisabled}
              autoComplete="email"
              aria-invalid={!!fieldErrors.email}
              aria-describedby={fieldErrors.email ? "email-error" : undefined}
            />
            {fieldErrors.email && (
              <p id="email-error" className="mt-1 text-sm text-red-600">
                {fieldErrors.email}
              </p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                fieldErrors.password
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              disabled={isFormDisabled}
              autoComplete="current-password"
              aria-invalid={!!fieldErrors.password}
              aria-describedby={fieldErrors.password ? "password-error" : undefined}
            />
            {fieldErrors.password && (
              <p id="password-error" className="mt-1 text-sm text-red-600">
                {fieldErrors.password}
              </p>
            )}
          </div>

          {(fieldErrors.general || authError) && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">
                {fieldErrors.general || authError}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isFormDisabled}
            className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link 
            to="/signup" 
            className="text-blue-600 hover:underline font-medium"
            tabIndex={isFormDisabled ? -1 : 0}
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}