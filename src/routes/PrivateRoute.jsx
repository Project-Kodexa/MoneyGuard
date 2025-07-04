import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = () => {
  const isAuth = useSelector((state) => state.auth.token);
  return isAuth ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
