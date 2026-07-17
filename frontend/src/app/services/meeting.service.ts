import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Meeting, PaginatedMeetings } from '../models/meeting';
import { Note, PaginatedNotes } from '../models/note';
import { Summary } from '../models/summary';

@Injectable({
    providedIn: 'root',
})
export class MeetingService {
    private readonly baseUrl = '/api/meetings';

    constructor(private http: HttpClient) {}

    getMeetings(): Observable<PaginatedMeetings> {
        return this.http.get<PaginatedMeetings>(this.baseUrl);
    }

    getMeeting(id: number): Observable<Meeting> {
        return this.http.get<Meeting>(`${this.baseUrl}/${id}/`);
    }

    getNotes(id: number): Observable<PaginatedNotes> {
        return this.http.get<PaginatedNotes>(`${this.baseUrl}/${id}/notes/`);
    }

    addNote(id: number, author: string, text: string): Observable<Note> {
        return this.http.post<Note>(`${this.baseUrl}/${id}/notes/`, {
            author,
            text,
        });
    }

    generateSummary(id: number): Observable<Summary> {
        return this.http.post<Summary>(`${this.baseUrl}/${id}/summarize/`, {});
    }

    getSummary(id: number): Observable<Summary> {
        return this.http.get<Summary>(`${this.baseUrl}/${id}/summary/`);
    }
}
