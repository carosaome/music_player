const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const PLAYER_STORAGE_KEY = 'F8_PLAYER'

const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const volumeBtn = $('#volume');
const mutedBtn = $('#muted');
const playlist = $('.playlist')

const app = {
    currentIndex: 0,
    isPlaying: true,
    isRandom: false,
    isRepeat: false,
    isMuted: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: "Click Pow Get Down",
            singer: "Raftaar x Fortnite",
            path: "./asset/music/song 2.mp3",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTN6zGEZ2uOk8vTiA4TYYubV5cXP14S8zC5Sg&usqp=CAU"
        },
        {
            name: "Tu Phir Se Aana",
            singer: "Raftaar x Salim Merchant x Karma",
            path: "./asset/music/song1.mp3",
            image:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4erneTC7ZTJMFzMMW2M2RRkXyzaKGxaIg1w&usqp=CAU"
        },
        {
            name: "Naachne Ka Shaunq",
            singer: "Raftaar x Brobha V",
            path: "./asset/music/song3.mp3",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLnlkTywsCBj4xY-R2ap3P0puAUfFSxetiPg&usqp=CAU"
        },
        {
            name: "Mantoiyat",
            singer: "Raftaar x Nawazuddin Siddiqui",
            path: "./asset/music/song4.mp3",
            image:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGk4sa1czDzNWcnYl88RLRdjr6CIiNQotzXA&usqp=CAU"
        },
        {
            name: "Aage Chal",
            singer: "Raftaar",
            path: "./asset/music/song5.mp3",
            image:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzskSvTfav5Ycv-fKSDS-ma6HUUzYnVQWJNQ&usqp=CAU"
        },
        {
            name: "Damn",
            singer: "Raftaar x kr$na",
            path: "./asset/music/song6.mp3",

            image:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgk92QCC8QWggGeMPBIqFcyi7tXu046pcXKA&usqp=CAU"
        },
        {
            name: "Feeling You",
            singer: "Raftaar x Harjas",
            path: "./asset/music/song7.mp3",
            image:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFZkff9SEJMAOLE6Y3LlKDpSDnFmG0UkX-hg&usqp=CAU"
        }
    ],
    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    render: function () {
        let htmls = this.songs.map((song, index) => {
            // ${  index === this.currentIndex ? "active" : ""}
            return `<div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                  <div class="thumb"
                      style="background-image: url('${song.image}')">
                  </div>
                  <div class="body">
                      <h3 class="title">${song.name}</h3>
                      <p class="author">${song.singer}</p>
                  </div>
                  <div class="option">
                      <i class="fas fa-ellipsis-h"></i>
                  </div>
              </div>`
        })
        $('.playlist').innerHTML = htmls.join('')
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return app.songs[app.currentIndex] /// ????
            }
        })
    },
    handleEvents: function () {
        const _this = this;
        const cdWidth = cd.offsetWidth;
        // Xử lí CD quay / dừng

        const cdThumbAnimate = cdThumb.animate([
            {
                transform: 'rotate(360deg)'
            }
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause();

        // Xử lí phóng to thu nhỏ CD
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            let newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth

        }
        //Xử lý khi click play

        playBtn.addEventListener('click', () => {
            if (app.isPlaying) {
                audio.play();
                cdThumbAnimate.play()
            }
            else {
                audio.pause();
                cdThumbAnimate.pause();

            }
        })
        // Khi song play
        audio.onplay = () => {
            app.isPlaying = false;
            player.classList.add('playing')
        }
        // Khi pause
        audio.onpause = function () {
            app.isPlaying = true
            player.classList.remove('playing')
        }

        // Xử lí khi tiến độ bài hát thay đổi

        audio.addEventListener('timeupdate', () => {
            const progressPercent = audio.currentTime / audio.duration * 100
            progress.value = progressPercent
        })
        // Xử lí khi tua song 
        progress.addEventListener('input', () => {
            //// ??? e.target.value ?? truyen vao e
            const seekTime = audio.duration * progress.value / 100
            audio.currentTime = seekTime
        })
        // Khi next song
        nextBtn.addEventListener('click', () => {
            if (this.isRandom) {
                app.playRandomSong()
                app.nextSong()

            }
            else {
                app.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()

        })

        // Khi prev song 
        prevBtn.addEventListener('click', () => {
            if (this.isRandom) {
                app.playRandomSong()

            }
            else {
                app.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()

        })
        // Khi Random song
        randomBtn.addEventListener('click', () => {
            app.isRandom = !app.isRandom
            _this.setConfig('isRandom', _this.isRandom)

        })
        // Khi end
        audio.addEventListener('ended', () => {
            if (_this.isRepeat) {
                audio.play()
            }
            else {
                nextBtn.click()
            }
        })
        //Khi lặp lại 1 song
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)

        }

        //Chinh volume
        volumeBtn.addEventListener('input', () => {
            _this.render(); audio.volume = volumeBtn.value
        })

        // Muted

        mutedBtn.addEventListener('click', () => {
            if (_this.isMuted) {
                _this.isMuted = false
                audio.muted = false

            }
            else {
                _this.isMuted = true
                audio.muted = true
            }

        })
        playlist.addEventListener('click', (e) => {
            const songNode = e.target.closest('.song:not(.active)');
            if (songNode || e.target.closest('.option')) {

                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    audio.play()
                    _this.render()
                }
            }

        })
    },
    handleKeyBroad: function () {
        window.addEventListener('keydown', (e) => {
            switch (e.keyCode) {
                case 39:
                    this.nextSong()
                    break;
                case 37:
                    this.prevSong();
                    break;
            }

        })
    },
    scrollToActiveSong: function () {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'

            })
        }, 250)
    },
    loadCurrentSong: function () {


        heading.innerHTML = this.currentSong.name;
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`
        audio.src = this.currentSong.path
    },
    loadConfig: function () {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat

    },
    nextSong: function () {
        app.currentIndex++;
        if (app.currentIndex >= app.songs.length) {
            app.currentIndex = 0
        }
        app.loadCurrentSong()
    },
    prevSong: function () {
        app.currentIndex--;
        if (app.currentIndex < 0) {
            app.currentIndex = app.songs.length
        }
        app.loadCurrentSong()
    },
    playRandomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === app.currentIndex)
        app.currentIndex = newIndex
    },
    start: function () {
        this.loadConfig();
        this.defineProperties()

        //  TảI THÔNG Tin bài hát đầu tiên khi load ứng dụng
        this.render()
        this.loadCurrentSong()
        this.handleEvents()
        this.handleKeyBroad()
        randomBtn.classList.toggle('active', app.isRandom)

        repeatBtn.classList.toggle('active', app.isRepeat)

    }
}


repeatBtn.animate([
    // keyframes
    { transform: 'rotate(360deg)' },
    
  ], {
    // timing options
    duration: 5000,
    iterations: Infinity
  });
app.start()


