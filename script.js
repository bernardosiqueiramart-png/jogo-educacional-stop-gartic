// ========== DADOS DO JOGO ==========
const alfabeto = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const palavrasValidas = {
    A: ['Árvore', 'Amor', 'Abacaxi', 'Açúcar', 'Adolescência', 'Acento', 'Assado'],
    B: ['Bola', 'Borboleta', 'Brilho', 'Bronco', 'Bussola'],
    C: ['Carro', 'Casa', 'Cabeça', 'Carapuça', 'Consciente', 'Classe', 'Coração'],
    D: ['Dado', 'Dança', 'Disco', 'Disciplina', 'Descrição'],
    E: ['Escola', 'Elefante', 'Escada', 'Espaço', 'Espécie'],
    F: ['Flor', 'Fascinação', 'Fase', 'Formiga', 'Frase'],
    G: ['Gato', 'Girafa', 'Graça', 'Guarda'],
    H: ['Homem', 'História', 'Hora', 'Horizonte'],
    I: ['Igreja', 'Ilusão', 'Idade'],
    J: ['Jogo', 'Jarra', 'Jornada'],
    K: ['Kung Fu', 'Kit'],
    L: ['Leão', 'Louça', 'Loucura', 'Livro', 'Lição'],
    M: ['Maçã', 'Massa', 'Misterioso', 'Mãe', 'Mensagem'],
    N: ['Nascimento', 'Nostalgia', 'Nação'],
    O: ['Ovo', 'Ouro', 'Ópera', 'Orquestra'],
    P: ['Paço', 'Pássaro', 'Passagem', 'Perseverança'],
    Q: ['Quarto', 'Qualidade'],
    R: ['Raça', 'Rio', 'Repouso'],
    S: ['Sapato', 'Sacrário', 'Sucessão'],
    T: ['Tartaruga', 'Tradição', 'Terceira'],
    U: ['Urubu', 'Universo'],
    V: ['Vaca', 'Visconde', 'Vitória'],
    W: ['Windsurf'],
    X: ['Xícara'],
    Y: ['Iate'],
    Z: ['Zebra', 'Zona']
};

// Palavras especiais que contêm ç, sc, ss
const palavrasEspeciais = {
    A: ['Açúcar', 'Adolescência', 'Acento', 'Assado'],
    B: ['Bussola'],
    C: ['Cabeça', 'Carapuça', 'Consciente', 'Classe', 'Coração'],
    D: ['Disco', 'Disciplina', 'Descrição'],
    E: ['Escada', 'Espaço', 'Espécie'],
    F: ['Fascinação', 'Fase', 'Frase'],
    G: ['Graça', 'Guarda'],
    J: ['Jarra'],
    L: ['Louça', 'Loucura', 'Lição'],
    M: ['Maçã', 'Massa', 'Misterioso', 'Mensagem'],
    N: ['Nascimento', 'Nostalgia', 'Nação'],
    P: ['Paço', 'Pássaro', 'Passagem', 'Perseverança'],
    R: ['Raça', 'Repouso'],
    S: ['Sacrário', 'Sucessão'],
    T: ['Tartaruga', 'Tradição', 'Terceira'],
    V: ['Visconde'],
    Z: ['Zona']
};

// ========== VARIÁVEIS DE ESTADO ==========
let jogoEmProgresso = false;
let letraAtual = '';
let tempoRestante = 60;
let pontos = 0;
let categoriaAtual = 'normal';
let palavrasJogadas = [];
let timerInterval = null;

// ========== FUNÇÕES PRINCIPAIS ==========

function iniciarJogo() {
    document.getElementById('menu').classList.add('hidden');
    document.getElementById('jogo').classList.remove('hidden');
    
    jogoEmProgresso = true;
    tempoRestante = 60;
    pontos = 0;
    palavrasJogadas = [];
    categoriaAtual = 'normal';
    
    sortearLetra();
    iniciarTempo();
    document.getElementById('inputPalavra').focus();
}

function sortearLetra() {
    letraAtual = alfabeto[Math.floor(Math.random() * alfabeto.length)];
    document.getElementById('letra').textContent = letraAtual;
    document.getElementById('pontos').textContent = '0';
    document.getElementById('listaPalavras').innerHTML = '';
}

function iniciarTempo() {
    if (timerInterval) clearInterval(timerInterval);
    
    timerInterval = setInterval(() => {
        tempoRestante--;
        document.getElementById('tempo').textContent = tempoRestante;
        
        if (tempoRestante <= 0) {
            pararJogo();
        }
    }, 1000);
}

function verificarEnter(event) {
    if (event.key === 'Enter') {
        adicionarPalavra();
    }
}

