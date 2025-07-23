import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AuthRequired = ({ message, redirectTo, children }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return children;
  }

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Authentication Required
        </h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>{message || "You need to be signed in to access this feature."}</p>
        </div>
        <div className="mt-5">
          <Link
            to={`/login${redirectTo ? `?redirect=${redirectTo}` : ""}`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Sign In
          </Link>
          <Link
            to={`/register${redirectTo ? `?redirect=${redirectTo}` : ""}`}
            className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthRequired;
