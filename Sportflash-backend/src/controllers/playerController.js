const axios = require('axios');
const fs = require('fs');
const path = require('path');
const allSportsApi = require('../services/allSportsApiService');
const { mapPlayer } = require('../utils/dataMappers');

const logDebug = (msg) => {
    const logFile = path.resolve('debug_player.log'); // Use CWD
    const timestamp = new Date().toISOString();
    try {
        fs.appendFileSync(logFile, `[${timestamp}] ${msg}\n`);
    } catch (e) {
        console.error('Log Write Error:', e);
    }
};

// ---------------------------------------------------------
// MANUAL FALLBACK DATA (For API Gaps/Errors)
// ---------------------------------------------------------
const knownPlayers = {
    "A Raghuvanshi": { nationality: "India", position: "Batsman", team: "Kolkata Knight Riders" },
    "Angkrish Raghuvanshi": { nationality: "India", position: "Batsman", team: "Kolkata Knight Riders" },
    "TL Seifert": { nationality: "New Zealand", position: "Wicket Keeper / Batsman", team: "Melbourne Stars" },
    "H Amarasinghe": { nationality: "Sri Lanka", position: "All Rounder", team: "Noakhali Express" }
};
// ---------------------------------------------------------

// Helper to fetch image from Wikipedia
const enrichWikiPlayerImage = async (player) => {
    if (player.photo) return player;

    const cleanName = player.name.trim();
    logDebug(`🔍 Enriching image for [${cleanName}] via Wikipedia...`);

    try {
        const encodedName = encodeURIComponent(cleanName);
        const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodedName}&prop=pageimages&format=json&pithumbsize=500`;

        const response = await axios.get(url);
        const pages = response.data?.query?.pages;

        if (pages) {
            const pageId = Object.keys(pages)[0];
            const page = pages[pageId];

            if (pageId !== '-1' && page.thumbnail?.source) {
                logDebug(`   -> ✅ Wiki Image Found: ${page.thumbnail.source}`);
                return { ...player, photo: page.thumbnail.source };
            }
        }
        logDebug(`   -> ❌ No Wiki image found.`);
    } catch (error) {
        logDebug(`   -> Wiki Error: ${error.message}`);
    }
    return player;
};

// Helper to fetch image from CricketData.org
const enrichCricketPlayerImage = async (player) => {
    // 1. Try CricketData.org
    if (player.photo) return player; // Already has photo

    const apiKey = process.env.CRICKET_API_KEY;
    if (apiKey) {
        const cleanName = player.name.trim();
        logDebug(`🔍 Enriching image for [${cleanName}] via CricketData API...`);

        try {
            const response = await axios.get(`https://api.cricapi.com/v1/players`, {
                params: {
                    apikey: apiKey,
                    offset: 0,
                    search: cleanName
                }
            });

            logDebug(`   -> CricAPI Status: ${response.data?.status}, Found: ${response.data?.data?.length}`);

            if (response.data && response.data.status === 'success' && response.data.data?.length > 0) {
                const found = response.data.data[0];
                logDebug(`   -> Match found: ${found.name}, Keys: ${Object.keys(found).join(', ')}`);

                if (found.playerImg) {
                    logDebug(`   -> ✅ Applied image: ${found.playerImg}`);
                }

                // Enhanced Enrichment: Get Role and Country too if missing
                const enriched = { ...player };
                if (!enriched.photo && found.playerImg) enriched.photo = found.playerImg;
                if ((!enriched.position || enriched.position === 'Player') && found.role) enriched.position = found.role;
                if ((!enriched.nationality || enriched.nationality === 'Unknown') && found.country) enriched.nationality = found.country;

                return enriched;
            } else {
                logDebug(`   -> ❌ No match found for: ${cleanName}`);
            }
        } catch (error) {
            logDebug(`   -> ERROR: ${error.message}`);
            console.error('Failed to enrich cricket player image:', error.message);
        }
    }

    // 2. Fallback to Wikipedia
    return await enrichWikiPlayerImage(player);
};

/**
 * @desc    Get player details
 * @route   GET /api/players/:id
 * @access  Public
 */
