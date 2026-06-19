"use client";

import React, { useState, useEffect } from "react";
import apiClient2 from "../../../../components/shared/Axios/AxiosInstance2";

// Types from your API response
interface Employee {
  id: string;
  user_id: string;
  organization_id: string;
  first_name: string;
  last_name: string;
  email: string;
  profile_pic: string | null;
  mobile: string | null;
  timezone: string | null;
  language: string | null;
  date_of_birth: string | null;
  gender: string | null;
  street_address_1: string | null;
  street_address_2: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  work_phone: string | null;
  home_phone: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  employee_type: string | null;
  hire_date: string | null;
  employee_code: string | null;
  access_level_id: string | null;
  note: string | null;
  min_hours_per_week: number | null;
  max_days_per_week: number | null;
  max_hours_per_day: number | null;
  max_shifts_per_day: number | null;
  min_rest_hours_same_day: number | null;
  min_hours_rest_consecutive: number | null;
  created_at: string;
  updated_at: string;
}

interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: Employee[];
  meta: Meta;
}

type SortField = "first_name" | "email" | "employee_type" | "hire_date" | "created_at";
type SortOrder = "asc" | "desc";

const Employees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("first_name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const fetchEmployees = async (page = 1) => {
    try {
      setLoading(true);
      const res = await apiClient2.get<ApiResponse>("/employees", {
        params: { page, limit: 10 },
      });
      if (res.data?.success) {
        setEmployees(res.data.data);
        setMeta(res.data.meta);
      } else {
        setError(res.data?.message || "Failed to fetch employees");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees(currentPage);
  }, [currentPage]);

  const filteredEmployees = employees.filter((emp) => {
    const query = searchQuery.toLowerCase();
    return (
      emp.first_name?.toLowerCase().includes(query) ||
      emp.last_name?.toLowerCase().includes(query) ||
      emp.email?.toLowerCase().includes(query) ||
      emp.employee_code?.toLowerCase().includes(query) ||
      emp.employee_type?.toLowerCase().includes(query) ||
      emp.mobile?.toLowerCase().includes(query)
    );
  });

  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    const aVal = a[sortField] ?? "";
    const bVal = b[sortField] ?? "";
    if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const getInitials = (first: string, last: string) => {
    return `${first?.[0] || ""}${last?.[0] || ""}`.toUpperCase();
  };

  const getStatusColor = (employee: Employee) => {
    if (employee.employee_type) {
      const type = employee.employee_type.toLowerCase();
      if (type.includes("full")) return "bg-green-500/20 text-green-400";
      if (type.includes("part")) return "bg-amber-500/20 text-amber-400";
      if (type.includes("contract")) return "bg-blue-500/20 text-blue-400";
      if (type.includes("temp")) return "bg-purple-500/20 text-purple-400";
    }
    return "bg-neutral-700 text-neutral-300";
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return (
        <svg className="w-3.5 h-3.5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    return sortOrder === "asc" ? (
      <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
          <p className="text-red-400">{error}</p>
          <button
            onClick={() => fetchEmployees(currentPage)}
            className="mt-3 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">Employees</h1>
          <p className="text-neutral-400 mt-1">
            {meta?.total ?? 0} total employees
          </p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Employee
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by name, email, code, type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
          <div className="flex gap-2">
            <button className="bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-300 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filter
            </button>
            <button className="bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-300 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-800">
                <th className="text-left px-6 py-4">
                  <button
                    onClick={() => handleSort("first_name")}
                    className="flex items-center gap-1.5 text-xs font-medium text-neutral-400 uppercase tracking-wider hover:text-white transition-colors"
                  >
                    Employee <SortIcon field="first_name" />
                  </button>
                </th>
                <th className="text-left px-6 py-4">
                  <button
                    onClick={() => handleSort("email")}
                    className="flex items-center gap-1.5 text-xs font-medium text-neutral-400 uppercase tracking-wider hover:text-white transition-colors"
                  >
                    Contact <SortIcon field="email" />
                  </button>
                </th>
                <th className="text-left px-6 py-4">
                  <button
                    onClick={() => handleSort("employee_type")}
                    className="flex items-center gap-1.5 text-xs font-medium text-neutral-400 uppercase tracking-wider hover:text-white transition-colors"
                  >
                    Type <SortIcon field="employee_type" />
                  </button>
                </th>
                <th className="text-left px-6 py-4">
                  <button
                    onClick={() => handleSort("hire_date")}
                    className="flex items-center gap-1.5 text-xs font-medium text-neutral-400 uppercase tracking-wider hover:text-white transition-colors"
                  >
                    Hire Date <SortIcon field="hire_date" />
                  </button>
                </th>
                <th className="text-left px-6 py-4">
                  <button
                    onClick={() => handleSort("created_at")}
                    className="flex items-center gap-1.5 text-xs font-medium text-neutral-400 uppercase tracking-wider hover:text-white transition-colors"
                  >
                    Joined <SortIcon field="created_at" />
                  </button>
                </th>
                <th className="text-right px-6 py-4 text-xs font-medium text-neutral-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedEmployees.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <p className="text-neutral-400 font-medium">No employees found</p>
                      <p className="text-neutral-500 text-sm mt-1">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                sortedEmployees.map((employee) => (
                  <tr
                    key={employee.id}
                    className="border-b border-neutral-800/50 hover:bg-neutral-800/30 transition-colors cursor-pointer"
                    onClick={() => setSelectedEmployee(employee)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {employee.profile_pic ? (
                          <img
                            src={employee.profile_pic}
                            alt={`${employee.first_name} ${employee.last_name}`}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-bold">
                            {getInitials(employee.first_name, employee.last_name)}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-white">
                            {employee.first_name} {employee.last_name}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {employee.employee_code || "No code"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-white">{employee.email}</p>
                      <p className="text-xs text-neutral-500">{employee.mobile || "No phone"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(employee)}`}>
                        {employee.employee_type || "Not set"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-white">{formatDate(employee.hire_date)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-white">{formatDate(employee.created_at)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEmployee(employee);
                          }}
                          className="p-2 hover:bg-neutral-700 rounded-lg transition-colors text-neutral-400 hover:text-white"
                          title="View"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 hover:bg-neutral-700 rounded-lg transition-colors text-neutral-400 hover:text-white"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 hover:bg-neutral-700 rounded-lg transition-colors text-neutral-400 hover:text-red-400"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <div className="border-t border-neutral-800 px-6 py-4 flex items-center justify-between">
            <p className="text-sm text-neutral-400">
              Showing {((meta.page - 1) * meta.limit) + 1} - {Math.min(meta.page * meta.limit, meta.total)} of {meta.total}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={meta.page === 1}
                className="p-2 hover:bg-neutral-800 rounded-lg transition-colors text-neutral-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                    page === meta.page
                      ? "bg-indigo-600 text-white"
                      : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(meta.totalPages, p + 1))}
                disabled={meta.page === meta.totalPages}
                className="p-2 hover:bg-neutral-800 rounded-lg transition-colors text-neutral-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Employee Detail Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedEmployee(null)}
          />
          <div className="relative bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  {selectedEmployee.profile_pic ? (
                    <img
                      src={selectedEmployee.profile_pic}
                      alt={`${selectedEmployee.first_name} ${selectedEmployee.last_name}`}
                      className="w-16 h-16 rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-indigo-500 flex items-center justify-center text-white text-xl font-bold">
                      {getInitials(selectedEmployee.first_name, selectedEmployee.last_name)}
                    </div>
                  )}
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      {selectedEmployee.first_name} {selectedEmployee.last_name}
                    </h2>
                    <p className="text-sm text-neutral-400">{selectedEmployee.email}</p>
                    <span className={`inline-flex mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedEmployee)}`}>
                      {selectedEmployee.employee_type || "Not set"}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEmployee(null)}
                  className="p-2 hover:bg-neutral-800 rounded-lg transition-colors text-neutral-400 hover:text-white"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-neutral-800/50 rounded-xl p-4 space-y-3">
                  <h3 className="text-sm font-medium text-white">Contact Information</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-neutral-500 text-xs">Email</p>
                      <p className="text-white">{selectedEmployee.email}</p>
                    </div>
                    <div>
                      <p className="text-neutral-500 text-xs">Mobile</p>
                      <p className="text-white">{selectedEmployee.mobile || "—"}</p>
                    </div>
                    <div>
                      <p className="text-neutral-500 text-xs">Work Phone</p>
                      <p className="text-white">{selectedEmployee.work_phone || "—"}</p>
                    </div>
                    <div>
                      <p className="text-neutral-500 text-xs">Home Phone</p>
                      <p className="text-white">{selectedEmployee.home_phone || "—"}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-neutral-800/50 rounded-xl p-4 space-y-3">
                  <h3 className="text-sm font-medium text-white">Work Details</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-neutral-500 text-xs">Employee Code</p>
                      <p className="text-white">{selectedEmployee.employee_code || "—"}</p>
                    </div>
                    <div>
                      <p className="text-neutral-500 text-xs">Employee Type</p>
                      <p className="text-white">{selectedEmployee.employee_type || "—"}</p>
                    </div>
                    <div>
                      <p className="text-neutral-500 text-xs">Hire Date</p>
                      <p className="text-white">{formatDate(selectedEmployee.hire_date)}</p>
                    </div>
                    <div>
                      <p className="text-neutral-500 text-xs">Joined</p>
                      <p className="text-white">{formatDate(selectedEmployee.created_at)}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-neutral-800/50 rounded-xl p-4 space-y-3">
                  <h3 className="text-sm font-medium text-white">Personal Information</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-neutral-500 text-xs">Gender</p>
                      <p className="text-white capitalize">{selectedEmployee.gender || "—"}</p>
                    </div>
                    <div>
                      <p className="text-neutral-500 text-xs">Date of Birth</p>
                      <p className="text-white">{formatDate(selectedEmployee.date_of_birth)}</p>
                    </div>
                    <div>
                      <p className="text-neutral-500 text-xs">Language</p>
                      <p className="text-white">{selectedEmployee.language || "—"}</p>
                    </div>
                    <div>
                      <p className="text-neutral-500 text-xs">Timezone</p>
                      <p className="text-white">{selectedEmployee.timezone || "—"}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-neutral-800/50 rounded-xl p-4 space-y-3">
                  <h3 className="text-sm font-medium text-white">Address</h3>
                  <div className="text-sm space-y-1">
                    <p className="text-white">{selectedEmployee.street_address_1 || "—"}</p>
                    {selectedEmployee.street_address_2 && (
                      <p className="text-white">{selectedEmployee.street_address_2}</p>
                    )}
                    <p className="text-white">
                      {selectedEmployee.city && `${selectedEmployee.city}, `}
                      {selectedEmployee.state && `${selectedEmployee.state} `}
                      {selectedEmployee.postal_code}
                    </p>
                    <p className="text-white">{selectedEmployee.country || "—"}</p>
                  </div>
                </div>

                <div className="bg-neutral-800/50 rounded-xl p-4 space-y-3">
                  <h3 className="text-sm font-medium text-white">Emergency Contact</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-neutral-500 text-xs">Name</p>
                      <p className="text-white">{selectedEmployee.emergency_contact_name || "—"}</p>
                    </div>
                    <div>
                      <p className="text-neutral-500 text-xs">Phone</p>
                      <p className="text-white">{selectedEmployee.emergency_contact_phone || "—"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-xl text-sm font-medium transition-colors">
                  Edit Employee
                </button>
                <button
                  onClick={() => setSelectedEmployee(null)}
                  className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white py-2.5 rounded-xl text-sm font-medium transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;
