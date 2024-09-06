from django.db import models
from account.models import User
from django.utils.text import slugify
from froala_editor.fields import FroalaField
from django.urls import reverse
    
class Post(models.Model):
    
    title = models.CharField("Titre",max_length=200,null=False,blank=False)
    slug = models.CharField("Slug",max_length=200,editable=False)
    tags = models.CharField("Tags",max_length=200,null=True)
    content = FroalaField()
    upvotes = models.IntegerField("Upvotes",default=0)
    created_at = models.DateTimeField("Created",auto_now_add=True,editable=False)
    updated_at = models.DateTimeField("Updated",auto_now=True,editable=False)
    author = models.ForeignKey(User,on_delete=models.DO_NOTHING,related_name="posts",null=False,blank=True)

    def __str__(self):
        return self.title 

    @property
    def get_tags(self):
        if not self.tags:
            return
        
        return self.tags.split(" ")

    def save(self, force_insert=False, force_update=False, using=None, update_fields=None):
        self.slug = slugify(self.title)
    
        if update_fields is not None and "title" in update_fields:
            update_fields = {"title"}.union(update_fields)

        super().save(
            force_update=force_update,
            force_insert=force_insert,
            update_fields=update_fields,
            using=using
        )   

    @property
    def get_absolute_url(self):
        return reverse("post:read",args=(self.slug,self.id,))