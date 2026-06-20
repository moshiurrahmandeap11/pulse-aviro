import React from "react";

const tasks = [
  {
    id: 1,
    title: "Design Homepage",
    status: "todo",
  },
  {
    id: 2,
    title: "Fix Login Bug",
    status: "todo",
  },
  {
    id: 3,
    title: "Build Navbar",
    status: "in-progress",
  },
  {
    id: 4,
    title: "Connect API",
    status: "in-progress",
  },
  {
    id: 5,
    title: "Write Docs",
    status: "done",
  },
  {
    id: 6,
    title: "Deploy Project",
    status: "done",
  },
];

const columns = [
  { id: "todo", title: "To Do" },
  { id: "in-progress", title: "In Progress" },
  { id: "done", title: "Done" },
];

const Reports = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {columns.map((column) => (
          <div
            key={column.id}
            className="rounded-lg bg-white p-5 shadow-md"
          >
            <h2 className="mb-4 text-lg font-semibold">
              {column.title}
            </h2>

            <div className="space-y-3">
              {tasks
                .filter((task) => task.status === column.id)
                .map((task) => (
                  <div
                    key={task.id}
                    className="rounded-md border bg-gray-50 p-4 transition hover:bg-gray-100"
                  >
                    <h3 className="font-medium">{task.title}</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Task #{task.id}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;