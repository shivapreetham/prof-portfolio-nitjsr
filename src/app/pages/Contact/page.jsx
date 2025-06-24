'use client';

import React, { useState, useEffect } from 'react';

const Contact = () => {
  const [person, setPerson] = useState(null);
  const [personLoaded, setPersonLoaded] = useState(false);

  useEffect(() => {
    const getData = async () => {
      const personData = await fetch(`https://nitjsr.ac.in/backend/api/people/faculty?id=CS103`);
      const res = await personData.json();
      setPerson(res[0]);
      setPersonLoaded(true);
    };

    getData();
  }, []);

  return (
    <div className="w-full px-4 py-4 bg-white">
      {personLoaded && person ? (
        <>
          <h2 className="text-sky-800 text-xl font-semibold mb-4">Contact Information</h2>
          <ul className="mb-6 text-gray-800 space-y-2">
            <li>
              <span className="font-semibold">E-mail:</span>{' '}
              {person.email ? person.email : 'N/A'}
            </li>
            {person.fb_id && (
              <li>
                <span className="font-semibold">Social:</span>{' '}
                <a
                  href={person.fb_id}
                  target="_blank"
                  rel="noreferrer"
                  className="ml-2 text-sky-600 hover:underline"
                >
                  Facebook
                </a>
              </li>
            )}
          </ul>

          <div className="bg-slate-100 p-4 rounded-lg flex flex-wrap gap-3">
            {[
              {
                label: 'Google Scholar',
                value: person.scholar_link,
              },
              {
                label: 'Website',
                value: person.pw_link,
              },
              {
                label: 'Publon',
                value: person.publon_id,
              },
              {
                label: 'Orcid',
                value: person.orcid_id,
              },
              {
                label: 'Vidwan',
                value:
                  person.vidwan_id && person.vidwan_id !== '#'
                    ? person.vidwan_id.includes('http')
                      ? person.vidwan_id
                      : `https://vidwan.inflibnet.ac.in/profile/${person.vidwan_id.trim()}`
                    : null,
              },
            ].map((item, index) => (
              <div
                key={index}
                className="py-2 px-4 bg-slate-200 rounded-lg flex items-center w-max text-sm"
              >
                <span className="font-medium">{item.label}:</span>
                {item.value ? (
                  <a
                    href={item.value}
                    target="_blank"
                    rel="noreferrer"
                    className="ml-2 text-sky-500 hover:underline"
                  >
                    View
                  </a>
                ) : (
                  <span className="ml-2 text-gray-600">N/A</span>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-gray-500">Loading...</div>
      )}
    </div>
  );
};

export default Contact;
