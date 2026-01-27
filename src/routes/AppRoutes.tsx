import { useState, useEffect, Suspense, lazy } from "react";
import { Route, Routes, Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";
import AppLayout from "../components/layout/Applayout";
import DailyDishLoader from "../components/feedback/DailyDishLoader";
import LandingPage from "../features/landingpage/pages/LandingPage";


// Lazy Load Pages
// LandingPage loaded manually in SplashToLanding
const RecipesPage = lazy(() => import('../features/landingpage/components/ExploreRecipes'));
const HowItWorks = lazy(() => import('../features/landingpage/components/HowItWorks'));
const NutritionalScoring = lazy(() => import('../features/landingpage/pages/NutritionalScoring'));
const AiPersonalization = lazy(() => import('../features/landingpage/pages/AiPersonalization'));
const SpeedEfficiency = lazy(() => import('../features/landingpage/pages/SpeedEfficiency'));
const Login = lazy(() => import('../features/auth/pages/Login'));
const SignUp = lazy(() => import("../features/auth/pages/SignUp"));
const SplashScreen = lazy(() => import('../features/splashscreen/pages/SplashScreen'));
const RecipeConfiguration = lazy(() => import("../features/pantry/components/RecipeConfiguration"));
const RecipeDetails = lazy(() => import("../features/pantry/components/RecipeDetails"));
const AiCuratedMenu = lazy(() => import("../features/pantry/components/AiCuratedMenu"));
const SavedRecipes = lazy(() => import("../features/pantry/pages/SavedRecipes"));
const MealPlan = lazy(() => import("../features/pantry/pages/MealPlan"));


const SplashToLanding = () => {
  const [phase, setPhase] = useState<'splash' | 'loader' | 'landing'>('splash');
  const [LandingComponent, setLandingComponent] = useState<any>(null);

  useEffect(() => {
    // 1. Splash Timer (3s)
    const splashTimer = setTimeout(() => {
      setPhase('loader');
    }, 3000);

    // 2. Preload LandingPage + Minimum Wait (7s total = 3s Splash + 4s Loader)
    Promise.all([
      new Promise(resolve => setTimeout(resolve, 7000)),
      import('../features/landingpage/pages/LandingPage')
    ])
      .then(([_, module]) => {
        setLandingComponent(() => module.default);
        setPhase('landing');
      })
      .catch(err => {
        console.error("Failed to load LandingPage", err);
        // Fallback or error handling if needed, though rare
      });

    return () => clearTimeout(splashTimer);
  }, []);

  if (phase === 'splash') return <SplashScreen />;
  if (phase === 'loader') return <DailyDishLoader />;
  if (phase === 'landing' && LandingComponent) return <LandingComponent />;

  return <DailyDishLoader />;
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
          <Route path="landing" element={<LandingPage />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="explore-recipes" element={<RecipesPage />} />
          <Route path="How-it-Works" element={<HowItWorks />} />
          <Route path="nutritional-scoring" element={<NutritionalScoring />} />
          <Route path="ai-personalization" element={<AiPersonalization />} />
          <Route path="speed-efficiency" element={<SpeedEfficiency />} />
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