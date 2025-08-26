import { Link } from "react-router-dom";
import brain from "../../../../public/Brain.png";

const MindsetHome = () => {
  return (
    <div className="flex flex-col h-screen">
      <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
        <div className="flex flex-col items-center gap-3">
          <img
            src={brain}
            alt="Mindset chat background"
            className="ms-10 mt-40 lg:mt-20 lg:ms-52 h-[600px] w-[600px] lg:h-[900px] lg:w-[900px]"
          />
        </div>
      </div>
      <div className="flex flex-col justify-center items-center min-h-screen gap-3 z-50">
        <h1 className="text-5xl lg:text-8xl font-league-gothic">
          Mindset Mantra
        </h1>
        <Link
          to="/chat/mindsetChat"
          className="border border-[#dbd0a6] text-[#dbd0a6] text-md lg:text-xl font-semibold py-5 rounded-full bg-[#2d2d2d] text-center w-6/12"
        >
          Start Mindset Mantra
        </Link>
      </div>
    </div>
  );
};

export default MindsetHome;
