from django import template
from social.models import Like

from django.template.defaultfilters import stringfilter
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


