        // Fix --vh para mobile (evita salto da barra do browser)
        function setVh() {
            document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
        }
        setVh();
        window.addEventListener('resize', setVh);

        /* ── Partículas ── */
        const sparklesContainer = document.getElementById('sparkles');
        if (sparklesContainer) {
            for (let i = 0; i < 40; i++) {
                const s = document.createElement('div');
                s.className = 'sparkle';
                s.style.setProperty('--dur', `${2 + Math.random() * 4}s`);
                s.style.setProperty('--delay', `${Math.random() * 5}s`);
                s.style.left = `${Math.random() * 100}%`;
                s.style.top = `${Math.random() * 100}%`;
                s.style.background = Math.random() > 0.5 ? '#d4af6a' : '#fff';
                sparklesContainer.appendChild(s);
            }
        }

        /* ── Elementos ── */
        const screenInicio = document.getElementById('screenInicio');
        const screenVideo = document.getElementById('screenVideo');
        const screenFinal = document.getElementById('screenFinal');
        const video = document.getElementById('conviteVideo');
        const finalImg = document.getElementById('finalImg');
        const finalBtnOverlay = document.getElementById('finalBtnOverlay');

        /**
         * Posição do botão "VISITE O SITE DO EVENTO" dentro da imagem Final Convite.jpg
         */
        const BTN = { top: 0.68, bottom: 0.76, left: 0.25, right: 0.75 };

        /* Recalcula posição do hotspot com base no tamanho renderizado da imagem */
        function positionOverlay() {
            if (!finalImg) return;
            const rect = finalImg.getBoundingClientRect();
            if (rect.width === 0) return;

            finalBtnOverlay.style.top = `${rect.top + BTN.top * rect.height}px`;
            finalBtnOverlay.style.left = `${rect.left + BTN.left * rect.width}px`;
            finalBtnOverlay.style.width = `${(BTN.right - BTN.left) * rect.width}px`;
            finalBtnOverlay.style.height = `${(BTN.bottom - BTN.top) * rect.height}px`;
        }

        window.addEventListener('resize', positionOverlay);

        /* ── Troca de tela: usa opacity em vez de display ── */
        function showScreen(el) {
            [screenInicio, screenVideo, screenFinal].forEach(s => {
                if (s) s.classList.remove('active');
            });
            if (el) el.classList.add('active');
        }

        /* TELA 1 → TELA 2: Clique na imagem inicial */
        if (screenInicio) {
            screenInicio.addEventListener('click', () => {
                if (video) {
                    video.currentTime = 0;
                    // Só exibe a tela do vídeo quando o primeiro frame estiver pronto e rodando
                    video.addEventListener('playing', () => {
                        showScreen(screenVideo);
                    }, { once: true });
                    video.play().catch(e => {
                        // Fallback caso autoplay falhe
                        showScreen(screenVideo);
                    });
                } else {
                    showScreen(screenVideo);
                }
            });
        }

        /* TELA 2 → TELA 3: Vídeo terminou */
        if (video) {
            video.addEventListener('ended', () => {
                showScreen(screenFinal);
                if (finalBtnOverlay) {
                    finalBtnOverlay.style.opacity = '0';
                    finalBtnOverlay.style.pointerEvents = 'none';
                    positionOverlay();
                    // Pequeno delay para garantir que a imagem renderizou antes de posicionar
                    setTimeout(() => {
                        positionOverlay();
                        finalBtnOverlay.style.opacity = '1';
                        finalBtnOverlay.style.pointerEvents = 'all';
                    }, 400);
                }
            });
        }

        /* TELA 3: Clique no botão da imagem final → vai para o convite */
        const goToSite = () => { window.location.href = 'index.html'; };
        if (finalBtnOverlay) {
            finalBtnOverlay.addEventListener('click', goToSite);
            finalBtnOverlay.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') goToSite();
            });
        }
