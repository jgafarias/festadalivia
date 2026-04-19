// Carousel functionality
const carouselTrack = document.querySelector('.carousel-track');
const carouselSlides = document.querySelectorAll('.carousel-slide');
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');
const indicatorsContainer = document.querySelector('.carousel-indicators');

if (carouselTrack && carouselSlides.length > 0) {
    let currentSlide = 0;
    const totalSlides = carouselSlides.length;

    // Generate dots dynamically
    if (indicatorsContainer) {
        indicatorsContainer.innerHTML = '';
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            indicatorsContainer.appendChild(dot);
        }
    }

    const dots = document.querySelectorAll('.carousel-indicators .dot');

    const updateCarousel = () => {
        // Move track
        const slideWidth = carouselSlides[0].offsetWidth;
        carouselTrack.style.transform = `translateX(-${currentSlide * slideWidth}px)`;

        // Update active states
        carouselSlides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentSlide);
        });

        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    };

    const nextSlide = () => {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
    };

    const prevSlide = () => {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateCarousel();
    };

    // Event listeners
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            updateCarousel();
        });
    });

    // Auto-play
    setInterval(nextSlide, 5000);

    // Initialize
    updateCarousel();

    // Re-calculate on resize
    window.addEventListener('resize', updateCarousel);
}
