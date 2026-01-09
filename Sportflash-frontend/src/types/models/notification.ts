import { BaseEntity } from '../common';

export type NotificationType = 'match_start' | 'goal' | 'result' | 'news' | 'system';

export interface NotificationItem extends BaseEntity {
    title: string;
    message: string;
    read: boolean;
    type: string; // broadened from NotificationType for compatibility or update NotificationType union
    link?: string;
    timestamp: string;
}
