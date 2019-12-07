# Generated by Django 2.2.4 on 2019-12-07 00:16

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('social', '0008_like_user'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='like',
            name='like',
        ),
        migrations.AlterField(
            model_name='like',
            name='post',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='likes', to='social.Post'),
        ),
    ]
