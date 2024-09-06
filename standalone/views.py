from django.shortcuts import render
from post.models import Post

def home(request):
    posts = None
    
    if request.user.is_superuser:
        posts = Post.objects.all().order_by("-id")
    else:
        posts = Post.objects.all().order_by("-id")[:16]

    return render(request,"standalone/home.html",{
        "posts" : posts
    })