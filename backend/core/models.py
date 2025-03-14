from django.contrib.auth.models import AbstractUser
from django.db import models

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
