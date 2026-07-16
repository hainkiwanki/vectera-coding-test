import logging
from django.db.models import Count
from rest_framework import status, viewsets
from rest_framework.decorators import api_view, action
from rest_framework.response import Response

from .models import Meeting, Note, Summary
from .serializers import MeetingSerializer, NoteSerializer, SummarySerializer

log = logging.getLogger(__name__)

@api_view(["GET"])
def health(request):
    return Response({"status": "ok"}, status=status.HTTP_200_OK)

class MeetingViewSet(viewsets.ModelViewSet):
    """
    TODO: Implement:
    - list with pagination (newest first)
    - retrieve (include latest summary if any)
    - create
    """
    queryset = Meeting.objects.all().annotate(note_count=Count("notes"))
    serializer_class = MeetingSerializer

    @action(detail=True, methods=["post"], url_path="notes")
    def add_note(self, request, pk=None):
        """
        TODO: Validate and create a Note for this meeting.
        """
        return Response({"detail": "TODO: implement add_note"}, status=status.HTTP_501_NOT_IMPLEMENTED)

    @action(detail=True, methods=["get"], url_path="notes")
    def list_notes(self, request, pk=None):
        """
        TODO: Return paginated notes, ordered oldest..newest.
        """
        return Response({"detail": "TODO: implement list_notes"}, status=status.HTTP_501_NOT_IMPLEMENTED)

    @action(detail=True, methods=["post"], url_path="summarize")
    def summarize(self, request, pk=None):
        """
        TODO:
        - Create or update a Summary with status 'pending'
        - Simulate async job: concatenate notes, call services.ai.summarize, then set 'ready'/'failed'
        - Log meeting_id and note_count
        - Return 202 Accepted
        """
        log.info("summarize_requested", extra={"meeting_id": pk})
        return Response({"detail": "TODO: implement summarize"}, status=status.HTTP_501_NOT_IMPLEMENTED)

    @action(detail=True, methods=["get"], url_path="summary")
    def get_summary(self, request, pk=None):
        """
        TODO: Return the summary or 404 if none.
        """
        return Response({"detail": "TODO: implement get_summary"}, status=status.HTTP_501_NOT_IMPLEMENTED)
