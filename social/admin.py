from django.contrib import admin
from .models import Profile,Post, Like, Comment, Replies

# Register your models here.
admin.autodiscover()

class ProfileAdmin(admin.ModelAdmin):
	list_display = ('user', 'country')

admin.site.register(Profile, ProfileAdmin)
admin.site.register(Post)
admin.site.register(Like)
admin.site.register(Comment)
admin.site.register(Replies)