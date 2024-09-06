from .models import Post 

def for_research_posts(request):
    posts = Post.objects.all()
    search_data = []

    for post in posts:
        obj = {
            "id" : post.id,
            "title" : post.title,
            "tags" : post.get_tags,
            "url" : post.get_absolute_url
        }

        search_data.append(obj)

    return {
        "search_data" : search_data
    }
    
