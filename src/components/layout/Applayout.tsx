import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./NavBar";
import SideBar from './SideBar';
import Header from './Header';
import { useAuth } from "../../features/auth/hooks/useAuth";


const AppLayout = () => {
  const { isLoggedIn } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
      <SideBar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area (Right side of Sidebar) */}
      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">

        {/* Dashboard Header */}
        <Header onMenuClick={() => setIsSidebarOpen(true)} />

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