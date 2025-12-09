import React from 'react';

const TopBar = () => {
    return (
        <div className="top-bar">
            <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Welcome to SportFlash</h1>
            <div>
                <button className="btn-outline" style={{ background: 'transparent', color: 'var(--text-main)', border: '1px solid rgba(255,255,255,0.3)', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 600, marginRight: '1rem', cursor: 'pointer' }}>
                    Log in
                </button>
                <button className="btn-primary" style={{ background: 'var(--primary-cricket)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                    Sign Up
                </button>
            </div>
        </div>
    );
};

export default TopBar;
