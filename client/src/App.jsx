import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PaginatedBacklog from "./components/PaginatedBacklog";
import ErrorBoundary from "./components/ErrorBoundary";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Task Management System</h1>
        <ErrorBoundary>
          <PaginatedBacklog />
        </ErrorBoundary>
      </div>
    </QueryClientProvider>
  );
}

export default App;
