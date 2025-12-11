
function switchView(viewId) {
    // Hide all active views
    document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));

    // Show target view
    const target = document.getElementById(viewId);
    if (target) {
        target.classList.add('active');
    }

    // Determine which nav item should be active
    const navs = document.querySelectorAll('.nav-item');
    if (viewId === 'home') {
        navs[0].classList.add('active');
    } else if (['matches', 'match-detail', 'football-detail', 'basketball-detail'].includes(viewId)) {
        navs[1].classList.add('active'); // Matches
    } else if (viewId === 'news') {
        navs[2].classList.add('active');
    } else if (viewId === 'series') {
        navs[3].classList.add('active');
    }

    // Close sidebar on mobile when navigating
    if (window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.remove('open');
        document.getElementById('sidebar-overlay').classList.remove('active');
    }
}

function switchTab(tabId, clickedElement) {
    // clickedElement is now 'this' from the onclick handler
    // This is much more reliable than using the event object

    if (!clickedElement) {
        console.error('No element provided to switchTab');
        return;
    }

    // Find the container (specific view or body)
    const container = clickedElement.closest('.view') || document.body;

    // Remove active class from all tabs and content within this container
    container.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    container.querySelectorAll('.tab').forEach(el => el.classList.remove('active'));

    // Add active class to selected tab content
    const tabContent = document.getElementById(tabId);
    if (tabContent) {
        tabContent.classList.add('active');
    }

    // Add active class to clicked tab
    clickedElement.classList.add('active');

    // Scroll active tab into view on mobile
    if (window.innerWidth <= 768) {
        // Smooth scroll to center the active tab
        setTimeout(() => {
            clickedElement.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }, 50);
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
}

// --- DYNAMIC SIMULATION ---
// Simulate live updates for the score
setInterval(() => {
    const scoreElement = document.querySelector('#match-detail .match-score-display');
    if (scoreElement && scoreElement.textContent.includes('/')) {
        // It's a cricket score like "248/3"
        let [runs, wickets] = scoreElement.textContent.split('/').map(Number);

        // Randomly add runs
        if (Math.random() > 0.7) {
            runs += Math.floor(Math.random() * 4) + 1; // 1 to 4 runs or boundary

            // Small chance of wicket
            if (Math.random() > 0.95 && wickets < 10) {
                wickets += 1;
                showToast('🏏 WICKET! A big breakthrough!');
            } else if (Math.random() > 0.6) {
                showToast(`🏏 Score Update: India moves to ${runs}/${wickets}`);
            }

            scoreElement.textContent = `${runs}/${wickets}`;

            // Flash effect
            scoreElement.style.color = '#3b82f6';
            setTimeout(() => scoreElement.style.color = '', 500);
        }
    }
}, 3000);

function showToast(msg) {
    const container = document.getElementById('toast-container');
    if (container) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i class="fas fa-bell" style="color: #3b82f6;"></i> <div>${msg}</div>`;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    } else {
        console.log(msg);
    }
}

// --- SEARCH FUNCTIONALITY ---

// Mock search data
const searchData = {
    matches: [
        { id: 1, title: 'India vs Australia', subtitle: 'Live • Cricket', icon: 'cricket-ball', badge: 'LIVE' },
        { id: 2, title: 'Man Utd vs Chelsea', subtitle: 'Live • Football', icon: 'futbol', badge: 'LIVE' },
        { id: 3, title: 'Lakers vs Warriors', subtitle: 'Live • Basketball', icon: 'basketball-ball', badge: 'LIVE' },
        { id: 4, title: 'England vs Pakistan', subtitle: 'Tomorrow • Cricket', icon: 'cricket-ball' },
        { id: 5, title: 'Real Madrid vs Barcelona', subtitle: 'Tomorrow • Football', icon: 'futbol' }
    ],
    teams: [
        { id: 1, title: 'India Cricket', subtitle: 'National Team', icon: 'users' },
        { id: 2, title: 'Manchester United', subtitle: 'Premier League', icon: 'users' },
        { id: 3, title: 'Los Angeles Lakers', subtitle: 'NBA', icon: 'users' },
        { id: 4, title: 'Australia Cricket', subtitle: 'National Team', icon: 'users' }
    ],
    players: [
        { id: 1, title: 'Virat Kohli', subtitle: 'India • Batsman', icon: 'user' },
        { id: 2, title: 'Cristiano Ronaldo', subtitle: 'Al Nassr • Forward', icon: 'user' },
        { id: 3, title: 'LeBron James', subtitle: 'Lakers • Forward', icon: 'user' },
        { id: 4, title: 'Steve Smith', subtitle: 'Australia • Batsman', icon: 'user' }
    ],
    news: [
        { id: 1, title: 'India wins thriller against Australia', subtitle: 'Cricket News • 2 hours ago', icon: 'newspaper' },
        { id: 2, title: 'Transfer News: Big signing confirmed', subtitle: 'Football News • 5 hours ago', icon: 'newspaper' },
        { id: 3, title: 'Lakers extend winning streak', subtitle: 'Basketball News • 1 day ago', icon: 'newspaper' }
    ]
};

let currentFilter = 'all';
let recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');

function openSearch() {
    const modal = document.getElementById('search-modal');
    if (modal) {
        modal.classList.add('active');
        const input = document.getElementById('search-input');
        if (input) {
            input.focus();
            input.value = '';
        }
        showRecentSearches();
    }
}

function closeSearch() {
    const modal = document.getElementById('search-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function setSearchFilter(filter) {
    currentFilter = filter;

    // Update filter chips
    document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.classList.remove('active');
    });
    event.target.classList.add('active');

    // Perform search with current input
    const input = document.getElementById('search-input');
    if (input && input.value) {
        performSearch(input.value);
    }
}

function performSearch(query) {
    const resultsContainer = document.getElementById('search-results');
    if (!resultsContainer) return;

    if (!query || query.trim() === '') {
        showRecentSearches();
        return;
    }

    query = query.toLowerCase();
    let results = {
        matches: [],
        teams: [],
        players: [],
        news: []
    };

    // Filter results based on current filter and query
    if (currentFilter === 'all' || currentFilter === 'matches') {
        results.matches = searchData.matches.filter(item =>
            item.title.toLowerCase().includes(query) ||
            item.subtitle.toLowerCase().includes(query)
        );
    }

    if (currentFilter === 'all' || currentFilter === 'teams') {
        results.teams = searchData.teams.filter(item =>
            item.title.toLowerCase().includes(query) ||
            item.subtitle.toLowerCase().includes(query)
        );
    }

    if (currentFilter === 'all' || currentFilter === 'players') {
        results.players = searchData.players.filter(item =>
            item.title.toLowerCase().includes(query) ||
            item.subtitle.toLowerCase().includes(query)
        );
    }

    if (currentFilter === 'all' || currentFilter === 'news') {
        results.news = searchData.news.filter(item =>
            item.title.toLowerCase().includes(query) ||
            item.subtitle.toLowerCase().includes(query)
        );
    }

    displaySearchResults(results, query);
}

function displaySearchResults(results, query) {
    const resultsContainer = document.getElementById('search-results');
    if (!resultsContainer) return;

    const totalResults = results.matches.length + results.teams.length +
        results.players.length + results.news.length;

    if (totalResults === 0) {
        resultsContainer.innerHTML = `
            <div class="search-empty">
                <i class="fas fa-search"></i>
                <p>No results found</p>
                <small>Try searching for matches, teams, players, or news</small>
            </div>
        `;
        return;
    }

    let html = '';

    if (results.matches.length > 0) {
        html += `
            <div class="search-section">
                <div class="search-section-title">Matches</div>
                ${results.matches.map(item => createSearchItem(item)).join('')}
            </div>
        `;
    }

    if (results.teams.length > 0) {
        html += `
            <div class="search-section">
                <div class="search-section-title">Teams</div>
                ${results.teams.map(item => createSearchItem(item)).join('')}
            </div>
        `;
    }

    if (results.players.length > 0) {
        html += `
            <div class="search-section">
                <div class="search-section-title">Players</div>
                ${results.players.map(item => createSearchItem(item)).join('')}
            </div>
        `;
    }

    if (results.news.length > 0) {
        html += `
            <div class="search-section">
                <div class="search-section-title">News</div>
                ${results.news.map(item => createSearchItem(item)).join('')}
            </div>
        `;
    }

    resultsContainer.innerHTML = html;
    // Don't save to recent searches here - only save when user selects a result
}

function createSearchItem(item) {
    const badgeHtml = item.badge ? `<span class="search-item-badge">${item.badge}</span>` : '';

    return `
        <div class="search-item" onclick="selectSearchItem('${item.title}')">
            <div class="search-item-icon">
                <i class="fas fa-${item.icon}"></i>
            </div>
            <div class="search-item-content">
                <div class="search-item-title">${item.title}</div>
                <div class="search-item-subtitle">${item.subtitle}</div>
            </div>
            ${badgeHtml}
        </div>
    `;
}

function selectSearchItem(title) {
    // Save the search query to recent searches
    const input = document.getElementById('search-input');
    if (input && input.value) {
        saveRecentSearch(input.value);
    }
    showToast(`Selected: ${title}`);
    closeSearch();
}

function showRecentSearches() {
    const resultsContainer = document.getElementById('search-results');
    if (!resultsContainer) return;

    if (recentSearches.length === 0) {
        resultsContainer.innerHTML = `
            <div class="search-empty">
                <i class="fas fa-history"></i>
                <p>No recent searches</p>
                <small>Start typing to search for matches, teams, players, or news</small>
            </div>
        `;
        return;
    }

    const html = `
        <div class="recent-searches">
            <div class="search-section-title">Recent Searches</div>
            ${recentSearches.map((search, index) => `
                <div class="recent-search-item">
                    <div class="recent-search-text" onclick="searchRecent('${search}')">
                        <i class="fas fa-history"></i>
                        <span>${search}</span>
                    </div>
                    <i class="fas fa-times recent-search-remove" onclick="removeRecentSearch(${index})"></i>
                </div>
            `).join('')}
        </div>
    `;

    resultsContainer.innerHTML = html;
}

function saveRecentSearch(query) {
    if (!query || query.trim() === '') return;

    // Remove if already exists
    recentSearches = recentSearches.filter(s => s !== query);

    // Add to beginning
    recentSearches.unshift(query);

    // Keep only last 5
    recentSearches = recentSearches.slice(0, 5);

    // Save to localStorage
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
}

function searchRecent(query) {
    const input = document.getElementById('search-input');
    if (input) {
        input.value = query;
        performSearch(query);
    }
}

function removeRecentSearch(index) {
    event.stopPropagation();
    recentSearches.splice(index, 1);
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    showRecentSearches();
}

function clearRecentSearches() {
    recentSearches = [];
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    showRecentSearches();
}

// Close search when clicking outside
document.addEventListener('click', (e) => {
    const modal = document.getElementById('search-modal');
    if (modal && e.target === modal) {
        closeSearch();
    }
});
