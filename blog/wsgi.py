import os

from django.core.wsgi import get_wsgi_application

# importing whitenoise
# https://geekydocs.com/blog/deploying-your-django-application-in-cpanel
from whitenoise import WhiteNoise
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'blog.settings')

application = get_wsgi_application()

# wrapping up existing wsgi application
# https://geekydocs.com/blog/deploying-your-django-application-in-cpanel
static_dir = os.path.join(settings.BASE_DIR,"website","static_site")
application = WhiteNoise(application, root=static_dir)