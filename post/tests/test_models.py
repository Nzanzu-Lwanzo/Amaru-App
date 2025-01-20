from django.test import TestCase
from post.models import Post

# Create your tests here.
class TestPostApp(TestCase):

    # Runs before every test method
    def setUp(self):
        self.post = Post(
            title = 'Test models for Django project',
            tags = 'Django Code Python'
        )

        # Why, instead of fetching a post from my database
        # with Post.objects.get(id=n) for example, I'm instantiating a new Post objects ?
        # It's because we don't do the tests with our database. Instead, Django creates a new database
        # with the same structure and the same tables as the one we have, but not the data.
        return super().setUp()
    
    # Runs after every test method
    def tearDown(self):
        return super().tearDown()
    
    # Runs before running the tests
    @classmethod
    def setUpClass(cls):
        pass

    # Runs after running the tests
    @classmethod
    def tearDownClass(cls):
        pass


    
    def test_post_is_being_found(self):
        self.assertListEqual(self.post.get_tags,['Django','Code','Python'])