import { BaseEntity } from '../common';

export type NewsCategory = 'all' | 'football' | 'basketball' | 'cricket' | 'tennis' | 'transfer';

export interface Article extends BaseEntity {
    title: string;
    summary: string;
    content: string;
    image?: string;
    category: NewsCategory;
    publishedAt: string;
    source?: string;
    url?: string;
}
