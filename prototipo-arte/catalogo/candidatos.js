// Pherotrio · candidatos da rodada 9 (D116 fechada): eventos de dentro do formigueiro.
// Escavação de túnel, obra de câmara, nascimento, onda lateral chegando e expedição saindo.
// Hoje: o túnel cavando tem só a cavadora na ponta; a câmara em obra tem um bloco de terra que corre por dentro;
// a larva nunca vira formiga; o túnel rival já aparece pronto; a expedição anda como qualquer formiga.
(() => {
  const A = window.Arte, C = A.C, { mix, LOD } = A, PI = Math.PI, TAU = PI * 2;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v)), suave = k => k * k * (3 - 2 * k), mod = (t, p) => ((t % p) + p) % p;
  const ES = id => A.ESTRUTURAS.find(e => e.id === id);
  const TERRA = '#C4AD8C', RACHA = '#4A3B2F'; // farelo: terra solta, mais clara que o solo para aparecer no túnel e na terra

  const OPCOES = {
    escava: {
      atual: { nome: 'Atual', desc: 'A parte cavada fica cheia, o resto tracejado, e uma cavadora balança a cabeça na ponta.' },
      A: { nome: 'A · Terra voando', desc: 'A ponta do túnel fica irregular e a cavadora joga farelos de terra para trás, em arco.' },
      B: { nome: 'B · Terra vira argila', desc: 'A mais duas operárias que levam bolinhas de argila da ponta para trás. Mostra que escavar rende argila (1 a cada 5 pt, 02 §4.2).' },
      C: { nome: 'C · Frente fofa', desc: 'A terra em volta da ponta fica mais clara, como terra solta, e sobem nuvenzinhas de poeira. Sem farelos voando.' },
    },
    obra: {
      atual: { nome: 'Atual', desc: 'Contorno tracejado e um bloco de terra que corre de um lado ao outro por dentro, com duas cavadoras.' },
      A: { nome: 'A · Cava a partir da porta', desc: 'O vão abre da porta para o fundo, com a frente irregular, e as cavadoras trabalham nela. O custo que falta aparece no meio.' },
      B: { nome: 'B · Escurece por igual', desc: 'A cúpula inteira escurece aos poucos, da cor da terra para o escuro do túnel, e o contorno vai enchendo como uma barra.' },
      C: { nome: 'C · Da porta, com contorno', desc: 'A A mais o contorno que enche como barra, para ler o progresso no zoom médio.' },
    },
    nasce: {
      atual: { nome: 'Atual', desc: 'A larva some e a formiga aparece no lugar, de uma vez.' },
      A: { nome: 'A · Casulo', desc: 'No fim, a larva vira um casulo claro que se mexe e abre ao meio. A formiga sai, se ajeita e vai para a porta.' },
      B: { nome: 'B · Pulo', desc: 'A larva se encolhe, estoura num anel da cor da casta e a formiga sai pulando, como a moedinha dos itens (D113).' },
      C: { nome: 'C · Casulo e ícone', desc: 'A A mais o ícone da casta, que pula acima do berçário quando ela sai, para saber no zoom médio que nasceu um soldado.' },
    },
    onda: {
      atual: { nome: 'Atual', desc: 'O túnel rival cresce tracejado de vermelho, com a rival da frente cavando. Nada avisa para onde ele vai.' },
      A: { nome: 'A · Terra voando', desc: 'A ponta do túnel rival joga farelos para trás, como a escavação das suas formigas.' },
      B: { nome: 'B · Rachaduras à frente', desc: 'Rachaduras aparecem na terra até 1,6 célula à frente da ponta, na linha que o túnel vai seguir. Mostra onde ele vai bater sem precisar de interface.' },
      C: { nome: 'C · Prévia tracejada', desc: 'Uma linha vermelha tracejada liga a ponta à câmara que vai ser atacada, com um anel no ponto de impacto.' },
    },
    expedicao: {
      atual: { nome: 'Atual', desc: 'As formigas da expedição saem do posto e andam como qualquer outra.' },
      A: { nome: 'A · Bandeira', desc: 'A primeira da coluna leva uma bandeirinha violeta (cor de ataque), e as outras vão coladas atrás.' },
      B: { nome: 'B · Rastro violeta', desc: 'A coluna deixa no túnel um rastro pontilhado de feromônio violeta, que some devagar em 5 s. Mostra o caminho da expedição mesmo de longe.' },
      C: { nome: 'C · Grupo com número', desc: 'Um halo violeta suave junta a coluna, e um número em cima diz quantas formigas vão.' },
    },
  };

  // ---------------- ajudas ----------------
  // farelos jogados para trás em arco, a partir da ponta (x, y), com ângulo de avanço ang
  function farelos(ctx, x, y, ang, T, z, cor, n, alcance) {
    const px = 1 / z, bx = -Math.cos(ang), by = -Math.sin(ang); ctx.save(); ctx.fillStyle = cor;
    for (let j = 0; j < n; j++) {
      const ph = mod(T * 1.6 + j / n, 1), d = (0.06 + ph * (alcance || 0.32)) * (0.8 + 0.4 * ((j * 7) % 3) / 2), side = ((j % 3) - 1) * 0.05;
      ctx.globalAlpha = ph < 0.6 ? 1 : (1 - ph) / 0.4; ctx.beginPath(); ctx.arc(x + bx * d - by * side, y + by * d + bx * side - Math.sin(ph * PI) * 0.08, Math.max(0.022, 1.9 * px), 0, TAU); ctx.fill();
    }
    ctx.restore();
  }
  // ponta irregular: calombos de terra cavada além da ponta redonda do túnel
  function pontaIrregular(ctx, x, y, ang, w) {
    ctx.save(); ctx.fillStyle = C.base;
    [-0.7, 0, 0.7].forEach((a, i) => { const r = w * (0.26 - (i % 2) * 0.06), d = w * 0.4; ctx.beginPath(); ctx.arc(x + Math.cos(ang + a) * d, y + Math.sin(ang + a) * d, r, 0, TAU); ctx.fill(); });
    ctx.restore();
  }
  function poeira(ctx, x, y, T) {
    ctx.save(); ctx.fillStyle = '#CBB89E';
    for (let j = 0; j < 3; j++) { const ph = mod(T * 0.9 + j / 3, 1); ctx.globalAlpha = 0.35 * (1 - ph); ctx.beginPath(); ctx.arc(x + (j - 1) * 0.08, y - 0.04 - ph * 0.2, 0.04 + ph * 0.07, 0, TAU); ctx.fill(); }
    ctx.restore();
  }
  function terraFofa(ctx, x, y, w) {
    const gr = ctx.createRadialGradient(x, y, w * 0.3, x, y, w * 1.6); gr.addColorStop(0, 'rgba(203,184,158,0.55)'); gr.addColorStop(1, 'rgba(203,184,158,0)');
    ctx.save(); ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(x, y, w * 1.6, 0, TAU); ctx.fill(); ctx.restore();
  }
  const reto = (a, b) => A.curve(a, b, 0.0001);
  // vai e volta entre 0 e uma ponta que avança (Lf(t)): anda até a ponta, pega (0,3 s), volta, solta (0,25 s) e repete.
  // Simulado desde o começo do loop, para a formiga andar sem saltos mesmo com a ponta crescendo.
  function vaiVem(t, Lf, t0, v) {
    if (t < t0) return null;
    let s = 0, ida = true, pausa = 0; const dt = 1 / 30;
    for (let tt = t0; tt < t; tt += dt) {
      if (pausa > 0) { pausa -= dt; continue; }
      if (ida) { s += v * dt; const L = Lf(tt); if (s >= L) { s = L; ida = false; pausa = 0.3; } }
      else { s -= v * dt; if (s <= 0) { s = 0; ida = true; pausa = 0.25; } }
    }
    return { s, volta: !ida };
  }

  // ---------------- 1. escavação de túnel ----------------
  // nó à esquerda; túnel novo de 3,3 células até a direita. 7 s cavando, 2 s pronto.
  function escavacao(ctx, z, T, tags, S) {
    const t = mod(T, 9), k = clamp(t / 7), a = { x: 0.6, y: 0.72 }, b = { x: 3.9, y: 0.56 }, P = reto(a, b), w = A.LARG[1];
    A.tunel(ctx, reto({ x: -0.6, y: 0.78 }, a), 1, 'livre', z, { T });
    if (S.escava === 'atual') { A.tunel(ctx, P, 1, 'escavando', z, { T }); A.no(ctx, a.x, a.y, 1, z); return; }
    const L = P.len * k, q = A.at(P, Math.max(0.01, L));
    if (k < 1) A.tunel(ctx, P, 1, 'planejado', z, { T });
    if (S.escava === 'C' && k < 1) terraFofa(ctx, q.x, q.y, w);
    if (L > 0.02) A.tunel(ctx, reto(a, q), 1, 'livre', z, { T });
    A.no(ctx, a.x, a.y, 1, z);
    if (k >= 1) return;
    if (S.escava !== 'C') pontaIrregular(ctx, q.x, q.y, q.ang, w);
    // carregadoras de argila (B): vão e voltam entre a ponta e o nó
    if (S.escava === 'B') [1.3, 2.7].forEach(t0 => {
      const r = vaiVem(t, tt => Math.max(0.1, P.len * clamp(tt / 7) - 0.3), t0, 0.9); if (!r) return;
      const e = A.at(P, Math.max(0.02, r.s)); ctx.save(); ctx.globalAlpha = clamp((t - t0) / 0.3) * clamp((7 - t) / 0.4);
      A.ant(ctx, 'operaria', e.x, e.y + (r.volta ? 0.03 : -0.03), e.ang + (r.volta ? PI : 0), z, r.volta ? { carry: 'argila' } : {}); ctx.restore();
    });
    const cx = q.x - Math.cos(q.ang) * 0.13, cy = q.y - Math.sin(q.ang) * 0.13;
    A.ant(ctx, 'cavadora', cx, cy, q.ang, z, { nod: Math.sin(T * 9) });
    if (S.escava === 'A' || S.escava === 'B') farelos(ctx, q.x, q.y, q.ang, T, z, TERRA, S.escava === 'B' ? 4 : 6);
    if (S.escava === 'C') poeira(ctx, q.x, q.y, T);
  }

  // ---------------- 2. obra de câmara ----------------
  const JAR = ES('jardim'), GX = 1.2, GY = 0;
  function perimetro(g) { let L = (g.x1 - g.x0) + 2 * (g.yb - g.yw); for (let i = 1; i < g.roof.length; i++) L += Math.hypot(g.roof[i].x - g.roof[i - 1].x, g.roof[i].y - g.roof[i - 1].y); return L; }
  function obra(ctx, z, T, tags, S) {
    const t = mod(T, 10), k = clamp(t / 7.5), g = A.geom(JAR, GX, GY, 7), px = 1 / z;
    A.tunel(ctx, A.curve({ x: -0.5, y: 0.45 }, { x: g.door.x + 0.02, y: g.door.y }, 0.05), 1, 'livre', z, { T });
    if (S.obra === 'atual') { A.estrutura(ctx, JAR, GX, GY, k < 1 ? 'escavando' : 'vazia', z, { T, tags, seed: 7 }); return; }
    const porta = S.obra !== 'B', xf = g.x0 + (g.x1 - g.x0) * k;
    if (k < 1) {
      ctx.save(); A.domePath(ctx, g); ctx.clip();
      if (porta) {
        ctx.fillStyle = C.base; ctx.beginPath(); ctx.moveTo(g.x0 - 0.2, g.yt - 0.2);
        for (let y = g.yt - 0.2; y <= g.yb + 0.2; y += 0.05) ctx.lineTo(xf + 0.05 * Math.sin(y * 19) + 0.03 * Math.sin(y * 7 + 1), y);
        ctx.lineTo(g.x0 - 0.2, g.yb + 0.2); ctx.closePath(); ctx.fill();
      } else { ctx.globalAlpha = 0.25 + 0.75 * suave(k); ctx.fillStyle = C.base; ctx.fillRect(g.x0 - 1, g.yt - 1, 9, 4); ctx.globalAlpha = 1; }
      ctx.restore();
      A.domePath(ctx, g); ctx.setLineDash([5 * px, 8 * px]); ctx.strokeStyle = C.txt2; ctx.lineWidth = Math.max(1.2 * px, 0.025); ctx.stroke(); ctx.setLineDash([]);
      if (S.obra !== 'A') { const Pm = perimetro(g); A.domePath(ctx, g); ctx.setLineDash([Pm * k, Pm * 2]); ctx.strokeStyle = C.txt; ctx.lineWidth = Math.max(2 * px, 0.035); ctx.stroke(); ctx.setLineDash([]); }
      const Y = g.floor - 0.08;
      if (porta) {
        [0, 1].forEach(i => A.ant(ctx, 'cavadora', Math.max(g.x0 + 0.2, xf - 0.14 - i * 0.05), i ? g.yw + 0.05 : Y, 0, z, { nod: Math.sin(T * 9 + i * 2) }));
        if (S.escava === 'A' || S.escava === 'B') { farelos(ctx, xf, Y - 0.05, 0, T, z, TERRA, 4); farelos(ctx, xf, g.yw + 0.02, 0, T + 0.3, z, TERRA, 3); }
        if (S.escava === 'C') poeira(ctx, xf, Y, T);
        if (S.escava === 'B') { const r = vaiVem(t, tt => Math.max(0.1, (g.x1 - g.x0) * clamp(tt / 7.5) - 0.45), 1.8, 0.9); if (r) { ctx.save(); ctx.globalAlpha = clamp((t - 1.8) / 0.3) * clamp((7.5 - t) / 0.4); A.ant(ctx, 'operaria', g.x0 + 0.15 + r.s, Y + 0.02, r.volta ? PI : 0, z, r.volta ? { carry: 'argila' } : {}); ctx.restore(); } }
      } else [0, 1].forEach(i => { const x = g.x0 + 0.5 + (g.x1 - g.x0 - 1) * (0.5 + 0.5 * Math.sin(T * 0.5 + i * 2.5)); A.ant(ctx, 'cavadora', x, Y, Math.cos(T * 0.5 + i * 2.5) > 0 ? 0 : PI, z, { nod: Math.sin(T * 9 + i) }); });
      if (LOD(z) === 'perto' || LOD(z) === 'medio') tags.push({ txt: Math.ceil(24 * (1 - k)) + ' pt', x: g.cx, y: g.yt + 0.32 });
    } else {
      // a câmara cavada fica por baixo e o jardim aparece por cima dela (sem piscar o solo);
      // no fim do loop tudo volta ao solo devagar, para emendar com o contorno tracejado do começo
      const sai = clamp((10 - t) / 0.6);
      if (sai < 1) { A.domePath(ctx, g); ctx.setLineDash([5 * px, 8 * px]); ctx.strokeStyle = C.txt2; ctx.lineWidth = Math.max(1.2 * px, 0.025); ctx.stroke(); ctx.setLineDash([]); }
      ctx.save(); ctx.globalAlpha = sai; ctx.fillStyle = C.base; A.domePath(ctx, g); ctx.fill();
      ctx.globalAlpha = sai * clamp((t - 7.5) / 0.5); A.estrutura(ctx, JAR, GX, GY, 'vazia', z, { T, tags: sai > 0.5 ? tags : [], seed: 7 }); ctx.restore();
    }
  }

  // ---------------- 3. nascimento ----------------
  // berçário: duas larvas comendo e a da direita nascendo como soldado; 9 s em loop
  const BERC = ES('bercario'), BX = 0.6, BY = -0.35;
  function casulo(ctx, x, y, s, abre, T, z) {
    const rx = 0.21 * s, ry = 0.115 * s, cor = '#E9DCC3', px = 1 / z;
    [-1, 1].forEach(sd => {
      if (abre <= 0 && sd > 0) return;
      ctx.save(); ctx.globalAlpha *= 1 - abre * 0.9; ctx.translate(x + sd * abre * 0.12, y + abre * 0.03); ctx.rotate(sd * abre * 0.5);
      ctx.fillStyle = cor; ctx.beginPath();
      if (abre <= 0) ctx.ellipse(0, 0, rx, ry, Math.sin(T * 5) * 0.06, 0, TAU); else ctx.ellipse(sd * rx * 0.5, 0, rx * 0.5, ry, 0, sd > 0 ? -PI / 2 : PI / 2, sd > 0 ? PI / 2 : PI * 1.5);
      ctx.fill(); ctx.strokeStyle = mix(cor, C.base, 0.35); ctx.lineWidth = Math.max(px, 0.01);
      for (let i = -1; i <= 1; i++) { const xx = i * rx * 0.45; if (abre > 0 && Math.sign(xx || sd) !== sd) continue; ctx.beginPath(); ctx.moveTo(xx, -ry * 0.8); ctx.quadraticCurveTo(xx + 0.015, 0, xx, ry * 0.8); ctx.stroke(); }
      ctx.restore();
    });
  }
  function nascimento(ctx, z, T, tags, S) {
    const t = mod(T, 9), h = A.conteudoHook;
    A.conteudoHook = (c2, sp, g) => { conteudoBerc(c2, sp, g, z, T, t, tags, S); return true; };
    let g; try { A.tunel(ctx, A.curve({ x: -0.6, y: 0.95 }, { x: BX + 0.12, y: BY + 1.63 }, 0.05), 1, 'livre', z, { T }); g = A.estrutura(ctx, BERC, BX, BY, 'produzindo', z, { T, tags, seed: 3 }); } finally { A.conteudoHook = h; }
    // ícone da casta pulando acima do berçário (C)
    if (S.nasce === 'C' && t > 5.3 && t < 6.9) { const k = (t - 5.3) / 1.6, px = 1 / z, s = Math.max(0.3, 18 * px), y = g.yt - 10 * px - Math.sin(clamp(k / 0.5) * PI) * 0.18; ctx.save(); ctx.globalAlpha = k < 0.75 ? 1 : 1 - (k - 0.75) / 0.25; ctx.fillStyle = C.def; ctx.strokeStyle = C.def; ctx.lineWidth = Math.max(1.5 * px, 0.03); A.combatIcon(ctx, 'escudo', g.cx, y, s); ctx.restore(); }
  }
  function conteudoBerc(ctx, sp, g, z, T, t, tags, S) {
    const floor = g.floor, Y = floor - 0.07, lx = i => g.x0 + 0.45 + i * 0.55, x2 = lx(2), yL = floor - 0.12, px = 1 / z;
    A.pile(ctx, 'fungo', 2, g.x1 - 0.1, -1, floor, 2, z, tags);
    A.larva(ctx, lx(0), yL, 1, T, 0); A.larva(ctx, lx(1), yL, 1, T * 1.1, 1);
    A.ant(ctx, 'operaria', lx(0) + 0.3, Y - 0.22, 0.3, z, { nod: Math.sin(T * 7) * 0.6 });
    // larva da direita: cresce, nasce e sai
    let sai = null;
    if (S.nasce === 'atual') { if (t < 3.2) A.larva(ctx, x2, yL, 0.85 + 0.3 * t / 3.2, T, 2); else sai = 3.2; }
    else if (S.nasce === 'B') {
      if (t < 3.2) A.larva(ctx, x2, yL, 0.85 + 0.3 * t / 3.2, T, 2);
      else if (t < 3.5) A.larva(ctx, x2, yL + 0.02 * (t - 3.2) / 0.3, 1.15 * (1 - 0.35 * (t - 3.2) / 0.3), T * 3, 2);
      if (t >= 3.5 && t < 4.1) { const k = (t - 3.5) / 0.6; ctx.save(); ctx.globalAlpha = 1 - k; ctx.strokeStyle = C.def; ctx.lineWidth = Math.max(2 * px, 0.03) * (1 - k * 0.5); ctx.beginPath(); ctx.arc(x2, yL, 0.08 + k * 0.3, 0, TAU); ctx.stroke(); ctx.restore(); }
      if (t >= 3.5 && t < 4.4) { const k = clamp((t - 3.5) / 0.6); A.ant(ctx, 'soldado', x2, Y - Math.sin(k * PI) * 0.25, PI, z, { nod: 0, scale: 0.7 + 0.3 * k }); }
      if (t >= 4.4) sai = 4.4;
    } else {
      if (t < 3.2) A.larva(ctx, x2, yL, 0.85 + 0.3 * t / 3.2, T, 2);
      else if (t < 4.0) { const k = (t - 3.2) / 0.8; ctx.save(); ctx.globalAlpha = 1 - k; A.larva(ctx, x2, yL, 1.15, T, 2); ctx.restore(); ctx.save(); ctx.globalAlpha = k; casulo(ctx, x2, yL - 0.01, 1, 0, T, z); ctx.restore(); }
      else if (t < 5.2) casulo(ctx, x2, yL - 0.01, 1, 0, t > 4.7 ? T * 2.4 : T, z);
      else if (t < 5.7) { const k = (t - 5.2) / 0.5; casulo(ctx, x2, yL - 0.01, 1, suave(k), T, z); A.ant(ctx, 'soldado', x2, Y, PI + 0.3 * (1 - k), z, { nod: 0, scale: 0.6 + 0.4 * suave(k) }); }
      else if (t < 6.1) A.ant(ctx, 'soldado', x2, Y, PI + Math.sin((t - 5.7) * 20) * 0.08, z, { nod: Math.sin(T * 9) });
      if (t >= 6.1) sai = 6.1;
    }
    // anda até a porta e some no túnel
    if (sai != null && t >= sai) {
      const dx = x2 - (g.door.x + 0.05), dur = dx / 0.9, kS = (t - sai) / dur;
      if (kS < 1.15) { const x = x2 - dx * Math.min(1, kS), y = Y - (kS > 0.75 ? (Y - g.door.y - 0.04) * clamp((kS - 0.75) / 0.25) : 0); ctx.save(); ctx.globalAlpha = kS > 1 ? 1 - (kS - 1) / 0.15 : 1; A.ant(ctx, 'soldado', x, y, PI, z, {}); ctx.restore(); }
    }
    // próxima larva chega no fim
    if (t > 8.2) { ctx.save(); ctx.globalAlpha = clamp((t - 8.2) / 0.6); A.larva(ctx, x2, yL, 0.85, T, 2); ctx.restore(); }
    const kb = clamp(t / (S.nasce === 'atual' ? 3.2 : S.nasce === 'B' ? 3.5 : 5.2));
    const x0 = g.x0 + 0.12, x1 = g.x1 - 0.12, y = g.yb - 0.02; ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(x0, y - 0.025, x1 - x0, 0.045);
    ctx.fillStyle = C.veg; ctx.fillRect(x0, y - 0.025, (x1 - x0) * (t < 8.2 ? kb : 0), 0.045);
  }

  // ---------------- 4. onda lateral chegando ----------------
  // a boca rival fica à direita, fora da tela; o túnel rival cava em linha reta até a parede do jardim (cerca de 0,45 cél/s)
  const JAR2 = Object.assign({}, ES('jardim'), { porta: 'L' }), OX = -0.2, OY = 0;
  function onda(ctx, z, T, tags, S) {
    const t = mod(T, 10), px = 1 / z, g = A.geom(JAR2, OX, OY, 5), yT = g.floor - 0.2, x0 = 6.4, xAlvo = g.x1 + 0.04, k = clamp(t / 8), xf = x0 + (xAlvo - x0) * k;
    A.tunel(ctx, A.curve({ x: -1.2, y: 0.2 }, { x: g.door.x + 0.02, y: g.door.y }, 0.05), 1, 'livre', z, { T });
    A.estrutura(ctx, JAR2, OX, OY, t > 8.3 ? 'ataque' : 'produzindo', z, { T, tags, seed: 5 });
    // rachaduras à frente (B): presas no mundo, não andam com a ponta; pulsam devagar (0,8 Hz)
    if (S.onda === 'B') {
      ctx.save(); ctx.strokeStyle = RACHA; ctx.lineCap = 'round'; ctx.lineWidth = Math.max(1.1 * px, 0.012);
      for (let x = xAlvo + 0.1; x < x0; x += 0.17) {
        const d = xf - x; if (d <= 0.05 || d > 1.6) continue; const i = Math.round(x * 6), y = yT + (((i * 37) % 7) - 3) * 0.012;
        ctx.globalAlpha = clamp((1.6 - d) / 0.6) * (0.75 + 0.25 * Math.sin(T * 2 * PI * 0.8));
        ctx.beginPath(); ctx.moveTo(x - 0.09, y + 0.02); ctx.lineTo(x - 0.03, y - 0.03); ctx.lineTo(x + 0.03, y + 0.015); ctx.lineTo(x + 0.09, y - 0.02);
        if (i % 2) { ctx.moveTo(x, y - 0.005); ctx.lineTo(x + 0.03, y - 0.07); } else { ctx.moveTo(x - 0.03, y - 0.03); ctx.lineTo(x - 0.05, y + 0.05); }
        ctx.stroke();
      }
      ctx.restore();
    }
    if (S.onda === 'C' && k < 1) {
      ctx.save(); ctx.setLineDash([4 * px, 5 * px]); ctx.lineDashOffset = T * 6 * px; ctx.strokeStyle = C.perigo; ctx.globalAlpha = 0.8; ctx.lineWidth = Math.max(1.4 * px, 0.02);
      ctx.beginPath(); ctx.moveTo(xf - 0.12, yT); ctx.lineTo(xAlvo, yT); ctx.stroke(); ctx.setLineDash([]);
      const pu = 0.5 + 0.5 * Math.sin(T * 2 * PI * 0.8); ctx.globalAlpha = 0.5 + 0.4 * pu; ctx.lineWidth = Math.max(1.6 * px, 0.025); ctx.beginPath(); ctx.arc(xAlvo, yT, 0.1 + 0.03 * pu, 0, TAU); ctx.stroke(); ctx.restore();
    }
    A.tunel(ctx, reto({ x: xf, y: yT }, { x: x0 + 0.5, y: yT }), 1, 'rival', z, { T });
    if (k < 1 && S.onda === 'A') pontaIrregular(ctx, xf, yT, PI, A.LARG[1]);
    // rivais: a da frente cava, as outras seguem
    [0, 0.38, 0.8].forEach((d, i) => {
      const x = (k < 1 ? xf + 0.13 : xAlvo + 0.18) + d; if (x > x0 + 0.25) return;
      A.ant(ctx, 'rival', x + (k >= 1 ? Math.sin(T * 9 + i) * 0.01 : 0), yT + (i % 2 ? 0.025 : -0.02), PI, z, { nod: i === 0 && k < 1 ? Math.sin(T * 9) : 0 });
    });
    if (k < 1 && S.onda === 'A') farelos(ctx, xf, yT, PI, T, z, TERRA, 6);
  }

  // ---------------- 5. expedição saindo ----------------
  // posto de guarda com porta à direita; três soldados saem em coluna para a boca rival, à direita fora da tela
  const POSTO = Object.assign({}, ES('posto'), { porta: 'R' }), PX = 0.1, PY = 0;
  function rota(pts) { const cum = [0]; for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y)); return { pts, cum, len: cum[cum.length - 1] }; }
  function naRota(r, d) {
    d = clamp(d, 0, r.len); let i = 1; while (i < r.cum.length - 1 && r.cum[i] < d) i++;
    const a = r.pts[i - 1], b = r.pts[i], k = (d - r.cum[i - 1]) / ((r.cum[i] - r.cum[i - 1]) || 1); return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k, ang: Math.atan2(b.y - a.y, b.x - a.x) };
  }
  function expedicao(ctx, z, T, tags, S) {
    const t = mod(T, 10), px = 1 / z, g = A.geom(POSTO, PX, PY, 2), NO = { x: g.x1 + 1.65, y: g.floor - A.LARG[1] / 2 + 0.005 }, M = A.curve(NO, { x: 6.7, y: 0.55 }, 0.04), saiu = t > 1.0;
    A.tunel(ctx, M, 2, 'livre', z, { T });
    // sem o gancho das câmaras animadas: os soldados ficam parados nas vagas e quem sai é desenhado aqui
    const h0 = A.conteudoHook; A.conteudoHook = null; let r0;
    try { r0 = A.ligacao(ctx, POSTO, PX, PY, NO, 1, z, { T, tags, seed: 2, est: saiu ? 'falta_cuid' : 'pronta' }); } finally { A.conteudoHook = h0; }
    A.no(ctx, NO.x, NO.y, 2, z);
    const p = r0.p, Y = g.floor - 0.08, N = 3, vaga = i => g.x0 + 0.3 + (3 - i) * 0.35; // vagas 3, 2 e 1; a 0 fica de guarda
    // volta das vagas no fim do loop, para emendar com o começo
    if (t > 9.3) { ctx.save(); ctx.globalAlpha = clamp((t - 9.3) / 0.7); for (let i = 0; i < N; i++) A.ant(ctx, 'soldado', vaga(i), Y, PI, z, {}); ctx.restore(); }
    if (!saiu) return;
    const pts = [{ x: vaga(N - 1), y: Y }, { x: p.pts[p.pts.length - 1].x - 0.12, y: Y }];
    for (let s = p.len; s >= 0; s -= 0.05) pts.push(A.at(p, s));
    for (let s = 0.05; s <= M.len; s += 0.05) pts.push(A.at(M, s));
    const R = rota(pts), espaco = S.expedicao === 'A' ? 0.4 : 0.55, VEL = 0.85, base = i => vaga(i) - vaga(N - 1);
    const s0 = base(0) + (t - 1.0) * VEL;
    const pos = i => { const d = Math.max(base(i), s0 - i * espaco); return Object.assign(naRota(R, d), { d }); };
    const lider = pos(0), ultimo = pos(N - 1);
    // rastro de feromônio (B): pontilhado violeta por onde a coluna passou, some em 5 s
    if (S.expedicao === 'B') {
      ctx.save(); ctx.fillStyle = C.atk;
      for (let d = base(0); d < lider.d - 0.1; d += 0.14) { const idade = t - (1.0 + (d - base(0)) / VEL), al = 0.85 * clamp(1 - idade / 5); if (al <= 0) continue; const q = naRota(R, d); ctx.globalAlpha = al; ctx.beginPath(); ctx.arc(q.x, q.y + 0.005, Math.max(0.018, 1.5 * px), 0, TAU); ctx.fill(); }
      ctx.restore();
    }
    // halo do grupo (C)
    if (S.expedicao === 'C' && ultimo.d < R.len - 0.05) {
      ctx.save(); ctx.strokeStyle = C.atk; ctx.globalAlpha = 0.28; ctx.lineCap = 'round'; ctx.lineWidth = 0.34; ctx.beginPath();
      const d0 = ultimo.d, d1 = Math.min(lider.d, R.len - 0.05); for (let d = d0; d <= d1 + 0.001; d += 0.05) { const q = naRota(R, d); if (d === d0) ctx.moveTo(q.x, q.y); else ctx.lineTo(q.x, q.y); }
      ctx.stroke(); ctx.restore();
    }
    for (let i = 0; i < N; i++) { const q = pos(i); if (q.d > R.len - 0.05) continue; A.ant(ctx, 'soldado', q.x, q.y, q.ang, z, {}); }
    // bandeirinha violeta no mastro, presa no dorso da primeira da coluna (A); tremula devagar
    if (S.expedicao === 'A' && lider.d < R.len - 0.05) {
      const h = Math.max(0.3, 18 * px), fw = h * 0.62, bx = lider.x - Math.cos(lider.ang) * 0.06, by = lider.y - 0.03, top = by - h, ond = Math.sin(T * 5) * fw * 0.12;
      ctx.save(); ctx.strokeStyle = C.txt2; ctx.lineWidth = Math.max(1.2 * px, 0.018); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx, top); ctx.stroke();
      ctx.fillStyle = C.atk; ctx.beginPath(); ctx.moveTo(bx, top); ctx.quadraticCurveTo(bx - fw * 0.5, top + h * 0.08 + ond, bx - fw, top + h * 0.2); ctx.quadraticCurveTo(bx - fw * 0.5, top + h * 0.32 - ond, bx, top + h * 0.42); ctx.closePath(); ctx.fill(); ctx.restore();
    }
    if (S.expedicao === 'C' && lider.d < R.len - 0.05 && LOD(z) !== 'geral') tags.push({ txt: String(N), x: (lider.x + ultimo.x) / 2, y: Math.min(lider.y, ultimo.y) - 0.3 });
  }

  window.Cand = { OPCOES, escavacao, obra, nascimento, onda, expedicao };
})();
