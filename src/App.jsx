import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
// import LoginPage from "./features/auth/LoginPage";
// import RegistrationPage from "./features/auth/RegistrationPage";
// import DashboardPage from "./pages/DashboardPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/register" element={<div>Registration Page Placeholder</div>} />
          <Route path="/login" element={<div>Login Page Placeholder</div>} />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route path="/" element={<div>Dash Board Page Placeholder</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
