"use client";

import React, { useState, useEffect, useCallback } from "react";
import apiClient2 from "@/components/shared/Axios/AxiosInstance2";

// Types
interface AccessLevel {
  id: string;
  name: string;
}

interface Schedule {
  id: string;
  name: string;
}

interface Position {
  id: string;
  name: string;
}

interface AddEmployeeFormData {
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  access_level_id: string;
  timezone: string;
  schedule_ids: string[];
  position_ids: string[];
  hire_date: string;
}

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  organizationId?: string;
}

// Common timezones list
const COMMON_TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Toronto",
  "America/Vancouver",
  "America/Mexico_City",
  "America/Sao_Paulo",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Europe/Madrid",
  "Europe/Rome",
  "Europe/Amsterdam",
  "Europe/Dublin",
  "Europe/Lisbon",
  "Europe/Zurich",
  "Europe/Stockholm",
  "Europe/Oslo",
  "Europe/Copenhagen",
  "Europe/Helsinki",
  "Europe/Vienna",
  "Europe/Brussels",
  "Europe/Warsaw",
  "Europe/Prague",
  "Europe/Budapest",
  "Europe/Athens",
  "Europe/Istanbul",
  "Europe/Moscow",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Mumbai",
  "Asia/Delhi",
  "Asia/Karachi",
  "Asia/Dhaka",
  "Asia/Colombo",
  "Asia/Kathmandu",
  "Asia/Thimphu",
  "Asia/Male",
  "Asia/Islamabad",
  "Asia/Kabul",
  "Asia/Tehran",
  "Asia/Baghdad",
  "Asia/Riyadh",
  "Asia/Kuwait",
  "Asia/Qatar",
  "Asia/Bahrain",
  "Asia/Muscat",
  "Asia/Singapore",
  "Asia/Kuala_Lumpur",
  "Asia/Bangkok",
  "Asia/Jakarta",
  "Asia/Manila",
  "Asia/Hong_Kong",
  "Asia/Shanghai",
  "Asia/Beijing",
  "Asia/Taipei",
  "Asia/Seoul",
  "Asia/Tokyo",
  "Asia/Osaka",
  "Asia/Sapporo",
  "Asia/Fukuoka",
  "Asia/Nagoya",
  "Asia/Kyoto",
  "Asia/Yokohama",
  "Asia/Kobe",
  "Asia/Hiroshima",
  "Asia/Sendai",
  "Asia/Kawasaki",
  "Asia/Saitama",
  "Asia/Chiba",
  "Asia/Kitakyushu",
  "Asia/Sakai",
  "Asia/Niigata",
  "Asia/Hamamatsu",
  "Asia/Okayama",
  "Asia/Sagamihara",
  "Asia/Shizuoka",
  "Asia/Utsunomiya",
  "Asia/Matsuyama",
  "Asia/Matsudo",
  "Asia/Kanazawa",
  "Asia/Kawaguchi",
  "Asia/Ichikawa",
  "Asia/Amagasaki",
  "Asia/Tokorozawa",
  "Asia/Kashiwa",
  "Asia/Yokosuka",
  "Asia/Hachioji",
  "Asia/Fujisawa",
  "Asia/Funabashi",
  "Asia/Nagasaki",
  "Asia/Himeji",
  "Asia/Kagoshima",
  "Asia/Kumamoto",
  "Asia/Oita",
  "Asia/Miyazaki",
  "Asia/Naha",
  "Asia/Kochi",
  "Asia/Aomori",
  "Asia/Akita",
  "Asia/Morioka",
  "Asia/Fukushima",
  "Asia/Yamagata",
  "Asia/Sapporo",
  "Asia/Hakodate",
  "Asia/Asahikawa",
  "Asia/Kushiro",
  "Asia/Tomakomai",
  "Asia/Obihiro",
  "Asia/Otaru",
  "Asia/Kitami",
  "Asia/Ebetsu",
  "Asia/Chitose",
  "Asia/Muroran",
  "Asia/Iwamizawa",
  "Asia/Bibai",
  "Asia/Ishikari",
  "Asia/Eniwa",
  "Asia/Sapporo",
  "Australia/Sydney",
  "Australia/Melbourne",
  "Australia/Brisbane",
  "Australia/Perth",
  "Australia/Adelaide",
  "Australia/Darwin",
  "Australia/Hobart",
  "Australia/Canberra",
  "Pacific/Auckland",
  "Pacific/Fiji",
  "Pacific/Guam",
  "Pacific/Honolulu",
  "Pacific/Samoa",
  "Pacific/Tongatapu",
  "Pacific/Noumea",
  "Pacific/Port_Moresby",
  "Africa/Lagos",
  "Africa/Cairo",
  "Africa/Johannesburg",
  "Africa/Nairobi",
  "Africa/Casablanca",
  "Africa/Accra",
  "Africa/Addis_Ababa",
  "Africa/Algiers",
  "Africa/Dakar",
  "Africa/Dar_es_Salaam",
  "Africa/Harare",
  "Africa/Kampala",
  "Africa/Khartoum",
  "Africa/Kigali",
  "Africa/Kinshasa",
  "Africa/Libreville",
  "Africa/Luanda",
  "Africa/Lusaka",
  "Africa/Maputo",
  "Africa/Mogadishu",
  "Africa/Monrovia",
  "Africa/Nairobi",
  "Africa/Ndjamena",
  "Africa/Niamey",
  "Africa/Ouagadougou",
  "Africa/Porto-Novo",
  "Africa/Sao_Tome",
  "Africa/Tripoli",
  "Africa/Tunis",
  "Africa/Windhoek",
  "Africa/Yaounde",
  "America/Anchorage",
  "America/Argentina/Buenos_Aires",
  "America/Bogota",
  "America/Caracas",
  "America/Havana",
  "America/Jamaica",
  "America/Lima",
  "America/Montevideo",
  "America/Phoenix",
  "America/Puerto_Rico",
  "America/Santiago",
  "America/St_Johns",
  "America/Tijuana",
  "Atlantic/Reykjavik",
  "Atlantic/Azores",
];

