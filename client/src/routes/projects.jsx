import { createFileRoute, Link } from "@tanstack/react-router";
import {
  useQuery,
  useMutation,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { API_URL, API_TOKEN } from "../constants/constants";
import ProjectList from "../components/ProjectList";
import { useState } from "react";

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

const fetchStates = async () => {
  const response = await fetch(`${API_URL}/statuses`, {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch states: ${response.status}`);
  }

  const data = await response.json();
  console.log("Fetched states:", data);
  return data;
};

const createProject = async (projectData) => {
  const response = await fetch(`${API_URL}/projects`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data: projectData }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create project: ${response.status}`);
  }

  return response.json();
};

const createTask = async (taskData) => {
  try {
    console.log("Creating task with data:", taskData);
    const response = await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          title: taskData.title,
          project: taskData.project,
          state: taskData.state,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Task creation failed:", errorData);
      throw new Error(
        `Failed to create task: ${response.status} - ${JSON.stringify(errorData)}`
      );
    }

    const result = await response.json();
    console.log("Task created successfully:", result);
    return result;
  } catch (error) {
    console.error("Error in createTask:", error);
    throw error;
  }
};

const deleteTask = async (taskId) => {
  const response = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete task: ${response.status}`);
  }

  return response.json();
};

const updateTask = async (taskId, taskData) => {
  const response = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: {
        title: taskData.title,
        state: taskData.state,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to update task: ${response.status}`);
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

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

function AddProjectForm({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const createProjectMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      onSuccess();
      onClose();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createProjectMutation.mutate(formData);
  };

  return (
    <Modal isOpen={true} onClose={onClose}>
      <div className="modal-header">
        <h3 className="modal-title">Add New Project</h3>
      </div>
      <form onSubmit={handleSubmit} className="modal-form">
        <div className="form-group">
          <label className="form-label">Project Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="form-input"
            required
            placeholder="Enter project name"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="form-textarea"
            placeholder="Enter project description"
          />
        </div>
        <div className="modal-actions">
          <button
            type="button"
            onClick={onClose}
            className="modal-button secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createProjectMutation.isPending}
            className="modal-button primary"
          >
            {createProjectMutation.isPending ? "Creating..." : "Create Project"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function AddTaskForm({ projectId, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: "",
    project: projectId,
    state: 1, // Default to backlog
  });

  const { data: statesData, isLoading: statesLoading } = useQuery({
    queryKey: ["states"],
    queryFn: fetchStates,
  });

  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      onSuccess();
      onClose();
    },
    onError: (error) => {
      console.error("Failed to create task:", error);
      alert(`Failed to create task: ${error.message}`);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert("Please enter a task title");
      return;
    }
    if (!formData.project) {
      alert("Project ID is missing");
      return;
    }
    createTaskMutation.mutate({
      title: formData.title.trim(),
      project: formData.project,
      state: formData.state,
    });
  };

  return (
    <Modal isOpen={true} onClose={onClose}>
      <div className="modal-header">
        <h3 className="modal-title">Add New Task</h3>
      </div>
      <form onSubmit={handleSubmit} className="modal-form">
        <div className="form-group">
          <label className="form-label">Task Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="form-input"
            required
            placeholder="Enter task title"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Task Status</label>
          <select
            value={formData.state}
            onChange={(e) =>
              setFormData({
                ...formData,
                state: parseInt(e.target.value),
              })
            }
            className="form-select"
          >
            {statesLoading ? (
              <option>Loading states...</option>
            ) : (
              statesData?.data?.map((state) => (
                <option key={state.id} value={state.id}>
                  {state.statusName}
                </option>
              ))
            )}
          </select>
        </div>
        <div className="modal-actions">
          <button
            type="button"
            onClick={onClose}
            className="modal-button secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createTaskMutation.isPending || statesLoading}
            className="modal-button primary"
          >
            {createTaskMutation.isPending ? "Creating..." : "Create Task"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function EditTaskForm({ task, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: task.title || "",
    state: task.state?.id || 1,
  });

  const { data: statesData, isLoading: statesLoading } = useQuery({
    queryKey: ["states"],
    queryFn: fetchStates,
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, data }) => updateTask(taskId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      onSuccess();
      onClose();
    },
    onError: (error) => {
      console.error("Failed to update task:", error);
      alert(`Failed to update task: ${error.message}`);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert("Please enter a task title");
      return;
    }
    updateTaskMutation.mutate({
      taskId: task.id,
      data: {
        title: formData.title.trim(),
        state: formData.state,
      },
    });
  };

  return (
    <Modal isOpen={true} onClose={onClose}>
      <div className="modal-header">
        <h3 className="modal-title">Edit Task</h3>
      </div>
      <form onSubmit={handleSubmit} className="modal-form">
        <div className="form-group">
          <label className="form-label">Task Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="form-input"
            required
            placeholder="Enter task title"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Task Status</label>
          <select
            value={formData.state}
            onChange={(e) =>
              setFormData({
                ...formData,
                state: parseInt(e.target.value),
              })
            }
            className="form-select"
          >
            {statesLoading ? (
              <option>Loading states...</option>
            ) : (
              statesData?.data?.map((state) => (
                <option key={state.id} value={state.id}>
                  {state.statusName}
                </option>
              ))
            )}
          </select>
        </div>
        <div className="modal-actions">
          <button
            type="button"
            onClick={onClose}
            className="modal-button secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={updateTaskMutation.isPending || statesLoading}
            className="modal-button primary"
          >
            {updateTaskMutation.isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function TaskItem({ task, onEdit, onDelete }) {
  return (
    <div className="task-item">
      <div className="task-header">
        <h4 className="task-title">{task.title || `Task #${task.id}`}</h4>
        <div className="task-actions">
          <button
            onClick={() => onEdit(task)}
            className="action-button secondary"
            title="Edit task"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="action-button danger"
            title="Delete task"
          >
            Delete
          </button>
        </div>
      </div>
      {task.state?.statusName && (
        <span
          className={`task-status ${
            task.state.statusName.toLowerCase() === "backlog"
              ? "backlog"
              : "active"
          }`}
        >
          {task.state.statusName}
        </span>
      )}
      {task.description && (
        <p className="task-description">{task.description}</p>
      )}
      <div className="task-meta">
        <span>ID: {task.id}</span>
        {task.createdAt && (
          <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
        )}
      </div>
    </div>
  );
}

function ProjectsPage() {
  const [showAddProject, setShowAddProject] = useState(false);
  const [showAddTask, setShowAddTask] = useState(null);

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
      <ProjectList
        projects={projects}
        onAddProject={() => setShowAddProject(true)}
        onAddTask={(projectId) => setShowAddTask(projectId)}
      />

      {showAddProject && (
        <AddProjectForm
          onClose={() => setShowAddProject(false)}
          onSuccess={() => setShowAddProject(false)}
        />
      )}

      {showAddTask && (
        <AddTaskForm
          projectId={showAddTask}
          onClose={() => setShowAddTask(null)}
          onSuccess={() => setShowAddTask(null)}
        />
      )}
    </div>
  );
}
