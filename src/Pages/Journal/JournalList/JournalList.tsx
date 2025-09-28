import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { FaFilter } from "react-icons/fa";
import { useAxios } from "../../../Providers/AxiosProvider";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { SiGoogledocs } from "react-icons/si";

// ----type declarations---------
interface JournalEntry {
  id: string;
  description: string;
  category: string;
  created_at: string;
}


interface CategoryStats {
  [key: string]: number;
}

const JournalList: React.FC = () => {
  //--------states--------
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<string>("All Categories");
  const [categories, setCategories] = useState<string[]>([]);
  const axios = useAxios();

  //getting entries
  const gettingData = async () => {
    try {
      const res = await axios.get("api/journaling/sessions/");
      setEntries(res?.data);
    } catch (error) {
      console.log("Checking error", error);
    }
  };

  useEffect(() => {
    gettingData();
  }, []);

  // Extract unique categories from entries
  useEffect(() => {
    const uniqueCategories = [...new Set(entries.map((item) => item.category))];
    setCategories(uniqueCategories);
  }, [entries]);

  //--------- entry handlers --------
  const deleteEntry = (
    id: string,
  ) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      background: "rgba(255, 255, 255, 0.1)",
      backdrop: "rgba(0, 0, 0, 0.4)",
      customClass: {
        popup: "glassmorphic-popup",
        title: "glassmorphic-title",
        htmlContainer: "glassmorphic-text",
        confirmButton: "glassmorphic-confirm",
        cancelButton: "glassmorphic-cancel",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axios.delete(`api/journaling/sessions/${id}/`);
          
          console.log("deleted response", res);

          if (res.status === 204) {
            setEntries((prevEntries) =>
              prevEntries.filter((entry) => entry.id !== id)
            );
            Swal.fire({
              title: "Deleted!",
              text: "Your entry has been deleted.",
              icon: "success",
              timer: 2000,
              showConfirmButton: false,
              background: "rgba(255, 255, 255, 0.1)",
              backdrop: "rgba(0, 0, 0, 0.4)",
              customClass: {
                popup: "glassmorphic-popup",
                title: "glassmorphic-title",
                htmlContainer: "glassmorphic-text",
              },
            });
          }
        } catch (error) {
          console.error("Delete error", error);
          Swal.fire({
            title: "Error!",
            text: "Something went wrong while deleting.",
            icon: "error",
            confirmButtonText: "OK",
            background: "rgba(255, 255, 255, 0.1)",
            backdrop: "rgba(0, 0, 0, 0.4)",
            customClass: {
              popup: "glassmorphic-popup",
              title: "glassmorphic-title",
              htmlContainer: "glassmorphic-text",
              confirmButton: "glassmorphic-button",
            },
          });
        }
      }
    });
  };

  //--------- filter entries based on category --------
  const filteredEntries =
    selectedCategory === "All Categories"
      ? entries
      : entries.filter((entry) => entry?.category === selectedCategory);

  //--------- statistics calculations --------
  const getCategoryStats = (): CategoryStats => {
    const stats: CategoryStats = {};
    categories.forEach((cat) => {
      stats[cat] = entries.filter((entry) => entry.category === cat).length;
    });
    return stats;
  };

  //--------- time-based statistics --------
  const getThisMonthEntries = (): number => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    return entries.filter((entry) => {
      const entryDate = new Date(entry.created_at);
      return (
        entryDate.getMonth() === currentMonth &&
        entryDate.getFullYear() === currentYear
      );
    }).length;
  };

  const getLastWeekEntries = (): number => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return entries.filter((entry) => {
      const entryDate = new Date(entry.created_at);
      return entryDate >= oneWeekAgo;
    }).length;
  };

  //--------- calculate all stats --------
  const categoryStats = getCategoryStats();
  const thisMonthCount = getThisMonthEntries();
  const lastWeekCount = getLastWeekEntries();
  const totalEntries = entries.length;

  return (
    <div className="h-screen bg-black text-white flex flex-col">
      {/* --------------- Fixed Header section ---------------------- */}
      <div className="p-6 bg-black border-b border-gray-800">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">
            Journal Entries Management
          </h1>
          {/* --------------- Category filter ---------------------- */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-gray-400">Your Journal Entries</span>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">
                <FaFilter />
              </span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-gray-800 border border-gray-600 rounded px-3 py-1 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="All Categories">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* --------------- Table columns ---------------------- */}
          <div className="grid grid-cols-12 gap-4 text-gray-400 text-sm">
            <div className="col-span-2">Entry ID</div>
            <div className="col-span-5">Category</div>
            <div className="col-span-3">Created Date</div>
            <div className="col-span-2">Actions</div>
          </div>
        </div>
      </div>

      {/* --------------- Scrollable Content Area ---------------------- */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto">
          {/* --------------- Journal entries list ---------------------- */}
          <div className="space-y-1 mb-8">
            {filteredEntries.map((entry, index) => (
              <div
                key={entry.id} // Use entry.id instead of index for better React performance
                className={`grid grid-cols-12 gap-4 py-3 px-2 rounded ${
                  index % 2 === 0 ? "bg-gray-900/50" : "bg-gray-800/30"
                } hover:bg-gray-700/50 transition-colors`}
              >
                <div className="col-span-2 text-gray-300 font-mono text-sm">
                  {entry?.id}
                </div>
                <div className="col-span-5 text-gray-300">
                  {entry?.category}
                </div>
                <div className="col-span-3 text-gray-400 text-sm">
                  {entry?.created_at?.split("T")[0]}
                </div>
                <div className="col-span-2 flex justify-between items-center ">
                  <Link 
                    to={`/chat/journal/details/${entry?.id}`}
                    className="transition-colors p-1 cursor-pointer"
                    title="View Details"
                  >
                    <SiGoogledocs />
                  </Link >
                  <button
                    onClick={(event) =>{
                      event.preventDefault()
                      return deleteEntry(entry.id)
                    }}
                    className="text-red-400 hover:text-red-300 transition-colors p-1 cursor-pointer"
                    title="Delete entry"
                  >
                    <MdDelete className="text-red-700 text-xl" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* --------------- Analytics dashboard ---------------------- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* --------------- Category distribution ---------------------- */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Categories</h3>
              <div className="space-y-3">
                {categories.map((category, index) => {
                  const colors = [
                    "bg-blue-500",
                    "bg-gray-400",
                    "bg-red-500",
                    "bg-green-500",
                    "bg-yellow-500",
                  ];
                  return (
                    <div key={category} className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 ${
                          colors[index % colors.length]
                        } rounded-full`}
                      ></div>
                      <span className="text-gray-300 flex-1">{category}</span>
                      <span className="text-white font-mono">
                        {categoryStats[category]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* --------------- Time-based metrics ---------------------- */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Statistics</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Total Entries</span>
                    <span className="text-white font-mono text-lg">
                      {totalEntries}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-yellow-600 h-2 rounded-full"
                      style={{ width: "100%" }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">This Month</span>
                    <span className="text-white font-mono">
                      {thisMonthCount}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-yellow-600 h-2 rounded-full"
                      style={{
                        width:
                          totalEntries > 0
                            ? `${(thisMonthCount / totalEntries) * 100}%`
                            : "0%",
                      }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Last Week</span>
                    <span className="text-white font-mono">
                      {lastWeekCount}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-yellow-600 h-2 rounded-full"
                      style={{
                        width:
                          totalEntries > 0
                            ? `${(lastWeekCount / totalEntries) * 100}%`
                            : "0%",
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalList;
