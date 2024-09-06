from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth import authenticate, login
from account.models import User
from django.http import Http404
from django.contrib import messages
from .forms import UpdateUserForm
from django.contrib.auth.decorators import login_required
from django.urls import reverse

def logUserIn(request):

    if request.method == "POST":
        username = request.POST.get("username",None)
        password = request.POST.get("password",None)
        user = authenticate(request,username=username,password=password)

        if user is not None:
            login(request=request,user=user)
        else:
            messages.error(request,"Nous n'avons pas connecté cet utilisateur.")
        
        return redirect("stdln:home")
    else:
        return render(request,"account/logIn.html")
        
@login_required()
def updateAccount(request,uid):

    user = None

    try :
        user = get_object_or_404(User,id=int(uid))
    except Http404:
        messages.error(request,"Cet utilisateur n'existe pas dans la base des données. Veuillez le créer.")
        return render(request,"404.html",{})
    
    if request.method == "POST":
        form = UpdateUserForm(request.POST or None,request.FILES or None,instance=user)

        if form.is_valid():

            username = form.cleaned_data["username"]
            password = form.cleaned_data["password"]

            form.save()

            user = authenticate(request,username,password)

            if user is not None:
                login(request,user)
            else:
                messages.error(request,"Nous n'avons pas connecté cet utilisateur.")
        
            return redirect("stdln:home")
        else:
            messages.error(request,"Données soumises invalides.")
            return redirect(reverse("account:update-account",args=(int(request.user.id),)))
    else:
        return render(request,"account/updateData.html",{
            "form" : UpdateUserForm(instance=user)
        })