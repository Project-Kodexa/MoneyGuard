import {useSelector } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import Loader from "./components/Loader"; 
import Currency from "./components/Currency/Currency";
import { Provider } from 'react-redux';
import store from './redux/store'; // store doğru yoldan import

<Provider store={store}>
  <App />
</Provider>

// import LoginPage from "./features/auth/LoginPage";
// import RegistrationPage from "./features/auth/RegistrationPage";
// import DashboardPage from "./pages/DashboardPage";

function App() {
 habibe
const isLoading = useSelector((state) => state.global.isLoading);


 main
  return (
     <div>
    <Currency />

      {isLoading && <Loader />}
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
    </div>
  );
}

export default App;
