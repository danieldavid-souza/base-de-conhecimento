// Aguarda o conteúdo do DOM ser totalmente carregado antes de executar o script.
document.addEventListener("DOMContentLoaded", () => {
  // --- 1. SELETORES DO DOM E VARIÁVEIS DE ESTADO ---

  // Seleciona todos os elementos interativos da página.
  const cardContainer = document.querySelector(".card-container");
  const inputBusca = document.querySelector("input[type='text']");
  const categoryFiltersContainer = document.getElementById("category-filters");
  const sortOptions = document.getElementById("sort-options");
  const techCounter = document.getElementById("tech-count");
  const themeToggleBtn = document.getElementById("theme-toggle");
  const backToTopBtn = document.getElementById("back-to-top-btn");
  const modal = document.getElementById("tech-modal");
  const modalBody = document.getElementById("modal-body");
  const closeModalBtn = document.querySelector(".modal-close-btn");

  // Variáveis para armazenar o estado da aplicação.
  let dados = []; // Array completo de tecnologias, carregado do JSON.
  let activeCategory = "Todos"; // Filtro de categoria ativo.

  // --- 2. FUNÇÕES PRINCIPAIS ---

  /**
   * Carrega os dados iniciais do arquivo JSON e inicializa a aplicação.
   */
  async function carregarDados() {
    try {
      const resposta = await fetch("baseDeConhecimento.json");
      if (!resposta.ok) {
        throw new Error(`Erro HTTP: ${resposta.status}`);
      }
      dados = await resposta.json();
      
      // Após carregar os dados, inicializa as funcionalidades da página.
      populateCategoryFilters();
      applyFiltersAndSort();
    } catch (error) {
      console.error("Falha ao carregar os dados:", error);
      cardContainer.innerHTML = `<p class="nenhum-resultado">Não foi possível carregar os dados. Tente novamente mais tarde.</p>`;
    }
  }

  /**
   * Renderiza os cards na tela com base nos itens filtrados e ordenados.
   * @param {Array} itens - O array de tecnologias a ser exibido.
   */
  function renderizarCards(itens) {
    cardContainer.replaceChildren(); // Limpa o contêiner de forma eficiente.

    techCounter.textContent = `${itens.length} tecnologias`; // Atualiza o contador.

    if (itens.length === 0) {
      cardContainer.innerHTML = '<p class="nenhum-resultado">Nenhum resultado encontrado para sua busca.</p>';
      return;
    }

    itens.forEach(item => {
      const article = document.createElement("article");
      article.className = "card";
      article.addEventListener('click', (e) => {
        if (e.target.tagName !== 'A') showModal(item);
      });

      const tagsHTML = item.tags ? `<div class="card-tags">${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>` : '';

      article.innerHTML = `
        <div class="card-header">
          <i class="${getIconClass(item.nome)} card-icon"></i>
          <h2>${item.nome}</h2>
        </div>
        <div class="card-content">
          <p><strong>Criação:</strong> ${item.data_criacao || item.ano || 'N/A'}</p>
          <p class="card-description">${item.descricao}</p>
          ${tagsHTML}
        </div>
        <div class="card-footer">
          <a href="${item.link}" target="_blank" rel="noopener noreferrer">Saiba mais</a>
        </div>
      `;
      cardContainer.appendChild(article);
    });
  }

  /**
   * Aplica os filtros de busca, categoria e a ordenação selecionada.
   */
  function applyFiltersAndSort() {
    let dadosProcessados = [...dados];

    // 1. Filtro de Busca
    const termoBusca = inputBusca.value.toLowerCase().trim();
    if (termoBusca) {
      dadosProcessados = dadosProcessados.filter(item =>
        item.nome.toLowerCase().includes(termoBusca) ||
        item.descricao.toLowerCase().includes(termoBusca) ||
        (item.tags && item.tags.some(tag => tag.toLowerCase().includes(termoBusca)))
      );
    }

    // 2. Filtro de Categoria
    if (activeCategory !== "Todos") {
      dadosProcessados = dadosProcessados.filter(item => item.categoria === activeCategory);
    }

    // 3. Ordenação
    const currentSort = sortOptions.value;
    switch (currentSort) {
      case 'az':
        dadosProcessados.sort((a, b) => a.nome.localeCompare(b.nome));
        break;
      case 'za':
        dadosProcessados.sort((a, b) => b.nome.localeCompare(a.nome));
        break;
      case 'newest':
        dadosProcessados.sort((a, b) => (b.data_criacao || b.ano || 0) - (a.data_criacao || a.ano || 0));
        break;
      case 'oldest':
        dadosProcessados.sort((a, b) => (a.data_criacao || a.ano || 0) - (b.data_criacao || b.ano || 0));
        break;
    }

    renderizarCards(dadosProcessados);
  }

  // --- 3. FUNÇÕES AUXILIARES E DE UI ---

  /**
   * Normaliza o nome da tecnologia para encontrar a classe de ícone correta.
   * @param {string} nome - O nome da tecnologia.
   * @returns {string} A classe CSS do ícone Devicon.
   */
  function getIconClass(nome) {
    const name = nome.toLowerCase();
    const specialCases = {
      'c#': 'csharp', 'c++': 'cplusplus', 'node.js': 'nodejs', 'vue.js': 'vuejs',
      'react': 'react-original', 'angular': 'angularjs', 'aws lambda': 'amazonwebservices-original',
      'next.js': 'nextjs-original', 'express.js': 'express-original', 'github actions': 'githubactions',
      'google cloud platform (gcp)': 'googlecloud', 'protocol buffers (protobuf)': 'google'
    };

    if (specialCases[name]) {
      return `devicon-${specialCases[name]}-plain`;
    }
    const normalizedName = name.replace(/[\.\s+#()]/g, '');
    return `devicon-${normalizedName.length > 0 ? normalizedName : 'devicon'}-plain`;
  }

  /**
   * Cria dinamicamente os botões de filtro de categoria.
   */
  function populateCategoryFilters() {
    const categorias = ["Todos", ...new Set(dados.map(item => item.categoria).filter(Boolean).sort())];
    categoryFiltersContainer.innerHTML = '';

    categorias.forEach(categoria => {
      const button = document.createElement('button');
      button.textContent = categoria;
      if (categoria === activeCategory) button.classList.add('active');
      
      button.addEventListener('click', () => {
        activeCategory = categoria;
        document.querySelectorAll('.category-filters button').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        applyFiltersAndSort();
      });
      categoryFiltersContainer.appendChild(button);
    });
  }

  /**
   * Exibe o modal com os detalhes de uma tecnologia.
   * @param {object} item - O objeto da tecnologia clicada.
   */
  function showModal(item) {
    const tagsHTML = item.tags ? `<div class="card-tags">${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>` : '';
    modalBody.innerHTML = `
      <div class="card-header">
        <i class="${getIconClass(item.nome)} card-icon"></i>
        <h2>${item.nome}</h2>
      </div>
      <div class="card-content">
        <p><strong>Criação:</strong> ${item.data_criacao || item.ano || 'N/A'}</p>
        <p><strong>Categoria:</strong> ${item.categoria || 'Não definida'}</p>
        <p class="card-description">${item.descricao}</p>
        ${tagsHTML}
      </div>
      <div class="card-footer">
        <a href="${item.link}" target="_blank" rel="noopener noreferrer">Saiba mais</a>
      </div>
    `;
    modal.style.display = "block";
  }

  /**
   * Gerencia a funcionalidade do botão "Voltar ao Topo".
   */
  function handleScroll() {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add("show");
    } else {
      backToTopBtn.classList.remove("show");
    }
  }

  /**
   * Gerencia a funcionalidade de alternância de tema (claro/escuro).
   */
  function toggleTheme() {
    const isLight = document.body.classList.toggle("light-mode");
    localStorage.setItem("theme", isLight ? "light" : "dark");
  }

  /**
   * Carrega o tema salvo do localStorage ao iniciar a página.
   */
  function loadTheme() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
      document.body.classList.add("light-mode");
    }
  }

  // --- 4. INICIALIZAÇÃO E OUVINTES DE EVENTOS ---

  // Adiciona os ouvintes de eventos aos elementos da página.
  inputBusca.addEventListener('input', applyFiltersAndSort);
  sortOptions.addEventListener('change', applyFiltersAndSort);
  themeToggleBtn.addEventListener('click', toggleTheme);
  
  // Eventos para fechar o modal.
  closeModalBtn.addEventListener('click', () => modal.style.display = "none");
  window.addEventListener('click', (event) => {
    if (event.target === modal) modal.style.display = "none";
  });

  // Eventos do botão "Voltar ao Topo".
  window.addEventListener('scroll', handleScroll);
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Carrega o tema salvo e os dados iniciais.
  loadTheme();
  carregarDados();
});