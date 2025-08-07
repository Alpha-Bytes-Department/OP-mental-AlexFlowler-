import { LuMessageCircleMore } from "react-icons/lu";
import { IoMicOutline } from "react-icons/io5";
import { GoVideo } from "react-icons/go";
import { AiOutlineSafety } from "react-icons/ai";
import { BsGraphUpArrow } from "react-icons/bs";
const Feature = () => {

const featureList=[
    {id:1,title:"Smart AI Chat Support",icon:<LuMessageCircleMore size={24} />,description:"Engage in dynamic conversations with our AI coach, receiving tailored advice and guidance."},
    {id:2,title:"Text & Voice Interaction",icon:<IoMicOutline size={24} />,description:"Interact seamlessly through text or voice, powered by advanced 11Labs technology."},
    {id:3,title:"Suggests Videos & Blogs",icon:<GoVideo size={24} />,description:"Receive curated video and blog suggestions aligned with your goals and interests."},
    {id:4,title:" Performance and Mental Wellbeing Coaching",icon:<BsGraphUpArrow size={24} />,description:"Gain valuable insights into your performance, with personalized feedback and progress tracking."},
    {id:5,title:"OP Mental Performance Tools",icon:<AiOutlineSafety size={24} />,description:"Rest assured with our HIPAA-compliant architecture, ensuring your data's privacy and security."},
]

  return <div className="bg-[url('/background.png')] bg-no-repeat bg-cover">
    <div className="flex flex-col items-center justify-center pb-20 pt-10">
      <div className=" flex items-center gap-3.5 px-4 py-3 my-13 rounded-lg border border-hCard bg-[#00000080]"> 
        <div className="h-2 w-2 rounded-full bg-hCard"></div>  <h2 className="text-xl font-bold text-white">Feature Section</h2>
      </div>
      <p className="text-lg text-white mb-10 text-center">Explore the capabilities of our AI coach chatbot, designed to enhance your personal and professional growth.</p>

      <h1 className="text-4xl font-normal font-league-gothic text-white pb-4">Core Features</h1>
      <p className=" text-lg font-inter text-center font-normal pb-24 text-white">Our AI coach chatbot offers a range of features to support your growth journey.</p>

    <div className="flex flex-col items-center gap-12 sm:px-10">
      <div className="flex sm:flex-row flex-col justify-center gap-10 sm:gap-6">
        {featureList.slice(0, 3).map((feature) => (
        <div key={feature.id} className="px-6 pt-12 pb-6 relative bg-cCard rounded-xl text-center max-w-[280px]">
          <div className="bg-hCard p-4 -top-8 left-[40%] rounded-xl border border-white absolute text-white">
                {feature.icon}
        </div>
          <div>
            <h3 className="text-[16px] font-bold text-black">{feature.title}</h3>
            <p className="text-sm text-black">{feature.description}</p>
          </div>
        </div>
        ))}
      </div>
      <div className="flex sm:flex-row flex-col justify-center gap-10 sm:gap-6">
        {featureList.slice(3).map((feature) => (
         <div key={feature.id} className="px-6 pt-12 pb-6 relative bg-cCard rounded-xl text-center max-w-[280px]">
          <div className="bg-hCard p-4 -top-8 left-[40%] rounded-xl border border-white absolute text-white">
                {feature.icon}
        </div>
          <div>
            <h3 className="text-[16px] font-bold text-black">{feature.title}</h3>
            <p className="text-sm text-black">{feature.description}</p>
          </div>
        </div>
        ))}
      </div>
    </div>
    </div>

    
  </div>;
};

export default Feature;
