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


# GETJOBLISTING MODEL ADDED

class GetJobListings(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="get_job_listings")
    keywords = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    def __str__(self):  
        return f"{self.user.email}: {self.keywords} - {self.location}"     


"""class GetJobListings(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name="get-job-listings")
    job_id = models.CharField(max_length=255)
    job_url = models.URLField(max_length=500)
    job_postdate = models.DateField()
    job_description = models.TextField()
    job_salary = models.CharField(max_length=255, blank=True, null=True)
  
    def __str__(self):
        return f"{self.user.email} - Job ID: {self.job_id}"       """
