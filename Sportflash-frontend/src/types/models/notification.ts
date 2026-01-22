import { BaseEntity } from '../common';

export type NotificationType = 'match_start' | 'goal' | 'result' | 'news' | 'system';

import { Match } from '../models/match';

export interface NotificationItem extends BaseEntity {
    title: string;
    message: string;
    read: boolean;
    type: string; // broadened from NotificationType for compatibility or update NotificationType union
    link?: string;
    matchId?: string;
    sport?: string;
    matchSnapshot?: Match; // 📸 Snapshot of the match when notification occurred
    timestamp: string;
}
