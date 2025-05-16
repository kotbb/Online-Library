from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.auth.models import User
# Book Model
class Book(models.Model):
    CATEGORY_CHOICES = [
        ('fiction', 'Fiction'),
        ('non-fiction', 'Non-Fiction'),
        ('mystery', 'Mystery'),
        ('fantasy', 'Fantasy'),
        ('science-fiction', 'Science Fiction'),
        ('biography', 'Biography'),
        ('history', 'History'),
        ('romance', 'Romance'),
        ('biology', 'Biology'),  
        ('genetics', 'Genetics'),
        ('self-improvement', 'Self-Improvement'),
        ('personal-development', 'Personal-Development'),
        ('other', 'Other')
    ]

    STATUS_CHOICES = [
        ('available', 'Available'),
        ('unavailable', 'Unavailable'),
    ]
    title = models.CharField(max_length=200)
    author = models.CharField(max_length=100)
    ISBN = models.CharField(max_length=20, unique=True)
    pages = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    description = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available')
    count = models.PositiveIntegerField(default=1,validators=[MinValueValidator(1),MaxValueValidator(100)])
    #cover_image = models.ImageField(upload_to='book_covers/', null=True, blank=True)
    #added_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    added_date = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.title

class Admin(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=100)
    def __str__(self):
        return self.full_name


