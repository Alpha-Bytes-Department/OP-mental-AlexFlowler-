import { Link, useNavigate } from "react-router-dom";
import { CiMail } from "react-icons/ci";
import { useState } from "react";
import { IoLockClosedOutline } from "react-icons/io5";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useForm } from "react-hook-form";
import { useAxios } from "../../Providers/AxiosProvider";
import Swal from "sweetalert2";
import { GoogleBtnBackend } from "./Google";
import { useAuth } from "../../Providers/AuthProvider";

type Inputs = {
  email: string;
  password: string;
};

const Login = () => {

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isSubmitted, setSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const axios = useAxios();
  const {refreshUser} = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit = async (data: Inputs) => {
    // Safe console log
    console.log("Login Data:", {
      email: data.email,
      password: data.password,
    });
    setLoading(true);
    try {
      const response = await axios.post("/api/users/login/", data);
      refreshUser();
      if (response.status === 200 || response.status === 201) {
        Swal.fire({
          title: "Success!",
          text: "Login successful.",
          icon: "success",
          confirmButtonText: "OK",
          background: "rgba(255, 255, 255, 0.1)",
                  backdrop: "rgba(0, 0, 0, 0.4)",
                  customClass: {
                    popup: "glassmorphic-popup",
                    title: "glassmorphic-title",
                    htmlContainer: "glassmorphic-text",
                    confirmButton: "glassmorphic-button",
                  },
                });
         localStorage.setItem("access", response.data.access);
         localStorage.setItem("refresh", response.data.refresh);
         localStorage.setItem("user", JSON.stringify(response.data.user));
         navigate("/chat/general");
      }
    } catch (error) {
      let errorMessage = "An unknown error occurred";
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as any).response === "object" &&
        (error as any).response !== null &&
        "data" in (error as any).response &&
        typeof (error as any).response.data === "object" &&
        (error as any).response.data !== null &&
        "error" in (error as any).response.data &&
        typeof (error as any).response.data.error === "object" &&
        (error as any).response.data.error !== null &&
        "message" in (error as any).response.data.error
      ) {
        errorMessage = (error as any).response.data.error.message;
      }
      console.error("Login Error:", errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className=" bg-[url('/background.png')] min-h-screen font-inter ">
      <div className="flex items-center justify-center px-5  lg:py-24  text-white">
        <div className="border px-5 md:px-10 border-hCard rounded-[10px] bg-[#00000080] w-full max-w-lg mt-20">
          <h1 className=" text-center text-xl lg:text-4xl font-inter font-semibold pt-2 lg:pt-14">
            Login
          </h1>
          <p className="text-center text-base font-inter pt-3 text-white">
            Don't have an account?{" "}
            <Link to="/register" className="text-[#FAFAFD99] underline">
              Create account
            </Link>
          </p>
          <div className="flex flex-col gap-4 lg:mt-8 cursor-pointer">
            <GoogleBtnBackend/>
          </div>
          <div className="divider divider-accent lg:py-7 px-10">OR</div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col  gap-5"
          >
            <div className="flex items-center text-cCard gap-1 border border-cCard rounded-[6px] px-3 py-2">
              <CiMail size={24} />
              <div className="h-4 ml-2 w-0 border-cCard border-1"></div>
              <input
                type="email"
                placeholder="Email"
                className="input w-full bg bg-transparent focus:outline-none border-none shadow-none text-lg font-medium "
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <span className="text-red-500">{errors.email.message}</span>
              )}
            </div>
            <div>
              <div className="flex items-center text-cCard gap-1 border border-cCard rounded-[6px] px-3 py-2">
                <IoLockClosedOutline size={24} />
                <div className="h-4 ml-2 w-0 border-cCard border-1"></div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="input w-full bg bg-transparent focus:outline-none border-none shadow-none text-lg font-medium "
                  {...register("password", { required: true })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="ml-2 text-cCard focus:outline-none cursor-pointer"
                  tabIndex={-1}
                >
                  {!showPassword ? (
                    <AiOutlineEye size={24} />
                  ) : (
                    <AiOutlineEyeInvisible size={24} />
                  )}
                </button>
              </div>
              {/* ======================== Forgot Password ============================== */}
              <div onClick={()=> {
                const modal = document.getElementById(
                  "password_modal"
                ) as HTMLDialogElement | null;
                if (modal) modal.showModal();
              }} className="text-[#fafafd99] cursor-pointer">
                <p className=" text-start pt-2">Forgot password?</p>
              </div>
              {error && <p className="text-red-500">{error}</p>}
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className=" text-black text-sm mb-2 lg:my-11 disabled:opacity-40 justify-center gap-2 bg-cCard rounded-[6px] py-5 cursor-pointer font-bold"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          <Link
            to="https://optimalperformancesystem.com/privacy-policy/"
            className="text-[#FAFAFD99] "
          >
            <p className=" text-cCard text-center pb-5">
              Privacy Policy and{" "}
              <span className="text-[#FAFAFD99]">terms of service</span>
            </p>
          </Link>
        </div>
      </div>
      <dialog id="password_modal" className="modal">
        <div className="modal-box max-w-lg bg-[#000000cc] border border-hCard rounded-[10px] px-5 md:px-10 pt-10 pb-6 flex flex-col items-center">
          <h1 className="font-semibold font-inter text-3xl text-cCard mb-2">
        Forgot Password
          </h1>
          <p className="py-2 font-inter text-base text-[#fafafdcc] mb-4 text-center">
        Enter your email address to receive password reset instructions.
          </p>
          <form
        className="flex flex-col gap-4 items-center w-full"
        onSubmit={async (e) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          const email = (form.elements.namedItem("forgot_email") as HTMLInputElement)?.value;
          if (!email) return;
          try {
            setSubmitted(true);
            await axios.post("/api/users/password/reset/", { email });
            Swal.fire({
          title: "Email Sent!",
          text: "Check your inbox for reset instructions.",
          icon: "success",
          confirmButtonText: "OK",
          background: "rgba(255, 255, 255, 0.1)",
          backdrop: "rgba(0, 0, 0, 0.4)",
          customClass: {
            popup: "glassmorphic-popup",
            title: "glassmorphic-title",
            htmlContainer: "glassmorphic-text",
            confirmButton: "glassmorphic-button",
          },
            });
            setSubmitted(false);
            (document.getElementById("password_modal") as HTMLDialogElement)?.close();
          } catch (err) {
            Swal.fire({
          title: "Error",
          text: "Failed to send reset email. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
          background: "rgba(255, 255, 255, 0.1)",
          backdrop: "rgba(0, 0, 0, 0.4)",
          customClass: {
            popup: "glassmorphic-popup",
            title: "glassmorphic-title",
            htmlContainer: "glassmorphic-text",
            confirmButton: "glassmorphic-button",
          },
            });
            setSubmitted(false);
          }
        }}
          >
        <input
          type="email"
          name="forgot_email"
          placeholder="Enter your email"
          className="input w-full max-w-xs bg-transparent border border-cCard rounded-[6px] px-3 py-2 text-white placeholder-[#fafafd99] focus:outline-none text-lg font-medium"
          required
        />
        <button
          disabled={isSubmitted}
          type="submit"
          className="bg-cCard text-black cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed rounded-[6px] px-6 py-2 font-medium mt-2 transition hover:bg-opacity-90"
        >
          Send Reset Link
        </button>
          </form>
          <div className="modal-action w-full flex justify-center mt-6">
        <button
          disabled={isSubmitted}
          className="btn btn-outline border-cCard text-cCard rounded-[6px] px-6 py-2 font-medium hover:bg-cCard hover:text-black transition"
          onClick={() =>
            (document.getElementById("password_modal") as HTMLDialogElement)?.close()
          }
        >
          Close
        </button>
          </div>
        </div>
      </dialog>
      
    </div>
  );
};

export default Login;
