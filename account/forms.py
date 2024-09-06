from django.contrib.auth import get_user_model
from django import forms

class UpdateUserForm(forms.ModelForm):
    class Meta :
        model = get_user_model()
        fields = ["username","password"]
        widgets = {
            "password" : forms.PasswordInput(attrs={"value":""})
        }