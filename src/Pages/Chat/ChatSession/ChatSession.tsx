import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { HiOutlinePaperAirplane } from "react-icons/hi2";

interface Message {
  id: string | number;
  message: string;
  sender: "user" | "bot";
  status: "success" | "loading" | "error";
  timestamp?: string;
}

// Loading component
const ChatLoading = () => (
  <div className="h-screen w-full flex items-center justify-center">
    <div className="text-center text-white">
      <div className="flex space-x-2 mb-4">
        <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce"></div>
        <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
      <p className="text-xl text-gray-300">Loading your conversation...</p>
    </div>
  </div>
);

const ChatSession = () => {
  const params = useParams();
  const sessionId = params.id;
  
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessageId, setLoadingMessageId] = useState<string | number | null>(null);

  // Dummy bot responses for realistic conversation
  const dummyResponses = [
    "Thank you for sharing that with me. It's completely normal to feel this way, and I'm here to support you through this.",
    "I understand how challenging that must be for you. Let's explore this together and find some strategies that might help.",
    "That's a very insightful observation. How long have you been feeling this way, and have you noticed any patterns?",
    "It sounds like you're going through a difficult time. Remember that seeking help is a sign of strength, not weakness.",
    "I appreciate your openness in sharing this. What do you think might be some small steps you could take to address this?",
    "Your feelings are completely valid. Sometimes it helps to talk through these emotions. What would feel most supportive right now?",
    "That's a lot to process. Let's take this one step at a time. What feels like the most pressing concern for you today?",
    "I can hear the emotion in your words. It takes courage to reach out and talk about these things. How are you taking care of yourself right now?",
    "Thank you for trusting me with this. What you're experiencing is more common than you might think, and there are ways we can work through this together.",
    "I'm glad you're here and willing to talk about this. What would you like to focus on in our conversation today?"
  ];

  const getRandomResponse = () => {
    return dummyResponses[Math.floor(Math.random() * dummyResponses.length)];
  };

  // Simulate loading initial messages
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Add initial welcome message from bot
        const welcomeMessage: Message = {
          id: 'welcome-1',
          message: "Welcome back to your session! I'm here to continue our conversation. How are you feeling today?",
          sender: "bot",
          status: "success",
          timestamp: new Date().toISOString(),
        };
        
        setMessages([welcomeMessage]);
      } catch (err) {
        setError("Failed to load the conversation. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [sessionId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessageId = Date.now();
    const newUserMessage: Message = {
      id: userMessageId,
      message: message.trim(),
      sender: "user",
      status: "success",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newUserMessage]);

    const botMessageId = userMessageId + 1;
    setLoadingMessageId(botMessageId);
    const loadingBotMessage: Message = {
      id: botMessageId,
      message: "",
      sender: "bot",
      status: "loading",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, loadingBotMessage]);
    setMessage("");

    try {
      // Simulate API call delay (2-4 seconds for realism)
      const delay = Math.random() * 2000 + 2000;
      await new Promise(resolve => setTimeout(resolve, delay));
      
      const botResponse = getRandomResponse();
      
      setMessages((prev) =>
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

    } catch (error) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMessageId
            ? {
                ...msg,
                message: "I'm having trouble responding right now. Please try again.",
                status: "error" as const,
              }
            : msg
        )
      );
      console.error("Error sending message:", error);
    } finally {
      setLoadingMessageId(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (loading) return <ChatLoading />;

  if (error) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
          <p className="text-xl text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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

      <main className="h-screen w-full flex flex-col relative overflow-hidden">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-6 pt-6 pb-52">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col gap-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-300 py-8">
                  <p>No messages in this session yet.</p>
                  <p className="text-sm mt-2">Start the conversation below!</p>
                </div>
              ) : (
                messages.map((item) => (
                  <div
                    key={item.id}
                    className={`flex animate-fadeInUp ${
                      item.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`text-start max-w-2xl p-4 rounded-lg ${
                        item.sender === "user"
                          ? "bg-blue-600/20 text-white ml-auto"
                          : "bg-white/10 text-white mr-auto"
                      }`}
                    >
                      {item.status === "loading" ? (
                        <div className="flex items-center gap-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                          <span className="text-sm text-gray-300">Thinking...</span>
                        </div>
                      ) : (
                        <div>
                          <p className="text-lg leading-relaxed">{item.message}</p>
                          {item.timestamp && (
                            <p className="text-xs text-gray-400 mt-2">
                              {new Date(item.timestamp).toLocaleTimeString()}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Input Form - Fixed at bottom */}
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 w-full px-6 z-50">
          <form className="lg:w-[920px] mx-auto" onSubmit={handleSubmit}>
            <div className="relative w-full">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full py-4 px-6 pr-20 text-white bg-white/20 backdrop-blur-md border border-white/20 rounded-2xl outline-none focus:border-white/40 transition-colors text-lg placeholder-gray-300"
                type="text"
                placeholder="Continue the conversation..."
                autoComplete="off"
                disabled={loadingMessageId !== null}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
                <button
                  type="submit"
                  disabled={!message.trim() || loadingMessageId !== null}
                  className="bg-gray-500 hover:bg-gray-400 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg p-2 transition-colors"
                >
                  <HiOutlinePaperAirplane className="w-5 h-5" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};

export default ChatSession