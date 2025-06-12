import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Backlog from "./Backlog";
import { API_URL, API_TOKEN } from "../constants/constants";

const fetchBacklogTasks = async (page, pageSize) => {
  try {
    const statusResponse = await fetch(
      `${API_URL}/statuses?filters[statusName][$eq]=Backlog`,
      {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!statusResponse.ok) {
      throw new Error(`Failed to fetch status: ${statusResponse.status}`);
    }

    const statusData = await statusResponse.json();

    if (!statusData.data || statusData.data.length === 0) {
      throw new Error("Backlog status not found");
    }

    const backlogStatusId = statusData.data[0].id;

    const response = await fetch(
      `${API_URL}/tasks?filters[state][id][$eq]=${backlogStatusId}&pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort=createdAt:desc`,
      {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch tasks: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching backlog tasks:", error);
    throw error;
  }
};

function PaginatedBacklog() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["backlogTasks", currentPage, pageSize],
    queryFn: () => fetchBacklogTasks(currentPage, pageSize),
    keepPreviousData: true,
  });

  const handlePageChange = (newPage) => {
    if (newPage >= 1) {
      setCurrentPage(newPage);
    }
  };

  if (isLoading) {
    return (
      <div className="backlog-container">
        <div className="backlog-header">
          <h2 className="backlog-title">Backlog Tasks</h2>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="backlog-container">
        <div className="backlog-header">
          <h2 className="backlog-title">Backlog Tasks</h2>
        </div>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-medium">Error</p>
          <p className="text-sm mt-1">
            {error?.message ||
              "An error occurred while fetching the backlog tasks"}
          </p>
        </div>
      </div>
    );
  }

  if (!data || !data.meta || !data.meta.pagination) {
    return (
      <div className="backlog-container">
        <div className="backlog-header">
          <h2 className="backlog-title">Backlog Tasks</h2>
        </div>
        <div className="text-center py-8 text-gray-500">
          <p>No data available</p>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(data.meta.pagination.total / pageSize);
  const pageOptions = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="backlog-container">
      <Backlog tasks={data.data || []} />
      {totalPages > 1 && (
        <div className="backlog-pagination">
          <button
            className="backlog-pagination-btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          <select
            className="backlog-page-select"
            value={currentPage}
            onChange={(e) => handlePageChange(Number(e.target.value))}
          >
            {pageOptions.map((page) => (
              <option key={page} value={page}>
                Page {page}
              </option>
            ))}
          </select>

          <button
            className="backlog-pagination-btn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default PaginatedBacklog;
