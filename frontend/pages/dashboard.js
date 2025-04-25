import { useEffect, useState } from "react";

export default function Dashboard() {
  const [roadmap, setRoadmap] = useState([]);

  useEffect(() => {
    async function fetchRoadmap() {
      const token = localStorage.getItem("token");

      const res = await fetch("http://127.0.0.1:8000/career-roadmap/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        const formattedRoadmap = data.milestones.map((item, idx) => ({
          step: idx + 1,
          title: item.title || `Step ${idx + 1}`,
          description: item.description || "",
        }));
        setRoadmap(formattedRoadmap);
      }
    }

    fetchRoadmap();
  }, []);

  return (
    <div className="grid grid-cols-2 gap-6 h-full">
      {/* Career Roadmap Section */}
      <section className="bg-white p-6 rounded-lg shadow-md overflow-y-auto max-h-[100vh]">
        <h3 className="text-xl font-bold mb-4">Personalized Career Roadmap</h3>
        <div className="space-y-4">
          {roadmap.length > 0 ? (
            roadmap.map((step) => (
              <div key={step.step} className="p-4 border rounded-lg shadow-sm">
                <h4 className="font-semibold">{`Step ${step.step}: ${step.title}`}</h4>
                <p className="text-gray-600 text-sm mt-2">{step.description}</p>
              </div>
            ))
          ) : (
            <p>Loading roadmap...</p>
          )}
        </div>
      </section>

      {/* Internship Finder Section */}
      <section className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold mb-4">
            Side Hustle & Internship Finder
          </h3>
          <p>Matches students to relevant internships and freelance gigs.</p>
          <p className="mt-2">
            Helps gain industry experience while earning extra income.
          </p>
          <p className="mt-2">
            Searches APIs like LinkedIn, Indeed, Fiverr, and Upwork.
          </p>
        </div>
        <div className="mt-6">
          {/* You can add buttons or links here */}
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded">
            Search Opportunities
          </button>
        </div>
      </section>
    </div>
  );
}
