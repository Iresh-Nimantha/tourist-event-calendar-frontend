import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const LoginSuccess = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  useEffect(() => {
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      // Refresh user data from backend
      refreshUser().then(() => {
        navigate("/admin/dashboard", { replace: true });
      });
    } else {
      navigate("/login");
    }
  }, [navigate, refreshUser]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Logging in with Google...</p>
      </div>
    </div>
  );
};

export default LoginSuccess;
