export type RootStackParamList = {
    Main: undefined;
    Login: undefined;
    Register: undefined;
    MatchDetail: { match?: any; id?: string; sport?: string };
    Series: { id: string; sport: string };
    Following: undefined;
    Bookmarks: undefined;
    Settings: undefined;
    LeagueDetails: { leagueId: string; sport?: string; name?: string };
    TeamProfile: { teamId?: string; teamName?: string; sport?: string; team?: any };
    PlayerProfile: { playerId?: string; player?: any; sport?: string };
    Notifications: undefined;
    Preferences: undefined;
    NewsDetail: { article: any };
    UpcomingMatches: { sport?: string; date?: string };
};
