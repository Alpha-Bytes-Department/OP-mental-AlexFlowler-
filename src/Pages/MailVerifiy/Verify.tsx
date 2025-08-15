import { useState, useEffect } from "react";
import HashLoader from "react-spinners/HashLoader";
import { useAxios } from "../../Providers/AxiosProvider";
import { useNavigate } from "react-router-dom";


const Verify = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const axios = useAxios();
    const uid = searchParams.get("uid");
    const token = searchParams.get("token");
    const navigate = useNavigate();

    const [status, setStatus] = useState<"pending" | "success" | "error">("pending");
    const [message, setMessage] = useState<string>("Verifying your email...");

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                // Replace with your actual API endpoint
                const response = await axios.get(`/api/users/email/verify/${uid}/${token}/`);
                if (response.status === 200 || response.status === 201) {
                    console.log("Email verification successful:", response.data);
                    setStatus("success");
                    setMessage("Your email has been successfully verified!");
                    localStorage.setItem("access", response.data.access);
                    localStorage.setItem("refresh", response.data.refresh);
                    setTimeout(() => {
                        navigate("/chat");
                    }, 1000);

                } else {
                    setStatus("error");
                    setMessage("Verification failed. The link may be invalid or expired.");
                }
            } catch {
                setStatus("error");
                setMessage("An error occurred during verification. Please try again.");
            }
        };

        if (uid && token) {
            verifyEmail();
        } else {
            setStatus("error");
            setMessage("Invalid verification link.");
        }
    }, [uid, token]);

    
    return (
      <div className="bg-[url('/background.png')] min-h-screen flex items-center justify-center font-inter px-4">
        <div className="backdrop-blur-sm bg-white/10 border border-hCard rounded-2xl shadow-2xl p-8 max-w-md w-full flex flex-row items-center h-48 glass-card relative overflow-hidden">
          {/* Loader on the left */}
          <div className="flex items-center justify-center w-20 h-20 mr-6">
            {status === "pending" && <HashLoader color="#dbe981" />}
            {status === "success" && (
              <span className="inline-block w-12 h-12 text-green-500">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    strokeWidth="2"
                    className="opacity-20"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 13l3 3 7-7"
                  />
                </svg>
              </span>
            )}
            {status === "error" && (
              <span className="inline-block w-12 h-12 text-red-500">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    strokeWidth="2"
                    className="opacity-20"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 9l-6 6m0-6l6 6"
                  />
                </svg>
              </span>
            )}
          </div>
          {/* Message and title */}
          <div className="flex-1 flex flex-col items-start justify-center">
            <h1 className="text-2xl md:text-3xl font-bold mb-2 text-cCard drop-shadow text-left">
              {status === "success"
                ? "Email Verified!"
                : status === "error"
                ? "Verification Failed"
                : "Verifying..."}
            </h1>
            <p
              className={`text-base md:text-lg mb-2 text-hCard text-left break-words transition-colors duration-300 ${
                status === "success"
                  ? "text-green-600"
                  : status === "error"
                  ? "text-red-600"
                  : "text-blue-700"
              }`}
            >
              {message}
            </p>
          </div>
          {/* Glassmorphic border effect */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none border-2 border-white/30"
            style={{ boxShadow: "0 4px 32px 0 rgba(31, 38, 135, 0.37)" }}
          ></div>
        </div>
      </div>
    );
};

export default Verify;