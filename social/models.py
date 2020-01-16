from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from django.conf import settings


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='profile/',default='default_pic.png')
    country = models.CharField(default='',max_length=100)
    state = models.CharField(default='',max_length=100)
    city = models.CharField(default='',max_length=100)
    fullAddress = models.CharField(default='',max_length=100)
    pin = models.CharField(default='',max_length=100)
    birth_date = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=50)
    timestamp = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f'{self.user.username} Profile'
    


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()


class Category(models.Model):
    category_name = models.CharField(max_length=256)

    class Meta:
        verbose_name = "category"
        verbose_name_plural = "categories"


    def __str__(self):
        return self.category_name


class Subcategory(models.Model):
    category_name =  models.ForeignKey(Category, on_delete=models.CASCADE)
    subcategory_name = models.CharField(max_length=256)
    
    class Meta:
        verbose_name = "subcategory"
        verbose_name_plural = "subcategories"


    def __str__(self):
        return self.subcategory_name


class Post(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, null=True, blank=True)
    subcategory = models.ForeignKey(Subcategory, on_delete=models.CASCADE, null=True, blank=True)
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


class Dislike(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='dislikes')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)


class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    message = models.CharField(max_length=500, verbose_name="Comment")
    is_approved = models.BooleanField(default=True)
    is_rejected = models.BooleanField(default=False)
    commented_at = models.DateTimeField(default=timezone.now, verbose_name='Created at')

    def approve(self):
        self.is_approved = True
        self.save()

    class Meta:
        ordering = ['commented_at']


class Reply(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE, null=True)
    parent_reply = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True)
    message = models.CharField(max_length=500)
    is_approved = models.BooleanField(default=True)
    replied_at = models.DateTimeField(default=timezone.now)

    class Meta:
        verbose_name = 'reply'
        verbose_name_plural = 'replies'
        ordering = ['replied_at']


class Friendship(models.Model):
    request_from = models.ForeignKey(User, related_name='owner', on_delete=models.CASCADE)
    request_to = models.ForeignKey(User, related_name='friend', on_delete=models.CASCADE)
    timestamp = models.DateTimeField(default=timezone.now, null=True)
    is_friend = models.BooleanField(default=False)

    def make_friend(self, *args, **kwargs):
        self.is_friend = True
        super().save(*args, **kwargs)

    def __str__(self):
        return self.request_from.username + '->' +self.request_to.username