import logging
from django.db.models import Count
from rest_framework import status, viewsets
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from threading import Thread

from .models import Meeting, Note, Summary
from .serializers import MeetingSerializer, NoteSerializer, SummarySerializer, NoteCreateSerializer
from .services.ai import summarize as ai_summarize

log = logging.getLogger(__name__)

@api_view(["GET"])
def health(request):
    return Response({"status": "ok"}, status=status.HTTP_200_OK)

def generate_summary(summary: Summary, text: str):
    try:
        summary.content = ai_summarize(text)
        summary.status = Summary.READY
    except Exception as e:
        log.exception("Summary generation failed")
        summary.content = str(e)
        summary.status = Summary.FAILED
    summary.save()

class MeetingViewSet(viewsets.ModelViewSet):
    queryset = Meeting.objects.all().annotate(note_count=Count("notes")).order_by("-created_at")
    serializer_class = MeetingSerializer

    @action(detail=True, methods=["get", "post"], url_path="notes")
    def notes(self, request, pk=None):
        meeting = self.get_object()

        if request.method == "GET":
            notes = meeting.notes.all()
            page = self.paginate_queryset(notes)

            if page is not None:
                serializer = NoteSerializer(page, many=True)
                return self.get_paginated_response(serializer.data)

            serializer = NoteSerializer(notes, many=True)
            return Response(serializer.data)

        serializer = NoteCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        note = serializer.save(meeting=meeting)

        return Response(
            NoteSerializer(note).data,
            status=status.HTTP_201_CREATED,
        )


    @action(detail=True, methods=["post"], url_path="summarize")
    def summarize(self, request, pk=None):
        meeting = self.get_object()
        summary, _ = Summary.objects.get_or_create(meeting=meeting)
        summary.status = Summary.PENDING
        summary.content = ""
        summary.save()

        notes = meeting.notes.all()
        text = "\n".join(note.text for note in notes)

        log.info(
            "summarize_requested",
            extra={
                "meeting_id": meeting.id,
                "note_count": notes.count(),
            },
        )

        Thread(
            target=generate_summary,
            args=(summary, text),
            daemon=True,
        ).start()

        return Response(
            SummarySerializer(summary).data,
            status=status.HTTP_202_ACCEPTED,
        )

    @action(detail=True, methods=["get"], url_path="summary")
    def get_summary(self, request, pk=None):
        meeting = self.get_object()
        try:
            summary = meeting.summary
        except Summary.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        serializer = SummarySerializer(summary)
        return Response(serializer.data)

    def get_serializer_class(self):
        if self.action == "notes" and self.request.method == "POST":
            return NoteCreateSerializer

        if self.action == "summarize":
            return SummarySerializer

        return super().get_serializer_class()