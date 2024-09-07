from django.contrib import admin
from django.urls import path,include,re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve

urlpatterns = [
    path('admin/', admin.site.urls),
    path('post/',include('post.urls')),
    path('account/',include('account.urls')),
    path('',include("standalone.urls")),
    path('manage/',include("manager.urls")),
    path('froala_editor/', include('froala_editor.urls')),

    # ADDED FOLLOWING THE INSTRUCTIONS OF
    # https://dev.to/jmegnidro/deploying-a-django-application-on-cpanel-beginners-guide-54km
    re_path(r'^media/(?P<path>.*)$',serve,{'document_root' : settings.MEDIA_ROOT}),
    re_path(r'^static/(?P<path>.*)$',serve,{'document_root' : settings.STATIC_ROOT})
    
] + static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)