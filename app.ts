class VideoPlayer {
    constructor(containerSelector, options = {}) {
        // Конфигурация
        this.options = {
            width: 640,
            autoplay: false,
            ...options
        };

        // Инициализация элементов
        this.container = document.querySelector(containerSelector);
        if (!this.container) {
            throw new Error(`Container ${containerSelector} not found`);
        }

        this.initElements();
        this.setupEventListeners();
    };

    initElements() {
        // Создаем DOM-структуру
        this.container.innerHTML = `  
          <div class="video-container" style="width: ${this.options.width}px">  
            <video class="video-element">  
              <source src="${this.options.src}" type="video/mp4">  
              Ваш браузер не поддерживает HTML5 видео.            
            </video>  
            <div class="video-controls">  
              <button class="play-button">►</button>  
              <input type="range" class="progress-bar" min="0" value="0">  
              <button class="mute-button">🔊</button>  
              <input type="range" class="volume-bar" min="0" max="1" step="0.1" value="1">  
              <span class="time-display">00:00 / 00:00</span>  
              <span class="full-screen-button">⛶</span>
            </div>  
          </div>  
        `;

        // Получаем ссылки на элементы
        this.video = this.container.querySelector('.video-element');
        this.playButton = this.container.querySelector('.play-button');
        this.progressBar = this.container.querySelector('.progress-bar');
        this.muteButton = this.container.querySelector('.mute-button');
        this.volumeBar = this.container.querySelector('.volume-bar');
        this.timeDisplay = this.container.querySelector('.time-display');
        this.fullScreenButton = this.container.querySelector('.full-screen-button');

        this.progressBar.style.setProperty('--progress', '0%');
        this.progressBar.style.setProperty('--buffered', '0%');
    }

    setupEventListeners() {
        // Кнопка воспроизведения
        this.playButton.addEventListener('click', () => this.togglePlay());

        // Прогресс бар
        this.progressBar.addEventListener('input', () => this.seekVideo());
        this.video.addEventListener('timeupdate', () => this.updateTime());
        this.video.addEventListener('progress', () => this.updateProgress());
        document.addEventListener('keydown', (e) => {
            this.stepVideo(e);
            this.togglePlayPause(e);
        });

        // Громкость
        this.volumeBar.addEventListener('input', () => this.setVolume());
        this.muteButton.addEventListener('click', () => this.toggleMute());

        // Кнопка полноэкранный режим
        this.fullScreenButton.addEventListener('click', () => this.toggleFullScreen());


        // Обработка ошибок
        this.video.addEventListener('error', () => this.handleError());

    }

    togglePlay() {
        if (this.video.paused) {
            this.video.play();
            this.playButton.textContent = '❚❚';
        } else {
            this.video.pause();
            this.playButton.textContent = '►';
        }
    }

    updateTime() {
        const progress = (this.video.currentTime / this.video.duration) * 100;
        this.progressBar.value = progress || 0;
        this.updateTimeDisplay();
    }

    seekVideo() {
        this.video.currentTime = (this.progressBar.value / 100) * this.video.duration;
    }

    setVolume() {
        this.video.volume = this.volumeBar.value;
        this.video.muted = false;
        this.muteButton.textContent = '🔊';
    }

    toggleMute() {
        this.video.muted = !this.video.muted;
        this.muteButton.textContent = this.video.muted ? '🔇' : '🔊';
        this.volumeBar.value = this.video.muted ? 0 : this.video.volume;
    }

    updateTimeDisplay() {
        const formatTime = (seconds) => {
            const minutes = Math.floor(seconds / 60);
            seconds = Math.floor(seconds % 60);
            return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        };

        this.timeDisplay.textContent = `${formatTime(this.video.currentTime)} / ${formatTime(this.video.duration)}`;

        if (this.video.duration) {
            const progressPercent = (this.video.currentTime / this.video.duration) * 100;
            this.progressBar.style.setProperty('--progress', `${progressPercent}%`);
        }
    }

    handleError() {
        console.error('Video error:', this.video.error);
        this.playButton.disabled = true;
        this.timeDisplay.textContent = 'Ошибка воспроизведения';
    }

    updateProgress() {
        if (this.video.buffered.length > 0 && this.video.duration) {
            const bufferedEnd = this.video.buffered.end(this.video.buffered.length - 1);
            const bufferedPercent = (bufferedEnd / this.video.duration) * 100;
            this.progressBar.style.setProperty('--buffered', `${bufferedPercent}%`);
        }
    }

    toggleFullScreen() {
        this.video.requestFullscreen()
    }

    stepVideo(e) {
        if (e.code === 'ArrowRight') {
            this.video.currentTime += 5;
        } else if (e.code === 'ArrowLeft') {
            this.video.currentTime -= 5;
        }
    }

    togglePlayPause(e) {
        if (e.code === 'Space') {
            if (this.video.paused) {
                this.video.play();
                this.playButton.textContent = '❚❚';
            } else {
                this.video.pause();
                this.playButton.textContent = '►';
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new VideoPlayer('#player-container', {
        src: 'sample.mp4',
        width: 800,
        autoplay: false
    });
});
