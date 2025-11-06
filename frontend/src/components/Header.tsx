"use client";

import {} from "@/lib/icons";
import { FontAwesomeIcon, icons } from "@/lib/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: icons.dashboard },
    { path: "/patients", label: "Pacientes", icon: icons.userInjured },
    { path: "/exams", label: "Exames", icon: icons.microscope },
  ];
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon
                icon={icons.eye}
                className="text-white text-sm"
              />
            </div>
            <div className="text-xl font-bold transform-none transition-none">
              Lumin<span className="text-sky-600">Eye</span>
            </div>
          </Link>

          {/* Navigation Items */}
          <div className="flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-2 font-medium transition duration-200 ${
                  pathname === item.path
                    ? "text-sky-500"
                    : "text-gray-700 hover:text-sky-500"
                }`}
              >
                <FontAwesomeIcon icon={item.icon} className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
