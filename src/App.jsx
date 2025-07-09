import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import LoginPage from "./components/Login/LoginPage";
import { useSelector } from "react-redux";
import LoginPage from "./features/auth/LoginPage";
import RegistrationPage from "./features/auth/RegistrationPage";
import DashboardPage from "./pages/DashboardPage";

function App() {
  const isLoading = useSelector((state) => state.global.isLoading);

  return (
    <div>
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
            <Route path="/" element={<div>Dash Board Page Placeholder</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
