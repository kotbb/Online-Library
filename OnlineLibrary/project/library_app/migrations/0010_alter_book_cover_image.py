# Generated by Django 5.2 on 2025-05-17 14:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('library_app', '0009_alter_book_isbn_alter_book_added_date_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='book',
            name='cover_image',
            field=models.FileField(blank=True, null=True, upload_to='book_covers/'),
        ),
    ]
