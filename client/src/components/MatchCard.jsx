import React from 'react';

const MatchCard = ({ sport, league, team1, team2, status, footerText, onClick }) => {
    const isCricket = sport === 'cricket';
    const isFootball = sport === 'football';
    const isBasketball = sport === 'basketball';

    const primaryColor = isCricket ? 'var(--primary-cricket)' : isFootball ? 'var(--primary-football)' : 'var(--primary-basketball)';
    const bgGradient = isCricket
        ? 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(15,23,42,0.8))'
        : isFootball
            ? 'linear-gradient(135deg, rgba(34,197,94,0.1), rgba(15,23,42,0.8))'
            : 'linear-gradient(135deg, rgba(249,115,22,0.1), rgba(15,23,42,0.8))';

    const sportLabel = isBasketball ? 'NBA' : sport.toUpperCase();

    return (
        <div className="card"
            style={{ background: bgGradient, borderColor: primaryColor, cursor: 'pointer', marginTop: '1rem' }}
            onClick={onClick}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: isCricket ? '1rem' : '0.5rem' }}>
                <span style={{ color: 'var(--danger)', fontWeight: 'bold', animation: 'pulse 1.5s infinite' }}>
                    ● LIVE {sportLabel}
                </span>
                <span style={{ color: 'var(--text-muted)' }}>{league}</span>
            </div>

            {isCricket ? (
                <div className="score-hero" style={{ gap: '2rem', margin: 0 }}>
                    <div className="team-lg">
                        <span style={{ fontSize: '2rem' }}>{team1.flag}</span>
                        <div style={{ fontWeight: 'bold' }}>{team1.code}</div>
                        <div>{team1.score}</div>
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', opacity: 0.5 }}>VS</div>
                    <div className="team-lg">
                        <span style={{ fontSize: '2rem' }}>{team2.flag}</span>
                        <div style={{ fontWeight: 'bold' }}>{team2.code}</div>
                        <div>{team2.score}</div>
                    </div>
                </div>
            ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ fontSize: '1.5rem' }}>{team1.flag}</div>
                        <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{team1.code}</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div className="match-score-display" style={{ fontSize: '2rem' }}>{status.score}</div>
                        <div style={{ color: primaryColor, fontWeight: 'bold' }}>{status.time}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{team2.code}</div>
                        <div style={{ fontSize: '1.5rem' }}>{team2.flag}</div>
                    </div>
                </div>
            )}

            {/* Football specific subtitle if needed */}
            {status.note && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                    {status.note}
                </div>
            )}

            <div style={{ textAlign: 'center', marginTop: '1rem', color: primaryColor }}>
                {footerText || 'Click to view Match Dashboard (MVP Feature)'}
            </div>
        </div>
    );
};

export default MatchCard;
