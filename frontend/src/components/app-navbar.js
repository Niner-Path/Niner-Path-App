import { Search, Bell, User } from "lucide-react";

export default function AppNavbar() {
  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-md border-b">
      <div className="flex items-center gap-3">
        <Search className="w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Search careers..."
          className="border border-gray-300 px-3 py-2 rounded-md w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex items-center gap-4">
        <Bell className="w-5 h-5 text-gray-500 hover:text-gray-700 transition cursor-pointer" />
        <div className="flex items-center gap-2 cursor-pointer">
          <User className="w-8 h-8 bg-gray-300 rounded-full" />
          <span className="text-gray-700 font-medium">John Doe</span>
        </div>
      </div>
    </header>
  );
}
