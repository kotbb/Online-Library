from django import forms
from .models import Book

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

