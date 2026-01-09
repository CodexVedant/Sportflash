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
                // logDebug(`   -> Full Object: ${JSON.stringify(found)}`); // enable if desperate

                if (found.playerImg) {
                    logDebug(`   -> ✅ Applied image: ${found.playerImg}`);
                    return { ...player, photo: found.playerImg };
                } else {
                    logDebug(`   -> ⚠️ Player found but no image.`);
                }
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

            if (sport?.toLowerCase() === 'cricket') {
                const cricketPlayers = await allSportsApi.getCricketPlayer(nameToSearch);
                if (cricketPlayers && cricketPlayers.length > 0) {
                    // Found it! Return the first match
                    const found = cricketPlayers[0];
                    // console.log('DEBUG: Found Cricket Player by Name:', found);
                    let mapped = mapPlayer(found, 'cricket');
                    mapped = await enrichCricketPlayerImage(mapped);
                    return res.json({ success: true, data: mapped });
                }
            } else if (sport?.toLowerCase() === 'football' || sport?.toLowerCase() === 'soccer') {
                const footballPlayers = await allSportsApi.getFootballPlayer(nameToSearch);
                if (footballPlayers && footballPlayers.length > 0) {
                    const found = footballPlayers[0];
                    const mapped = mapPlayer(found, 'football');
                    return res.json({ success: true, data: mapped });
                }
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
