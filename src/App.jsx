import { BrowserRouter, Routes, Route } from "react-router-dom";

import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import Loader from "./components/Loader"; 
import LoginPage from "../src/assets/components/LoginPage.jsx";
import RegistrationPage from "./features/auth/RegistrationPage.jsx";
import DashboardPage from "./pages/DashboardPage";

import { useSelector } from "react-redux";
function App() {
  const isLoading = useSelector((state) => state.global.isLoading);

  return (
    <>
      {isLoading && <Loader />}
      
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route
            path="/register"
            element={<div>Registration Page Placeholder</div>}
          />
          <Route path="/login" element={<LoginPage />} />
        </Route>

          <Route element={<PrivateRoute />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/currency" element={<Currency />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
