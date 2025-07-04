from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.utils import timezone
# Book Model
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
    pages = models.PositiveIntegerField(validators=[MinValueValidator(5),MaxValueValidator(10000)])
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    description = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available')
    count = models.PositiveIntegerField(default=1,validators=[MinValueValidator(0),MaxValueValidator(100)])
    book_cover = models.ImageField(upload_to='book_covers/%y/%m/%d/', null=True, blank=True, default='book_covers/25/05/19/defaultBookCover.jpg')
    added_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='added_books')
    added_date = models.DateTimeField(default=timezone.now)
    borrower = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='borrowed_books')
    borrowed_date = models.DateTimeField(null=True, blank=True)

    def save(self, *args, **kwargs):
        # If status is unavailable, automatically set count to 0
        if self.status == 'unavailable':
            self.count = 0
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

class Admin(models.Model):
    ACCOUNT_TYPE_CHOICES = [
        ('admin', 'Admin'),
        ('user', 'User'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=100)
    created_account_type = models.CharField(max_length=20, choices=ACCOUNT_TYPE_CHOICES, default='user')
    user_type = models.CharField(max_length=20, choices=ACCOUNT_TYPE_CHOICES, default='user')
    
    def __str__(self):
        return self.full_name


