import { Link } from "react-router-dom";
import { useAuth } from "../../Providers/AuthProvider";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { motion } from "framer-motion";

const Header = () => {
  const scrollToPricing = () => {
    const pricingElement = document.getElementById("pricing");
    if (pricingElement) {
      pricingElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const { user, logout, isLoading } = useAuth();
  console.log("user", user);

  return (
    <div
      className="min-h-[100vh] bg-no-repeat bg-center bg-cover sm:px-16 px-5 py-5 sm:py-13 font-inter text-white relative"
      style={{
        backgroundImage: "url('/Mountain.png')",
      }}
    >
      {/* Overlay for background opacity */}
      <div className="absolute inset-0 bg-black opacity-70 pointer-events-none"></div>
      <nav className="flex sm:justify-between gap-5 sm:gap-8 relative z-10">
        <img
          className="sm:h-14 h-10 w-10 sm:w-14"
          src="/image.png"
          alt="Logo"
        />
        <div className="flex  gap-4 md:gap-8 items-center">
          {!user?.is_subscribed && (
            <button
              className="btn text-black bg-cCard font-bold py-3 px-5"
              onClick={scrollToPricing}
            >
              Start Subscription
            </button>
          )}

          {/* <div>
            <Link to={'login'}>
            <button
              className="cursor-pointer border border-gray-300 rounded-lg px-4 py-2 flex items-center gap-2 
             bg-gradient-to-r bg-cCard text-black font-bold 
             shadow-md transition-all duration-300 ease-in-out
             hover:scale-105 hover:shadow-[0_0_20px_rgba(79,70,229,0.6)]"
            >
              Subscription Plan
            </button>
            </Link>
          </div> */}

          {isLoading ? (
            <div className="text-gray-400"></div>
          ) : user ? (
            <button
              className="cursor-pointer border border-gray-300 rounded-lg px-2 py-2 flex items-center gap-2 w-28
        bg-gradient-to-r bg-cCard text-black font-bold 
        shadow-md transition-all duration-300 ease-in-out
        hover:scale-105 hover:shadow-[0_0_20px_rgba(79,70,229,0.6)]"
              onClick={logout}
            >
              <RiLogoutCircleRLine size={20} />
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="cursor-pointer border border-gray-300 rounded-lg px-4 py-2 flex items-center gap-2 
        bg-gradient-to-r bg-cCard text-black font-bold 
        shadow-md transition-all duration-300 ease-in-out
        hover:scale-105 hover:shadow-[0_0_20px_rgba(79,70,229,0.6)]"
            >
              Login
            </Link>
          )}

          
        </div>
      </nav>

      <div className="flex items-center justify-center flex-col text-center pt-60 relative z-10">
        <h1 className="sm:text-6xl text-5xl font-normal font-league-gothic mt-10">
          Optimal Performance Coach
        </h1>
        <p
          className="text-xl font-normal mt-4 pt-5 pb-8"
          style={{ fontFamily: "montserrat" }}
        >
          Experience the one-of-a-kind AI mental performance and wellness coach
          at your fingertips.
        </p>
        <div className=" flex items-center flex-col sm:flex-row gap-4">
          {/* {user?.is_subscribed === false && (
            <button
              className="btn text-black bg-cCard lg:font-bold py-3 lg:px-5"
              onClick={scrollToPricing}
            >
              Start Subscription
            </button>
          )} */}

          <div className="flex justify-center">
            <motion.div
              className="flex justify-center"
              animate={{ scale: [1, 1.1, 1] }} // zoom in to 1.1 then back to 1
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Link
                to={"/chat/init"}
                className="btn rounded-full bg-gradient-to-r bg-cCard text-black
            border-none lg:py-4 lg:px-8 lg:w-88 lg:h-16 font-semibold text-sm lg:text-xl 
           shadow-md hover:scale-105 hover:shadow-[0_0_30px_rgba(99,102,241,0.8)] 
           transition-all duration-300 mt-15"
              >
                Chat with OP Coach Now
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
