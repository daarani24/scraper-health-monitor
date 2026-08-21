export default function StatusCard({ collectorName, confidence, lastChecked }) {
  const getStatus = (score) => {
    if (score >= 85) return { emoji: "🟢", label: "Healthy", color: "border-green-500" };
    if (score >= 60) return { emoji: "🟡", label: "Degraded", color: "border-yellow-500" };
    return { emoji: "🔴", label: "Broken", color: "border-red-500" };
  };

  const status = getStatus(confidence);

  return (
    <div className={`bg-gray-900 rounded-xl p-5 border-l-4 ${status.color} shadow-md`}>
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-white font-semibold text-lg">{collectorName}</h3>
          <p className="text-gray-400 text-sm">{status.label}</p>
        </div>
        <div className="text-right">
          <span className="text-3xl">{status.emoji}</span>
          <p className="text-gray-300 font-mono">{confidence}%</p>
        </div>
      </div>
      {lastChecked && (
        <p className="text-gray-600 text-xs mt-2">Last checked: {lastChecked}</p>
      )}
    </div>
  );
}