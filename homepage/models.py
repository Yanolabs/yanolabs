from django.db import models

class Partner(models.Model):
    name = models.CharField(max_length=100)
    role = models.CharField(max_length=100)
    quote = models.TextField()
    image = models.URLField(blank=True, null=True)

    def __str__(self):
        return f"{self.name} – {self.role}"

