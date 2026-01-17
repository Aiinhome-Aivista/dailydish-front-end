import { Outlet } from "react-router-dom";
import Navbar from "./NavBar";
import Sidebar from "./SideBar";
import Header from "./Header";
import { useAuth } from "../../features/auth/hooks/useAuth";

const AppLayout = () => {
  const { isLoggedIn } = useAuth();
 
  // ------------------------------------------------------------------
  // CASE 1: PUBLIC USER (Not Logged In)
  // Shows: Navbar -> Page Content
  // ------------------------------------------------------------------
  if (!isLoggedIn) {
    return (
      <div className="flex min-h-screen flex-col">
        {/* Public Navigation */}
        <Navbar />
        
        {/* The Page Content (Homepage, Login, Register) */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar - Controlled by state for mobile responsiveness */}
      <Sidebar  />

      {/* Main Content Area (Right side of Sidebar) */}
      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        
        {/* Dashboard Header */}
        <Header />

        {/* Dashboard Page Content */}
        <main>
          <div className="mx-auto w-full p-4 md:p-6 2xl:p-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;