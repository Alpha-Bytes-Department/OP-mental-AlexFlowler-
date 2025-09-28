import { useEffect, useRef, useState, useCallback } from "react";
import logo from "../../../../public/bgLogo.svg";
import { useAxios } from "../../../Providers/AxiosProvider";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";

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

const JournalDetails = () => {
  //--------states--------
  const [messages, setMessages] = useState<Message[]>([]); // stores chat messages
  const [initialLoading, setInitialLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null); // ref for auto-scroll
  const axios = useAxios();
  const params = useParams();

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
    </div>
  );
};

export default JournalDetails;
