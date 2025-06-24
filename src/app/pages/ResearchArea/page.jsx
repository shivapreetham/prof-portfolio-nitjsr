"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { useUser } from "../../Provider";

const textAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const tabs = ["Papers Published", "Conferences Attended"];

const ResearchArea = () => {
  const [research, setResearch] = useState([]);
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const memberData = await fetch(
          `https://nitjsr.ac.in/backend/api/members?id=CS103`
        );
        const memberRes = await memberData.json();
        setMember(memberRes.result);

        const researchData = await fetch(
          `https://nitjsr.ac.in/backend/api/research?id=CS103`
        );
        const researchRes = await researchData.json();
        setResearch(researchRes.result);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    getData();
  }, []);

  if (loading) return <p className="p-8">Loading...</p>;

  return (
    // <div className="bg-[#f5ffff] text-[#0093cb] min-h-screen">
    //   {/* Header */}
    //   <div className="h-[50vh] bg-[#0093cb] flex flex-col justify-center items-start text-[#f5ffff] px-6 lg:px-20">
    //     <motion.h1
    //       className="text-3xl lg:text-5xl font-bold mb-2"
    //       initial="hidden"
    //       animate="visible"
    //       variants={textAnimation}
    //     >
    //       Research
    //     </motion.h1>
    //     <motion.p
    //       className="text-base lg:text-xl text-[#b3e6f9]"
    //       initial="hidden"
    //       animate="visible"
    //       variants={textAnimation}
    //       transition={{ delay: 0.2 }}
    //     >
    //       Published research papers and academic contributions.
    //     </motion.p>
    //   </div>

    //   {/* Tabs + Content */}
      
    //   <div className="px-4 sm:px-6 lg:px-32 py-8 lg:py-16">
    //     {/* Tabs */}
    //     <motion.div
    //       className="flex justify-start overflow-x-auto py-4 border-b border-[#0093cb]"
    //       initial="hidden"
    //       animate="visible"
    //       variants={{
    //         hidden: { opacity: 0 },
    //         visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
    //       }}
    //     >
    //       <div className="flex space-x-4">
    //         {tabs.map((tab) => (
    //           <motion.button
    //             key={tab}
    //             className={`flex-shrink-0 text-sm sm:text-base lg:text-lg font-semibold px-3 py-2 ${
    //               activeTab === tab
    //                 ? "text-[#0093cb] border-b-2 border-[#0093cb]"
    //                 : "text-gray-500 hover:text-[#0093cb] transition-colors"
    //             }`}
    //             onClick={() => setActiveTab(tab)}
    //           >
    //             {tab}
    //           </motion.button>
    //         ))}
    //       </div>
    //     </motion.div>

    //     {/* Content Area */}
    //     <div className="mt-8">
    //       {/* Papers - Card view */}
    //       {activeTab === "Papers Published" && (
    //         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    //           {papers.length > 0 ? (
    //             papers.map((paper, index) => (
    //               <div
    //                 key={paper._id || index}
    //                 className="bg-white shadow-md p-6 rounded-lg"
    //               >
    //                 <h3 className="text-lg font-semibold text-[#0093cb] mb-2">
    //                   {paper.title}
    //                 </h3>
    //                 <p className="text-gray-700 text-sm mb-4">
    //                   {paper.abstract}
    //                 </p>
    //                 <div className="flex items-center justify-between text-sm text-gray-500">
    //                   <span>
    //                     {new Date(paper.publishedAt).toLocaleDateString()}
    //                   </span>
    //                   {paper.pdfUrl && (
    //                     <a
    //                       href={paper.pdfUrl}
    //                       target="_blank"
    //                       rel="noopener noreferrer"
    //                       className="flex items-center gap-1 bg-[#0093cb] text-white px-3 py-1.5 rounded hover:bg-[#0076a2]"
    //                     >
    //                       <Download className="w-4 h-4" />
    //                       PDF
    //                     </a>
    //                   )}
    //                 </div>
    //               </div>
    //             ))
    //           ) : (
    //             <p className="text-center text-gray-500 mt-12">
    //               No research papers found.
    //             </p>
    //           )}
    //         </div>
    //       )}

    //       {/* Conferences - Table view */}
    //       {activeTab === "Conferences Attended" && (
    //         <div className="overflow-x-auto mt-4">
    //           {conferences.length > 0 ? (
    //             <div className="border border-[#0093cb] rounded-md shadow-md">
    //               <table className="min-w-full bg-white">
    //                 <thead className="bg-[#0093cb] text-white">
    //                   <tr>
    //                     <th className="text-left p-4">Name</th>
    //                     <th className="text-left p-4">Location</th>
    //                     <th className="text-left p-4">Date</th>
    //                     <th className="text-left p-4">Paper Presented</th>
    //                   </tr>
    //                 </thead>
    //                 <tbody>
    //                   {conferences.map((conf, index) => (
    //                     <tr
    //                       key={conf._id || index}
    //                       className="hover:bg-[#f0fbff] border-t"
    //                     >
    //                       <td className="p-4 text-black font-medium">
    //                         {conf.name}
    //                       </td>
    //                       <td className="p-4 text-gray-700">
    //                         {conf.location || "—"}
    //                       </td>
    //                       <td className="p-4 text-gray-600 text-sm">
    //                         {new Date(conf.date).toLocaleDateString()}
    //                       </td>
    //                       <td className="p-4">
    //                         {conf.paperPresented ? (
    //                           <span className="bg-[#0093cb] text-white text-xs px-3 py-1 rounded-full">
    //                             Yes
    //                           </span>
    //                         ) : (
    //                           <span className="text-sm text-gray-400">No</span>
    //                         )}
    //                       </td>
    //                     </tr>
    //                   ))}
    //                 </tbody>
    //               </table>
    //             </div>
    //           ) : (
    //             <p className="text-center text-gray-500 mt-12">
    //               No conferences found.
    //             </p>
    //           )}
    //         </div>
    //       )}
    //     </div>
    //   </div>
      
    // </div>


     <div>
          <h2 className="text-sky-800">Research Areas</h2>
          <ul>
            {research.map((value, index) => (
              <li key={index}>{value.topic}</li>
            ))}
          </ul>
          <div>
            <h3 className='text-sky-800'>Societies</h3>
            <ul>
              {member.map((society, index) => (
                <li key={index}>{society.member}</li>
              ))}
            </ul>
          </div>
     </div>


  );
};

export default ResearchArea;
