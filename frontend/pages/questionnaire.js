import { useState } from "react";
import { useRouter } from "next/router";

export default function Questionnaire() {
  const [careerGoals, setCareerGoals] = useState("");
  const [skills, setSkills] = useState("");
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("You are not authenticated. Please log in.");
      return;
    }

    const response = await fetch(
      "http://127.0.0.1:8000/update-questionnaire/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
      }
    );

    const data = await response.json();
    if (response.ok) {
      router.push("/dashboard");
    } else {
      alert(`Something went wrong: ${data.error || "Try again."}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 shadow-lg rounded-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center">
          Tell us about yourself
        </h1>
        <p className="text-gray-500 text-center mb-6">
          This helps us customize your experience.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">
              What are your career goals?
            </label>
            <textarea
              className="w-full px-3 py-2 border rounded"
              value={careerGoals}
              onChange={(e) => setCareerGoals(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">
              What skills do you have?
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gold text-white py-2 px-4 rounded hover:bg-yellow-600"
          >
            Continue to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
