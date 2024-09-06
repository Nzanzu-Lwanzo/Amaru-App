from django.urls import path,re_path
from . import views

app_name ="manager"

urlpatterns = [
    path("new-post/",views.createPost,name="new-post"),
    path("edit-post/<int:post_id>/",views.editPost,name="edit-post"),
    path("delete-post/<int:post_id>/",views.deletePost,name="delete-post"),
    path("upvote-post/<int:post_id>/",views.upvotePost,name="upvote-post"),
]