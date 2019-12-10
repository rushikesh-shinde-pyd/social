from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from django.conf import settings
from datetime import  datetime as dt
# Create your models here.
class Profile(models.Model):
    # user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='profile/',default='default_pic.png')
    country = models.CharField(default='',max_length=100)
    state = models.CharField(default='',max_length=100)
    city = models.CharField(default='',max_length=100)
    fullAddress = models.CharField(default='',max_length=100)
    pin = models.CharField(default='',max_length=100)
    birth_date = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=1)

    def __str__(self):
        return f'{self.user.username} Profile'

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()


class Post(models.Model):
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    text = models.TextField()
    created_date = models.DateTimeField(default=timezone.now)
    published_date = models.DateTimeField(blank=True, null=True)
    is_active = models.BooleanField(default=True)

    def publish(self):
        self.published_date = timezone.now()
        self.save()

    def __str__(self):
        return self.title


class Like(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='likes')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)


class CustomCommentManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().order_by('-commented_at')


class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    message = models.CharField(max_length=160, verbose_name="Comment")
    # reply = models.ForeignKey('self', on_delete=models.CASCADE, related_name='replies')
    is_approved = models.BooleanField(default=True)
    is_rejected = models.BooleanField(default=False)
    commented_at = models.DateTimeField(default=timezone.now, verbose_name='Created at')
    # custom_objects = CustomCommentManager()

    def approve(self):
        self.is_approved = True
        self.save()


    def reject(self):
        self.is_rejected = True
        self.save()


class Replies(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    parent = models.ForeignKey(Comment, on_delete=models.CASCADE, related_name='parent')
    parent_reply = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True)
    reply = models.CharField(max_length=160)
    is_approved = models.BooleanField(default=True)
    is_rejected = models.BooleanField(default=False)
    commented_at = models.DateTimeField(default=timezone.now, verbose_name='Created at')








