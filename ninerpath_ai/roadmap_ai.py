import os
import re
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

1. Each step should feel like a module in a personalized self-paced course.
2. Provide:
   - Step #
   - Title (1 line)
   - Description (1–2 sentences) that includes:
     - Timeframe
     - Real tools, techniques, or tutorials
     - A concrete task or deliverable
3. Avoid vague, academic, or repetitive steps.
4. Include at least 1–2 portfolio-building projects, internships, or certifications.
5. Only suggest coding, AI, or ML topics if the student has listed them.
6. The final step should be a capstone project.

---

### FEW-SHOT EXAMPLES (STYLE WE WANT)

**Step 1**  
**Master React Fundamentals**  
Spend 1–2 weeks learning React basics like JSX, props, and component structure. Use the official React docs and freeCodeCamp.

**Step 2**  
**Build a Simple React To-Do App**  
Take 1 week to build a to-do app using React hooks. Reference React’s documentation.

---

(Now continue steps 3 to 15 using the same format, based on the student’s actual input.)
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7
    )

    content = response.choices[0].message.content
    print("LLM raw response:\n", content)

    pattern = r"\*\*Step (\d+)\*\*\s*\n\*\*(.*?)\*\*\s*\n(.*?)\n(?=\*\*Step|\Z)"
    matches = re.findall(pattern, content, re.DOTALL)

    steps = []
    for match in matches:
        step_num = int(match[0])
        title = match[1].strip()
        desc = match[2].strip()
        steps.append(RoadmapStep(step=step_num, title=title, description=desc))

    print("Parsed steps:", steps)
    return f"Skill Roadmap for {concentration.title()}", steps
