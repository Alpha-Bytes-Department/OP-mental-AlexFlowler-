import {
  FaTag,
  FaPen,
  FaClipboardList,
  FaHeart,
  FaBrain,
} from "react-icons/fa6";
import { TbCaptureFilled } from "react-icons/tb";
import { FaStar } from "react-icons/fa";
import { Form } from "react-router-dom";

const Journal = () => {
  return (
    <div className="flex flex-col items-center h-screen overflow-y-auto">
      <div className="w-full max-w-3xl px-4 py-8 pb-24">
        <h1 className="text-center mb-12 text-5xl font-league-gothic">
          Record Today's Insights
        </h1>
        <Form className="flex flex-col w-full gap-8 pb-12">
        <div>
          <p className="font-league-gothic text-2xl">
            <FaTag className="inline me-2 text-[#DBD0A6]"/> Entry point type:
          </p>
          <input
            type="text"
            className="w-full p-4 text-[#8E7D3F] bg-[#2D2A2B] rounded focus:outline-none focus:ring-2 focus:ring-[#DBD0A6] transition-all"
            name="entrypoint"
            placeholder="select a type"
          />
          <p className="text-[#DBD0A6]">
            Select a focus that feels emotionally charged, inspiring, or
            important.
          </p>
        </div>
        <div>
          <p className="font-league-gothic text-2xl">
            <FaPen className="inline me-2 text-[#DBD0A6]"/> Entry Point Description
          </p>
          <input
            type="text"
            className="w-full p-4 text-[#8E7D3F] bg-[#2D2A2B] rounded focus:outline-none focus:ring-2 focus:ring-[#DBD0A6] transition-all"
            name="description"
            placeholder="Describe the situation plainly"
          />
        </div>
        <div>
          <p className="font-league-gothic text-2xl">
            <FaClipboardList className="inline me-2 text-[#DBD0A6]"/> Surface Facts or Vision Details:
          </p>
          <input
            type="text"
            className="w-full p-4 text-[#8E7D3F] bg-[#2D2A2B] rounded focus:outline-none focus:ring-2 focus:ring-[#DBD0A6] transition-all"
            name="facts"
            placeholder="surface or vision details"
          />
          <p className="text-[#DBD0A6]">What actually happened? Stick to objective facts.</p>
        </div>
        <div>
          <p className="font-league-gothic text-2xl">
            <FaHeart className="inline me-2 text-[#DBD0A6]"/> Emotional Experience:
          </p>
          <input
            type="text"
            className="w-full p-4 text-[#8E7D3F] bg-[#2D2A2B] rounded focus:outline-none focus:ring-2 focus:ring-[#DBD0A6] transition-all"
            name="emotional"
            placeholder="What emotions do you feel "
          />
          <p className="text-[#DBD0A6]">How did this make you feel? Name your emotions.</p>
        </div>
        <div>
          <p className="font-league-gothic text-2xl">
            <FaBrain className="inline me-2 text-[#DBD0A6]"/> Interpretation & Beliefs:
          </p>
          <input
            type="text"
            className="w-full p-4 text-[#8E7D3F] bg-[#2D2A2B] rounded focus:outline-none focus:ring-2 focus:ring-[#DBD0A6] transition-all"
            name="iterpretation"
            placeholder="What does this mean to me?"
          />
          <p className="text-[#DBD0A6]">What beliefs or thoughts emerged from this experience?</p>
        </div>
        <div>
          <p className="font-league-gothic text-2xl">
            <TbCaptureFilled className="inline me-2 text-[#DBD0A6]"/> Perspective Expansion
          </p>
          <input
            type="text"
            className="w-full p-4 text-[#8E7D3F] bg-[#2D2A2B] rounded focus:outline-none focus:ring-2 focus:ring-[#DBD0A6] transition-all"
            name="perspective"
            placeholder="Challenge limiting views or amplify empowering ones"
          />
          <p className="text-[#DBD0A6]">How can you view this from a broader perspective?</p>
        </div>
        <div>
          <p className="font-league-gothic text-2xl">
            <FaStar className="inline me-2 text-orange-300"/> Value & Identity Connection
          </p>
          <input
            type="text"
            className="w-full p-4 text-[#8E7D3F] bg-[#2D2A2B] rounded focus:outline-none focus:ring-2 focus:ring-[#DBD0A6] transition-all"
            name="identity"
            placeholder="This aligns with my value of achievement."
          />
          <p className="text-[#DBD0A6]">How does this connect to your core values?</p>
        </div>
        <div className="text-end space-x-4">
                <button className="btn bg-[white] text-[#8E7D3F]">Cancle</button>
            <button className="btn bg-[#8E7D3F] text-white">Save Entry</button>
        </div>
      </Form>
      </div>
    </div>
  );
};

export default Journal;
