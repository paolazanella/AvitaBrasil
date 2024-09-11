let currentIndex = 0;
const items = document.querySelectorAll('.carousel-item');
const totalItems = items.length;

// Função para mover o slide
function moveSlide(direction) {
    // Remove a classe 'active' do círculo atual
    items[currentIndex].classList.remove('active'); 

    // Calcula o novo índice
    currentIndex = (currentIndex + direction + totalItems) % totalItems; 

    // Adiciona a classe 'active' ao novo círculo
    items[currentIndex].classList.add('active'); 

    // Atualiza a posição do carrossel
    updateCarousel();
}

// Atualiza a posição do carrossel
function updateCarousel() {
    const offset = -currentIndex * 25; // Ajusta a posição do carrossel
    document.querySelector('.carousel-inner').style.transform = `translateX(${offset}%)`;
}

// Adiciona a classe 'active' ao primeiro círculo inicialmente
items[currentIndex].classList.add('active');

// Adiciona event listeners para os botões
document.querySelector('.prev').onclick = () => moveSlide(-1);
document.querySelector('.next').onclick = () => moveSlide(1);

// Autoplay (opcional)
setInterval(() => {
    moveSlide(1);
}, 5000); // Muda a cada 5 segundos