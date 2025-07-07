import React from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
// import LoginPage from "./features/auth/LoginPage";
import RegistrationPage from "./features/auth/RegistrationPage.jsx";
// import DashboardPage from "./pages/DashboardPage";

import Loader from "./components/Loader";
import LoginPage from "./assets/components/LoginPage.jsx"; // Yolun doğru olduğuna emin ol
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
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/login" element={<div>{LoginPage}</div>} />
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
