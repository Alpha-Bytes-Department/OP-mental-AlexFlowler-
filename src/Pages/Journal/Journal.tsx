import { Form } from "react-router-dom";
import { FaBook } from "react-icons/fa6";
import { useState } from "react";

// ----type declaration---------
// interface FormData {
//   message: string;
// }

const Journal = () => {
  //--------states--------
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  
  //--------- handler for category selection --------
  const handleCategorySelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedCategory(event.target.value);
    console.log("Selected Category:", event.target.value);
  }

  return (
    <div className="flex flex-col gap-5 items-center min-h-screen mt-10">
      {/* ---------------- Header with icon----------------- */}
      <div className="flex flex-col justify-center items-center">
        <FaBook className="text-white" fontSize={40}/>
        <span className="text-2xl">Journal</span>
      </div>
      <h1>Choose Journal Category</h1>
      {/* --------------- Journal options---------------------- */}
      <Form className="flex flex-col gap-5 w-full overflow-y-auto max-h-[70vh] pb-5">
        <label className="py-5 bg-[#2D2D2D] rounded text-center mx-20 cursor-pointer">
          <span>Positive Trigger</span>
          <input 
            type="radio" 
            name="category" 
            className="hidden" 
            value="Positive trigger" 
            onChange={handleCategorySelect}
          />
        </label>
        <label className="py-5 bg-[#2D2D2D] rounded text-center mx-20 cursor-pointer">
          <span>Negative Trigger</span>
          <input 
            type="radio" 
            name="category" 
            className="hidden" 
            value="Negative trigger" 
            onChange={handleCategorySelect}
          />
        </label>
        <label className="py-5 bg-[#2D2D2D] rounded text-center mx-20 cursor-pointer">
          <span>Recurring Thought</span>
          <input 
            type="radio" 
            name="category" 
            className="hidden" 
            value="Recurring Thought" 
            onChange={handleCategorySelect}
          />
        </label>
        <label className="py-5 bg-[#2D2D2D] rounded text-center mx-20 cursor-pointer">
          <span>Future Goal</span>
          <input 
            type="radio" 
            name="category" 
            className="hidden" 
            value="Future goal" 
            onChange={handleCategorySelect}
          />
        </label>
        <label className="py-5 bg-[#2D2D2D] rounded text-center mx-20 cursor-pointer">
          <span>Milestone Gratitude</span>
          <input 
            type="radio" 
            name="category" 
            className="hidden" 
            value="Milestone gratitude" 
            onChange={handleCategorySelect}
          />
        </label>
      </Form>
    </div>
  );
};

export default Journal;
