from django.contrib.auth import login, logout, get_user_model
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.views import APIView
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from .models import JobPreference
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.generics import get_object_or_404
import requests
from django.conf import settings

from django.shortcuts import render

from rest_framework.generics import get_object_or_404
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer, CareerRoadmapSerializer
from .models import CareerRoadmap, CareerTemplate
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
import sys
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ROOT_DIR = os.path.dirname(BASE_DIR)  
sys.path.append(ROOT_DIR)

from ninerpath_ai.roadmap_ai import generate_roadmap_with_groq
from ninerpath_ai.schemas import RoadmapStep


User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        user = User.objects.get(email=request.data["email"])

        return Response(
            {
                "message": "Registration successful",
                "user": UserSerializer(user).data,
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    permission_classes = [AllowAny]

    @method_decorator(csrf_exempt)
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

    def post(self, request):
        print(request) #TEST
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            login(request, user)

            token, _ = Token.objects.get_or_create(user=user)

            return Response(
                {
                    "message": "Login successful",
                    "has_completed_questionnaire": user.has_completed_questionnaire,
                    "user": UserSerializer(user).data,
                    "token": token.key,
                },
                status=status.HTTP_200_OK,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@method_decorator(csrf_exempt, name='dispatch')
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response({"message": "Logged out"}, status=status.HTTP_200_OK)


class UpdateQuestionnaireView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.is_anonymous:
            return Response(
                {"error": "User is not authenticated"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        career_goal = request.data.get("careerGoals")
        if not career_goal:
            return Response({"error": "Career goal is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            template = CareerTemplate.objects.get(career_name=career_goal)
        except CareerTemplate.DoesNotExist:
            return Response({"error": "No matching career template found"}, status=status.HTTP_404_NOT_FOUND)

        roadmap, created = CareerRoadmap.objects.get_or_create(
            user=request.user,
            defaults={
                "career_goal": template.career_name,
                "milestones": template.milestones,
            }
        )

        request.user.has_completed_questionnaire = True
        request.user.save()

        return Response(
            {
                "message": "Questionnaire updated successfully",
                "roadmap": CareerRoadmapSerializer(roadmap).data,
            },
            status=status.HTTP_200_OK,
        )

@method_decorator(csrf_exempt, name='dispatch')
class CareerRoadmapView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        roadmap = CareerRoadmap.objects.filter(user=request.user).first()
        if roadmap:
            serializer = CareerRoadmapSerializer(roadmap)
            return Response(serializer.data)
        else:
            return Response({"milestones": [], "message": "No roadmap found"}, status=status.HTTP_200_OK)


    def post(self, request):
        if CareerRoadmap.objects.filter(user=request.user).exists():
            return Response({"error": "Career roadmap already exists"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = CareerRoadmapSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        roadmap = get_object_or_404(CareerRoadmap, user=request.user)
        serializer = CareerRoadmapSerializer(roadmap, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        roadmap = get_object_or_404(CareerRoadmap, user=request.user)
        roadmap.delete()
        return Response({"message": "Career roadmap deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

class GenerateRoadmapFromQuestionnaireView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        data = request.data

        major = data.get("major")
        concentration = data.get("concentration")
        skills = data.get("current_skills", [])
        interests = data.get("interests", [])

        if not major or not concentration:
            return Response({"error": "Major and concentration are required."}, status=status.HTTP_400_BAD_REQUEST)

        career_goal, steps = generate_roadmap_with_groq(major, concentration, current_skills=skills, interests=interests)

        roadmap, created = CareerRoadmap.objects.update_or_create(
            user=user,
            defaults={
                "career_goal": career_goal,
                "milestones": [step.dict() for step in steps],
                "completed_milestones": [],
            }
        )

        user.has_completed_questionnaire = True
        user.save()

        return Response({
            "message": "Roadmap generated and saved.",
            "career_goal": career_goal,
            "roadmap": roadmap.milestones,
        }, status=status.HTTP_201_CREATED)


@method_decorator(csrf_exempt, name='dispatch')
class JobPreferenceView(APIView):  
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        print(user)  #TEST

        try:
            job_preference = JobPreference.objects.filter(user=user) 
            if not job_preference.exists():
                return Response({"error": "No job listings found"}, status=status.HTTP_404_NOT_FOUND)
            serializer = JobPreferenceSerializer(job_preference, many=True)  
            return Response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)  

    def post(self, request):
            if JobPreference.objects.filter(user=request.user).exists():
                return Response({"error": "Job preference already exists"}, status=status.HTTP_400_BAD_REQUEST)

            serializer = JobPreferenceSerializer(data=request.data, context={"request": request})
            if serializer.is_valid():
                serializer.save(user=request.user)
                
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        jobpreference = get_object_or_404(JobPreference, user=request.user)
        serializer = JobPreferenceSerializer(jobpreference, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        jobpreference = get_object_or_404(JobPreference, user=request.user)
        jobpreference.delete()
        return Response({"message": "Job preference deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    

@method_decorator(csrf_exempt, name='dispatch')
class JobListingView(APIView): 
    permission_classes = [IsAuthenticated]

    def get(self, request):

        country = "us"
        #keyword = "Software Engineer"
        #location = "North Carolina"
        results = 10

        user = request.user
        print(user)  #TEST

        try:
            job_preference = JobPreference.objects.get(user=user) 
            keywords = job_preference.keywords
            location = job_preference.location
            if not job_preference:
                return Response({"error": "No job preference found"}, status=status.HTTP_404_NOT_FOUND)
            serializer = JobPreferenceSerializer(job_preference)  
            print(serializer)   # TEST
           # return Response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR) 
        


        if not settings.ADZUNA_APP_ID or not settings.ADZUNA_API_KEY:
            return Response("error Adzuna API credentials are not set")
        
        base_url = f"https://api.adzuna.com/v1/api/jobs/{country}/search/1"

        params = {
        "app_id": settings.ADZUNA_APP_ID,
        "app_key": settings.ADZUNA_API_KEY,
        "what": keywords,
        "where": location,
        "results_per_page": results,
        "content-type": "application/json"
        }
        
        try:
            response = requests.get(base_url, params=params)
            if response.status_code != 200:
                return Response(f"error Failed to fetch data from Adzuna: {response.status_code}")
            data = response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error fetching data from Adzuna API: {e}")

        if "results" not in data:
            return Response("error Unknown error from Adzuna API")
        
        job_list = []
        for job in data["results"]:
            job_info = {
                "title": job.get("title"),
                "company": job.get("company", {}).get("display_name"),
                "location": job.get("location", {}).get("display_name"),
                "description": job.get("description")
            }
            job_list.append(job_info)

        return Response(job_list)