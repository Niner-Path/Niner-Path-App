from django.contrib import admin
from django.urls import path, include
from django.shortcuts import redirect  
from core.views import RegisterView, LoginView, LogoutView, UpdateQuestionnaireView, CareerRoadmapView, CareerRoadmapDeleteView

NEXTJS_AUTH_URL = "http://localhost:3000/login"

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),

    path('update-questionnaire/', UpdateQuestionnaireView.as_view(), name='update-questionnaire'),

    path('career-roadmap/', CareerRoadmapView.as_view(), name='career-roadmap'),  
    path('career-roadmap/delete/', CareerRoadmapDeleteView.as_view(), name='career-roadmap-delete'), 

    path('api-auth/', include('rest_framework.urls')),  

    path('', lambda request: redirect(NEXTJS_AUTH_URL, permanent=True)),
]
