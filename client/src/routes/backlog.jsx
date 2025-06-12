import { createFileRoute } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PaginatedBacklog from "../components/PaginatedBacklog";
import ErrorBoundary from "../components/ErrorBoundary";

const queryClient = new QueryClient();

export const Route = createFileRoute("/backlog")({
  component: BacklogPage,
});

function BacklogPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="container mx-auto px-4">
            <PaginatedBacklog />
          </div>
        </div>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}
