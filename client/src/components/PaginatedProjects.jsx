import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ProjectList from "./ProjectList";
import Pagination from "./Pagination";
import { API_URL, API_TOKEN } from "../constants/constants";

const fetchProjects = async (page, pageSize) => {
  const response = await fetch(
    `${API_URL}/projects?pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort=createdAt:desc&populate[tasks][populate]=state`,
    {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch projects: ${response.status}`);
  }

  return response.json();
};

function PaginatedProjects() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["projects", currentPage, pageSize],
    queryFn: () => fetchProjects(currentPage, pageSize),
    keepPreviousData: true,
  });

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (isLoading) {
    return (
      <div role="status" className="flex justify-center my-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4"
        role="alert"
      >
        <p className="font-bold">Error</p>
        <p>{error.message || "An error occurred while fetching projects"}</p>
      </div>
    );
  }

  const totalPages = Math.ceil(data.meta.pagination.total / pageSize);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">Projects</h2>
        <p className="text-gray-600 mt-2">View all available projects</p>
      </div>

      <ProjectList projects={data.data} />

      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}

export default PaginatedProjects;
