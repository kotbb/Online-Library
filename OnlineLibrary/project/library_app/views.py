from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.contrib import messages
from .models import Book
from .forms import BookForm, UserRegisterForm, UserLoginForm
import json
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required


# Pages
def home(request):
    current_path = request.path.strip('/')
    context = {
        'current_path': current_path
    }
    return render(request,'home.html',context)

@login_required
def profile(request):
    current_path = request.path.strip('/')
    context = {
        'current_path': current_path
    }
    return render(request,'profile.html',context)

@login_required
def admin_dashboard(request):
    current_path = request.path.strip('/')
    books = Book.objects.all()
    context = {
        'current_path': current_path,
        'books': books
    }
    if not request.user.is_staff:
        messages.error(request, 'You do not have permission to access this page.')
        return redirect('home')
    return render(request, 'adminPages/admin-dashboard.html')

@require_POST
def toggle_theme(request):

    current_theme = request.session.get('theme','light')
    new_theme = 'dark'
    if current_theme == 'dark':
        new_theme = 'light'
    request.session['theme'] = new_theme
    request.session.modified = True
    return JsonResponse({'status': 'success', 'theme': new_theme})

#--------------------------------
def add_book(request):
    if request.method == 'POST':
        form = BookForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            messages.success(request, 'Book added successfully!')
            return redirect('admin_dashboard')
        else:
            messages.error(request, 'Error adding book. Please check the form data.')
            return render(request, 'adminPages/AddBook.html', {
                'form': form,
                'is_admin_page': True
            })
    else:
        form = BookForm()
        return render(request, 'adminPages/AddBook.html', {
            'form': form,
            'is_admin_page': True
        })

def edit_book(request, book_id):
    try:
        book = Book.objects.get(id=book_id)
        if request.method == 'POST':
            form = BookForm(request.POST, request.FILES, instance=book)
            if form.is_valid():
                form.save()
                messages.success(request, f'Book "{book.title}" updated successfully!')
                return redirect('admin_dashboard')
            else:
                messages.error(request, 'Error updating book. Please check the form data.')
        else:
            form = BookForm(instance=book)
        return render(request, 'adminPages/EditBook.html', {
            'form': form,
            'book': book,
            'is_admin_page': True
        })
    except Book.DoesNotExist:
        messages.error(request, 'Book not found.')
        return redirect('admin_dashboard')

@require_POST
def delete_book(request, book_id):
    try:
        book = Book.objects.get(id=book_id)
        book_title = book.title
        book.delete()
        messages.success(request, f'Book "{book_title}" has been deleted successfully.')
    except Book.DoesNotExist:
        messages.error(request, 'Book not found.')
    except Exception as e:
        messages.error(request, f'Error deleting book: {str(e)}')
    return redirect('admin_dashboard')

@require_POST
def delete_all_books(request):
    try:    
        count = Book.objects.count()
        Book.objects.all().delete()
        messages.success(request, f'{count} deleted books sccessfully.')
    except Exception as e:
        messages.error(request, f'Error deleting all books: {str(e)}')
    return redirect('admin_dashboard')
def view_available(request):
    books = Book.objects.filter(status='available')
    context = {
        'books': books,
        'is_admin_page': True
    }
    return render(request, 'adminPages/view-available.html', context)


#--------------------------------
# User Registration
#--------------------------------
# sign up
def sign_up(request):
    if request.user.is_authenticated:
        return redirect('home')
        
    if request.method == 'POST':
        form = UserRegisterForm(request.POST)
        if form.is_valid():
            user = form.save()
            username = form.cleaned_data.get('username')
            messages.success(request, f'Account created for {username}! You can now log in.')
            login(request, user)
            return redirect('home')
    else:
        form = UserRegisterForm()
    
    return render(request, 'registration/sign-up.html', {'form': form})

#--------------------------------
# User Login and Logout
#--------------------------------
def user_login(request):
    if request.user.is_authenticated:
        return redirect('home')
        
    if request.method == 'POST':
        form = UserLoginForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(request, username=username, password=password)
            
            if user is not None:
                login(request, user)
                messages.success(request, f'Welcome back, {username}!')
                if user.is_staff:
                    return redirect('admin_dashboard')
                return redirect('home')
        else:
            messages.error(request, 'Invalid username or password.')
    else:
        form = UserLoginForm()
            
    return render(request, 'registration/login.html', {'form': form})

def user_logout(request):
    logout(request)
    messages.success(request, 'You have been logged out successfully!')
    return redirect('home')
