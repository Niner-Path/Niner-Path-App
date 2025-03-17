import { AppSidebar } from "@/components/app-sidebar";

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <AppSidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center items-start px-12">
        <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-lg text-gray-600 mt-2">Welcome to your dashboard!</p>
      </main>
    </div>
  );
}
