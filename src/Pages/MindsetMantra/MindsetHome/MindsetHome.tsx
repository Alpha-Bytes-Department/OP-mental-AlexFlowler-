import { useNavigate } from "react-router-dom";
import logo from "../../../../public/bgLogo.svg";
import { useAxios } from "../../../Providers/AxiosProvider";
import Swal from "sweetalert2";
import { useAuth } from "../../../Providers/AuthProvider";

const MindsetHome = () => {
  const navigate = useNavigate();
  const axios = useAxios();
  const {user} = useAuth();


  //loading all chat at initial time

  //triggering mindset mantra ai
  const handleStartChat = async (events: React.MouseEvent<HTMLButtonElement>) => {
    events.preventDefault();
    if(user && user?.is_subscribed === true){
      await axios.post("api/mindset/", {
        message: "Start" ,
      })
      .then((res) => {
        if (res.status === 200) {
          navigate(`/chat/mindsetChat/${res.data.session_id}`);
        }
      })
      .catch(() => {
        Swal.fire({
          title: "Error!",
          text: "Something went wrong. Please try again.",
          icon: "error",
          background: "rgba(255, 255, 255, 0.1)",
          backdrop: "rgba(0, 0, 0, 0.4)",
          timer: 3000, // auto close after 3 seconds
          showConfirmButton: false,
          customClass: {
            popup: "glassmorphic-popup",
            title: "glassmorphic-title",
            htmlContainer: "glassmorphic-text",
          },
        });
      });
    }else{
      Swal.fire({
                title: "Subscribe to chat",
                text: "To access the Mindset Mantra feature, please subscribe to one of our plans.",
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
        <h1 className="text-5xl lg:text-8xl font-league-gothic mx-3">
          Mindset Mantra
        </h1>
        <button
          onClick={handleStartChat}
          className="border border-[#dbd0a6] text-[#dbd0a6] text-md lg:text-xl font-semibold py-5 rounded-full bg-[#2d2d2d] text-center w-6/12"
        >
          Start Mindset Mantra
        </button>
      </div>
    </div>
  );
};

export default MindsetHome;
