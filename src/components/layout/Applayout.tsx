import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./NavBar";
import SideBar from './SideBar';
import Header from './Header';
import { useAuth } from "../../features/auth/hooks/useAuth";

import Tomato from '../../assets/tamato.avif';
import Leaf from '../../assets/pudina.avif';
import momos from '../../assets/momos.avif';
import pizza from '../../assets/pizza.avif';
import burger from '../../assets/bargar.avif';
import RightLine from '../../assets/Right-line.avif';
import Line from '../../assets/line.avif';
import EatHealthyBg from '../../assets/eat-healthy.svg';


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
    <div className="flex h-screen ">
      {/* Sidebar - Controlled by state for mobile responsiveness */}
      <SideBar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area (Right side of Sidebar) */}
      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">

        {/* Global Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <img src={Line} className="absolute w-full h-full opacity-40" alt="" />
          <img src={RightLine} className="absolute w-full h-full opacity-40" alt="" />

          {/* Floating Food Elements */}
          <img src={Leaf} className="absolute top-[10%] left-[28%] w-20 rotate-12" alt="mint" />
          <img src={burger} className="absolute top-[38%] left-[4%] w-32 -rotate-12 blur-[0.5px]" alt="burger" />
          <img src={momos} className="absolute top-[8%] right-[10%] w-36 rotate-6" alt="dumplings" />
          <img src={pizza} className="absolute bottom-[20%] right-[3%] w-40 -rotate-12" alt="pizza" />
          <img src={Leaf} className="absolute bottom-[10%] right-[8%] w-20 rotate-12" alt="mint" />
          <img src={Tomato} className="absolute top-[35%] right-[5%] w-20" alt="tomato" />
          <img src={Tomato} className="absolute bottom-[15%] left-[5%] w-20" alt="tomato" />
        </div>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-50">
          <img
            src={EatHealthyBg}
            alt="Healthy Food Background"
            className="w-2/3 max-w-xs object-contain"
          />
        </div>

        {/* Dashboard Header */}
        <Header onMenuClick={() => setIsSidebarOpen(true)} className="relative z-10" />

        {/* Dashboard Page Content */}
        <main className="relative z-10">
          <div className="mx-auto w-full p-4 md:p-6 2xl:p-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;