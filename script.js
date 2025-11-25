// Seleciona os elementos do DOM com os quais vamos interagir.
const cardContainer = document.querySelector(".card-container"); // Onde os cards serão exibidos.
const inputBusca = document.querySelector("input[type='text']"); // O campo de texto para a busca.

let dados = []; // Array que irá armazenar os dados carregados do data.json.

// Função para normalizar o nome da tecnologia e obter a classe do ícone Devicon.
function getIconClass(nome) {
  const name = nome.toLowerCase();
  // Mapeamento para casos especiais onde o nome não corresponde diretamente ao ícone.
  const specialCases = {
    'c#': 'csharp',
    'c++': 'cplusplus',
    'node.js': 'nodejs',
    'vue.js': 'vuejs',
    'react': 'react-original', // React usa 'original' para o ícone colorido
    'angular': 'angularjs', // Devicon usa 'angularjs' para o ícone do Angular
    'html5': 'html5',
    'css3': 'css3',
    'aws lambda': 'amazonwebservices-original',
    'google': 'google',
    'next.js': 'nextjs-original',
    'express.js': 'express-original',
    'github actions': 'githubactions'
  };

  if (specialCases[name]) {
    return `devicon-${specialCases[name]}-plain`;
  }

  // Remove pontos e outros caracteres que não são usados nas classes do Devicon.
  const normalizedName = name.replace(/\./g, '');

  // Retorna a classe padrão. A maioria dos ícones usa o formato 'devicon-<nome>-plain'.
  return `devicon-${normalizedName}-plain`;
}

// Função responsável por criar e exibir os cards na tela.
function renderizarCards(itens) {
  cardContainer.replaceChildren(); // Limpa os cards existentes de forma otimizada.
  
  // Se a lista de itens estiver vazia, exibe uma mensagem e encerra a função.
  if (itens.length === 0) {
    cardContainer.innerHTML = '<p class="nenhum-resultado">Nenhum resultado encontrado para sua busca.</p>';
    return;
  }
  
  // Itera sobre cada item do array de dados para criar um card.
  itens.forEach(item => {
    const article = document.createElement("article"); // Cria o elemento <article>.
    article.classList.add("card"); // Adiciona a classe CSS 'card' ao article.

    // Gera o HTML para as tags, se existirem.
    const tagsHTML = item.tags 
      ? `<div class="card-tags">${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>`
      : '';

    // Define o conteúdo HTML do card usando template literals para fácil interpolação.
    article.innerHTML = `
      <div class="card-header">
        <i class="${getIconClass(item.nome)} card-icon"></i>
        <h2>${item.nome}</h2>
      </div>
      <div class="card-content">
        <p><strong>Criação:</strong> ${item.data_criacao || item.ano}</p>
        <p class="card-description">${item.descricao}</p>
        ${tagsHTML}
      </div>
      <div class="card-footer">
        <a href="${item.link}" target="_blank" rel="noopener noreferrer">Saiba mais</a>
      </div>
    `;
    cardContainer.appendChild(article); // Adiciona o card recém-criado ao contêiner.
  });
}

// Função assíncrona para carregar os dados do arquivo JSON.
async function carregarDados() {
  try {
    const resposta = await fetch("baseDeConhecimento.json"); // Faz a requisição para o arquivo data.json.
    dados = await resposta.json(); // Converte a resposta em formato JSON e armazena na variável global.
    renderizarCards(dados); // Renderiza todos os cards na tela inicialmente.

    // Atualiza o contador de tecnologias no cabeçalho.
    const techCounter = document.getElementById('tech-count');
    if (techCounter) {
        techCounter.textContent = `${dados.length} tecnologias`;
    }
  } catch (error) {
    // Em caso de erro na requisição, exibe uma mensagem no console e na tela.
    console.error("Falha ao carregar os dados:", error);
    cardContainer.innerHTML = "<p>Não foi possível carregar os dados. Tente novamente mais tarde.</p>";
  }
}

// Função que filtra os dados com base no termo de busca.
function buscarDados() {
  const termoBusca = inputBusca.value.toLowerCase(); // Pega o valor do input e converte para minúsculas.
  
  // Filtra o array 'dados' original.
  const dadosFiltrados = dados.filter(item => 
    item.nome.toLowerCase().includes(termoBusca) || // Verifica se o nome inclui o termo.
    item.descricao.toLowerCase().includes(termoBusca) || // Verifica se a descrição inclui o termo.
    (item.tags && item.tags.some(tag => tag.toLowerCase().includes(termoBusca))) // Verifica se alguma tag inclui o termo.
  );
  renderizarCards(dadosFiltrados); // Renderiza os cards com os dados filtrados.
}


// Adiciona ouvinte de evento para o campo de busca.
inputBusca.addEventListener('input', buscarDados); // Executa a busca dinamicamente enquanto o usuário digita.

carregarDados(); // Chama a função inicial para carregar os dados assim que o script é executado.