const steamId = '76561198286975191'; 
const backendUrl = 'https://backend-server-bjaq.onrender.com'; 

// ==========================================
// Helper: Check if text is too long and needs marquee
// ==========================================
function checkMarquees() {
  const items = document.querySelectorAll('#track-name, #game-name');
  
  items.forEach(item => {
    const parent = item.parentElement;
    
    // 1. Temporarily force the text to its natural, un-squished width to measure it
    item.style.display = 'inline-block';
    item.style.width = 'max-content';
    
    // 2. Measure the true widths
    const textWidth = item.scrollWidth;
    const containerWidth = parent.clientWidth;
    
    // 3. If text is wider than the container, activate marquee
    if (textWidth > containerWidth) {
      item.classList.add('auto-marquee');
      const scrollDistance = textWidth - containerWidth;
      // Set the exact pixel distance it needs to scroll to reveal the end
      item.style.setProperty('--scroll-distance', `-${scrollDistance}px`);
    } else {
      item.classList.remove('auto-marquee');
      item.style.removeProperty('--scroll-distance');
    }
    
    // 4. Clean up inline styles so the CSS classes can take over cleanly
    item.style.display = '';
    item.style.width = '';
  });
}

// ==========================================
// 1. Fetch Last Played Game
// ==========================================
async function fetchLastPlayedGame() {
    try {
        const response = await fetch(`${backendUrl}/api/last-played?steamid=${steamId}`);
        const data = await response.json();

        const iconElement = document.getElementById('game-icon');
        const labelElement = document.getElementById('game-label');
        const nameElement = document.getElementById('game-name');

        if (data.icon)
        {
            iconElement.style.backgroundImage = `url('${data.icon}')`;
            iconElement.style.display = 'block';
            labelElement.textContent = 'Most Played Game';
            nameElement.textContent = data.name;
        } else {
            iconElement.style.display = 'none';
            labelElement.textContent = '';
            nameElement.textContent = data.name || "Unknown Game";
        }
        
        // CRITICAL: Wait one frame for the browser to render the new text, THEN measure
        setTimeout(() => checkMarquees(), 50);

    } catch (error) {
        console.error("Error fetching game:", error);
        document.getElementById('game-label').textContent = '';
        document.getElementById('game-name').textContent = "Couldn't load data.";
        setTimeout(() => checkMarquees(), 50);
    }
}

// ==========================================
// 2. Fetch Last.fm Track
// ==========================================
async function fetchLastFmTrack() {
    const lastfmUsername = 'karhukarhu'; 
    
    try {
        const response = await fetch(`${backendUrl}/api/lastfm-track?username=${lastfmUsername}`);
        const data = await response.json();

        const imgElement = document.getElementById('track-image');
        const labelElement = document.getElementById('track-label');
        const nameElement = document.getElementById('track-name');
        const artistElement = document.getElementById('track-artist');

        if (data.name && data.name !== "No recent tracks") {
            if (data.image) {
                imgElement.style.backgroundImage = `url('${data.image}')`;
                imgElement.style.display = 'block';
            } else {
                imgElement.style.display = 'none';
            }

            const status = data.nowPlaying ? "Now Playing" : "Last Played Music";
            labelElement.textContent = status;
            nameElement.textContent = data.name;
            artistElement.textContent = data.artist;
        } else {
            imgElement.style.display = 'none';
            labelElement.textContent = "No recent tracks";
            nameElement.textContent = "";
            artistElement.textContent = "";
        }
        
        // CRITICAL: Wait one frame for the browser to render the new text, THEN measure
        setTimeout(() => checkMarquees(), 50);

    } catch (error) {
        console.error("Error fetching Last.fm:", error);
        document.getElementById('track-label').textContent = "Couldn't load music data.";
        document.getElementById('track-name').textContent = "";
        document.getElementById('track-artist').textContent = "";
        setTimeout(() => checkMarquees(), 50);
        }
}

// ==========================================
// 3. Fetch Steam Profile
// ==========================================
async function fetchSteamData() {
    try {
        const response = await fetch(`${backendUrl}/api/steam-profile?steamid=${steamId}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        console.log("Player Name:", data.personaname);
    } catch (error) {
        console.error("Error fetching profile:", error);
    }
}

// ==========================================
// 4. Owner Clock
// ==========================================
function updateOwnerClock() {
    const clockElement = document.getElementById('owner-clock');
    const statusElement = document.getElementById('owner-status');
    
    if (!clockElement || !statusElement) return;

    const myTimeZone = 'Europe/Helsinki'; 
    const now = new Date();

    const hourOptions = { timeZone: myTimeZone, hour: '2-digit', hour12: false };
    const currentHour = parseInt(now.toLocaleTimeString('en-US', hourOptions), 10);

    let statusMessage = "so I might or might not be around"; 
    
    if (currentHour >= 23 || currentHour < 9) {
      statusMessage = "so I'm probably sleeping";
    } else if (currentHour >= 9 && currentHour < 17) {
      statusMessage = "so I'm probably awake but afk";
    } else if (currentHour >= 17 && currentHour < 23) {
      statusMessage = "so I'm pretty sure I'm online";
    }

    const timeOptions = { timeZone: myTimeZone, hour: '2-digit', minute: '2-digit' };
    const timeString = now.toLocaleTimeString('fi-FI', timeOptions);
    
    clockElement.textContent = timeString;
    statusElement.textContent = statusMessage;
}

// ==========================================
// 5. Initialize Everything on Load
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    fetchSteamData();
    fetchLastPlayedGame();
    fetchLastFmTrack();
    
    updateOwnerClock();
    setInterval(updateOwnerClock, 60000);
    
    // Initial check on load
    setTimeout(() => checkMarquees(), 100); 
});

// BONUS: Re-check if the user resizes the window
window.addEventListener('resize', () => {
    setTimeout(() => checkMarquees(), 100);
});