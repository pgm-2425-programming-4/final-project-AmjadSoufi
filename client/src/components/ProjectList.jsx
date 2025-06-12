import React, { useState } from "react";

const ProjectList = ({ projects, onAddProject, onAddTask }) => {
  const [expandedProject, setExpandedProject] = useState(null);
  const [showBacklogOnly, setShowBacklogOnly] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const toggleProject = (projectId) => {
    setExpandedProject(expandedProject === projectId ? null : projectId);
  };

  const getFilteredTasks = (tasks, projectId) => {
    if (!tasks) return [];

    if (showBacklogOnly[projectId]) {
      return tasks.filter(
        (task) => task.state?.statusName?.toLowerCase() === "backlog"
      );
    }

    return tasks.filter(
      (task) => task.state?.statusName?.toLowerCase() !== "backlog"
    );
  };

  const renderDescription = (description) => {
    if (!description) return null;

    if (typeof description === "string") {
      return <p className="text-secondary mb-3">{description}</p>;
    }

    if (typeof description === "object") {
      return null;
    }

    return null;
  };

  const filteredProjects = projects.filter((project) =>
    project.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="projects-container">
      <div className="projects-header">
        <h2 className="projects-title">Projects</h2>
        <div className="projects-actions">
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button onClick={onAddProject} className="action-button primary">
            <span>+</span> New Project
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredProjects.map((project) => {
          const allTasks = project.tasks || [];
          const backlogTasks = allTasks.filter(
            (task) => task.state?.statusName?.toLowerCase() === "backlog"
          );
          const nonBacklogTasks = allTasks.filter(
            (task) => task.state?.statusName?.toLowerCase() !== "backlog"
          );
          const filteredTasks = getFilteredTasks(allTasks, project.id);
          const isExpanded = expandedProject === project.id;

          return (
            <div key={project.id} className="card fade-in">
              <div className="flex-between mb-4">
                <div className="flex-1">
                  <h3
                    className="text-primary mb-3"
                    style={{ fontSize: "1.5rem", fontWeight: "600" }}
                  >
                    {project.name || "Untitled Project"}
                  </h3>
                  {renderDescription(project.description)}

                  <div
                    className="flex gap-4 text-muted"
                    style={{ fontSize: "0.875rem" }}
                  >
                    <div className="badge badge-primary">
                      Total: {allTasks.length}
                    </div>
                    <div className="badge badge-warning">
                      Backlog: {backlogTasks.length}
                    </div>
                    <div className="badge badge-success">
                      Active: {nonBacklogTasks.length}
                    </div>
                    <span className="text-muted">ID: {project.id}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => toggleProject(project.id)}
                    className={`btn ${isExpanded ? "btn-secondary" : "btn-primary"}`}
                  >
                    {isExpanded ? "Hide Tasks" : "Show Tasks"}
                  </button>
                  <button
                    onClick={() => onAddTask(project.id)}
                    className="btn btn-success"
                  >
                    <span className="mr-1">+</span> Add Task
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="fade-in">
                  {allTasks.length > 0 ? (
                    <>
                      <div className="tasks-header">
                        <button
                          onClick={() =>
                            setShowBacklogOnly((prev) => ({
                              ...prev,
                              [project.id]: false,
                            }))
                          }
                          className={`btn ${
                            !showBacklogOnly[project.id]
                              ? "btn-success"
                              : "btn-secondary"
                          }`}
                        >
                          Active Tasks ({nonBacklogTasks.length})
                        </button>
                        <button
                          onClick={() =>
                            setShowBacklogOnly((prev) => ({
                              ...prev,
                              [project.id]: true,
                            }))
                          }
                          className={`btn ${
                            showBacklogOnly[project.id]
                              ? "btn-warning"
                              : "btn-secondary"
                          }`}
                        >
                          Backlog ({backlogTasks.length})
                        </button>
                      </div>

                      {filteredTasks.length > 0 ? (
                        <div className="tasks-list">
                          {filteredTasks.map((task) => (
                            <div key={task.id} className="task-item">
                              <div className="task-header">
                                <h4 className="task-title">
                                  {task.title || `Task #${task.id}`}
                                </h4>
                              </div>
                              {task.state?.statusName && (
                                <span
                                  className={`task-status ${
                                    task.state.statusName.toLowerCase() ===
                                    "backlog"
                                      ? "backlog"
                                      : "active"
                                  }`}
                                >
                                  {task.state.statusName}
                                </span>
                              )}
                              {task.description && (
                                <p className="task-description">
                                  {task.description}
                                </p>
                              )}
                              <div className="task-meta">
                                <span>ID: {task.id}</span>
                                {task.createdAt && (
                                  <span>
                                    Created:{" "}
                                    {new Date(
                                      task.createdAt
                                    ).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="no-tasks">
                          <p>
                            No{" "}
                            {showBacklogOnly[project.id] ? "backlog" : "active"}{" "}
                            tasks found
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="no-tasks">
                      <p>No tasks assigned to this project</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectList;
