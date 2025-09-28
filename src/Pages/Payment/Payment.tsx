import { useEffect, useState, Suspense } from "react";
import { useLocation, Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { useAxios } from "../../Providers/AxiosProvider";

// Glassmorphic loading fallback
const LoadingFallback = () => (
  <div className="min-h-screen bg-gradient-to-b from-[#010C4A] to-black flex items-center justify-center p-4">
    <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-xl p-8 text-center border border-white/20">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white mb-4 mx-auto"></div>
      <p className="text-xl text-[#C5C5C5]">Loading payment verification...</p>
    </div>
  </div>
);

const PaymentVerificationContent = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const session_id = params.get("session_id");
  const [verificationStatus, setVerificationStatus] = useState<
    "pending" | "success" | "failed"
  >("pending");

  const axios = useAxios();

  useEffect(() => {
    if (session_id) {
      
      const verifySession = async () => {
        try {
          const response = await axios.post(
            "/api/subscriptions/verify-subscription/",
            { session_id }
          );
          if (response.status === 200) {
            setTimeout(() => {
              setVerificationStatus("success");
            }, 1000);
          } else {
            setVerificationStatus("failed");
          }
        } catch (error) {
          console.error("Error verifying session:", error);
          setVerificationStatus("failed");
        }
      };

      verifySession();
    } else {
      setVerificationStatus("failed");
    }
  }, [session_id]);

  return (
    <div className="h-screen bg-[url('/background.png')] bg-cover flex flex-col items-center justify-center p-4">
    <div className="max-w-xl w-full backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
      <div className="backdrop-blur-lg bg-gradient-to-r from-white/10 to-white/5 p-8 flex justify-center border-b border-white/10">
        {verificationStatus === "pending" ? (
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white/60"></div>
        ) : verificationStatus === "failed" ? (
        <div className="text-red-400/80 text-7xl">❌</div>
        ) : (
        <FaCheckCircle className="text-green-400/80 text-7xl drop-shadow-lg" />
        )}
      </div>
      <div className="p-8 text-center backdrop-blur-sm">
        <h1 className="text-4xl font-bold mb-4 text-white/90 drop-shadow">
        {verificationStatus === "pending"
          ? "Verifying Payment..."
          : verificationStatus === "failed"
          ? "Payment Verification Issue"
          : "Payment Successful!"}
        </h1>
        {verificationStatus === "pending" ? (
        <p className="mb-8 text-xl text-white/70">
          Please wait while we confirm your payment...
        </p>
        ) : verificationStatus === "failed" ? (
        <p className="mb-8 text-xl text-red-300/80">
          There was an issue verifying your payment. Please contact support
          to resolve this.
        </p>
        ) : (
        <p className="mb-8 text-xl text-white/70">
          Thank you for choosing our services! Your mental health journey
          begins now.
        </p>
        )}
        <div className="flex flex-col gap-4">
        {verificationStatus === "pending" ? (
          <button
            disabled
            className="backdrop-blur-md bg-white/10 border border-white/20 py-3 px-6 rounded-xl font-medium text-white/60 cursor-not-allowed"
          >
            Processing...
          </button>
        ) : verificationStatus === "failed" ? (
          <button
            onClick={() => window.location.reload()}
            className="backdrop-blur-md bg-cCard py-3 px-6 rounded-xl font-medium text-white hover:bg-white/20 transition-all duration-300"
          >
            Try Again
          </button>
        ) : (
          <Link
            to="/chat/general"
            className="backdrop-blur-md bg-hCard py-3 px-6 rounded-xl font-medium text-white hover:bg-white/20 transition-all duration-300 text-center"
          >
            Go to dashboard
          </Link>
        )}
        <Link
          to="/"
          className="text-white/60 hover:text-white/90 underline transition-colors duration-300"
        >
          Return to Home
        </Link>
        </div>
      </div>
    </div>
    </div>
  );
};

const Payment = () => (
  <Suspense fallback={<LoadingFallback />}>
    <PaymentVerificationContent />
  </Suspense>
);

export default Payment;
