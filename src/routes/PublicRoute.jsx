import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PublicRoute = () => {
  const tokenFromState = useSelector((state) => state.auth.token);
  const token = tokenFromState || localStorage.getItem("token");

  // Giriş yapılmışsa dashboard'a yönlendir, değilse erişime izin ver
  return token ? <Navigate to="/" /> : <Outlet />;
};

export default PublicRoute;
