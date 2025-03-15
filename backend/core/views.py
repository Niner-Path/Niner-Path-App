from django.contrib.auth import login, logout, get_user_model
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer, CareerRoadmapSerializer
from .models import CareerRoadmap

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

class CareerRoadmapView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        try:
            roadmap = CareerRoadmap.objects.get(user=user)
            serializer = CareerRoadmapSerializer(roadmap)
            return Response(serializer.data)
        except CareerRoadmap.DoesNotExist:
            return Response({"error": "No roadmap found"}, status=404)

class CareerRoadmapDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        user = request.user
        try:
            roadmap = CareerRoadmap.objects.get(user=user)
            roadmap.delete()
            return Response({"message": "Career roadmap deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except CareerRoadmap.DoesNotExist:
            return Response({"error": "No career roadmap found"}, status=status.HTTP_404_NOT_FOUND)


class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response({"message": "Logged out"}, status=status.HTTP_200_OK)
