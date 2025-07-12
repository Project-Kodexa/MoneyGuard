import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "../components/Loader/Loader"; // varsa

const PublicRoute = () => {
  const { token, isLoggedIn, isRefreshing } = useSelector((state) => state.auth);

  // Refresh sırasında boş sayfa göstermemek için
  if (isRefreshing) {
    return <Loader />;
  }

  // Eğer giriş yapılmışsa anasayfaya yönlendir
  return token && isLoggedIn ? <Navigate to="/" /> : <Outlet />;
};

export default PublicRoute;