exports.getPlayer = async (req, res) => {
    logDebug(`📢 getPlayer called for ID: ${req.params.id}, Sport: ${req.query.sport}`);
    try {
        let { id } = req.params;
        const { sport } = req.query;

        // HANDLE NAME-BASED LOOKUP
        if (id.startsWith('name_')) {
            const nameToSearch = id.replace('name_', '');
            logDebug(`⚠️ ID missing. Performing fallback search for name: ${nameToSearch}`);

            // INTERNAL HELPER: Try Finding Player in a specific sport
            const tryFind = async (s) => {
                if (s === 'cricket') {
                    const res = await allSportsApi.getCricketPlayer(nameToSearch);
                    if (res && res.length > 0) return { data: res[0], type: 'cricket' };
                }
                if (s === 'football' || s === 'soccer') {
                    const res = await allSportsApi.getFootballPlayer(nameToSearch);
                    if (res && res.length > 0) return { data: res[0], type: 'football' };
                }
                return null;
            };

            // 1. Try requested sport first
            let result = await tryFind(sport?.toLowerCase());

            // 2. If not found, try others (Fallback Strategy)
            if (!result) {
                logDebug(`   -> Not found in ${sport}. Trying other sports...`);
                const others = ['cricket', 'football'].filter(x => x !== sport?.toLowerCase());
                for (const other of others) {
                    result = await tryFind(other);
                    if (result) {
                        logDebug(`   -> Found in fallback sport: ${other}`);
                        break;
                    }
                }
            }

            if (result) {
                console.log(`DEBUG: Raw Player Data (${result.type}):`, JSON.stringify(result.data, null, 2)); // DEBUG STATS
                let mapped = mapPlayer(result.data, result.type);
                if (result.type === 'cricket') mapped = await enrichCricketPlayerImage(mapped);
                return res.json({ success: true, data: mapped });
            }

            // If API search fails, fall back to Dummy for Cricket (to at least show something)
            if (sport?.toLowerCase() === 'cricket') {
                // Construct a dummy player object and enrich it
                let dummyPlayer = {
                    id: null,
                    name: nameToSearch,
                    sport: 'cricket',
                    photo: null
                };
                dummyPlayer = await enrichCricketPlayerImage(dummyPlayer);
                return res.json({
                    success: true,
                    data: dummyPlayer
                });
            }
        }

        if (!sport) {
            return res.status(400).json({
                success: false,
                message: 'Sport parameter is required'
            });
        }

        let playerData = null;
        let mappedPlayer = null;

        switch (sport.toLowerCase()) {
            case 'football':
            case 'soccer':
                const footballPlayers = await allSportsApi.getFootballPlayer(id);
                if (footballPlayers && footballPlayers.length > 0) {
                    playerData = footballPlayers[0];
                    mappedPlayer = mapPlayer(playerData, 'football');
                }
                break;

            case 'cricket':
                const cricketPlayers = await allSportsApi.getCricketPlayer(id);
                // console.log('🏏 Cricket Player Raw Data:', JSON.stringify(cricketPlayers?.[0] || 'No Data', null, 2));

                if (cricketPlayers && cricketPlayers.length > 0) {
                    playerData = cricketPlayers[0];
                    mappedPlayer = mapPlayer(playerData, 'cricket');
                    // ENRICH: If no photo, try CricketData.org
                    if (!mappedPlayer.photo) {
                        mappedPlayer = await enrichCricketPlayerImage(mappedPlayer);
                    }
                }
                break;

            case 'basketball':
                // Currently not supported by base API service for direct Player ID lookup
                return res.status(501).json({
                    success: false,
                    message: `Player details for ${sport} are not yet supported.`
                });

            default:
                return res.status(400).json({
                    success: false,
                    message: 'Invalid sport specified'
                });
        }

        if (!mappedPlayer) {
            return res.status(404).json({
                success: false,
                message: 'Player not found'
            });
        }

        res.json({
            success: true,
            data: mappedPlayer
        });

    } catch (error) {
        console.error('Error in getPlayer:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching player details',
            error: error.message
        });
    }
};
