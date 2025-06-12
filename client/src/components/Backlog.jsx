import React from "react";

const Backlog = ({ tasks }) => {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="backlog-container">
        <div className="backlog-header">
          <h2 className="backlog-title">Backlog Tasks</h2>
        </div>
        <p className="text-gray-500 italic">No backlog tasks found.</p>
      </div>
    );
  }

  return (
    <div className="backlog-container">
      <div className="backlog-header">
        <h2 className="backlog-title">Backlog Tasks</h2>
      </div>
      <div className="backlog-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>Status</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td>{task.id}</td>
                <td>{task.attributes?.title || "N/A"}</td>
                <td>{task.attributes?.description || "No description"}</td>
                <td>
                  <span className="backlog-status">Backlog</span>
                </td>
                <td>
                  {task.attributes?.createdAt
                    ? new Date(task.attributes.createdAt).toLocaleDateString()
                    : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Backlog;
