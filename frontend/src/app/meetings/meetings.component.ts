import { Component, OnInit } from '@angular/core';

import { Meeting } from '../models/meeting';
import { MeetingService } from '../services/meeting.service';

@Component({
    selector: 'app-meetings',
    templateUrl: './meetings.component.html',
})
export class MeetingsComponent implements OnInit {
    meetings: Meeting[] = [];

    loading = true;
    error = '';

    constructor(private meetingService: MeetingService) {}

    ngOnInit(): void {
        this.loadMeetings();
    }

    loadMeetings(): void {
        this.loading = true;

        this.meetingService.getMeetings().subscribe({
            next: (response) => {
                this.meetings = response.results;
                this.loading = false;
            },
            error: () => {
                this.error = 'Failed to load meetings.';
                this.loading = false;
            },
        });
    }
}
