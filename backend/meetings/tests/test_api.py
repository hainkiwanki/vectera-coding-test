import pytest
from rest_framework.test import APIClient

from meetings.models import Meeting

@pytest.mark.django_db
def test_add_note_happy_path():
    client = APIClient()

    meeting = Meeting.objects.create(
        title="Sprint Planning",
        started_at="2026-07-24T15:00:00Z",
    )

    response = client.post(
        f"/api/meetings/{meeting.id}/notes/",
        {
            "author": "Kevin",
            "text": "Discussed project scope.",
        },
        format="json",
    )

    assert response.status_code == 201
    assert response.data["author"] == "Kevin"
    assert response.data["text"] == "Discussed project scope."
    assert meeting.notes.count() == 1


@pytest.mark.django_db
def test_add_note_validation():
    client = APIClient()

    meeting = Meeting.objects.create(
        title="Sprint Planning",
        started_at="2026-07-24T15:00:00Z",
    )

    response = client.post(
        f"/api/meetings/{meeting.id}/notes/",
        {
            "author": "Kevin",
            "text": "",
        },
        format="json",
    )

    assert response.status_code == 400