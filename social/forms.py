from django import forms
from .models import Profile,User
from django.contrib.auth.forms import UserCreationForm
from crispy_forms.helper import FormHelper
from PIL import Image
from django.core.files import File

class SignUpForm(UserCreationForm):
    Choice= ((None,'Select gender'),('M','Male'), ('F','Female'),('O','Other'), )
    first_name = forms.CharField(max_length=30, required=False)
    last_name = forms.CharField(max_length=30, required=False)
    email = forms.EmailField(max_length=254)
    birth_date = forms.DateField()
    gender = forms.ChoiceField(choices=Choice)
    country = forms.CharField(max_length='100')

    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'email', 'password1', 'password2','gender','country' )

    def __init__(self, *args, **kwargs):
        super(SignUpForm, self).__init__(*args, **kwargs)
        self.helper = FormHelper(self)

class ProfileForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = ('image','country', 'city','state','fullAddress')




class PhotoForm(forms.ModelForm):
    x = forms.FloatField(widget=forms.HiddenInput())
    y = forms.FloatField(widget=forms.HiddenInput())
    width = forms.FloatField(widget=forms.HiddenInput())
    height = forms.FloatField(widget=forms.HiddenInput())

    class Meta:
        model = Profile
        fields = ('image', 'x', 'y', 'width', 'height', )

    def save(self):
        profile = super(PhotoForm, self).save()
        x = self.cleaned_data.get('x')
        y = self.cleaned_data.get('y')
        w = self.cleaned_data.get('width')
        h = self.cleaned_data.get('height')
        image = Image.open(Profile.image)
        cropped_image = image.crop((x, y, w+x, h+y))
        resized_image = cropped_image.resize((200, 200), Image.ANTIALIAS)
        resized_image.save(profile.image.path)
        return profile