function adicionarPalavra() {
    const input = document.getElementById('inputPalavra');
    const palavra = input.value.trim().toLowerCase();
    
    if (!palavra) {
        alert('Digite uma palavra!');
        return;
    }
    
    // Limpar input
    input.value = '';
    input.focus();
    
    // Verificar se a palavra já foi usada
    if (palavrasJogadas.some(p => p.palavra === palavra)) {
        adicionarNaLista(palavra, 'erro', 'Palavra repetida!');
        return;
    }
    
    // Verificar se começa com a letra correta
    if (!palavra.startsWith(letraAtual.toLowerCase())) {
        adicionarNaLista(palavra, 'erro', 'Não começa com ' + letraAtual);
        return;
    }
    
    // Verificar se a palavra é válida
    const palavrasDisponíveis = palavrasValidas[letraAtual];
    const palavraCapitalizada = palavra.charAt(0).toUpperCase() + palavra.slice(1);
    
    const existe = palavrasDisponíveis.some(p => p.toLowerCase() === palavra);
    
    if (!existe) {
        adicionarNaLista(palavra, 'erro', 'Palavra não reconhecida');
        return;
    }
    
    // Verificar se é palavra especial (com ç, sc, ss)
    const éEspecial = palavrasEspeciais[letraAtual].some(p => p.toLowerCase() === palavra);
    
    if (categoriaAtual === 'normal' && éEspecial) {
        adicionarNaLista(palavra, 'erro', 'Esta palavra tem ç/sc/ss! Escolha a categoria correta.');
        return;
    }
    
    if (categoriaAtual === 'especial' && !éEspecial) {
        adicionarNaLista(palavra, 'erro', 'Esta palavra não tem ç/sc/ss');
        return;
    }
    
    // Calcular pontos
    let pontosGanhos = 1;
    if (éEspecial && categoriaAtual === 'especial') {
        pontosGanhos = 2; // Bônus de 2 pontos para palavras especiais
    }
    
    pontos += pontosGanhos;
    document.getElementById('pontos').textContent = pontos;
    
    const classe = categoriaAtual === 'especial' ? 'bonus' : 'correto';
    const emoji = categoriaAtual === 'especial' ? '⭐' : '✅';
    adicionarNaLista(palavra, classe, `${emoji} ${pontosGanhos} ponto(s)`);
    
    palavrasJogadas.push({ 
        palavra, 
        pontos: pontosGanhos,
        éEspecial: éEspecial
    });
}

function adicionarNaLista(palavra, classe, mensagem) {
    const lista = document.getElementById('listaPalavras');
    const li = document.createElement('li');
    li.className = classe;
    li.textContent = `${palavra} - ${mensagem}`;
    lista.appendChild(li);
    lista.scrollTop = lista.scrollHeight;
}

function selecionarCategoria(categoria) {
    categoriaAtual = categoria;
    document.getElementById('btn-normal').classList.toggle('ativo', categoria === 'normal');
    document.getElementById('btn-especial').classList.toggle('ativo', categoria === 'especial');
}

function pararJogo() {
    jogoEmProgresso = false;
    clearInterval(timerInterval);
    document.getElementById('jogo').classList.add('hidden');
    
    // Calcular estatísticas
    const acertadas = palavrasJogadas.filter(p => {
        const palavra = p.palavra;
        const éEspecial = palavrasEspeciais[letraAtual].some(pw => pw.toLowerCase() === palavra);
        return éEspecial ? p.éEspecial : true;
    }).length;
    
    const bonusTotal = palavrasJogadas
        .filter(p => p.éEspecial)
        .reduce((acc, p) => acc + p.pontos, 0);
    
    document.getElementById('pontosFinal').textContent = pontos;
    document.getElementById('palavrasAcertadas').textContent = acertadas;
    document.getElementById('bonusTotal').textContent = bonusTotal;
    
    document.getElementById('resultado').classList.remove('hidden');
}

function voltarMenu() {
    document.getElementById('resultado').classList.add('hidden');
    document.getElementById('menu').classList.remove('hidden');
    
    // Reset de variáveis
    jogoEmProgresso = false;
    tempoRestante = 60;
    pontos = 0;
    palavrasJogadas = [];
    categoriaAtual = 'normal';
}

function mostrarInstruções() {
    document.getElementById('instrucoes').classList.remove('hidden');
}

function verEstrutura() {
    document.getElementById('estudo').classList.remove('hidden');
}

function fecharModal() {
    document.getElementById('instrucoes').classList.add('hidden');
    document.getElementById('estudo').classList.add('hidden');
    document.getElementById('resultado').classList.add('hidden');
}

// Fechar modal ao clicar fora
window.onclick = function(event) {
    const modais = ['instrucoes', 'estudo', 'resultado'];
    modais.forEach(id => {
        const modal = document.getElementById(id);
        if (event.target === modal) {
            modal.classList.add('hidden');
        }
    });
}
