// Carrega os dados das placas do arquivo JSON
let placasData = {};

fetch('../data/placas.json')
    .then(response => response.json())
    .then(data => {
        placasData = data;
        // Carrega as placas iniciais após carregar o JSON
        carregarPlacas('regulamentacao');
    })
    .catch(error => {
        console.error('Erro ao carregar dados das placas:', error);
    });

// Função para carregar as placas na interface
function carregarPlacas(tipo = 'regulamentacao') {
    const placasGrid = document.querySelector('.placas-grid');
    placasGrid.innerHTML = ''; // Limpa o grid atual

    const placas = placasData[tipo];
    if (!placas) return;

    placas.forEach(placa => {
        const placaElement = document.createElement('div');
        placaElement.className = 'placa-item';
        placaElement.innerHTML = `
            <span class="placa-codigo">${placa.id}</span>
            <img src="${placa.imagem}" alt="${placa.nome}" class="placa-imagem">
            <div class="placa-info">
                <h3>${placa.nome}</h3>
                <p>${placa.descricao}</p>
            </div>
        `;
        placasGrid.appendChild(placaElement);
    });
}

// Função para filtrar placas
function filtrarPlacas(termo) {
    const tipoAtivo = document.querySelector('.filtro-btn.ativo').dataset.tipo;
    const placas = placasData[tipoAtivo];
    
    if (!placas) return;

    const placasFiltradas = placas.filter(placa => 
        placa.nome.toLowerCase().includes(termo.toLowerCase()) ||
        placa.id.toLowerCase().includes(termo.toLowerCase()) ||
        placa.descricao.toLowerCase().includes(termo.toLowerCase())
    );

    const placasGrid = document.querySelector('.placas-grid');
    placasGrid.innerHTML = '';

    placasFiltradas.forEach(placa => {
        const placaElement = document.createElement('div');
        placaElement.className = 'placa-item';
        placaElement.innerHTML = `
            <img src="${placa.imagem}" alt="${placa.nome}" class="placa-imagem">
            <div class="placa-info">
                <h3>${placa.id} - ${placa.nome}</h3>
                <p>${placa.descricao}</p>
            </div>
        `;
        placasGrid.appendChild(placaElement);
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Configurar filtros de tipo de placa
    const filtrosBtns = document.querySelectorAll('.filtro-btn');
    filtrosBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove classe ativo de todos os botões
            filtrosBtns.forEach(b => b.classList.remove('ativo'));
            // Adiciona classe ativo ao botão clicado
            e.target.classList.add('ativo');
            // Carrega as placas do tipo selecionado
            carregarPlacas(e.target.dataset.tipo);
        });
    });

    // Configurar pesquisa
    const pesquisaInput = document.querySelector('#pesquisa-placas');
    pesquisaInput.addEventListener('input', (e) => {
        filtrarPlacas(e.target.value);
    });
}); 