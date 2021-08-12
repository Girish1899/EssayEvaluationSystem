from django.db.models import query,Q
from project.models import FeedbackRequest, User


class FeedbackRequestManager:
	""" Helper methods related to FeedbackRequests. """

	@staticmethod
	def query_for_user(user: User, include_edited: bool = False):
		""" Query all FeedbackRequests available to the current user.

			Includes those that are finished if requested. Otherwise, includes only unfinished. 
		"""
		queryset = FeedbackRequest.objects.filter(Q(assigned_editors=user) | Q(assigned_editors__isnull=True))
		if not include_edited:
			queryset = queryset.filter(edited=False)
		return queryset

class FeedbackDetail:
	""" Helper methods related to FeedbackRequests. """

	@staticmethod
	def query_for_user(id):
		""" Query  FeedbackRequests for the essay.

			Includes those that are finished and unfinished.
		"""
		queryset = FeedbackRequest.objects.filter(essay=id)
		return queryset

