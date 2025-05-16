from django.urls import path
from . import views

urlpatterns = [
    # Main Parts
    path('', views.home, name='home'),
    path('sign-up/', views.sign_up, name='sign_up'),
        path('login/', views.login_view, name='login'),
    path('login/', views.user_login, name='login'),
    path('logout/', views.user_logout, name='logout'),
    path('profile/', views.profile, name='profile'),
    path('toggle-theme/', views.toggle_theme, name='toggle-theme'),
    # Admin urls
    path('admin-dashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('add-book/', views.add_book, name='add_book'),
    path('view-available/', views.view_available, name='view_available'),
    path('edit-book/<int:book_id>/', views.edit_book, name='edit_book'),
    path('delete-book/<int:book_id>/', views.delete_book, name='delete_book'),
    path('delete-all-books/', views.delete_all_books, name='delete_all_books'),
    
    # User urls
]
