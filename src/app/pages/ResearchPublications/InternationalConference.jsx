"use client";

import React, { useEffect, useMemo, useState } from "react";

const normalizeRemoteArticle = (article) => {
  const authorsList = article.authors
    ? article.authors.split(",").map((author) => author.trim()).filter(Boolean)
    : [];
  const publishedAtValue = article.pub_date ? new Date(article.pub_date).getTime() : null;
  return {
    title: article.title,
    journal: article.journal,
    volume: article.volume,
    page_no: article.page_no,
    pub_date: article.pub_date,
    authorsList,
    link: article.link,
    info: article.info,
    publishedAtValue,
  };
};

const normalizeBackendPaper = (paper) => {
  const publishedAtValue = paper.publishedAt ? new Date(paper.publishedAt).getTime() : null;
  return {
    title: paper.title,
    journal: paper.journalOrConference,
    volume: paper.volume,
    page_no: paper.pages,
    pub_date: paper.publishedAt ? new Date(paper.publishedAt).toLocaleDateString() : "Date unavailable",
    authorsList: Array.isArray(paper.authors) ? paper.authors : [],
    link: paper.externalLink,
    info: null,
    pdfUrl: paper.pdfUrl,
    description: paper.description,
    publishedAtValue,
  };
};

const InternationalConference = ({ propData: publications, backendData = [] }) => {
  const [remoteArticles, setRemoteArticles] = useState([]);

  useEffect(() => {
    const fetchAllDetails = async () => {
      const detailedArticles = await Promise.all(
        publications.map(async (pub) => {
          try {
            const res = await fetch(
              `https://www.nitjsr.ac.in/backend/api/publications/view?id=${pub.id}`
            );
            if (!res.ok) throw new Error('Failed');
            const data = await res.json();
            return normalizeRemoteArticle(data.result);
          } catch {
            return normalizeRemoteArticle(pub);
          }
        })
      );
      setRemoteArticles(detailedArticles);
    };

    if (publications?.length) {
      fetchAllDetails();
    } else {
      setRemoteArticles([]);
    }
  }, [publications]);

  const combinedArticles = useMemo(() => {
    const backendArticles = backendData.map(normalizeBackendPaper);
    const list = [...backendArticles, ...remoteArticles];
    return list.sort((a, b) => {
      const aTime = typeof a.publishedAtValue === 'number' ? a.publishedAtValue : 0;
      const bTime = typeof b.publishedAtValue === 'number' ? b.publishedAtValue : 0;
      return bTime - aTime;
    });
  }, [backendData, remoteArticles]);

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      {combinedArticles.length === 0 ? (
        <p className="text-gray-600 text-center mt-10">
          No International Conferences Found
        </p>
      ) : (
        combinedArticles.map((article, index) => (
          <div
            key={`${article.title}-${index}`}
            className="w-full p-4 mb-6 border border-gray-300 rounded hover:shadow transition duration-200 bg-white"
          >
            <h2 className="font-semibold text-sky-800 text-lg mb-2">
              {article.title}
            </h2>
            {article.journal && (
              <p className="text-sm text-gray-700">
                <b>Journal:</b> {article.journal}
              </p>
            )}
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
            {article.pub_date && (
              <p className="text-sm text-gray-700">
                <b>Date:</b> {article.pub_date}
              </p>
            )}
            {article.authorsList.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                <b className="text-sm text-gray-700">Authors:</b>
                {article.authorsList.map((author, idx) => (
                  <span
                    key={`${article.title}-author-${idx}`}
                    className="bg-gray-200 px-2 py-1 rounded text-xs text-black"
                  >
                    {author}
                  </span>
                ))}
              </div>
            )}
            <div className="mt-3 flex flex-wrap gap-3 text-sm">
              {article.link && (
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 text-sm mt-2 inline-block hover:underline"
                >
                  View Article 🔗
                </a>
              )}
              {article.pdfUrl && (
                <a
                  href={article.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 text-sm mt-2 inline-block hover:underline"
                >
                  Download PDF
                </a>
              )}
            </div>
            {article.description && (
              <p className="mt-3 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                {article.description}
              </p>
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

export default InternationalConference;
