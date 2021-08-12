from django.shortcuts import redirect, render
from django.contrib.auth import login as auth_login, authenticate, logout as auth_logout
from rest_framework import views
from django.views.generic import TemplateView
from rest_framework import viewsets
from rest_framework import status
from rest_framework import mixins
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from project.models import FeedbackRequest,Essay,User
from django.http import JsonResponse
from project.serializers import EssaySerializer, FeedbackRequestSerializer
from project.utilities import FeedbackRequestManager,FeedbackDetail
from django.core import serializers


class FeedbackRequestViewSet(viewsets.GenericViewSet, mixins.ListModelMixin):
	""" Viewset for views pertaining to feedback requests. """

	serializer_class = FeedbackRequestSerializer
	permission_classes = (IsAuthenticated,)

	def get_queryset(self):
		return FeedbackRequestManager.query_for_user(self.request.user, include_edited=False).select_related('essay')


class HomeView(views.APIView):
	""" View that takes users who navigate to `/` to the correct page, depending on login status. """

	def get(self, *args, **kwargs):
		if self.request.user.is_authenticated:
			return redirect('/platform/')
		return redirect('/login/')


class PlatformView(views.APIView):
	""" View that renders the essay review platform. """

	permission_classes = (IsAuthenticated,)

	def get(self, *args, **kwargs):
		#####to check if the editor logged in has essay review requested that was not completed
		checkForRequets = FeedbackRequest.objects.filter(assigned_editors=self.request.user,feedBack_Status=True,feedback__exact="").count() 
		if checkForRequets>0:
			####if he has any incomplete request left he has to complete it and then move ahead 
			IdOfTheRequest = FeedbackRequest.objects.filter(assigned_editors=self.request.user,feedBack_Status=True,feedback__exact="").values()
			return redirect('/showfeedback/'+str(IdOfTheRequest[0]['essay_id'])+'/')
		else:
			###else can move ahead to check his dashboard
			return render(self.request, 'project/platform.html', {})
		


class LoginView(views.APIView):
	""" View for user login. """

	def get(self, *args, **kwargs):
		if self.request.user.is_authenticated:
			return redirect('/platform/')
		return render(self.request, 'project/login.html', {})

	def post(self, request, *args, **kwargs):
		user = authenticate(request, username=request.data.get('username'), password=request.data.get('password'))
		if user is None:
			# Auth failure
			return Response({'detail': 'Incorrect email or password.'}, status=status.HTTP_403_FORBIDDEN)
		auth_login(request, user)
		return Response(status=status.HTTP_204_NO_CONTENT)


class LogoutView(views.APIView):
	""" View for user logout. """

	def post(self, request, *args, **kwargs):
		auth_logout(request)
		return Response(status=status.HTTP_204_NO_CONTENT)


class feedbackView(views.APIView):
	""" View that renders the essay feedback platform. """

	def get(self, *args, **kwargs):
		return render(self.request, 'project/reviewsList.html')


class FeedbackRequestDetailViewSet(viewsets.GenericViewSet, mixins.ListModelMixin):
	""" Viewset for views pertaining to a particular essay and its previous feedbacks. """

	serializer_class = FeedbackRequestSerializer
	permission_classes = (IsAuthenticated,)

	def get_queryset(self):
		userObj  = User.objects.filter(username=self.request.user).values()
		FeedbackRequest.objects.filter(essay=self.kwargs['id']).update(feedBack_Status=True)
		FeedbackRequest.objects.filter(essay=self.kwargs['id']).last().assigned_editors.add(userObj[0]['id'])
		return FeedbackDetail.query_for_user(id=self.kwargs['id']).select_related('essay')

class createFeedBack(views.APIView):
	""" View to create feedback. """

	def post(self, request, *args, **kwargs):
		latestFeedBack = FeedbackRequest.objects.filter(essay=request.data.get('EId'),feedBack_Status=True).values().last()
		FeedbackRequest.objects.filter(id=latestFeedBack['id'],feedBack_Status=True,essay=request.data.get('EId'),).update(feedback=request.data.get('Efeedback'))
		return Response(status=status.HTTP_201_CREATED)



