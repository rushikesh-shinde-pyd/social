# Generated by Django 2.2.4 on 2019-12-07 11:00

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('social', '0018_replies_reply'),
    ]

    operations = [
        migrations.AddField(
            model_name='comment',
            name='reply',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='replies', to='social.Comment'),
            preserve_default=False,
        ),
        migrations.DeleteModel(
            name='Replies',
        ),
    ]