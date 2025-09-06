import { Form, useNavigate } from "react-router-dom";
import { FaBook } from "react-icons/fa6";
import { useAxios } from "../../../Providers/AxiosProvider";
import { useState } from "react";
import Swal from "sweetalert2";

const JournalOptions = () => {
  //--------states--------
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const axios = useAxios();

  //--------- handler for category selection --------
  const handleCategorySelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedCategory = event.target.value;
    console.log("Selected Category:", selectedCategory);
    
    if (selectedCategory === "Personal Win") {
      handleTrigger("1");
    } else if (selectedCategory === "Personal Challenge") {
      handleTrigger("2");
    } else if (selectedCategory === "Professional Win") {
      handleTrigger("3");
    } else if (selectedCategory === "Professional Challenges") {
      handleTrigger("4");
    } else {
      return;
    }
  };

  //post request to the api
  const handleTrigger = async (option: string) => {
    try {
      setLoading(true);
      const res = await axios.post("api/journaling/chat/", { message: option });
      console.log("response for post api", res);
      if (res.status === 200) {
        navigate(`/chat/journal/journal-chat/${res?.data?.session_id}`);
      } else {
        console.log("Failed to trigger journal", res);
        // Show error message
        Swal.fire({
          title: "Error!",
          text: "Failed to start journal session. Please try again.",
          icon: "error",
          background: "rgba(255, 255, 255, 0.1)",
          backdrop: "rgba(0, 0, 0, 0.4)",
          timer: 3000,
          showConfirmButton: false,
          customClass: {
            popup: "glassmorphic-popup",
            title: "glassmorphic-title",
            htmlContainer: "glassmorphic-text",
          },
        });
      }
    } catch (error) {
      console.error("Error starting journal session:", error);
      // Show error message
      Swal.fire({
        title: "Error!",
        text: "Something went wrong. Please try again.",
        icon: "error",
        background: "rgba(255, 255, 255, 0.1)",
        backdrop: "rgba(0, 0, 0, 0.4)",
        timer: 3000,
        showConfirmButton: false,
        customClass: {
          popup: "glassmorphic-popup",
          title: "glassmorphic-title",
          htmlContainer: "glassmorphic-text",
        },
      });
    } finally {
      setLoading(false);
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
          <p className="text-lg">Starting journal session...</p>
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
        <label className="py-5 bg-[#2D2D2D] rounded text-center mx-20 cursor-pointer hover:bg-[#3D3D3D] transition-colors">
          <span>Personal win</span>
          <input
            type="radio"
            name="category"
            className="hidden"
            value="Personal Win"
            onChange={handleCategorySelect}
            disabled={loading}
          />
        </label>
        <label className="py-5 bg-[#2D2D2D] rounded text-center mx-20 cursor-pointer hover:bg-[#3D3D3D] transition-colors">
          <span>Personal Challenge</span>
          <input
            type="radio"
            name="category"
            className="hidden"
            value="Personal Challenge"
            onChange={handleCategorySelect}
            disabled={loading}
          />
        </label>
        <label className="py-5 bg-[#2D2D2D] rounded text-center mx-20 cursor-pointer hover:bg-[#3D3D3D] transition-colors">
          <span>Professional Win</span>
          <input
            type="radio"
            name="category"
            className="hidden"
            value="Professional Win"
            onChange={handleCategorySelect}
            disabled={loading}
          />
        </label>
        <label className="py-5 bg-[#2D2D2D] rounded text-center mx-20 cursor-pointer hover:bg-[#3D3D3D] transition-colors">
          <span>Professional Challenges</span>
          <input
            type="radio"
            name="category"
            className="hidden"
            value="Professional Challenges"
            onChange={handleCategorySelect}
            disabled={loading}
          />
        </label>
      </Form>
    </div>
  );
};

export default JournalOptions;