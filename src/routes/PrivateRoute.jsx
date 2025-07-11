import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = () => {
  const { token, isLoggedIn } = useSelector((state) => state.auth);
  
  // Hem token hem de login durumunu kontrol et
  const isAuthenticated = token && isLoggedIn;
  
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
