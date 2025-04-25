import os
from dotenv import load_dotenv
from openai import OpenAI
from ninerpath_ai.schemas import RoadmapStep

load_dotenv()

client = OpenAI(
    api_key=os.getenv("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1"
)

def generate_roadmap_with_groq(major, concentration, current_skills=None, interests=None):
    current_skills = current_skills or []
    interests = interests or []

    skills_text = ", ".join(current_skills) if current_skills else "None"
    interests_text = ", ".join(interests) if interests else "None"

    prompt = f"""
You are building a 12–15 step "mini-course" roadmap for a college student, focusing on practical, resume-ready skills and projects tailored to their background.

The student’s info:

- Major: {major}
- Concentration: {concentration}
- Current skills: {skills_text}
- Areas of interest: {interests_text}

They want to use the next few semesters in college to grow their expertise, build an impressive portfolio, and prepare for internships or entry-level roles.

---

### RULES

1. Each step should feel like a **module** in a personalized self-paced course.
2. Provide:
   - **Step #**
   - **Title** (1 line)
   - **Description** (1–2 sentences) that includes:
     - Timeframe (e.g., "1–2 weeks")
     - Real tools, techniques, or tutorials to use (e.g., "React docs", "Coursera course", "SurveyMonkey", "Excel")
     - A concrete task or deliverable
3. Avoid vague, academic, or repetitive steps. Don't mention "write a research paper" unless the student is clearly advanced or planning for grad school.
4. Include at least 1–2 **portfolio-building projects**, internships, or certifications.
5. Only suggest **coding, AI, or ML** topics (like Python, LLMs, etc.) if the student has listed them in current skills or interests. Otherwise, avoid technical overreach.
6. The final step should be a **capstone** project that integrates their skills into a resume-worthy outcome (e.g., a portfolio site, case study, client solution, or research proposal).

---

### FEW-SHOT EXAMPLES (STYLE WE WANT)

**Step 1**  
**Master React Fundamentals**  
Spend 1–2 weeks learning React basics like JSX, props, and component structure. Use the official React docs (reactjs.org/docs) and tutorials on freeCodeCamp.

**Step 2**  
**Build a Simple React To-Do App**  
Take 1 week to build a to-do app using React hooks (useState, useEffect). Focus on clean component structure. Reference React’s hook documentation and freeCodeCamp challenges.

---

**Step 1**  
**Human Anatomy Deep Dive**  
Spend 1–2 weeks studying body systems using online resources like TeachMeAnatomy and Kenhub. Focus on foundational understanding of the nervous, cardiovascular, and muscular systems.

**Step 2**  
**Intro to Clinical Research Design**  
Take 1–2 weeks to study clinical trial phases, ethics, and IRB protocol using NIH’s "Basics of Clinical Research" guide and Coursera’s medical research methods course.

---

(NOW END OF EXAMPLES — continue steps 3 to 15 using this same style, based on the student's actual info.)

---

Your mission: Generate exactly 12–15 steps. No motivational fluff, no disclaimers. Just practical, properly formatted roadmap steps as shown above.

"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7
    )

    content = response.choices[0].message.content
    print("LLM response:\n", content)

    steps = []
    for idx, line in enumerate(content.strip().split("\n")):
        if not line.strip():
            continue
        if line[0].isdigit():
            parts = line.split(".", 1)
            if len(parts) != 2:
                continue
            title_desc = parts[1].strip().split(":", 1)
            if len(title_desc) == 2:
                title, desc = title_desc
            else:
                title, desc = title_desc[0], ""
            steps.append(RoadmapStep(step=idx + 1, title=title.strip(), description=desc.strip()))

    return f"Skill Roadmap for {concentration.title()}", steps
