import { useNavigate } from "react-router-dom";
import { useAxios } from "../../../Providers/AxiosProvider";
import Swal from "sweetalert2";
import logo from "../../../../public/image.png"

const InternalHome = () => {
  const navigate = useNavigate();
  const axios = useAxios();

  const handleTriggerChat = async () => {
    axios
      .post("/api/internal-challenge/", {
        message: "Hello",
      })
      .then((res) => {
        navigate(`/chat/internalChat/${res.data.session_id}`);
      })
      .catch((error) => {
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
        console.log("Failed to hi chat",error);
      });
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="absolute inset-0 flex items-center justify-center opacity-15 pointer-events-none">
        <div className="flex flex-col items-center gap-3">
          <img
            src={logo}
            alt="Mindset chat background"
            className=" lg:ms-52 h-[400px] w-[400px] lg:h-[600px] lg:w-[600px]"
          />
        </div>
      </div>
      <div className="flex flex-col justify-center items-center min-h-screen gap-3 z-50">
        <h1 className="text-5xl lg:text-8xl font-league-gothic">
          Internal Challenge
        </h1>
        <button
          onClick={handleTriggerChat}
          className="border cursor-pointer border-[#dbd0a6] text-[#dbd0a6] text-base lg:text-xl font-semibold py-5 rounded-full bg-[#2d2d2d] w-9/12 lg:text-center "
        >
          Click To Begain Processing Your Internal Challenge
        </button>
      </div>
    </div>
  );
};

export default InternalHome;
