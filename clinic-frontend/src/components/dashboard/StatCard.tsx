import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: IconDefinition;
  iconColor: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export default function StatCard({
  title,
  value,
  description,
  icon,
  iconColor,
  trend,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          <p className="text-sm text-gray-500 mt-1">{description}</p>

          {trend && (
            <div
              className={`flex items-center mt-2 text-sm ${
                trend.isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              <span>
                {trend.isPositive ? "↗" : "↘"} {Math.abs(trend.value)}%
              </span>
              <span className="text-gray-500 ml-1">vs último mês</span>
            </div>
          )}
        </div>

        <div
          className={`w-12 h-12 ${iconColor} rounded-xl flex items-center justify-center`}
        >
          <FontAwesomeIcon icon={icon} className="text-white text-lg" />
        </div>
      </div>
    </div>
  );
}
