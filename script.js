function switchView(viewId) {
    // Hide all active views
    document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));

    // Show target view
    document.getElementById(viewId).classList.add('active');

    // Find nav item (imperfect selector for demo but works)
    const navs = document.querySelectorAll('.nav-item');
    if (viewId === 'home') navs[0].classList.add('active');
    if (viewId === 'matches') navs[1].classList.add('active');
    if (viewId === 'news') navs[2].classList.add('active');
    if (viewId === 'series') navs[3].classList.add('active');

    // Close sidebar on mobile when navigating
    if (window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.remove('open');
    }
}

function switchTab(tabId) {
    const container = event.target.closest('.view') || document.body;
    container.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    container.querySelectorAll('.tab').forEach(el => el.classList.remove('active'));

    document.getElementById(tabId).classList.add('active');
    event.target.classList.add('active');
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
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
