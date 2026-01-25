// ========== TROCA DE TÍTULO DA PÁGINA ========== //
const titles = ["</>", "!", "!d", "!do", "!dos", "!dosa", "!dosan", "!dosanj", "!dosanjo", "!dosanjos", "!dosanjos7"];
let index = 0;

setInterval(function () {
    document.title = titles[index];
    index = (index + 1) % titles.length;
}, 300);
    
    // ========== CONFIGURAÇÃO DE ELEMENTOS ========== //
    const loadingScreen = document.getElementById('loading-screen');
    const sensibilidadeModal = document.getElementById('sensibilidadeModal');
    const sobreModal = document.getElementById('sobreModal');
    const closeSensibilidade = document.getElementById('closeSensibilidade');
    const closeSobre = document.getElementById('closeSobre');
    const sensibilidadeBtn = document.getElementById('sensibilidadeBtn');
    const sobreBtn = document.getElementById('sobreBtn');
    const visitorCount = document.getElementById('visitorCount');
    
    // Elementos do player de música
    const musicProgress = document.getElementById('musicProgress');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const playIcon = document.getElementById('playIcon');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeIcon = document.getElementById('volumeIcon');
    const volumeToggle = document.getElementById('volumeToggle');
    const musicTitle = document.getElementById('musicTitle');
    const musicArtist = document.getElementById('musicArtist');
    const albumArt = document.getElementById('albumArt');
    const currentTime = document.getElementById('currentTime');
    const totalTime = document.getElementById('totalTime');
    const volumeSliderContainer = document.querySelector('.volume-slider-container');
    
    // Elementos do perfil
    const profileBanner = document.getElementById('profileBanner');
    const userAvatar = document.getElementById('userAvatar');
    
    // Elementos dos cards para efeito 3D
    const mainCard = document.querySelector('.main-card');
    const setupCard = document.querySelector('.setup-card');
    
    // ========== CONFIGURAÇÃO DA PLAYLIST ========== //
    const playlist = [
        {
            title: "Volta Por Cima",
            artist: "Meno Tody, Neo Beats",
            audio: "assets/music/Volta_Por_Cima.mp3",
            cover: "assets/img/silvasz.gif",
            duration: 180,
            color: "#ff0000"
        },
        {
            title: "Meno do Rio",
            artist: "Meno Tody",
            audio: "assets/music/Meno_do_Rio.mp3",
            cover: "https://i.pinimg.com/1200x/6a/40/8a/6a408a95b8b65eb256231e036e0dd87a.jpg",
            duration: 180,
            color: "#ff0000"
        },
        {
            title: "Tantos Planos",
            artist: "Brocasito, JayPluggz, Stuani",
            audio: "assets/music/Tantos_Planos.mp3",
            cover: "https://i.pinimg.com/originals/38/da/49/38da49184516d776027ca9ea2a726ddf.gif",
            duration: 180,
            color: "#FF0000"
        }
    ];
    
    // ========== VARIÁVEIS GLOBAIS ========== //
    let currentTrackIndex = 0;
    const audio = new Audio();
    let isPlaying = false;
    let audioInitialized = false;
    let progressInterval;
    let currentProgress = 0;
    let volume = 80;
    let isVolumeVisible = false;
    let loadingScreenRemoved = false;
    
    // ========== TELA DE LOADING (SISTEMA CORRIGIDO) ========== //
    function setupLoadingScreen() {
        if (!loadingScreen) return;
        
        console.log('🎮 Configurando tela de loading...');
        
        // Adiciona instrução visual para clicar
        const clickInstruction = document.createElement('div');
        clickInstruction.textContent = 'created by rzharo';
        clickInstruction.className = 'loading-instruction';
        clickInstruction.style.cssText = `
            position: absolute;
            bottom: 40px;
            left: 0;
            right: 0;
            text-align: center;
            color: white;
            font-size: 12px;
            opacity: 0.8;
            animation: pulse 2s infinite;
            cursor: pointer;
            padding: 10px;
            border-radius: 20px;
            backdrop-filter: blur(5px);
            width: 200px;
            margin: 0 auto;
            transition: all 0.3s ease;
            z-index: 10000;
            -webkit-tap-highlight-color: transparent;
            user-select: none;
            pointer-events: auto;
        `;
        
        loadingScreen.appendChild(clickInstruction);
        
        // Adiciona estilos de animação
        const pulseStyle = document.createElement('style');
        pulseStyle.textContent = `
            @keyframes pulse {
                0%, 100% { 
                    opacity: 0.6;
                    transform: scale(1);
                }
                50% { 
                    opacity: 1;
                    transform: scale(1.05);
                }
            }
            
            @keyframes loadingExit {
                0% {
                    opacity: 1;
                    transform: scale(1);
                }
                100% {
                    opacity: 0;
                    transform: scale(1.1);
                    visibility: hidden;
                }
            }
            
            .loading-exit {
                animation: loadingExit 0.6s ease forwards !important;
            }
            
            .loading-screen {
                touch-action: manipulation;
                cursor: pointer;
            }
            
            .loading-screen * {
                pointer-events: auto;
                cursor: pointer;
            }
        `;
        document.head.appendChild(pulseStyle);
        
        // Configura eventos de clique
        function handleLoadingClick(e) {
            e.preventDefault();
            e.stopPropagation();
            
            if (loadingScreenRemoved) return;
            
            console.log('🎯 Tela de loading clicada!');
            
            loadingScreenRemoved = true;
            loadingScreen.style.cursor = 'default';
            
            // Animação de saída
            loadingScreen.classList.add('loading-exit');
            
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                console.log('✅ Tela de loading removida');
                
                // Inicializa áudio
                if (!audioInitialized) {
                    initAudioOnInteraction();
                }
                
                // Mostra confirmação visual
                showLoadingConfirmation();
            }, 600);
        }
        
        // Eventos para desktop (clique)
        loadingScreen.addEventListener('click', handleLoadingClick);
        
        // Eventos para mobile (touch)
        loadingScreen.addEventListener('touchstart', function(e) {
            e.preventDefault();
        }, { passive: false });
        
        loadingScreen.addEventListener('touchend', function(e) {
            e.preventDefault();
            handleLoadingClick(e);
        }, { passive: false });
        
        // Eventos para o texto de instrução também
        clickInstruction.addEventListener('click', handleLoadingClick);
        clickInstruction.addEventListener('touchend', handleLoadingClick);
        
        // Adiciona mensagem no console
        console.log('✅ Tela de loading configurada - Aguardando clique/touch...');
    }
    
    function showLoadingConfirmation() {
        const confirmation = document.createElement('div');
        confirmation.textContent = '✅';
        confirmation.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 10px 15px;
            border-radius: 50%;
            font-size: 24px;
            z-index: 9998;
            animation: fadeInOut 2s ease forwards;
            pointer-events: none;
        `;
        
        document.body.appendChild(confirmation);
        
        setTimeout(() => {
            if (confirmation.parentNode) {
                confirmation.parentNode.removeChild(confirmation);
            }
        }, 2000);
        
        // Adiciona animação CSS se não existir
        if (!document.querySelector('#fadeInOutStyle')) {
            const style = document.createElement('style');
            style.id = 'fadeInOutStyle';
            style.textContent = `
                @keyframes fadeInOut {
                    0% { opacity: 0; transform: translateY(-10px); }
                    20% { opacity: 1; transform: translateY(0); }
                    80% { opacity: 1; transform: translateY(0); }
                    100% { opacity: 0; transform: translateY(-10px); }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // ========== SISTEMA DE VISITANTES ========== //
    function updateUniqueVisitorCount() {
        const today = new Date().toDateString();
        const lastVisitDate = localStorage.getItem('lastVisitDate');
        const totalVisitors = localStorage.getItem('totalVisitors') || 0;
        
        if (!lastVisitDate || lastVisitDate !== today) {
            const newTotal = parseInt(totalVisitors) + 1;
            
            localStorage.setItem('totalVisitors', newTotal);
            localStorage.setItem('lastVisitDate', today);
            
            if (visitorCount) {
                visitorCount.textContent = newTotal.toLocaleString();
            }
            showNewVisitorEffects(newTotal);
        } else if (visitorCount) {
            visitorCount.textContent = parseInt(totalVisitors).toLocaleString();
        }
    }
    
    function showNewVisitorEffects(count) {
        if (visitorCount) {
            visitorCount.classList.add('celebrating');
            setTimeout(() => {
                visitorCount.classList.remove('celebrating');
            }, 1000);
        }
    }
    
    // ========== SISTEMA DE ÁUDIO (CORRIGIDO) ========== //
    function initAudioOnInteraction() {
        if (audioInitialized) return;
        
        console.log('🎵 Inicializando sistema de áudio...');
        audioInitialized = true;
        
        // Carrega a primeira música
        loadSong(playlist[currentTrackIndex]);
        audio.volume = volume / 100;
        
        // Tenta reproduzir (pode falhar no autoplay)
        playSong().catch(e => {
            console.log("ℹ️ Autoplay bloqueado - aguardando interação do usuário");
        });
    }
    
    function loadSong(song) {
        console.log('🎶 Carregando:', song.title);
        
        if (musicTitle) musicTitle.textContent = song.title;
        if (musicArtist) musicArtist.textContent = song.artist;
        
        // Carrega capa do álbum
        loadAlbumArt(song);
        
        // Configura áudio
        audio.src = song.audio;
        audio.preload = 'metadata';
        
        // Configura eventos do áudio
        audio.onloadedmetadata = () => {
            const duration = audio.duration || song.duration;
            const minutes = Math.floor(duration / 60);
            const seconds = Math.floor(duration % 60);
            if (totalTime) totalTime.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            if (isPlaying) {
                updateProgress();
            }
        };
        
        audio.onerror = (e) => {
            console.error('❌ Erro ao carregar áudio:', song.audio);
            if (musicTitle) musicTitle.textContent = "Erro ao carregar";
            if (musicArtist) musicArtist.textContent = "Verifique o arquivo";
        };
        
        audio.ontimeupdate = updateProgressDisplay;
        audio.onended = nextSong;
    }
    
    function loadAlbumArt(song) {
        if (!albumArt) return;
        
        const img = new Image();
        img.onload = () => {
            albumArt.innerHTML = '';
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            img.alt = `${song.title} - ${song.artist}`;
            albumArt.appendChild(img);
        };
        img.onerror = () => {
            albumArt.innerHTML = '<i class="fas fa-music album-art-fallback"></i>';
            albumArt.style.background = song.color;
        };
        img.src = song.cover;
    }
    
    async function playSong() {
        try {
            await audio.play();
            isPlaying = true;
            if (playIcon) {
                playIcon.classList.remove('fa-play');
                playIcon.classList.add('fa-pause');
            }
            console.log('▶️ Reproduzindo:', playlist[currentTrackIndex].title);
            
            // Inicia atualização do progresso
            if (progressInterval) clearInterval(progressInterval);
            progressInterval = setInterval(updateProgress, 100);
            
        } catch (error) {
            console.log("⚠️ Não foi possível reproduzir automaticamente");
            if (playIcon) {
                playIcon.classList.remove('fa-pause');
                playIcon.classList.add('fa-play');
            }
            isPlaying = false;
        }
    }
    
    function pauseSong() {
        isPlaying = false;
        audio.pause();
        if (playIcon) {
            playIcon.classList.remove('fa-pause');
            playIcon.classList.add('fa-play');
        }
        
        if (progressInterval) {
            clearInterval(progressInterval);
            progressInterval = null;
        }
    }
    
    function nextSong() {
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
        loadSong(playlist[currentTrackIndex]);
        if (isPlaying) {
            playSong();
        }
    }
    
    function prevSong() {
        currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
        loadSong(playlist[currentTrackIndex]);
        if (isPlaying) {
            playSong();
        }
    }
    
    function updateProgress() {
        if (!audio.duration) return;
        
        currentProgress = (audio.currentTime / audio.duration) * 100;
        updateProgressDisplay();
    }
    
    function updateProgressDisplay() {
        if (musicProgress) {
            musicProgress.style.width = `${currentProgress}%`;
        }
        
        // Atualiza tempo atual
        if (audio.duration && !isNaN(audio.currentTime)) {
            const currentSeconds = Math.floor(audio.currentTime);
            const minutes = Math.floor(currentSeconds / 60);
            const seconds = currentSeconds % 60;
            if (currentTime) {
                currentTime.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            }
        }
    }
    
    function updateVolume() {
        volume = volumeSlider ? volumeSlider.value : 80;
        audio.volume = volume / 100;
        
        if (volumeIcon) {
            if (volume == 0) {
                volumeIcon.classList.remove('fa-volume-up', 'fa-volume-down');
                volumeIcon.classList.add('fa-volume-mute');
            } else if (volume < 50) {
                volumeIcon.classList.remove('fa-volume-up', 'fa-volume-mute');
                volumeIcon.classList.add('fa-volume-down');
            } else {
                volumeIcon.classList.remove('fa-volume-down', 'fa-volume-mute');
                volumeIcon.classList.add('fa-volume-up');
            }
        }
        
        if (volumeSlider) {
            volumeSlider.style.background = `linear-gradient(90deg, #ffffff ${volume}%, #8e8e93 ${volume}%)`;
        }
    }
    
    function toggleVolumeSlider() {
        if (!volumeSliderContainer) return;
        
        isVolumeVisible = !isVolumeVisible;
        
        if (isVolumeVisible) {
            volumeSliderContainer.style.display = 'block';
            setTimeout(() => {
                volumeSliderContainer.classList.add('visible');
            }, 10);
        } else {
            volumeSliderContainer.classList.remove('visible');
            setTimeout(() => {
                volumeSliderContainer.style.display = 'none';
            }, 300);
        }
    }
    
    // ========== EFEITO 3D NOS CARDS ========== //
    class Card3DEffect {
        constructor(card, intensity = 1) {
            this.card = card;
            this.intensity = intensity;
            this.targetRotationX = 0;
            this.targetRotationY = 0;
            this.currentRotationX = 0;
            this.currentRotationY = 0;
            this.isMouseOver = false;
            this.rafId = null;
            this.maxRotation = 3;
            this.smoothingFactor = 0.15;
            this.hoverScale = 1.02;
            this.hoverLift = 5;
            
            this.init();
        }
        
        init() {
            this.setupEventListeners();
            this.animate();
            
            setTimeout(() => {
                this.card.classList.add('card-enter');
                setTimeout(() => {
                    this.card.classList.remove('card-enter');
                }, 800);
            }, 100);
        }
        
        setupEventListeners() {
            this.card.addEventListener('mouseenter', (e) => {
                this.isMouseOver = true;
                this.card.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
                this.card.classList.remove('card-floating');
                this.targetRotationX = 0;
                this.targetRotationY = 0;
            });
            
            this.card.addEventListener('mousemove', (e) => {
                if (!this.isMouseOver) return;
                
                const rect = this.card.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                this.targetRotationY = ((e.clientX - centerX) / (rect.width / 2)) * this.maxRotation;
                this.targetRotationX = ((centerY - e.clientY) / (rect.height / 2)) * this.maxRotation;
            });
            
            this.card.addEventListener('mouseleave', (e) => {
                this.isMouseOver = false;
                this.card.style.transition = 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
                this.targetRotationX = 0;
                this.targetRotationY = 0;
            });
        }
        
        update() {
            this.currentRotationX += (this.targetRotationX - this.currentRotationX) * this.smoothingFactor;
            this.currentRotationY += (this.targetRotationY - this.currentRotationY) * this.smoothingFactor;
            
            const scale = this.isMouseOver ? this.hoverScale : 1;
            const lift = this.isMouseOver ? this.hoverLift : 0;
            
            this.card.style.transform = `
                perspective(1000px) 
                rotateX(${this.currentRotationX * this.intensity}deg) 
                rotateY(${this.currentRotationY * this.intensity}deg) 
                translateZ(${lift}px) 
                scale(${scale})
            `;
            
            const shadowIntensity = this.isMouseOver ? 0.3 : 0.15;
            const shadowX = this.currentRotationY * 0.5 * this.intensity;
            const shadowY = this.currentRotationX * 0.5 * this.intensity;
            
            this.card.style.boxShadow = `
                ${shadowX}px ${shadowY}px 40px rgba(0, 0, 0, ${shadowIntensity}),
                0 ${this.isMouseOver ? '25' : '20'}px 60px rgba(0, 0, 0, ${shadowIntensity + 0.1})
            `;
        }
        
        animate() {
            this.update();
            this.rafId = requestAnimationFrame(() => this.animate());
        }
        
        destroy() {
            if (this.rafId) {
                cancelAnimationFrame(this.rafId);
            }
        }
    }
    
    let mainCardEffect = null;
    let setupCardEffect = null;
    
    // ========== CARREGAMENTO DE IMAGENS DO PERFIL ========== //
    function loadProfileImages() {
        const bannerPath = 'assets/img/bebel.gif';
        const avatarPath = 'assets/img/icon.png';
        
        loadImage(profileBanner, bannerPath, 'banner')
            .catch(error => {
                if (profileBanner) {
                    profileBanner.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                }
            });
        
        loadImage(userAvatar, avatarPath, 'avatar')
            .catch(error => {
                if (userAvatar) {
                    const fallbackIcon = document.createElement('i');
                    fallbackIcon.className = 'fas fa-user avatar-fallback';
                    userAvatar.appendChild(fallbackIcon);
                }
            });
    }
    
    function loadImage(element, path, type) {
        return new Promise((resolve, reject) => {
            if (!element) return reject('Elemento não encontrado');
            
            const extension = path.split('.').pop().toLowerCase();
            const isGif = extension === 'gif';
            
            if (isGif) {
                const img = new Image();
                img.onload = () => {
                    element.innerHTML = '';
                    img.style.width = '100%';
                    img.style.height = '100%';
                    img.style.objectFit = 'cover';
                    element.appendChild(img);
                    resolve();
                };
                img.onerror = () => reject(new Error(`Erro ao carregar ${type}: ${path}`));
                img.src = path;
            } else {
                const tempImg = new Image();
                tempImg.onload = () => {
                    element.style.backgroundImage = `url('${path}')`;
                    element.style.backgroundSize = 'cover';
                    element.style.backgroundPosition = 'center';
                    element.innerHTML = '';
                    resolve();
                };
                tempImg.onerror = () => reject(new Error(`Erro ao carregar ${type}: ${path}`));
                tempImg.src = path;
            }
        });
    }
    
    // ========== CONFIGURAÇÃO DE EVENTOS ========== //
    function setupEventListeners() {
        console.log('🔧 Configurando eventos...');
        
        // Controles do player de música
        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', () => {
                if (!audioInitialized) {
                    initAudioOnInteraction();
                } else {
                    isPlaying ? pauseSong() : playSong();
                }
            });
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (!audioInitialized) {
                    initAudioOnInteraction();
                } else {
                    prevSong();
                }
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (!audioInitialized) {
                    initAudioOnInteraction();
                } else {
                    nextSong();
                }
            });
        }
        
        if (volumeSlider) {
            volumeSlider.addEventListener('input', updateVolume);
        }
        
        if (volumeToggle) {
            volumeToggle.addEventListener('click', toggleVolumeSlider);
        }
        
        // Modais
        if (sensibilidadeBtn && sensibilidadeModal) {
            sensibilidadeBtn.addEventListener('click', () => {
                sensibilidadeModal.classList.add('active');
            });
        }
        
        if (sobreBtn && sobreModal) {
            sobreBtn.addEventListener('click', () => {
                sobreModal.classList.add('active');
            });
        }
        
        if (closeSensibilidade && sensibilidadeModal) {
            closeSensibilidade.addEventListener('click', () => {
                sensibilidadeModal.classList.remove('active');
            });
        }
        
        if (closeSobre && sobreModal) {
            closeSobre.addEventListener('click', () => {
                sobreModal.classList.remove('active');
            });
        }
        
        // Fechar modais clicando fora ou com ESC
        window.addEventListener('click', (event) => {
            if (sensibilidadeModal && event.target === sensibilidadeModal) {
                sensibilidadeModal.classList.remove('active');
            }
            if (sobreModal && event.target === sobreModal) {
                sobreModal.classList.remove('active');
            }
        });
        
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                if (sensibilidadeModal) sensibilidadeModal.classList.remove('active');
                if (sobreModal) sobreModal.classList.remove('active');
            }
        });
        
        // Cards de hardware com efeito 3D
        const hardwareCards = document.querySelectorAll('.hardware-item');
        hardwareCards.forEach(card => {
            const hardwareEffect = {
                card: card,
                isMouseOver: false,
                targetRotationX: 0,
                targetRotationY: 0,
                currentRotationX: 0,
                currentRotationY: 0,
                
                init() {
                    this.card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
                    
                    this.card.addEventListener('mouseenter', (e) => {
                        this.isMouseOver = true;
                        this.card.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
                    });
                    
                    this.card.addEventListener('mousemove', (e) => {
                        if (!this.isMouseOver) return;
                        
                        const rect = this.card.getBoundingClientRect();
                        const centerX = rect.left + rect.width / 2;
                        const centerY = rect.top + rect.height / 2;
                        
                        this.targetRotationY = ((e.clientX - centerX) / (rect.width / 2)) * 3;
                        this.targetRotationX = ((centerY - e.clientY) / (rect.height / 2)) * 3;
                        
                        this.updateTransform();
                    });
                    
                    this.card.addEventListener('mouseleave', (e) => {
                        this.isMouseOver = false;
                        this.card.style.transition = 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
                        this.targetRotationX = 0;
                        this.targetRotationY = 0;
                        this.updateTransform();
                    });
                    
                    this.updateTransform();
                },
                
                updateTransform() {
                    this.currentRotationX += (this.targetRotationX - this.currentRotationX) * 0.2;
                    this.currentRotationY += (this.targetRotationY - this.currentRotationY) * 0.2;
                    
                    const scale = this.isMouseOver ? 1.02 : 1;
                    
                    this.card.style.transform = `
                        perspective(500px) 
                        rotateX(${this.currentRotationX}deg) 
                        rotateY(${this.currentRotationY}deg) 
                        translateY(${this.isMouseOver ? '-5px' : '0'}) 
                        scale(${scale})
                    `;
                }
            };
            
            hardwareEffect.init();
            
            const link = card.querySelector('.hardware-link-btn');
            if (link) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.open(link.href, '_blank');
                });
            }
        });
        
        // Botões sociais com efeito 3D
        const socialButtons = document.querySelectorAll('.social-icon');
        socialButtons.forEach(button => {
            const socialEffect = {
                button: button,
                isMouseOver: false,
                targetRotationX: 0,
                targetRotationY: 0,
                currentRotationX: 0,
                currentRotationY: 0,
                
                init() {
                    this.button.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
                    
                    this.button.addEventListener('mouseenter', (e) => {
                        this.isMouseOver = true;
                        this.button.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
                    });
                    
                    this.button.addEventListener('mousemove', (e) => {
                        if (!this.isMouseOver) return;
                        
                        const rect = this.button.getBoundingClientRect();
                        const centerX = rect.left + rect.width / 2;
                        const centerY = rect.top + rect.height / 2;
                        
                        this.targetRotationY = ((e.clientX - centerX) / (rect.width / 2)) * 10;
                        this.targetRotationX = ((centerY - e.clientY) / (rect.height / 2)) * 10;
                        
                        this.updateTransform();
                    });
                    
                    this.button.addEventListener('mouseleave', (e) => {
                        this.isMouseOver = false;
                        this.button.style.transition = 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
                        this.targetRotationX = 0;
                        this.targetRotationY = 0;
                        this.updateTransform();
                    });
                },
                
                updateTransform() {
                    this.currentRotationX += (this.targetRotationX - this.currentRotationX) * 0.3;
                    this.currentRotationY += (this.targetRotationY - this.currentRotationY) * 0.3;
                    
                    const lift = this.isMouseOver ? -8 : 0;
                    const scale = this.isMouseOver ? 1.15 : 1;
                    
                    this.button.style.transform = `
                        translateY(${lift}px) 
                        perspective(300px) 
                        rotateX(${this.currentRotationX}deg) 
                        rotateY(${this.currentRotationY}deg) 
                        scale(${scale})
                    `;
                }
            };
            
            socialEffect.init();
        });
    }
    
    // ========== ADICIONAR ESTILOS CSS DINÂMICOS ========== //
    function add3DCardStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .glass-card {
                transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), 
                           box-shadow 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                transform-style: preserve-3d;
                will-change: transform, box-shadow;
                transform-origin: center center;
                backface-visibility: hidden;
            }
            
            .card-enter {
                animation: cardEntrance 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            }
            
            @keyframes cardEntrance {
                0% {
                    opacity: 0;
                    transform: perspective(1000px) rotateX(15deg) rotateY(-15deg) translateZ(-100px) scale(0.95);
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0);
                }
                100% {
                    opacity: 1;
                    transform: perspective(1000px) rotateX(0) rotateY(0) translateZ(0) scale(1);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
                }
            }
            
            @keyframes float {
                0%, 100% { 
                    transform: perspective(1000px) rotateX(0) rotateY(0) translateY(0);
                }
                50% { 
                    transform: perspective(1000px) rotateX(1deg) rotateY(1deg) translateY(-5px);
                }
            }
            
            .card-floating {
                animation: float 6s ease-in-out infinite;
            }
            
            .visitor-counter-compact.celebrating {
                animation: celebrate 0.8s ease;
            }
            
            @keyframes celebrate {
                0% { transform: translateY(0) scale(1); }
                25% { transform: translateY(-5px) scale(1.05); }
                50% { transform: translateY(0) scale(1.1); }
                75% { transform: translateY(-3px) scale(1.05); }
                100% { transform: translateY(0) scale(1); }
            }
        `;
        document.head.appendChild(style);
    }
    
    function addVisitorStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .visitor-counter-compact.celebrating {
                animation: celebrate 0.8s ease;
            }
        `;
        document.head.appendChild(style);
    }
    
    // ========== INICIALIZAÇÃO DOS EFEITOS 3D ========== //
    function init3DCardEffect() {
        if (mainCard) {
            mainCardEffect = new Card3DEffect(mainCard, 1);
        }
        
        if (setupCard) {
            setupCardEffect = new Card3DEffect(setupCard, 0.8);
        }
    }
    
    // ========== VERIFICAÇÃO DO VÍDEO DE FUNDO ========== //
    function checkVideo() {
        const video = document.getElementById('bg-video');
        if (video) {
            video.play().catch(error => {
                console.log('ℹ️ Vídeo em autoplay bloqueado - será reproduzido após interação');
            });
            
            video.addEventListener('error', () => {
                document.body.style.background = 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)';
            });
        }
    }
    
    // ========== INICIALIZAÇÃO PRINCIPAL ========== //
    function initializeSite() {
        console.log('🚀 Iniciando BioPage...');
        
        // Configura a tela de loading PRIMEIRO
        setupLoadingScreen();
        
        // Depois inicializa tudo
        loadProfileImages();
        setupEventListeners();
        add3DCardStyles();
        addVisitorStyles();
        init3DCardEffect();
        checkVideo();
        
        // Configura volume inicial
        updateVolume();
        
        // Esconde slider de volume inicialmente
        if (volumeSliderContainer) {
            volumeSliderContainer.style.display = 'none';
        }
        
        console.log('✅ BioPage inicializada com sucesso!');
    }
    
    // ========== FUNÇÕES DE DEBUG (OPCIONAL) ========== //
    window.resetVisitorCounter = function() {
        localStorage.removeItem('totalVisitors');
        localStorage.removeItem('lastVisitDate');
        if (visitorCount) {
            visitorCount.textContent = '0';
        }
        console.log('🔄 Contador de visitantes resetado!');
    };
    
    window.testAudio = function(index = 0) {
        if (index >= 0 && index < playlist.length) {
            currentTrackIndex = index;
            loadSong(playlist[currentTrackIndex]);
            playSong();
        }
    };
    
    window.cleanup3DEffects = function() {
        if (mainCardEffect) mainCardEffect.destroy();
        if (setupCardEffect) setupCardEffect.destroy();
    };
    
    // ========== INICIAR TUDO ========== //
    updateUniqueVisitorCount();
    initializeSite();
    
    console.log('🎮 Sistema pronto - Clique na tela para começar!');
    console.log('📱 Compatível com mobile e desktop');
    console.log('🎵 Player de música configurado');
    console.log('🎮 Efeito 3D ativado');
});





