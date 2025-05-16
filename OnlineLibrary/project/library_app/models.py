from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
from django.core.exceptions import ValidationError

def validate_numeric(value):
    if not value.isdigit():
        raise ValidationError('ISBN must contain only numbers')

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
    ISBN = models.CharField(max_length=15, unique=True, validators=[validate_numeric])
    pages = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    description = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available')
    count = models.PositiveIntegerField(default=1,validators=[MinValueValidator(1),MaxValueValidator(100)])
    cover_image = models.ImageField(upload_to='book_covers/%y/%m/%d/', null=True, blank=True, default='static/img/defaultBookCover.jpg')
    #added_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    added_date = models.DateTimeField(default=timezone.now)
    
    def __str__(self):
        return self.title
    
        

