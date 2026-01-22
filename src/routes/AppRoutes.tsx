import { useState, useEffect, Suspense, lazy } from "react";
import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";
import AppLayout from "../components/layout/Applayout";
import DailyDishLoader from "../components/feedback/DailyDishLoader";


// Lazy Load Pages
const LandingPage = lazy(() => import('../features/landingpage/pages/LandingPage'));
const RecipesPage = lazy(() => import('../features/landingpage/components/ExploreRecipes'));
const HowItWorks = lazy(() => import('../features/landingpage/components/HowItWorks'));
const Login = lazy(() => import('../features/auth/pages/Login'));
const SignUp = lazy(() => import("../features/auth/pages/SignUp"));
const SplashScreen = lazy(() => import('../features/splashscreen/pages/SplashScreen'));
const RecipeConfiguration = lazy(() => import("../features/pantry/components/RecipeConfiguration"));
const RecipeDetails = lazy(() => import("../features/pantry/components/RecipeDetails"));
const AiCuratedMenu = lazy(() => import("../features/pantry/components/AiCuratedMenu"));
const SavedRecipes = lazy(() => import("../features/pantry/pages/SavedRecipes"));
const MealPlan = lazy(() => import("../features/pantry/pages/MealPlan"));


const SplashToLanding = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      setShowLoader(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showLoader) {
      const timer = setTimeout(() => {
        setShowLoader(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showLoader]);

  if (showSplash) return <SplashScreen />;
  if (showLoader) return <DailyDishLoader />;
  return <LandingPage />;
};

// Route Guards
const PrivateRoute = () => {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return <DailyDishLoader />;
  }

  return isLoggedIn ? <Outlet /> : <Navigate to="/" replace />;
};

const PublicRoute = () => {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return <DailyDishLoader />;
  }

  // Redirect to dashboard/configured page if already logged in
  // return !isLoggedIn ? <Outlet /> : <Navigate to="/recipe-details" replace />;
  // return !isLoggedIn ? <Outlet /> : <Navigate to="/ai-menu" replace />;
  return !isLoggedIn ? <Outlet /> : <Navigate to="/recipe-configuration" replace />;
};

function AppRoutes() {
  return (
    <Suspense fallback={<DailyDishLoader />}>
      <Routes>
        {/* --- PUBLIC ROUTES --- */}
        <Route element={<PublicRoute />}>
          <Route path="/" element={<SplashToLanding />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="explore-recipes" element={<RecipesPage />} />
           <Route path="How-it-Works" element={<HowItWorks />} />
        </Route>

        {/* --- PROTECTED ROUTES --- */}
        <Route element={<PrivateRoute />}>
          <Route element={<AppLayout />}>
            <Route path="recipe-configuration" element={<RecipeConfiguration />} />
            <Route path="recipe-details" element={<RecipeDetails />} />
            <Route path="ai-menu" element={<AiCuratedMenu />} />
            <Route path="saved-recipes" element={<SavedRecipes />} />
            <Route path="meal-plan" element={<MealPlan />} />
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