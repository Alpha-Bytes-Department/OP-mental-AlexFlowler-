import { useSearchParams, useNavigate } from "react-router-dom";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { useAxios } from "../../Providers/AxiosProvider";
import { HiEye, HiEyeOff } from "react-icons/hi";
import Swal from "sweetalert2";

const UserVerify = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url('/background.png')" }}
    >
      {/* Overlay for better text visibility */}
      <div className="absolute inset-0 bg-black/40"></div>

      <Suspense
        fallback={
          <div className="relative z-10 text-white text-xl animate-pulse">
            Loading...
          </div>
        }
      >
        <UserVerifyContent />
      </Suspense>
    </div>
  );
};

const UserVerifyContent = () => {
  const [searchParams] = useSearchParams();
  const uid = searchParams.get("uid");
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const axios = useAxios();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: any) => {
    const { password, confirmPassword } = data;
    setIsLoading(true);
    try {
      const response = await axios.post(
        `/api/users/pass-reset/${uid}/${token}`,
        { new_password: password, new_password_confirm: confirmPassword }
      );
      if (response.status === 200) {
        Swal.fire({
          title: "Success",
          text: "Your password has been set successfully.",
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
        navigate("/login");
      } else {
        Swal.fire({
          title: "Error",
          text: "Failed to set password. Please try again.",
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
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "An error occurred. Please try again.",
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
    } finally {
      setIsLoading(false);
    }
  };

  if (!uid || !token) {
    return (
      <div className="relative z-10 max-w-md w-full mx-4 p-8 bg-black/20 backdrop-blur-md border border-hCard rounded-2xl shadow-2xl animate-fadeIn">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 animate-slideInDown">
            Invalid Request
          </h2>
          <p className="text-gray-300 text-base sm:text-lg animate-slideInUp">
            Please check your email for the correct verification link.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10 max-w-md w-full mx-4 p-6 sm:p-8 bg-black/20 backdrop-blur-md border border-hCard rounded-2xl shadow-2xl animate-fadeIn">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 animate-slideInDown">
          Reset Password
        </h2>
        <p className="text-gray-300 text-sm sm:text-base animate-slideInUp">
          Create a new password for your account
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* New Password Field */}
        <div
          className="space-y-2 animate-slideInLeft"
          style={{ animationDelay: "0.2s" }}
        >
          <label
            htmlFor="password"
            className="block text-sm sm:text-base font-medium text-white"
          >
            New Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
              placeholder="Enter new password"
              className="w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-hCard focus:border-transparent transition-all duration-300 hover:bg-white/15"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white transition-colors duration-200"
              tabIndex={-1}
            >
              {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-400 text-xs sm:text-sm animate-shake">
              {errors.password.message as string}
            </p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div
          className="space-y-2 animate-slideInRight"
          style={{ animationDelay: "0.4s" }}
        >
          <label
            htmlFor="confirmPassword"
            className="block text-sm sm:text-base font-medium text-white"
          >
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              id="confirmPassword"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              })}
              placeholder="Re-enter new password"
              className="w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-hCard focus:border-transparent transition-all duration-300 hover:bg-white/15"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((prev) => !prev)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white transition-colors duration-200"
              tabIndex={-1}
            >
              {showConfirm ? <HiEyeOff size={20} /> : <HiEye size={20} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-400 text-xs sm:text-sm animate-shake">
              {errors.confirmPassword.message as string}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-hCard text-black font-bold text-base sm:text-lg rounded-lg hover:bg-hCard/90 focus:outline-none focus:ring-2 focus:ring-hCard focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none animate-slideInUp"
          style={{ animationDelay: "0.6s" }}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
              Setting Password...
            </div>
          ) : (
            "Set Password"
          )}
        </button>
      </form>
    </div>
  );
};

export default UserVerify;
