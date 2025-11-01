import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import { getErrorMessage, isValidationError } from "../../lib/errors";
import LoadingSpinner from "../../components/LoadingSpinner";

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

  // Clear errors when component mounts
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
    
    // Clear success message when user starts typing
    if (success) {
      setSuccess(null);
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
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    } else if (formData.password.length > 128) {
      errors.password = "Password must be less than 128 characters";
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setFieldErrors({});
    setSuccess(null);

    try {
      const data = await signUp(formData.email, formData.password);
      
      if (data?.user) {
        setSuccess("Please check your email to confirm your account before signing in.");
        // Clear form
        setFormData({
          email: "",
          password: "",
          confirmPassword: "",
        });
        
        // Redirect to login after a delay
        setTimeout(() => {
          navigate("/login", { 
            state: { 
              message: "Account created! Please check your email to verify your account." 
            }
          });
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

  const isFormDisabled = isSubmitting || loading;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-2xl">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Create an account</h2>
          <p className="text-gray-600 mt-2">Join PromptVault today</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4" noValidate>
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
              placeholder="Password (min. 6 characters)"
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                fieldErrors.password
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              disabled={isFormDisabled}
              autoComplete="new-password"
              aria-invalid={!!fieldErrors.password}
              aria-describedby={fieldErrors.password ? "password-error" : undefined}
            />
            {fieldErrors.password && (
              <p id="password-error" className="mt-1 text-sm text-red-600">
                {fieldErrors.password}
              </p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Confirm password"
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                fieldErrors.confirmPassword
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
              disabled={isFormDisabled}
              autoComplete="new-password"
              aria-invalid={!!fieldErrors.confirmPassword}
              aria-describedby={fieldErrors.confirmPassword ? "confirm-password-error" : undefined}
            />
            {fieldErrors.confirmPassword && (
              <p id="confirm-password-error" className="mt-1 text-sm text-red-600">
                {fieldErrors.confirmPassword}
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

          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-600">{success}</p>
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
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link 
            to="/login" 
            className="text-blue-600 hover:underline font-medium"
            tabIndex={isFormDisabled ? -1 : 0}
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}