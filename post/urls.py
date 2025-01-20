from django.urls import path,re_path
from . import views

app_name = "post"

urlpatterns = [
    path("read/<slug:post_slug>/<int:id>/",views.getPost,name="read"),
]