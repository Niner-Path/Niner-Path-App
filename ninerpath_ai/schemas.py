from pydantic import BaseModel
from typing import List

class RoadmapRequest(BaseModel):
    major: str
    concentration: str
    current_skills: List[str] = []
    interests: List[str] = []

class RoadmapStep(BaseModel):
    step: int
    title: str
    description: str

class RoadmapResponse(BaseModel):
    career_goal: str
    roadmap: List[RoadmapStep]
