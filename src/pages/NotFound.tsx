import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-4xl font-bold text-blue-600">404</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Page Not Found</h1>
          <p className="text-gray-600">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="space-y-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <Home size={16} />
            Go Home
          </Link>
          
          <div className="text-center">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              <ArrowLeft size={16} />
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}