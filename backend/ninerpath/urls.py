from django.contrib import admin
from django.urls import path, include
from django.shortcuts import redirect  
from core.views import (
    RegisterView,
    LoginView,
    LogoutView,
    UpdateQuestionnaireView,
    CareerRoadmapView,
    GenerateRoadmapFromQuestionnaireView,
    JobPreferenceView,
    JobListingView,
)

NEXTJS_AUTH_URL = "http://localhost:3000/login"

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),

    path('update-questionnaire/', UpdateQuestionnaireView.as_view(), name='update-questionnaire'),
    path('career-roadmap/', CareerRoadmapView.as_view(), name='career-roadmap'),
    path('generate-roadmap-from-questionnaire/', GenerateRoadmapFromQuestionnaireView.as_view(), name='generate-roadmap-from-questionnaire'),

    path('job-preference/', JobPreferenceView.as_view(), name='job-preference'),
    path('job-listings/', JobListingView.as_view(), name='job-listing'),

    path('api-auth/', include('rest_framework.urls')),

    path('', lambda request: redirect(NEXTJS_AUTH_URL, permanent=True)),
]
