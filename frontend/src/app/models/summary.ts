export interface Summary {
    id: number;
    content: string;
    status: 'pending' | 'ready' | 'failed';
    created_at: string;
    updated_at: string;
}
