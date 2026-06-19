"use client";

import React, { useState } from "react";
import apiClient2 from "../shared/Axios/AxiosInstance2";

interface OrganizationPayload {
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
}

const OnBoardPage = () => {
  const [orgName, setOrgName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .substring(0, 50);
  };

  const getAutoDetectedValues = () => {
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const locale = Intl.DateTimeFormat().resolvedOptions().locale;
      
      // Extract country from locale (e.g., "en-US" -> "US")
      const country = locale.split("-")[1]?.toUpperCase() || "US";
      
      // Map common countries to currencies
      const currencyMap: Record<string, string> = {
        US: "USD",
        GB: "GBP",
        CA: "CAD",
        AU: "AUD",
        EU: "EUR",
        DE: "EUR",
        FR: "EUR",
        IT: "EUR",
        ES: "EUR",
        JP: "JPY",
        CN: "CNY",
        IN: "INR",
        BD: "BDT",
        PK: "PKR",
      };
      
      const currency = currencyMap[country] || "USD";
      
      return {
        timezone,
        country,
        currency,
      };
    } catch {
      return {
        timezone: "UTC",
        country: "US",
        currency: "USD",
      };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName.trim()) return;

    setIsSubmitting(true);
    setError(null);

    const autoValues = getAutoDetectedValues();

    const payload: OrganizationPayload = {
      name: orgName.trim(),
      slug: generateSlug(orgName),
      timezone: autoValues.timezone,
      country: autoValues.country,
      currency: autoValues.currency,
      logo_url: "https://example.com/png",
      language: "en",
      date_format: "YYYY-MM-DD",
      time_format: "HH:mm",
      work_week_starts_on: 1,
    };

    try {
      const res = await apiClient2.post("/organizations", payload);
      console.log("Organization created:", res.data);
      
      // Redirect to admin dashboard after successful creation
      window.location.href = "https://pulse.aviro24.shop/admin";
    } catch (err: any) {
      console.error("Error creating organization:", err);
      setError(
        err?.response?.data?.message || 
        "Failed to create organization. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            Create your organization
          </h1>
          <p className="mt-2 text-sm text-neutral-400">
            Set up your workspace to get started
          </p>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-6"
        >
          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Organization Name */}
          <div className="space-y-2">
            <label
              htmlFor="orgName"
              className="block text-sm font-medium text-neutral-300"
            >
              Organization name
            </label>
            <input
              id="orgName"
              type="text"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              placeholder="Acme Inc."
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-2.5 text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting || !orgName.trim()}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition-colors"
          >
            {isSubmitting ? "Creating..." : "Create organization"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OnBoardPage;
