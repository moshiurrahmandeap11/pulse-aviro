import AdminHeader from "@/components/adminComponents/AdminHeader";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-full flex flex-col bg-neutral-950">
      <AdminHeader />
      <main className="flex-1">{children}</main>
    </div>
  );
}
