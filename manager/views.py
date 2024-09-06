from django.shortcuts import render, redirect, get_object_or_404
from .forms import PostForm
from django.contrib.auth import get_user_model
from django.urls import reverse
from django.contrib import messages
from django.http.response import HttpResponseForbidden
from post.models import Post
from django.http import Http404
from django.db.models import F
from django.http.response import JsonResponse

def authenticate(fn):
    def wrapper(request,*args,**kwargs):
        if request.user.is_superuser:
            return fn(request,*args,**kwargs)
        else:
            # Return to unauthroized page - 401
            return HttpResponseForbidden()
    return wrapper

def getPost(request,id):

    post = None

    try :
        post = get_object_or_404(Post,id=int(id))
    except Http404:
        return render(request,"404.html",{})
    
    return post


@authenticate
def createPost(request):

    if request.method == "POST":
        form = PostForm(request.POST or None, request.FILES or None)

        if form.is_valid():
            post = form.save(commit=False)
            post.author = request.user
            post.save()
            return redirect("stdln:home")
        else : 
            messages.error(request,"Could'nt create the post")
            return redirect("manager:new-post")

    else:
        return render(request,"manager/blogPostForm.html",{
            "form" : PostForm()
        })


@authenticate
def editPost(request,post_id):

    post = getPost(request,post_id)
   
    if request.method == "POST":
        form = PostForm(request.POST or None,request.FILES or None,instance=post)

        if form.is_valid():
            form.save()
            return redirect("stdln:home")
        else:
            messages.error(request,"Erreur de création de post : vérifiez que tout est correct.")
            return render(request,"manager/blogPostForm.html",{
                "form" : PostForm(instance=post)
            })
    else:

        return render(request,"manager/blogPostForm.html",{
            "form" : PostForm(instance=post)
        })

    
def upvotePost(request,post_id):
    post = getPost(request,post_id)
    post.upvotes = F('upvotes') + 1
    post.save()
    return JsonResponse({"incremented" : True})

def deletePost(request,post_id):
    count,rest = Post.objects.get(id=int(post_id)).delete()
    
    if count:
        return JsonResponse({"deleted" : True})
    else:
        return JsonResponse({"deleted" : False})
    