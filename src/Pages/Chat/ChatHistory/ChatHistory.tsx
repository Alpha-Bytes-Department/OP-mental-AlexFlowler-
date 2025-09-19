import { useEffect, useState } from "react";
import { useAxios } from "../../../Providers/AxiosProvider";
import { MdDelete, MdChat } from "react-icons/md";
import Swal from "sweetalert2";

type ChatHistoryItem = {
  id: string;
  title: string;
};

const ChatHistory = () => {
  const axios = useAxios();
  const [datum, setDatum] = useState<ChatHistoryItem[]>([]);

  const fetchChat = async () => {
    const res = await axios.get("/api/chatbot/history/");
    setDatum(res?.data);
  };
  useEffect(() => {
    fetchChat();
  }, []);

  const handleClick = (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      const res = await axios.delete(`/api/chatbot/history/${id}/`);
      if (res.status === 204 && result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
      }
    });
  };

  const handleChat = async (id: string) => {
    console.log("It will be work after namaz", id);
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-4">
      <div className="w-full max-w-2xl">
        <div className="rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="bg-[#ac9a54] px-6 py-4">
            <h2 className="text-xl font-semibold text-white">
              Your Conversations
            </h2>
            <p className="text-white text-sm mt-1">
              {datum.length}{" "}
              {datum.length === 1 ? "conversation" : "conversations"}
            </p>
          </div>

          {/* Chat List - Scrollable */}
          <div className="max-h-[600px] overflow-y-auto divide-y divide-[#dbd0a6]">
            {datum.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <MdChat className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                <p className="text-white font-medium">No conversations yet</p>
                <p className="text-white text-sm mt-1">
                  Start a new chat to see it here
                </p>
              </div>
            ) : (
              datum.map((data, index) => (
                <div
                  key={data.id || index}
                  className="group hover:bg-[#d4caa2] transition-colors duration-150"
                >
                  <div className="flex justify-between items-center px-6 py-4">
                    {/* Chat Title */}
                    <div className="flex-1 min-w-0">
                      {data.title && (
                        <p className="text-sm text-white mt-1 truncate">
                          {data.title}
                        </p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleChat(data.id)}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-[#a7944c] cursor-pointer rounded-lg transition-colors duration-150 shadow-sm"
                        aria-label={`Continue chat: ${
                          data.title || "Untitled"
                        }`}
                      >
                        <MdChat className="w-4 h-4 mr-1" />
                        Continue
                      </button>

                      <button
                        onClick={() => handleClick(data.id)}
                        className="inline-flex items-center justify-center w-9 h-9 text-slate-400 hover:text-red-600 hover:bg-red-50 focus:text-red-600 focus:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-lg transition-colors duration-150"
                        aria-label={`Delete chat: ${data.title || "Untitled"}`}
                      >
                        <MdDelete className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHistory;
