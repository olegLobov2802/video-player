const video = document.getElementById('my-video');
const playButton = document.getElementById('play-button');
const progressBar = document.getElementById('progress-bar');
const muteButton = document.getElementById('mute-button');
const volumeBar = document.getElementById('volume-bar');
const fullscreenButton = document.getElementById('fullscreen-button');

progressBar.style.setProperty('--progress', '0%');
progressBar.style.setProperty('--buffered', '0%');

video.addEventListener('loadedmetadata', () => {
    console.log('Длительность видео:', video.duration);
});

// 1. Управление воспроизведением
playButton.addEventListener('click', () => {
    if (video.paused) {
        video.play();
        playButton.textContent = '❚❚';
    } else {
        video.pause();
        playButton.textContent = '►';
    }
});

// 2. Обновление прогресса
video.addEventListener('timeupdate', () => {
    progressBar.value = (video.currentTime / video.duration) * 100;
});

// 3. Перемотка
progressBar.addEventListener('input', () => {
    video.currentTime = (progressBar.value / 100) * video.duration;
});

// 4. Громкость
volumeBar.addEventListener('input', () => {
    video.volume = volumeBar.value;
    muteButton.textContent = volumeBar.value === 0 ? '🔇' : '🔊';
});

// 5. Мьютирование
muteButton.addEventListener('click', () => {
    video.muted = !video.muted;
    muteButton.textContent = video.muted ? '🔇' : '🔊';
    volumeBar.value = video.muted ? 0 : video.volume;
});

video.addEventListener('error', () => {
    console.error('Ошибка видео:', video.error.message);
    alert('Ошибка загрузки видео :(');
});

// Проверка поддержки формата
if (!video.canPlayType('video/mp4')) {
    alert('Ваш браузер не поддерживает MP4!');
}

fullscreenButton.addEventListener('click', () => {
    video.requestFullscreen();
});

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        if (video.paused) {
            video.play();
            playButton.textContent = '❚❚';
        } else {
            video.pause();
            playButton.textContent = '►';
        }
    }

    // Перемотка стрелками ← и →
    if (e.code === 'ArrowRight') {
        video.currentTime += 5; // +5 секунд
    } else if (e.code === 'ArrowLeft') {
        video.currentTime -= 5; // -5 секунд
    }
})

// Обновление просмотренной части
video.addEventListener('timeupdate', () => {
    if (video.duration) {
        const progressPercent = (video.currentTime / video.duration) * 100;
        progressBar.style.setProperty('--progress', `${progressPercent}%`);
    }
});

video.addEventListener('progress', () => {
    if (video.buffered.length > 0 && video.duration) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        const bufferedPercent = (bufferedEnd / video.duration) * 100;
        progressBar.style.setProperty('--buffered', `${bufferedPercent}%`);
    }
});
