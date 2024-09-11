let currentSlide = 0;

function updateActiveClass() {
    const slides = document.querySelectorAll('.circle');
    slides.forEach((slide, index) => {
        slide.classList.remove('active');
        if (index === currentSlide) {
            slide.classList.add('active');
        }
    });
}

function moveSlide(direction) {
    const slides = document.querySelectorAll('.circle');
    const totalSlides = slides.length;

    currentSlide += direction;

    if (currentSlide < 0) {
        currentSlide = totalSlides - 1;
    } else if (currentSlide >= totalSlides) {
        currentSlide = 0;
    }

    const container = document.querySelector('.container');
    container.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    updateActiveClass();
}

// Inicializa a classe 'active' no primeiro slide
updateActiveClass();