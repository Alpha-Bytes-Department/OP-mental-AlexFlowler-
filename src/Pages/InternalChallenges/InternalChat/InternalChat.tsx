import React, { useEffect, useRef, useState } from "react";
import { FaArrowUp } from "react-icons/fa6";
import { useAxios } from "../../../Providers/AxiosProvider";
import { useParams } from "react-router-dom";
import logo from "../../../../public/image.png";
import Swal from "sweetalert2";

// ----type declaration---------
interface Message {
  error_message?: number;
  message: string[];
  phase?: string;
  question?: string;
  response?: string;
}

const InternalChat = () => {
  //--------states--------
  const [messages, setMessages] = useState<Message[]>([]); // stores chat messages
  const [inputMessage, setInputMessage] = useState(""); // handles input field text
  const messagesEndRef = useRef<HTMLDivElement>(null); // ref for auto-scroll
  const axios = useAxios();
  const params = useParams();

  if (params?.session_id) {
    localStorage.setItem("chat-session", params?.session_id);
  }

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

  useEffect(() => {
    axios.get(`/api/internal-challenge/${params?.session_id}/`).then((res) => {
      setMessages(res?.data);
    });
  }, []);

  //--------- message send handler --------
  const handleSendMessage = async () => {
    if (inputMessage.trim()) {
      try {
        // Send the message to the API
        const response = await axios.post("/api/internal-challenge/", {
          message: inputMessage,
          session_id: params?.session_id,
        });

        // Clear input field
        setInputMessage("");

        // Fetch all messages after sending
        const res = await axios.get(
          `/api/internal-challenge/${params?.session_id}/`
        );

        if (res?.data) {
          // Combine fetched messages with the new one from POST
          const updatedMessages = [...res.data, response?.data];
          setMessages(updatedMessages);
        }
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "Something went wrong. Please try again.",
          icon: "error",
          background: "rgba(255, 255, 255, 0.1)",
          backdrop: "rgba(0, 0, 0, 0.4)",
          timer: 3000, // auto close after 3 seconds
          showConfirmButton: false,
          customClass: {
            popup: "glassmorphic-popup",
            title: "glassmorphic-title",
            htmlContainer: "glassmorphic-text",
          },
        });

        console.error("Error sending/receiving message:", error);
      }
    }
  };

  console.log(messages);

  //--------- enter key handler --------
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
        <div className="flex flex-col items-center gap-3">
          <img
            src={logo}
            alt="Mindset chat background"
            className=" lg:ms-52 h-[400px] w-[400px] lg:h-[600px] lg:w-[600px]"
          />
        </div>
      </div>
      {/* --------------- Messages area ---------------------- */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((message, index: number) => {
            const showPhase =
              index === 1 || message?.phase !== messages[index - 1]?.phase;
            return (
              <>
                {/* ---------- Showing message after trigger start --------------*/}
                {message?.message && (
                  <div
                    key={index + 2}
                    className={
                      "max-w-[70%] rounded-lg p-3  bg-[#DBD0A6] text-black"
                    }
                  >
                    {message?.message.map((item: string, index: number) => {
                      return <p key={index}>{item}</p>;
                    })}
                  </div>
                )}
                {/* ---------------- Showing user response--------------- */}
                {message?.response && (
                  <div key={index + 1} className={"flex justify-end"}>
                    <div
                      className={
                        "max-w-[70%] rounded-lg p-3  bg-[#DBD0A6] text-black"
                      }
                    >
                      {message?.response}
                    </div>
                  </div>
                )}
                {/* ------- Showing phage only once for similar items ------------------*/}
                {showPhase && (
                  <h1
                    key={index + 3}
                    className="border border-[#DBD0A6] bg-[#2d2d2d] px-20 py-3 rounded text-[#DBD0A6] text-center"
                  >
                    {message?.phase}
                  </h1>
                )}
                {/* --------------------- showing ai response---------------- */}
                {
                  <div key={index} className={"flex flex-col justify-start"}>
                    <div
                      className={
                        "max-w-[70%] rounded-lg p-3  bg-[#393B3C] text-white"
                      }
                    >
                      {message?.question}
                    </div>
                    {message?.error_message && (
                      <p className="text-red-600 mt-2">
                        {message?.error_message}
                      </p>
                    )}
                  </div>
                }
              </>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* --------------- Input area ---------------------- */}
      <div className="p-4 mb-15 lg:mb-0">
        <div className="max-w-3xl mx-auto flex gap-4 rounded-lg bg-gradient-to-t from-black/80 via-black/40 to-transparent backdrop-blur-sm p-4 ">
          <input
            type="text"
            value={inputMessage}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="w-full py-2 sm:py-3 lg:py-4 pl-2 sm:pl-4 pr-8 sm:pr-12 text-sm sm:text-base  text-white bg-white/20 backdrop-blur-md rounded-lg sm:rounded-xl outline-none focus:ring-2 focus:ring-cCard/50 transition-all placeholder-gray-300"
          />
          <button
            type="submit"
            onClick={handleSendMessage}
            className="bg-cCard disabled:bg-cCard/20 disabled:cursor-not-allowed text-white rounded-md sm:rounded-lg p-1.5 sm:p-2 md:p-2.5 lg:p-3 transition-colors"
          >
            <FaArrowUp className="text-black w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InternalChat;
