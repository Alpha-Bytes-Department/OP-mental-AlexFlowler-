import { Link } from 'react-router-dom';

const InternalHome = () => {
    return (
        <div className="flex flex-col h-screen">
      <div className="flex flex-col justify-center items-center min-h-screen gap-3 z-50">
        <h1 className="text-5xl lg:text-8xl font-league-gothic">Internal Challenge</h1>
        <Link to="/chat/internalChat" className="border border-[#dbd0a6] text-[#dbd0a6] text-md lg:text-xl font-semibold py-5 rounded-full bg-[#2d2d2d] text-center w-6/12">Start Internal Challenge</Link>
      </div>
    </div>
    );
};

export default InternalHome;