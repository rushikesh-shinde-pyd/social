from django.shortcuts import render,redirect,reverse, get_object_or_404
from django.contrib.auth import authenticate,login as auth_login,logout
from .forms import SignUpForm,PhotoForm
from django.contrib.auth.models import User
from .models import Profile,Post, Like, Dislike, Comment, Replies
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from django.views.generic import View
from django.http import JsonResponse
from datetime import datetime as dt
import datetime
from django.utils.decorators import method_decorator
from django.db.models import Q

# Create your views here.
def index(request):
    return render(request,'index.html')

def signup(request):
    if request.method == 'POST':
        form = SignUpForm(request.POST)
        if form.is_valid():
            user=form.save()
            user.refresh_from_db()  # load the profile instance created by the signal
            user.profile.birth_date = form.cleaned_data.get('birth_date')
            user.profile.gender = form.cleaned_data.get('gender')
            user.profile.country = form.cleaned_data.get('country')
            user.save()
            username = form.cleaned_data.get('username')
            raw_password = form.cleaned_data.get('password1')
            user = authenticate(username=username, password=raw_password)
            auth_login(request, user)
            subject = 'Account has been created.'
            message = 'Thank you for register with us.'
            email_from = settings.EMAIL_HOST_USER
            recipient_list = [form.cleaned_data.get('email'), ]
            # send_mail(subject, message, email_from, recipient_list)
            messages.success(request,'You have register successfully.')
            return redirect(reverse('social:login'))
    else:
        form = SignUpForm()
    return render(request, 'registration/signup.html', {'form': form})

def logout_view(request):
    logout(request)
    return redirect('/')

def login(request):
    if request.method == "POST":
        d = request.POST
        username = d.get('username')
        password = d.get('password')
        user = authenticate(username=username, password=password)
        if user is not None:
            auth_login(request, user)
            print('success')
            messages.success(request, 'Login success.')
            print('redirecting')
            return redirect(reverse('social:dashboard'))
        else:
            print('wrong')
            messages.error(request, 'Invalid username and password.')
            return redirect(reverse('social:login'))
    return render(request,'registration/login.html')

# @login_required()
def dashboard(request):
    user = request.user
    posts = Post.objects.filter(is_active=True).order_by("-published_date")
    # posts = Post.objects.filter(published_date__lte=timezone.now()).order_by('-published_date')
    return render(request,'dashboard.html',{'user': user, 'posts': posts, 'dt': dt.now, 'timezone':timezone})

# @login_required()
def profile(request):
    user = request.user
    return render(request,'profile.html',{'user':user})

#@login_required()
def editProfile(request):
    u_id = request.user.id
    print('User id-',u_id)
    user = request.user
    if request.method == 'POST':
        d =request.POST.get
        print(d)
        image = request.FILES.get('image')
        print(image)
        form = PhotoForm(request.POST, request.FILES)
        if image:
            if form.is_valid():
                form.save()
                return redirect('photo_list')
            else:
                form = PhotoForm()
            return render(request, 'album/photo_list.html', {'form': form, 'photos': image})
        first_name=d('first_name');last_name=d('last_name');gender=d('gender');email=d('email')
        birth_date = d('birth_date'); city = d('city'); state = d('state'); country = d('country');address = d('address')
        if first_name != '':
            print(User.objects.filter(id=u_id).update(first_name=first_name))
            messages.success(request, 'Profile update successfully.')
        if last_name!= '':
            print(User.objects.filter(id=u_id).update(last_name=last_name))
            messages.success(request, 'Profile update successfully.')
        if email != '':
            print(User.objects.filter(id=u_id).update(email=email))
            messages.success(request, 'Profile update successfully.')
        if birth_date != '':
            print(Profile.objects.filter(id=u_id).update(birth_date=birth_date))
            messages.success(request, 'Profile update successfully.')
        if gender != '':
            print(Profile.objects.filter(id=u_id).update(gender=gender))
            messages.success(request, 'Profile update successfully.')
        if city != '':
            print(Profile.objects.filter(id=u_id).update(city=city))
            messages.success(request, 'Profile update successfully.')
        if state != '':
            print(Profile.objects.filter(id=u_id).update(state=state))
            messages.success(request, 'Profile update successfully.')
        if country != '':
            print(Profile.objects.filter(id=u_id).update(country=country))
            messages.success(request, 'Profile update successfully.')
        if address != '':
            print(Profile.objects.filter(id=u_id).update(fullAddress=address))
            messages.success(request, 'Profile update successfully.')
        return redirect('social:profile')

    return render(request,'editProfile.html',{'user':user})


def forgot_password(request):
    if request.method == 'POST':
        u_email= request.POST.get('email')
        user = User.objects.filter(email=u_email).first()
        print('User email-',user )
        if user is not None:
            print('Username exits')
            subject = 'Your account details'
            message = 'Your username is '
            email_from = settings.EMAIL_HOST_USER
            recipient_list = ['@gmail.com', ]
            send_mail(subject, message, email_from, recipient_list)
            messages.success(request, 'User email-id found.')
        else:
            print('Not exits. please register.')
            messages.warning(request, 'User not register. Please register first.')
            return redirect('social:signup')
    return render(request,'registration/forgot_password.html')



def create_post(request):
    if request.method == "POST":
        post = request.POST.get('post-content')
        title = request.POST.get('post-title')
        if post and title:
            user_obj = User.objects.get(username=request.user)
            obj = Post(
                author= user_obj,
                title = title.strip(),
                text = post.strip(),
                created_date = timezone.now(),
                # published_date = timezone.now()
            )
            obj.save()
            obj.publish()
    return redirect(reverse("social:dashboard"))


