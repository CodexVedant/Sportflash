const https = require('https');

const API_KEY = "32501aba-64c8-4611-9c82-fb0f8affd04b";
const playerName = "Parvez Hossain Emon";
const encodedName = encodeURIComponent(playerName);
// CricketData.org Players Search Endpoint
const url = `https://api.cricapi.com/v1/players?apikey=${API_KEY}&offset=0&search=${encodedName}`;

console.log(`Testing CricketData.org Key...`);
console.log(`URL: ${url}`);

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            console.log('Response JSON:', JSON.stringify(json, null, 2));

            if (json.status === "success" && json.data && json.data.length > 0) {
                console.log('FOUND_IMAGE_URL:' + json.data[0].playerImg);
                console.log('FOUND_NAME:' + json.data[0].name);
            } else {
                console.log('❌ Search failed or Player not found.');
                console.log('Status:', json.status, json.reason || '');
            }
        } catch (e) {
            console.error('Error parsing JSON:', e.message);
            console.log('Raw Data:', data);
        }
    });
}).on('error', (e) => {
    console.error('Request Error:', e);
});
