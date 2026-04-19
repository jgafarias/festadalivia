/**
 * RSVP Logic (Google Sheets Integration)
 * --------------------------------------
 * Esta lógica envia os dados automaticamente para uma Planilha Google.
 */

const openRSVPBtn = document.getElementById('openRSVP');
const rsvpModal = document.getElementById('rsvpModal');
const rsvpForm = document.getElementById('rsvpForm');

// IMPORTANTE: Cole aqui o link do seu Web App do Google Apps Script
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyPfo0CPRP6_hySe7tGfPA3OqAslmOyLr8ePqdpicsI7P1qcUNwXeBSyuJCvarvhKi3/exec';

if (openRSVPBtn && rsvpModal) {
    const closeTargets = rsvpModal.querySelectorAll('[data-close]'); // ← bug corrigido
    const formStep = rsvpModal.querySelector('.modal-step');
    const successStep = document.getElementById('rsvpSuccess');
    const submitBtn = rsvpForm ? rsvpForm.querySelector('button[type="submit"]') : null;

    const openRSVP = () => {
        // Sempre volta para o formulário ao abrir
        if (formStep) formStep.style.display = '';
        if (successStep) successStep.style.display = 'none';
        rsvpModal.classList.add('is-open');
        rsvpModal.setAttribute('aria-hidden', 'false');
    };

    const closeRSVP = () => {
        rsvpModal.classList.remove('is-open');
        rsvpModal.setAttribute('aria-hidden', 'true');
        setTimeout(() => {
            if (rsvpForm) rsvpForm.reset();
            if (formStep) formStep.style.display = '';
            if (successStep) successStep.style.display = 'none';
        }, 400);
    };

    openRSVPBtn.addEventListener('click', openRSVP);
    closeTargets.forEach(target => target.addEventListener('click', closeRSVP));

    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeRSVP();
    });

    if (rsvpForm && submitBtn) {
        rsvpForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Enviando...';
            submitBtn.disabled = true;

            const formData = new FormData(rsvpForm);

            // Usar URLSearchParams garante compatibilidade com Apps Script no modo no-cors
            const params = new URLSearchParams();
            params.append('nome', formData.get('nome'));
            params.append('convidados', formData.get('convidados'));

            fetch(SCRIPT_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: params.toString(),
                mode: 'no-cors'
            })
            .then(() => {
                // Trocar para tela de sucesso animada
                if (formStep) formStep.style.display = 'none';
                if (successStep) successStep.style.display = 'flex';
                rsvpForm.reset();
                // Restaurar botão imediatamente (formulário já está oculto)
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
                // Fechar automaticamente após 3.5s
                setTimeout(closeRSVP, 3500);
            })
            .catch(error => {
                console.error('Erro no envio:', error);
                alert('Ocorreu um erro ao confirmar. Tente novamente.');
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            });
        });
    }

    /**
     * ==================================================================
     * LÓGICA ANTERIOR (WHATSAPP) - COMENTADA PARA EXIBIÇÃO À CLIENTE
     * ==================================================================
     * Para reativar, basta descomentar o bloco abaixo e comentar o fetch acima.
     *
     * rsvpForm.addEventListener('submit', (e) => {
     *    e.preventDefault();
     *    const formData = new FormData(rsvpForm);
     *    const nome = formData.get('nome');
     *    const convidados = formData.get('convidados');
     *    const texto = `Olá! Gostaria de confirmar minha presença.\n\n*Nome:* ${nome}\n*Acompanhantes:* ${convidados}`;
     *    const numero = '5511912381024';
     *    const encodedText = encodeURIComponent(texto);
     *    window.open(`https://wa.me/${numero}?text=${encodedText}`, '_blank');
     *    closeRSVP();
     * });
     * ==================================================================
     */
}
