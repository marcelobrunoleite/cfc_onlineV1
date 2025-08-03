document.addEventListener('DOMContentLoaded', function() {
    const menuHamburguer = document.querySelector('.menu-hamburguer');
    const menuPrincipal = document.querySelector('.menu-principal');
    const body = document.body;

    // Verificar se os elementos existem
    if (!menuHamburguer || !menuPrincipal) {
        console.warn('Elementos do menu não encontrados');
        return;
    }

    // Criar overlay se não existir
    let overlay = document.querySelector('.menu-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'menu-overlay';
        body.appendChild(overlay);
    }

    // Função para alternar menu
    function toggleMenu() {
        menuHamburguer.classList.toggle('ativo');
        menuPrincipal.classList.toggle('ativo');
        overlay.classList.toggle('ativo');
        body.style.overflow = menuPrincipal.classList.contains('ativo') ? 'hidden' : '';
    }

    // Função para fechar menu
    function closeMenu() {
        menuHamburguer.classList.remove('ativo');
        menuPrincipal.classList.remove('ativo');
        overlay.classList.remove('ativo');
        body.style.overflow = '';
    }

    // Event Listeners
    menuHamburguer.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleMenu();
    });

    overlay.addEventListener('click', closeMenu);

    // Fechar menu ao clicar nos links
    menuPrincipal.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Fechar menu ao redimensionar a tela para desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    });

    // Fechar menu ao pressionar ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeMenu();
        }
    });
}); 