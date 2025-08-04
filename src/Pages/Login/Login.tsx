import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
import { CiMail } from "react-icons/ci";
import { useState } from "react";
import { IoLockClosedOutline } from "react-icons/io5";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useForm } from "react-hook-form";

type Inputs = {
    email: string;
    password: string;
};

const Login = () => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const {
        register,
        handleSubmit,
    } = useForm<Inputs>();

    const onSubmit = (data: Inputs) => {
        // Safe console log
        console.log("Login Data:", {
            email: data.email,
            password: data.password,
        });
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
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col  gap-5">
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
                                    {!showPassword ? <AiOutlineEye size={24} /> : <AiOutlineEyeInvisible size={24} />}
                                </button>
                            </div>
                            {/* ======================== Forgot Password ============================== */}
                            <Link to={'/forgot-password'} className="text-[#fafafd99] "><p className=" text-start pt-2">Forgot password?</p></Link>
                        </div>
                        <button
                            type="submit"
                            className=" text-black text-sm my-11 font-medium justify-center gap-2 bg-cCard rounded-[6px] py-5"
                        >
                            Login
                        </button>
                    </form>

                    <Link to="https://optimalperformancesystem.com/privacy-policy/" className="text-[#FAFAFD99] ">
                        <p className=" text-cCard text-center pb-5">
                            Privacy Policy and <span className="text-[#FAFAFD99]">terms of service</span>
                        </p>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
