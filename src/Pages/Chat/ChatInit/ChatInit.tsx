import { FaArrowUp } from "react-icons/fa6";
import { useEffect, useRef, useState } from "react";
import { useAxios } from "../../../Providers/AxiosProvider";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../../../Providers/AuthProvider";
// import { set } from "react-hook-form";

// interface Message {
//   id: number | string;
//   message: string;
//   sender: "user" | "bot";
//   status: "success" | "loading" | "error";
//   timestamp?: string;
// }

// interface FormData {
//   message: string;
// }

interface UserResponse {
  allow_chat_history: boolean;
  // add other API fields here
}

const ChatInit = () => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const axios = useAxios();
  const navigate = useNavigate();
  const [historyPermission, setHistoryPermission] = useState<boolean>(false);
  const { user } = useAuth();

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    const textarea = e.target;
    textarea.style.height = "auto"; // Reset height to recalculate
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`; // Set new height, max 200px
  };

  // fetching history permission from API
  const checkingAdminAccess = async () => {
    try {
      const res = await axios.get<UserResponse>("/api/chatbot/settings");
      // pass the actual value directly to showingPopup
      const hasAccess = res?.data?.allow_chat_history ?? false;
      await showingPopup(hasAccess); // Pass the value directly
    } catch (error) {
      console.error("Error checking admin access:", error);
    }
  };

  // showing popup accroding to admin access
  const showingPopup = async (hasAdminAccess: boolean) => {
    try {
      if (hasAdminAccess) {
        Swal.fire({
          title: "Do you want to save chat history?",
          icon: "info",
          iconColor: "#DBD0A6",
          confirmButtonText: "YES",
          showCancelButton: true,
          cancelButtonText: "NO",
          background: "rgba(255, 255, 255, 0.1)",
          backdrop: "rgba(0, 0, 0, 0.4)",
          customClass: {
            popup: "glassmorphic-popup",
            title: "glassmorphic-title",
            htmlContainer: "glassmorphic-text",
            confirmButton: "glassmorphic-button",
          },
        }).then(async (result) => {
          if (result.isConfirmed) {
            setHistoryPermission(true);
          } else {
            setHistoryPermission(false);
          }
        });
      } else {
        setHistoryPermission(false);
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Could not start a new chat session. Please try again.",
        icon: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  //initializing admin access and popup
  useEffect(() => {
    checkingAdminAccess();
  }, []);

  //sending message to backend
  const handleSendMessage = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    if (!message.trim() || isLoading) return;
    setIsLoading(true);
    if (user && user?.is_subscribed === true) {
      const sessionRes = await axios.post("/api/chatbot/start/", {
        save_history: historyPermission,
        message: message,
      });

      try {
        if (sessionRes.data?.session_id) {
          // If we have a sessionId, send the message
          await axios.post("/api/chatbot/message/", {
            session_id: sessionRes.data?.session_id,
            message: message,
          });
          // Navigate to the chat session
          navigate(`/chat/${sessionRes.data?.session_id}`);
        }
      } catch (error) {
        console.error("Error sending message:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      user &&
        Swal.fire({
          title: "Subscribe to chat",
          text: "To access this feature, please subscribe to one of our plans.",
          icon: "info",
          iconColor: "#DBD0A6",
          confirmButtonText: "OK",
          showCancelButton: true,
          background: "rgba(255, 255, 255, 0.1)",
          backdrop: "rgba(0, 0, 0, 0.4)",
          customClass: {
            popup: "glassmorphic-popup",
            title: "glassmorphic-title",
            htmlContainer: "glassmorphic-text",
            confirmButton: "glassmorphic-button",
          },
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/", { replace: false });
            setTimeout(() => {
              const pricingElement = document.getElementById("pricing");
              if (pricingElement) {
                pricingElement.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }
            }, 500); // Adjust delay if needed
          } else {
            setIsLoading(false);
            return;
          }
        });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center text-center">
      <div className="space-y-8 w-full">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold text-white font-league-gothic">
            Start a New Chat
          </h1>
          <h2 className="text-2xl md:text-3xl font-medium text-white/80 font-league-gothic">
            What can I help with?
          </h2>
        </div>
        {/* Chat Input */}
        <div className="w-full px-4">
          <div className="max-w-xs sm:max-w-sm md:max-w-xl lg:max-w-xl xl:max-w-2xl 2xl:max-w-3xl mx-auto">
            <form
              onSubmit={handleSendMessage}
              className="w-full max-w-xs sm:max-w-sm md:max-w-xl lg:max-w-xl xl:max-w-2xl 2xl:max-w-3xl mx-auto"
            >
              <div className="relative w-full flex justify-center items-center">
                <textarea
                  ref={textareaRef}
                  value={message}
                  placeholder="Message ....."
                  rows={1}
                  onChange={handleTextChange}
                  onKeyDown={handleKeyPress}
                  disabled={isLoading}
                  className="w-full py-2 sm:py-4 lg:py-4 xl:py-4 2xl:py-3 pl-3 sm:pl-4 md:pl-5 lg:pl-6 xl:pl-7 2xl:pl-8 pr-12 sm:pr-14 md:pr-16 lg:pr-18 xl:pr-20 2xl:pr-24 text-sm sm:text-base md:text-lg lg:text-xl text-white bg-white/20 backdrop-blur-md rounded-xl sm:rounded-2xl outline-none focus:ring-2 focus:ring-cCard/50 transition-all placeholder-gray-300 resize-none overflow-hidden min-h-[40px] max-h-[200px]"
                  style={{
                    height: "auto",
                    minHeight: "60px", // You can adjust this
                  }}
                  autoComplete="off"
                />
                <div className="absolute right-2 sm:right-3 md:right-4 top-1/2 -translate-y-1/2 flex items-center">
                  <button
                    type="submit"
                    disabled={isLoading || !message.trim()}
                    className="bg-cCard disabled:bg-cCard/20 disabled:cursor-not-allowed text-white rounded-md sm:rounded-lg p-2 sm:p-3 md:p-3 lg:p-4 transition-colors flex items-center justify-center"
                    style={{
                      minWidth: "40px", // Ensure button has a minimum width
                      height: "40px", // Ensure consistent height
                    }}
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                    ) : (
                      <FaArrowUp className="text-black w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInit;
