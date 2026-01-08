const https = require('https');

const playerName = "Parvez Hossain Emon";
const encodedName = encodeURIComponent(playerName);
const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodedName}&prop=pageimages&format=json&pithumbsize=500`;

console.log(`Searching Wikimedia for: ${playerName}`);
console.log(`URL: ${url}`);

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            const pages = json.query.pages;
            const pageId = Object.keys(pages)[0];
            const page = pages[pageId];

            if (pageId === '-1') {
                console.log('Page not found on Wikipedia.');
            } else if (page.thumbnail) {
                console.log('Found Image on Wikipedia!');
                console.log('Source:', page.thumbnail.source);
            } else {
                console.log('Page found, but NO thumbnail image.');
            }
        } catch (e) {
            console.error('Error parsing JSON:', e.message);
        }
    });
}).on('error', (e) => {
    console.error('Request Error:', e);
});
