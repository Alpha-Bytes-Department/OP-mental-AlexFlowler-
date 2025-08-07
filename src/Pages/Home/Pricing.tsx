import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { useState } from "react";
const Pricing = () => {

  const [planDuration, setPlanDuration] = useState<("monthly" | "yearly")>("monthly");

  return (
    <div  className="bg-[url('/background.png')] py-28 bg-cover">
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
        }`}
      </style>
      <h2 className="py-2 px-3 rounded-r-full text-center w-80 mx-auto rounded-l-full bg-transparent backdrop-blur-lg text-white border-2 border-gray-200/20 ">
        Bring your business to the best scale
      </h2>

      <h1 className="sm:text-[86px] text-6xl font-normal font-league-gothic text-center text-white bg-gradient-to-t from-black to-white bg-clip-text">
        Discover Products With <br /> the Best Pricing
      </h1>
      <p className="text-center pb-16 text-xl text-white font-montserrat">
        Select from best plan, ensuring a perfect match. Need more <br /> or
        less? Customize your subscription for a seamless fit!
      </p>

      <div id="pricing" className="flex justify-center">
        <div className="flex rounded-xl p-1 backdrop:blur-2xl border gap-2 justify-center mb-12">
              <button
                className={`px-8 py-3 bg-gradient-to-t  rounded-xl text-sm transition-colors duration-300 ${
                  planDuration === "monthly"
                  ? "from-[#8E7D3F] to-[#DBD0A6] text-black font-semibold "
                    : " text-gray-100 font-normal from-[#0706061a] to-[#FFFFFF1A]"
                }`}
                onClick={() => setPlanDuration("monthly")}
              >
                Monthly
              </button>
              <button
                className={`px-8 py-3 bg-gradient-to-t   rounded-xl text-sm transition-colors duration-200 ${
                  planDuration === "yearly"
                    ? "from-[#8E7D3F] to-[#DBD0A6] text-black font-semibold "
                    : " text-gray-100 font-normal from-[#0706061a] to-[#FFFFFF1A]"
                }`}
                onClick={() => setPlanDuration("yearly")}
              >
                Yearly
              </button>
        </div>
      </div>
    

      <div className="text-white sm:flex-row flex-col gap-6 sm:gap-4 flex items-center justify-center">


        {[
          {
            title: "Corporate",
            subtitle: "For large teams & corporations.",
            monthlyPrice: "Free",
            annualPrice: "Free",
            services: [
              "Advanced employee directory",
              "Project management",
              "Resource scheduling",
              "Version control",
              "Team collaboration",
              "Advanced analytics",
            ],
          },
          {
            title: "Enterprise",
            subtitle: "For businesses owners.",
            monthlyPrice: "$15",
            annualPrice: "$150",
            services: [
              "Customizable employee directory",
              "Client project management",
              "Client meeting schedule",
              "Compliance tracking",
              "Client communication",
              "Create custom reports tailored",
            ],
          },
        ].map((plan, idx) => (
          <div
            key={idx}
            className="card-gradient group mx-6 w-96 rounded-3xl shadow-2xl transition-all duration-300 relative overflow-hidden"
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
              <p className="text-start text-gray-300 mb-6">{plan.subtitle}</p>

              <div className="text-start mb-8">
                <span className="text-6xl font-bold text-white">
                  {planDuration === "monthly" ? plan.monthlyPrice : plan.annualPrice}

                </span>
               {plan.annualPrice!== "Free" &&<span className=" px-3">
                  {planDuration === "monthly" ? "/per month" : "/per year"}
                </span>}
              </div>

              <div className="flex justify-center mb-8">
                <button
                  className="w-full py-3 rounded-full bg-gradient-to-t from-[#0706061a] to-[#FFFFFF1A] border-[1px] group-hover:from-[#8E7D3F] group-hover:to-[#DBD0A6] text-white group-hover:text-black font-semibold shadow-lg transition-all duration-500 transform hover:scale-105"
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

