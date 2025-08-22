import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FaArrowUp } from "react-icons/fa6";

interface Message {
  id: number;
  message: string;
  sender: "user" | "bot";
  status: "success" | "loading" | "error";
}

interface FormData {
  message: string;
}

const ChatHome = () => {
  const [messageData, setMessageData] = useState<Message[]>([]);
  const [hasMessages, setHasMessages] = useState(false);
  const [hideWelcome, setHideWelcome] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { register, handleSubmit, reset, watch } = useForm<FormData>({
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

  // Hide welcome text after fade animation completes
  useEffect(() => {
    if (hasMessages) {
      const timer = setTimeout(() => {
        setHideWelcome(true);
      }, 1600);

      return () => clearTimeout(timer);
    }
  }, [hasMessages]);

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

  const onSubmit = async (data: FormData) => {
    if (!data.message.trim()) return;

    setHasMessages(true);

    // Add user message instantly
    const userMessageId = Date.now();
    setMessageData((prev) => [
      ...prev,
      {
        id: userMessageId,
        message: data.message,
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

    reset();

    try {
      setIsLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const botResponse = getRandomResponse();

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

      setTimeout(() => {
        const sessionId = `session_${Date.now()}`;
        navigate(`/chat/${sessionId}`);
      }, 3000);
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
      handleSubmit(onSubmit)();
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
              display: block;
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

      <div className="flex flex-col text-white">
        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto px-2 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 ">
          <div className="flex flex-col gap-2 sm:gap-3 md:gap-4 py-4 max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto">
            {messageData.map((item) => (
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
                    <span>Thinking...</span>
                  ) : (
                    <p>{item.message}</p>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Chat Input - Stays Fixed at Bottom */}
        <div className="sticky bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm border-t border-white/10 z-50">
          <div className="p-4 sm:p-6">
            <div className="max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-3xl xl:max-w-4xl 2xl:max-w-5xl mx-auto">
              <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex items-center gap-3">
                  <input
                    {...register("message")}
                    type="text"
                    placeholder="Message ....."
                    onKeyPress={handleKeyPress}
                    className="flex-1 py-3 sm:py-4 md:py-5 px-4 sm:px-5 md:px-6 text-sm sm:text-base md:text-lg text-white bg-white/20 backdrop-blur-md rounded-xl sm:rounded-2xl outline-none focus:ring-2 focus:ring-cCard/50 transition-all placeholder-gray-300"
                    disabled={isLoading}
                    autoComplete="off"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !watchedMessage?.trim()}
                    className="bg-cCard disabled:bg-cCard/20 disabled:cursor-not-allowed text-white rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 transition-colors flex-shrink-0"
                  >
                    <FaArrowUp className="text-black w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatHome;
