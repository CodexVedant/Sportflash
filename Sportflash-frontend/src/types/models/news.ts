import { BaseEntity } from '../common';

export type NewsCategory = 'all' | 'football' | 'basketball' | 'cricket' | 'tennis' | 'transfer';

export interface Article extends BaseEntity {
    title: string;
    description?: string; // Backend returns 'description'
    content: string;
    imageUrl?: string | null; // Backend returns 'imageUrl', not 'image'
    category: NewsCategory | 'general'; // Backend can return 'general' category
    publishedAt: string;
    source?: {
        id: string;
        name: string;
    };
    url?: string;
    author?: string | null;
    // Additional metadata from backend
    keywords?: string[];
    country?: string[];
    language?: string;
}
