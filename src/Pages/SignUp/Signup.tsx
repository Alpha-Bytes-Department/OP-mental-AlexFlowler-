import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { CiMail } from "react-icons/ci";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { IoLockClosedOutline } from "react-icons/io5";
import {  useForm } from "react-hook-form";
import { useAxios } from "../../Providers/AxiosProvider";
import Swal from "sweetalert2";

type Inputs = {
  email: string;
  password: string;
  confirm_password: string;
};

const Signup = () => {
  const axios = useAxios();
  const navigate= useNavigate()
  const [isLoading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<Inputs>();
  const password = watch("password");
  const passwordValidation = {
    required: "Password is required",
    minLength: {
      value: 6,
      message: "Password must be at least 6 characters long",
    },
    pattern: {
      value:
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,}$/,
      message:
        "Password must contain at least one letter, one number, and one special character",
    },
  };

  const confirmPasswordValidation = {
    required: "Confirm password is required",
    validate: (value: string) => value === password || "Passwords do not match",
  };

  const onSubmit = async (data: Inputs) => {
    event?.preventDefault();
    setLoading(true);
    console.log("Login Data:", {
      email: data.email,
      password: data.password,
      confirmPassword: data.confirm_password,
    });
    try {
      const response = await axios.post("/api/users/register/", {
        email: data.email,
        password: data.password,
        password_confirm: data.confirm_password,
      });
      if (response.status === 201 || response.status === 200) {
        Swal.fire({
          title: "Success!",
          text: "Registration successful.",
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
        console.log("Registration successful:", response.data);
        const emailDomain = data.email.split("@")[1]?.toLowerCase();
        let emailProviderUrl = "";
        switch (emailDomain) {
        case "gmail.com":
          emailProviderUrl = "https://mail.google.com/mail/u/0/#inbox";
          window.open(emailProviderUrl, "_blank");
          break;
        case "outlook.com":
        case "hotmail.com":
          emailProviderUrl = "https://outlook.live.com/mail/inbox";
          window.open(emailProviderUrl, "_blank");
          break;
        case "yahoo.com":
          emailProviderUrl = "https://mail.yahoo.com/d/folders/1";
          window.open(emailProviderUrl, "_blank");
          break;
        default:
          window.open("mailto:" + data.email, "_blank");
        }

        setLoading(false);
        
        reset();
        navigate("/verify");
      }
    } catch (error) {
      console.error("Registration Error:", error);
      Swal.fire({
        title: "Error!",
        text: typeof error === "object" && error !== null && "message" in error
          ? (error as { message: string }).message
          : "An unknown error occurred.",
        icon: "error",
        confirmButtonText: "Try Again",
        background: "rgba(255, 255, 255, 0.1)",
        backdrop: "rgba(0, 0, 0, 0.4)",
        customClass: {
          popup: "glassmorphic-popup-error",
          title: "glassmorphic-title-error",
          htmlContainer: "glassmorphic-text-error",
          confirmButton: "glassmorphic-button-error",
        },
      });
      setLoading(false);
    }
  };

  return (
    <div className=" bg-[url('/background.png')] min-h-screen font-inter ">
      <div className="flex items-center justify-center px-5 py-24  text-white">
        <div className="border px-5 md:px-10 border-hCard rounded-[10px] bg-[#00000080] w-full max-w-lg">
          <h1 className=" text-center text-4xl font-inter font-semibold pt-14">
            Sign Up
          </h1>
          <p className="text-center text-base font-inter pt-3 text-white">
            Already have an account?{" "}
            <Link to="/login" className="text-[#FAFAFD99] underline">
              Log in
            </Link>
          </p>
          <div className="flex flex-col gap-4 mt-8">
            <button className="flex items-center text-black text-sm font-medium justify-center gap-2 bg-cCard rounded-[6px] py-5 ">
              {/* =========================== Google Login ================================ */}
              <FcGoogle />
              <span className="font-inter">Continue with Google</span>
            </button>
          </div>
          <div className="divider divider-accent py-7 px-10">OR</div>
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
                {...register("email", { required: true })}
              />
            </div>

            <div className="flex items-center text-cCard gap-1 border border-cCard rounded-[6px] px-3 py-2">
              <IoLockClosedOutline size={24} />
              <div className="h-4 ml-2 w-0 border-cCard border-1"></div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="input w-full bg bg-transparent focus:outline-none border-none shadow-none text-lg font-medium "
                {...register("password", { ...passwordValidation })}
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
            {errors.password && <p>{errors.password.message}!</p>}

            <div className="flex items-center text-cCard gap-1 border border-cCard rounded-[6px] px-3 py-2">
              <IoLockClosedOutline size={24} />
              <div className="h-4 ml-2 w-0 border-cCard border-1"></div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className="input w-full bg bg-transparent focus:outline-none border-none shadow-none text-lg font-medium "
                {...register("confirm_password", {
                  ...confirmPasswordValidation,
                })}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="ml-2 text-cCard focus:outline-none cursor-pointer"
                tabIndex={-1}
              >
                {!showConfirmPassword ? (
                  <AiOutlineEye size={24} />
                ) : (
                  <AiOutlineEyeInvisible size={24} />
                )}
              </button>
            </div>
            {errors.confirm_password && (
              <p>{errors.confirm_password.message}!</p>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className=" text-black text-sm my-8 font-medium justify-center gap-2 bg-cCard rounded-[6px] disabled:opacity-50 py-5"
            >
              Sign up
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
    </div>
  );
};

export default Signup;
