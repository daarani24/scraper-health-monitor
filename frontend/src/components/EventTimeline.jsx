import { useState, useEffect } from "react";
import { getEvents } from "../api/client";

export default function EventTimeline() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = () => {
      getEvents()
        .then((res) => setEvents(res.data.events))
        .catch((err) => console.error(err));
    };

    fetchEvents();
    const interval = setInterval(fetchEvents, 5000); 
    return () => clearInterval(interval);
  }, []);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  const getStatusColor = (confidence) => {
    if (confidence >= 85) return "bg-green-500";
    if (confidence >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="bg-gray-900 rounded-xl p-5 shadow-md">
      <h3 className="text-white font-semibold text-lg mb-4">
        📋 Live Event Timeline
      </h3>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {events.length === 0 && (
          <p className="text-gray-500 text-sm">No events yet.</p>
        )}
        {events.map((event) => {
          const issues = JSON.parse(event.issues || "{}");
          const issueCount = Object.keys(issues).length;

          return (
            <div
              key={event.id}
              className="flex items-start gap-3 border-l-2 border-gray-700 pl-4 py-2"
            >
              <span
                className={`w-2 h-2 rounded-full mt-2 ${getStatusColor(event.overall_confidence)}`}
              />
              <div className="flex-1">
                <p className="text-gray-200 text-sm font-medium truncate max-w-xs">
                  {event.product_name}
                </p>
                <p className="text-gray-500 text-xs">
                  {formatTime(event.timestamp)} · Confidence: {event.overall_confidence}%
                  {issueCount > 0 && ` · ${issueCount} issue(s)`}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}