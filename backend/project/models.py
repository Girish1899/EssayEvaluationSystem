import django.db.models.manager

from typing import Optional, cast
from django.db import models
from django.contrib.auth.models import AbstractUser
from datetime import datetime


class User(AbstractUser):
	""" A user in the system. Users in this system can all theoretically upload or edit essays. Everyone has the
		same level of access, for the sake of simplicity. Users need to be authenticated to do anything in the system
		other than login.

		This class is defined according to Django recommendations to allow additional fields to be added to our
		User class. Reference settings.
	"""

	# Incoming fields (defined for intellisense)
	essays_uploaded: 'django.db.models.manager.RelatedManager["Essay"]' = cast(
		'django.db.models.manager.RelatedManager["Essay"]', None
	)
	assigned_feedback_requests: 'django.db.models.manager.RelatedManager["FeedbackRequest"]' = cast(
		'django.db.models.manager.RelatedManager["FeedbackRequest"]', None
	)


class Essay(models.Model):
	""" An essay is structured text that can be uploaded into our system and later submitted for feedback. """
	name = models.TextField(help_text='A helpful name for the essay.')
	uploaded_by = models.ForeignKey('project.User', related_name='essays_uploaded', on_delete=models.CASCADE)
	content = models.TextField(
		help_text='The content of the essay. You may treat this as plain text for the' +
		' purposes of this project. This plain text may contain newlines and tabs, both of which should be rendered.'
	)
	revision_of = models.ForeignKey(
		'project.Essay',
		related_name='revisions',
		null=True,
		blank=True,
		on_delete=models.SET_NULL,
		help_text='If this is a revision of a previously uploaded essay (or list of essays), the most recently uploaded'
		+ ' ancestor essay. Otherwise, null.'
	)

	# Incoming fields (defined for intellisense)
	feedback_request: Optional['FeedbackRequest'] = None
	revisions: 'django.db.models.manager.RelatedManager["Essay"]' = cast(
		'django.db.models.manager.RelatedManager["Essay"]', None
	)


class FeedbackRequest(models.Model):
	""" A request for feedback on an essay. """

	essay = models.ForeignKey('project.Essay',
		on_delete=models.CASCADE,
		related_name='feedback_request',
		help_text='The essay being edited as part of the feedback request. For simplicity, we assume that a feedback' +
		' request consists of only one essay.'
	)
	assigned_editors = models.ManyToManyField('project.User', related_name='assigned_feedback_requests')
	edited = models.BooleanField(
		default=False,
		help_text='If True, the request has been edited. Otherwise,' +
		' the request is pending being edited. You will want to consider whether this field is needed and' +
		' how it should be updated in the context of your work.'
	)
	#to save the feedback given by the editor
	feedback = models.CharField(default="",max_length=500)
	#a field to store essay given by essay
	essay_Given_By_Student = models.CharField(default="Essay...",max_length=500)
	deadline = models.DateTimeField()
	#A flag variable to push the editors to complete the feedback before picking up another essay for review.
	feedBack_Status= models.BooleanField(
		default=False,
		help_text='If True, the request has been seen by a editor. Otherwise,' +
		' the request is still in the queue yet to be reviewed'
	)


