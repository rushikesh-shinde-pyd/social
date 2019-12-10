from django.urls import path, include
from . import views

app_name = 'social'

urlpatterns = [
    path('', views.index, name='index'),
    path('login/', views.login, name='login'),
    path('signup/', views.signup, name='signup'),
    path('logout/',views.logout_view,name='logout'),
    path('dashboard/',views.dashboard,name='dashboard'),
    path('profile/',views.profile,name='profile'),
    path('editprofile/',views.editProfile,name='editProfile'),
    path('forgot_password/',views.forgot_password,name='forgot_password'),

    path('post_create/', views.create_post, name='post-create'),


    # ajax crud on posts
    # handles all crud requests on post under this path
    path('ajax_requests/', views.AjaxRequests.as_view(), name='ajax_requests'),
    # post like-dislike
    path('likedislike_requests/', views.LikeDislike.as_view(), name='likedislike-requests'),

    path('comment/', views.CommentView.as_view(), name="comment"),
    path('reply-to-comment/', views.ReplyToCommentView.as_view(), name="reply-to-comment"),

]