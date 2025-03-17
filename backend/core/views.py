from django.contrib.auth import login, logout, get_user_model
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.views import APIView
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer, JobPreferenceSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from .models import JobPreference

from django.shortcuts import render


User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        user = User.objects.get(email=request.data["email"])
        login(request, user)

        token, _ = Token.objects.get_or_create(user=user)
        return Response(
            {
                "message": "Registration successful",
                "user": UserSerializer(user).data,
                "token": token.key,
            },
            status=status.HTTP_201_CREATED,
        )

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
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


class UpdateQuestionnaireView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.is_anonymous:
            return Response(
                {"error": "User is not authenticated"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        user = request.user
        user.has_completed_questionnaire = True
        user.save()
        return Response({"message": "Questionnaire updated successfully"}, status=status.HTTP_200_OK)


class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response({"message": "Logged out"}, status=status.HTTP_200_OK)



class JobPreferenceView(APIView):  
    #permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        try:
            job_preference = JobPreference.objects.filter(user=user) 
            if not job_preference.exists():
                return Response({"error": "No job listings found"}, status=status.HTTP_404_NOT_FOUND)
            serializer = JobPreferenceSerializer(job_preference, many=True)  
            return Response(serializer.data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)  

    def post(self, request):
        user = request.user
        data = request.data.copy()
        data['user'] = user.id

        serializer = JobPreferenceSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        user = request.user        
        serializer = JobPreferenceSerializer(data=data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)