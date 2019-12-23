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
    path('dislike_requests/', views.DislikeView.as_view(), name='dislike-requests'),

    path('comment/', views.CommentView.as_view(), name="comment"),
    path('reply-to-comment/', views.ReplyToCommentView.as_view(), name="reply-to-comment"),
    path('remove-comment/', views.remove_comment, name='remove-comment'),


    # showing pop-up post-details 
    path('add-subcategory/', views.add_subcategory, name="add-subcategory"),
    
    
    path('blog/', views.blog, name="blog"),


    path('blog/category/<str:key>/', views.blog, name="category"),
    path('blog/<int:pk>/', views.post_details, name="post-details"),

]
