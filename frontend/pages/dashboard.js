export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Career Roadmap */}
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold">Personalized Career Roadmap</h3>
        <p>AI generates a step-by-step plan based on major and career goals.</p>
        <p>
          Tracks progress through milestones like learning skills, internships,
          and certifications.
        </p>
        <p>
          Users can check off completed tasks and get recommendations for next
          steps.
        </p>
      </section>

      {/* Internship Finder */}
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold">
          Side Hustle & Internship Finder
        </h3>
        <p>Matches students to relevant internships and freelance gigs.</p>
        <p>Helps gain industry experience while earning extra income.</p>
        <p>Searches APIs like LinkedIn, Indeed, Fiverr, Upwork.</p>
      </section>
    </div>
  );
}
