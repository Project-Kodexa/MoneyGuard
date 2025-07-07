import React from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";

import Currency from "./components/Currency/Currency";
import Loader from "./components/Loader";

import LoginPage from "./components/Login/LoginPage";
import RegistrationPage from "./features/auth/RegistrationPage";
import DashboardPage from "./pages/Dashboard";

function App() {
  const isLoading = useSelector((state) => state.global.isLoading);

  return (
    <>
      {isLoading && <Loader />}

      <BrowserRouter>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/register" element={<RegistrationPage />} />
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
