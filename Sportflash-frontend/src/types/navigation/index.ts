export type RootStackParamList = {
    Main: undefined;
    Login: undefined;
    Register: undefined;
<<<<<<< HEAD
    MatchDetail: { match?: any; id?: string; matchId?: string; sport?: string };
=======
    ForgotPassword: undefined;
    ResetPassword: { resetToken: string };
    MatchDetail: { match?: any; id?: string; sport?: string };
>>>>>>> origin/main
    Series: { id: string; sport: string };
    Following: undefined;
    Bookmarks: undefined;
    Settings: undefined;
    LeagueDetails: {
        leagueId?: string;
        sport?: string;
        name?: string;
        round?: string;
        league?: { id: string; name: string; sport: string; country?: { name: string }; logo?: string; season?: string };
    };
    LeagueDetail: { league: { id: string; name: string; sport: string; country?: { name: string }; logo?: string; season?: string } };
    TeamProfile: { teamId?: string; teamName?: string; sport?: string; team?: any };
    PlayerProfile: { playerId?: string; player?: any; sport?: string };
    Notifications: undefined;
    NotificationSettings: undefined;
    Premium: undefined;
    Preferences: undefined;
    UpcomingMatches: { sport?: string; date?: string };
    Home: undefined;
    Matches: undefined;
    BasketballMatch: undefined;
    CricketMatch: undefined;
    FootballMatch: undefined;
    News: undefined;
    NewsCategory: { category: string; };
    NewsDetail: { article?: any; newsId?: string | number };
};
