import React, { useState } from "react";
import { MdDelete } from "react-icons/md";
import { FaFilter } from "react-icons/fa";

// ----type declarations---------
interface JournalEntry {
  id: string;
  description: string;
  category: string;
  createdDate: string;
}

interface CategoryStats {
  [key: string]: number;
}

const JournalList: React.FC = () => {
  //--------states--------
  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      id: "JJE-001",
      description: "Tips and Goals...",
      category: "Personal Trigger",
      createdDate: "2023-08-19",
    },
    {
      id: "JJE-002",
      description: "Attend Meet Up Website Redesign",
      category: "Negative Trigger",
      createdDate: "2023-08-19",
    },
    {
      id: "JJE-003",
      description: "Marketing Campaign Best Practices",
      category: "Recurring Thought",
      createdDate: "2023-08-18",
    },
    {
      id: "JJE-004",
      description: "Meeting Notes with Marketing Team",
      category: "Future Goal",
      createdDate: "2023-08-17",
    },
    {
      id: "JJE-005",
      description: "Personal Reflections on Recent Changes",
      category: "Milestone Gratitude",
      createdDate: "2023-08-16",
    },
    {
      id: "JJE-006",
      description: 'Book Notes "Moving Habits"',
      category: "Personal Trigger",
      createdDate: "2023-08-08",
    },
    {
      id: "JJE-007",
      description: "Monthly Review July 2023",
      category: "Recurring Thought",
      createdDate: "2023-08-05",
    },
    {
      id: "JJE-008",
      description: "Travel Plans for September Vacation",
      category: "Future Goal",
      createdDate: "2023-08-02",
    },
  ]);

  const [selectedCategory, setSelectedCategory] =
    useState<string>("All Categories");

  //--------- constants --------
  const categories = [
    "Personal Trigger",
    "Negative Trigger",
    "Recurring Thought",
    "Future Goal",
    "Milestone Gratitude",
  ];

  //--------- entry handlers --------
  const deleteEntry = (id: string) => {
    setEntries(entries.filter((entry) => entry.id !== id));
  };

  //--------- filter entries based on category --------
  const filteredEntries =
    selectedCategory === "All Categories"
      ? entries
      : entries.filter((entry) => entry.category === selectedCategory);

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
      const entryDate = new Date(entry.createdDate);
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
      const entryDate = new Date(entry.createdDate);
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
              <span className="text-gray-400"><FaFilter /></span>
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
          <div className="grid grid-cols-12 gap-4  text-gray-400 text-sm">
            <div className="col-span-2">Entry ID</div>
            <div className="col-span-5">Description</div>
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
                key={entry.id}
                className={`grid grid-cols-12 gap-4 py-3 px-2 rounded ${
                  index % 2 === 0 ? "bg-gray-900/50" : "bg-gray-800/30"
                } hover:bg-gray-700/50 transition-colors`}
              >
                <div className="col-span-2 text-gray-300 font-mono text-sm">
                  {entry.id}
                </div>
                <div className="col-span-5 text-gray-300">
                  {entry.description}
                </div>
                <div className="col-span-3 text-gray-400 text-sm">
                  {entry.createdDate}
                </div>
                <div className="col-span-2">
                  <button
                    onClick={() => deleteEntry(entry.id)}
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
                        className={`w-3 h-3 ${colors[index]} rounded-full`}
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
                        width: `${(thisMonthCount / totalEntries) * 100}%`,
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
                        width: `${(lastWeekCount / totalEntries) * 100}%`,
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
