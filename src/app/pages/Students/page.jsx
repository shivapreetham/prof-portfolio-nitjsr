'use client';

import React, { useState, useEffect } from 'react';
import PHDTab from './PHD';
import MastersTab from './Masters';
import BachelorsTab from './Bachelors';

const SUB_TABS = [
  { name: 'PhD', component: PHDTab },
  { name: 'Masters', component: MastersTab },
  { name: 'Bachelors', component: BachelorsTab },
];

const Students = () => {
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const [data3, setData3] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState(0);
  const [hoveredTab, setHoveredTab] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const res1 = await fetch('https://www.nitjsr.ac.in/backend/api/thesissupervised/phd?id=CS103');
        const result1 = await res1.json();
        setData(result1.sort((a, b) => b.completion_year - a.completion_year));

        const res2 = await fetch('https://www.nitjsr.ac.in/backend/api/thesissupervised/mtech?id=CS103');
        const result2 = await res2.json();
        setData2(result2.sort((a, b) => b.completion_year - a.completion_year));

        const res3 = await fetch('https://www.nitjsr.ac.in/backend/api/thesissupervised/btech?id=CS103');
        const result3 = await res3.json();
        setData3(result3.sort((a, b) => b.completion_year - a.completion_year));

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setLoading(false);
      }
    };

    getData();
  }, []);

  const renderSubTabContent = () => {
    const tabName = SUB_TABS[activeSubTab].name;
    const propData = tabName === 'PhD' ? data : tabName === 'Masters' ? data2 : data3;
    const ActiveComponent = SUB_TABS[activeSubTab].component;
    return <ActiveComponent data={propData} />;
  };

  return (
    <div className="w-full px-4 py-4">
      {loading ? (
        <div className="text-center text-gray-600">Loading Data...</div>
      ) : (
        <>
          <div className="flex gap-4 mb-6 overflow-x-auto">
            {SUB_TABS.map((tab, index) => (
              <button
                key={index}
                onClick={() => setActiveSubTab(index)}
                onMouseEnter={() => setHoveredTab(index)}
                onMouseLeave={() => setHoveredTab(null)}
                className={`py-2 px-4 border-b-2 text-sm font-medium transition duration-200
                  ${activeSubTab === index
                    ? 'text-sky-600 border-sky-400'
                    : hoveredTab === index
                    ? 'text-gray-800 border-black'
                    : 'text-gray-700 border-transparent'
                  }`}
              >
                {tab.name}
              </button>
            ))}
          </div>

          <div>{renderSubTabContent()}</div>
        </>
      )}
    </div>
  );
};

export default Students;
