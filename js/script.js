// ========== 歌曲列表数据 ==========
const songs = [
    { title: "歌曲0", artist: "歌手0", src: "mp3/music0.mp3", cover: "img/record0.jpg" },
    { title: "歌曲1", artist: "歌手1", src: "mp3/music1.mp3", cover: "img/record1.jpg" },
    { title: "歌曲2", artist: "歌手2", src: "mp3/music2.mp3", cover: "img/record2.jpg" },
    { title: "歌曲3", artist: "歌手3", src: "mp3/music3.mp3", cover: "img/record3.jpg" }
];

// ========== 获取DOM元素 ==========
const audio = document.getElementById('audio');
const playPauseBtn = document.getElementById('playPauseBtn');
const playPauseIcon = document.getElementById('playPauseIcon');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const songTitle = document.getElementById('songTitle');
const songArtist = document.getElementById('songArtist');
const albumCover = document.getElementById('albumCover');
const progressBar = document.getElementById('progressBar');
const progressFill = document.getElementById('progressFill');
const currentTimeSpan = document.getElementById('currentTime');
const durationSpan = document.getElementById('duration');
const volumeBar = document.getElementById('volumeBar');
const volumeFill = document.getElementById('volumeFill');
const volumeBtn = document.getElementById('volumeBtn');
const volumeIcon = document.getElementById('volumeIcon');
const showPlaylistBtn = document.getElementById('showPlaylistBtn');
const closePlaylistBtn = document.getElementById('closePlaylistBtn');
const playlistModal = document.getElementById('playlistModal');
const playlistList = document.getElementById('playlistList');
const cdDisc = document.getElementById('cdDisc');
const musicWave = document.getElementById('musicWave');

// ========== 全局变量 ==========
let currentIndex = 0;      // 当前播放的歌曲索引
let isPlaying = false;      // 是否正在播放

// ========== 加载歌曲 ==========
function loadSong(index) {
    const song = songs[index];
    if (!song) return;
    
    audio.src = song.src;
    songTitle.textContent = song.title;
    songArtist.textContent = song.artist;
    albumCover.src = song.cover;
    
    // 重置进度条
    progressFill.style.width = '0%';
    currentTimeSpan.textContent = '0:00';
    
    // 更新播放列表高亮
    updatePlaylistHighlight();
}

// ========== 播放 ==========
function play() {
    audio.play();
    isPlaying = true;
    playPauseIcon.textContent = '⏸';
    cdDisc.classList.add('playing');
    musicWave.classList.add('active');
    updatePlaylistHighlight();
}

// ========== 暂停 ==========
function pause() {
    audio.pause();
    isPlaying = false;
    playPauseIcon.textContent = '▶';
    cdDisc.classList.remove('playing');
    musicWave.classList.remove('active');
    updatePlaylistHighlight();
}

// ========== 切换播放/暂停 ==========
function togglePlayPause() {
    if (isPlaying) {
        pause();
    } else {
        play();
    }
}

// ========== 下一曲 ==========
function nextSong() {
    currentIndex = (currentIndex + 1) % songs.length;
    loadSong(currentIndex);
    if (isPlaying) {
        play();
    }
}

// ========== 上一曲 ==========
function prevSong() {
    currentIndex = (currentIndex - 1 + songs.length) % songs.length;
    loadSong(currentIndex);
    if (isPlaying) {
        play();
    }
}

// ========== 格式化时间 (秒 -> mm:ss) ==========
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
}

// ========== 更新进度条 ==========
function updateProgress() {
    if (audio.duration) {
        const percent = (audio.currentTime / audio.duration) * 100;
        progressFill.style.width = `${percent}%`;
        currentTimeSpan.textContent = formatTime(audio.currentTime);
        durationSpan.textContent = formatTime(audio.duration);
    }
}

// ========== 点击进度条跳转 ==========
function setProgress(e) {
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percent = clickX / width;
    audio.currentTime = percent * audio.duration;
}

// ========== 更新音量显示 ==========
function updateVolumeDisplay() {
    const volume = audio.volume;
    volumeFill.style.width = `${volume * 100}%`;
    
    if (volume === 0) {
        volumeIcon.textContent = '🔇';
    } else if (volume < 0.5) {
        volumeIcon.textContent = '🔉';
    } else {
        volumeIcon.textContent = '🔊';
    }
}

// ========== 设置音量 ==========
function setVolume(e) {
    const rect = volumeBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    let volume = clickX / width;
    volume = Math.min(1, Math.max(0, volume));
    audio.volume = volume;
    updateVolumeDisplay();
}

// ========== 切换静音 ==========
function toggleMute() {
    if (audio.volume > 0) {
        audio.volume = 0;
    } else {
        audio.volume = 0.7;
    }
    updateVolumeDisplay();
}

// ========== 渲染播放列表 ==========
function renderPlaylist() {
    playlistList.innerHTML = '';
    
    songs.forEach((song, index) => {
        const li = document.createElement('li');
        li.className = index === currentIndex ? 'active' : '';
        
        li.innerHTML = `
            <img src="${song.cover}" alt="${song.title}">
            <div class="playlist-info">
                <h4>${song.title}</h4>
                <p>${song.artist}</p>
            </div>
            ${index === currentIndex && isPlaying ? '<span class="playing-badge">🎵</span>' : ''}
        `;
        
        li.addEventListener('click', () => {
            currentIndex = index;
            loadSong(currentIndex);
            play();
            closePlaylist();
        });
        
        playlistList.appendChild(li);
    });
}

// ========== 更新播放列表高亮 ==========
function updatePlaylistHighlight() {
    const items = playlistList.querySelectorAll('li');
    items.forEach((item, index) => {
        if (index === currentIndex) {
            item.classList.add('active');
            // 更新播放指示器
            const existingBadge = item.querySelector('.playing-badge');
            if (isPlaying && !existingBadge) {
                const badge = document.createElement('span');
                badge.className = 'playing-badge';
                badge.textContent = '🎵';
                item.appendChild(badge);
            } else if (!isPlaying && existingBadge) {
                existingBadge.remove();
            }
        } else {
            item.classList.remove('active');
            const badge = item.querySelector('.playing-badge');
            if (badge) badge.remove();
        }
    });
}

// ========== 显示播放列表 ==========
function showPlaylist() {
    renderPlaylist();
    playlistModal.classList.add('show');
}

// ========== 关闭播放列表 ==========
function closePlaylist() {
    playlistModal.classList.remove('show');
}

// ========== 绑定事件监听 ==========
function bindEvents() {
    playPauseBtn.addEventListener('click', togglePlayPause);
    prevBtn.addEventListener('click', prevSong);
    nextBtn.addEventListener('click', nextSong);
    
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateProgress);
    audio.addEventListener('ended', nextSong);
    
    progressBar.addEventListener('click', setProgress);
    volumeBar.addEventListener('click', setVolume);
    volumeBtn.addEventListener('click', toggleMute);
    
    showPlaylistBtn.addEventListener('click', showPlaylist);
    closePlaylistBtn.addEventListener('click', closePlaylist);
    
    // 点击弹窗背景关闭
    playlistModal.addEventListener('click', (e) => {
        if (e.target === playlistModal) {
            closePlaylist();
        }
    });
}

// ========== 初始化应用 ==========
function init() {
    loadSong(0);
    bindEvents();
    audio.volume = 0.7;
    updateVolumeDisplay();
}

// 启动应用
init();