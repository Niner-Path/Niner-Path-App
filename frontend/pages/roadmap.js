export default function Roadmap() {
  const steps = [
    {
      title: "Explore & Learn",
      description:
        "Intro to CS, basic programming, explore interests (AI, web, cybersecurity, etc.)",
      duration: "Freshman Year",
    },
    {
      title: "Build Foundations",
      description: "Data structures, algorithms, OOP, start GitHub portfolio",
      duration: "Sophomore Year",
    },
    {
      title: "Internship / Projects",
      description:
        "Apply for internships, build real-world apps, open-source contributions",
      duration: "Summer or Junior Year",
    },
    {
      title: "Specialize & Network",
      description:
        "Focus on a domain, attend hackathons, grow LinkedIn and resume",
      duration: "Junior Year",
    },
    {
      title: "Capstone & Career Prep",
      description:
        "Capstone project, resume refinement, mock interviews, career fairs",
      duration: "Senior Year",
    },
    {
      title: "Entry-Level Role",
      description:
        "Junior Developer, QA Engineer, Data Analyst — contribute to real teams",
      duration: "0–2 Years",
    },
    {
      title: "Advance & Lead",
      description:
        "Promote to mid/senior role, lead small projects, mentor interns",
      duration: "2–5 Years",
    },
  ];

  return (
    <div className="bg-white min-h-screen py-12 px-4">
      <h1 className="text-4xl font-bold text-center text-blue-900 mb-12">
        Computer Science Career Roadmap
      </h1>

      <div className="flex flex-wrap justify-center gap-10 max-w-6xl mx-auto">
        {steps.map((step, index) => (
          <div
            key={index}
            className="w-[250px] flex flex-col items-center text-center relative"
          >
            <div className="bg-yellow-500 text-white font-bold rounded-full w-12 h-12 flex items-center justify-center shadow-lg z-10 mb-4">
              {index + 1}
            </div>

            <div className="bg-blue-900 text-white p-4 rounded-xl w-full shadow-lg">
              <h2 className="font-semibold text-lg">{step.title}</h2>
              <p className="text-sm">{step.description}</p>
              <p className="mt-2 text-xs text-yellow-300">{step.duration}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
