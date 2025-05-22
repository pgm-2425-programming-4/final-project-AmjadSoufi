import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Backlog from "./Backlog";
import Pagination from "./Pagination";

const API_URL = import.meta.env.PROD
  ? "https://jammin-api-tz4x.onrender.com/api"
  : "http://localhost:1337/api";

const fetchBacklogTasks = async (page, pageSize) => {
  const statusResponse = await fetch(
    `${API_URL}/statuses?filters[statusName][$eq]=Backlog`,
    {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    }
  );
  const statusData = await statusResponse.json();
  console.log("Status Data:", statusData);

  if (!statusData.data || statusData.data.length === 0) {
    throw new Error("Backlog status not found");
  }

  const backlogStatusId = statusData.data[0].id;

  const response = await fetch(
    `${API_URL}/tasks?filters[state][id][$eq]=${backlogStatusId}&pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort=createdAt:desc`
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};

function PaginatedBacklog() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    const savedData = localStorage.getItem("backlogTasks");
    if (savedData) {
      console.log("Loaded data from local storage:", JSON.parse(savedData));
    }
  }, []);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["backlogTasks", currentPage, pageSize],
    queryFn: () => fetchBacklogTasks(currentPage, pageSize),
    keepPreviousData: true,
  });

  useEffect(() => {
    if (data) {
      localStorage.setItem("backlogTasks", JSON.stringify(data));
    }
  }, [data]);

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
        <p>
          {error.message ||
            "An error occurred while fetching the backlog tasks"}
        </p>
      </div>
    );
  }

  console.log("API Data:", data);

  const totalPages = Math.ceil(data.meta.pagination.total / pageSize);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Backlog Tasks</h2>
      <Backlog tasks={data.data} />
      <div className="flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}

export default PaginatedBacklog;
