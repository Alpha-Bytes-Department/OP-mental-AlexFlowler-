import { Form, useNavigate } from "react-router-dom";
import { FaBook } from "react-icons/fa6";
import { useAxios } from "../../../Providers/AxiosProvider";
import { useState } from "react";

// ----type declaration---------
// interface FormData {
//   message: string;
// }

const JournalOptions = () => {
  //--------states--------
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const axios = useAxios();

  //--------- handler for category selection --------
  const handleCategorySelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedCategory = event.target.value;
    console.log("Selected Category:", selectedCategory);
    if (selectedCategory === "Positive trigger") {
      handleTrigger("1");
    } else if (selectedCategory === "Negative trigger") {
      handleTrigger("2");
    } else if (selectedCategory === "Recurring Thought") {
      handleTrigger("4");
    } else if (selectedCategory === "Milestone gratitude") {
      handleTrigger("4");
    } else {
      return;
    }
  };

  //post request to the api
  const handleTrigger = async (option: string) => {
    setLoading(true);
    const res = await axios.post("api/journaling/chat/", { message: option });
    console.log("journal", res);
    if (res) {
      setLoading(false);
    }
    if (res.status === 200) {
      navigate(`/chat/journal/journal-chat/${res?.data?.session_id}`);
    }else{
      console.log("Failed to trigger journal", res);
    }
  };

  if (loading) {
    return (
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
    );
  }

  return (
    <div className="flex flex-col gap-5 items-center min-h-screen mt-10">
      {/* ---------------- Header with icon----------------- */}
      <div className="flex flex-col justify-center items-center">
        <FaBook className="text-[#dbd0a6]" fontSize={40} />
        <span className="text-2xl">Journal</span>
      </div>
      <h1>Choose Journal Category</h1>
      {/* --------------- Journal options---------------------- */}
      <Form className="flex flex-col gap-5 w-full overflow-y-auto max-h-[70vh] pb-5">
        <label className="py-5 bg-[#2D2D2D] rounded text-center mx-20 cursor-pointer">
          <span>Positive Trigger</span>
          <input
            type="radio"
            name="category"
            className="hidden"
            value="Positive trigger"
            onChange={handleCategorySelect}
          />
        </label>
        <label className="py-5 bg-[#2D2D2D] rounded text-center mx-20 cursor-pointer">
          <span>Negative Trigger</span>
          <input
            type="radio"
            name="category"
            className="hidden"
            value="Negative trigger"
            onChange={handleCategorySelect}
          />
        </label>
        <label className="py-5 bg-[#2D2D2D] rounded text-center mx-20 cursor-pointer">
          <span>Recurring Thought</span>
          <input
            type="radio"
            name="category"
            className="hidden"
            value="Recurring Thought"
            onChange={handleCategorySelect}
          />
        </label>
        <label className="py-5 bg-[#2D2D2D] rounded text-center mx-20 cursor-pointer">
          <span>Future Goal</span>
          <input
            type="radio"
            name="category"
            className="hidden"
            value="Future goal"
            onChange={handleCategorySelect}
          />
        </label>
        <label className="py-5 bg-[#2D2D2D] rounded text-center mx-20 cursor-pointer">
          <span>Milestone Gratitude</span>
          <input
            type="radio"
            name="category"
            className="hidden"
            value="Milestone gratitude"
            onChange={handleCategorySelect}
          />
        </label>
      </Form>
    </div>
  );
};

export default JournalOptions;
