import React, { useState } from 'react';
import ReactPaginate from 'react-paginate';

const BachelorsTab = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  const theses = data?.length > 0 ? data : [
    { research_topic: 'NO Thesis Supervised', name_of_student: 'N/A', completion_year: 0 },
  ];

  const offset = currentPage * itemsPerPage;
  const currentData = theses.slice(offset, offset + itemsPerPage);

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <div className="w-full">
      <h3 className="text-xl font-semibold mb-4">Bachelors Theses Supervised</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left">Research Topic</th>
              <th className="border px-4 py-2 text-left">Student</th>
              <th className="border px-4 py-2 text-left">Year of Completion</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((thesis, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{thesis.research_topic}</td>
                <td className="border px-4 py-2">{thesis.name_of_student}</td>
                <td className="border px-4 py-2">{thesis.completion_year || 'Ongoing'}</td>
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
        marginPagesDisplayed={2}
        pageRangeDisplayed={3}
        onPageChange={handlePageChange}
        containerClassName="flex justify-center mt-6 gap-2 flex-wrap"
        pageClassName="px-3 py-1 border rounded-md text-sm cursor-pointer"
        activeClassName="bg-blue-600 text-white"
        previousClassName="px-3 py-1 border rounded-md text-sm cursor-pointer"
        nextClassName="px-3 py-1 border rounded-md text-sm cursor-pointer"
        breakClassName="px-3 py-1 text-gray-600"
      />
    </div>
  );
};

export default BachelorsTab;
