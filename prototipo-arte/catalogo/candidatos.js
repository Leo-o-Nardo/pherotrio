// Pherotrio · candidatos da rodada 11 (D119 fechada): formigas e aranha de perfil.
// O formigueiro é um corte de lado. Quem anda num chão (a superfície, o piso das câmaras) pode aparecer de perfil, "de pé",
// em vez de vista de cima (D109, D113). Aqui o perfil liga por lugar: superfície, câmaras e túneis.
// Também há dois estilos de corpo, dois jeitos de andar e duas aranhas. Nada disso está no arte.js até a escolha.
(() => {
  const A = window.Arte, C = A.C, { mix, LOD } = A, PI = Math.PI, TAU = PI * 2;
  if (A.perfil) A.perfil.ligado = false; // página histórica: o perfil do arte.js (D120) fica desligado para as opções compararem
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v)), suave = k => k * k * (3 - 2 * k), mod = (t, p) => ((t % p) + p) % p, lerp = (a, b, k) => a + (b - a) * k;

  const OPCOES = {
    onde: {
      atual: { nome: 'Atual', desc: 'Todas vistas de cima, em todo lugar (D109).' },
      A: { nome: 'A · Só na superfície', desc: 'De perfil só em cima da terra: andando no chão, subindo na planta, voando. Ao entrar no cortadouro, volta a ser vista de cima.' },
      B: { nome: 'B · Superfície e câmaras', desc: 'A A, e também dentro das câmaras: no piso, na parede da cúpula e no teto. No túnel continua vista de cima; a troca é na porta.' },
      C: { nome: 'C · Em todo lugar', desc: 'De perfil também nos túneis, com o corpo seguindo a curva do túnel. Nenhuma troca de desenho.' },
    },
    estilo: {
      A: { nome: 'A · Lisa', desc: 'Silhueta de cor única, como as formigas de hoje vistas de cima.' },
      B: { nome: 'B · Com volume', desc: 'A mesma silhueta com a parte de baixo mais escura, um brilho em cima e o olho.' },
      C: { nome: 'C · Com volume, sem olho', desc: 'A B sem o olho: a cabeça fica lisa, só com a sombra e o brilho.' },
      D: { nome: 'D · Com volume, olho discreto', desc: 'A B com o olho menor e quase da cor do corpo: aparece de perto e some de longe.' },
    },
    andar: {
      A: { nome: 'A · Só as pernas', desc: 'As seis pernas andam em tripé (D113), erguendo o pé no passo. O corpo e as antenas ficam parados.' },
      B: { nome: 'B · Pernas, corpo e antenas', desc: 'A A, mais o corpo subindo e descendo de leve a cada passo e as antenas tateando à frente.' },
    },
    aranha: {
      A: { nome: 'A · Pernas altas', desc: 'Os joelhos ficam bem acima do corpo, como as aranhas caçadoras. O abdômen vai erguido.' },
      B: { nome: 'B · Baixa e larga', desc: 'O corpo vai perto do chão, com as pernas mais abertas para os lados. Mais pesada, menos ágil.' },
    },
  };

  // ---------------- configuração ativa: a página troca antes de cada desenho ----------------
  let CFG = null, lugar = null, ultimo = false;
  const LUGARES = { atual: [], A: ['sup'], B: ['sup', 'cam'], C: ['sup', 'cam', 'tun'] };
  function comLugar(f, fn) { const p = lugar; lugar = f(p); try { return fn(); } finally { lugar = p; } }

  // ---------------- corpos de perfil (unidade = ANT_UNIT; frente em +x, cima em -y; eixo do corpo em y = 0, pés em y = H) ----------------
  // gas, pec, tor, pro, cab: [x, y, rx, ry, giro]. hips: ponto da perna no tórax; pes: x do pé parado; L: [coxa, canela]
  const BASE = {
    H: 3.6, gas: [-4.4, 0.1, 3.3, 2.3, -0.15], pec: [-0.6, -0.45, 0.7, 0.9, 0], tor: [1.6, -0.35, 2.0, 1.15, -0.2], pro: [2.5, -0.75, 1.05, 0.9, 0], cab: [4.7, -0.9, 1.75, 1.45, 0.35],
    hips: [[2.6, 0.3], [1.6, 0.5], [0.7, 0.45]], pes: [5.0, 1.9, -2.6], L: [[2.5, 3.0], [2.3, 2.8], [2.8, 3.3]], mand: 'normal',
  };
  const VAR = {
    operaria: {},
    cortadeira: { cab: [5.0, -1.0, 2.1, 1.8, 0.35], mand: 'grande', espinhos: true, pes: [5.4, 2.0, -2.6] },
    cavadora: { cab: [5.0, -0.8, 2.0, 1.7, 0], caixa: true, pes: [5.6, 2.0, -2.6] },
    soldado: { cab: [5.8, -1.2, 2.9, 2.4, 0.3], gas: [-4.2, 0.1, 3.0, 2.2, -0.15], mand: 'grande', pes: [5.8, 2.0, -2.5], kL: 1.05 },
    tanque: { tor: [1.3, -0.6, 2.5, 1.8, -0.15], gas: [-4.8, 0.0, 3.8, 2.9, -0.1], cab: [4.6, -0.8, 1.9, 1.7, 0.2], escudo: true, pes: [5.2, 1.6, -3.0], kL: 1.1 },
    atiradora: { gota: true, pes: [5.0, 1.9, -2.4] },
    curandeira: { anel: true },
    explosiva: { gas: [-5.3, -0.5, 4.6, 4.0, 0], bomba: true, pes: [5.0, 1.9, -2.2] },
    saqueadora: { gas: [-5.8, 0.0, 4.6, 1.7, -0.08], tor: [1.9, -0.2, 2.6, 0.9, -0.1], pro: [2.9, -0.5, 1.1, 0.7, 0], cab: [6.1, -0.6, 2.0, 1.3, 0.25], pec: [-0.7, -0.3, 0.7, 0.7, 0], mand: 'longa', hips: [[2.9, 0.3], [1.9, 0.4], [0.9, 0.4]], pes: [5.8, 2.1, -3.0], kL: 1.1 },
    alada: { tor: [1.6, -0.45, 2.4, 1.5, -0.2], asas: true },
    rainha: { H: 4.6, gas: [-7.4, -0.5, 7.2, 4.3, -0.06], pec: [-0.2, -0.5, 0.9, 1.0, 0], tor: [1.6, -0.45, 2.4, 1.7, -0.2], pro: [2.6, -0.95, 1.2, 1.0, 0], cab: [5.1, -0.9, 2.1, 1.8, 0.35], hips: [[2.7, 0.5], [1.7, 0.8], [0.7, 0.8]], pes: [5.6, 2.0, -2.4], listras: true, toco: true, kL: 1.2 },
    rival: { gas: [-3.6, 0.0, 2.2, 2.0, 0], pec: null, tor: [0.1, -0.3, 1.9, 1.5, 0], pro: null, cab: [3.5, -0.7, 1.9, 1.8, 0.3], hips: [[1.0, 0.6], [0.1, 0.8], [-0.8, 0.7]], pes: [3.6, 0.4, -3.4] },
    soldadoRival: { gas: [-4.2, 0.0, 3.0, 2.3, -0.1], tor: [0.9, -0.3, 1.6, 1.2, -0.15], pro: null, cab: [4.7, -1.0, 2.9, 2.7, 0.3], faixa: true, mand: 'grande', hips: [[1.6, 0.4], [0.8, 0.6], [0.0, 0.6]], pes: [4.4, 1.0, -3.2] },
  };
  const corpos = {};
  const corpoDe = c => corpos[c] || (corpos[c] = Object.assign({}, BASE, VAR[c] || {}));
  const ARANHA = {
    A: { H: 2.8, cef: [1.8, -0.9, 1.9, 1.4, 0.08], abd: [-2.5, -1.5, 2.9, 2.4, 0.35], hips: [[2.7, 0.1], [2.2, 0.25], [1.6, 0.25], [1.0, 0.1]], pes: [7.5, 4.8, -1.8, -5.0], L: [[3.4, 6.0], [3.0, 5.0], [3.0, 5.0], [3.4, 6.0]], lw: 0.5 },
    B: { H: 1.8, cef: [1.8, -0.4, 2.0, 1.1, 0.04], abd: [-2.6, -0.5, 3.2, 1.8, 0.1], hips: [[2.7, 0.15], [2.2, 0.3], [1.6, 0.3], [1.0, 0.15]], pes: [8.6, 5.6, -2.6, -6.6], L: [[3.2, 4.4], [2.8, 3.8], [2.8, 3.8], [3.2, 4.4]], lw: 0.6 },
  };

  // perna de dois segmentos: o joelho fica sempre do lado de cima
  function ik(hx, hy, fx, fy, L1, L2) {
    let d = Math.hypot(fx - hx, fy - hy) || 1e-6; const ux = (fx - hx) / d, uy = (fy - hy) / d;
    if (d > L1 + L2 - 0.02) { d = L1 + L2 - 0.02; fx = hx + ux * d; fy = hy + uy * d; }
    d = Math.max(d, Math.abs(L1 - L2) + 0.02);
    const a = (L1 * L1 - L2 * L2 + d * d) / (2 * d), h = Math.sqrt(Math.max(0, L1 * L1 - a * a)), px = hx + ux * a, py = hy + uy * a;
    const k1 = { x: px - uy * h, y: py + ux * h }, k2 = { x: px + uy * h, y: py - ux * h }, k = k1.y < k2.y ? k1 : k2;
    return { kx: k.x, ky: k.y, fx, fy };
  }

  // pinta uma forma fechada no estilo ativo (lisa ou com volume)
  function pinta(S, cam, cx, cy, rx, ry) {
    const ctx = S.ctx; cam();
    if (S.dashed) { ctx.setLineDash([1.2, 1.2]); ctx.strokeStyle = C.txt2; ctx.lineWidth = 0.7; ctx.stroke(); ctx.setLineDash([]); return; }
    ctx.fillStyle = S.col; ctx.fill();
    if (!S.vol) return;
    ctx.save(); cam(); ctx.clip();
    ctx.fillStyle = 'rgba(0,0,0,0.22)'; ctx.beginPath(); ctx.ellipse(cx, cy + ry * 1.05, rx * 1.4, ry * 0.85, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = 'rgba(255,250,240,0.17)'; ctx.beginPath(); ctx.ellipse(cx - rx * 0.12, cy - ry * 0.58, rx * 0.55, ry * 0.2, 0, 0, TAU); ctx.fill();
    ctx.restore();
  }
  const E = (S, p) => { if (!p) return; const [x, y, rx, ry, r] = p; pinta(S, () => { S.ctx.beginPath(); S.ctx.ellipse(x, y, rx, ry, r || 0, 0, TAU); }, x, y, rx, ry); };

  function pernas(S, perto) {
    const ctx = S.ctx, B = S.B, kL = B.kL || 1;
    ctx.strokeStyle = perto ? S.corPerna : S.corPernaLonge; ctx.lineWidth = S.lw; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath();
    B.hips.forEach(([hx, hy], i) => {
      const grupo = (i % 2 === 0) === perto, p = S.fase + (grupo ? 0 : PI), dx = perto ? 0 : 0.45, dy = perto ? 0 : -0.25;
      const sw = S.anda ? Math.sin(p) * 0.8 : 0, ergue = S.anda ? Math.max(0, Math.cos(p)) * 0.7 : 0;
      let fx = B.pes[i] + dx + sw, fy = B.H - ergue;
      if (S.voa) { fx = hx + dx + [0.9, -0.3, -1.4][i] + Math.sin(S.fase * 0.4 + i) * 0.2; fy = hy + 2.6; }
      const k = ik(hx + dx, hy + dy, fx, fy, B.L[i][0] * kL, B.L[i][1] * kL);
      ctx.moveTo(hx + dx, hy + dy); ctx.lineTo(k.kx, k.ky); ctx.lineTo(k.fx, k.fy);
    });
    ctx.stroke();
  }
  function antenas(S) {
    const ctx = S.ctx, [hx, hy, rx, ry] = S.B.cab, bx = hx + rx * 0.3, by = hy - ry * 0.75, w = S.tateia ? Math.sin(S.t3) * 0.16 : 0;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = Math.max(S.lw * 0.85, 0.34);
    [[false, 0.35], [true, 0]].forEach(([perto, off]) => {
      const cor = perto ? S.corAnt : S.corAntLonge, a1 = -1.2 + w + (perto ? 0 : -0.14), ex = bx + off + Math.cos(a1) * 2.0, ey = by + Math.sin(a1) * 2.0;
      const a2 = -0.3 + w * 1.6 + (perto ? 0 : 0.12) + (S.tateia ? Math.sin(S.t3 * 1.3 + (perto ? 0 : 1)) * 0.12 : 0), px = ex + Math.cos(a2) * 2.6, py = ey + Math.sin(a2) * 2.6;
      ctx.strokeStyle = cor; ctx.beginPath(); ctx.moveTo(bx + off, by); ctx.lineTo(ex, ey); ctx.lineTo(px, py); ctx.stroke();
      ctx.fillStyle = cor; ctx.beginPath(); ctx.arc(px, py, Math.max(ctx.lineWidth * 0.85, 0.32), 0, TAU); ctx.fill();
    });
  }
  function mandibula(S, tipo) {
    if (S.dashed) return; const ctx = S.ctx, [hx, hy, rx, ry] = S.B.cab, mx = hx + rx * 0.78, my = hy + ry * 0.45;
    const len = tipo === 'grande' ? 2.4 : tipo === 'longa' ? 2.8 : 1.3, gr = tipo === 'grande' ? 0.9 : 0.45;
    ctx.fillStyle = mix(S.col, C.base, 0.18); ctx.beginPath(); ctx.moveTo(mx - 0.5, my - gr); ctx.quadraticCurveTo(mx + len * 0.8, my - gr * 0.6, mx + len, my + 0.55); ctx.quadraticCurveTo(mx + len * 0.4, my + 0.15, mx - 0.4, my + gr * 0.5); ctx.closePath(); ctx.fill();
  }
  function asa(S, perto, bate) {
    const ctx = S.ctx, [tx, ty, , tr] = S.B.tor, r = lerp(0.12, 1.25, 1 - bate) + (perto ? 0 : 0.22);
    ctx.save(); ctx.translate(tx + 0.2, ty - tr * 0.85); ctx.rotate(r); ctx.globalAlpha *= perto ? 0.42 : 0.28; ctx.fillStyle = C.txt;
    ctx.beginPath(); ctx.ellipse(-4.2, -0.15, 4.7, 1.3, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = C.txt; ctx.lineWidth = 0.3; ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(-3, -0.9, -8.2, -0.5); ctx.stroke(); ctx.restore();
  }

  function corpoFormiga(S, casta, o) {
    const ctx = S.ctx, B = S.B, vol = S.vol && !S.dashed;
    if (B.asas && !S.dashed) asa(S, false, o.bate == null ? 1 : o.bate);
    // abdômen
    if (B.gota) { const cam = () => { ctx.beginPath(); ctx.moveTo(-11.2, -1.8); ctx.quadraticCurveTo(-8.4, -3.4, -4.6, -2.5); ctx.ellipse(-4.4, 0, 2.9, 2.5, 0, -PI / 2, PI / 2); ctx.quadraticCurveTo(-8.0, 2.4, -11.2, -1.8); ctx.closePath(); }; pinta(S, cam, -6, 0, 5, 2.5); if (!S.dashed) { ctx.fillStyle = C.acu; ctx.beginPath(); ctx.arc(-11.8, -2.1, 0.75, 0, TAU); ctx.fill(); } }
    else if (B.anel) { const [x, y, rx, ry, r] = B.gas; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, r, 0, TAU); ctx.strokeStyle = S.dashed ? C.txt2 : S.col; ctx.lineWidth = 1.4; if (S.dashed) ctx.setLineDash([1.2, 1.2]); ctx.stroke(); ctx.setLineDash([]); if (!S.dashed) { ctx.fillStyle = S.col; ctx.fillRect(x - 0.45, y - 1.3, 0.9, 2.6); ctx.fillRect(x - 1.3, y - 0.45, 2.6, 0.9); } }
    else E(S, B.gas);
    if (B.bomba && !S.dashed) { const [x, y, rx, ry] = B.gas; ctx.beginPath(); ctx.ellipse(x, y, rx + 1.0, ry + 1.0, 0, 0, TAU); ctx.setLineDash([1.1, 1.1]); ctx.strokeStyle = S.col; ctx.lineWidth = 0.55; ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = 'rgba(0,0,0,0.28)'; [[-6.6, -1.6], [-4.3, 1.0], [-5.8, 1.9]].forEach(([a, b]) => { ctx.beginPath(); ctx.arc(a, b, 0.6, 0, TAU); ctx.fill(); }); }
    if (B.listras && !S.dashed) { ctx.strokeStyle = 'rgba(0,0,0,0.2)'; ctx.lineWidth = 0.45; ctx.beginPath(); [-10.5, -8.0, -5.5].forEach(a => { ctx.moveTo(a, -4.0); ctx.quadraticCurveTo(a - 0.9, 0, a, 3.6); }); ctx.stroke(); }
    if (B.toco && !S.dashed) { ctx.save(); ctx.globalAlpha *= 0.3; ctx.fillStyle = C.txt; ctx.beginPath(); ctx.ellipse(0.0, -2.4, 2.6, 0.9, 0.3, 0, TAU); ctx.fill(); ctx.restore(); }
    E(S, B.pec); E(S, B.tor); E(S, B.pro);
    if (B.espinhos && !S.dashed) { ctx.fillStyle = S.col; [[0.9, -1.2, 0.5, -2.5], [2.3, -1.5, 2.1, -2.7]].forEach(([a, b, c, d]) => { ctx.beginPath(); ctx.moveTo(a - 0.45, b + 0.3); ctx.lineTo(c, d); ctx.lineTo(a + 0.45, b + 0.3); ctx.closePath(); ctx.fill(); }); }
    // cabeça (balança com o "nod")
    ctx.save();
    if ('nod' in o && o.nod) { const [hx, hy, rx] = B.cab, nx = hx - rx * 0.8; ctx.translate(nx, hy); ctx.rotate(o.nod * 0.2); ctx.translate(-nx, -hy); }
    if (B.caixa) { const cam = () => { ctx.beginPath(); ctx.roundRect(3.0, -2.6, 3.9, 3.4, 0.9); }; pinta(S, cam, 5, -0.9, 2, 1.7); const cam2 = () => { ctx.beginPath(); ctx.roundRect(7.1, -2.4, 0.9, 3.3, 0.4); }; pinta(S, cam2, 7.5, -0.8, 0.5, 1.6); }
    else E(S, B.cab);
    if (vol && S.olho) { const [hx, hy, rx, ry] = B.cab, forte = S.olho === 'forte'; ctx.fillStyle = forte ? 'rgba(0,0,0,0.42)' : 'rgba(0,0,0,0.2)'; ctx.beginPath(); ctx.arc(hx + rx * 0.28, hy - ry * 0.12, Math.min(forte ? 0.45 : 0.3, ry * (forte ? 0.3 : 0.2)), 0, TAU); ctx.fill(); }
    if (!B.caixa) mandibula(S, B.mand);
    if (B.faixa && !S.dashed) { const [hx, hy, rx, ry] = B.cab; ctx.save(); ctx.beginPath(); ctx.ellipse(hx, hy, rx, ry, B.cab[4], 0, TAU); ctx.clip(); ctx.fillStyle = '#A92A35'; ctx.fillRect(hx - 1.6, hy - 3, 1.4, 6); ctx.restore(); }
    if (B.escudo) { const cam = () => { ctx.beginPath(); ctx.arc(4.6, -0.9, 2.9, -PI / 2, PI / 2); ctx.closePath(); }; pinta(S, cam, 5.6, -0.9, 1.5, 2.9); if (!S.dashed) { ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.lineWidth = 0.45; ctx.beginPath(); ctx.arc(4.6, -0.9, 2.2, -PI / 2 + 0.2, PI / 2 - 0.2); ctx.stroke(); } }
    if (S.lod === 'perto' && !S.dashed) antenas(S);
    ctx.restore();
  }

  function corpoAranha(S, o) {
    const ctx = S.ctx, B = S.B, pernaA = (perto) => {
      const desenha = () => { ctx.beginPath(); B.hips.forEach(([hx, hy], i) => {
        const grupo = (i % 2 === 0) === perto, p = S.fase + (grupo ? 0 : PI), dx = perto ? 0 : 0.6, dy = perto ? 0 : -0.3;
        const sw = S.anda ? Math.sin(p) * 1.0 : 0, ergue = S.anda ? Math.max(0, Math.cos(p)) * 0.9 : 0;
        const k = ik(hx + dx, hy + dy, B.pes[i] + dx + sw, B.H - ergue, B.L[i][0], B.L[i][1]);
        ctx.moveTo(hx + dx, hy + dy); ctx.lineTo(k.kx, k.ky); ctx.lineTo(k.fx, k.fy);
      }); ctx.stroke(); };
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      if (S.lod === 'perto') { ctx.strokeStyle = '#120D0A'; ctx.lineWidth = B.lw + 0.35; desenha(); }
      ctx.strokeStyle = perto ? S.col : mix(S.col, '#120D0A', 0.45); ctx.lineWidth = Math.max(B.lw, S.lw); desenha();
    };
    pernaA(false);
    E(S, B.abd); E(S, B.cef);
    const [cx, cy, rx, ry] = B.cef;
    if (!S.dashed) {
      // quelíceras: abrem quando ela morde
      const abre = 'nod' in o ? 0.35 + 0.35 * Math.max(0, Math.sin((A.TEMPO || 0) * 14)) : 0.1;
      ctx.fillStyle = mix(S.col, '#120D0A', 0.3); ctx.save(); ctx.translate(cx + rx * 0.85, cy + ry * 0.45); ctx.rotate(abre); ctx.beginPath(); ctx.moveTo(-0.4, -0.5); ctx.quadraticCurveTo(1.1, -0.2, 0.6, 1.5); ctx.quadraticCurveTo(0.2, 0.6, -0.5, 0.4); ctx.closePath(); ctx.fill(); ctx.restore();
      if (S.lod === 'perto') { ctx.strokeStyle = S.col; ctx.lineWidth = 0.55; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(cx + rx * 0.7, cy + ry * 0.2); ctx.lineTo(cx + rx * 0.7 + 1.3, cy + ry * 0.2 + 0.6); ctx.lineTo(cx + rx * 0.7 + 1.7, cy + ry * 0.2 + 1.6); ctx.stroke(); }
      if (S.vol) { ctx.fillStyle = 'rgba(255,236,214,0.55)'; [[0.55, -0.55], [0.25, -0.75]].forEach(([a, b]) => { ctx.beginPath(); ctx.arc(cx + rx * a, cy + ry * b, 0.28, 0, TAU); ctx.fill(); }); }
    }
    pernaA(true);
  }

  // desenha a formiga (ou a aranha) de perfil. L: { pe (distância até o chão, mundo), n (normal do chão), modo, voa }
  function perfil(ctx, casta, x, y, ang, z, o, L) {
    const lod = LOD(z), inimigo = !!A.INIMIGOS[casta], spec = A.CASTAS[casta] || A.INIMIGOS[casta] || A.CASTAS.operaria, aranha = casta === 'aranha';
    const sc = A.ANT_UNIT * spec.esc * (o.scale || 1), B = aranha ? ARANHA[CFG.aranha || 'A'] : corpoDe(casta);
    const cg = inimigo ? null : (A.corCasta ? A.corCasta(casta) : A.COR_GRUPO[A.GRUPO[casta]]);
    const col = o.col || (inimigo ? C.perigo : cg ? mix(C.txt, cg, A.TINTA) : C.txt);
    const ca = Math.cos(ang), sa = Math.sin(ang);
    let rot = ang, fx = 1, fy = 1;
    if (L.voa) { const fc = ca >= 0 ? 1 : -1, t = fc > 0 ? ang : ang - PI; rot = clamp(Math.atan2(Math.sin(t), Math.cos(t)), -0.6, 0.6); fx = fc; }
    else if (L.modo === 'chao') { rot = L.tilt || 0; fx = (ca >= 0 ? 1 : -1) * Math.max(0.12, Math.abs(ca)); }
    else { const n = L.n || { x: 0, y: 1 }, lx = -sa, ly = ca, d = lx * n.x + ly * n.y; if (Math.abs(d) > 0.3) fy = Math.sign(d); else { const n2 = Math.abs(n.y) > 0.5 ? { x: 1, y: 0 } : { x: 0, y: 1 }; fy = Math.sign(lx * n2.x + ly * n2.y) || 1; } }
    const zs = z * sc, anda = !('nod' in o) && !o.dashed && !L.voa && lod === 'perto', fase = (A.TEMPO || 0) * (aranha ? 11 : 13) + x * 9 + y * 5;
    const S = {
      ctx, B, col, lod, vol: CFG.estilo !== 'A', olho: CFG.estilo === 'B' ? 'forte' : CFG.estilo === 'D' ? 'discreto' : null, dashed: o.dashed, anda, voa: L.voa, fase, t3: (A.TEMPO || 0) * 3 + x * 4, tateia: CFG.andar === 'B',
      lw: Math.max(1 / zs, 0.42), corPerna: mix(col, C.base, 0.3), corPernaLonge: mix(col, C.base, 0.6), corAnt: mix(col, C.base, 0.4), corAntLonge: mix(col, C.base, 0.62),
    };
    const pe = L.voa ? null : (L.pe == null ? 0.075 : L.pe), bob = anda && CFG.andar === 'B' ? 0.16 * Math.cos(2 * fase) : 0;
    const inv = ctx.getTransform().inverse();
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sc * fx, sc * fy);
    ctx.translate(0, (pe == null ? 0 : pe / sc - B.H)); // pés no chão
    if (bob) { ctx.translate(0, -Math.abs(bob)); ctx.rotate(0.025 * Math.sin(fase)); }
    const naoPernas = lod !== 'perto' && lod !== 'medio';
    if (aranha) corpoAranha(S, o);
    else {
      if (!o.dashed && !naoPernas) pernas(S, false);
      corpoFormiga(S, casta, o);
      if (!o.dashed && !naoPernas) pernas(S, true);
      if (B.asas && !o.dashed) asa(S, true, o.bate == null ? 1 : o.bate);
    }
    const m1 = ctx.getTransform(), W = (lx, ly) => inv.transformPoint(m1.transformPoint(new DOMPoint(lx, ly)));
    ctx.restore();
    if (!aranha) {
      const [hx, hy, rx, ry] = B.cab;
      if (o.carry) { const p = W(hx + rx * 0.9 + 0.06 / sc, hy - 0.4); A.item(ctx, o.carry, p.x, p.y, 0.15); }
      // a vela sai da boca para o lado das costas, um pouco inclinada para trás (no caule, fica de lado)
      if (o.vela) { const b = W(hx + rx * 0.55, hy - ry * 0.55), f0 = W(0, 0), up = W(-0.3, -1); vela(ctx, b.x, b.y, 0.1, o.vela.rot + Math.atan2(up.x - f0.x, -(up.y - f0.y)), o.vela.cor); }
    }
    if (o.combatIcon && spec.combate && lod === 'perto') A.combatIcon(ctx, spec.combate, x, y - 0.3 * spec.esc, 8 / z);
  }

  // ---------------- onde a formiga está: classificadores por lugar ----------------
  // superfície: acima da linha do chão. No chão os pés tocam a terra; na planta (subindo) os pés ficam no caule
  const lugarSup = prev => (x, y, ang, casta, o) => {
    const d = A.gnd(x) - y; if (d < -0.02) return prev ? prev(x, y, ang, casta, o) : null;
    if (casta === 'alada' && o.bate != null && d > 0.16) return { tipo: 'sup', voa: true };
    const deitada = Math.abs(Math.cos(ang)) > 0.3;
    return { tipo: 'sup', n: { x: 0, y: 1 }, pe: d < 0.25 && deitada ? Math.max(0, d) : 0 };
  };
  // câmara: dentro da cúpula. No piso, de pé (e vira no lugar encolhendo); na parede e no teto, os pés vão para a terra
  const lugarCam = (g, prev) => {
    const rx = (g.x1 - g.x0) / 2, ry = g.yw - g.yt;
    return (x, y, ang, casta, o) => {
      const ux = (x - g.cx) / rx, uy = (y - g.yw) / ry, dentro = x > g.x0 - 0.03 && x < g.x1 + 0.03 && y < g.yb + 0.03 && (y > g.yw || ux * ux + uy * uy < 1.2);
      if (!dentro) return prev ? prev(x, y, ang, casta, o) : null;
      const dChao = g.floor - y; let dP, n;
      if (y > g.yw) { const dl = x - g.x0, dr = g.x1 - x; dP = Math.min(dl, dr); n = { x: dl < dr ? -1 : 1, y: 0 }; }
      else { const r = Math.hypot(ux, uy) || 1e-6, nx = ux / rx, ny = uy / ry, nl = Math.hypot(nx, ny) || 1; dP = Math.max(0, (1 - r) * Math.min(rx, ry)); n = { x: nx / nl, y: ny / nl }; }
      if (dChao < 0.4 && dChao > -0.05 && dP > 0.2) return { tipo: 'cam', modo: 'chao', pe: Math.max(0, dChao) };
      const deitada = Math.abs(Math.cos(ang)) > 0.35;
      if (deitada && dChao < 0.4) return { tipo: 'cam', n: { x: 0, y: 1 }, pe: Math.max(0, dChao) };
      return { tipo: 'cam', n, pe: clamp(dP, 0, 0.25) };
    };
  };
  const TUN = { tipo: 'tun', n: { x: 0, y: 1 }, pe: 0.075 };
  const antHook0 = A.antHook;
  A.antHook = (ctx, casta, x, y, ang, z, o) => {
    ultimo = false;
    if (CFG && casta !== 'lacraia' && (LOD(z) === 'perto' || LOD(z) === 'medio')) {
      const L = (lugar && lugar(x, y, ang, casta, o)) || TUN;
      if (LUGARES[CFG.onde].includes(L.tipo)) { perfil(ctx, casta, x, y, ang, z, o, L); ultimo = true; return true; }
    }
    return antHook0 ? antHook0(ctx, casta, x, y, ang, z, o) : false;
  };
  const est0 = A.estrutura;
  A.estrutura = function (ctx, sp, x, y, st, z, o = {}) {
    if (!CFG) return est0.apply(this, arguments);
    const g = A.geom(sp, x, y, o.seed), args = arguments; return comLugar(prev => lugarCam(g, prev), () => est0.apply(this, args));
  };
  const naSup = fn => (ctx, z, T, tags) => comLugar(prev => lugarSup(prev), () => fn(ctx, z, T, tags));

  // ---------------- cenas da superfície (cópia da D118, com a vela presa na boca quando é de perfil) ----------------
  const gnd = x => A.gnd(x);
  function rota(pts) { const cum = [0]; for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y)); return { pts, cum, len: cum[cum.length - 1] }; }
  function naRota(r, d) {
    d = clamp(d, 0, r.len); let i = 1; while (i < r.cum.length - 1 && r.cum[i] < d) i++;
    const a = r.pts[i - 1], b = r.pts[i], k = (d - r.cum[i - 1]) / ((r.cum[i] - r.cum[i - 1]) || 1); return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k, ang: Math.atan2(b.y - a.y, b.x - a.x) };
  }
  function cortadouro(ctx, xb, z, T) {
    const tun = A.curve({ x: xb, y: gnd(xb) + 0.05 }, { x: xb + 0.9, y: 0.75 }, 0.1);
    A.tunel(ctx, tun, 1, 'livre', z, { T }); ctx.save(); ctx.translate(0, gnd(xb)); A.cortadouroBoca(ctx, xb, z); ctx.restore(); return tun;
  }
  const SURGE = 0.45, alfaTunel = d => clamp((d - 0.1) / (SURGE - 0.1));
  function saida(tun, xb, xFim, dy) {
    const pts = []; for (let s = SURGE; s > 0; s -= 0.05) pts.push(A.at(tun, s));
    const sg = Math.sign(xFim - xb) || 1; for (let x = xb + sg * 0.12; sg > 0 ? x <= xFim : x >= xFim; x += sg * 0.08) pts.push({ x, y: gnd(x) - dy });
    return rota(pts);
  }
  function vela(ctx, x, y, s, rot, cor) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.fillStyle = cor; ctx.beginPath(); ctx.moveTo(-s, 0); ctx.quadraticCurveTo(-s * 0.9, -s * 1.5, s * 0.2, -s * 1.25); ctx.quadraticCurveTo(s * 1.1, -s * 0.9, s, 0); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = mix(cor, '#14200F', 0.4); ctx.lineWidth = s * 0.12; ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(-s * 0.1, -s * 0.6, s * 0.1, -s * 1.15); ctx.stroke(); ctx.restore();
  }
  function folhaGeo(xp, h, T, i) {
    const gy = gnd(xp), sway = Math.sin(T * 1.1 + xp) * 0.03, sd = i % 2 ? -1 : 1, L = h * (0.55 + i * 0.18), ex = sd * (0.25 + i * 0.1) + sway * 4, ey = -L;
    const rb = -sd * 0.35 + Math.sin(T * 1.3 + i) * 0.05, lw = 0.54, lh = lw * 0.48;
    const loc = (lx, ly) => ({ x: xp + ex + lx * Math.cos(rb) - ly * Math.sin(rb), y: gy + ey + lx * Math.sin(rb) + ly * Math.cos(rb) });
    const caule = []; for (let j = 0; j <= 12; j++) { const t = j / 12, u = 1 - t; caule.push({ x: xp + t * t * ex, y: gy + 2 * u * t * ey * 0.7 + t * t * ey }); }
    return { gy, sd, caule, corte: loc(sd * lw * 0.6, -lh * 0.7), meio: loc(sd * lw * 0.42, -lh * 0.25) };
  }
  function mordida(ctx, p, r, est) {
    if (r <= 0.004) return; const ceu = A.ESTACOES[est].ceu, g = ctx.createLinearGradient(0, -3, 0, 0);
    g.addColorStop(0, mix(ceu, '#000000', 0.15)); g.addColorStop(1, mix(ceu, '#B8A48C', 0.16));
    ctx.save(); ctx.fillStyle = g; ctx.beginPath(); [-1, 0, 1].forEach(j => ctx.arc(p.x + j * r * 0.55, p.y - Math.abs(j) * r * 0.1, r * (j ? 0.62 : 0.8), 0, TAU)); ctx.fill(); ctx.restore();
  }
  const XB1 = 0.8, XP1 = 3.0, HP1 = 1.6;
  function corte(ctx, z, T) {
    const est = 'primavera', cf = mix(C.veg, '#B8F0A0', 0.15);
    A.superficie(ctx, est, -1, 7, z, T, [{ tipo: 'folhaLarga', x: XP1, h: HP1 }, { tipo: 'capim', x: 4.6, h: 0.9 }], [XB1]);
    const tun = cortadouro(ctx, XB1, z, T), chao = saida(tun, XB1, XP1 - 0.07, 0.08);
    for (let j = 0; j < 3; j++) { const tau = mod(T + j * 4, 12); mordida(ctx, folhaGeo(XP1, HP1, T, j).corte, 0.085 * (tau < 5.3 ? 0 : tau < 6.0 ? (tau - 5.3) / 0.7 : 1 - clamp((tau - 8) / 3.5)), est); }
    for (let j = 0; j < 3; j++) {
      const tau = mod(T + j * 4, 12), F = folhaGeo(XP1, HP1, T, j);
      const pts = chao.pts.slice(); F.caule.forEach(p => pts.push({ x: p.x + 0.02 * F.sd, y: p.y })); pts.push(F.meio);
      const R = rota(pts), cortando = tau >= 5 && tau < 6.2, volta = tau >= 6.2;
      const d = tau < 5 ? R.len * suave(tau / 5) : cortando ? R.len : R.len * (1 - suave(clamp((tau - 6.2) / 5)));
      if (tau >= 11.2 || d < 0.1) continue;
      const q = naRota(R, d), ang = volta ? q.ang + PI : q.ang;
      ctx.save(); ctx.globalAlpha = alfaTunel(d);
      if (cortando) A.ant(ctx, 'cortadeira', q.x, q.y, Math.atan2(F.corte.y - q.y, F.corte.x - q.x), z, { nod: Math.sin(T * 12) });
      else if (volta) {
        const rv = Math.sin(T * 5 + j) * 0.12;
        A.ant(ctx, 'cortadeira', q.x, q.y, ang, z, { vela: { cor: cf, rot: rv } });
        if (!ultimo) vela(ctx, q.x + Math.cos(ang) * 0.17, q.y + Math.sin(ang) * 0.17, 0.1, rv + (Math.abs(Math.cos(ang)) < 0.5 ? 0.25 * Math.sign(Math.sin(ang)) : 0), cf);
      } else A.ant(ctx, 'cortadeira', q.x, q.y, ang, z, {});
      ctx.restore();
    }
  }

  // aranha andando pela superfície: entra, para e morde (pernas quietas), segue. 8 s
  function aranhaAnda(ctx, z, T) {
    const t = mod(T, 8);
    A.superficie(ctx, 'verao', -0.5, 5, z, T, [{ tipo: 'capim', x: 0.3, h: 0.8 }, { tipo: 'dente', x: 3.6, h: 0.8 }], []);
    const x = t < 3 ? 4.4 - t * 0.75 : t < 4.2 ? 2.15 : 2.15 - (t - 4.2) * 0.75, a = clamp(t / 0.3) * clamp((8 - t) / 0.4);
    ctx.save(); ctx.globalAlpha = a; A.ant(ctx, 'aranha', x, gnd(x) - 0.13, PI, z, t >= 3 && t < 4.2 ? { nod: 0 } : {}); ctx.restore();
  }

  // ---------------- cenas de dentro ----------------
  const ES = id => A.ESTRUTURAS.find(e => e.id === id);
  const camara = (id, st, seed) => (ctx, z, T, tags) => A.estrutura(ctx, ES(id), 0, 0, st, z, { T, seed: seed || 7, tags, stub: true });
  // fila de castas andando num piso de câmara (um andar por linha)
  function piso(ctx, x0, w, y) { ctx.fillStyle = C.base; ctx.fillRect(x0, y - 0.48, w, 0.48); ctx.fillStyle = mix(C.base, '#000000', 0.25); ctx.fillRect(x0, y, w, 0.035); }
  const fila = (linhas, W) => (ctx, z, T) => {
    comLugar(() => (x, y) => { const fl = Math.max(0, Math.round((y + 0.2) / 0.62)) * 0.62; return { tipo: 'cam', modo: 'chao', pe: Math.max(0, fl - y) }; }, () => {
      linhas.forEach((lst, i) => {
        const fl = i * 0.62; piso(ctx, 0, W, fl);
        lst.forEach((c, k) => {
          const x = mod(T * 0.32 + k * W / lst.length, W), al = clamp(x / 0.25) * clamp((W - x) / 0.25), dy = c === 'rainha' ? 0.16 : c === 'aranha' ? 0.13 : 0.075;
          ctx.save(); ctx.globalAlpha = al; A.ant(ctx, c, x, fl - dy, 0, z, {}); ctx.restore();
        });
      });
    });
  };
  // de perto: duas andando e uma trabalhando (pernas paradas, cabeça balançando)
  function deperto(ctx, z, T) {
    comLugar(() => (x, y) => ({ tipo: 'cam', modo: 'chao', pe: Math.max(0, -y) }), () => {
      piso(ctx, -0.1, 2.9, 0);
      const W = 2.7, x1 = mod(T * 0.3, W), x2 = mod(T * 0.3 + 1.35, W);
      [['operaria', x1], ['cortadeira', x2]].forEach(([c, x]) => { ctx.save(); ctx.globalAlpha = clamp(x / 0.25) * clamp((W - x) / 0.25); A.ant(ctx, c, x, -0.075, 0, z, {}); ctx.restore(); });
      A.ant(ctx, 'cavadora', 2.0, -0.075, PI, z, { nod: Math.sin(T * 9) });
    });
  }

  // cada cena liga a configuração escolhida só enquanto desenha. "forca": nas perguntas 2 a 4 o perfil fica sempre ligado
  const cena = (fn, forca) => (ctx, z, T, tags, S) => {
    CFG = Object.assign({}, S); if (forca && (S.onde === 'atual' || S.onde === 'A')) CFG.onde = 'B';
    try { fn(ctx, z, T, tags); } finally { CFG = null; }
  };

  window.Cand = {
    OPCOES, cena,
    corte: naSup(corte), ataque: naSup((ctx, z, T, tags) => A.eventos.ataqueCima(ctx, z, T, tags)), voo: naSup((ctx, z, T, tags) => A.eventos.voo(ctx, z, T, tags)),
    escavacao: (ctx, z, T, tags) => A.eventos.escavacao(ctx, z, T, tags),
    jardim: camara('jardim', 'produzindo'), real: camara('real', 'produzindo'), deposito: camara('deposito', 'produzindo'), posto: camara('posto', 'pronta'), combate: camara('posto', 'combate'),
    castas: fila([['operaria', 'cortadeira', 'cavadora', 'soldado'], ['tanque', 'atiradora', 'curandeira', 'explosiva'], ['saqueadora', 'alada', 'rainha']], 3.9),
    inimigos: fila([['rival', 'soldadoRival', 'aranha']], 3.9),
    deperto, aranhaAnda: naSup(aranhaAnda),
  };
})();
