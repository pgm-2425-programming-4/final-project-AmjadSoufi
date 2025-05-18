import React from "react";

const Backlog = ({ tasks }) => {
  if (!tasks || tasks.length === 0) {
    return <p className="text-gray-500 italic">No backlog tasks found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 border-b text-left">ID</th>
            <th className="py-2 px-4 border-b text-left">Title</th>
            <th className="py-2 px-4 border-b text-left">Created At</th>
            <th className="py-2 px-4 border-b text-left">Updated At</th>
            <th className="py-2 px-4 border-b text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">{task.id}</td>
              <td className="py-2 px-4 border-b">
                {task.attributes?.title || "N/A"}
              </td>
              <td className="py-2 px-4 border-b">
                {task.attributes?.createdAt
                  ? new Date(task.attributes.createdAt).toLocaleString()
                  : "N/A"}
              </td>
              <td className="py-2 px-4 border-b">
                {task.attributes?.updatedAt
                  ? new Date(task.attributes.updatedAt).toLocaleString()
                  : "N/A"}
              </td>
              <td className="py-2 px-4 border-b">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  Backlog
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Backlog;
