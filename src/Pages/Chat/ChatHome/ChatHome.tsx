import { useState, useRef, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { FaArrowUp } from "react-icons/fa6";
import { useAxios } from "../../../Providers/AxiosProvider";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../Providers/AuthProvider";
import { useStatus } from "../../../Providers/StatusProvider";

interface Message {
  id: number | string;
  message: string;
  sender: "user" | "bot";
  status: "success" | "loading" | "error";
  timestamp?: string;
}

interface FormData {
  message: string;
}

const ChatHome = () => {
  const [messageData, setMessageData] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const { user } = useAuth();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const axios = useAxios();
  const navigate = useNavigate();
  const { setChatGeneralHistory } = useStatus();

  const { handleSubmit, reset, watch, setValue } = useForm<FormData>({
    defaultValues: { message: "" },
  });

  const watchedMessage = watch("message");

  // Auto scroll to bottom when new messages are added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messageData]);

  // Auto-resize textarea
  const autoResizeTextarea = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 200) + "px";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue("message", e.target.value);
    autoResizeTextarea(e.target);
  };

  // Notification for history
  const handleChatInit = useCallback(async () => {
    Swal.fire({
      title: "Do you want to save chat history?",
      icon: "info",
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
      if (result?.isConfirmed) {
        localStorage.setItem("chatHistory", "true");
        setChatGeneralHistory("true");

        if (user && user?.is_subscribed !== true) {
          Swal.fire({
            title: "Subscribe to chat",
            text: "To continue, please subscribe to one of our plans.",
            icon: "info",
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
              }, 500);
            }
          });
        }

        const res = await axios.post("/api/chatbot/start/", {
          save_history: true,
        });
        setSessionId(res?.data?.session_id);
      } else {
        localStorage.setItem("chatHistory", "false");
        setChatGeneralHistory("false");

        if (user?.is_subscribed !== true) {
          Swal.fire({
            title: "Subscribe to chat",
            text: "To continue, please subscribe to one of our plans.",
            icon: "info",
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
              }, 500);
            }
          });
        }
        const res = await axios.post("/api/chatbot/start/", {
          save_history: false,
        });
        setSessionId(res?.data?.session_id);
      }
    });
  }, [axios, navigate, setChatGeneralHistory, user]);

  useEffect(() => {
    handleChatInit();
  }, [handleChatInit]); // Added 'handleChatInit' to the dependency array

  // Load existing chat data
  const LoadData = useCallback(async () => {
    try {
      setIsInitialLoading(true);
      const response = await axios.get(`/api/chatbot/history/${sessionId}/`);
      if (response.status === 200) {
        const transformedMessages: Message[] = [];

        if (Array.isArray(response.data)) {
          response.data.forEach(
            (item: {
              role: string;
              id?: number;
              message: string;
              timestamp?: string;
            },
            idx: number) => {
              if (item.role === "user") {
                transformedMessages.push({
                  id: `user-${item.id ?? idx}`,
                  message: item.message,
                  sender: "user",
                  status: "success",
                  timestamp: item.timestamp,
                });
              }
              if (item.role === "assistant") {
                transformedMessages.push({
                  id: `bot-${item.id ?? idx}`,
                  message: item.message,
                  sender: "bot",
                  status: "success",
                  timestamp: item.timestamp,
                });
              }
            }
          );
        }
        setMessageData(transformedMessages);
      }
    } catch (error) {
      console.error("Error loading chat data:", error);
    } finally {
      setIsInitialLoading(false);
    }
  }, [axios, sessionId]); // Added 'LoadData' to the dependency array

  useEffect(() => {
    LoadData();
  }, [LoadData]); // Added 'LoadData' to the dependency array

  const onSubmit = async (data: FormData) => {
    if (!data.message.trim()) return;

    const userMessageId = Date.now();
    const newUserMessage: Message = {
      id: userMessageId,
      message: data.message,
      sender: "user",
      status: "success",
    };

    setMessageData((prev) => [...prev, newUserMessage]);

    const botMessageId = userMessageId + 1;
    const loadingBotMessage: Message = {
      id: botMessageId,
      message: "",
      sender: "bot",
      status: "loading",
    };

    setMessageData((prev) => [...prev, loadingBotMessage]);

    reset();
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = "40px";
    }

    try {
      setIsLoading(true);
      const response = await axios.post("/api/chatbot/message/", {
        session_id: sessionId,
        message: data.message,
      });

      if (response.status === 208) {
        Swal.fire({
          title: "Subscribe to chat",
          text: response.data.reply,
          icon: "info",
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
            }, 500);
          }
        });
      }

      setMessageData((prev) => {
        const filteredMessages = prev.filter((msg) => msg.id !== botMessageId);
        return [
          ...filteredMessages,
          {
            id: response?.data?.session_id || Date.now(),
            message: response?.data?.reply || "I received your message!",
            sender: "bot",
            status: "success",
          },
        ];
      });
    } catch (error) {
      console.error("Error sending message:", error);
      setMessageData((prev) =>
        prev.map((msg) =>
          msg.id === botMessageId
            ? {
                ...msg,
                message: "Failed to get response. Please try again.",
                status: "error" as const,
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  if (isInitialLoading) {
    return (
      <div className="h-screen flex items-center justify-center text-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
            <div
              className="w-3 h-3 bg-white rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-3 h-3 bg-white rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
          <p className="text-lg">Loading chat history...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fadeInUp {
            animation: fadeInUp 0.6s ease-out forwards;
          }
        `}
      </style>

      <div className="h-screen flex flex-col text-white">
        {/* Chat Messages Area */}
        <div
          className="flex-1 overflow-y-auto px-2 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16"
          style={{
            paddingBottom: "200px", //  ensures messages not hidden by input
            WebkitOverflowScrolling: "touch", //  smooth scrolling on mobile
          }}
        >
          <div className="flex flex-col gap-3 sm:gap-4 md:gap-5 py-4 max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto">

            {messageData?.length > 0 ? (
              <>
                {messageData?.map((item) => (
                  <div
                    key={item.id}
                    className={`flex animate-fadeInUp ${
                      item.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`text-start max-w-[85%] sm:max-w-xs md:max-w-sm lg:max-w-lg xl:max-w-2xl 2xl:max-w-3xl p-3 sm:p-4 md:p-5 lg:p-6 rounded-xl sm:rounded-2xl text-sm sm:text-base md:text-lg leading-relaxed ${
                        item.sender === "user"
                          ? "bg-cCard text-black ml-auto"
                          : item.status === "error"
                          ? "bg-red-900/30 border border-red-500 text-red-200 mr-auto"
                          : "bg-transparent border border-cCard text-white mr-auto"
                      }`}
                    >
                      {item.status === "loading" ? (
                        <div className="flex items-center gap-2">
                          <div className="flex space-x-1">
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-bounce"></div>
                            <div
                              className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                          <span className="text-xs sm:text-sm text-gray-300">
                            Thinking...
                          </span>
                        </div>
                      ) : (
                        <p>{item.message}</p>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            ) : (
              <div className="flex flex-col justify-center items-center h-full text-center space-y-8">
                <div className="space-y-4">
                  <h1 className="text-5xl md:text-6xl font-bold text-white font-league-gothic">
                    Start a New Chat
                  </h1>
                  <h2 className="text-2xl md:text-3xl font-medium text-white/80 font-league-gothic">
                    What can I help with?
                  </h2>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chat Input */}
        <div className="fixed bottom-0 left-0 right-0 px-2 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 py-4 lg:ml-[280px] z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent backdrop-blur-sm">
          <div className="max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto">
            <form
              className="w-full max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-3xl xl:max-w-4xl 2xl:max-w-5xl mx-auto"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="relative w-full flex justify-center items-center">
                <textarea
                  ref={textareaRef}
                  value={watchedMessage}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyPress}
                  placeholder="Message ....."
                  rows={1}
                  className="w-full py-2 sm:py-4 lg:py-4 xl:py-4 2xl:py-3 pl-3 sm:pl-4 md:pl-5 lg:pl-6 xl:pl-7 2xl:pl-8 pr-12 sm:pr-14 md:pr-16 lg:pr-18 xl:pr-20 2xl:pr-24 text-sm sm:text-base md:text-lg lg:text-xl text-white bg-white/20 backdrop-blur-md rounded-xl sm:rounded-2xl outline-none focus:ring-2 focus:ring-cCard/50 transition-all placeholder-gray-300 resize-none overflow-hidden min-h-[40px] max-h-[200px]"
                  style={{
                    height: "60px",
                    minHeight: "60px",
                  }}
                  disabled={isLoading}
                  autoComplete="off"
                />
                <div className="absolute right-2 sm:right-3 md:right-4 top-1/2 -translate-y-1/2 flex items-center">
                  <button
                    type="submit"
                    disabled={isLoading || !watchedMessage?.trim()}
                    className="bg-cCard disabled:bg-cCard/20 disabled:cursor-not-allowed text-white rounded-md sm:rounded-lg p-2 sm:p-3 md:p-3 lg:p-4 transition-colors flex items-center justify-center"
                    style={{
                      minWidth: "40px", // Ensure button has a minimum width
                      height: "40px", // Ensure consistent height
                    }}
                  >
                    <FaArrowUp className="text-black w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatHome;
