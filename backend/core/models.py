from django.contrib.auth.models import AbstractUser
from django.db import models
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

    def __str__(self):
        return self.email


# JobPreference MODEL ADDED

class JobPreference(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="job_preference")
    keywords = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    
    def __str__(self):  
        return f"{self.user.email}: {self.keywords} - {self.location}"     

