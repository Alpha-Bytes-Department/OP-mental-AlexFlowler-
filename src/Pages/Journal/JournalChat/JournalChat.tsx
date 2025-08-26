import React, { useEffect, useRef, useState } from "react";
import { FaArrowUp } from "react-icons/fa6";
import { FaBook } from "react-icons/fa6";

// ----type declaration---------
interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
}

const JournalChat = () => {
  //--------states--------
  const [messages, setMessages] = useState<Message[]>([]); // stores chat messages
  const [inputMessage, setInputMessage] = useState(""); // handles input field text
  const messagesEndRef = useRef<HTMLDivElement>(null); // ref for auto-scroll

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

  //--------- message send handler --------
  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      // add user message
      const newMessage: Message = {
        id: Date.now(),
        text: inputMessage,
        sender: "user",
      };
      setMessages((prev) => [...prev, newMessage]);

      // mock bot response
      setTimeout(() => {
        const botResponse: Message = {
          id: Date.now() + 1,
          text: "This is a sample response. Replace with actual API integration.",
          sender: "bot",
        };
        setMessages((prev) => [...prev, botResponse]);
      }, 1000);

      setInputMessage("");
    }
  };

  //--------- enter key handler --------
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen relative">
      <div className="absolute inset-0 flex items-center justify-center opacity-15 pointer-events-none">
        <div className="flex flex-col items-center gap-3">
          <FaBook className="text-white" fontSize={300} />
          <span className="text-4xl text-white font-semibold">Journal</span>
        </div>
      </div>
      {/* --------------- Messages area ---------------------- */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.sender === "user"
                    ? "bg-[#DBD0A6] text-black"
                    : "bg-[#313435] text-white"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* --------------- Input area ---------------------- */}
      <div className="p-4">
        <div className="max-w-3xl mx-auto flex gap-4 rounded-lg bg-gradient-to-t from-black/80 via-black/40 to-transparent backdrop-blur-sm p-4">
          <input
            type="text"
            value={inputMessage}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="w-full py-1 sm:py-3 lg:py-4 xl:py-4 2xl:py-5 pl-3 sm:pl-4 md:pl-5 lg:pl-6 xl:pl-7 2xl:pl-8 pr-12 sm:pr-14 md:pr-16 lg:pr-18 xl:pr-20 2xl:pr-24 text-sm sm:text-base md:text-lg lg:text-xl text-white bg-white/20 backdrop-blur-md rounded-xl sm:rounded-2xl outline-none focus:ring-2 focus:ring-cCard/50 transition-all placeholder-gray-300"
          />
          <button
            type="submit"
            onClick={handleSendMessage}
            // disabled={isLoading || !watchedMessage?.trim()}
            className="bg-cCard disabled:bg-cCard/20 disabled:cursor-not-allowed text-white rounded-md sm:rounded-lg p-1.5 sm:p-2 md:p-2.5 lg:p-3 transition-colors"
          >
            <FaArrowUp className="text-black w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default JournalChat;
