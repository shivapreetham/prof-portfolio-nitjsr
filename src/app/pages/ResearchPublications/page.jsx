"use client";

import React, { useState, useEffect } from 'react';
import InternationalJournal from './InternationalJournal';
import InternationalConference from './InternationalConference';
import BookChapters from './BookChapters';
import Books from './Books';

const pubTypes = [
  {
    name: 'International Journal Papers',
    component: InternationalJournal,
    key: 'ijp',
    value: 'International Journal Paper',
  },
  {
    name: 'International Conference Papers',
    component: InternationalConference,
    key: 'icp',
    value: 'International Conference Paper',
  },
  {
    name: 'Book Chapters',
    component: BookChapters,
    key: 'bkc',
    value: 'Book Chapters',
  },
  {
    name: 'Books',
    component: Books,
    key: 'bk',
    value: 'Book',
  },
];

const ResearchPublications = () => {
  const [activeSubTab, setActiveSubTab] = useState(0);
  const [hoveredTab, setHoveredTab] = useState(null);
  const [publications, setPublications] = useState([]);
  const [publicationLoaded, setPublicationLoaded] = useState(false);

  const renderSubTabContent = (publications) => {
    const propData = publications.filter(
      (pub) => pub?.type === pubTypes[activeSubTab].value
    );
    const ActiveComponent = pubTypes[activeSubTab].component;
    return <ActiveComponent propData={propData} />;
  };

  useEffect(() => {
    const getData = async () => {
      const publicationsData = await fetch(
        `https://www.nitjsr.ac.in/backend/api/publications?id=CS103`
      );
      let a = await publicationsData.json();
      a = a.result;
      a.sort((a, b) => b.pub_date - a.pub_date);
      setPublications(a);
      setPublicationLoaded(true);
    };

    getData();
  }, []);

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="overflow-x-auto my-5">
        <div className="flex space-x-5 mb-4 whitespace-nowrap justify-start sm:justify-center">
          {pubTypes.map((subTab, index) => (
            <button
              key={index}
              className={`py-2 text-sm font-medium border-b-2 transition duration-300
                ${
                  activeSubTab === index
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-700'
                }
                ${
                  hoveredTab === index && activeSubTab !== index
                    ? 'border-gray-500'
                    : ''
                }`}
              onClick={() => setActiveSubTab(index)}
              onMouseEnter={() => setHoveredTab(index)}
              onMouseLeave={() => setHoveredTab(null)}
            >
              {subTab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="w-full">
        {publicationLoaded ? (
          <>
            {publications.length === 0 ? (
              <div>No Publication Found</div>
            ) : (
              renderSubTabContent(publications)
            )}
          </>
        ) : (
          <div>Loading content</div>
        )}
      </div>
    </div>
  );
};

export default ResearchPublications;