@method_decorator(login_required, name="dispatch")
class AjaxRequests(View):
    def post(self, request, *args, **kwargs):
        id = request.POST.get('id', None)
        request_type = request.POST.get('request_type', None)
        if request_type is not None:
            if request_type == 'delete':
                if id:
                    obj = Post.objects.get(id=id.strip())
                    if obj:
                        obj.delete()
                        data = {"deleted": True}
                        return JsonResponse(data)
                    else:
                        data = {"deleted": False}
                        return JsonResponse(data)
                else:
                    data = {"deleted": False}
                    return JsonResponse(data)
            elif request_type == 'update':
                title = request.POST.get('title', None)
                content = request.POST.get('content', None)
                obj = Post.objects.get(id=id)
                obj.title = title
                obj.text = content
                obj.save()
                obj.publish()
                obj.refresh_from_db()
                data = {
                    'title': obj.title,
                    'text': obj.text,
                    'published_date': obj.published_date.strftime('%b. %d, %Y, %I:%M %p'),
                    'updated': True
                }
                return JsonResponse(data)

@method_decorator(login_required, name="dispatch")
class LikeDislike(View):
    def post(self, request, *args, **kwargs):
        post_id = request.POST.get('post_id')
        user_id = request.user.id
        action = request.POST.get('action')
        post_obj = Post.objects.get(id=post_id)
        user_obj = User.objects.get(id=user_id)
        dislike = False
        try:
            dislike_obj = get_object_or_404(Dislike, post=post_obj, user=user_obj)
            if dislike_obj:
                dislike = True
            else:
                dislike = False
        except:
            dislike = False

        if action == "like":
            Like.objects.create(post=post_obj, user=user_obj)
            like_counts = post_obj.likes.count()

            if dislike:
                dislike_obj.delete()
                dislike_counts = post_obj.dislikes.count()
                data = {
                    'dislike_count': dislike_counts,
                    'like_count': like_counts,
                    'dislike': True
                }
                return JsonResponse(data)
            else:
                data = {
                    'like_count': like_counts,
                }
                return JsonResponse(data)
        elif action == "dislike":
            obj = Like.objects.filter(Q(post=post_obj) & Q(user=user_obj))
            if obj:
                obj.delete()
            data = {
                    'like_count': post_obj.likes.count(),
                }
            return JsonResponse(data)


@method_decorator(login_required, name="dispatch")
class DislikeView(View):
    def post(self, request, *args, **kwargs):
        post_id = request.POST.get('post_id')
        user_id = request.user.id
        action = request.POST.get('action')
        post_obj = Post.objects.get(id=post_id)
        user_obj = User.objects.get(id=user_id)
        like = False
        try:
            like_obj = get_object_or_404(Like, post=post_obj, user=user_obj)
            if like_obj:
                like = True
            else:
                like = False
        except:
            like = False
        if action == "like":
            Dislike.objects.create(post=post_obj, user=user_obj)
            dislike_counts = post_obj.dislikes.count()
            if like:
                like_obj.delete()
                like_counts = post_obj.likes.count()
                data = {
                    'dislike_count': dislike_counts,
                    'like_count': like_counts,
                    'like': True
                }
                return JsonResponse(data)
            else:
                data = {
                    'dislike_count': dislike_counts
                }
                return JsonResponse(data)
        elif action == "dislike":
            obj = get_object_or_404(Dislike, post=post_obj, user=user_obj)
            if obj:
                obj.delete()
            data = {
                    'dislike_count': post_obj.dislikes.count()
                }
            return JsonResponse(data)


@method_decorator(login_required, name="dispatch")
class CommentView(View):
    def post(self, request, *args, **kwargs):
        print("request came")
        post_id = request.POST.get('post_id')
        comment_message = request.POST.get('comment')
        user_id = request.user.id
        post_obj = Post.objects.get(id=post_id)
        user_obj = User.objects.get(id=user_id)
        print(post_obj, user_obj)
        obj = Comment(post_id=post_obj.id, user_id=user_obj.id, message=comment_message)
        obj.save()
        print(obj.commented_at)
        data = {
            'comment_id': obj.id,
            'comment_user_fname': obj.user.first_name.title(),
            'comment_user_lname': obj.user.last_name.title(),
            'comment_message': obj.message,
            'comment_commented_at': obj.commented_at,
            'total_comments': post_obj.comment_set.all().count()
        }
        print(data)
        return JsonResponse(data)


@method_decorator(login_required, name='dispatch')
class ReplyToCommentView(View):
    def post(self, request, *args, **kwargs):
        print('o yeah!')
        comment_id = request.POST.get('comment_id').strip()
        comment_obj = get_object_or_404(Comment, id=comment_id)
        user_obj = User.objects.get(id=request.user.id)
        reply = request.POST.get('reply').strip()
        obj = Replies(user=user_obj, parent=comment_obj, reply=reply)
        obj.save()
        print(obj)
        counts = comment_obj.parent.all().count()
        print(counts)
        reply_count = ''
        if counts > 1:
            reply_count += str(counts) + ' replies'
        elif counts == 1:
            reply_count += str(counts) + ' reply'
        print(reply_count)
        data = {
            'reply_id': obj.id,
            'reply_user_fname': obj.user.first_name.title(),
            'reply_user_lname': obj.user.last_name.title(),
            'reply_message': obj.reply,
            'reply_commented_at': obj.commented_at,
            'total_replies': reply_count

        }
        return JsonResponse(data)

def show_post_details(request):
    post_id = request.GET.get('post_id').strip()
    post_obj = get_object_or_404(Post, id=post_id)
    data = {
        'content': post_obj.text
    }
    return JsonResponse(data)