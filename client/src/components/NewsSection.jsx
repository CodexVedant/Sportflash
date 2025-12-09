import React from 'react';

const NewsSection = () => {
    return (
        <div className="content-right">
            <h3 style={{ color: 'var(--text-muted)', marginBottom: '1rem', marginTop: 0 }}>TRENDING NEWS</h3>
            <div className="card" style={{ minHeight: '400px' }}>
                <NewsItem
                    category="CRICKET"
                    color="var(--primary-cricket)"
                    bgColor="#1e3a8a"
                    title="BCCI announces new squad for T20 World Cup 2026."
                />
                <NewsItem
                    category="FOOTBALL"
                    color="var(--primary-football)"
                    bgColor="#14532d"
                    title="Mbappe scores hat-trick in Madrid derby thriller."
                />
                <NewsItem
                    category="BASKETBALL"
                    color="#f97316"
                    bgColor="#7c2d12"
                    title="LeBron James breaks another all-time scoring record."
                />

                <div className="news-item" style={{ borderBottom: 'none' }}>
                    <div className="news-img" style={{ background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'black', fontWeight: 'bold', fontSize: '1.5rem' }}>
                        +
                    </div>
                    <div>
                        <div className="news-title" style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>
                            Log in to read more personalized news
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const NewsItem = ({ category, color, bgColor, title }) => (
    <div className="news-item">
        <div className="news-img" style={{ background: bgColor }}></div>
        <div>
            <div style={{ fontSize: '0.75rem', color: color }}>{category}</div>
            <div className="news-title">{title}</div>
        </div>
    </div>
);

export default NewsSection;
