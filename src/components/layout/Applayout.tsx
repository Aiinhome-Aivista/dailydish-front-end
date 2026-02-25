import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./NavBar";
import SideBar from './SideBar';
import Header from './Header';
import { useAuth } from "../../features/auth/hooks/useAuth";
import BgImage from "../../assets/backgroundimage.svg";



const AppLayout = () => {
  const { isLoggedIn } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Meal Plan State (Lifted)
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');

  const handlePrev = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

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
    <div className="flex h-screen ">
      {/* Sidebar - Controlled by state for mobile responsiveness */}
      <SideBar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area (Right side of Sidebar) */}
      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">

        <div className="absolute inset-0 flex justify-center  pointer-events-none z-0">
          <img
            src={BgImage}
            alt="Healthy Food Background"
            className="object-cover w-full h-full opacity-30"
          />
        </div>

        {/* Dashboard Header */}
        <Header
          onMenuClick={() => setIsSidebarOpen(true)}
          className="relative z-10"
          currentDate={currentDate}
          viewMode={viewMode}
          onPrev={handlePrev}
          onNext={handleNext}
          onViewChange={setViewMode}
          onToday={() => setCurrentDate(new Date())}
        />

        {/* Dashboard Page Content */}
        <main className="relative z-10">
          <div className="mx-auto w-full p-4 md:p-8 ">
            <Outlet context={{ currentDate, viewMode }} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;