import React from 'react';
import MatchCard from '../components/MatchCard';
import NewsSection from '../components/NewsSection';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="view active">
            <h2 style={{ marginTop: 0 }}>Did you know? (Live Demo)</h2>

            <div className="cards-grid">
                <div className="content-left">
                    <h3 style={{ color: 'var(--text-muted)', marginBottom: '1rem', marginTop: 0 }}>TOP LIVE MATCHES</h3>

                    <MatchCard
                        sport="cricket"
                        league="ICC World Cup 2026"
                        team1={{ flag: '🇮🇳', code: 'IND', score: '248/3' }}
                        team2={{ flag: '🇦🇺', code: 'AUS', score: '--/--' }}
                        status={{}}
                        onClick={() => navigate('/match/cricket')}
                    />

                    <MatchCard
                        sport="football"
                        league="Premier League"
                        team1={{ flag: '🔴', code: 'MUN' }}
                        team2={{ flag: '🔵', code: 'CHE' }}
                        status={{ score: '2 - 1', time: "72'", note: "Goal: Rashford (54')" }}
                        onClick={() => navigate('/match/football')}
                    />

                    <MatchCard
                        sport="basketball"
                        league="NBA Regular Season"
                        team1={{ flag: '🏀', code: 'LAL' }}
                        team2={{ flag: '🌉', code: 'GSW' }}
                        status={{ score: '102 - 98', time: "Q4 4:21" }}
                        onClick={() => navigate('/match/basketball')}
                    />
                </div>

                <NewsSection />
            </div>
        </div>
    );
};

export default Home;
