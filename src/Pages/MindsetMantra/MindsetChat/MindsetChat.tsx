import React, { useEffect, useRef, useState } from "react";
import { FaArrowUp } from "react-icons/fa6";
import logo from "../../../../public/bgLogo.svg";
import { useParams } from "react-router-dom";
import { useAxios } from "../../../Providers/AxiosProvider";
import { useForm } from "react-hook-form";

// ----type declaration---------
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

// Define proper type for response data
interface ChatResponse {
  id?: number;
  message: string;
  role: "user" | "assistant";
  timestamp?: string;
}

const MindsetChat = () => {
  //--------states--------
  const [messages, setMessages] = useState<Message[]>([]); // stores chat messages
  const [initialLoading, setinitialLoading] = useState(false);
  const [isLoading] = useState(false); // Retained isLoading for potential future use
  const messagesEndRef = useRef<HTMLDivElement>(null); // ref for auto-scroll
  const textareaRef = useRef<HTMLTextAreaElement>(null); // ref for textarea
  const axios = useAxios();
  const params = useParams();

  // Replace inputMessage with useForm
  const { handleSubmit, reset, watch, setValue } = useForm<FormData>({
    defaultValues: { message: "" },
  });
  const watchedMessage = watch("message");

  //--------- auto-scroll function --------
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  //---------------getting chat at initial loading---------
  useEffect(() => {
    const initialLoadingMessage = async () => {
      try {
        setinitialLoading(true);
        const response = await axios.get<ChatResponse[]>(
          `api/mindset/history/${params?.mindset_session}/`
        );
      
        if (response?.status === 200) {
        const transformedMessages: Message[] = [];
        if (Array.isArray(response?.data)) {
          response?.data?.forEach((item: any, idx: number) => {
            if (item.author === "user") {
              transformedMessages.push({
                id: `user-${item.id ?? idx}`,
                message: item.message,
                sender: "user",
                status: "success",
                timestamp: item.timestamp,
              });
            }
            if (item.author === "bot") {
              transformedMessages.push({
                id: `bot-${item.id ?? idx}`,
                message: item.message,
                sender: "bot",
                status: "success",
                timestamp: item.timestamp,
              });
            }
          });
        }
        setMessages(transformedMessages);
      }
      } catch (error) {
        console.error("Error loading chat data:", error);
      } finally {
        setinitialLoading(false);
      }
    };

    initialLoadingMessage();
  }, [params?.mindset_session, axios]);

  //--------- scroll effect on new message --------
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  //--------- auto-resize textarea function --------
  const autoResizeTextarea = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 200) + "px";
  };

  //--------- input change handler --------
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue("message", e.target.value);
    autoResizeTextarea(e.target);
  };

  //--------- message send handler --------
  const handleSendMessage = async (data: FormData) => {
    if (!data.message.trim()) return;

    const userMessageId = Date.now();
    const newUserMessage: Message = {
      id: userMessageId,
      message: data.message,
      sender: "user",
      status: "success",
    };

    setMessages((prev) => [...prev, newUserMessage]);

    const botMessageId = userMessageId + 1;
    const loadingBotMessage: Message = {
      id: botMessageId,
      message: "",
      sender: "bot",
      status: "loading",
    };

    setMessages((prev) => [...prev, loadingBotMessage]);

    reset();
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = "40px";
    }

    try {
      const response = await axios.post("api/mindset/", {
        session_id: params?.mindset_session,
        message: data.message,
      });

      setMessages((prev) => {
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
      setMessages((prev) =>
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
    }
  };

  //--------- enter key handler --------
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(handleSendMessage)();
    }
    // Allow Shift+Enter for new line
  };

  //-------------showing loading status-----------
  if (initialLoading) {
    return (
      <div  className="h-screen flex items-center justify-center text-white">
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
    <div className="flex flex-col h-screen">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="flex flex-col items-center gap-3">
          <img
            src={logo}
            alt="Mindset chat background"
            className=" lg:ms-52 h-[400px] w-[400px] lg:h-[600px] lg:w-[600px]"
          />
        </div>
      </div>
      {/* --------------- Messages area ---------------------- */}
      <div  className="flex-1 overflow-y-auto px-2 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16" style={{
            paddingBottom: "250px",
            WebkitOverflowScrolling: "touch", //  smooth scrolling on mobile
          }}>
        <div className="flex flex-col gap-2 sm:gap-3 md:gap-4 py-4 max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto ">
          {messages.length > 0 ? (
            <>
              {messages.map((item) => (
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
                      <div className="flex items-center gap-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-white rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-white rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-300">
                          AI is thinking...
                        </span>
                      </div>
                    ) : (
                      <>
                        {item.message.split("\n").map((line, index) => (
                          <p key={index} className="space-x-1">{line}</p>
                        ))}
                      </>
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

      {/* --------------- Input area ---------------------- */}
      <div className="fixed bottom-0 left-0 right-0 px-2 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 py-4 lg:ml-[280px] z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent backdrop-blur-sm">
        <div className="max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto">
          <form
            className="w-full max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-3xl xl:max-w-4xl 2xl:max-w-5xl mx-auto"
            onSubmit={handleSubmit(handleSendMessage)}
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
                style={{ height: "60px", minHeight: "60px" }}
                disabled={isLoading}
                autoComplete="off"
              />
              <button
                type="submit"
                disabled={isLoading || !watchedMessage?.trim()}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full px-4 py-2 text-white shadow-md transition-all duration-200 ease-in-out bg-cCard disabled:bg-cCard/20 disabled:cursor-not-allowed"
              >
                <FaArrowUp className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MindsetChat;