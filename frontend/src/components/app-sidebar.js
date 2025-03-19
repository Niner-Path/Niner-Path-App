import { useState } from "react";
import Link from "next/link";
import { Calendar, Home, Inbox, Search, Settings, Menu } from "lucide-react";
import { usePathname } from "next/navigation";

const menuItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Inbox", url: "/inbox", icon: Inbox },
  { title: "Calendar", url: "/calendar", icon: Calendar },
  { title: "Search", url: "/search", icon: Search },
  { title: "Settings", url: "/settings", icon: Settings },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`flex flex-col bg-[#111827] text-white transition-all 
        ${collapsed ? "w-16" : "w-56"} h-screen p-4`}
    >
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="p-2 rounded-md bg-yellow-600 hover:bg-yellow-700 transition w-full flex justify-center"
      >
        <Menu size={24} className="text-white" />
      </button>

      <nav className="flex-1 mt-4">
        {menuItems.map((item) => (
          <Link
            key={item.title}
            href={item.url}
            className={`flex items-center gap-3 p-3 rounded-md text-gray-300 transition-all 
              ${
                pathname === item.url
                  ? "bg-gray-800 text-white"
                  : "hover:bg-gray-700 hover:text-white"
              }`}
          >
            <item.icon size={20} className="text-gray-300 hover:text-white" />
            {!collapsed && <span className="font-medium">{item.title}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
