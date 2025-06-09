import React, { useState } from "react";

const ProjectList = ({ projects }) => {
  const [expandedProject, setExpandedProject] = useState(null);
  const [showBacklogOnly, setShowBacklogOnly] = useState({});

  if (!projects || projects.length === 0) {
    return <p className="text-muted">No projects found.</p>;
  }

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

  return (
    <div className="container">
      <div className="grid gap-4">
        {projects.map((project) => {
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

                <button
                  onClick={() => toggleProject(project.id)}
                  className={`btn ${isExpanded ? "btn-secondary" : "btn-primary"}`}
                  style={{ marginLeft: "1rem" }}
                >
                  {isExpanded ? "Hide Tasks" : "Show Tasks"}
                </button>
              </div>

              {isExpanded && (
                <div className="fade-in">
                  {allTasks.length > 0 ? (
                    <>
                      <div className="flex gap-2 mb-4">
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
                          style={{
                            fontSize: "0.875rem",
                            padding: "0.5rem 1rem",
                          }}
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
                          style={{
                            fontSize: "0.875rem",
                            padding: "0.5rem 1rem",
                          }}
                        >
                          Backlog ({backlogTasks.length})
                        </button>
                      </div>

                      {filteredTasks.length > 0 ? (
                        <div
                          className="grid gap-3"
                          style={{
                            maxHeight: "400px",
                            overflowY: "auto",
                            paddingRight: "0.5rem",
                          }}
                        >
                          {filteredTasks.map((task) => (
                            <div
                              key={task.id}
                              className="todo-item slide-in"
                              style={{
                                borderLeft: `4px solid ${
                                  task.state?.statusName?.toLowerCase() ===
                                  "backlog"
                                    ? "var(--warning)"
                                    : "var(--primary)"
                                }`,
                                background:
                                  task.state?.statusName?.toLowerCase() ===
                                  "backlog"
                                    ? "rgba(245, 158, 11, 0.1)"
                                    : "rgba(99, 102, 241, 0.1)",
                              }}
                            >
                              <div className="flex-between">
                                <div className="flex-1">
                                  <p
                                    className="text-primary"
                                    style={{
                                      fontWeight: "500",
                                      marginBottom: "0.5rem",
                                    }}
                                  >
                                    {task.title || `Task #${task.id}`}
                                  </p>
                                  {task.description &&
                                    typeof task.description === "string" && (
                                      <p
                                        className="text-secondary"
                                        style={{ fontSize: "0.875rem" }}
                                      >
                                        {task.description}
                                      </p>
                                    )}
                                </div>
                                <div style={{ marginLeft: "1rem" }}>
                                  {task.state?.statusName && (
                                    <span
                                      className={`badge ${
                                        task.state.statusName.toLowerCase() ===
                                        "backlog"
                                          ? "badge-warning"
                                          : "badge-primary"
                                      }`}
                                    >
                                      {task.state.statusName}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div
                                className="flex-between mt-3 text-muted"
                                style={{ fontSize: "0.75rem" }}
                              >
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
                        <div
                          className="text-center"
                          style={{ padding: "2rem" }}
                        >
                          <p className="text-muted">
                            No{" "}
                            {showBacklogOnly[project.id] ? "backlog" : "active"}{" "}
                            tasks found
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center" style={{ padding: "2rem" }}>
                      <p className="text-muted">
                        No tasks assigned to this project
                      </p>
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
