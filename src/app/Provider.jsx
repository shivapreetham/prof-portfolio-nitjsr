'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const UserContext = createContext(null);
export const useUser = () => useContext(UserContext);

const Provider = ({ children }) => {
  const [userData, setUserData] = useState({
    user: null,
    projects: [],
    researchPapers: [],
    conferences: [],
    achievements: [],
    blogPosts: [],
    teachingExperiences: [],
    awards: [],
    collaborations: [],
    photos: [],
    videos: []
  });

  const getUserData = async () => {
    try {
      const res = await fetch('/api/getAllData');

      if (!res.ok) {
        throw new Error('Failed to fetch user data');
      }

      const { success, data } = await res.json();
      if (!success) throw new Error('Data fetch unsuccessful');

      setUserData(data);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};



export default Provider;
