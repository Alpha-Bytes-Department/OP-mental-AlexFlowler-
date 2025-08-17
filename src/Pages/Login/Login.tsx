import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { CiMail } from "react-icons/ci";
import { useState } from "react";
import { IoLockClosedOutline } from "react-icons/io5";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useForm } from "react-hook-form";
import { useAxios } from "../../Providers/AxiosProvider";
import Swal from "sweetalert2";

type Inputs = {
  email: string;
  password: string;
};

const Login = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const axios = useAxios();
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
      console.log("Login Response:", response.data);
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
         navigate("/chat");
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
    <div className=" bg-[url('/background.png')] min-h-screen font-inter">
      <div className="flex items-center justify-center px-5  py-24  text-white">
        <div className="border px-5 md:px-10 border-hCard rounded-[10px] bg-[#00000080] w-full max-w-lg">
          <h1 className=" text-center text-4xl font-inter font-semibold pt-14">
            Login
          </h1>
          <p className="text-center text-base font-inter pt-3 text-white">
            Don't have an account?{" "}
            <Link to="/register" className="text-[#FAFAFD99] underline">
              Create account
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
              <Link to={"/forgot-password"} className="text-[#fafafd99] ">
                <p className=" text-start pt-2">Forgot password?</p>
              </Link>
              {error && <p className="text-red-500">{error}</p>}
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className=" text-black text-sm my-11 disabled:opacity-40 font-medium justify-center gap-2 bg-cCard rounded-[6px] py-5"
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
    </div>
  );
};

export default Login;
