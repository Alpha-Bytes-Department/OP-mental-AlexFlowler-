import { Form, useNavigate } from "react-router-dom";
import logo from "../../../../public/bgLogo.svg";
import { useAxios } from "../../../Providers/AxiosProvider";
import { useState } from "react";
import Swal from "sweetalert2";
import { useAuth } from "../../../Providers/AuthProvider";

const JournalOptions = () => {
  //--------states--------
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const axios = useAxios();
  const { user } = useAuth();

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
    //checking subscription
    if (user && user?.is_subscribed === true) {
      try {
        setLoading(true);
        const res = await axios.post("api/journaling/chat/", {
          message: option,
        });
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
    } else {
       user && Swal.fire({
        title: "Subscribe to chat",
        text: "To access the Mindset Mantra feature, please subscribe to one of our plans.",
        icon: "info",
        iconColor: "#DBD0A6",
        confirmButtonText: "OK",
        showCancelButton: true,
        background: "rgba(255, 255, 255, 0.1)",
        backdrop: "rgba(0, 0, 0, 0.4)",
        customClass: {
          popup: "glassmorphic-popup",
          title: "glassmorphic-title",
          htmlContainer: "glassmorphic-text",
          confirmButton: "glassmorphic-button",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/", { replace: false });
          setTimeout(() => {
            const pricingElement = document.getElementById("pricing");
            if (pricingElement) {
              pricingElement.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }
          }, 500); // Adjust delay if needed
        } else {
          return;
        }
      });
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
    <div className="flex flex-col gap-5 items-center min-h-screen mt-20  xl:mt-46">
      {/*-------- background image--------- */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="flex flex-col items-center gap-3">
          <img
            src={logo}
            alt="Mindset chat background"
            className=" lg:ms-64 h-[400px] w-[400px] lg:h-[600px] lg:w-[600px]"
          />
        </div>
      </div>
      {/* ---------------- Header with icon----------------- */}
      <div className="flex flex-col justify-center items-center">
        <span className="text-6xl">Journal</span>
      </div>
      {/* --------------- Journal options---------------------- */}
      <Form className="flex flex-col gap-5  overflow-y-auto max-h-[70vh]">
        <p className="text-center text-lg">Choose Journal Category</p>
        <label className="py-5 border border-[#DBD0A6] bg-gradient-to-r from-[#DBD0A6] to-[#756F59] w-xs lg:w-lg rounded text-center  cursor-pointer hover:bg-[#3D3D3D] transition-colors">
          <span className="text-black">Personal win</span>
          <input
            type="radio"
            name="category"
            className="hidden"
            value="Personal Win"
            onChange={handleCategorySelect}
            disabled={loading}
          />
        </label>
        <label className="py-5 border text-black border-[#DBD0A6] bg-gradient-to-r from-[#DBD0A6] to-[#756F59] w-xs lg:w-lg rounded text-center  cursor-pointer hover:bg-[#3D3D3D] transition-colors">
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
        <label className="py-5 text-black border border-[#DBD0A6] bg-gradient-to-r from-[#DBD0A6] to-[#756F59] w-xs lg:w-lg rounded text-center  cursor-pointer hover:bg-[#3D3D3D] transition-colors">
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
        <label className="py-5 text-black border border-[#DBD0A6] bg-gradient-to-r from-[#DBD0A6] to-[#756F59] w-xs lg:w-lg rounded text-center  cursor-pointer hover:bg-[#3D3D3D] transition-colors">
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
