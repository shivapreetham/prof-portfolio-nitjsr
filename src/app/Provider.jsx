'use client'
import dbConnect from '@/utils/db';
import { 
  User, Project, ResearchPaper, Conference, 
  Achievement, BlogPost, TeachingExperience, 
  Award, Collaboration 
} from '@/models/models';
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
            await dbConnect(); // Ensure database is connected
            const userId = "1"; // Replace with dynamic user ID retrieval
            
            const [
                userResult,
                projectsResult,
                papersResult,
                conferencesResult,
                achievementsResult,
                postsResult,
                teachingResult,
                awardsResult,
                collaborationsResult
            ] = await Promise.all([
                User.findById(userId),
                Project.find({ userId }),
                ResearchPaper.find({ userId }),
                Conference.find({ userId }),
                Achievement.find({ userId }),
                BlogPost.find({ userId }),
                TeachingExperience.find({ userId }),
                Award.find({ userId }),
                Collaboration.find({ userId })
            ]);

            setUserData({
                user: userResult,
                projects: projectsResult,
                researchPapers: papersResult,
                conferences: conferencesResult,
                achievements: achievementsResult,
                blogPosts: postsResult,
                teachingExperience: teachingResult,
                awards: awardsResult,
                collaborations: collaborationsResult
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
}

export default Provider;
