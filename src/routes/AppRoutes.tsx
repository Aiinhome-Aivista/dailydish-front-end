import { useState, useEffect, Suspense, lazy } from "react";
import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";
import AppLayout from "../components/layout/Applayout";
import PageLoader from "../components/feedback/PageLoader";



// Lazy Load Pages
const LandingPage = lazy(() => import('../features/landingpage/pages/LandingPage'));
const Login = lazy(() => import('../features/auth/pages/Login'));
const SignUp = lazy(() => import("../features/auth/pages/SignUp"));
const SplashScreen = lazy(() => import('../features/splashscreen/pages/SplashScreen'));
const RecipeConfiguration = lazy(() => import("../features/pantry/components/RecipeConfiguration"));
const RecipeDetails = lazy(() => import("../features/pantry/components/RecipeDetails"));
const AiCuratedMenu = lazy(() => import("../features/pantry/components/AiCuratedMenu"));

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

// Route Guards
const PrivateRoute = () => {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return <PageLoader />;
  }

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

const PublicRoute = () => {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return <PageLoader />;
  }

  // Redirect to dashboard/configured page if already logged in
  // return !isLoggedIn ? <Outlet /> : <Navigate to="/recipe-details" replace />;
  return !isLoggedIn ? <Outlet /> : <Navigate to="/ai-menu" replace />;
};

function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* --- PUBLIC ROUTES --- */}
        <Route element={<PublicRoute />}>
          <Route path="/" element={<SplashToLanding />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<SignUp />} />
        </Route>

        {/* --- PROTECTED ROUTES --- */}
        <Route element={<PrivateRoute />}>
          <Route element={<AppLayout />}>
            <Route path="recipe-configuration" element={<RecipeConfiguration />} />
            <Route path="recipe-details" element={<RecipeDetails />} />
            <Route path="ai-menu" element={<AiCuratedMenu />} />
            {/* Add more protected routes here */}
          </Route>
        </Route>

        {/* --- 404 CATCH-ALL --- */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

export default AppRoutes;