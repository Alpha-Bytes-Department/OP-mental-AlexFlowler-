import { FaArrowLeftLong } from "react-icons/fa6";
import { Link } from "react-router-dom";

const Error = () => {
  return (
    <div className="bg-[url('/background.png')] min-h-screen ">
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <h3 className="text-4xl font-bold text-[#949e98a6]">Error</h3>
        <h1 className="text-[150px] py-5 font-league-gothic font-extrabold text-hCard">404</h1>
        <h2 className="text-3xl text-[#949e98a6]">Page Not Found</h2>
        <Link to={'/'}>
          <div className="btn bg-cCard border-none mt-10 flex justify-center group items-center"> <FaArrowLeftLong size={24} className=" duration-300 group-hover:-translate-x-3" /> <p className="">Return to Home</p></div>
        </Link>
      </div>

      </div>
  )
}

export default Error