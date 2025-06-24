"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useUser } from "../../Provider"; // adjust path if needed

const textAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const ResponsibilitiesPage = () => {
  const [ isLoading, setIsLoading  ] = useState() ;

  const [responsibility, setResponsibility] = useState(null);

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      const resData = await fetch(
        `https://nitjsr.ac.in/backend/api/people/responsibility?id=CS103`
      );
      const result = await resData.json();
      setResponsibility(result);
      setIsLoading(false);
    };
    getData();
  }, []);

  if (isLoading) return <p className="p-8">Loading...</p>;

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
    //       Collaborations
    //     </motion.h1>
    //     <motion.p
    //       className="text-base lg:text-xl text-[#b3e6f9]"
    //       initial="hidden"
    //       animate="visible"
    //       variants={textAnimation}
    //       transition={{ delay: 0.2 }}
    //     >
    //       Projects and research contributions done in collaboration with peers.
    //     </motion.p>
    //   </div>

    //   {/* Content */}
    //   <div className="px-4 sm:px-6 lg:px-32 py-12">
    //     {collaborations.length > 0 ? (
    //       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    //         {collaborations.map((collab, index) => (
    //           <div
    //             key={collab._id || index}
    //             className="relative bg-white shadow-md rounded-lg p-6 border border-[#e0f4fb] flex"
    //           >
    //             {/* Blue accent bar */}
    //             <div className="absolute left-0 top-0 h-full w-2 bg-[#0093cb] rounded-l-lg" />

    //             {/* Card content */}
    //             <div className="pl-4 flex flex-col w-full">
    //               <h3 className="text-xl font-semibold text-[#0093cb] mb-3">
    //                 {collab.projectTitle}
    //               </h3>

    //               <div className="mb-2 text-sm text-gray-700 space-y-1">
    //                 <p>
    //                   <span className="font-medium text-gray-900">👤:</span>{" "}
    //                   {collab.collaboratorName}
    //                 </p>
    //                 {collab.institution && (
    //                   <p>
    //                     <span className="font-medium text-gray-900">🏛️:</span>{" "}
    //                     {collab.institution}
    //                   </p>
    //                 )}
    //               </div>

    //               <div className="flex items-center flex-wrap gap-4 mt-4 text-sm text-gray-500">
    //                 <span>
    //                   <span className="font-medium text-gray-600">Start:</span>{" "}
    //                   {new Date(collab.startDate).toLocaleDateString()}
    //                 </span>
    //                 {collab.endDate && (
    //                   <span>
    //                     <span className="font-medium text-gray-600">End:</span>{" "}
    //                     {new Date(collab.endDate).toLocaleDateString()}
    //                   </span>
    //                 )}
    //               </div>
    //             </div>
    //           </div>
    //         ))}
    //       </div>
    //     ) : (
    //       <p className="text-center text-gray-500 mt-12">
    //         No collaborations found.
    //       </p>
    //     )}
    //   </div>
    // </div>

    <>
      <p className="px-4 text-bold font-semibold ">
         {responsibility &&
           responsibility.map((res) => {
          return (
            <div
              dangerouslySetInnerHTML={{ __html: res.ds }}
              key={res.ds}
            ></div>
          );
        })}
      </p>
    </>


  );
};

export default ResponsibilitiesPage;
