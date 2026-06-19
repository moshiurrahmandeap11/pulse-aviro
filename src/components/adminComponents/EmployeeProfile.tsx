"use client";

import React, { useState } from "react";
import Image from "next/image";

// Types from your API response
interface Organization {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  timezone: string;
  country: string;
  currency: string;
  logo_url: string;
  language: string;
  date_format: string;
  time_format: string;
  work_week_starts_on: number;
  created_at: string;
  updated_at: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  organization_id: string;
  created_at: string;
  updated_at: string;
}

interface EmployeeProfileData {
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
  organization: Organization;
  role: Role;
  employeePositions: any[];
  employeeSkills: any[];
  employeeSchedules: any[];
}

interface EmployeeProfileProps {
  data: EmployeeProfileData;
}

type TabType = "overview" | "personal" | "work" | "permissions" | "activity";

const EmployeeProfile: React.FC<EmployeeProfileProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  const fullName = `${data.first_name || ""} ${data.last_name || ""}`.trim() || "Employee";
  const initials = `${data.first_name?.[0] || ""}${data.last_name?.[0] || ""}`.toUpperCase();
  const isOwner = data.id === data.organization.owner_id;

  const tabs: { key: TabType; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "personal", label: "Personal Info" },
    { key: "work", label: "Work Details" },
    { key: "permissions", label: "Permissions" },
    { key: "activity", label: "Activity" },
  ];

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Not set";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-neutral-800/50 border border-neutral-700 rounded-xl p-4">
          <p className="text-sm text-neutral-400">Role</p>
          <p className="text-lg font-semibold text-white mt-1">{data.role.name}</p>
          <span className="text-xs text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full mt-2 inline-block">
            {isOwner ? "Owner" : "Member"}
          </span>
        </div>
        <div className="bg-neutral-800/50 border border-neutral-700 rounded-xl p-4">
          <p className="text-sm text-neutral-400">Organization</p>
          <p className="text-lg font-semibold text-white mt-1">{data.organization.name}</p>
          <p className="text-xs text-neutral-500 mt-1">{data.organization.slug}</p>
        </div>
        <div className="bg-neutral-800/50 border border-neutral-700 rounded-xl p-4">
          <p className="text-sm text-neutral-400">Employee ID</p>
          <p className="text-lg font-semibold text-white mt-1">{data.employee_code || "N/A"}</p>
          <p className="text-xs text-neutral-500 mt-1">{data.employee_type || "Not set"}</p>
        </div>
        <div className="bg-neutral-800/50 border border-neutral-700 rounded-xl p-4">
          <p className="text-sm text-neutral-400">Joined</p>
          <p className="text-lg font-semibold text-white mt-1">{formatDate(data.created_at)}</p>
          <p className="text-xs text-neutral-500 mt-1">{data.hire_date ? `Hired: ${formatDate(data.hire_date)}` : "Hire date not set"}</p>
        </div>
      </div>

      {/* Organization Details */}
      <div className="bg-neutral-800/50 border border-neutral-700 rounded-xl p-5">
        <h3 className="text-lg font-semibold text-white mb-4">Organization Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-neutral-700/50">
              <span className="text-sm text-neutral-400">Name</span>
              <span className="text-sm text-white">{data.organization.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-neutral-700/50">
              <span className="text-sm text-neutral-400">Timezone</span>
              <span className="text-sm text-white">{data.organization.timezone}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-neutral-700/50">
              <span className="text-sm text-neutral-400">Country</span>
              <span className="text-sm text-white">{data.organization.country}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-neutral-700/50">
              <span className="text-sm text-neutral-400">Currency</span>
              <span className="text-sm text-white">{data.organization.currency}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-neutral-700/50">
              <span className="text-sm text-neutral-400">Date Format</span>
              <span className="text-sm text-white">{data.organization.date_format}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-neutral-700/50">
              <span className="text-sm text-neutral-400">Time Format</span>
              <span className="text-sm text-white">{data.organization.time_format}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-neutral-700/50">
              <span className="text-sm text-neutral-400">Work Week Starts</span>
              <span className="text-sm text-white">{["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][data.organization.work_week_starts_on]}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-neutral-700/50">
              <span className="text-sm text-neutral-400">Language</span>
              <span className="text-sm text-white">{data.organization.language.toUpperCase()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Summary */}
      <div className="bg-neutral-800/50 border border-neutral-700 rounded-xl p-5">
        <h3 className="text-lg font-semibold text-white mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-neutral-400">Email</p>
              <p className="text-sm text-white">{data.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-neutral-400">Mobile</p>
              <p className="text-sm text-white">{data.mobile || "Not set"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPersonal = () => (
    <div className="space-y-6">
      <div className="bg-neutral-800/50 border border-neutral-700 rounded-xl p-5">
        <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoRow label="Full Name" value={fullName} />
          <InfoRow label="Email" value={data.email} />
          <InfoRow label="Gender" value={data.gender || "Not set"} />
          <InfoRow label="Date of Birth" value={formatDate(data.date_of_birth)} />
          <InfoRow label="Mobile" value={data.mobile || "Not set"} />
          <InfoRow label="Home Phone" value={data.home_phone || "Not set"} />
          <InfoRow label="Work Phone" value={data.work_phone || "Not set"} />
          <InfoRow label="Language" value={data.language || "Not set"} />
          <InfoRow label="Timezone" value={data.timezone || "Not set"} />
        </div>
      </div>

      <div className="bg-neutral-800/50 border border-neutral-700 rounded-xl p-5">
        <h3 className="text-lg font-semibold text-white mb-4">Address</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoRow label="Street Address 1" value={data.street_address_1 || "Not set"} />
          <InfoRow label="Street Address 2" value={data.street_address_2 || "Not set"} />
          <InfoRow label="City" value={data.city || "Not set"} />
          <InfoRow label="State" value={data.state || "Not set"} />
          <InfoRow label="Postal Code" value={data.postal_code || "Not set"} />
          <InfoRow label="Country" value={data.country || "Not set"} />
        </div>
      </div>

      <div className="bg-neutral-800/50 border border-neutral-700 rounded-xl p-5">
        <h3 className="text-lg font-semibold text-white mb-4">Emergency Contact</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoRow label="Name" value={data.emergency_contact_name || "Not set"} />
          <InfoRow label="Phone" value={data.emergency_contact_phone || "Not set"} />
        </div>
      </div>
    </div>
  );

  const renderWork = () => (
    <div className="space-y-6">
      <div className="bg-neutral-800/50 border border-neutral-700 rounded-xl p-5">
        <h3 className="text-lg font-semibold text-white mb-4">Work Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoRow label="Employee Code" value={data.employee_code || "Not set"} />
          <InfoRow label="Employee Type" value={data.employee_type || "Not set"} />
          <InfoRow label="Hire Date" value={formatDate(data.hire_date)} />
          <InfoRow label="Role" value={data.role.name} />
          <InfoRow label="Access Level" value={data.access_level_id ? "Granted" : "Not set"} />
          <InfoRow label="Note" value={data.note || "No notes"} />
        </div>
      </div>

      <div className="bg-neutral-800/50 border border-neutral-700 rounded-xl p-5">
        <h3 className="text-lg font-semibold text-white mb-4">Work Limits</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoRow label="Min Hours/Week" value={data.min_hours_per_week?.toString() || "Not set"} />
          <InfoRow label="Max Days/Week" value={data.max_days_per_week?.toString() || "Not set"} />
          <InfoRow label="Max Hours/Day" value={data.max_hours_per_day?.toString() || "Not set"} />
          <InfoRow label="Max Shifts/Day" value={data.max_shifts_per_day?.toString() || "Not set"} />
          <InfoRow label="Min Rest (Same Day)" value={data.min_rest_hours_same_day?.toString() || "Not set"} />
          <InfoRow label="Min Rest (Consecutive)" value={data.min_hours_rest_consecutive?.toString() || "Not set"} />
        </div>
      </div>

      <div className="bg-neutral-800/50 border border-neutral-700 rounded-xl p-5">
        <h3 className="text-lg font-semibold text-white mb-4">Positions & Skills</h3>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-neutral-400 mb-2">Positions</p>
            {data.employeePositions.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {data.employeePositions.map((pos: any, i: number) => (
                  <span key={i} className="bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full text-sm">
                    {pos.name || "Position"}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-neutral-500">No positions assigned</p>
            )}
          </div>
          <div>
            <p className="text-sm text-neutral-400 mb-2">Skills</p>
            {data.employeeSkills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {data.employeeSkills.map((skill: any, i: number) => (
                  <span key={i} className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
                    {skill.name || "Skill"}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-neutral-500">No skills added</p>
            )}
          </div>
          <div>
            <p className="text-sm text-neutral-400 mb-2">Schedules</p>
            {data.employeeSchedules.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {data.employeeSchedules.map((sched: any, i: number) => (
                  <span key={i} className="bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-sm">
                    {sched.name || "Schedule"}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-neutral-500">No schedules assigned</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPermissions = () => {
    const grouped = data.role.permissions.reduce((acc: Record<string, string[]>, perm: string) => {
      const [resource] = perm.split(":");
      if (!acc[resource]) acc[resource] = [];
      acc[resource].push(perm);
      return acc;
    }, {});

    return (
      <div className="space-y-6">
        <div className="bg-neutral-800/50 border border-neutral-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Role Permissions</h3>
            <span className="bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full text-sm font-medium">
              {data.role.name}
            </span>
          </div>
          <p className="text-sm text-neutral-400 mb-4">{data.role.description}</p>
          
          <div className="space-y-4">
            {Object.entries(grouped).map(([resource, perms]) => (
              <div key={resource} className="border border-neutral-700/50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-white capitalize mb-2">{resource.replace(/_/g, " ")}</h4>
                <div className="flex flex-wrap gap-2">
                  {perms.map((perm: string) => {
                    const action = perm.split(":")[1];
                    const colorMap: Record<string, string> = {
                      read: "bg-blue-500/20 text-blue-400",
                      create: "bg-green-500/20 text-green-400",
                      update: "bg-amber-500/20 text-amber-400",
                      delete: "bg-red-500/20 text-red-400",
                    };
                    return (
                      <span key={perm} className={`${colorMap[action] || "bg-neutral-700 text-neutral-300"} px-2 py-1 rounded-md text-xs font-medium`}>
                        {action}
                      </span>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderActivity = () => (
    <div className="space-y-6">
      <div className="bg-neutral-800/50 border border-neutral-700 rounded-xl p-5">
        <h3 className="text-lg font-semibold text-white mb-4">Account Timeline</h3>
        <div className="space-y-4">
          <TimelineItem
            icon="check"
            title="Profile Created"
            date={formatDate(data.created_at)}
            description="Employee profile was created in the system"
            color="green"
          />
          <TimelineItem
            icon="update"
            title="Last Updated"
            date={formatDate(data.updated_at)}
            description="Profile information was last modified"
            color="indigo"
          />
          <TimelineItem
            icon="building"
            title="Organization Joined"
            date={formatDate(data.organization.created_at)}
            description={`Joined ${data.organization.name}`}
            color="amber"
          />
          {data.hire_date && (
            <TimelineItem
              icon="briefcase"
              title="Hired"
              date={formatDate(data.hire_date)}
              description="Official hire date"
              color="green"
            />
          )}
        </div>
      </div>

      <div className="bg-neutral-800/50 border border-neutral-700 rounded-xl p-5">
        <h3 className="text-lg font-semibold text-white mb-4">System Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoRow label="User ID" value={data.user_id} />
          <InfoRow label="Employee ID" value={data.id} />
          <InfoRow label="Organization ID" value={data.organization_id} />
          <InfoRow label="Role ID" value={data.role.id} />
          <InfoRow label="Access Level ID" value={data.access_level_id || "Not set"} />
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "overview": return renderOverview();
      case "personal": return renderPersonal();
      case "work": return renderWork();
      case "permissions": return renderPermissions();
      case "activity": return renderActivity();
      default: return renderOverview();
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 lg:p-8">
      {/* Profile Header Card */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="relative">
            {data.profile_pic ? (
              <Image
                src={data.profile_pic}
                alt={fullName}
                width={80}
                height={80}
                className="w-20 h-20 rounded-2xl object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-indigo-500 flex items-center justify-center text-white text-2xl font-bold">
                {initials}
              </div>
            )}
            <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-neutral-900" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold text-white">{fullName}</h1>
              <span className="bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full text-xs font-medium">
                {data.role.name}
              </span>
              {isOwner && (
                <span className="bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full text-xs font-medium">
                  Owner
                </span>
              )}
            </div>
            <p className="text-neutral-400 mt-1">{data.email}</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-neutral-500">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                {data.organization.name}
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {data.organization.timezone}
              </span>
            </div>
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Edit Profile
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-neutral-800 mb-6">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.key
                  ? "border-indigo-500 text-indigo-400"
                  : "border-transparent text-neutral-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="animate-in fade-in duration-200">
        {renderContent()}
      </div>
    </div>
  );
};

// Helper Components
const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between py-2 border-b border-neutral-700/50 last:border-0">
    <span className="text-sm text-neutral-400">{label}</span>
    <span className="text-sm text-white">{value}</span>
  </div>
);

const TimelineItem = ({ icon, title, date, description, color }: {
  icon: string;
  title: string;
  date: string;
  description: string;
  color: string;
}) => {
  const colorMap: Record<string, string> = {
    green: "bg-green-500/20 text-green-400",
    indigo: "bg-indigo-500/20 text-indigo-400",
    amber: "bg-amber-500/20 text-amber-400",
    red: "bg-red-500/20 text-red-400",
  };

  return (
    <div className="flex items-start gap-3">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${colorMap[color] || colorMap.indigo}`}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div>
        <p className="text-sm font-medium text-white">{title}</p>
        <p className="text-xs text-neutral-400">{date}</p>
        <p className="text-sm text-neutral-500 mt-1">{description}</p>
      </div>
    </div>
  );
};

export default EmployeeProfile;
export type { EmployeeProfileData };
