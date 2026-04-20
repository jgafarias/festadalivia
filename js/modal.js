// General Modal functionality (Gifts Modal)
const giftCards = document.querySelectorAll('.gift-option');
const modal = document.getElementById('giftModal');

// Mesma URL do Apps Script do RSVP — os dados vão para a aba "Pagina Doacao"
const DONATION_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyPfo0CPRP6_hySe7tGfPA3OqAslmOyLr8ePqdpicsI7P1qcUNwXeBSyuJCvarvhKi3/exec';

if (modal) {
    const giftValue      = document.getElementById('giftValue');
    const form           = document.getElementById('giftForm');
    const formStep       = modal.querySelector('.modal-form');
    const qrStep         = modal.querySelector('.modal-qr');
    const closeTargets   = modal.querySelectorAll('[data-close]');
    const customValueLabel = document.getElementById('customValueLabel');
    const customValueInput = customValueLabel ? customValueLabel.querySelector('input') : null;

    let currentValue = '50'; // valor selecionado pelo card

    const openModal = (value) => {
        currentValue = value;
        const isCustom = value === 'outro';

        // Mostra/oculta campo de valor personalizado
        if (customValueLabel) {
            customValueLabel.style.display = isCustom ? '' : 'none';
            if (customValueInput) customValueInput.required = isCustom;
        }

        if (giftValue) {
            giftValue.textContent = isCustom ? 'Valor personalizado' : `R$ ${value}`;
        }

        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        if (formStep) formStep.classList.add('is-active');
        if (qrStep)   qrStep.classList.remove('is-active');
        if (form)     form.reset();
    };

    const closeModal = () => {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
    };

    giftCards.forEach((card) => {
        card.addEventListener('click', () => {
            openModal(card.dataset.value || 'outro');
        });
    });

    closeTargets.forEach((target) => {
        target.addEventListener('click', closeModal);
    });

    if (form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Enviando...';
            submitBtn.disabled = true;

            const formData = new FormData(form);
            const nome     = formData.get('nome');
            const mensagem = formData.get('mensagem') || '';

            // Determina o valor final (fixo ou personalizado)
            const valorFinal = currentValue === 'outro'
                ? `R$ ${formData.get('valorCustom') || '?'}`
                : `R$ ${currentValue}`;

            // ── Salva na planilha (aba "Pagina Doacao") ──
            const params = new URLSearchParams();
            params.append('sheet', 'Doacao'); // indica qual aba gravar
            params.append('nome', nome);
            params.append('valor', valorFinal);
            params.append('mensagem', mensagem);

            fetch(DONATION_SCRIPT_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: params.toString(),
                mode: 'no-cors'
            }).finally(() => {
                let qrImgPath = 'img/QR/QR.jpeg'; // Para 'outro'
                let pixCode = '';
                
                if (currentValue === '50') {
                    qrImgPath = 'img/QR/QR50.jpeg';
                    pixCode = '00020101021126490014br.gov.bcb.pix0127liviarufinoassis@icloud.com520400005303986540550.005802BR5913LIVIA R ASSIS6007DIADEMA62070503***630465EF';
                }
                else if (currentValue === '100') {
                    qrImgPath = 'img/QR/QR100.jpeg';
                    pixCode = '00020101021126490014br.gov.bcb.pix0127liviarufinoassis@icloud.com5204000053039865406100.005802BR5913LIVIA R ASSIS6007DIADEMA62070503***6304DE71';
                }
                else if (currentValue === '200') {
                    qrImgPath = 'img/QR/QR200.jpeg';
                    pixCode = '00020101021126490014br.gov.bcb.pix0127liviarufinoassis@icloud.com5204000053039865406200.005802BR5913LIVIA R ASSIS6007DIADEMA62070503***6304B12E';
                }
                else if (currentValue === 'outro') {
                    qrImgPath = 'img/QR/QR.jpeg';
                    pixCode = '00020101021126490014br.gov.bcb.pix0127liviarufinoassis@icloud.com5204000053039865802BR5918LIVIA RUFINO ASSIS6007DIADEMA62070503***63047998';
                }

                const qrContainer = modal.querySelector('.qr-placeholder');
                if (qrContainer) {
                    qrContainer.innerHTML = `<img src="${qrImgPath}" alt="QR Code Pix" style="border-radius: 8px; width: 100%; max-width: 220px; object-fit: contain;">`;
                    qrContainer.style.background = 'white';
                }

                const copyBtn = modal.querySelector('#copyPixBtn');
                if (copyBtn) {
                    if (pixCode) {
                        copyBtn.style.display = 'block';
                        copyBtn.onclick = () => {
                            navigator.clipboard.writeText(pixCode).then(() => {
                                const originalText = 'Copiar Código Pix';
                                copyBtn.textContent = 'Código Copiado! ✔️';
                                setTimeout(() => copyBtn.textContent = originalText, 2500);
                            });
                        };
                    } else {
                        copyBtn.style.display = 'none';
                    }
                }

                if (formStep) formStep.classList.remove('is-active');
                if (qrStep)   qrStep.classList.add('is-active');

                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            });
        });
    }

    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeModal();
    });

    modal.addEventListener('click', (event) => {
        if (event.target === modal) closeModal();
    });
}
