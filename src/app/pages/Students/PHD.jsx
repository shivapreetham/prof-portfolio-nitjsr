import React, { useState } from 'react';
import ReactPaginate from 'react-paginate';

const PHD = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  const theses = data?.length ? data : [
    { research_topic: 'No Thesis Supervised', name_of_student: 'N/A', completion_year: 0 },
  ];

  const offset = currentPage * itemsPerPage;
  const currentData = theses.slice(offset, offset + itemsPerPage);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4">PhD Theses Supervised</h3>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border border-gray-300">Research Topic</th>
              <th className="px-4 py-2 border border-gray-300">Student</th>
              <th className="px-4 py-2 border border-gray-300">Year of Completion</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((thesis, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-2 border border-gray-300">{thesis.research_topic}</td>
                <td className="px-4 py-2 border border-gray-300">{thesis.name_of_student}</td>
                <td className="px-4 py-2 border border-gray-300">
                  {thesis.completion_year || 'Ongoing'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ReactPaginate
        previousLabel={'<'}
        nextLabel={'>'}
        breakLabel={'...'}
        pageCount={Math.ceil(theses.length / itemsPerPage)}
        onPageChange={handlePageChange}
        containerClassName="flex justify-center items-center gap-2 mt-4 text-sm"
        pageClassName="px-3 py-1 border border-gray-300 rounded hover:bg-gray-200 cursor-pointer"
        previousClassName="px-3 py-1 border border-gray-300 rounded hover:bg-gray-200 cursor-pointer"
        nextClassName="px-3 py-1 border border-gray-300 rounded hover:bg-gray-200 cursor-pointer"
        activeClassName="bg-sky-500 text-white"
        breakClassName="px-2"
        renderOnZeroPageCount={null}
      />
    </div>
  );
};

export default PHD;
