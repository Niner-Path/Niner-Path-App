from django.db import models
from django.contrib.auth.models import AbstractUser

#from core.models import CustomUser

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    is_first_time = models.BooleanField(default=True) 
    has_completed_questionnaire = models.BooleanField(default=False)

    groups = models.ManyToManyField(
        "auth.Group",  
        related_name="custom_user_groups",  
        blank=True 
    )
    
    user_permissions = models.ManyToManyField(
        "auth.Permission",  
        related_name="custom_user_permissions",  
        blank=True  
    )

    USERNAME_FIELD = "email"  
    REQUIRED_FIELDS = ["username"]


class CareerRoadmap(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="career_roadmap")
    career_goal = models.CharField(max_length=255)
    milestones = models.JSONField(default=list)
    completed_milestones = models.JSONField(default=list)


    def __str__(self):
        return f"{self.user.email} - {self.career_goal}"


class CareerTemplate(models.Model):
    career_name = models.CharField(max_length=255, unique=True)
    milestones = models.JSONField(default=list)

    def __str__(self):
        return self.career_name


# JobPreference MODEL ADDED

class JobPreference(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="job_preference")
    keywords = models.JSONField(default=list)
    location = models.JSONField(default=list)

    def __str__(self):  
        return f"{self.user.email}: {self.keywords} - {self.location}"     

