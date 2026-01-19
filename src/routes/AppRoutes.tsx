import { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import LandingPage from '../features/landingpage/pages/LandingPage';
import Login from '../features/auth/pages/Login';
import SplashScreen from '../features/splashscreen/pages/SplashScreen';
import SignUp from "../features/auth/pages/SignUp";
import RecipeConfiguration from "../features/recipeconfiguration/pages/RecipeConfiguration";

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
      <Route path="signup" element={<SignUp/>} />
      <Route path="recipe-configuration" element={<RecipeConfiguration />} />
    </Routes>
  )
}

export default AppRoutes