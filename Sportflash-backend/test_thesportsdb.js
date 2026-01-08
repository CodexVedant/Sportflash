const https = require('https');

const playerName = "Parvez Hossain Emon";
const encodedName = encodeURIComponent(playerName);
const url = `https://www.thesportsdb.com/api/v1/json/1/searchplayers.php?p=${encodedName}`;

console.log(`Searching TheSportsDB for: ${playerName}`);
console.log(`URL: ${url}`);

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.player && json.player.length > 0) {
                const p = json.player[0];
                console.log('Found Player!');
                console.log('Correct Name:', p.strPlayer);
                console.log('Thumb:', p.strThumb);
                console.log('Cutout:', p.strCutout);
                console.log('Render:', p.strRender);
                console.log('Banner:', p.strBanner);
            } else {
                console.log('Player not found in TheSportsDB.');
            }
        } catch (e) {
            console.error('Error parsing JSON:', e.message);
            console.log('Raw Data:', data);
        }
    });
}).on('error', (e) => {
    console.error('Request Error:', e);
});
