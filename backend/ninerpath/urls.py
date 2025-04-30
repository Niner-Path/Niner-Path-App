<<<<<<< HEAD
from django.contrib import admin
from django.urls import path, include
from django.shortcuts import redirect  
from core.views import RegisterView, LoginView, LogoutView, UpdateQuestionnaireView, CareerRoadmapView
from core.views import GenerateRoadmapFromQuestionnaireView
=======
from core.views import RegisterView, LoginView, LogoutView, UpdateQuestionnaireView, JobPreferenceView, JobListingView
from django.contrib import admin
from django.urls import path, include
from django.shortcuts import redirect  
from core import views
>>>>>>> origin/job-finder

NEXTJS_AUTH_URL = "http://localhost:3000/login"

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),

    path('update-questionnaire/', UpdateQuestionnaireView.as_view(), name='update-questionnaire'),

    path('career-roadmap/', CareerRoadmapView.as_view(), name='career-roadmap'),  

    path('api-auth/', include('rest_framework.urls')),  

    path('generate-roadmap-from-questionnaire/', GenerateRoadmapFromQuestionnaireView.as_view(), name='generate-roadmap-from-questionnaire'),

    path('', lambda request: redirect(NEXTJS_AUTH_URL, permanent=True)),

    # Job preference view
    path('job-preference/', JobPreferenceView.as_view(), name='job-preference'),

    # Job listing view
    path('job-listings/', JobListingView.as_view(), name='job-listing'),

]
