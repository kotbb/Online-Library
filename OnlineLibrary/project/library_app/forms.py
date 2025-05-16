from django import forms
from django.contrib.auth.models import User
from .models import Book
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm

class BookForm(forms.ModelForm):
    class Meta:
        model = Book
        fields = '__all__'
        exclude = ['added_by','added_date']
        widgets = {
            'ISBN': forms.TextInput(attrs={
                'pattern': '[0-9]+',
                'title': 'ISBN must contain only numbers',
                'oninput': 'this.value = this.value.replace(/[^0-9]/g, "")'
            }),
            'description': forms.Textarea(attrs={'rows': 4}),
            'cover_image': forms.FileInput(attrs={'accept': 'image/*'}),
        }

class UserRegisterForm(UserCreationForm):
    username = forms.CharField(widget=forms.TextInput(attrs={
        'class': 'form-control',
        'placeholder': 'Enter your username'
    }))
    email = forms.EmailField(widget=forms.EmailInput(attrs={
        'class': 'form-control',
        'placeholder': 'Enter your email'
    }))
    password1 = forms.CharField(widget=forms.PasswordInput(attrs={
        'class': 'form-control',
        'placeholder': 'Enter your password'
    }))
    password2 = forms.CharField(widget=forms.PasswordInput(attrs={
        'class': 'form-control',
        'placeholder': 'Confirm your password'
    }))
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2']

class UserLoginForm(AuthenticationForm):
    username = forms.CharField(label='Username', widget=forms.TextInput(attrs={
        'class': 'form-control',
        'placeholder': 'Enter your username'
    }))
    password = forms.CharField(widget=forms.PasswordInput(attrs={
        'class': 'form-control',
        'placeholder': 'Enter your password'
    }))
    
    class Meta:
        model = User
        fields = ['username', 'password']

