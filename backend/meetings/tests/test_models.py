import pytest
from meetings.models import Meeting, Note

@pytest.mark.django_db
def test_notes_are_ordered_oldest_first():
    meeting = Meeting.objects.create(
        title="Sprint Planning",
        started_at="2026-07-24T15:00:00Z",
    )

    first = Note.objects.create(
        meeting=meeting,
        author="Alice",
        text="First note",
    )

    second = Note.objects.create(
        meeting=meeting,
        author="Bob",
        text="Second note",
    )

    notes = list(meeting.notes.all())

    assert notes == [first, second]