'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/app/Provider';
import { motion } from 'framer-motion';

const textAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function AwardsPage() {
  const [ activities, setActivities ] = useState(null);
  const [activeTab, setActiveTab] = useState('Awards');

    useEffect(() => {
    const getData = async () => {
      const activitiesData = await fetch(
        `https://www.nitjsr.ac.in/backend/faculty/get_other_activities/CS103`
      );
      const res = await activitiesData.json()  
      setActivities(res.result);
    };

    getData();
  }, []);


  if (!activities) return <p className="text-center mt-10 text-gray-600">Loading user data...</p>;

  const tabs = ['Awards', 'Achievements'];

  // const renderCards = (items, type) => {
  //   return (
  //     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
  //       {items.map((item, index) => (
  //         <motion.div
  //           key={index}
  //           className="card bg-white border border-gray-100 shadow-md hover:shadow-xl transition-all"
  //           whileHover={{ scale: 1.02 }}
  //           initial={{ opacity: 0, y: 20 }}
  //           animate={{ opacity: 1, y: 0 }}
  //           transition={{ duration: 0.3, delay: index * 0.05 }}
  //         >
  //           <div className="card-body p-6 space-y-2">
  //             <h3 className="card-title text-xl font-semibold text-[#0093cb]">
  //               {item.title}
  //             </h3>

  //             {type === 'awards' ? (
  //               <>
  //                 <p className="text-gray-700 font-medium">
  //                   {item.organization || 'Unknown Organization'}
  //                 </p>
  //                 <p className="text-sm text-gray-500">
  //                   {new Date(item.date).toLocaleDateString()}
  //                 </p>
  //               </>
  //             ) : (
  //               <>
  //                 <p className="text-gray-700">{item.description || 'No description provided.'}</p>
  //                 <p className="text-sm text-gray-500">
  //                   {new Date(item.date).toLocaleDateString()}
  //                 </p>
  //               </>
  //             )}
  //           </div>
  //         </motion.div>
  //       ))}
  //     </div>
  //   );
  // };
  
  return (
    <div className="bg-[#f5ffff] text-[#1B2C48] min-h-screen">
      {activities &&
        activities.map((activity) => {
          console.log("activity", activities);
          
          return (
            <div
              dangerouslySetInnerHTML={{ __html: activity.activities }}
              key={activity.id}
              className="profile-section"
            ></div>
          );
          
        })}

        {activities.length === 0 ? ("Nothing Found") : null}
      </div>
  )

  // return (
  //   <div className="bg-[#f5ffff] text-[#1B2C48] min-h-screen">
  //     {/* Hero */}
  //     <div className="h-[50vh] bg-[#0093cb] flex flex-col justify-center items-start text-white px-6 lg:px-20 text-left">
  //       <motion.h1
  //         className="text-3xl lg:text-5xl font-bold mb-2"
  //         initial="hidden"
  //         animate="visible"
  //         variants={textAnimation}
  //         transition={{ duration: 0.5, ease: 'easeOut' }}
  //       >
  //         Awards & Achievements
  //       </motion.h1>
  //       <motion.p
  //         className="text-base lg:text-xl text-[#b3e6f9]"
  //         initial="hidden"
  //         animate="visible"
  //         variants={textAnimation}
  //         transition={{ delay: 0.2, duration: 0.5, ease: 'easeOut' }}
  //       >
  //         Celebrating milestones and honors throughout the journey.
  //       </motion.p>
  //     </div>

  //     {/* Tabs & Content */}
  //     <div className="px-4 sm:px-6 lg:px-32 py-8 lg:py-16">
  //       {/* Tabs */}
  //       <motion.div
  //         className="flex justify-start overflow-x-auto py-4 border-b border-[#0093cb]"
  //         initial="hidden"
  //         animate="visible"
  //         variants={{
  //           hidden: { opacity: 0 },
  //           visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  //         }}
  //       >
  //         <div className="flex space-x-4">
  //           {tabs.map((tab) => (
  //             <motion.button
  //               key={tab}
  //               className={`flex-shrink-0 text-sm sm:text-base lg:text-lg font-semibold px-3 py-2 ${
  //                 activeTab === tab
  //                   ? 'text-[#0093cb] border-b-2 border-[#0093cb]'
  //                   : 'text-gray-500 hover:text-[#0093cb] transition-colors'
  //               }`}
  //               onClick={() => setActiveTab(tab)}
  //             >
  //               {tab}
  //             </motion.button>
  //           ))}
  //         </div>
  //       </motion.div>

  //       {/* Animated Content */}
  //       <motion.div
  //         className="mt-8"
  //         initial="hidden"
  //         animate="visible"
  //         variants={textAnimation}
  //         transition={{ delay: 0.4, duration: 0.5, ease: 'easeOut' }}
  //       >
  //         <h2 className="text-xl sm:text-2xl font-bold text-[#0093cb] mb-6">
  //           {activeTab}
  //         </h2>

  //         {activeTab === 'Awards'
  //           ? renderCards(userData.awards, 'awards')
  //           : renderCards(userData.achievements, 'achievements')}
  //       </motion.div>
  //     </div>
  //   </div>
  // );


}
