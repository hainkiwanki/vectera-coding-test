import { Summary } from './summary';

export interface Meeting {
    id: number;
    title: string;
    started_at: string;
    created_at: string;
    note_count: number;
    latest_summary: Summary | null;
}

export interface PaginatedMeetings {
    count: number;
    next: string | null;
    previous: string | null;
    results: Meeting[];
}
