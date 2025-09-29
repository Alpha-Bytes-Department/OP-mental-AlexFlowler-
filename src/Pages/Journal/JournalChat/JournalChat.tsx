import React, { useEffect, useRef, useState, useCallback } from "react";
import { FaArrowUp } from "react-icons/fa6";
import logo from "../../../../public/bgLogo.svg";
import { useParams } from "react-router-dom";
import { useAxios } from "../../../Providers/AxiosProvider";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";

// ----type declaration---------
interface Message {
  id: string | number;
  message: string;
  sender: "user" | "bot";
  status: "success" | "loading" | "error";
}

interface JournalEntry {
  author: "user" | "bot";
  message: string;
}

// Corrected FormData type
interface FormData {
  message: string;
}

const JournalChat = () => {
  //--------states--------
  const [messages, setMessages] = useState<Message[]>([]); // stores chat messages
  const [initialLoading, setInitialLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Add loading state for sending messages
  const messagesEndRef = useRef<HTMLDivElement>(null); // ref for auto-scroll
  const axios = useAxios();
  const params = useParams();
  const { handleSubmit, reset, watch, setValue } = useForm<FormData>({
    defaultValues: { message: "" },
  });
  const watchedMessage = watch("message", "");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  //--------- auto-scroll function --------
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  //---------------getting chat at initial loading---------
  const initialLoadingMessage = useCallback(async () => {
    if (!params?.session_id) {
      console.error("No session ID provided");
      return;
    }

    try {
      setInitialLoading(true);
      const response = await axios.get(
        `api/journaling/sessions/${params.session_id}/`
      );

      console.log("console log for debugging...........", response);

      if (response.status === 200 && response.data) {
        const transformedMessages: Message[] = []; // array for storing message

        // More robust checking for Entries
        if (response.data.Entries && Array.isArray(response.data.Entries)) {
          console.log(
            "Processing entries, length:",
            response.data.Entries.length
          );

          response.data.Entries.forEach((item: JournalEntry, index: number) => {
            if (item?.author && item?.message) {
              const transformedMessage = {
                id: `${item.author}-${index}-${Date.now()}`, // More unique ID
                message: item.message,
                sender: item.author,
                status: "success" as const,
              };
              console.log("Adding transformed message:", transformedMessage);
              transformedMessages.push(transformedMessage);
            } else {
              console.warn(
                `Skipping entry ${index} due to missing author or message:`,
                item
              );
            }
          });
        } else {
          console.warn("No valid entries found in response data");
          // Check if the data structure is different than expected
          console.log(
            "Available keys in response.data:",
            Object.keys(response.data || {})
          );
        }

        console.log("Final transformed messages:", transformedMessages);
        setMessages(transformedMessages);
      } else {
        console.warn(
          "Unexpected response status or no data:",
          response.status,
          response.data
        );
      }
    } catch (error) {
      console.error("Error loading initial messages:", error);

      Swal.fire({
        title: "Error!",
        text: "Something went wrong loading the chat history. Please try again.",
        icon: "error",
        background: "rgba(255, 255, 255, 0.1)",
        backdrop: "rgba(0, 0, 0, 0.4)",
        timer: 3000,
        showConfirmButton: false,
        customClass: {
          popup: "glassmorphic-popup",
          title: "glassmorphic-title",
          htmlContainer: "glassmorphic-text",
        },
      });
    } finally {
      setInitialLoading(false);
    }
  }, [axios, params?.session_id]);

  useEffect(() => {
    console.log("useEffect triggered for initialLoadingMessage");
    initialLoadingMessage();
  }, [initialLoadingMessage]);

  //--------- scroll effect on new message --------
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Replace handleInputChange with auto-resize logic
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue("message", e.target.value);
    autoResizeTextarea(e.target);
  };

  const autoResizeTextarea = (textarea: HTMLTextAreaElement) => {
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 200) + "px";
  };

  //--------- message send handler --------
  const onSubmit = async (data: FormData) => {
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
      message: "thinking",
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
      setIsLoading(true);
      const response = await axios.post("api/journaling/chat/", {
        session_id: params?.session_id,
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
    } finally {
      setIsLoading(false);
    }
  };

  //--------- enter key handler --------
   const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  //-------------showing loading status-----------
  return initialLoading ? (
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
  ) : (
    <div className="flex flex-col h-screen">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="flex flex-col items-center gap-3">
          <img
            src={logo}
            alt="Mindset chat background"
            className="lg:ms-52 h-[400px] w-[400px] lg:h-[600px] lg:w-[600px]"
          />
        </div>
      </div>

      {/* --------------- Messages area ---------------------- */}
      <div className="flex-1 overflow-y-auto px-2 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 pb-24">
        <div className="flex flex-col gap-2 sm:gap-3 md:gap-4 py-4 max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto min-h-full">
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
                        : item.status === "loading"
                        ? "bg-transparent border border-cCard text-white/70 mr-auto"
                        : "bg-transparent border border-cCard text-white mr-auto"
                    }`}
                  >
                    <p>
                      {item.status === "loading" ? (
                        <span className="flex items-center gap-2">
                          {item.message}
                          <span className="flex space-x-1">
                            <span className="w-1 h-1 bg-current rounded-full animate-bounce inline-block"></span>
                            <span
                              className="w-1 h-1 bg-current rounded-full animate-bounce inline-block"
                              style={{ animationDelay: "0.1s" }}
                            ></span>
                            <span
                              className="w-1 h-1 bg-current rounded-full animate-bounce inline-block"
                              style={{ animationDelay: "0.2s" }}
                            ></span>
                          </span>
                        </span>
                      ) : (
                        item.message
                      )}
                    </p>
                    {/* {completed && item.sender === "bot" && (
                      <p className="text-red-600 text-xs mt-2">
                        Your session is complete
                      </p>
                    )} */}
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
  );
};

export default JournalChat;
