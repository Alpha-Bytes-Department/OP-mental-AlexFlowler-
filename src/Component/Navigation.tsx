import { FiPlusCircle } from "react-icons/fi";
import {
  HiOutlineBars3,
  HiOutlineXMark,
  HiOutlineChatBubbleLeft,
  HiOutlineCog6Tooth,
  HiOutlineChevronLeft,
  HiOutlineUser,
} from "react-icons/hi2";
import { SiGoogletasks } from "react-icons/si";
import { FaAngleDown, FaBookJournalWhills, FaBrain } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import { useState } from "react";

interface NavigationProps {
  isMobileMenuOpen: boolean;
  isDesktopCollapsed: boolean;
  toggleMobileMenu: () => void;
  toggleDesktopCollapse: () => void;
}

const Navigation = ({
  isMobileMenuOpen,
  isDesktopCollapsed,
  toggleMobileMenu,
  toggleDesktopCollapse,
}: NavigationProps) => {
  const chatHistory = [
    {
      id: 1,
      title: "Chat history",
    },
    { id: 2, title: "Chat history" },
    {
      id: 3,
      title: "Chat history",
    },
    {
      id: 4,
      title: "Chat history",
    },
    {
      id: 5,
      title: "Chat history",
    },
    {
      id: 6,
      title: "Chat history",
    },
    {
      id: 7,
      title: "Chat history",
    },
    {
      id: 8,
      title: "Chat history",
    },
    {
      id: 9,
      title: "Chat history",
    },
    {
      id: 10,
      title: "Chat history",
    },
    {
      id: 11,
      title: "Chat history",
    },
  ];
const [isLogOutActive,setLogOutActive] = useState(false);
  return (
    <>
      {/* Mobile Hamburger Menu */}
      <div
        className={`lg:hidden fixed top-4 ${
          !isMobileMenuOpen ? "left-4" : "left-48"
        } duration-300 transition-all z-50`}
      >
        <button
          onClick={toggleMobileMenu}
          className="p-2 rounded-lg bg-black/70 backdrop-blur-sm hover:bg-black/80 transition-colors border border-hCard text-hCard"
        >
          {isMobileMenuOpen ? (
            <HiOutlineXMark className="w-6 h-6 " />
          ) : (
            <HiOutlineBars3 className="w-6 h-6 " />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`
          fixed lg:relative inset-y-0 left-0 z-40 transform transition-all duration-300 ease-in-out
          ${
            isMobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
          ${
            isDesktopCollapsed
              ? "lg:w-28"
              : "lg:w-72  lg:bg-transparent lg:backdrop-blur-none "
          }
          w-64 bg-black/10  backdrop-blur-md   flex flex-col
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4  md:pt-10 md:px-7">
          {!isDesktopCollapsed && (
            <h1 className="md:text-5xl text-2xl font-montserrat text-center font-bold text-white">
              OP Ai
            </h1>
          )}

          {/* Desktop Collapse Button */}
          <button
            onClick={toggleDesktopCollapse}
            className="hidden lg:block p-1 rounded hover:bg-white/10 transition-colors"
          >
            {isDesktopCollapsed ? (
              <img src="/image.png" alt="OP Ai Logo" className="w-10 h-10" />
            ) : (
              <HiOutlineChevronLeft
                size={28}
                className="text-hCard font-bold"
              />
            )}
          </button>
        </div>

        <div className="w-10/12 h-[1.5px] bg-cCard mx-auto" />
        {isMobileMenuOpen && (
          <div className="md:h-11/12 h-full lg:hidden w-[2px] absolute left-64 lg:left-72 lg:my-7 bg-cCard" />
        )}
        {!isDesktopCollapsed && (
          <div className="md:h-11/12 h-full hidden lg:block w-[2px] absolute left-64 lg:left-72 lg:my-7 bg-cCard" />
        )}

        {/* Main Actions */}
        <div className="p-4 space-y-2">
          <NavLink
            to="/chat"
            end
            className={({ isActive }) => `
              w-full flex items-center gap-3 p-3 rounded-lg
              hover:bg-[#2D2A2B] transition-colors 
              ${isActive ? "bg-[#2D2A2B] font-bold" : "font-medium"}
              ${isDesktopCollapsed ? "justify-center" : "justify-start"}
            `}
          >
            <FiPlusCircle size={24} className=" " />
            {!isDesktopCollapsed && (
              <span className="text-xl font-montserrat ">Start new chat</span>
            )}
          </NavLink>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-hidden">
          <div className="px-4 space-y-1  overflow-y-auto max-h-96">
            {chatHistory.map((chat) => (
              <NavLink
                key={chat.id}
                to={`/chat/${chat.id}`}
                className={({ isActive }) => `
                        flex items-center gap-3 p-3 rounded-lg
                        hover:bg-[#2D2A2B] transition-colors
                        ${isActive ? "bg-[#2D2A2B]" : ""}
                        ${
                          isDesktopCollapsed
                            ? "justify-center"
                            : "justify-start"
                        }
                    `}
              >
                <div className=" flex items-center justify-center">
                  <HiOutlineChatBubbleLeft size={24} className="" />
                </div>
                {!isDesktopCollapsed && (
                  <div className="flex-1 min-w-0">
                    <div className="text-xl font-medium text-white">
                      {chat.title}
                    </div>
                  </div>
                )}
              </NavLink>
            ))}
          </div>
        </div>

        {/* User Profile */}

        <div className="p-4 space-y-2">
          <NavLink
            to="/mindset"
            className={({ isActive }) => `
                w-full flex items-center gap-3 p-3 rounded-lg
                hover:bg-[#2D2A2B] transition-colors
              ${isActive ? "bg-[#2D2A2B] font-bold" : "font-medium"}
              ${isDesktopCollapsed ? "justify-center" : "justify-start"}
            `}
          >
            <FaBrain size={24} className=" " />
            {!isDesktopCollapsed && (
              <span className="text-xl font-montserrat ">Mindset Mantra</span>
            )}
          </NavLink>
          <NavLink
            to="/journal"
            className={({ isActive }) => `
                w-full flex items-center gap-3 p-3 rounded-lg
                hover:bg-[#2D2A2B] transition-colors
              ${isActive ? "bg-[#2D2A2B] font-bold" : "font-medium"}
              ${isDesktopCollapsed ? "justify-center" : "justify-start"}
            `}
          >
            <FaBookJournalWhills size={24} className=" " />
            {!isDesktopCollapsed && (
              <span className="text-xl font-montserrat ">Journal</span>
            )}
          </NavLink>
          <NavLink
            to="/internal-challenge"
            className={({ isActive }) => `
                w-full flex items-center gap-3 p-3 rounded-lg
                hover:bg-[#2D2A2B] transition-colors
              ${isActive ? "bg-[#2D2A2B] font-bold" : "font-medium"}
              ${isDesktopCollapsed ? "justify-center" : "justify-start"}
            `}
          >
            <SiGoogletasks size={24} className=" " />
            {!isDesktopCollapsed && (
              <span className="text-xl font-montserrat ">
                Internal Challenge
              </span>
            )}
          </NavLink>
        </div>
        <div className="w-10/12 h-[1.5px] bg-cCard mx-auto" />
        <div className="mb-18">
          <div
            className={`
              flex items-center mx-2 rounded-lg cursor-pointer
              transition-colors
              ${isDesktopCollapsed ? "justify-center mb-5 mt-2" : "justify-start mb-4 mt-2"}
              hover:bg-[#2d2a2b]
              px-2 py-2
              sm:px-3 sm:py-2
            `}
            style={{ marginTop: '12px' }}
            onClick={() => setLogOutActive((prev) => !prev)}
          >
            <div className="flex items-center gap-2 w-full">
              <div className="border rounded-full p-1 flex-shrink-0">
          <HiOutlineUser size={24} />
              </div>
              {!isDesktopCollapsed && (
          <div className="text-base sm:text-lg md:text-xl font-bold text-white truncate">
            alex_fowler
          </div>
              )}
              <span className="ml-auto">
          <FaAngleDown size={20} className="text-white" />
              </span>
            </div>
          </div>
          <div
            className={`
              flex items-center justify-center
              w-10/12 mx-auto
              rounded-lg
              bg-[#2d2a2b]
              text-white text-base sm:text-lg md:text-xl font-bold
              py-2
              ${isDesktopCollapsed ? "mb-5" : "mb-4"}
              cursor-pointer
              hover:bg-[#232021]
              transition-all duration-700 ease-in-out
              ${isLogOutActive ? "opacity-100 max-h-20 mt-1 pointer-events-auto" : "opacity-0 max-h-0 mt-0 pointer-events-none"}
              overflow-hidden
            `}
            tabIndex={0}
            role="button"
            aria-hidden={!isLogOutActive}
          >
            Log Out
          </div>
        </div>

        

        {isDesktopCollapsed && (
          <div className="w-10/12 h-[1.5px] bg-cCard mx-auto" />
        )}
        {isDesktopCollapsed && (
          <div className=" px-2 pb-28">
            <button className="w-full flex justify-center p-2 rounded-lg hover:bg-white/10 transition-colors">
              <HiOutlineCog6Tooth size={28} />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Navigation;
