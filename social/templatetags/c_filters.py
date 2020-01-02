from django.shortcuts import render,redirect,reverse, get_object_or_404
from django import template
from social.models import Like, Dislike, Post, Comment, Profile
from django.utils import timezone
from django.template.defaultfilters import stringfilter
import datetime


register = template.Library()

@stringfilter
@register.filter(name="show_more")
def show_more(value):
    if len(value) > 500:
        return value[:500]
    return value


@register.filter(name="count_length")
@stringfilter
def count_length(value):
    return len(value)

@register.simple_tag
def get_like_obj(post_id, user_id):
    try:
        obj = Like.objects.filter(post=post_id, user=user_id)
        if obj:
            return True
    except Like.DoesNotExist:
       return False

@register.simple_tag
def get_dislike_obj(post_id, user_id):
    try:
        obj = Dislike.objects.filter(post=post_id, user=user_id)
        if obj:
            return True
    except Dislike.DoesNotExist:
       return False


@register.simple_tag
def get_comments(queryset):
    return queryset.order_by('-commented_at')



@register.simple_tag
def get_replies(queryset):
    return queryset.order_by('-commented_at')
    # return queryset


@register.filter(name='pluralize_reply')
def pluralize_reply(value):
    if value == 1:
        return str(value) + ' ' + 'reply'
    else:
        return str(value) + ' ' + 'replies'




@register.simple_tag
def verify_user_for_deletion(blogger, commentor, current_user):
    if str(current_user) == str(blogger) or str(current_user) == str(commentor):
        return True
    else:
        return False


@register.simple_tag
def get_category(posts, category_obj):
    if category_obj is not None:
        return category_obj
    return posts


@register.simple_tag
def get_age(dob):
    return timezone.now().year - dob.year


@register.simple_tag
def tag_x(user_id):
    print(user_id)
    obj = Profile.objects.get(pk=user_id)
    print(obj.timestamp)
    obj.timestamp = timezone.now()
    obj.save()
    obj.refresh_from_db()
    print(obj.timestamp)
    return obj.timestamp
    

@register.simple_tag
def use_time_stamp(timestamp):
    print(timestamp)
    if timestamp == '0 minutes':
        return 'online'
    return 'active {} ago'.format(timestamp)
    
    



   

