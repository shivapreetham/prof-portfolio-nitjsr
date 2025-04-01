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
    teachingExperience: [],
    awards: [],
    collaborations: []
  });

  const getUserData = async () => {
    try {
      // Replace these endpoints with your actual API routes.
      const [
        userRes,
        projectsRes,
        papersRes,
        conferencesRes,
        achievementsRes,
        postsRes,
        teachingRes,
        awardsRes,
        collaborationsRes
      ] = await Promise.all([
        fetch('/api/user'),
        fetch('/api/projects'),
        fetch('/api/research-papers'),
        fetch('/api/conferences'),
        fetch('/api/achievements'),
        fetch('/api/blog-posts'),
        fetch('/api/teaching-experience'),
        fetch('/api/awards'),
        fetch('/api/collaborations')
      ]);

      if (!userRes.ok) throw new Error('Failed to fetch user');
      if (!projectsRes.ok) throw new Error('Failed to fetch projects');
      if (!papersRes.ok) throw new Error('Failed to fetch research papers');
      if (!conferencesRes.ok) throw new Error('Failed to fetch conferences');
      if (!achievementsRes.ok) throw new Error('Failed to fetch achievements');
      if (!postsRes.ok) throw new Error('Failed to fetch blog posts');
      if (!teachingRes.ok) throw new Error('Failed to fetch teaching experience');
      if (!awardsRes.ok) throw new Error('Failed to fetch awards');
      if (!collaborationsRes.ok) throw new Error('Failed to fetch collaborations');

      const userDataJson = await userRes.json();
      const projectsData = await projectsRes.json();
      const papersData = await papersRes.json();
      const conferencesData = await conferencesRes.json();
      const achievementsData = await achievementsRes.json();
      const postsData = await postsRes.json();
      const teachingData = await teachingRes.json();
      const awardsData = await awardsRes.json();
      const collaborationsData = await collaborationsRes.json();

      setUserData({
        user: userDataJson,
        projects: projectsData,
        researchPapers: papersData,
        conferences: conferencesData,
        achievements: achievementsData,
        blogPosts: postsData,
        teachingExperience: teachingData,
        awards: awardsData,
        collaborations: collaborationsData
      });
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <UserContext.Provider value={userData}>
      {children}
    </UserContext.Provider>
  );
};

export default Provider;
