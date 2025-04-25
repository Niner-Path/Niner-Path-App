from fastapi import FastAPI
from ninerpath_ai.roadmap_ai import generate_roadmap_with_groq
from schemas import RoadmapRequest, RoadmapResponse, RoadmapStep
from dotenv import load_dotenv

load_dotenv()
app = FastAPI()

@app.get("/")
def home():
    return {"message": "Welcome to the NinerPath AI API!"}

@app.post("/generate-roadmap", response_model=RoadmapResponse)
def generate_roadmap(data: RoadmapRequest):
    career_goal, steps = generate_roadmap_with_groq(
        major=data.major,
        concentration=data.concentration,
        current_skills=data.current_skills,
        interests=data.interests
    )

    return RoadmapResponse(
        career_goal=career_goal,
        roadmap=steps
    )
