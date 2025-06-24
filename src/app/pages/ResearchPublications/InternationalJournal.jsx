"use client";

import React, { useEffect, useState } from 'react';

const InternationalJournal = ({ propData: publications }) => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchAllDetails = async () => {
      const detailedArticles = await Promise.all(
        publications.map(async (pub) => {
          try {
            const res = await fetch(`https://www.nitjsr.ac.in/backend/api/publications/view?id=${pub.id}`);
            const data = await res.json();
            return data.result;
          } catch {
            return pub; // fallback to base info
          }
        })
      );
      setArticles(detailedArticles);
    };

    fetchAllDetails();
  }, [publications]);

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      {articles.length === 0 ? (
        <p className="text-gray-600 text-center mt-10">No International Journals Found</p>
      ) : (
        articles.map((article, index) => (
          <div
            key={index}
            className="w-full p-4 mb-6 border border-gray-300 rounded hover:shadow transition duration-200 bg-white"
          >
            <h2 className="font-semibold text-sky-800 text-lg mb-2">{article.title}</h2>
            <p className="text-sm text-gray-700">
              <b>Journal:</b> {article.journal}
            </p>
            {article.volume && (
              <p className="text-sm text-gray-700">
                <b>Volume:</b> {article.volume}
              </p>
            )}
            {article.page_no && (
              <p className="text-sm text-gray-700">
                <b>Page No:</b> {article.page_no}
              </p>
            )}
            <p className="text-sm text-gray-700">
              <b>Date:</b> {article.pub_date}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <b className="text-sm text-gray-700">Authors:</b>
              {article.authors?.split(',').map((author, idx) => (
                <span key={idx} className="bg-gray-200 px-2 py-1 rounded text-xs text-black">
                  {author.trim()}
                </span>
              ))}
            </div>
            {article.link && (
              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 text-sm mt-2 inline-flex items-center hover:underline"
              >
                View Article
              </a>
            )}
            {article.info && (
              <div
                className="mt-3 text-sm text-gray-800 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: article.info }}
              />
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default InternationalJournal;
