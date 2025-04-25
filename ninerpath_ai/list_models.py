import os
from dotenv import load_dotenv
load_dotenv()

from openai import OpenAI

client = OpenAI(
    api_key=os.getenv("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1"
)

def list_groq_models():
    resp = client.models.list()
    return resp

if __name__ == "__main__":
    available_models = list_groq_models()
    print(available_models)
