from django.urls import path,re_path
from . import views

app_name = "account"

urlpatterns = [
    path("login/",views.logUserIn,name="login"),
    path("update-account/<int:uid>/",views.updateAccount,name="update-account")
]