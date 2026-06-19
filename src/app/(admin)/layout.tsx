"use client";

import { useEffect, useState } from "react";
import AdminHeader from "@/components/adminComponents/AdminHeader";
import apiClient2 from "@/components/shared/Axios/AxiosInstance2";
import { EmployeeProfileData } from "@/components/adminComponents/EmployeeProfile";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [profileData, setProfileData] = useState<EmployeeProfileData | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiClient2.get("/employees/my-profile");
        if (res.data?.data) {
          setProfileData(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div className="min-h-full flex flex-col bg-neutral-950">
      <AdminHeader profileData={profileData || undefined} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
