# Generated by Django 2.2.4 on 2019-12-07 09:29

from django.db import migrations
import django.db.models.manager


class Migration(migrations.Migration):

    dependencies = [
        ('social', '0014_remove_comment_replies'),
    ]

    operations = [
        migrations.AlterModelManagers(
            name='comment',
            managers=[
                ('custom_objects', django.db.models.manager.Manager()),
            ],
        ),
    ]