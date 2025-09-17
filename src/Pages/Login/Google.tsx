import { useGoogleLogin } from "@react-oauth/google";
import { setTokens } from "./setTokens";
import { FcGoogle } from "react-icons/fc";

export const GoogleBtnBackend = () => {
  // 1. We call the useGoogleLogin hook
  const login = useGoogleLogin({
    // 2. This onSuccess callback receives the access_token
    onSuccess: async (tokenResponse) => {
      console.log("Received Google access token:", tokenResponse.access_token);

      // 3. We send the access_token to our backend
      try {
        const res = await fetch(
          "http://localhost:8000/api/users/auth/google/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              access_token: tokenResponse.access_token,
            }),
          }
        );

        const data = await res.json();
        console.log("Backend response:", data);

        if (res.ok) {
          // Set tokens in both localStorage and cookies
          setTokens(data.access, data.refresh);
          
          window.location.href = "/chat/general";
        } else {
          console.error("Backend error:", data);
        }
      } catch (error) {
        console.error("Error during backend request:", error);
      }
    },
    onError: (error) => {
      console.error("Login Failed:", error);
    },
  });

  return (
    // 4. We create our own button to trigger the login function
    <button
      onClick={() => login()}
      className="flex flex-col gap-4 mt-8"
    >
      <button className="flex items-center text-black text-sm font-medium justify-center gap-2 bg-cCard rounded-[6px] py-5 ">
              {/* =========================== Google Login ================================ */}
              <FcGoogle />
              <span className="font-inter">Continue with Google</span>
    </button>
    </button>
  );
};
