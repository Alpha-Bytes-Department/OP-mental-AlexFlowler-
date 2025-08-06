
import { HiOutlinePaperAirplane } from "react-icons/hi2";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Message {
  id: number;
  message: string;
  sender: "user" | "bot";
  status: "success" | "loading" | "error";
}

const ChatHome = () => {
  const [message, setMessage] = useState("");
  const [messageData, setMessageData] = useState<Message[]>([]);
  const [hasMessages, setHasMessages] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Dummy bot responses for mocking
  const dummyResponses = [
    "Hello! I'm here to help you. What's on your mind today?",
    "That's an interesting question. Let me think about that for a moment.",
    "I understand what you're saying. Can you tell me more about how that makes you feel?",
    "Thank you for sharing that with me. It sounds like you've been through a lot.",
    "I'm here to listen and support you. What would you like to explore next?",
    "That's a great insight. How do you think we can work on that together?",
    "I appreciate your openness. What steps do you think might help in this situation?",
  ];

  const getRandomResponse = () => {
    return dummyResponses[Math.floor(Math.random() * dummyResponses.length)];
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setHasMessages(true);
    
    // Add user message instantly
    const userMessageId = Date.now();
    setMessageData((prev) => [
      ...prev,
      {
        id: userMessageId,
        message: message,
        sender: "user",
        status: "success",
      },
    ]);

    // Add loading bot message
    const botMessageId = userMessageId + 1;
    setMessageData((prev) => [
      ...prev,
      {
        id: botMessageId,
        message: "",
        sender: "bot",
        status: "loading",
      },
    ]);

    // Clear input
    setMessage("");

    // Simulate API call with dummy response
    try {
      setIsLoading(true);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const botResponse = getRandomResponse();
      
      // Update bot message with response
      setMessageData((prev) =>
        prev.map((msg) =>
          msg.id === botMessageId
            ? {
                ...msg,
                message: botResponse,
                status: "success" as const,
              }
            : msg
        )
      );

      // After showing the response, create session and redirect
      setTimeout(() => {
        const sessionId = `session_${Date.now()}`;
        navigate(`/chat/${sessionId}`);
      }, 1000);

    } catch (error) {
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
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSubmit(e);
    }
  };

  return (
    <>
      <style>{`
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
      `}</style>
      
      <div className="flex flex-col h-full text-white relative">
        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Welcome Section */}
          <div className={`flex flex-col items-center justify-center h-full text-center space-y-8 transition-all duration-1000 ease-in-out ${
            hasMessages
              ? "opacity-0 pointer-events-none transform translate-y-[-20px]"
              : "opacity-100 pointer-events-auto transform translate-y-0"
          }`}>
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold text-white">
                Start a New Chat
              </h1>
              <h2 className="text-2xl md:text-3xl font-medium text-white/80">
                What can I help with?
              </h2>
            </div>
          </div>

          {/* Messages */}
          <div className={`flex flex-col gap-4 transition-all duration-1000 ease-in-out ${
            hasMessages && messageData.length > 0
              ? "opacity-100 transform translate-y-0"
              : "opacity-0 transform translate-y-10 pointer-events-none"
          }`}>
            {messageData.length > 0 &&
              messageData?.map((item) => (
                <div
                  key={item.id}
                  className={`flex animate-fadeInUp ${
                    item.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                      item.sender === "user"
                        ? "bg-blue-600 text-white ml-auto"
                        : "bg-gray-700 text-white mr-auto"
                    }`}
                  >
                    {item.status === "loading" ? (
                      <div className="flex items-center gap-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                        <span className="text-sm text-gray-300">
                          Thinking...
                        </span>
                      </div>
                    ) : (
                      <p className="text-base">{item.message}</p>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Chat Input */}
        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={onSubmit}>
              <div className="flex items-center space-x-4 bg-gray-800/80 backdrop-blur-sm rounded-2xl p-3 border border-gray-600">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Message ....."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full px-4 py-3 bg-transparent text-white placeholder-gray-400 focus:outline-none text-lg"
                    disabled={isLoading}
                  />
                </div>
                <button 
                  type="submit"
                  disabled={isLoading || !message.trim()}
                  className="p-3 bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:cursor-not-allowed rounded-xl transition-colors border border-gray-600"
                >
                  <HiOutlinePaperAirplane className="w-5 h-5 text-white" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatHome