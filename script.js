const tela = document.getElementById('tela');
const ctx = tela.getContext('2d');
const placar = document.getElementById('placar');
const T = 20;
const N = 20;

let cobra, dir, comida, pontos, timer, fim;

function iniciar() {
  cobra = [{ x: 10, y: 10 }];
  dir = { x: 1, y: 0 };
  comida = { x: 5, y: 5 };
  pontos = 0;
  fim = false;
  placar.textContent = 'Pontos: 0';
  clearInterval(timer);
  timer = setInterval(passo, 110);
}

function passo() {
  const cabeca = {
    x: (cobra[0].x + dir.x + N) % N,
    y: (cobra[0].y + dir.y + N) % N
  };

  if (cobra.some(s => s.x === cabeca.x && s.y === cabeca.y)) {
    clearInterval(timer);
    fim = true;
    placar.textContent = 'Fim! Pontos: ' + pontos;
    return;
  }

  cobra.unshift(cabeca);

  if (cabeca.x === comida.x && cabeca.y === comida.y) {
    pontos++;
    placar.textContent = 'Pontos: ' + pontos;
    comida = {
      x: Math.floor(Math.random() * N),
      y: Math.floor(Math.random() * N)
    };
  } else {
    cobra.pop();
  }

  desenhar();
}

function desenhar() {
  ctx.clearRect(0, 0, tela.width, tela.height);
  ctx.fillStyle = '#f87171';
  ctx.fillRect(comida.x * T, comida.y * T, T - 2, T - 2);
  ctx.fillStyle = '#4ade80';
  cobra.forEach(s => ctx.fillRect(s.x * T, s.y * T, T - 2, T - 2));
}

function virar(dx, dy) {
  if (dx !== -dir.x || dy !== -dir.y) dir = { x: dx, y: dy };
}

const teclas = {
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0]
};

document.addEventListener('keydown', e => {
  if (teclas[e.key]) {
    e.preventDefault();
    virar(...teclas[e.key]);
  } else if (fim) {
    iniciar();
  }
});

let inicioToque;
tela.addEventListener('touchstart', e => (inicioToque = e.touches[0]));
tela.addEventListener('touchend', e => {
  if (fim) return iniciar();
  const dx = e.changedTouches[0].clientX - inicioToque.clientX;
  const dy = e.changedTouches[0].clientY - inicioToque.clientY;
  Math.abs(dx) > Math.abs(dy) ? virar(Math.sign(dx), 0) : virar(0, Math.sign(dy));
});

iniciar();