// Dummy data for access levels (until API is ready)
const DUMMY_ACCESS_LEVELS: AccessLevel[] = [
  { id: "d8cb920d-d846-4cc3-a1bb-731b2ce38ea2", name: "Admin" },
  { id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890", name: "Manager" },
  { id: "b2c3d4e5-f6a7-8901-bcde-f12345678901", name: "Supervisor" },
  { id: "c3d4e5f6-a7b8-9012-cdef-123456789012", name: "Employee" },
  { id: "d4e5f6a7-b8c9-0123-defa-234567890123", name: "Read Only" },
];

// Dummy data for schedules (until API is ready)
const DUMMY_SCHEDULES: Schedule[] = [
  { id: "sched-1", name: "Morning Shift (6AM-2PM)" },
  { id: "sched-2", name: "Evening Shift (2PM-10PM)" },
  { id: "sched-3", name: "Night Shift (10PM-6AM)" },
  { id: "sched-4", name: "Weekend Shift" },
  { id: "sched-5", name: "Holiday Shift" },
  { id: "sched-6", name: "Flexible Hours" },
];

// Dummy data for positions (until API is ready)
const DUMMY_POSITIONS: Position[] = [
  { id: "pos-1", name: "Manager" },
  { id: "pos-2", name: "Supervisor" },
  { id: "pos-3", name: "Barista" },
  { id: "pos-4", name: "Chef" },
  { id: "pos-5", name: "Server" },
  { id: "pos-6", name: "Cashier" },
  { id: "pos-7", name: "Host" },
  { id: "pos-8", name: "Dishwasher" },
  { id: "pos-9", name: "Prep Cook" },
  { id: "pos-10", name: "Line Cook" },
];

const getAutoDetectedTimezone = (): string => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "UTC";
  }
};

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  organizationId,
}) => {
  const [formData, setFormData] = useState<AddEmployeeFormData>({
    first_name: "",
    last_name: "",
    email: "",
    mobile: "",
    access_level_id: "",
    timezone: getAutoDetectedTimezone(),
    schedule_ids: [],
    position_ids: [],
    hire_date: new Date().toISOString().split("T")[0],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Fetch real data from APIs (with fallback to dummy)
  const [accessLevels, setAccessLevels] = useState<AccessLevel[]>(DUMMY_ACCESS_LEVELS);
  const [schedules, setSchedules] = useState<Schedule[]>(DUMMY_SCHEDULES);
  const [positions, setPositions] = useState<Position[]>(DUMMY_POSITIONS);

  useEffect(() => {
    if (!isOpen) return;

    // Fetch access levels
    const fetchAccessLevels = async () => {
      try {
        const res = await apiClient2.get("/access-levels");
        if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          setAccessLevels(res.data.data);
        }
      } catch {
        // Keep dummy data on error
      }
    };

    // Fetch schedules
    const fetchSchedules = async () => {
      try {
        const res = await apiClient2.get("/schedules");
        if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          setSchedules(res.data.data);
        }
      } catch {
        // Keep dummy data on error
      }
    };

    // Fetch positions
    const fetchPositions = async () => {
      try {
        const res = await apiClient2.get("/positions");
        if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          setPositions(res.data.data);
        }
      } catch {
        // Keep dummy data on error
      }
    };

    fetchAccessLevels();
    fetchSchedules();
    fetchPositions();
  }, [isOpen]);

  // Show toast
  const showToast = useCallback((message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const handleChange = (field: keyof AddEmployeeFormData, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const toggleSelection = (field: "schedule_ids" | "position_ids", id: string) => {
    setFormData((prev) => {
      const current = prev[field];
      const updated = current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id];
      return { ...prev, [field]: updated };
    });
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = "First name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (action: "save" | "save-and-invite") => {
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // 1. Create employee
      const payload: any = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim() || undefined,
        email: formData.email.trim(),
        access_level_id: formData.access_level_id || undefined,
        hire_date: formData.hire_date || undefined,
        schedule_ids: formData.schedule_ids.length > 0 ? formData.schedule_ids : undefined,
        position_ids: formData.position_ids.length > 0 ? formData.position_ids : undefined,
      };

      // Include organization_id if available
      if (organizationId) {
        payload.organization_id = organizationId;
      }

      const res = await apiClient2.post("/employees/by-admin", payload);

      if (!res.data?.success) {
        throw new Error(res.data?.message || "Failed to create employee");
      }

      const createdEmployee = res.data.data;
      const employeeId = createdEmployee?.id;

      // 2. If save & invite, send invitation email
      if (action === "save-and-invite" && employeeId) {
        try {
          await apiClient2.post("/auth/send-verification-email", {
            email: formData.email.trim(),
            metadata: {
              employeeId: employeeId,
            },
          });
          showToast("Employee created and invitation email sent!", "success");
        } catch (inviteErr: any) {
          // Employee was created but invite failed
          showToast(
            "Employee created but invitation email failed to send. " +
              (inviteErr?.response?.data?.message || inviteErr.message),
            "error"
          );
        }
      } else {
        showToast("Employee created successfully!", "success");
      }

      // Reset form and close
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        mobile: "",
        access_level_id: "",
        timezone: getAutoDetectedTimezone(),
        schedule_ids: [],
        position_ids: [],
        hire_date: new Date().toISOString().split("T")[0],
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      const msg = err?.response?.data?.message || err.message || "Failed to create employee";
      setSubmitError(msg);
      showToast(msg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={!isSubmitting ? onClose : undefined}
      />

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-[60] animate-in fade-in slide-in-from-top-2 duration-300">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border ${
              toast.type === "success"
                ? "bg-green-900/90 border-green-500/30 text-green-100"
                : "bg-red-900/90 border-red-500/30 text-red-100"
            }`}
          >
            {toast.type === "success" ? (
              <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <p className="text-sm font-medium">{toast.message}</p>
          </div>
        </div>
      )}

      {/* Modal */}
      <div className="relative bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-neutral-900 border-b border-neutral-800 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-lg font-semibold text-white">Add Employee</h2>
            <p className="text-sm text-neutral-500 mt-0.5">Create a new employee record</p>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-neutral-800 rounded-lg transition-colors text-neutral-400 hover:text-white disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Error Banner */}
          {submitError && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
              <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-400 text-sm">{submitError}</p>
            </div>
          )}

          {/* Basic Info Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-neutral-300 uppercase tracking-wider">Basic Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* First Name */}
              <div className="space-y-1.5">
                <label className="block text-sm text-neutral-400">
                  First Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => handleChange("first_name", e.target.value)}
                  placeholder="John"
                  disabled={isSubmitting}
                  className={`w-full bg-neutral-950 border rounded-xl px-4 py-2.5 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all disabled:opacity-50 ${
                    errors.first_name ? "border-red-500/50 focus:border-red-500" : "border-neutral-800"
                  }`}
                />
                {errors.first_name && <p className="text-red-400 text-xs">{errors.first_name}</p>}
              </div>

              {/* Last Name */}
              <div className="space-y-1.5">
                <label className="block text-sm text-neutral-400">Last Name</label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => handleChange("last_name", e.target.value)}
                  placeholder="Doe"
                  disabled={isSubmitting}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all disabled:opacity-50"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-sm text-neutral-400">
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="john@example.com"
                  disabled={isSubmitting}
                  className={`w-full bg-neutral-950 border rounded-xl px-4 py-2.5 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all disabled:opacity-50 ${
                    errors.email ? "border-red-500/50 focus:border-red-500" : "border-neutral-800"
                  }`}
                />
                {errors.email && <p className="text-red-400 text-xs">{errors.email}</p>}
              </div>

              {/* Mobile */}
              <div className="space-y-1.5">
                <label className="block text-sm text-neutral-400">Mobile</label>
                <input
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => handleChange("mobile", e.target.value)}
                  placeholder="+1 234 567 8900"
                  disabled={isSubmitting}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all disabled:opacity-50"
                />
              </div>
            </div>
          </div>

          {/* Work Details Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-neutral-300 uppercase tracking-wider">Work Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Access Level */}
              <div className="space-y-1.5">
                <label className="block text-sm text-neutral-400">Access Level</label>
                <select
                  value={formData.access_level_id}
                  onChange={(e) => handleChange("access_level_id", e.target.value)}
                  disabled={isSubmitting}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all disabled:opacity-50 appearance-none cursor-pointer"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", backgroundSize: "16px" }}
                >
                  <option value="">Select access level</option>
                  {accessLevels.map((level) => (
                    <option key={level.id} value={level.id}>
                      {level.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Timezone */}
              <div className="space-y-1.5">
                <label className="block text-sm text-neutral-400">Timezone</label>
                <select
                  value={formData.timezone}
                  onChange={(e) => handleChange("timezone", e.target.value)}
                  disabled={isSubmitting}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all disabled:opacity-50 appearance-none cursor-pointer"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", backgroundSize: "16px" }}
                >
                  {COMMON_TIMEZONES.map((tz) => (
                    <option key={tz} value={tz}>
                      {tz}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-neutral-500">Auto-detected from your browser</p>
              </div>

              {/* Hire Date */}
              <div className="space-y-1.5">
                <label className="block text-sm text-neutral-400">Hire Date</label>
                <input
                  type="date"
                  value={formData.hire_date}
                  onChange={(e) => handleChange("hire_date", e.target.value)}
                  disabled={isSubmitting}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all disabled:opacity-50 [color-scheme:dark]"
                />
              </div>
            </div>
          </div>

          {/* Schedules Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-neutral-300 uppercase tracking-wider">Schedules</h3>
            <div className="flex flex-wrap gap-2">
              {schedules.map((schedule) => (
                <button
                  key={schedule.id}
                  type="button"
                  onClick={() => toggleSelection("schedule_ids", schedule.id)}
                  disabled={isSubmitting}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all disabled:opacity-50 ${
                    formData.schedule_ids.includes(schedule.id)
                      ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                      : "bg-neutral-800 text-neutral-400 border border-neutral-700 hover:border-neutral-600"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    {formData.schedule_ids.includes(schedule.id) && (
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {schedule.name}
                  </div>
                </button>
              ))}
            </div>
            {formData.schedule_ids.length > 0 && (
              <p className="text-xs text-indigo-400">
                {formData.schedule_ids.length} schedule{formData.schedule_ids.length > 1 ? "s" : ""} selected
              </p>
            )}
          </div>

          {/* Positions Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-neutral-300 uppercase tracking-wider">Positions</h3>
            <div className="flex flex-wrap gap-2">
              {positions.map((position) => (
                <button
                  key={position.id}
                  type="button"
                  onClick={() => toggleSelection("position_ids", position.id)}
                  disabled={isSubmitting}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all disabled:opacity-50 ${
                    formData.position_ids.includes(position.id)
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : "bg-neutral-800 text-neutral-400 border border-neutral-700 hover:border-neutral-600"
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    {formData.position_ids.includes(position.id) && (
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {position.name}
                  </div>
                </button>
              ))}
            </div>
            {formData.position_ids.length > 0 && (
              <p className="text-xs text-green-400">
                {formData.position_ids.length} position{formData.position_ids.length > 1 ? "s" : ""} selected
              </p>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-neutral-900 border-t border-neutral-800 px-6 py-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={() => handleSubmit("save")}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl text-sm font-medium bg-neutral-800 hover:bg-neutral-700 text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save Employee
              </>
            )}
          </button>
          <button
            onClick={() => handleSubmit("save-and-invite")}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Save & Invite
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEmployeeModal;
