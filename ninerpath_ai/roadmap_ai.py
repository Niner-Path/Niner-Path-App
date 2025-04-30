# roadmap_ai.py
import os
from dotenv import load_dotenv
from openai import OpenAI
from schemas import RoadmapStep

load_dotenv()

client = OpenAI(
    api_key=os.getenv("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1"
)

def generate_roadmap_with_groq(major, concentration):
    prompt = f"""
You're a technical mentor helping a student majoring in '{major}' with a concentration in '{concentration}'.

Your task is to generate a personalized **step-by-step skill-building roadmap** (10–12 steps) that will help the student become proficient in this concentration.

Requirements:
- Each step must be a **clear milestone** the student can mark as completed.
- Use a consistent format:
  - Step number.
  - **Title** (e.g., "Learn Python Basics")
  - **1–2 sentence Description** explaining what to learn or do.
- Organize the steps in **logical learning order**, from beginner to advanced.

Do NOT include any career recommendations or motivational language — just the roadmap steps.
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

    return "Skill Roadmap for " + concentration.title(), steps
