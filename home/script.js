let currentIndex = 0;
const items = document.querySelectorAll('.carousel-item');
const totalItems = items.length;

function updateCarousel() {
    const offset = -currentIndex * 100; // Ajuste para 100% da largura do item
    document.querySelector('.carousel-inner').style.transform = `translateX(${offset}%)`;
}

function moveSlide(direction) {
    currentIndex = (currentIndex + direction + totalItems) % totalItems; // Atualiza o índice
    updateCarousel();
}

// Inicializa o carrossel
updateCarousel();