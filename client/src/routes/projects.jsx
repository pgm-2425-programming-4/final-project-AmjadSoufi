import { createFileRoute, Link } from "@tanstack/react-router";
import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { API_URL, API_TOKEN } from "../constants/constants";
import ProjectList from "../components/ProjectList"; 

const queryClient = new QueryClient();

const fetchProjects = async () => {
  const response = await fetch(
    `${API_URL}/projects?populate[tasks][populate]=state`,
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

export const Route = createFileRoute("/projects")({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <ProjectsPage />
    </QueryClientProvider>
  ),
});

function ProjectsPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center my-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p className="font-bold">Error</p>
        <p>{error.message}</p>
      </div>
    );
  }

  const projects = data?.data || [];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Projects</h1>
      <ProjectList projects={projects} />
    </div>
  );
}
