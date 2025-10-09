import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import { useAxios } from "../../Providers/AxiosProvider";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../Providers/AuthProvider";

// type declaration
interface Feature {
  created_at: string;
  description: string;
  duration_days: number;
  features: string[];
  id: number;
  name: string;
  price: string;
  recommended: boolean;
  stripe_price_id: string;
  updated_at: string;
  currency: string;
  status: string;
}

interface PlanData {
  title: string;
  subtitle: string;
  price: string;
  services: string[];
  recommended?: boolean;
  stripe_price_id?: number;
}

const Pricing = () => {
  const axios = useAxios();
  const [planDuration, setPlanDuration] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const { user } = useAuth();

  const [subscriptionData, setSubscriptionData] = useState<Feature[]>([]);
  const [displayPlan, setDisplayPlan] = useState<PlanData | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const getPriceCardData = async () => {
      try {
        const res = await axios.get("api/subscriptions/plans/");

        console.log("response", res.data);
        setSubscriptionData(res?.data || []);

      } catch (error) {
        console.log("failed to load subscribe data", error);
        Swal.fire({
          title: "Error!",
          text: "Something went wrong. Please try again.",
          icon: "error",
          background: "rgba(255, 255, 255, 0.1)",
          backdrop: "rgba(0, 0, 0, 0.4)",
          timer: 3000,
          showConfirmButton: false,
          customClass: {
            popup: "glassmorphic-popup",
            title: "glassmorphic-title",
            htmlContainer: "glassmorphic-text",
          },
        });
      }
    };
    getPriceCardData();
  }, []);


  // Function to process and set display data based on plan duration
  useEffect(() => {
    if (subscriptionData.length > 0) {
      const currentPlan = subscriptionData.find(
        (plan) => plan.name === planDuration
      );

      if (currentPlan) {
        // Clean up features by removing \\n
        const cleanFeatures = currentPlan.features
          .map((feature) => feature.replace(/\\n/g, "").trim())
          .filter((feature) => feature.length > 0);

        setDisplayPlan({
          title: "EnterPrise",
          subtitle: currentPlan.description,
          price: `$${currentPlan.price}`,
          services: cleanFeatures,
          recommended: currentPlan.recommended,
          stripe_price_id: currentPlan.id,
        });
      }
    }
  }, [subscriptionData, planDuration]);

  // Static free plan
  const freePlan: PlanData = {
    title: "Corporate",
    subtitle: "For large teams & corporations.",
    price: "Free",
    services: [
      "Advanced employee directory",
      "Project management",
      "Resource scheduling",
      "Version control",
      "Team collaboration",
      "Advanced analytics",
    ],
  };

  // Combine plans for rendering
  const plansToRender = [freePlan];
  if (displayPlan) {
    plansToRender.push(displayPlan);
  }

  const handlePlanClick = async (plan: PlanData) => {

    console.log("user is not finding",user);
    // Swal.fire
    if (!user) {
       Swal.fire({
        title: "Authentication Required",
        text: "You must be logged in to access this page.",
        icon: "warning",
        iconColor: "#DBD0A6",
        showCancelButton: true,
        confirmButtonText: "Go to Login",
        cancelButtonText: "Go to Home",
        background: "rgba(255, 255, 255, 0.1)",
        backdrop: "rgba(0, 0, 0, 0.4)",
        customClass: {
          popup: "glassmorphic-popup",
          title: "glassmorphic-title",
          htmlContainer: "glassmorphic-text",
          confirmButton: "glassmorphic-button",
          cancelButton: "glassmorphic-button",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login", { state: { from: location }, replace: true });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          navigate("/", { replace: true });
        }
      });
    }else{
      if (plan.title !== "Corporate") {
      const res = await axios.post(
        `/api/subscriptions/create-checkout-session/`,
        { plan_id: plan?.stripe_price_id }
      );

      if (res.status === 200) {
        window.location.href = res.data.url;
      }
    } else {
      navigate('/chat/general')
    }
    }
    // Navigate to checkout or perform any other action
    
  };


  return (
    <div className="bg-[url('/background.png')] py-28 px-5 bg-cover">
      <style>
        {`@keyframes gradient-light {
          0% { opacity: 0.7; transform: translateY(20px);}
          100% { opacity: 1; transform: translateY(0);}
        }
        .animate-gradient-light {
          animation: gradient-light 0.6s cubic-bezier(0.4,0,0.2,1);
        }
        .card-gradient {
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.04) 50%, rgba(255, 255, 255, 0.07) 100%);
          border: 1px solid;
          border-image-source: linear-gradient(180deg, rgba(255, 255, 255, 0.32) 0%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0.16) 100%);
          backdrop-filter: blur(84px);
        }
        .card-gradient:hover {         
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }
        .recommended-card {
          position: relative;
        }
        .recommended-card::before {
          content: 'Recommended';
          position: absolute;
          top: 15px;
          right: 15px;
          background: linear-gradient(135deg, #8E7D3F, #DBD0A6);
          color: black;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          z-index: 20;
        }`}
      </style>
      {/* <h2 className="py-2 px-3 rounded-r-full text-center w-80 mx-auto rounded-l-full bg-transparent backdrop-blur-lg text-white border-2 border-gray-200/20 ">
        Bring your business to the best scale
      </h2> */}

      {/* <h1 className="sm:text-[86px] text-5xl  py-5 font-normal font-league-gothic text-center text-white bg-gradient-to-t from-black to-white bg-clip-text">
        Discover Products With <br /> the Best Pricing
      </h1>
      <p className="text-center pb-16 text-xl text-white font-montserrat">
        Select from best plan, ensuring a perfect match. Need more <br /> or
        less? Customize your subscription for a seamless fit!
      </p> */}

      <div id="pricing" className="flex justify-center">
        <div className="flex rounded-xl p-1 backdrop:blur-2xl border gap-2 justify-center mb-12">
          <button
            className={`px-8 py-3 bg-gradient-to-t  rounded-xl text-sm transition-colors duration-300 ${planDuration === "monthly"
              ? "from-[#8E7D3F] to-[#DBD0A6] text-black font-semibold "
              : " text-gray-100 font-normal from-[#0706061a] to-[#FFFFFF1A]"
              }`}
            onClick={() => setPlanDuration("monthly")}
          >
            Monthly
          </button>
          <button
            className={`px-8 py-3 bg-gradient-to-t   rounded-xl text-sm transition-colors duration-200 ${planDuration === "yearly"
              ? "from-[#8E7D3F] to-[#DBD0A6] text-black font-semibold "
              : " text-gray-100 font-normal from-[#0706061a] to-[#FFFFFF1A]"
              }`}
            onClick={() => setPlanDuration("yearly")}
          >
            Yearly
          </button>
        </div>
      </div>

      <div className="text-white sm:flex-row flex-col  gap-6 sm:gap-4 flex items-center justify-center">
        {plansToRender.map((plan, idx) => (
          <div
            key={idx}
            className={`card-gradient  group mx-6 w-80 lg:w-96 rounded-3xl shadow-2xl transition-all duration-300 relative overflow-hidden ${plan.recommended ? "recommended-card" : ""
              }`}
          >
            <div className="relative z-10 p-8">
              <div className="flex justify-start mb-6">
                <div className="w-10 h-10 rounded-full bg-[#FFFFFF29] group-hover:bg-gray-300 flex items-center justify-center">
                  <div className="w-5 h-5 duration-300 rounded-full bg-white group-hover:bg-black flex justify-center items-center">
                    <div className="w-3 h-3 rounded-full bg-black group-hover:bg-white/80" />
                  </div>
                </div>
              </div>

              <h1 className="text-3xl font-bold text-start text-white mb-2">
                {plan.title}
              </h1>
              <p className="text-start text-gray-300 mb-6 max-h-32 overflow-scroll scrollbar-hide">{plan.subtitle}</p>
              <style>
                {`
                  .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                  }
                  .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                  }
                `}
              </style>

              <div className="text-start mb-8">
                <span className="text-5xl font-bold text-white">
                  {plan.price}
                </span>
                {plan.price !== "Free" && (
                  <span className=" px-3">
                    {planDuration === "monthly" ? "/per month" : "/per year"}
                  </span>
                )}
              </div>

              <div className="flex justify-center mb-8">
                <button
                  onClick={() => handlePlanClick(plan)}

                  className="w-full text-center py-3 rounded-full bg-gradient-to-t from-[#0706061a] to-[#FFFFFF1A] border-[1px] group-hover:from-[#8E7D3F] group-hover:to-[#DBD0A6] text-white group-hover:text-black font-semibold shadow-lg transition-all duration-500 transform hover:scale-105"
                >
                  Get Started
                </button>
              </div>

              <hr className="border-gray-600/50 mb-6" />

              <h2 className="text-xl font-semibold text-start mb-6 text-white">
                What you will get
              </h2>

              <ul className="space-y-4">
                {plan.services.map((service, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <IoCheckmarkCircleOutline className="text-green-400 text-xl flex-shrink-0" />
                    <span className="text-gray-300">{service}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
