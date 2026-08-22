import { useState, useEffect } from "react";
import HeroNumber from "./components/HeroNumber";
import StatusCard from "./components/StatusCard";
import { getStats } from "./api/client";
import EventTimeline from "./components/EventTimeline";
import DiffView from "./components/DiffView";

const SAMPLE_OLD_RECORDS = [
  {
    product_name: "Lenovo IdeaPad Slim 3 13th Gen Intel Core i3-1315U",
    number_of_reviews: 3,
    stock_availability: "In stock",
    product_page_url: "https://www.amazon.in/Lenovo-IdeaPad-i3-1315U/dp/B0G2SSS2V8",
  },
  {
    product_name: "HP 15 Laptop, AMD Ryzen 7 7730U",
    number_of_reviews: 29,
    stock_availability: "In stock In stock",
    product_page_url: "https://www.amazon.in/HP-Anti-Glare/dp/B0FYQN4K1C",
  },
];

function App() {
  const [stats, setStats] = useState({ average_confidence: 0, total_checks: 0 });
  const [booksStats, setBooksStats] = useState({ average_confidence: 0, total_checks: 0 });

  useEffect(() => {
    getStats("amazon_laptops")
      .then((res) => setStats(res.data))
      .catch((err) => console.error(err));

    getStats("books")
      .then((res) => setBooksStats(res.data))
      .catch((err) => console.error(err));
  }, []);

  const combinedConfidence =
    stats.total_checks + booksStats.total_checks > 0
      ? (
          (stats.average_confidence * stats.total_checks +
            booksStats.average_confidence * booksStats.total_checks) /
          (stats.total_checks + booksStats.total_checks)
        ).toFixed(1)
      : 0;

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <h1 className="text-white text-2xl font-bold mb-6">🩺 Scraper Health Monitor</h1>

      <div className="mb-8">
        <HeroNumber
          confidence={combinedConfidence}
          totalChecks={stats.total_checks + booksStats.total_checks}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatusCard
          collectorName="amazon_laptops"
          confidence={stats.average_confidence}
        />
        <StatusCard
          collectorName="books"
          confidence={booksStats.average_confidence}
        />
      </div>

      <div className="mt-8">
        <EventTimeline />
      </div>

      <div className="mt-8">
        <DiffView
          collectorId="c_mt1ljdwc26mfrhcph5"
          url="https://www.amazon.in/s?k=laptops"
          oldRecords={SAMPLE_OLD_RECORDS}
        />
      </div>
    </div>
  );
}

export default App;