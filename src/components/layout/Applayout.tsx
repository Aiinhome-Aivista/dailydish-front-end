import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./NavBar";
import SideBar from './SideBar';
import Header from './Header';
import { useAuth } from "../../features/auth/hooks/useAuth";
import BackgroundVideo from "../../assets/videos/foodvideo.mp4";


const AppLayout = () => {
  const { isLoggedIn } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // ------------------------------------------------------------------
  // CASE 1: PUBLIC USER (Not Logged In)
  // Shows: Navbar -> Page Content
  // ------------------------------------------------------------------
  if (!isLoggedIn) {
    return (
      <div className="flex min-h-screen flex-col relative overflow-hidden">
        {/* Video Background Layer */}
        <div className="fixed inset-0 z-0 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-1/2 left-1/2 min-w-full min-h-full object-cover -translate-x-1/2 -translate-y-1/2"
          >
            <source src={BackgroundVideo} type="video/mp4" />
          </video>
          {/* Overlay for readability */}
          <div className="absolute inset-0"></div>
        </div>

        {/* Public Navigation */}
        <div className="relative z-10">
          <Navbar />
        </div>

        {/* The Page Content */}
        <main className="flex-1 relative z-10">
          <Outlet />
        </main>
      </div>
    );
  }


  return (
    <div className="flex h-screen relative overflow-hidden">
      {/* Video Background Layer */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-1/2 left-1/2 min-w-full min-h-full object-cover -translate-x-1/2 -translate-y-1/2"
        >
          <source src={BackgroundVideo} type="video/mp4" />
        </video>
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      {/* Sidebar */}
      <div className="relative z-10 h-full flex transform-gpu">
        <SideBar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex flex-1 flex-col overflow-y-auto overflow-x-hidden">

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