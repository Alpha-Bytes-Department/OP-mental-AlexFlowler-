import React, { useEffect, useRef, useState } from "react";
import { FaArrowUp } from "react-icons/fa6";
import { useAxios } from "../../../Providers/AxiosProvider";
import { useParams } from "react-router-dom";
import logo from "../../../../public/bgLogo.svg";
import Swal from "sweetalert2";

// ----type declaration---------
interface Message {
  error_message?: string; // Changed from number to string for better error handling
  message: string[];
  phase?: string;
  question?: string;
  response?: string;
  summary?: string;
  is_session_complete?: boolean;
}

const InternalChat = () => {
  //--------states--------
  const [messages, setMessages] = useState<Message[]>([]); // stores chat messages
  const [inputMessage, setInputMessage] = useState(""); // handles input field text
  const [isLoading, setIsLoading] = useState(false); // loading state for sending messages
  const [isSessionComplete, setIsSessionComplete] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true); // loading state for initial data fetch
  const messagesEndRef = useRef<HTMLDivElement>(null); // ref for auto-scroll
  const axios = useAxios();
  const params = useParams();

  // Store session_id in localStorage only once when component mounts
  useEffect(() => {
    if (params?.session_id) {
      localStorage.setItem("chat-session", params.session_id);
    }
  }, [params?.session_id]);

  //--------- auto-scroll function --------
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  //--------- scroll effect on new message --------
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  //--------- input change handler --------
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
  };

  // Initial data fetch
  useEffect(() => {
    const fetchInitialMessages = async () => {
      if (!params?.session_id) {
        setIsInitialLoading(false);
        return;
      }

      try {
        setIsInitialLoading(true);
        const res = await axios.get(
          `/api/internal-challenge/${params.session_id}/`
        );
        console.log("response when initial loading", res);

        if (res?.data) {
          setMessages(Array.isArray(res.data) ? res.data : []);
        }
      } catch (error) {
        console.error("Error fetching initial messages:", error);
        Swal.fire({
          title: "Error!",
          text: "Failed to load chat history. Please refresh the page.",
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
        setIsInitialLoading(false);
      }
    };

    fetchInitialMessages();
  }, [params?.session_id, axios]);

  //--------- message send handler --------
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !params?.session_id) {
      return;
    }

    const messageToSend = inputMessage.trim();
    setInputMessage(""); // Clear input immediately for better UX
    setIsLoading(true);

    try {
      // Send the message to the API
      const response = await axios.post("/api/internal-challenge/", {
        message: messageToSend,
        session_id: params.session_id,
      });

      console.log("debuging internal challenge....", response);

      // Fetch all messages after sending
      const res = await axios.get(
        `/api/internal-challenge/${params.session_id}/`
      );

      console.log("get response checking.......", res);

      if (res?.data) {
        setMessages(Array.isArray(res.data) ? res.data : []);
      }

      const length = messages.length;

      if (length > 0 && messages[length - 1].is_session_complete === true) {
        setIsSessionComplete(true);
      }
    } catch (error) {
      // Restore the message in input on error
      setInputMessage(messageToSend);

      Swal.fire({
        title: "Error!",
        text: "Something went wrong. Please try again.",
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

      console.error("Error sending/receiving message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  //--------- enter key handler --------
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isLoading) {
      handleSendMessage();
    }
  };

  // Loading spinner component
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center p-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#DBD0A6]"></div>
    </div>
  );

  // Initial loading state
  if (isInitialLoading) {
    return (
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
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner />
            <p className="text-[#DBD0A6] mt-4">Loading chat history...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
        <div className="flex flex-col items-center gap-3">
          <img
            src={logo}
            alt="Mindset chat background"
            className="lg:ms-52 h-[400px] w-[400px] lg:h-[600px] lg:w-[600px]"
          />
        </div>
      </div>

      {/* --------------- Messages area ---------------------- */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.length === 0 && !isInitialLoading ? (
            <div className="text-center text-[#DBD0A6] opacity-60 mt-20">
              <p>No messages yet. Start a conversation!</p>
            </div>
          ) : (
            messages.map((message, index: number) => {
              const showPhase =
                index === 0 || message?.phase !== messages[index - 1]?.phase;

              return (
                <React.Fragment key={`message-${index}`}>
                  {/* ---------- Showing message after trigger start --------------*/}
                  {message?.message && message.message.length > 0 && (
                    <div className="max-w-[70%] rounded-lg p-3 bg-[#DBD0A6] text-black">
                      {message.message.map((item: string, msgIndex: number) => (
                        <p key={`msg-${index}-${msgIndex}`}>{item}</p>
                      ))}
                    </div>
                  )}

                  {/* ------- Showing phase only once for similar items ------------------*/}
                  {showPhase && message?.phase && (
                    <h1 className="border border-[#DBD0A6] bg-[#2d2d2d] px-20 py-3 rounded text-[#DBD0A6] text-center">
                      {message.phase}
                    </h1>
                  )}

                  {/* --------------------- showing ai response---------------- */}
                  {message?.question && (
                    <div className="flex flex-col justify-start">
                      <div className="max-w-[70%] rounded-lg p-3 bg-[#393B3C] text-white">
                        {message.question}
                      </div>
                      {message?.error_message && (
                        <p className="text-red-600 mt-2 text-sm">
                          {message.error_message}
                        </p>
                      )}
                    </div>
                  )}
                  {/*------------------- showing summery-------------------  */}
                  {message?.summary && (
                    <h1 className=" text-white px-20 py-3 rounded bg-[#b94326] text-center">
                      {message.phase}
                    </h1>
                  )}

                  {/* ---------------- Showing user response--------------- */}
                  {message?.response && (
                    <div className="flex justify-end">
                      <div className="max-w-[70%] rounded-lg p-3 bg-[#DBD0A6] text-black">
                        {message.response}
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })
          )}

          {/* Show loading indicator when sending message */}
          {isLoading && (
            <div className="flex justify-center">
              <div className="bg-[#393B3C] rounded-lg p-3">
                <LoadingSpinner />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* --------------- Input area ---------------------- */}
      <div className="p-4 mb-40 md:mb-15 lg:mb-0">
        <div className="max-w-3xl mx-auto flex gap-4 rounded-lg bg-gradient-to-t from-black/80 via-black/40 to-transparent backdrop-blur-sm p-4">
          <input
            type="text"
            value={inputMessage}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            disabled={isLoading || isSessionComplete}
            placeholder={
              isSessionComplete
                ? "Chat session has ended"
                : isLoading
                ? "Sending..."
                : "Type your message..."
            }
            className="w-full py-2 sm:py-3 lg:py-4 pl-2 sm:pl-4 pr-8 sm:pr-12 text-sm sm:text-base text-white bg-white/20 backdrop-blur-md rounded-lg sm:rounded-xl outline-none focus:ring-2 focus:ring-cCard/50 transition-all placeholder-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="button"
            onClick={handleSendMessage}
            disabled={isLoading || !inputMessage.trim() || isSessionComplete}
            className="bg-cCard disabled:bg-cCard/20 disabled:cursor-not-allowed text-white rounded-md sm:rounded-lg p-1.5 sm:p-2 md:p-2.5 lg:p-3 transition-colors min-w-[44px] flex items-center justify-center"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
            ) : (
              <FaArrowUp className="text-black w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InternalChat;
