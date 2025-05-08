import { useEffect, useState } from "react";

export default function Dashboard() {
  const [roadmap, setRoadmap] = useState([]);
  const [token, setToken] = useState(null);

  const [keyword, setKeyword] = useState("");
  const [locationTerm, setLocationTerm] = useState("");
  const [internships, setInternships] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [searchError, setSearchError] = useState("");

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) setToken(t);
    else alert("You are not authenticated. Please log in.");
  }, []);

  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:8000/career-roadmap/", {
      headers: { Authorization: `Token ${token}` },
    })
      .then((res) => res.json())
      .then((data) =>
        setRoadmap(
          data.milestones.map((item, idx) => ({
            step: idx + 1,
            title: item.title || `Step ${idx + 1}`,
            description: item.description || "",
          }))
        )
      );
  }, [token]);

  const handleSearch = async () => {
    if (!keyword.trim() && !locationTerm.trim()) {
      return setSearchError("Enter keywords or a location to search.");
    }

    setLoadingSearch(true);
    setSearchError("");

    let query = "?";
    if (keyword.trim()) query += `what=${encodeURIComponent(keyword.trim())}`;
    if (locationTerm.trim()) {
      if (query.length > 1) query += "&";
      query += `where=${encodeURIComponent(locationTerm.trim())}`;
    }

    try {
      const res = await fetch(`http://localhost:8000/job-listings/${query}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      });
      if (!res.ok) throw new Error(`Search failed (${res.status})`);
      const data = await res.json();
      setInternships(data);
    } catch (err) {
      setSearchError(err.message);
    } finally {
      setLoadingSearch(false);
    }
  };

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

      <section className="w-1/2 h-full overflow-y-auto p-6 bg-gray-50">
        <h2 className="text-2xl font-bold mb-4">Internship Finder</h2>

        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Keyword (e.g. Software)"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none"
          />
          <input
            type="text"
            placeholder="Location (e.g. Concord)"
            value={locationTerm}
            onChange={(e) => setLocationTerm(e.target.value)}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none"
          />
          <button
            onClick={handleSearch}
            disabled={loadingSearch}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loadingSearch ? "Searching..." : "Search"}
          </button>
        </div>

        {searchError && <p className="text-red-500 mb-4">{searchError}</p>}

        {loadingSearch ? (
          <p>Loading results…</p>
        ) : internships.length === 0 ? (
          <p className="text-gray-600">
            No internships found. Try different keywords or location.
          </p>
        ) : (
          <ul className="space-y-4">
            {internships.map((job, idx) => (
              <li
                key={idx}
                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold">{job.title}</h3>
                <p className="text-sm text-gray-700">
                  {job.company} — {job.location}
                </p>
                <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                  {job.description}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
