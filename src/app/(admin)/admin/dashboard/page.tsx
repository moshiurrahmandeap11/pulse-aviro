"use client";

import React from "react";

const stats = [
  { label: "Total Employees", value: 24, change: "+2 this month" },
  { label: "On Duty Today", value: 18, change: "75% attendance" },
  { label: "Pending Requests", value: 5, change: "3 leave, 2 schedule" },
  { label: "Upcoming Shifts", value: 12, change: "Next 7 days" },
];

const recentActivity = [
  { user: "Aman Hasan", action: "approved leave request", time: "2 min ago" },
  { user: "Sarah Chen", action: "submitted timesheet", time: "15 min ago" },
  { user: "Mike Johnson", action: "updated availability", time: "1 hour ago" },
  { user: "Emily Davis", action: "requested schedule swap", time: "2 hours ago" },
  { user: "James Wilson", action: "clocked in", time: "3 hours ago" },
];

const upcomingShifts = [
  { employee: "Aman Hasan", role: "Manager", time: "09:00 AM - 05:00 PM", date: "Today" },
  { employee: "Sarah Chen", role: "Barista", time: "10:00 AM - 06:00 PM", date: "Today" },
  { employee: "Mike Johnson", role: "Chef", time: "11:00 AM - 07:00 PM", date: "Tomorrow" },
  { employee: "Emily Davis", role: "Server", time: "08:00 AM - 04:00 PM", date: "Tomorrow" },
];

const AdminPage = () => {
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
        <p className="text-neutral-400 mt-1">Welcome back! Here&apos;s what&apos;s happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-neutral-900 border border-neutral-800 rounded-xl p-5"
          >
            <p className="text-sm text-neutral-400">{stat.label}</p>
            <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
            <p className="text-xs text-neutral-500 mt-1">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
          <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                  <span className="text-indigo-400 text-sm font-medium">
                    {activity.user.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white">
                    <span className="font-medium">{activity.user}</span>{" "}
                    <span className="text-neutral-400">{activity.action}</span>
                  </p>
                  <p className="text-xs text-neutral-500 mt-0.5">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Shifts */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
          <h2 className="text-lg font-semibold text-white mb-4">Upcoming Shifts</h2>
          <div className="space-y-3">
            {upcomingShifts.map((shift, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-b border-neutral-800 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center">
                    <span className="text-neutral-300 text-sm font-medium">
                      {shift.employee.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{shift.employee}</p>
                    <p className="text-xs text-neutral-400">{shift.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white">{shift.time}</p>
                  <p className="text-xs text-neutral-500">{shift.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Add Employee
          </button>
          <button className="bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Create Schedule
          </button>
          <button className="bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Approve Requests
          </button>
          <button className="bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            View Reports
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
