# Generated by Django 5.2 on 2025-05-12 21:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('library_app', '0002_alter_book_options_rename_isbn_book_isbn_book_count_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='book',
            name='cover_image',
            field=models.ImageField(blank=True, default='static/img/defaultBookCover.jpg', null=True, upload_to='book_covers/%y/%m/%d/'),
        ),
    ]
