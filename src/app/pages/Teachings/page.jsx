"use client"

import React, { useEffect, useState } from 'react';

const Teachings = () => {
  const [data, setData] = useState([]);

 
  useEffect(() => {
    const getData = async () => {
      try {
        const response= await fetch('https://www.nitjsr.ac.in/backend/api/faculty_course?id=CS103')
        const result = await response.json();
        setData(result.result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    getData();
    
  }, []);

  return (
    <div>
    <h2>Courses Taught</h2>
      <ul>
        {data.map((value, index) => (
          <li key={index}>
            <a
              target="_blank"
              rel="noreferrer"
              href={value.course_handout}
              className='flex justify-between p-2 border '
            >
              <div >
                <b >{value.course_name}</b> -{" "}
                <span >{value.course_id}</span>
              </div>
              <div>
                <span >Semester: {value.year}</span>
              </div>
            </a>
          </li>
        ))}
      </ul>
  </div>
  );
};

export default Teachings;
