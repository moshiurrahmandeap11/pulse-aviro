"use client";

import { useEffect, useState } from "react";
import { useAuth } from "./contexts/AuthContexts";
import Image from "next/image";
import apiClient2 from "@/components/shared/Axios/AxiosInstance2";
import { useRouter } from "next/navigation";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

// Organization Interface
interface Organization {
  country: string;
  created_at: string;
  currency: string;
  date_format: string;
  id: string;
  language: string;
  logo_url: string;
  name: string;
  owner_id: string;
  slug: string;
  time_format: string;
  timezone: string;
  updated_at: string;
  work_week_starts_on: number;
}

// Employee Position Interface
interface EmployeePosition {
  id: string;
  name: string;
  // Add other properties as needed
}

// Employee Schedule Interface
interface EmployeeSchedule {
  id: string;
  // Add other properties as needed
}

// Employee Skill Interface
interface EmployeeSkill {
  id: string;
  name: string;
  // Add other properties as needed
}

// Employee Profile Interface
interface EmployeeProfile {
  id: string;
  user_id: string;
  organization_id: string;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  date_of_birth: string;
  mobile: string;
  home_phone: string;
  work_phone: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  street_address_1: string;
  street_address_2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  timezone: string;
  language: string;
  profile_pic: string;
  hire_date: string | null;
  employee_code: string | null;
  employee_type: string | null;
  role: string | null;
  access_level_id: string | null;
  note: string | null;
  max_days_per_week: number | null;
  max_hours_per_day: number | null;
  max_shifts_per_day: number | null;
  min_hours_per_week: number | null;
  min_hours_rest_consecutive: number | null;
  min_rest_hours_same_day: number | null;
  created_at: string;
  updated_at: string;
  organization: Organization | Organization[];
  employeePositions: EmployeePosition[];
  employeeSchedules: EmployeeSchedule[];
  employeeSkills: EmployeeSkill[];
}

// Error type for API calls
interface ApiError {
  message?: string;
  response?: {
    data?: {
      message?: string;
    };
  };
  status?: number;
}

// Extend User type to include profile_pic
interface User {
  firstName?: string;
  lastName?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  profilePicture?: string | StaticImport;
  profile_pic?: string | StaticImport;
}

export default function Home() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [empProfile, setEmpProfile] = useState<EmployeeProfile | null>(null);
  console.log("employee profile :", empProfile);
  const [error, setError] = useState<string | null>(null);

  // Mounting state - Fixed: using startTransition or removing useEffect
  // Better approach: set mounted directly in a useLayoutEffect or use useState initial value
  useEffect(() => {
    // Using setTimeout to avoid cascading renders warning
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    
    return () => clearTimeout(timer);
  }, []);

  // Fetch employee profile
  useEffect(() => {
    if (!isAuthenticated || !mounted) return;

    const fetchEmployeeProfile = async () => {
      try {
        const res = await apiClient2.get(`/employees/my-profile`);
        if (res.data?.data) {
          setEmpProfile(res.data.data);
          setError(null);
        } else {
          setError("No profile data found");
        }
      } catch (err: unknown) {
        // Fixed: using unknown instead of any
        console.error("Error fetching profile:", err);
        
        // Type guard to safely access error properties
        let errorMessage = "Failed to fetch profile";
        if (err && typeof err === 'object') {
          const apiError = err as ApiError;
          errorMessage = apiError.message || 
                        apiError.response?.data?.message || 
                        "Failed to fetch profile";
        }
        
        setError(errorMessage);
        router.push("https://pulse.aviro24.shop/onboard");
      }
    };

    fetchEmployeeProfile();
  }, [isAuthenticated, mounted, router]);

  // Navigation logic based on employee profile
  useEffect(() => {
    if (!empProfile || error) return;

    // Check if organization is empty array (no organization)
    if (
      Array.isArray(empProfile.organization) &&
      empProfile.organization.length === 0
    ) {
      router.push("https://pulse.aviro24.shop/onboard");
      return;
    }

    // Check if employee is the organization owner
    const org = empProfile.organization as Organization;
    
    if (empProfile.id === org.owner_id) {
      router.push("https://pulse.aviro24.shop/admin/dashboard");
    } else {
      router.push("https://pulse.aviro24.shop/employee/dashboard");
    }
  }, [empProfile, error, router]);

  // Helper function to get profile picture - Fixed type issue
  const getProfilePicture = (): string | StaticImport => {
    // Cast user to any temporarily or properly type it
    const typedUser = user as User | null;
    
    if (typedUser) {
      const pic = typedUser.profilePicture || typedUser.profile_pic;
      if (pic) {
        return pic;
      }
    }
    
    // Default image path
    return '/default-avatar.png';
  };

  // Loading state
  if (!mounted || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-white text-lg">Checking authentication...</p>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-white text-lg">Redirecting to login...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black">
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 max-w-md">
          <p className="text-red-400 text-center">{error}</p>
          <button
            onClick={() => router.push("https://pulse.aviro24.shop/onboard")}
            className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg transition"
          >
            Go to Onboarding
          </button>
        </div>
      </div>
    );
  }

  const userName = user
    ? `${user.firstName || user.first_name || ""} ${user.lastName || user.last_name || ""}`.trim() || "User"
    : "User";

  // Check if user has profile picture
  const hasProfilePicture = () => {
    const typedUser = user as User | null;
    return !!(typedUser?.profilePicture || typedUser?.profile_pic);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-gray-900 via-indigo-950 to-black text-white">
      {/* Welcome Card */}
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20 shadow-2xl max-w-md w-full mx-4 text-center">
        {/* Avatar */}
        <div className="flex justify-center mb-6">
          {hasProfilePicture() ? (
            <Image
              src={getProfilePicture()}
              alt={userName}
              width={100}
              height={100}
              className="w-24 h-24 rounded-full border-4 border-indigo-400 shadow-lg"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-3xl shadow-lg border-4 border-indigo-400">
              {userName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Welcome Message */}
        <h1 className="text-4xl font-bold mb-2 bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Welcome Back!
        </h1>
        <p className="text-xl text-indigo-300 mb-2">{userName}</p>
        <p className="text-sm text-gray-400 mb-6">{user?.email}</p>

        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-medium border border-green-500/30">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          Successfully Logged In
        </div>
      </div>

      {/* Footer */}
      <p className="mt-8 text-gray-500 text-sm">Pulse Avirosoft Dashboard</p>
    </div>
  );
}