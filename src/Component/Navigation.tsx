import { FiPlusCircle } from "react-icons/fi";
import {
  HiOutlineBars3,
  HiOutlineXMark,
  HiOutlineCog6Tooth,
  HiOutlineChevronLeft,
  HiOutlineUser,
} from "react-icons/hi2";
import { SiGoogletasks } from "react-icons/si";

import {
  FaAngleDown,
  FaBookJournalWhills,
  FaBrain,
} from "react-icons/fa6";
import { FaHome } from "react-icons/fa";
import { NavLink, useMatch, useNavigate } from "react-router-dom";
import { useState } from "react";

import { useAxios } from "../Providers/AxiosProvider";
import Swal from "sweetalert2";
import { TbBrandMessenger } from "react-icons/tb";
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
  const [isLogOutActive, setLogOutActive] = useState(false);
  const navigate = useNavigate();
  const axios = useAxios();

  //matching active navigation for handle navigation style
  const chatgeneral = useMatch("/chat/general/*");
  const journalLinkMatched = useMatch("/chat/journal/*");
  const internalChallengeMatch = useMatch("/chat/internalChat/*");

  // logout handler
  const handleLogOut = async () => {
    console.log("Logging out...");
    try {
      const response = await axios.post("/api/users/logout/");
      console.log("Logout successful:", response.data);
      if (response.status === 200 || response.status === 201) {
        localStorage.removeItem("user");
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        const modal = document.getElementById(
          "Profile_Modal"
        ) as HTMLDialogElement | null;
        if (modal) modal.close();
      }
      Swal.fire({
        title: "Success!",
        text: "Logout successful.",
        icon: "success",
        confirmButtonText: "OK",
        background: "rgba(255, 255, 255, 0.1)",
        backdrop: "rgba(0, 0, 0, 0.4)",
        customClass: {
          popup: "glassmorphic-popup",
          title: "glassmorphic-title",
          htmlContainer: "glassmorphic-text",
          confirmButton: "glassmorphic-button",
        },
      });
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  console.log("User:", user);

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
        <div className="flex items-center justify-between px-4  md:pt-10 md:px-7">
          {!isDesktopCollapsed && (
            <h1 className="md:text-4xl text-2xl font-montserrat text-center font-bold text-white">
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

        {/* Main Actions - Flex container to separate top and bottom sections */}
        <div className="flex flex-col flex-1 justify-between">
          {/* -----------------Top Section ------------------------ Start New Chat */}
          <div className="p-4 space-y-2">
            <NavLink
              to="/chat/general"
              end
              className={`
                w-full flex items-center gap-3 p-3 rounded-lg
                hover:bg-[#2D2A2B] transition-colors
                ${chatgeneral ? "bg-[#2D2A2B] font-bold" : "hidden"}
                ${isDesktopCollapsed ? "justify-center" : "justify-start"}
              `}
            >
              <TbBrandMessenger size={24} className=" " />
              {!isDesktopCollapsed && (
                <span className="text-xl font-montserrat ">Ai chat</span>
              )}
            </NavLink>
            <NavLink
              to="/chat/mindsetHome"
              className={({ isActive }) => `
                    w-full flex items-center gap-3 p-3 rounded-lg
                    hover:bg-[#2D2A2B] transition-colors
                  ${isActive ? "bg-[#2D2A2B] font-bold" : "hidden"}
                  ${isDesktopCollapsed ? "justify-center" : "justify-start"}
                `}
            >
              <FaBrain size={24} className=" " />
              {!isDesktopCollapsed && (
                <span className="text-xl font-montserrat ">Mindset Mantra</span>
              )}
            </NavLink>
            <div className="flex flex-col gap-3">
              <NavLink
                to="/chat/journal/options"
                className={({ isActive }) => `
                    w-full flex items-center gap-3 p-3 rounded-lg
                    hover:bg-[#2D2A2B] transition-colors
                  ${journalLinkMatched ? "block" : "hidden"}
                  ${isActive ? "bg-[#2D2A2B] font-bold" : ""}
                  ${isDesktopCollapsed ? "justify-center" : "justify-start"}
                `}
              >
                <FaBookJournalWhills size={24} className=" " />
                {!isDesktopCollapsed && (
                  <span className="text-xl font-montserrat ">
                    Add a Journal
                  </span>
                )}
              </NavLink>
              <NavLink
                to="/chat/journal/list"
                className={({ isActive }) => `
                    w-full flex items-center gap-3 p-3 rounded-lg
                    hover:bg-[#2D2A2B] transition-colors
                  ${journalLinkMatched ? "block" : "hidden"}
                  ${isActive ? "bg-[#2D2A2B] font-bold" : ""}
                  ${isDesktopCollapsed ? "justify-center" : "justify-start"}
                `}
              >
                <FaBookJournalWhills size={24} className=" " />
                {!isDesktopCollapsed && (
                  <span className="text-xl font-montserrat ">
                    Journal History
                  </span>
                )}
              </NavLink>
            </div>
            <NavLink
              to="/chat/internalChat/Home"
              className={`
                    w-full flex items-center gap-3 p-3 rounded-lg
                    hover:bg-[#2D2A2B] transition-colors
                  ${internalChallengeMatch ? "bg-[#2D2A2B] font-bold" : "hidden"}
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
            <NavLink
              to="/chat/settings"
              className={({ isActive }) => ` lg:hidden
                    w-full flex items-center gap-3 p-3 rounded-lg
                    hover:bg-[#2D2A2B] transition-colors
                  ${isActive ? "bg-[#2D2A2B] font-bold" : "hidden"}
                  ${isDesktopCollapsed ? "justify-center" : "justify-start"}
                `}
            >
              <HiOutlineCog6Tooth size={24} className=" " />
              {!isDesktopCollapsed && (
                <span className="text-xl font-montserrat ">Settings</span>
              )}
            </NavLink>
          </div>

          {/* ----------------------------Bottom Section--------------- - Other Navigation Items and User Profile */}
          <div>
            {/* ---------bottom links------------- */}
            <div className="p-4 ">
              <NavLink
                to="/chat/general"
                className={`
                w-full flex items-center gap-3 p-3 rounded-lg
                hover:bg-[#2D2A2B] transition-colors
                ${chatgeneral ? "hidden" : "font-medium"}
                ${isDesktopCollapsed ? "justify-center" : "justify-start"}
              `}
              >
                <FiPlusCircle size={24} className=" " />
                {!isDesktopCollapsed && (
                  <span className="text-xl font-montserrat ">Ai chat</span>
                )}
              </NavLink>
              <NavLink
                to="/chat/mindsetHome"
                className={({ isActive }) => `
                    w-full flex items-center gap-3 p-3 rounded-lg
                    hover:bg-[#2D2A2B] transition-colors
                  ${isActive ? "hidden" : "font-medium"}
                  ${isDesktopCollapsed ? "justify-center" : "justify-start"}
                `}
              >
                <FaBrain size={24} className=" " />
                {!isDesktopCollapsed && (
                  <span className="text-xl font-montserrat ">
                    Mindset Mantra
                  </span>
                )}
              </NavLink>
              <NavLink
                to="/chat/journal/options"
                className={({ isActive }) => `
                    w-full flex items-center gap-3 p-3 rounded-lg
                    hover:bg-[#2D2A2B] transition-colors
                  ${isActive ? "hidden" : "font-medium"}
                  ${isDesktopCollapsed ? "justify-center" : "justify-start"}
                `}
              >
                <FaBookJournalWhills size={24} className=" " />
                {!isDesktopCollapsed && (
                  <span className="text-xl font-montserrat ">
                    Add a Journal
                  </span>
                )}
              </NavLink>
              <NavLink
                to="/chat/internalChat/Home"
                className={`
                    w-full flex items-center gap-3 p-3 rounded-lg
                    hover:bg-[#2D2A2B] transition-colors
                  ${internalChallengeMatch ? "hidden" : "font-medium"}
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
              <NavLink
                to="/chat/settings"
                className={({ isActive }) => ` lg:hidden
                    w-full flex items-center gap-3 p-3 rounded-lg
                    hover:bg-[#2D2A2B] transition-colors
                  ${isActive ? "hidden" : "font-medium"}
                  ${isDesktopCollapsed ? "justify-center" : "justify-start"}
                `}
              >
                <HiOutlineCog6Tooth size={24} className=" " />
                {!isDesktopCollapsed && (
                  <span className="text-xl font-montserrat ">Settings</span>
                )}
              </NavLink>
            </div>
            {/* -----divider---------- */}
            <div className="w-10/12 h-[1.5px] bg-cCard mx-auto" />
            <div className={`${!isDesktopCollapsed ? "lg:mb-5" : "mb-0"}`}>
              <NavLink
                to="/"
                end
                className={`w-10/12  flex justify-center items-center gap-3 p-3 rounded-lg px-3
                    hover:bg-[#2D2A2B] transition-colors
                  ${isDesktopCollapsed ? "mb-2 mx-auto" : "mb-0"}
                  cursor-pointer
                  hover:bg-[#232021]
                  transition-all duration-700 ease-in-out"}
              `}
              >
                <FaHome size={24} className="" />
                {!isDesktopCollapsed && (
                  <span className="text-xl font-montserrat font-semibold">
                    Back to Home
                  </span>
                )}
              </NavLink>
              {/* User Profile Section */}
              <div
                className={`
                  flex items-center mx-2 rounded-lg cursor-pointer
                  transition-colors
                  ${
                    isDesktopCollapsed
                      ? "justify-center mb-5 "
                      : "justify-start mb-4 "
                  }
                  hover:bg-[#2d2a2b]
                  px-2 py-2
                  sm:px-3 sm:py-2
                `}
                style={{ marginTop: "12px" }}
                onClick={() => setLogOutActive((prev) => !prev)}
              >
                <div className="flex items-center gap-2 w-full">
                  <div className="border rounded-full p-1 flex-shrink-0">
                    {user.profile_image &&
                    typeof user.profile_image === "string" &&
                    user.profile_image.length > 0 ? (
                      <img
                        src={
                          user.profile_image.startsWith("/media")
                            ? `http://10.10.12.53:8000${user.profile_image}`
                            : user.profile_image
                        }
                        alt="Profile"
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <HiOutlineUser size={24} />
                    )}
                  </div>
                  {!isDesktopCollapsed && (
                    <div className="text-base sm:text-lg md:text-xl flex flex-col font-bold text-white truncate">
                      {user.name ? user.name : "Unknown User"}
                      <span className="text-sm font-medium text-gray-400">
                        {user.is_subscribed
                          ? "Enterprise Package"
                          : "Free Package "}
                      </span>
                    </div>
                  )}
                  <span className="ml-auto">
                    <FaAngleDown size={20} className="text-white" />
                  </span>
                </div>
              </div>
              {/* ------logout-------- */}
              <div
                className={`
                  flex items-center justify-center
                  w-11/12 mx-auto
                  rounded-lg
                  bg-[#2d2a2b]
                  text-white text-base sm:text-lg md:text-xl font-bold
                  py-2
                  ${isDesktopCollapsed ? "mb-2" : "mb-4"}
                  cursor-pointer
                  hover:bg-[#232021]
                  transition-all duration-700 ease-in-out
                  ${
                    isLogOutActive
                      ? "opacity-100 max-h-20 mt-1 pointer-events-auto "
                      : "opacity-0 max-h-0 mt-0 pointer-events-none hidden"
                  }
                  overflow-hidden
                `}
                tabIndex={0}
                role="button"
                onClick={() => {
                  const modal = document.getElementById(
                    "Profile_Modal"
                  ) as HTMLDialogElement | null;
                  if (modal) modal.showModal();
                }}
                aria-hidden={!isLogOutActive}
              >
                Log Out
              </div>
            </div>
          </div>
        </div>

        {isDesktopCollapsed && (
          <div className="w-10/12 h-[1.5px] bg-cCard mx-auto" />
        )}
        {isDesktopCollapsed && (
          <div className={`px-2 ${!isDesktopCollapsed ? "lg:mb-18" : "mb-2"}`}>
            <NavLink
              to="/chat/settings"
              className={({ isActive }) => `
                w-full flex justify-center mt-2 p-2 rounded-lg transition-colors
                ${
                  isActive
                    ? "bg-[#2a2f2d] text-white"
                    : "hover:bg-[#2a2f2d] text-white"
                }
              `}
            >
              <HiOutlineCog6Tooth size={28} />
            </NavLink>
          </div>
        )}
      </div>

      <dialog id="Profile_Modal" className="modal">
        <div className="modal-box max-w-lg text-center lg:px-20 pt-10 lg:pt-40 bg-[#111111]">
          <h1 className="font-semibold font-montserrat  text-3xl">
            Logout Confirmation
          </h1>
          <p className="py-9 font-montserrat text-xl">
            Press ESC key or click the button below to close
          </p>
          <div className="modal-action">
            <div className="flex justify-center w-full gap-6 pb-10 lg:pb-40">
              <button
                onClick={() => {
                  const modal = document.getElementById(
                    "Profile_Modal"
                  ) as HTMLDialogElement | null;
                  if (modal) modal.close();
                }}
                className="btn bg-[#2a2f2d] px-8 text-2xl font-semibold font-inter py-1 border-none text-white transition-colors duration-200 hover:bg-[#393939] hover:text-cCard focus:outline-none focus:ring-2 focus:ring-cCard transform hover:scale-105 active:scale-95"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleLogOut();
                }}
                className="btn bg-cCard px-8 text-2xl font-semibold font-inter py-1 border-none "
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default Navigation;
