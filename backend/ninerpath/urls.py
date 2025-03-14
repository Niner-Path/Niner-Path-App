from core.views import RegisterView, LoginView, LogoutView, UpdateQuestionnaireView
from django.contrib import admin
from django.urls import path, include
from django.shortcuts import redirect  

NEXTJS_AUTH_URL = "http://localhost:3000/login"

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('update-questionnaire/', UpdateQuestionnaireView.as_view(), name='update-questionnaire'),
    path('', lambda request: redirect(NEXTJS_AUTH_URL, permanent=True)),
]
