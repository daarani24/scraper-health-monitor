import { useState } from "react";
import axios from "axios";

const API_BASE = "http://127.0.0.1:8000";

export default function DiffView({ collectorId, url, oldRecords }) {
  const [diff, setDiff] = useState(null);
  const [loading, setLoading] = useState(false);

  const triggerHeal = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${API_BASE}/heal/${collectorId}?url=${encodeURIComponent(url)}`,
        oldRecords
      );
      setDiff(res.data.diff);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="bg-gray-900 rounded-xl p-5 shadow-md mt-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-semibold text-lg">🔧 Self-Heal & Diff</h3>
        <button
          onClick={triggerHeal}
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
        >
          {loading ? "Running..." : "Trigger Re-Scan"}
        </button>
      </div>

      {!diff && (
        <p className="text-gray-500 text-sm">
          Click "Trigger Re-Scan" to re-run the scraper and compare results.
        </p>
      )}

      {diff && diff.length === 0 && (
        <p className="text-green-400 text-sm">✓ No changes detected. Data is stable.</p>
      )}

      {diff && diff.length > 0 && (
        <div className="space-y-3">
          {diff.map((change, idx) => (
            <div key={idx} className="border border-gray-800 rounded-lg p-3">
              <p className="text-gray-300 font-mono text-sm mb-2">
                {change.field}{" "}
                <span
                  className={`text-xs px-2 py-0.5 rounded ${
                    change.status === "recovered"
                      ? "bg-green-900 text-green-400"
                      : change.status === "broke"
                      ? "bg-red-900 text-red-400"
                      : "bg-yellow-900 text-yellow-400"
                  }`}
                >
                  {change.status}
                </span>
              </p>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-red-950/30 p-2 rounded">
                  <p className="text-red-400 mb-1">Before:</p>
                  <p className="text-gray-400 truncate">
                    {typeof change.before === "object"
                      ? JSON.stringify(change.before)
                      : String(change.before)}
                  </p>
                </div>
                <div className="bg-green-950/30 p-2 rounded">
                  <p className="text-green-400 mb-1">After:</p>
                  <p className="text-gray-400 truncate">
                    {typeof change.after === "object"
                      ? JSON.stringify(change.after)
                      : String(change.after)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}