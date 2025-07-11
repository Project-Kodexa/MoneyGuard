import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "../components/Loader/Loader"; // varsa

const PrivateRoute = () => {
  const { token, isLoggedIn, isRefreshing } = useSelector((state) => state.auth);

  if (isRefreshing) {
    return <Loader />; // refresh sırasında sayfa donmasın diye
  }

  const isAuthenticated = token && isLoggedIn;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
