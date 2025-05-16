from django.urls import path
from . import views

urlpatterns = [
    # Main Parts
    path('', views.home, name='home'),
    path('profile/', views.profile, name='profile'),
    path('toggle-theme/', views.toggle_theme, name='toggle-theme'),
    # Admin urls
    path('admin-dashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('add-book/', views.add_book, name='add_book'),
    path('view-available/', views.view_available, name='view_available'),
    path('delete-book/<int:book_id>/', views.delete_book, name='delete_book'),
    path('delete-all-books/', views.delete_all_books, name='delete_all_books'),
    
    # User urls
]
