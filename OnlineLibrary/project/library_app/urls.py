from django.urls import path
from . import views

urlpatterns = [
    # Home urls
    path('', views.home, name='home'),
    path('login/', views.login_view, name='login'),
    path('sign-up/', views.sign_up, name='sign_up'),
    path('profile/', views.profile, name='profile'),
    path('profile/update/', views.profile_update, name='profile_update'),
    path('profile/change-password/', views.profile_change_password, name='profile_change_password'),
    path('toggle-theme/', views.toggle_theme, name='toggle-theme'),
    path('logout/', views.user_logout, name='user_logout'),

     # Admin urls
    path('admin-dashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('add-book/', views.add_book, name='add_book'),
    path('view-available/', views.view_available, name='view_available'),
    path('edit-book/<int:book_id>/', views.edit_book, name='edit_book'),
    path('delete-book/<int:book_id>/', views.delete_book, name='delete_book'),
    path('delete-all-books/', views.delete_all_books, name='delete_all_books'),


    # User urls
    path('user/', views.user, name='user'),
    path('borrow-book/<int:book_id>/', views.borrow_book, name='borrow_book'),
    path('return-book/<int:book_id>/', views.return_book, name='return_book'),
    path('borrowed-books/', views.borrowed_books, name='borrowed_books'),
]
