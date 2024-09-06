from django.contrib import admin
from django.urls import path,include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('post/',include('post.urls')),
    path('account/',include('account.urls')),
    path('',include("standalone.urls")),
    path('manage/',include("manager.urls")),
    path('froala_editor/', include('froala_editor.urls')),
]
