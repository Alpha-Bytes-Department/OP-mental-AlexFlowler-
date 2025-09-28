import { useNavigate } from "react-router-dom";
import { useAxios } from "../../../Providers/AxiosProvider";
import Swal from "sweetalert2";
import logo from "../../../../public/bgLogo.svg";
import { useAuth } from "../../../Providers/AuthProvider";

const InternalHome = () => {
  const navigate = useNavigate();
  const axios = useAxios();
  const {user} = useAuth()


  const handleTriggerChat = async () => {
    if(user && user?.is_subscribed === true){
      axios.post("/api/internal-challenge/", {
        message: "Start",
      })
      .then((res) => {
        console.log("Response for message hellow",res);
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
    }else{
      Swal.fire({
                title: "Subscribe to chat",
                text: "To access the Internal Challenge feature, please subscribe to one of our plans.",
                icon: "info",
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

  return (
    <div className="flex flex-col h-screen">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="flex flex-col items-center gap-3">
          <img
            src={logo}
            alt="Mindset chat background"
            className=" lg:ms-52 h-[400px] w-[400px] lg:h-[600px] lg:w-[600px]"
          />
        </div>
      </div>
      <div className="flex flex-col justify-center items-center min-h-screen gap-3 z-30">
        <h1 className="text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-league-gothic">
          Internal Challenge
        </h1>
        <button
          onClick={handleTriggerChat}
          className="border cursor-pointer px-3 border-[#dbd0a6] text-[#dbd0a6] text-base lg:text-xl font-semibold py-5 rounded-full bg-[#2d2d2d] w-9/12 lg:w-8/12 xl:w-7/12 2xl:w-6/12 lg:text-center "
        >
          Click To Begain Processing Your Internal Challenge
        </button>
      </div>
    </div>
  );
};

export default InternalHome;
