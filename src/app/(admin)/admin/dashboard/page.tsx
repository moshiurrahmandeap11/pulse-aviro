"use client";

import React, { useState } from "react";
import Image from "next/image";

const shiftData = [
  { date: "Jun 19", day: "Thu", start: "09:00 AM", end: "05:00 PM", status: "confirmed" },
  { date: "Jun 20", day: "Fri", start: "10:00 AM", end: "06:00 PM", status: "confirmed" },
  { date: "Jun 21", day: "Sat", start: "OFF", end: "", status: "off" },
  { date: "Jun 22", day: "Sun", start: "OFF", end: "", status: "off" },
  { date: "Jun 23", day: "Mon", start: "09:00 AM", end: "05:00 PM", status: "confirmed" },
];

const workNowData = [
  { name: "Aman Hasan", role: "Manager", status: "working", time: "09:00 AM - 05:00 PM", avatar: "A" },
  { name: "Sarah Chen", role: "Barista", status: "on-break", time: "10:00 AM - 06:00 PM", avatar: "S" },
  { name: "Mike Johnson", role: "Chef", status: "working", time: "11:00 AM - 07:00 PM", avatar: "M" },
  { name: "Emily Davis", role: "Server", status: "clocked-out", time: "08:00 AM - 04:00 PM", avatar: "E" },
  { name: "James Wilson", role: "Cashier", status: "working", time: "09:00 AM - 05:00 PM", avatar: "J" },
];

const recentActivity = [
  { action: "Clocked in", time: "09:00 AM", type: "clock-in" },
  { action: "Started break", time: "12:30 PM", type: "break" },
  { action: "Ended break", time: "01:00 PM", type: "break-end" },
  { action: "Clocked out", time: "05:00 PM", type: "clock-out" },
];

export default function DashboardPage() {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [elapsedTime, setElapsedTime] = useState("00:00:00");
  const [currentTime, setCurrentTime] = useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleClockIn = () => {
    setIsClockedIn(true);
    setIsOnBreak(false);
  };

  const handleClockOut = () => {
    setIsClockedIn(false);
    setIsOnBreak(false);
  };

  const handleBreak = () => {
    setIsOnBreak(!isOnBreak);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "working": return "bg-green-500";
      case "on-break": return "bg-amber-500";
      case "clocked-out": return "bg-neutral-500";
      default: return "bg-neutral-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "working": return "Working";
      case "on-break": return "On Break";
      case "clocked-out": return "Clocked Out";
      default: return status;
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
        <p className="text-neutral-400 mt-1">
          {currentTime.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Clock & Shifts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Clock In/Out Card */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-white">Time Tracker</h2>
                <p className="text-sm text-neutral-400">Track your work hours</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-mono font-bold text-white">{currentTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</p>
                <p className="text-sm text-neutral-400">{elapsedTime}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {!isClockedIn ? (
                <button
                  onClick={handleClockIn}
                  className="flex-1 bg-green-600 hover:bg-green-500 text-white py-3 px-6 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Clock In
                </button>
              ) : (
                <>
                  <button
                    onClick={handleBreak}
                    className={`flex-1 py-3 px-6 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${
                      isOnBreak
                        ? "bg-amber-600 hover:bg-amber-500 text-white"
                        : "bg-neutral-800 hover:bg-neutral-700 text-white"
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {isOnBreak ? "End Break" : "Take Break"}
                  </button>
                  <button
                    onClick={handleClockOut}
                    className="flex-1 bg-red-600 hover:bg-red-500 text-white py-3 px-6 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Clock Out
                  </button>
                </>
              )}
            </div>

            {/* Today's Status */}
            {isClockedIn && (
              <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <p className="text-green-400 text-sm font-medium">
                    {isOnBreak ? "On Break" : "Currently Working"}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* My Upcoming Shifts */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">My Upcoming Shifts</h2>
              <button className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">View All</button>
            </div>
            <div className="space-y-3">
              {shiftData.map((shift, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-4 rounded-xl border ${
                    shift.status === "off"
                      ? "bg-neutral-800/50 border-neutral-800"
                      : "bg-neutral-800 border-neutral-700"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      shift.status === "off" ? "bg-neutral-700" : "bg-indigo-500/20"
                    }`}>
                      <span className={`text-sm font-bold ${shift.status === "off" ? "text-neutral-400" : "text-indigo-400"}`}>
                        {shift.date.split(" ")[1]}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{shift.day}</p>
                      <p className="text-sm text-neutral-400">{shift.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {shift.status === "off" ? (
                      <span className="text-neutral-500 text-sm font-medium">Day Off</span>
                    ) : (
                      <>
                        <p className="text-white font-medium">{shift.start} - {shift.end}</p>
                        <span className="text-xs text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">Confirmed</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.type === "clock-in" ? "bg-green-500/20" :
                    activity.type === "clock-out" ? "bg-red-500/20" :
                    "bg-amber-500/20"
                  }`}>
                    <svg className={`w-4 h-4 ${
                      activity.type === "clock-in" ? "text-green-400" :
                      activity.type === "clock-out" ? "text-red-400" :
                      "text-amber-400"
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-white">{activity.action}</p>
                    <p className="text-xs text-neutral-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Works Now */}
        <div className="space-y-6">
          {/* Who's Working Now */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Works Now</h2>
              <span className="text-xs text-neutral-400">{workNowData.filter(w => w.status === "working").length} online</span>
            </div>
            <div className="space-y-3">
              {workNowData.map((person, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-800 transition-colors">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center">
                      <span className="text-white font-medium text-sm">{person.avatar}</span>
                    </div>
                    <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-neutral-900 ${getStatusColor(person.status)}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{person.name}</p>
                    <p className="text-xs text-neutral-400">{person.role}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-neutral-400">{person.time}</p>
                    <p className={`text-xs font-medium ${
                      person.status === "working" ? "text-green-400" :
                      person.status === "on-break" ? "text-amber-400" :
                      "text-neutral-500"
                    }`}>{getStatusText(person.status)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Today&apos;s Overview</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-400">Total Staff</span>
                <span className="text-white font-medium">24</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-400">On Duty</span>
                <span className="text-green-400 font-medium">18</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-400">On Break</span>
                <span className="text-amber-400 font-medium">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-400">Absent</span>
                <span className="text-red-400 font-medium">3</span>
              </div>
              <div className="w-full h-px bg-neutral-800" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-400">Shift Coverage</span>
                <span className="text-white font-medium">92%</span>
              </div>
            </div>
            {/* Progress Bar */}
            <div className="mt-3 w-full bg-neutral-800 rounded-full h-2">
              <div className="bg-indigo-500 h-2 rounded-full" style={{ width: "92%" }} />
            </div>
          </div>

          {/* Announcements */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Announcements</h2>
            <div className="space-y-3">
              <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl">
                <p className="text-sm text-indigo-300 font-medium">New Schedule Posted</p>
                <p className="text-xs text-neutral-400 mt-1">Week of June 23-29 is now available</p>
              </div>
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                <p className="text-sm text-amber-300 font-medium">Holiday Notice</p>
                <p className="text-xs text-neutral-400 mt-1">July 4th - Modified hours</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
