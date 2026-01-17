
import { Route, Routes } from "react-router-dom";
import LandingPage from '../features/landingpage/pages/LandingPage';
import Login from '../features/auth/pages/Login';


function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="login" element={<Login />} />
   
      </Routes>
  )
}

export default AppRoutes