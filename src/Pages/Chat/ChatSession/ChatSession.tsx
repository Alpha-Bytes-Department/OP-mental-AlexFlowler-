import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { FaArrowUp } from "react-icons/fa6";

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
      <div className="flex justify-center space-x-2 mb-4">
        <div className="w-4 h-4 bg-cCard rounded-full animate-bounce"></div>
        <div
          className="w-4 h-4 bg-cCard rounded-full animate-bounce"
          style={{ animationDelay: "0.1s" }}
        ></div>
        <div
          className="w-4 h-4 bg-cCard rounded-full animate-bounce"
          style={{ animationDelay: "0.2s" }}
        ></div>
      </div>
      <p className="text-lg sm:text-xl text-gray-300">
        Loading your conversation...
      </p>
    </div>
  </div>
);

const ChatSession = () => {
  const params = useParams();
  const sessionId = params.id;

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessageId, setLoadingMessageId] = useState<
    string | number | null
  >(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages are added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
    "I'm glad you're here and willing to talk about this. What would you like to focus on in our conversation today?",
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
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Add dummy conversation history
        const dummyConversation: Message[] = [
          {
            id: "msg-1",
            message:
              "Hi, I've been feeling really anxious lately about work and I'm not sure how to handle it.",
            sender: "user",
            status: "success",
            timestamp: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago
          },
          {
            id: "msg-2",
            message:
              "I understand that work-related anxiety can be really challenging. It's completely normal to feel this way, and I'm here to help you work through it. Can you tell me more about what specifically at work is making you feel anxious?",
            sender: "bot",
            status: "success",
            timestamp: new Date(Date.now() - 580000).toISOString(), // 9.5 minutes ago
          },
          {
            id: "msg-3",
            message:
              "It's mainly the upcoming presentation I have to give next week. I keep worrying about making mistakes or forgetting what to say.",
            sender: "user",
            status: "success",
            timestamp: new Date(Date.now() - 480000).toISOString(), // 8 minutes ago
          },
          {
            id: "msg-4",
            message:
              "Presentation anxiety is very common, and it's understandable that you're feeling this way. The fear of making mistakes or forgetting your content is something many people experience. Let's work on some strategies that can help you feel more confident and prepared. Have you given presentations before?",
            sender: "bot",
            status: "success",
            timestamp: new Date(Date.now() - 460000).toISOString(), // 7.5 minutes ago
          },
        ];

        setMessages(dummyConversation);
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
      await new Promise((resolve) => setTimeout(resolve, delay));

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
                message:
                  "I'm having trouble responding right now. Please try again.",
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
      <div className="h-screen w-full flex items-center justify-center p-4">
        <div className="text-center text-white max-w-md mx-auto">
          <h1 className="text-xl sm:text-2xl font-bold text-red-500 mb-4">
            Error
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-cCard text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
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

      <main className="min-h-screen w-full flex flex-col relative overflow-hidden">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto pt-3 sm:pt-4 md:pt-6 pb-32 sm:pb-36 md:pb-40 lg:pb-44 xl:pb-52 2xl:pb-60 px-2 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 scroll-smooth">
          <div className="max-w-sm md:max-w-2xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto">
            <div className="flex flex-col gap-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-300 py-6 sm:py-8">
                  <p className="text-sm sm:text-base md:text-lg">
                    No messages in this session yet.
                  </p>
                  <p className="text-xs sm:text-sm mt-2 opacity-75">
                    Start the conversation below!
                  </p>
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
                      className={`text-start max-w-[85%] sm:max-w-xs md:max-w-sm lg:max-w-lg xl:max-w-2xl 2xl:max-w-3xl p-3 sm:p-4 md:p-5 lg:p-6 rounded-xl sm:rounded-2xl text-sm sm:text-base md:text-lg leading-relaxed ${
                        item.sender === "user"
                          ? "bg-cCard text-black ml-auto"
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
                        <div>
                          <p>{item.message}</p>
                          {item.timestamp && (
                            <p
                              className={`text-xs mt-1 sm:mt-2 ${
                                item.sender === "user"
                                  ? "text-gray-700"
                                  : "text-cCard"
                              }`}
                            >
                              {new Date(item.timestamp).toLocaleTimeString()}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
              {/* Invisible div to scroll to */}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        {/* Input Form - Fixed at bottom */}
        <div className="absolute bottom-5 sm:bottom-3 md:bottom-4 lg:bottom-6 xl:bottom-8 2xl:bottom-12 left-0 right-0 px-2 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 z-30">
          <form
            className="w-full max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-3xl xl:max-w-4xl 2xl:max-w-5xl mx-auto"
            onSubmit={handleSubmit}
          >
            <div className="relative w-full">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full py-3 sm:py-4 md:py-5 lg:py-6 xl:py-7 2xl:py-8 pl-3 sm:pl-4 md:pl-5 lg:pl-6 xl:pl-7 2xl:pl-8 pr-12 sm:pr-14 md:pr-16 lg:pr-18 xl:pr-20 2xl:pr-24 text-sm sm:text-base md:text-lg lg:text-xl text-white bg-white/20 backdrop-blur-md rounded-xl sm:rounded-2xl outline-none focus:border-none transition-colors placeholder-gray-300"
                type="text"
                placeholder="Continue the conversation..."
                autoComplete="off"
                disabled={loadingMessageId !== null}
              />
              <div className="absolute right-2 sm:right-3 md:right-4 top-1/2 -translate-y-1/2 flex items-center">
                <button
                  type="submit"
                  disabled={!message.trim() || loadingMessageId !== null}
                  className="bg-cCard disabled:bg-cCard/20 disabled:cursor-not-allowed text-white rounded-md sm:rounded-lg p-1.5 sm:p-2 md:p-2.5 lg:p-3 transition-colors"
                >
                  <FaArrowUp className="text-black w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};

export default ChatSession;
