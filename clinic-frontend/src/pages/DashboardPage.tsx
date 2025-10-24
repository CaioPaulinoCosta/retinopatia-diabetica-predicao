export default function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Resumo do Sistema
          </h3>
          <p className="text-gray-600 mt-2">Dashboard em construção...</p>
        </div>
      </div>
    </div>
  );
}
