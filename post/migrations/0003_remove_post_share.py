# Generated by Django 5.1 on 2024-09-05 16:40

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('post', '0002_alter_post_author_alter_post_content'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='post',
            name='share',
        ),
    ]
