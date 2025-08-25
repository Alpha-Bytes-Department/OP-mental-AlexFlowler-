import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FaArrowUp } from "react-icons/fa6";
import { useAxios } from "../../../Providers/AxiosProvider";

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
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const axios = useAxios();

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

  const onSubmit = async (data: FormData) => {
    setHasMessages(true);
    // Add user message instantly
    try {
      const response = await axios.post("/api/chatbot/",
        {
          message: data
        }
      )
      console.log(response);
      reset();
    } catch (error) {
      console.log("Failed to send requiest", error);
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

      <div className="h-screen flex flex-col text-white">
        {/* Chat Messages Area */}
        <div className="flex-1 overflow-y-auto px-2 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 pb-24">
          <div className="flex flex-col gap-2 sm:gap-3 md:gap-4 py-4 max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto h-full">
            {messageData.length > 0 ? (
              messageData.map((item) => (
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
              ))
            ) : (
              <div className="flex flex-col justify-around gap-96 mt-24 h-full items-center">
                <h1 className="text-4xl lg:text-7xl mx-auto font-league-gothic">
                  Start a New Chat
                </h1>
                <p className="text-xl lg:text-4xl font-league-gothic">
                  What I can help with ?
                </p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Chat Input - Stays Fixed at Bottom */}
        <div className="fixed bottom-0 left-0 right-0 px-2 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 py-4 lg:ml-[280px] z-10">
          <div className="max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto">
            <form
              className="w-full max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-3xl xl:max-w-4xl 2xl:max-w-5xl mx-auto"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="relative w-full">
                <input
                  {...register("message")}
                  type="text"
                  placeholder="Message ....."
                  onKeyPress={handleKeyPress}
                  className="w-full py-3 sm:py-4 md:py-5 lg:py-6 xl:py-7 2xl:py-8 pl-3 sm:pl-4 md:pl-5 lg:pl-6 xl:pl-7 2xl:pl-8 pr-12 sm:pr-14 md:pr-16 lg:pr-18 xl:pr-20 2xl:pr-24 text-sm sm:text-base md:text-lg lg:text-xl text-white bg-white/20 backdrop-blur-md rounded-xl sm:rounded-2xl outline-none focus:border-none transition-colors placeholder-gray-300"
                  disabled={isLoading}
                  autoComplete="off"
                />
                <div className="absolute right-2 sm:right-3 md:right-4 top-1/2 -translate-y-1/2 flex items-center">
                  <button
                    type="submit"
                    disabled={isLoading || !watchedMessage?.trim()}
                    className="bg-cCard disabled:bg-cCard/20 disabled:cursor-not-allowed text-white rounded-md sm:rounded-lg p-1.5 sm:p-2 md:p-2.5 lg:p-3 transition-colors"
                  >
                    <FaArrowUp className="text-black w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatHome;
