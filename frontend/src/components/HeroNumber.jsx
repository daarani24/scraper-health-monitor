export default function HeroNumber({ confidence, totalChecks }) {
  const getColor = (score) => {
    if (score >= 85) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="bg-gray-900 rounded-2xl p-8 text-center shadow-lg border border-gray-800">
      <p className="text-gray-400 text-sm uppercase tracking-wider mb-2">
        Overall System Health
      </p>
      <h1 className={`text-7xl font-bold ${getColor(confidence)}`}>
        {confidence}%
      </h1>
      <p className="text-gray-500 mt-3">
        Based on {totalChecks} checks across all collectors
      </p>
    </div>
  );
}