"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Globe, Settings, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { getProfile } from "./lib/dataStore";

export default function Layout({ children }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    getProfile().then(setUser);
  }, []);

  const handleLogout = async () => {
    setUser(null);
  };

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: Globe, label: "My Sites", path: "/sites" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  if (pathname?.includes("/view/")) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative lg:translate-x-0`}
      >
        <div className="h-full flex flex-col">
          <div className="h-16 flex items-center px-6 border-b border-gray-100">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-lg">SS</span>
            </div>
            <span className="text-xl font-bold tracking-tight">StudioShape</span>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <item.icon
                    className={`w-5 h-5 mr-3 ${
                      isActive ? "text-indigo-600" : "text-gray-400"
                    }`}
                  />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center mb-4 px-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium text-sm">
                {user?.email?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.email || "user@example.com"}
                </p>
                <p className="text-xs text-gray-500">{user?.plan || "Free Plan"}</p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      <button
        className="lg:hidden fixed bottom-6 right-6 z-50 w-12 h-12 bg-indigo-600 rounded-full shadow-lg flex items-center justify-center text-white hover:bg-indigo-700 transition-colors"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-8">{children}</div>
      </main>
    </div>
  );
}
