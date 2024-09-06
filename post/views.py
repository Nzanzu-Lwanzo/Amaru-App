from django.shortcuts import render,get_object_or_404
from .models import Post
from django.http import Http404

def getPost(request,post_slug,id):
    try:
        post = get_object_or_404(Post,id=int(id))
        return render(request,"post/read.html",{
            "post" : post,
            "more" : Post.objects.all().exclude(id=int(id))[:3]
        })

    except Http404:
        return render(request,"404.html",{})
