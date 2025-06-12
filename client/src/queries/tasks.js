export async function fetchTasks(page = 1, pageSize = 5) {
  const url = `http://localhost:1337/api/tasks?filters[status][name][$eq]=Backlog&populate=status&pagination[page]=${page}&pagination[pageSize]=${pageSize}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch tasks: ${response.statusText}`);
  }
  return response.json();
}
