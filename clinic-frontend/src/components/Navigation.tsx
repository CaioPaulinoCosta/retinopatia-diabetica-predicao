import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStethoscope,
  faDashboard,
  faUserInjured,
  faMicroscope,
} from "@fortawesome/free-solid-svg-icons";

export default function Navigation() {
  const location = useLocation();

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: faDashboard },
    { path: "/patients", label: "Pacientes", icon: faUserInjured },
    { path: "/exams", label: "Exames", icon: faMicroscope },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <FontAwesomeIcon
                icon={faStethoscope}
                className="text-white text-sm"
              />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              ClinicVision
            </span>
          </Link>

          {/* Navigation Items */}
          <div className="flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 font-medium transition-colors duration-200 ${
                  location.pathname === item.path
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-blue-600"
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
