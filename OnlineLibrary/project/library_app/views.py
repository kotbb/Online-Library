from django.shortcuts import redirect, render
from .models import Admin
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.http import require_POST
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from .models import Book
from .forms import BookForm
from django.http import JsonResponse
from django.utils import timezone
from django.shortcuts import get_object_or_404

def home(request):
    current_path = request.path.strip('/')
    context = {
        'current_path': current_path,
        'is_main_pages': True
    }
    return render(request,'home.html',context)

def profile(request):
    current_path = request.path.strip('/')
    user_type = "user"
    created_account_type = "user"
    
    if Admin.objects.filter(user=request.user).exists():
        admin_profile = Admin.objects.get(user=request.user)
        user_type = admin_profile.user_type
        created_account_type = admin_profile.created_account_type
    
    context = {
        'current_path': current_path,
        'user_type': user_type,
        'created_account_type': created_account_type,
    }
    return render(request, 'profile.html', context)

@login_required
def profile_update(request):
    if request.method == 'POST':
        user = request.user
        new_username = request.POST.get('username')
        new_email = request.POST.get('email')
        
        if new_username == "":
            messages.error(request, 'Change failed, Username cannot be empty.')
            return redirect('profile')
        if new_email == "":
            messages.error(request, 'Change failed, Email cannot be empty.')
            return redirect('profile')
            
        if User.objects.filter(username=new_username).exclude(id=user.id).exists():
            messages.error(request, 'Username already taken.')
            return redirect('profile')
            
        if User.objects.filter(email=new_email).exclude(id=user.id).exists():
            messages.error(request, 'Email already in use.')
            return redirect('profile')
        
        user.username = new_username
        user.email = new_email
        user.save()
        
        account_type = request.POST.get('account_type')
        if Admin.objects.filter(user=user).exists():
            admin_profile = Admin.objects.get(user=user)
            admin_profile.user_type = account_type
            admin_profile.save()     
        messages.success(request, 'Changes saved successfully.')
        return redirect('profile')
    return redirect('profile')

@login_required
def profile_change_password(request):
    if request.method == 'POST':
        user = request.user
        old_password = request.POST.get('old_password')
        new_password = request.POST.get('new_password')
        confirm_password = request.POST.get('confirm_password')

        if not user.check_password(old_password):
            messages.error(request, 'Old password is incorrect.')
            return redirect('profile')

        if new_password != confirm_password:
            messages.error(request, 'New password and confirmation do not match.')
            return redirect('profile')

        if len(new_password) < 6:
            messages.error(request, 'Password must be at least 6 characters long.')
            return redirect('profile')

        user.set_password(new_password)
        user.save()
        messages.success(request, 'Password changed successfully.')
        return redirect('profile')
    
    return redirect('profile')

def toggle_theme(request):
    current_theme = request.session.get('theme','light')
    new_theme = 'dark'
    if current_theme == 'dark':
        new_theme = 'light'
    request.session['theme'] = new_theme
    request.session.modified = True
    return JsonResponse({'status': 'success', 'theme': new_theme})

#-------------------------------- Admin Functions
def admin_dashboard(request):
    
    current_path = request.path.strip('/')
    books = Book.objects.all()
    for book in books:
        if(book.count > 0):
            book.status = 'available'
    context = {
        'current_path': current_path,
        'books': books,
        'is_admin_page': True,
        'is_profile': True
    }
    return render(request, 'adminPages/admin-dashboard.html', context)
def add_book(request):
    if request.method == 'POST':
        form = BookForm(request.POST, request.FILES)
        if form.is_valid():
            book = form.save(commit=False)  
            book.added_by = request.user  
            book.save()  
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

def edit_book(request, book_id):
    try:
        book = Book.objects.get(id=book_id)
        if request.method == 'POST':
            form = BookForm(request.POST, request.FILES, instance=book)
            if form.is_valid():
                form.save()
                messages.success(request, f'"{book.title}" updated successfully!')
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
    
#-------------------------------- Registration Functions

def login_view(request):
    current_path = request.path.strip('/')
    context = {
        'current_path': current_path,
        'is_main_pages': True,
        'error': 'Invalid email or password.'
    }   
    if request.method == 'POST':
        email = request.POST.get('email', '').strip()
        password = request.POST.get('password', '').strip()
    
        try:
            user = User.objects.get(email=email)
            user = authenticate(request, username=user.username, password=password)
            
            if user is not None:
                login(request, user)
                if Admin.objects.filter(user=user).exists():
                    admin_profile = Admin.objects.get(user=user)
                    if admin_profile.user_type == 'admin':
                        messages.success(request, 'Login successful!')
                        return redirect('admin_dashboard')
                    else:
                        messages.success(request, 'Login successful!')
                        return redirect('user')
            else:
                messages.error(request, 'Invalid email or password.')
                return render(request, 'registration/login.html', context)
        except User.DoesNotExist:
            messages.error(request, 'Invalid email or password.')
            return render(request, 'registration/login.html', context)
    return render(request, 'registration/login.html', context)

