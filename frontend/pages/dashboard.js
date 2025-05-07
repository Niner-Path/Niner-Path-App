import { useEffect, useState } from "react";

export default function Dashboard() {
  const [roadmap, setRoadmap] = useState([]);

  useEffect(() => {
    async function fetchRoadmap() {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:8000/career-roadmap/", {
        headers: { Authorization: `Token ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setRoadmap(
          data.milestones.map((item, idx) => ({
            step: idx + 1,
            title: item.title || `Step ${idx + 1}`,
            description: item.description || "",
          }))
        );
      }
    }
    fetchRoadmap();
  }, []);

  return (
    <div className="flex h-full overflow-hidden bg-gray-100">
      <section className="w-1/2 h-full overflow-y-auto p-6 bg-white">
        <h2 className="text-2xl font-bold text-blue-900 mb-6">
          Personalized Career Roadmap
        </h2>
        <ol className="relative border-l border-blue-200 space-y-10 pr-4">
          {roadmap.length > 0 ? (
            roadmap.map((step) => (
              <li key={step.step} className="ml-6">
                <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-yellow-500 rounded-full ring-4 ring-white text-white font-bold text-sm shadow-md">
                  {step.step}
                </span>
                <div className="bg-blue-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-all">
                  <h3 className="text-lg font-semibold text-blue-900">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </li>
            ))
          ) : (
            <p className="text-gray-500">Loading roadmap...</p>
          )}
        </ol>
      </section>

      <section className="w-1/2 h-full p-6 bg-white flex flex-col justify-between border-l">
        <div>
          <h2 className="text-2xl font-bold text-blue-900 mb-4">
            Internship & Freelance Finder
          </h2>
          <p className="text-gray-700">
            Discover internship and freelance opportunities to gain real-world
            experience and boost your resume.
          </p>
          <p className="mt-2 text-gray-600 text-sm">
            Uses APIs from LinkedIn, Indeed, Upwork, and Fiverr.
          </p>
        </div>
        <button className="mt-6 bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-6 rounded-lg transition">
          Search Opportunities
        </button>
      </section>
    </div>
  );
}
