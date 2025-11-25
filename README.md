# 📚 Base de Conhecimento de Tecnologias

![Status](https://img.shields.io/badge/status-ativo-brightgreen)
![Licença](https://img.shields.io/badge/licen%C3%A7a-MIT-blue)

Uma aplicação web interativa e elegante que serve como uma base de conhecimento para diversas linguagens de programação e tecnologias. O projeto permite aos usuários visualizar e pesquisar informações detalhadas sobre cada tecnologia em um layout de cards responsivo.

A base de conhecimento é expandida dinamicamente utilizando a API do Google Gemini para gerar novas entradas.

---

## ✨ Funcionalidades

- **Visualização em Cards:** As tecnologias são exibidas em um layout de grid com cards elegantes e informativos.
- **Ícones de Tecnologia:** Cada card exibe o ícone oficial da respectiva linguagem ou ferramenta, melhorando a identificação visual.
- **Busca Dinâmica:** Filtre as tecnologias em tempo real digitando no campo de busca. A pesquisa abrange nomes, descrições e tags.
- **Design Responsivo:** A interface se adapta perfeitamente a diferentes tamanhos de tela, de desktops a dispositivos móveis.
- **Carregamento Assíncrono:** Os dados são carregados de um arquivo JSON local de forma assíncrona, sem travar a interface.
- **Contador de Tecnologias:** O cabeçalho exibe dinamicamente o número total de tecnologias disponíveis na base de dados.
- **Botão de Administrador:** Em ambiente de desenvolvimento (`localhost`), um botão especial "Aumentar Conhecimento" fica visível, permitindo ao administrador executar o script que adiciona novas tecnologias à base de dados com um único clique.

---

## 🛠️ Tecnologias Utilizadas

- **HTML5:** Para a estrutura semântica do conteúdo.
- **Google Gemini API:** Para gerar o conteúdo das novas tecnologias de forma automática.

---

## ⚙️ Como Executar o Projeto

Existem duas maneiras de executar o projeto:
1.  Abra o arquivo `index.html` no seu navegador.
2.  A maneira mais fácil é usar uma extensão como o **Live Server** no Visual Studio Code.

### Modo de Desenvolvimento Completo (com o botão "Aumentar Conhecimento")

Para poder usar o botão e aumentar a base de conhecimento:

Existem duas formas de adicionar novas tecnologias ao arquivo `baseDeConhecimento.json`:

### Via Botão na Interface (Recomendado)
- Siga os passos do "Modo de Desenvolvimento Completo".
- Com o servidor rodando (`npm run server`), acesse a página no seu `localhost`.
- Clique no botão "Aumentar Conhecimento".
- Aguarde a confirmação e a página será recarregada com os novos itens.

### Via Linha de Comando

Esta seção descreve o funcionamento do script `gerador.js`.

**Descrição curta**
Cria e expande automaticamente uma base de conhecimento em JSON adicionando, em cada execução, 25 novas entradas únicas sobre tecnologias (linguagens, frameworks, ferramentas, bancos de dados, metodologias). A lógica usa a API Gemini para gerar conteúdo estruturado e valida/mescla o resultado com o arquivo local `baseDeConhecimento.json`.

**O que ele faz (resumido)**
- Gera exatamente 25 novas entradas em formato JSON.
- Evita repetir nomes já presentes na base.
- Faz validação básica da resposta (garante que seja um ARRAY com 25 objetos).
- Realiza tentativas com backoff exponencial em caso de falhas.
- Atualiza (sobrescreve) o arquivo `baseDeConhecimento.json` com a base combinada.

**Como executar (resumido)**
1. Instale dependências:
   ```sh
   npm install
   ```

2. Crie um arquivo `.env` na raiz com:
   `GEMINI_API_KEY="SUA_CHAVE_AQUI"`

3. Execute:
   ```sh
   npm start
   ```

**O que esperar**
- Ao finalizar, o arquivo `baseDeConhecimento.json` será atualizado com as entradas antigas + 25 novas geradas.
- Logs no console informam sucesso, número de itens e possíveis erros.







---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.