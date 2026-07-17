import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Meeting } from '../models/meeting';
import { MeetingService } from '../services/meeting.service';
import { Note } from '../models/note';
import { Summary } from '../models/summary';

@Component({
    selector: 'app-meeting-detail',
    templateUrl: './meeting-detail.component.html',
})
export class MeetingDetailComponent implements OnInit, OnDestroy {
    meeting?: Meeting;
    notes: Note[] = [];

    loading = true;
    error = '';
    loadingNotes = true;

    author = '';
    text = '';

    summary: Summary | null = null;

    loadingSummary = false;

    private pollTimer?: ReturnType<typeof setInterval>;

    constructor(
        private route: ActivatedRoute,
        private meetingService: MeetingService,
    ) {}

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));

        this.loadMeeting(id);
    }

    ngOnDestroy(): void {
        if (this.pollTimer) {
            clearInterval(this.pollTimer);
        }
    }

    loadMeeting(id: number): void {
        this.loading = true;

        this.meetingService.getMeeting(id).subscribe({
            next: (meeting) => {
                this.meeting = meeting;
                this.summary = meeting.latest_summary;
                this.loading = false;

                this.loadNotes();
            },
            error: () => {
                this.error = 'Failed to load meeting.';
                this.loading = false;
            },
        });
    }

    loadNotes(): void {
        if (!this.meeting) {
            return;
        }

        this.loadingNotes = true;

        this.meetingService.getNotes(this.meeting.id).subscribe({
            next: (response) => {
                this.notes = response.results;
                this.loadingNotes = false;
            },
            error: () => {
                this.loadingNotes = false;
            },
        });
    }

    addNote(): void {
        if (!this.meeting) {
            return;
        }

        this.meetingService.addNote(this.meeting.id, this.author, this.text).subscribe({
            next: () => {
                this.author = '';
                this.text = '';
                this.loadMeeting(this.meeting!.id);
            },
            error: () => {
                alert('Failed to add note.');
            },
        });
    }

    generateSummary(): void {
        if (!this.meeting) {
            return;
        }

        this.loadingSummary = true;
        this.meetingService.generateSummary(this.meeting.id).subscribe({
            next: (summary) => {
                this.summary = summary;
                this.startPolling();
            },
            error: () => {
                this.loadingSummary = false;
                alert('Failed to generate summary.');
            },
        });
    }

    startPolling(): void {
        if (!this.meeting) {
            return;
        }

        if (this.pollTimer) {
            clearInterval(this.pollTimer);
        }

        this.pollTimer = setInterval(() => {
            this.meetingService.getSummary(this.meeting!.id).subscribe({
                next: (summary) => {
                    this.summary = summary;

                    if (summary.status === 'ready' || summary.status === 'failed') {
                        clearInterval(this.pollTimer);
                        this.loadingSummary = false;

                        this.loadMeeting(this.meeting!.id);
                    }
                },
                error: () => {
                    clearInterval(this.pollTimer);
                    this.loadingSummary = false;
                },
            });
        }, 1000);
    }
}
