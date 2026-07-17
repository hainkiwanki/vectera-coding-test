export interface Note {
    id: number;
    author: string;
    text: string;
    created_at: string;
}

export interface PaginatedNotes {
    count: number;
    next: string | null;
    previous: string | null;
    results: Note[];
}
