const PALAVRAS = [
  "CACHORRO","ELEFANTE","GIRAFA","LEAO","TIGRE","BALEIA","GOLFINHO",
  "TUBARAO","TARTARUGA","CORUJA","ABACAXI","MELANCIA","MORANGO",
  "BANANA","LARANJA"
];

const TEMAS = {
  "CACHORRO":"Animal","ELEFANTE":"Animal","GIRAFA":"Animal","LEAO":"Animal",
  "TIGRE":"Animal","BALEIA":"Animal","GOLFINHO":"Animal","TUBARAO":"Animal",
  "TARTARUGA":"Animal","CORUJA":"Animal","ABACAXI":"Fruta","MELANCIA":"Fruta",
  "MORANGO":"Fruta","BANANA":"Fruta","LARANJA":"Fruta"
};

const PARTES = ['head','body','arm-left','arm-right','leg-left','leg-right'];

let state = { player:'', palavra:'', acertos:[], erros:0, jogando:false };
let scores = JSON.parse(localStorage.getItem('forca_scores') || '[]');

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + id).classList.add('active');
}

function iniciarJogo() {
  const nome = document.getElementById('player-name').value.trim();
  if (!nome || !/^[a-zA-ZÀ-ÿ ]+$/.test(nome)) {
    document.getElementById('player-name').focus();
    document.getElementById('player-name').style.borderColor = '#f85149';
    setTimeout(() => document.getElementById('player-name').style.borderColor = '', 1000);
    return;
  }
  state.player = nome;
  state.palavra = PALAVRAS[Math.floor(Math.random() * PALAVRAS.length)];
  state.acertos = [];
  state.erros = 0;
  state.jogando = true;

  document.getElementById('display-player').textContent = nome;
  document.getElementById('display-tema').textContent = TEMAS[state.palavra] || 'Desconhecido';

  renderForca();
  renderPalavra();
  renderTeclado();
  renderErros();
  showScreen('game');
}

function renderForca() {
  PARTES.forEach((id, i) => {
    document.getElementById(id).style.display = i < state.erros ? 'block' : 'none';
  });
}

function renderPalavra() {
  const wrap = document.getElementById('word-letters');
  wrap.innerHTML = '';
  let adivinha = '';
  for (const letra of state.palavra) {
    const box = document.createElement('div');
    box.className = 'letter-box' + (state.acertos.includes(letra) ? ' revealed' : '');
    box.textContent = state.acertos.includes(letra) ? letra : '';
    wrap.appendChild(box);
    adivinha += state.acertos.includes(letra) ? letra : '_';
  }
  document.getElementById('word-hint').textContent = state.palavra.length + ' letras';
  return adivinha;
}

function renderTeclado() {
  const kb = document.getElementById('keyboard');
  kb.innerHTML = '';
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(letra => {
    const btn = document.createElement('button');
    btn.className = 'key';
    btn.textContent = letra;
    btn.id = 'key-' + letra;
    btn.onclick = () => tentarLetra(letra);
    kb.appendChild(btn);
  });
}

function renderErros() {
  const bar = document.getElementById('erros-bar');
  bar.innerHTML = '';
  for (let i = 0; i < 6; i++) {
    const dot = document.createElement('div');
    dot.className = 'erro-dot' + (i < state.erros ? ' active' : '');
    bar.appendChild(dot);
  }
}

function tentarLetra(letra) {
  if (!state.jogando) return;
  const btn = document.getElementById('key-' + letra);
  if (btn.disabled) return;
  btn.disabled = true;

  if (state.palavra.includes(letra)) {
    state.acertos.push(letra);
    btn.classList.add('hit');
  } else {
    state.erros++;
    btn.classList.add('miss');
  }

  renderForca();
  renderErros();
  const adivinha = renderPalavra();

  if (adivinha === state.palavra) {
    setTimeout(() => mostrarResultado(true), 300);
  } else if (state.erros >= 6) {
    setTimeout(() => mostrarResultado(false), 300);
  }
}

function calcScore(erros) {
  const tabela = [1000,800,600,400,200,100,0];
  return tabela[erros] || 0;
}

function mostrarResultado(ganhou) {
  state.jogando = false;
  const score = ganhou ? calcScore(state.erros) : 0;

  scores.push({ nome: state.player, pontos: score, data: new Date().toLocaleDateString('pt-BR') });
  scores.sort((a,b) => b.pontos - a.pontos);
  if (scores.length > 20) scores = scores.slice(0, 20);
  localStorage.setItem('forca_scores', JSON.stringify(scores));

  document.getElementById('result-icon').textContent = ganhou ? '🎉' : '💀';
  const title = document.getElementById('result-title');
  title.textContent = ganhou ? 'Você acertou!' : 'Enforcado!';
  title.className = 'result-title ' + (ganhou ? 'win' : 'lose');
  document.getElementById('result-word').innerHTML = 'A palavra era: <span>' + state.palavra + '</span>';
  document.getElementById('result-score').textContent = score;

  showScreen('result');
}

function jogarNovamente() {
  iniciarJogoComNome(state.player);
}

function iniciarJogoComNome(nome) {
  state.player = nome;
  state.palavra = PALAVRAS[Math.floor(Math.random() * PALAVRAS.length)];
  state.acertos = [];
  state.erros = 0;
  state.jogando = true;

  document.getElementById('display-player').textContent = nome;
  document.getElementById('display-tema').textContent = TEMAS[state.palavra] || '?';

  renderForca();
  renderPalavra();
  renderTeclado();
  renderErros();
  showScreen('game');
}

function mostrarScore() {
  const list = document.getElementById('score-list');
  if (scores.length === 0) {
    list.innerHTML = '<div class="score-empty">Nenhum placar ainda.<br>Jogue para aparecer aqui!</div>';
  } else {
    list.innerHTML = scores.slice(0,10).map((s,i) =>
      `<li class="score-item">
        <span class="rank">${i+1}.</span>
        <span class="s-name">${s.nome}</span>
        <span class="s-pts">${s.pontos} pts</span>
      </li>`
    ).join('');
  }
  showScreen('score');
}

function voltarMenu() { showScreen('menu'); }

// teclado físico
document.addEventListener('keydown', e => {
  if (document.getElementById('screen-game').classList.contains('active')) {
    const letra = e.key.toUpperCase();
    if (/^[A-Z]$/.test(letra)) tentarLetra(letra);
  }
});