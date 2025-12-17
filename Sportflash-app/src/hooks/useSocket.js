import { useEffect, useState } from 'react';
import socket, { connectSocket, disconnectSocket } from '../services/socket';

/**
 * Hook to listen for live cricket score updates via Socket.IO
 * @returns {Array} cricketMatches - Array of live cricket matches
 */
export const useLiveCricketScores = () => {
    const [cricketMatches, setCricketMatches] = useState([]);

    useEffect(() => {
        // Connect to socket
        connectSocket();

        // Listen for cricket updates
        const handleCricketUpdate = (matches) => {
            console.log('📊 Received cricket update:', matches?.length || 0, 'matches');
            setCricketMatches(matches || []);
        };

        socket.on('cricket_update', handleCricketUpdate);

        // Cleanup
        return () => {
            socket.off('cricket_update', handleCricketUpdate);
        };
    }, []);

    return cricketMatches;
};

/**
 * Hook to listen for all live scores (cricket, football, basketball)
 * @returns {Object} { cricket, football, basketball, timestamp }
 */
export const useLiveScores = () => {
    const [scores, setScores] = useState({
        cricket: null,
        football: null,
        basketball: null,
        timestamp: null
    });

    useEffect(() => {
        // Connect to socket
        connectSocket();

        // Listen for all scores update
        const handleAllScoresUpdate = (allScores) => {
            console.log('🔄 Received all scores update');
            setScores(allScores);
        };

        // Listen for individual sport updates
        const handleCricketUpdate = (matches) => {
            setScores(prev => ({ ...prev, cricket: matches }));
        };

        const handleFootballUpdate = (matches) => {
            setScores(prev => ({ ...prev, football: matches }));
        };

        const handleBasketballUpdate = (matches) => {
            setScores(prev => ({ ...prev, basketball: matches }));
        };

        socket.on('all_scores_update', handleAllScoresUpdate);
        socket.on('cricket_update', handleCricketUpdate);
        socket.on('football_update', handleFootballUpdate);
        socket.on('basketball_update', handleBasketballUpdate);

        // Cleanup
        return () => {
            socket.off('all_scores_update', handleAllScoresUpdate);
            socket.off('cricket_update', handleCricketUpdate);
            socket.off('football_update', handleFootballUpdate);
            socket.off('basketball_update', handleBasketballUpdate);
        };
    }, []);

    return scores;
};

export default useLiveCricketScores;
