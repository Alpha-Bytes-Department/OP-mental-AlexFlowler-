import { NavLink, Outlet } from "react-router-dom";
import { useState } from "react";
import { HiOutlineCog6Tooth } from "react-icons/hi2";
import Navigation from "../../../Component/Navigation";

const ChatLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleDesktopCollapse = () => {
    setIsDesktopCollapsed(!isDesktopCollapsed);
  };

  return (
    <div
      className="flex h-screen bg-black text-white fixed w-full"
      style={{
        backgroundImage: "url('/background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Navigation
        isMobileMenuOpen={isMobileMenuOpen}
        isDesktopCollapsed={isDesktopCollapsed}
        toggleMobileMenu={toggleMobileMenu}
        toggleDesktopCollapse={toggleDesktopCollapse}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Settings Button for Desktop */}
        {!isDesktopCollapsed && (
          <div className="hidden lg:block absolute top-4 right-4 z-50">
            <NavLink
              to="/chat/settings"
              className={({ isActive }) =>
                `w-full flex justify-center mt-2 p-2 rounded-lg transition-colors ${
                  isActive ? "bg-[#2a2f2d] text-white" : "hover:bg-[#2a2f2d] text-white"
                }`
              }
              style={{ pointerEvents: "auto" }}
            >
              <HiOutlineCog6Tooth size={28} />
            </NavLink>
          </div>
        )}

        {/* Page Content */}
        <div className="flex-1 pt-16 lg:pt-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ChatLayout;


