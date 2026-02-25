import { useState, useEffect, Suspense, lazy } from "react";
import { Route, Routes, Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";
import AppLayout from "../components/layout/Applayout";
import DailyDishLoader from "../components/feedback/DailyDishLoader";



// Lazy Load Pages
// LandingPage loaded manually in SplashToLanding
const RecipesPage = lazy(() => import('../features/landingpage/components/ExploreRecipes'));
const LandingPage = lazy(() => import('../features/landingpage/pages/LandingPage'));
const HowItWorks = lazy(() => import('../features/landingpage/components/HowItWorks'));
const NutritionalScoring = lazy(() => import('../features/landingpage/pages/NutritionalScoring'));
const AiPersonalization = lazy(() => import('../features/landingpage/pages/DoctorFoodiePersonalization'));
const SpeedEfficiency = lazy(() => import('../features/landingpage/pages/SpeedEfficiency'));
const SplashScreen = lazy(() => import('../features/splashscreen/pages/SplashScreen'));
const RecipeConfigurationChat = lazy(() => import("../features/pantry/components/RecipeConfigurationChat"));
const RecipeDetails = lazy(() => import("../features/pantry/components/RecipeDetails"));
const AiCuratedMenu = lazy(() => import("../features/pantry/components/AiCuratedMenu"));
const SavedRecipes = lazy(() => import("../features/pantry/pages/SavedRecipes"));
const MealPlan = lazy(() => import("../features/pantry/pages/MealPlan"));
const ShareMasterpiece = lazy(() => import("../features/pantry/pages/ShareMasterpiece"));
const Community = lazy(() => import("../features/community/pages/Community"));
const CommunityPostDetails = lazy(() => import("../features/community/pages/CommunityPostDetails"));
const ContactUs = lazy(() => import("../support/ContactUs"));
const PrivacyPolicy = lazy(() => import("../legal/PrivacyPolicy"));
const HelpCenter = lazy(() => import("../support/HelpCenter"));
const AdminLogin = lazy(() => import("../features/admin/pages/AdminLogin"));
const AdminDashboard = lazy(() => import("../features/admin/pages/AdminDashboard"));
const AllBlogPost = lazy(() => import("../features/admin/pages/AllBlogPost"));
const ManageBlogPost = lazy(() => import("../features/community/pages/ManageBlogPost"));

const SplashToLanding = () => {
  const location = useLocation();
  const shouldSkipSplash = location.state?.skipSplash;
  const [phase, setPhase] = useState<'splash' | 'landing'>(shouldSkipSplash ? 'landing' : 'splash');
  const [LandingComponent, setLandingComponent] = useState<any>(null);

  useEffect(() => {
    if (shouldSkipSplash) return;

    // Preload LandingPage + Minimum Wait (3s total)
    Promise.all([
      new Promise(resolve => setTimeout(resolve, 3000)),
      import('../features/landingpage/pages/LandingPage')
    ])
      .then(([_, module]) => {
        setLandingComponent(() => module.default);
        setPhase('landing');
      })
      .catch(err => {
        console.error("Failed to load LandingPage", err);
      });
  }, [shouldSkipSplash]);

  if (shouldSkipSplash) return <LandingPage />;
  if (phase === 'splash') return <SplashScreen />;
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
  if (!isLoggedIn) return <Outlet />;

  // Check if we have a pending AI generation
  const pendingChat = localStorage.getItem('pending_chat_context');
  if (pendingChat) {
    return <Navigate to="/ai-menu" replace />;
  }

  // Default redirect
  return <Navigate to="/recipe-configuration-chat" replace />;
};

function AppRoutes() {
  return (
    <Suspense fallback={<DailyDishLoader />}>
      <Routes>
        <Route path="blog" element={<Community />} />
        <Route path="community/:slug" element={<CommunityPostDetails />} />

        {/* --- PUBLIC ROUTES --- */}
        <Route element={<PublicRoute />}>
          <Route path="/" element={<SplashToLanding />} />

          {/* Login and SignUp pages kept as fallbacks */}
          <Route path="login" element={<SplashToLanding />} />
          <Route path="signup" element={<SplashToLanding />} />
        </Route>

        <Route path="explore-recipes" element={<RecipesPage />} />
        <Route path="How-it-Works" element={<HowItWorks />} />
        <Route path="nutritional-scoring" element={<NutritionalScoring />} />
        <Route path="ai-personalization" element={<AiPersonalization />} />
        <Route path="speed-efficiency" element={<SpeedEfficiency />} />
        <Route path="contact-us" element={<ContactUs />} />
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        <Route path="help-center" element={<HelpCenter />} />
        <Route path="/admin" element={<AdminLogin />} />


        {/* --- PROTECTED ROUTES --- */}
        <Route element={<PrivateRoute />}>
          <Route element={<AppLayout />}>

            <Route path="recipe-configuration-chat" element={<RecipeConfigurationChat />} />
            <Route path="recipe-details" element={<RecipeDetails />} />
            <Route path="ai-menu" element={<AiCuratedMenu />} />
            <Route path="saved-recipes" element={<SavedRecipes />} />
            <Route path="meal-plan" element={<MealPlan />} />
            <Route path="share-masterpiece" element={<ShareMasterpiece />} />
            <Route path="manage-blog-post" element={<ManageBlogPost />} />



            {/* Add more protected routes here */}
          </Route>
        </Route>


        <Route element={<PrivateRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/all-blog-posts" element={<AllBlogPost />} />
        </Route>

        {/* --- 404 CATCH-ALL --- */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

export default AppRoutes;