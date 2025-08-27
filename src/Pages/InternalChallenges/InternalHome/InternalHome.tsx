import { useNavigate } from 'react-router-dom';
import { useAxios } from '../../../Providers/AxiosProvider';

const InternalHome = () => {
  const navigate = useNavigate();
  const axios = useAxios();

    const handleTriggerChat = async () =>{
      axios.post("/api/internal-challenge/",{
        message: "Hello"
      }).then((res)=>console.log("Ai response for hello", res))
      navigate("/chat/internalChat")
    }


    return (
        <div className="flex flex-col h-screen">
      <div className="flex flex-col justify-center items-center min-h-screen gap-3 z-50">
        <h1 className="text-5xl lg:text-8xl font-league-gothic">Internal Challenge</h1>
        <button onClick={handleTriggerChat}  className="border cursor-pointer border-[#dbd0a6] text-[#dbd0a6] text-md lg:text-xl font-semibold py-5 rounded-full bg-[#2d2d2d] text-center w-6/12">Start Internal Challenge</button>
      </div>
    </div>
    );
};

export default InternalHome;