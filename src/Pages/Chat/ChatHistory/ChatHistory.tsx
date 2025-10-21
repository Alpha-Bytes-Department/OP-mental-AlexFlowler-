import { useEffect, useState } from "react";
import { useAxios } from "../../../Providers/AxiosProvider";
import { MdDelete, MdChat, MdSchedule } from "react-icons/md";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

type ChatHistoryItem = {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  save_history: boolean;
};

const ChatHistory = () => {
  const axios = useAxios();
  const [datum, setDatum] = useState<ChatHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPermitted, setIsPermitted] = useState(false);
  // const [isOn, setIsOn] = useState(false);

  // Fetch chat history from API
  const fetchChat = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/chatbot/history/");
      console.log("chat history response:", res.data);
      // Sort by updated_at descending (most recent first)
      const sortedData =
        res?.data?.sort(
          (a: ChatHistoryItem, b: ChatHistoryItem) =>
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        ) || [];
      setDatum(sortedData);
    } catch (error) {
      console.error("Failed to fetch chat history:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to load chat history. Please try again.",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  console.log("chat history data:", datum);

  // Check permission from API
  const checkPermisssion = async () => {
    try {
      const res = await axios.get("/api/chatbot/settings/");
      setIsPermitted(res.data.allow_chat_history);
    } catch (error) {
      console.error("Failed to check permission:", error);
    }
  };

  useEffect(() => {
    checkPermisssion();
    fetchChat();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    const result = await Swal.fire({
      title: "Delete Conversation?",
      text: `Are you sure you want to delete "${title}"? This action cannot be undone.`,
      icon: "warning",
      iconColor: "#DBD0A6",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const res = await axios.delete(`/api/chatbot/history/${id}/`);
        if (res.status === 204) {
          // Remove from local state immediately
          setDatum((prev) => prev.filter((item) => item.id !== id));
          Swal.fire({
            title: "Deleted!",
            text: "Conversation has been deleted successfully.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
        }
      } catch (error) {
        console.error("Failed to delete chat:", error);
        Swal.fire({
          title: "Error",
          text: "Failed to delete conversation. Please try again.",
          icon: "error",
        });
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return (
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) +
      " " +
      date
        .toLocaleDateString([], { month: "short", day: "numeric" })
        .toUpperCase()
    );
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return `${diffInDays}d ago`;
  };

  // Filter conversations based on search term

  const filteredData = datum.filter((item) => {
    // First apply search term filter
    const matchesSearch = (item.title || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    // Then apply permission-based filtering
    if (isPermitted) {
      return matchesSearch && item.save_history;
    } else {
      // If user doesn't have permission, show only unsaved chats and chats from the last 24 hours
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const isRecent = new Date(item.created_at) > twentyFourHoursAgo;
      return matchesSearch && !item.save_history && isRecent;
    }
  });

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#b8a962] via-[#a69654] to-[#8b7c3f] px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex-shrink-0">
        <div className="mb-2">
          <div className="flex items-center justify-center space-x-3">
            {/* <MdHistory className="w-5 h-5 sm:w-6 sm:h-6 text-white flex-shrink-0" />  */}

            <div className="min-w-0 text-center">
              <h1 className="text-xl sm:text-2xl font-bold text-black truncate">
                Chat History
              </h1>
              <h3 className="text-lg text-gray-700">
                {isPermitted ? "" : "Chat will apear for 24H only"}
              </h3>
              <div className="flex justify-center items-center text-gray-700"></div>
              <p className="text-gray-700 text-lg sm:text-sm">
                Total: {filteredData.length}{" "}
                {filteredData.length === 1 ? "conversation" : "conversations"}
              </p>
            </div>
          </div>
        </div>
        {/* Search Bar */}
        <div className="flex flex-col justify-center items-center">
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full xl:w-4/12  px-3 sm:px-4 py-2.5 sm:py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* Chat List - Scrollable Content */}
      <div className="flex-1 overflow-y-auto bg-black/90">
        {loading ? (
          <div className="flex items-center justify-center py-8 sm:py-12">
            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-[#b8a962]"></div>
            <span className="ml-3 text-white text-sm sm:text-base">
              Loading conversations...
            </span>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center">
            <MdChat className="mx-auto h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-white mb-2">
              {searchTerm ? "No conversations found" : "No conversations yet"}
            </h3>
            <p className="text-gray-300 mb-6 text-sm sm:text-base px-4">
              {searchTerm
                ? `Try adjusting your search term "${searchTerm}"`
                : "Start a new chat to see your conversation history here"}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="inline-flex items-center px-4 py-2 bg-[#b8a962] text-white rounded-lg hover:bg-[#a69654] transition-colors text-sm"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 space-y-2 sm:space-y-3">
            {filteredData.map((data) => (
              <div
                key={data.id}
                className="bg-gray-800/40 backdrop-blur-sm rounded-lg border border-gray-700/50 hover:bg-gray-700/40 transition-all duration-200 p-3 sm:p-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
                  {/* Chat Info */}
                  <div className="flex-1 min-w-0 sm:mr-4">
                    <h3 className="text-sm sm:text-base font-semibold text-white mb-2 truncate">
                      {data.title || "Untitled Conversation"}
                    </h3>
                    <div className="flex flex-col xs:flex-row xs:items-center space-y-1 xs:space-y-0 xs:space-x-4 text-xs sm:text-sm">
                      <span className="flex items-center text-gray-300">
                        <MdSchedule className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                        {getRelativeTime(data.updated_at)}
                      </span>
                      <span className="text-gray-400 text-xs hidden sm:block">
                        Created: {formatDate(data.created_at)}
                      </span>
                      <span className="text-gray-400 text-xs sm:hidden">
                        {formatDate(data.created_at)}
                      </span>
                      {data.save_history && (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-600 text-white self-start">
                          Saved
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end space-x-2 sm:space-x-3">
                    <Link
                      to={`/chat/general/history/${data.id}`}
                      className="inline-flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white bg-[#b8a962] hover:bg-[#a69654] focus:bg-[#a69654] focus:outline-none focus:ring-2 focus:ring-[#b8a962]/50 focus:ring-offset-2 focus:ring-offset-gray-800 rounded-lg transition-all duration-200 shadow-sm"
                      aria-label={`Continue chat: ${data.title || "Untitled"}`}
                    >
                      <MdChat className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      <span className="hidden xs:inline">Continue</span>
                      <span className="xs:hidden">Chat</span>
                    </Link>

                    <button
                      onClick={() => handleDelete(data.id, data.title)}
                      className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 text-gray-400 hover:text-red-400 hover:bg-red-500/20 focus:text-red-400 focus:bg-red-500/20 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2 focus:ring-offset-gray-800 rounded-lg transition-all duration-200"
                      aria-label={`Delete chat: ${data.title || "Untitled"}`}
                    >
                      <MdDelete className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHistory;
