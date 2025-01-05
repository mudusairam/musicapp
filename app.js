// YouTube API key (replace with your own key)
const API_KEY = 'AIzaSyAfXUQvK_0wdBO3Q00S8J0kzy5i1RCqsDI';  // Replace this with your YouTube API key



const searchInput = document.getElementById('search');
const searchButton = document.getElementById('search-btn');
const videoList = document.getElementById('video-list');
const playerContainer = document.getElementById('player-container');
const closeButton = document.getElementById('close-btn');

let player;  // Holds the YouTube player instance
let currentVideoId;  // Holds the currently selected video ID

// Function to search for videos from YouTube API
async function searchVideos(query) {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${encodeURIComponent(query)}&key=${API_KEY}`);
    const data = await response.json();

    // Clear previous video results
    videoList.innerHTML = '';

    // Display the fetched videos with thumbnails
    data.items.forEach(item => {
        const videoItem = document.createElement('div');
        videoItem.classList.add('video-item');

        const thumbnail = document.createElement('img');
        thumbnail.src = item.snippet.thumbnails.medium.url;
        thumbnail.alt = item.snippet.title;
        thumbnail.classList.add('video-thumbnail');

        const title = document.createElement('strong');
        title.textContent = item.snippet.title;

        const channelName = document.createElement('i');
        channelName.textContent = item.snippet.channelTitle;

        videoItem.appendChild(thumbnail);
        videoItem.appendChild(title);
        videoItem.appendChild(channelName);

        videoItem.onclick = () => playVideo(item.id.videoId);

        videoList.appendChild(videoItem);
    });
}

// Function to play a selected video and show player on top of all elements
function playVideo(videoId) {
    currentVideoId = videoId;
    
    playerContainer.style.display = 'block';

    if (player) {
        player.loadVideoById(videoId);
    } else {
        player = new YT.Player('player', {
            height: '360',
            width: '640',
            videoId: videoId,
            events: {
                'onReady': onPlayerReady
            }
        });
    }
}

// When the player is ready, auto-play the video
function onPlayerReady(event) {
    event.target.playVideo();
}

// Close the player overlay when the close button is clicked
closeButton.addEventListener('click', () => {
    playerContainer.style.display = 'none';
    if (player) {
        player.stopVideo();
    }
});

// Search button click
searchButton.addEventListener('click', () => {
    const query = searchInput.value;
    if (query) {
        searchVideos(query);
    }
});

// Load the YouTube Iframe API script dynamically
function loadYouTubeAPI() {
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(script);
}

// Call this function to load the YouTube API
loadYouTubeAPI();