def sign_up(request):
    current_path = request.path.strip('/')
    if request.method == 'POST':
        name = request.POST.get('username', '').strip()
        email = request.POST.get('email', '').strip()
        password = request.POST.get('password', '').strip()
        repeat_password = request.POST.get('confirm_password', '').strip()
        user_type = request.POST.get('account_type', '').strip()
        
        if name == "" or email == "" or password == "" or repeat_password == "":
            messages.error(request, 'All fields are required')
            context = {
                'current_path': current_path,
                'is_main_pages': True
            }
            return render(request, 'registration/sign-up.html', context)
        
        if User.objects.filter(username=name).exists():
            messages.error(request, 'Username already taken')
            context = {
                'current_path': current_path,
                'is_main_pages': True
            }
            return render(request, 'registration/sign-up.html', context)
        if User.objects.filter(email=email).exists():
            messages.error(request, 'This account already exists')
            context = {
                'current_path': current_path,
                'is_main_pages': True
            }
            return render(request, 'registration/sign-up.html', context)

        if(len(password) < 6):
            messages.error(request, 'Password must be at least 6 characters long')
            context = {
                'current_path': current_path,
                'is_main_pages': True
            }
            return render(request, 'registration/sign-up.html', context)
        
        if password != repeat_password:
            messages.error(request, 'Passwords do not match')
            context = {
                'password_mismatch': True,
                'current_path': current_path,
                'is_main_pages': True
            }
            return render(request, 'registration/sign-up.html', context)

        user = User.objects.create_user(username=name, email=email, password=password)

        if user_type.lower() == "admin":
            Admin.objects.create(
                user=user, 
                full_name=name,
                created_account_type='admin',
                user_type='admin'
            )
            return redirect('login')
        else:
            Admin.objects.create(
                user=user,
                full_name=name,
                created_account_type='user',
                user_type='user'
            )
            return redirect('login')
            
    context = {
        'current_path': current_path,
        'is_main_pages': True
    }    
    return render(request, 'registration/sign-up.html', context)
    
@login_required
def user_logout(request):
    logout(request)
    messages.success(request, 'You have been logged out successfully!')
    return redirect('home')
#-------------------------------- User Functions
def user(request):
    current_path = request.path.strip('/')
    # Get all books from the database, including unavailable ones
    books = Book.objects.all()
    for book in books:
        if(book.count > 0):
            book.status = 'available'
        
    context = {
        'current_path': current_path,
        'books': books,
        'is_admin_page': False,
        'is_user_page': True
    }

    return render(request,'user/user.html',context)
# Book detail API
def book_details(request, book_id):
    try:
        book = Book.objects.get(id=book_id)
        data = {
            'id': book.id,
            'title': book.title,
            'author': book.author,
            'isbn': book.ISBN,
            'pages': book.pages,
            'category': book.get_category_display(),
            'description': book.description,
            'status': book.status,
            'cover_image': book.cover_image.url if book.cover_image else None,
        }
        return JsonResponse(data)
    except Book.DoesNotExist:
        return JsonResponse({'error': 'Book not found'}, status=404)
def borrow_book(request, book_id):
    book = get_object_or_404(Book, id=book_id)

    if book.count <= 0:
        messages.error(request, 'This book is not available for borrowing.')
        return redirect('user')
    if(book.count > 0):
        book.status = 'available'
    # Check if book is already borrowed by someone
    if book.borrower is not None:
        if book.borrower == request.user:
            messages.error(request, "You have already borrowed this book.")
            return redirect('user')
    # Update book status
    book.count -= 1
    book.borrower = request.user
    book.borrowed_date = timezone.now()
    
    if book.count == 0:
        book.status = 'unavailable'
    
    book.save()
    messages.success(request, f"You have borrowed '{book.title}' successfully.")
    return redirect('borrowed_books')

# Add a new view for borrowed books
@login_required
def borrowed_books(request):
    current_path = request.path.strip('/')
    # Get books borrowed by the current user
    borrowed_books = Book.objects.filter(borrower=request.user)
    
    context = {
        'current_path': current_path,
        'books': borrowed_books,
        'is_admin_page': False,
        'is_user_page': True
    }
    
    return render(request, 'user/Borrow_Book.html', context)

@login_required
def return_book(request, book_id):
    try:
        book = Book.objects.get(id=book_id)
        
        # Update book status
        book.count += 1
        book.borrower = None
        book.borrowed_date = None
        
        # If this was the first copy returned, mark as available
        if book.status == 'unavailable' and book.count > 0:
            book.status = 'available'
        
        book.save()
        messages.success(request, f"Successfully returned '{book.title}'")
        return redirect('borrowed_books')
    
    except Book.DoesNotExist:
        messages.error(request, 'Book not found.')
        return redirect('borrowed_books')

