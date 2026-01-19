import { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import LandingPage from '../features/landingpage/pages/LandingPage';
import Login from '../features/auth/pages/Login';
import SplashScreen from '../features/splashscreen/pages/SplashScreen';

const SplashToLanding = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return showSplash ? <SplashScreen /> : <LandingPage />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SplashToLanding />} />
      <Route path="login" element={<Login />} />
   
      </Routes>
  )
}

export default AppRoutes