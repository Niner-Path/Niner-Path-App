from django.db import models

class Major(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    salary_avg = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name