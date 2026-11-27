// Pherotrio · biblioteca de desenho compartilhada (D108).
// O catálogo visual e o app de exemplo desenham tudo por aqui, para que o app mostre exatamente o que foi aprovado.
// Unidades: o mundo é medido em células. Quem chama define a escala (dp por célula) com ctx.setTransform.
(function () {
  const C = {
    solo: '#15110E', escavado: '#30261F', base: '#30261F', painel: '#211B17', borda: '#5A4B3F', ceu: '#1C2530',
    txt: '#EFE7DC', txt2: '#B3A697', veg: '#7FD16B', acu: '#F5B841', ani: '#F06E9A', min: '#BFA88A', ref: '#857A6E',
    perigo: '#FF4F5E', def: '#6FB3E8', atk: '#9A6BFF', quase: '#E3C45C', cheio: '#E0605A', agua: '#41604F',
    soloTopo: '#2C231B', soloMeio: '#1E1813', soloFundo: '#120E0B',
  };
  const INTEN = 0.4;
  const LOD = z => z >= 36 ? 'perto' : z >= 18 ? 'medio' : z >= 12 ? 'longe' : 'geral';
  function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const hex = c => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16));
  const toHex = rgb => rgb[0] === '#' ? rgb : '#' + rgb.match(/\d+/g).map(v => (+v).toString(16).padStart(2, '0')).join('');
  function mix(a, b, k) { const A = hex(toHex(a)), B = hex(toHex(b)); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * k).toString(16).padStart(2, '0')).join(''); }
  const pulse = (T, hz, amp) => amp * (0.45 + 0.55 * (0.5 + 0.5 * Math.sin(T * 6.2832 * hz)));

  // ---------------- recursos (07 §11, D48) ----------------
  const RES = {
    folha: { nome: 'Folha', f: 'losango', c: [C.veg], n: 'natural' },
    seiva: { nome: 'Seiva', f: 'gota', c: [C.acu], n: 'natural' },
    presa: { nome: 'Presa', f: 'tri', c: [C.ani], n: 'natural' },
    argila: { nome: 'Argila', f: 'quad', c: [C.min], n: 'natural' },
    fungo: { nome: 'Fungo', f: 'circ', c: [C.veg], n: 'N1' },
    nectar: { nome: 'Néctar', f: 'hex', c: [C.acu], n: 'N1' },
    proteina: { nome: 'Proteína', f: 'caps', c: [C.ani], n: 'N1' },
    quitina: { nome: 'Quitina', f: 'pent', c: [C.ani], n: 'N1' },
    barro: { nome: 'Barro', f: 'ret', c: [C.min], n: 'N1' },
    pasta: { nome: 'Pasta nutritiva', f: 'amendoim', c: [C.veg, C.ani], n: 'N2' },
    acido: { nome: 'Ácido', f: 'triInv', c: [C.acu, C.ani], n: 'N2' },
    carapaca: { nome: 'Carapaça', f: 'trap', c: [C.ani, C.min], n: 'N2' },
    geleia: { nome: 'Geleia real', f: 'estrela4', c: [C.veg, C.acu], n: 'N2' },
    cola: { nome: 'Cola', f: 'anel', c: [C.acu, C.min], n: 'N2' },
    gosma: { nome: 'Gosma tóxica', f: 'estrela8', c: [C.acu, C.ani], n: 'N3' },
    feromonio: { nome: 'Feromônio de guerra', f: 'estrela5', c: [C.veg, C.acu], n: 'N3' },
    refugo: { nome: 'Refugo', f: 'cruz', c: [C.ref], n: 'subproduto' },
    ovo: { nome: 'Ovo', f: 'ovo', c: [C.txt], n: 'colônia' },
  };
  function star(ctx, x, y, n, ro, ri, rot) { for (let i = 0; i < n * 2; i++) { const r = i % 2 ? ri : ro, a = rot + i / (n * 2) * 6.2832; i ? ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r) : ctx.moveTo(x + Math.cos(a) * r, y + Math.sin(a) * r); } ctx.closePath(); }
  function shapePath(ctx, f, x, y, s) {
    const r = s / 2; ctx.beginPath();
    const poly = (n, rot) => { for (let i = 0; i < n; i++) { const a = rot + i / n * 6.2832; i ? ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r) : ctx.moveTo(x + Math.cos(a) * r, y + Math.sin(a) * r); } ctx.closePath(); };
    switch (f) {
      case 'losango': ctx.moveTo(x, y - r); ctx.lineTo(x + r * 0.72, y); ctx.lineTo(x, y + r); ctx.lineTo(x - r * 0.72, y); ctx.closePath(); break;
      case 'gota': ctx.moveTo(x, y - r); ctx.bezierCurveTo(x + r * 0.35, y - r * 0.45, x + r * 0.8, y, x + r * 0.8, y + r * 0.28); ctx.arc(x, y + r * 0.28, r * 0.8, 0, Math.PI); ctx.bezierCurveTo(x - r * 0.8, y, x - r * 0.35, y - r * 0.45, x, y - r); ctx.closePath(); break;
      case 'tri': poly(3, -Math.PI / 2); break;
      case 'triInv': poly(3, Math.PI / 2); break;
      case 'quad': ctx.rect(x - r * 0.78, y - r * 0.78, r * 1.56, r * 1.56); break;
      case 'circ': ctx.arc(x, y, r * 0.86, 0, 6.2832); break;
      case 'hex': poly(6, 0); break;
      case 'pent': poly(5, -Math.PI / 2); break;
      case 'ret': ctx.rect(x - r, y - r * 0.5, r * 2, r); break;
      case 'caps': { const h = r * 0.52; ctx.moveTo(x - r + h, y - h); ctx.lineTo(x + r - h, y - h); ctx.arc(x + r - h, y, h, -Math.PI / 2, Math.PI / 2); ctx.lineTo(x - r + h, y + h); ctx.arc(x - r + h, y, h, Math.PI / 2, Math.PI * 1.5); ctx.closePath(); break; }
      case 'amendoim': ctx.arc(x - r * 0.42, y, r * 0.56, 0, 6.2832); ctx.moveTo(x + r * 0.98, y); ctx.arc(x + r * 0.42, y, r * 0.56, 0, 6.2832); break;
      case 'trap': ctx.moveTo(x - r * 0.55, y - r * 0.7); ctx.lineTo(x + r * 0.55, y - r * 0.7); ctx.lineTo(x + r, y + r * 0.7); ctx.lineTo(x - r, y + r * 0.7); ctx.closePath(); break;
      case 'estrela4': star(ctx, x, y, 4, r, r * 0.38, -Math.PI / 2); break;
      case 'estrela5': star(ctx, x, y, 5, r, r * 0.45, -Math.PI / 2); break;
      case 'estrela8': star(ctx, x, y, 8, r, r * 0.55, -Math.PI / 2); break;
      case 'anel': ctx.arc(x, y, r * 0.88, 0, 6.2832); ctx.moveTo(x + r * 0.5, y); ctx.arc(x, y, r * 0.5, 0, 6.2832, true); break;
      case 'cruz': { const w = r * 0.34; ctx.rect(x - r * 0.8, y - w, r * 1.6, w * 2); ctx.rect(x - w, y - r * 0.8, w * 2, r * 1.6); break; }
      case 'ovo': ctx.ellipse(x, y, r * 0.58, r * 0.78, 0, 0, 6.2832); break;
    }
  }
  // desenha um recurso: forma = identidade, cor = família; combinados em metades verticais; N3 com contorno duplo
  function item(ctx, kind, x, y, s, o = {}) {
    const d = RES[kind]; if (!d) return;
    const hook = window.Arte && window.Arte.itemHook; if (hook && !o.dot && hook(ctx, kind, x, y, s, o)) return;
    if (o.dot) { ctx.fillStyle = d.c[0]; ctx.beginPath(); ctx.arc(x, y, s / 2, 0, 6.2832); ctx.fill(); return; }
    const rule = d.f === 'anel' || d.f === 'amendoim' ? 'evenodd' : 'nonzero';
    shapePath(ctx, d.f, x, y, s);
    if (o.gray) { ctx.fillStyle = '#857A6E'; ctx.fill(rule); return; }
    if (d.c.length === 1) { ctx.fillStyle = d.c[0]; ctx.fill(rule); }
    else {
      ctx.save(); ctx.clip(rule); ctx.fillStyle = d.c[0]; ctx.fillRect(x - s, y - s, s, s * 2); ctx.fillStyle = d.c[1]; ctx.fillRect(x, y - s, s, s * 2);
      ctx.fillStyle = o.bg || C.base; ctx.fillRect(x - s * 0.025, y - s, s * 0.05, s * 2); ctx.restore();
    }
    if (d.n === 'N3') { ctx.save(); ctx.translate(x, y); ctx.scale(1.28, 1.28); ctx.translate(-x, -y); shapePath(ctx, d.f, x, y, s); ctx.restore(); ctx.strokeStyle = C.txt; ctx.lineWidth = s * 0.06; ctx.stroke(); }
  }

  // ---------------- formigas, castas e inimigos (D90, 03 §3.5 e §3.6) ----------------
  const CASTAS = {
    operaria: { nome: 'Operária', papel: 'Trabalho: carregar, escavar, cuidar', esc: 1 },
    cortadeira: { nome: 'Cortadeira', papel: 'Corta folha mais rápido', esc: 1.05 },
    cavadora: { nome: 'Cavadora', papel: 'Escava mais rápido', esc: 1.05 },
    soldado: { nome: 'Soldado', papel: 'Corpo a corpo', esc: 1.15, combate: 'escudo' },
    tanque: { nome: 'Tanque', papel: 'Corpo a corpo e bloqueio', esc: 1.35, combate: 'escudo' },
    atiradora: { nome: 'Atiradora', papel: 'Ataque a distância (ácido)', esc: 1.1, combate: 'alvo' },
    curandeira: { nome: 'Curandeira', papel: 'Suporte: cura em área', esc: 1.05, combate: 'cruz' },
    explosiva: { nome: 'Explosiva', papel: 'Sacrifício em área', esc: 1.1, combate: 'bomba' },
    saqueadora: { nome: 'Saqueadora', papel: 'Expedição e saque', esc: 1.1, combate: 'bandeira' },
    alada: { nome: 'Alada', papel: 'Reprodução: espera o voo nupcial', esc: 1.15 },
    rainha: { nome: 'Rainha', papel: 'Põe os ovos; não sai da câmara real', esc: 1.5 },
  };
  const INIMIGOS = {
    rival: { nome: 'Formiga rival', traco: 'Enxame: muitas e fracas', esc: 0.95 },
    soldadoRival: { nome: 'Soldado rival', traco: 'Blindado: resiste a corpo a corpo leve', esc: 1.2 },
    aranha: { nome: 'Aranha', traco: 'Rápida e caçadora', esc: 1.35 },
    lacraia: { nome: 'Lacraia (chefe)', traco: 'Muita vida; mira a câmara nupcial', esc: 1 },
  };
  const ANT_UNIT = 0.36 / 14 * 0.8; // corpo de cerca de 0,29 célula (D99)
  function ell(ctx, x, y, rx, ry) { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, 6.2832); }
  // casta: chave de CASTAS ou de INIMIGOS. o: { carry, nod, dashed, combatIcon, outline, bate (asas da alada: 0 abertas, 1 fechadas para trás) }
  function ant(ctx, casta, x, y, ang, z, o = {}) {
    const hk = window.Arte && window.Arte.antHook; if (hk && hk(ctx, casta, x, y, ang, z, o)) return;
    const lod = LOD(z), inimigo = !!INIMIGOS[casta], spec = CASTAS[casta] || INIMIGOS[casta] || CASTAS.operaria;
    const col = o.col || (inimigo ? C.perigo : C.txt), sc = ANT_UNIT * spec.esc * (o.scale || 1);
    if (lod === 'geral') return;
    if (lod === 'longe') { ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, Math.max(1.1 / z, 3.2 * sc), 0, 6.2832); ctx.fill(); return; }
    if (casta === 'lacraia') return lacraia(ctx, x, y, ang, z, o);
    ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(sc, sc);
    const outlineW = inimigo && o.outline ? o.outline / (z * sc) : 0; // sem contorno por padrão (D109)
    const paint = () => {
      if (o.dashed) { ctx.setLineDash([1.2, 1.2]); ctx.strokeStyle = C.txt2; ctx.lineWidth = 0.7; ctx.stroke(); ctx.setLineDash([]); return; }
      if (outlineW) { ctx.strokeStyle = '#120D0A'; ctx.lineWidth = outlineW * 2; ctx.stroke(); }
      ctx.fillStyle = col; ctx.fill();
    };
    let head = { x: 4.6, rx: 1.9, ry: 1.7 }, tho = { x: 1.6, rx: 1.9, ry: 1.3 }, abd = { x: -4.2, rx: 3.6, ry: 2.6 }, pet = -0.4;
    if (casta === 'cortadeira') head = { x: 4.9, rx: 2.3, ry: 2.0 };
    if (casta === 'soldado') head = { x: 5.4, rx: 2.9, ry: 2.6 };
    if (casta === 'tanque') tho = { x: 1.6, rx: 2.3, ry: 1.7 };
    if (casta === 'atiradora' || casta === 'explosiva') abd = { x: -4.8, rx: 4.3, ry: 3.1 };
    if (casta === 'saqueadora') { abd = { x: -5.4, rx: 4.4, ry: 1.9 }; tho = { x: 1.9, rx: 2.5, ry: 1.0 }; head = { x: 5.9, rx: 2.1, ry: 1.4 }; pet = -0.6; }
    if (casta === 'alada') tho = { x: 1.6, rx: 2.4, ry: 1.7 };
    if (casta === 'rainha') { abd = { x: -7.4, rx: 7.2, ry: 4.6 }; tho = { x: 1.6, rx: 2.4, ry: 1.8 }; head = { x: 5.1, rx: 2.1, ry: 1.9 }; pet = -0.1; }
    if (casta === 'rival') { abd = { x: -3.4, rx: 1.9, ry: 1.9 }; tho = { x: 0, rx: 1.9, ry: 1.9 }; head = { x: 3.4, rx: 1.9, ry: 1.9 }; pet = null; }
    if (casta === 'soldadoRival') { abd = { x: -4.2, rx: 3.0, ry: 2.3 }; tho = { x: 0.9, rx: 1.6, ry: 1.2 }; head = { x: 4.6, rx: 2.9, ry: 2.7 }; }
    // asas da alada (por baixo do corpo, 40% de opacidade)
    if (casta === 'alada' && !o.dashed) { ctx.globalAlpha = 0.4; ctx.fillStyle = C.txt; [-1, 1].forEach(sd => { ctx.beginPath(); ctx.ellipse(-1.6, sd * 3.6, 4.8, 1.7, sd * 0.28, 0, 6.2832); ctx.fill(); }); ctx.globalAlpha = 1; }
    // pernas da aranha
    if (casta === 'aranha') {
      ctx.strokeStyle = '#120D0A'; ctx.lineCap = 'round';
      // andando, as pernas mexem em dois grupos alternados (como o tripé das formigas, D113); parada ("nod"), ficam quietas
      const W = window.Arte, anda = !('nod' in o) && !o.dashed && LOD(z) === 'perto', fase = ((W && W.TEMPO) || 0) * 11 + x * 7 + y * 3;
      const legs = () => { ctx.beginPath(); for (let i = 0; i < 4; i++) { const bx = 1.8 - i * 1.2, a = 0.5 + i * 0.32; [-1, 1].forEach(sd => { const grupo = (i % 2 === 0) === (sd > 0), sw = anda ? Math.sin(fase + (grupo ? 0 : Math.PI)) : 0, ergue = anda ? Math.max(0, Math.cos(fase + (grupo ? 0 : Math.PI))) * 0.5 : 0; ctx.moveTo(bx, 0); ctx.quadraticCurveTo(bx + Math.cos(a) * 2.6 + sw * 0.7, sd * 3.4, bx + Math.cos(a + 0.6) * 1.6 - i * 0.7 + sw * 1.3, sd * (5.4 - ergue)); }); } ctx.stroke(); };
      ctx.lineWidth = 0.9 + outlineW * 2; legs(); ctx.strokeStyle = col; ctx.lineWidth = 0.9; legs();
      ell(ctx, -2.2, 0, 2.9, 2.5); paint(); ell(ctx, 1.9, 0, 1.9, 1.7); paint();
      ctx.restore(); return;
    }
    // abdômen
    if (casta === 'atiradora') { ctx.beginPath(); ctx.moveTo(-10.2, 0); ctx.quadraticCurveTo(-7.8, -3.4, -4.3, -3.0); ctx.ellipse(-4.3, 0, 3.4, 3.0, 0, -Math.PI / 2, Math.PI / 2); ctx.quadraticCurveTo(-7.8, 3.4, -10.2, 0); ctx.closePath(); paint(); }
    else if (casta === 'curandeira') { ell(ctx, abd.x, 0, abd.rx, abd.ry); ctx.strokeStyle = o.dashed ? C.txt2 : col; ctx.lineWidth = 1.3; if (o.dashed) ctx.setLineDash([1.2, 1.2]); ctx.stroke(); ctx.setLineDash([]); }
    else { ell(ctx, abd.x, 0, abd.rx, abd.ry); paint(); }
    if (casta === 'explosiva' && !o.dashed) { ell(ctx, abd.x, 0, abd.rx + 1.0, abd.ry + 1.0); ctx.setLineDash([1.1, 1.1]); ctx.strokeStyle = col; ctx.lineWidth = 0.55; ctx.stroke(); ctx.setLineDash([]); }
    if (pet !== null) { ctx.beginPath(); ctx.arc(pet, 0, 0.8, 0, 6.2832); paint(); }
    ell(ctx, tho.x, 0, tho.rx, tho.ry); paint();
    // cabeça
    if (casta === 'cavadora') { ctx.beginPath(); ctx.roundRect(2.9, -1.9, 4.0, 3.8, 0.9); paint(); }
    else if (casta === 'tanque') { ctx.beginPath(); ctx.arc(4.6, 0, 2.9, -Math.PI / 2, Math.PI / 2); ctx.closePath(); paint(); }
    else { ell(ctx, head.x, 0, head.rx, head.ry); paint(); }
    if (casta === 'soldadoRival' && !o.dashed) { ctx.fillStyle = '#A92A35'; ctx.fillRect(3.2, -1.7, 2.8, 3.4); }
    // mandíbulas da cortadeira
    const hx = casta === 'tanque' ? 7.5 : head.x + head.rx;
    if (casta === 'cortadeira' && !o.dashed) { ctx.strokeStyle = col; ctx.lineWidth = 0.75; ctx.lineCap = 'round'; ctx.beginPath(); [-1, 1].forEach(sd => { ctx.moveTo(hx - 0.4, sd * 1.0); ctx.quadraticCurveTo(hx + 1.6, sd * 1.3, hx + 1.4, sd * 0.1); }); ctx.stroke(); }
    // sem antenas (D109)

    ctx.restore();
    if (o.carry && lod !== 'longe') { const d = (hx + 0.3) * sc + 0.07; item(ctx, o.carry, x + Math.cos(ang) * d, y + Math.sin(ang) * d, 0.15); } // carrega pela boca (D109)
    if (o.combatIcon && spec.combate && lod === 'perto') combatIcon(ctx, spec.combate, x, y - 0.3 * spec.esc, 8 / z);
  }
  function lacraia(ctx, x, y, ang, z, o) {
    const T = o.T || 0, n = o.seg || 10, sp = 0.15, outline = (o.outline || 0) / z;
    const pts = []; for (let i = 0; i < n; i++) { const d = i * sp, w = Math.sin(T * 5 - i * 0.7) * 0.05; pts.push({ x: x - Math.cos(ang) * d - Math.sin(ang) * w, y: y - Math.sin(ang) * d + Math.cos(ang) * w }); }
    ctx.strokeStyle = '#120D0A'; ctx.lineWidth = 0.025; ctx.beginPath();
    pts.forEach((p, i) => { const a = ang + Math.PI / 2; ctx.moveTo(p.x + Math.cos(a) * 0.14, p.y + Math.sin(a) * 0.14); ctx.lineTo(p.x - Math.cos(a) * 0.14, p.y - Math.sin(a) * 0.14); }); ctx.stroke();
    ctx.strokeStyle = C.perigo; ctx.lineWidth = 0.018; ctx.stroke();
    for (let i = n - 1; i >= 0; i--) { const p = pts[i], r = i === 0 ? 0.085 : 0.075; ctx.beginPath(); ctx.arc(p.x, p.y, r + outline, 0, 6.2832); ctx.fillStyle = '#120D0A'; ctx.fill(); ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, 6.2832); ctx.fillStyle = i === 0 ? '#FF7A86' : C.perigo; ctx.fill(); }
  }
  function combatIcon(ctx, k, x, y, s) {
    ctx.save(); ctx.fillStyle = C.painel; ctx.beginPath(); ctx.arc(x, y, s * 0.75, 0, 6.2832); ctx.fill();
    ctx.strokeStyle = C.txt; ctx.fillStyle = C.txt; ctx.lineWidth = s * 0.14; ctx.beginPath();
    if (k === 'escudo') { ctx.moveTo(x - s * 0.35, y - s * 0.35); ctx.lineTo(x + s * 0.35, y - s * 0.35); ctx.lineTo(x + s * 0.3, y + s * 0.1); ctx.lineTo(x, y + s * 0.42); ctx.lineTo(x - s * 0.3, y + s * 0.1); ctx.closePath(); ctx.fill(); }
    if (k === 'alvo') { ctx.arc(x, y, s * 0.4, 0, 6.2832); ctx.stroke(); ctx.beginPath(); ctx.arc(x, y, s * 0.12, 0, 6.2832); ctx.fill(); }
    if (k === 'cruz') { ctx.fillRect(x - s * 0.1, y - s * 0.38, s * 0.2, s * 0.76); ctx.fillRect(x - s * 0.38, y - s * 0.1, s * 0.76, s * 0.2); }
    if (k === 'bomba') { ctx.arc(x, y + s * 0.08, s * 0.32, 0, 6.2832); ctx.fill(); ctx.beginPath(); ctx.moveTo(x + s * 0.15, y - s * 0.2); ctx.lineTo(x + s * 0.35, y - s * 0.42); ctx.stroke(); }
    if (k === 'bandeira') { ctx.moveTo(x - s * 0.25, y + s * 0.42); ctx.lineTo(x - s * 0.25, y - s * 0.42); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x - s * 0.25, y - s * 0.42); ctx.lineTo(x + s * 0.38, y - s * 0.22); ctx.lineTo(x - s * 0.25, y - s * 0.02); ctx.closePath(); ctx.fill(); }
    ctx.restore();
  }
  function larva(ctx, x, y, s, T, i) {
    const wig = Math.sin(T * 2 + i) * 0.03 * s;
    ctx.fillStyle = '#E8DDCB'; ell(ctx, x, y - wig, 0.23 * s, 0.13 * s); ctx.fill();
    ctx.strokeStyle = '#B9AC98'; ctx.lineWidth = 0.015 * s; for (let k = -1; k <= 1; k++) { ctx.beginPath(); ctx.moveTo(x + k * 0.09 * s, y - 0.12 * s - wig); ctx.lineTo(x + k * 0.09 * s, y + 0.11 * s - wig); ctx.stroke(); }
  }

  // ---------------- estruturas (D101 a D105, 07 §3, §5 e §6) ----------------
  const DIM = { P: [2, 1], M: [3, 1], G: [3, 2] };
  const S = (id, nome, grupo, tam, cat, extra) => Object.assign({ id, nome, grupo, tam, cat }, extra);
  const ESTRUTURAS = [
    S('cortadouro', 'Cortadouro', 'Extratoras', 'P', 'ext', { fam: [C.veg], out: 'folha', vagas: 4, superficie: true, uso: 'Corta folha da planta na superfície; cortadoras levam para dentro.' }),
    S('coletor', 'Coletor de seiva', 'Extratoras', 'P', 'ext', { fam: [C.acu], out: 'seiva', vagas: 3, fonte: true, uso: 'Extrai seiva de um bolsão de raízes; fica dentro do anel da fonte.' }),
    S('poco', 'Poço de argila', 'Extratoras', 'P', 'ext', { fam: [C.min], out: 'argila', vagas: 2, casta: 'cavadora', uso: 'Escavadoras geram argila continuamente.' }),
    S('jardim', 'Jardim de fungo', 'Produção N1', 'M', 'prod', { fam: [C.veg], ins: [['folha', 2]], out: 'fungo', vagas: 2, uso: '2 folha → 1 fungo + refugo. Coração da economia.' }),
    S('destilaria', 'Destilaria', 'Produção N1', 'M', 'prod', { fam: [C.acu], ins: [['seiva', 2]], out: 'nectar', vagas: 1, uso: '2 seiva → 1 néctar.' }),
    S('presas', 'Câmara de presas', 'Produção N1', 'M', 'prod', { fam: [C.ani], ins: [['presa', 1]], out: 'proteina', out2: 'quitina', vagas: 1, uso: '1 presa → 2 proteína + 1 quitina.' }),
    S('olaria', 'Olaria', 'Produção N1', 'M', 'prod', { fam: [C.min], ins: [['argila', 2]], out: 'barro', vagas: 1, uso: '2 argila → 1 barro.' }),
    S('cozinha', 'Cozinha', 'Produção N2', 'M', 'prod', { fam: [C.veg, C.ani], ins: [['fungo', 2], ['proteina', 1]], out: 'pasta', vagas: 2, uso: '2 fungo + 1 proteína → 1 pasta.' }),
    S('acida', 'Câmara ácida', 'Produção N2', 'M', 'prod', { fam: [C.acu, C.ani], ins: [['nectar', 1], ['proteina', 1]], out: 'acido', vagas: 2, uso: '1 néctar + 1 proteína → 1 ácido.' }),
    S('carapaca', 'Câmara de carapaça', 'Produção N2', 'M', 'prod', { fam: [C.ani, C.min], ins: [['quitina', 2], ['barro', 1]], out: 'carapaca', vagas: 2, uso: '2 quitina + 1 barro → 1 carapaça.' }),
    S('geleia', 'Câmara de geleia', 'Produção N2', 'M', 'prod', { fam: [C.veg, C.acu], ins: [['fungo', 2], ['nectar', 2]], out: 'geleia', vagas: 2, uso: '2 fungo + 2 néctar → 1 geleia real.' }),
    S('cola', 'Câmara de cola', 'Produção N2', 'M', 'prod', { fam: [C.acu, C.min], ins: [['nectar', 1], ['barro', 1]], out: 'cola', vagas: 1, uso: '1 néctar + 1 barro → 1 cola.' }),
    S('toxica', 'Câmara tóxica', 'Produção N3', 'M', 'prod', { fam: [C.acu, C.ani], ins: [['acido', 1], ['cola', 1]], out: 'gosma', vagas: 2, uso: '1 ácido + 1 cola → 1 gosma tóxica.' }),
    S('feromonio', 'Câmara de feromônio', 'Produção N3', 'M', 'prod', { fam: [C.veg, C.acu], ins: [['geleia', 1], ['acido', 1]], out: 'feromonio', vagas: 2, uso: '1 geleia + 1 ácido → 1 feromônio de guerra.' }),
    S('posto', 'Posto de guarda', 'Defesa e ataque', 'P', 'def', { fam: [C.def], vagas: 4, uso: 'Ponto de reunião: 4 vagas de combate; reage a até 2 células.' }),
    S('torre', 'Torre ácida', 'Defesa e ataque', 'P', 'def', { fam: [C.def], municao: 'acido', vagas: 1, uso: 'Dispara ácido a até 2 células; consome 1 ácido a cada 10 s.' }),
    S('armadilha', 'Armadilha de cola', 'Defesa e ataque', 'P', 'def', { fam: [C.def], municao: 'cola', uso: 'Inimigos ficam 50% lentos; consome 1 cola a cada 20 s.' }),
    S('mina', 'Mina de gosma', 'Defesa e ataque', 'P', 'def', { fam: [C.def], municao: 'gosma', uso: 'Uso único: 40 de dano em raio de 1,5 célula e gruda.' }),
    S('guerra', 'Posto de guerra', 'Defesa e ataque', 'P', 'atk', { fam: [C.atk], municao: 'feromonio', vagas: 3, uso: 'Expedições que partem dele causam +30% de dano.' }),
    S('real', 'Câmara real', 'Base', 'G', 'base', { fam: [], uso: 'A rainha põe 1 ovo a cada 15 s (1 fungo cada).' }),
    S('bercario', 'Berçário', 'Base', 'G', 'base', { fam: [], vagas: 2, uso: '3 larvas; a dieta escolhida define a casta.' }),
    S('nupcial', 'Câmara nupcial', 'Base', 'G', 'base', { fam: [], uso: '6 aladas esperando o voo nupcial.' }),
    S('deposito', 'Depósito', 'Base', 'G', 'base', { fam: [], porta: 'T', uso: 'Guarda 100 de qualquer recurso.' }),
    S('lixeira', 'Lixeira', 'Base', 'M', 'base', { fam: [], porta: 'T', uso: 'Guarda 200 de refugo.' }),
  ];
  const ESTADOS = {
    prod: ['produzindo', 'falta_ing', 'falta_cuid', 'saida_cheia', 'pausada', 'ataque', 'vazia', 'nivel2', 'planejada', 'escavando'],
    ext: ['produzindo', 'falta_cuid', 'saida_cheia', 'esgotada', 'ataque', 'nivel2', 'planejada', 'escavando'],
    def: ['pronta', 'falta_cuid', 'sem_municao', 'combate', 'ataque', 'nivel2', 'planejada', 'escavando'],
    base: ['produzindo', 'falta_ing', 'cheio', 'ataque', 'nivel2', 'planejada', 'escavando'],
  };
  const NOME_ESTADO = { produzindo: 'Produzindo', falta_ing: 'Falta ingrediente', falta_cuid: 'Falta cuidadora', saida_cheia: 'Saída cheia', pausada: 'Pausada', ataque: 'Sob ataque', vazia: 'Vazia', nivel2: 'Nível 2', planejada: 'Obra planejada', escavando: 'Escavando', esgotada: 'Fonte esgotada', pronta: 'Pronta', sem_municao: 'Sem munição', combate: 'Em combate', cheio: 'Cheio', usada: 'Usada' };
  function estadosDe(sp) {
    let l = ESTADOS[sp.cat === 'atk' ? 'def' : sp.cat].slice();
    if (sp.id === 'mina') l = l.map(s => s === 'sem_municao' ? 'usada' : s).filter(s => s !== 'falta_cuid');
    if (sp.id === 'armadilha') l = l.filter(s => s !== 'falta_cuid');
    if (sp.id === 'deposito' || sp.id === 'lixeira' || sp.id === 'nupcial') l = l.filter(s => s !== 'falta_ing');
    if (sp.id === 'real' || sp.id === 'bercario') l = l.filter(s => s !== 'cheio');
    if (sp.id !== 'coletor' && sp.id !== 'cortadouro') l = l.filter(s => s !== 'esgotada');
    return l;
  }
  // geometria da cúpula dentro do retângulo das células
  function geom(sp, x, y, seed) {
    const [w, h] = DIM[sp.tam], m = 0.05, g = { x, y, w, h };
    g.x0 = x + m; g.x1 = x + w - m; g.yb = y + h - m;
    const alt = sp.cat === 'def' || sp.cat === 'atk' || sp.cat === 'ext' ? 0.82 : h > 1 ? 0.8 : 1;
    g.yt = g.yb - (h - 2 * m) * alt;
    const wall = sp.cat === 'base' ? 0.42 : sp.cat === 'def' || sp.cat === 'atk' ? 0.22 : 0.32;
    g.yw = g.yb - (g.yb - g.yt) * wall;
    const r = rng(seed || 7), p1 = r() * 6.28, p2 = r() * 6.28, a1 = 0.05 + r() * 0.03, a2 = 0.02 + r() * 0.02;
    const cx = (g.x0 + g.x1) / 2, rx = (g.x1 - g.x0) / 2, ry = g.yw - g.yt;
    g.roof = []; for (let k = 0; k <= 40; k++) { const th = Math.PI + k / 40 * Math.PI, v = 1 + (a1 * Math.sin(3 * th + p1) + a2 * Math.sin(5 * th + p2)) * Math.sin(k / 40 * Math.PI); g.roof.push({ x: cx + rx * Math.cos(th), y: g.yw + ry * v * Math.sin(th) }); }
    const porta = sp.porta || 'L';
    g.porta = porta; g.door = porta === 'L' ? { x: g.x0 + 0.05, y: g.yb - 0.32 } : porta === 'R' ? { x: g.x1 - 0.05, y: g.yb - 0.32 } : { x: cx, y: g.yt + 0.05 };
    g.floor = g.yb - 0.035; g.cx = cx;
    return g;
  }
  // formaHook troca o contorno da câmara (rodada 15); sem ele, a cúpula da D101
  function domePath(ctx, g) { const H = window.Arte; if (H && H.formaHook) return H.formaHook(ctx, g); ctx.beginPath(); ctx.moveTo(g.x0, g.yb); ctx.lineTo(g.x0, g.yw); g.roof.forEach(q => ctx.lineTo(q.x, q.y)); ctx.lineTo(g.x1, g.yb); ctx.closePath(); }
  const ITEM = 0.27;
  function pile(ctx, kind, n, xs, dir, floor, cols, z, tags) {
    const cap = cols + (cols - 1), shown = Math.min(n, cap), g = 0.03, lod = LOD(z);
    if (n <= 0) return { x: xs, w: 0 };
    const w = cols * ITEM + (cols - 1) * g, x0 = dir > 0 ? xs : xs - w;
    if (lod === 'longe') { item(ctx, kind, x0 + w / 2, floor - ITEM / 2, Math.max(3 / z, ITEM * 0.8), { dot: true }); return { x: x0, w }; }
    let k = 0;
    for (let i = 0; i < Math.min(shown, cols); i++, k++) item(ctx, kind, x0 + ITEM / 2 + i * (ITEM + g), floor - ITEM / 2, ITEM);
    for (let i = 0; k < shown; i++, k++) item(ctx, kind, x0 + ITEM + g / 2 + i * (ITEM + g), floor - ITEM * 1.45, ITEM);
    if (n > cap && lod === 'perto' && tags) tags.push({ txt: '×' + n, x: x0 + w / 2, y: floor - ITEM * 2.2 });
    return { x: x0, w };
  }
  function progressLine(ctx, g, k, col) { const x0 = g.x0 + 0.12, x1 = g.x1 - 0.12, y = g.yb - 0.02; ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(x0, y - 0.025, x1 - x0, 0.045); ctx.fillStyle = window.Arte._brilho ? mix(col, '#FFFFFF', window.Arte._brilho) : col; ctx.fillRect(x0, y - 0.025, (x1 - x0) * Math.max(0, Math.min(1, k)), 0.045); }
  function alertOf(st) { return st === 'ataque' || st === 'combate' ? 'red' : ['falta_ing', 'falta_cuid', 'saida_cheia', 'cheio', 'sem_municao', 'esgotada'].includes(st) ? 'yellow' : null; }
  // desenha uma estrutura completa. o: { T, seed, stub (túnel na porta), tags (array para números) }
  function estrutura(ctx, sp, x, y, st, z, o = {}) {
    const T = o.T || 0, lod = LOD(z), px = 1 / z, g = geom(sp, x, y, o.seed), tags = o.tags || [];
    const extra = (lod === 'geral' ? 3.5 : lod === 'longe' ? 3 : 2.5) * px;
    if (st === 'planejada') {
      domePath(ctx, g); ctx.setLineDash([5 * px, 8 * px]); ctx.strokeStyle = C.txt2; ctx.lineWidth = Math.max(1.5 * px, 0.03); ctx.stroke(); ctx.setLineDash([]);
      if (lod === 'perto' || lod === 'medio') { const cost = sp.tam === 'G' ? 36 : sp.tam === 'M' ? 24 : sp.cat === 'ext' ? 15 : 12; tags.push({ txt: cost + ' pt', x: g.cx, y: (g.yt + g.yb) / 2 }); }
      return g;
    }
    // pulso de alerta na borda (D103)
    const H = window.Arte; if (H.preHook) H.preHook(ctx, sp, g, st, z, T);
    if (st === 'escavando' && H.obraHook && H.obraHook(ctx, sp, g, z, T, tags)) return g; // câmara aberta da porta, com contorno (D117)
    const a = alertOf(st);
    if (a) { const k = a === 'red' ? pulse(T, 1, INTEN) : pulse(T, 0.5, 0.75 * INTEN); domePath(ctx, g); ctx.lineJoin = 'round'; ctx.strokeStyle = mix(C.base, a === 'red' ? C.cheio : C.quase, k); ctx.lineWidth = 2 * extra; ctx.stroke(); }
    if (o.stub && H.stubHook) H.stubHook(ctx, g, z, 'antes');
    else if (o.stub) { ctx.strokeStyle = C.base; ctx.lineCap = 'round'; ctx.lineWidth = Math.max(0.25, 2 * px); ctx.beginPath(); if (g.porta === 'T') { ctx.moveTo(g.door.x, g.door.y); ctx.lineTo(g.door.x, g.y - 0.6); } else { ctx.moveTo(g.door.x, g.door.y); ctx.lineTo(g.door.x + (g.porta === 'L' ? -0.8 : 0.8), g.door.y - 0.25); } ctx.stroke(); }
    // interior tingido (D103) e escurecido quando pausado
    const dark = st === 'pausada' ? 0.5 : 0, tint = 0.13;
    const fill = c => dark ? mix(c, '#000000', dark) : c;
    // cascaHook desenha parede, interior e chão da câmara (rodada 15); sem ele, o interior liso da D103
    if (H.cascaHook && H.cascaHook(ctx, sp, g, st, z, T, fill)) { /* feito pelo gancho */ } else {
    domePath(ctx, g);
    if (sp.fam.length === 2) { ctx.save(); ctx.clip(); ctx.fillStyle = fill(mix(C.base, sp.fam[0], tint)); ctx.fillRect(g.x0 - 1, g.yt - 1, g.cx - g.x0 + 1, 4); ctx.fillStyle = fill(mix(C.base, sp.fam[1], tint)); ctx.fillRect(g.cx, g.yt - 1, g.x1 - g.cx + 1, 4); ctx.restore(); }
    else { ctx.fillStyle = fill(sp.fam.length ? mix(C.base, sp.fam[0], tint) : C.base); ctx.fill(); }
    if (lod !== 'geral') { domePath(ctx, g); const sh = ctx.createLinearGradient(0, g.yt, 0, g.yb); sh.addColorStop(0, 'rgba(0,0,0,0.28)'); sh.addColorStop(0.55, 'rgba(0,0,0,0.06)'); sh.addColorStop(1, 'rgba(255,240,220,0.04)'); ctx.fillStyle = sh; ctx.fill(); }
    const nv2 = st === 'nivel2';
    ctx.fillStyle = nv2 ? mix(C.base, C.min, 0.45) : mix(C.base, '#000000', 0.25);
    ctx.fillRect(g.x0, g.yb - (nv2 ? 0.07 : 0.035), g.x1 - g.x0, nv2 ? 0.07 : 0.035);
    }
    if (st === 'escavando') {
      const k = (T * 0.15) % 1; ctx.save(); domePath(ctx, g); ctx.clip(); ctx.fillStyle = C.solo; ctx.fillRect(g.x0 + (g.x1 - g.x0) * k, g.yt - 1, 9, 4); ctx.restore();
      domePath(ctx, g); ctx.setLineDash([5 * px, 8 * px]); ctx.strokeStyle = C.txt2; ctx.lineWidth = Math.max(1.2 * px, 0.025); ctx.stroke(); ctx.setLineDash([]);
      if (lod !== 'geral') for (let i = 0; i < 2; i++) ant(ctx, 'cavadora', g.x0 + (g.x1 - g.x0) * k - 0.2 - i * 0.3, g.floor - 0.08, 0, z, { nod: Math.sin(T * 9 + i) });
      return g;
    }
    if (lod === 'geral') return g;
    if (H.propsHook) H.propsHook(ctx, sp, g, st, z, T);
    conteudo(ctx, sp, g, st, z, T, tags);
    if (H.posHook) H.posHook(ctx, sp, g, st, z, T);
    if (o.stub && H.stubHook) H.stubHook(ctx, g, z, 'depois', sp, st, T);
    if (st === 'pausada') { ctx.fillStyle = C.txt; const y0 = g.yt + 0.14; ctx.fillRect(g.cx - 0.09, y0, 0.06, 0.22); ctx.fillRect(g.cx + 0.03, y0, 0.06, 0.22); }
    if ((st === 'ataque' || st === 'combate') && !(H.ataqueHook && H.ataqueHook(ctx, sp, g, st, z, T))) { for (let i = 0; i < 2; i++) { const ex = g.door.x + (g.porta === 'R' ? -1 : 1) * (0.25 + i * 0.3) + Math.sin(T * 3 + i) * 0.03; ant(ctx, 'rival', ex, g.floor - 0.08, g.porta === 'R' ? Math.PI : 0, z); } } // sem ataqueHook (D116): dois inimigos parados na porta
    // selos e barras em tamanho fixo de tela
    if (st === 'falta_ing' && (sp.ins || sp.id === 'real' || sp.id === 'bercario')) selo(ctx, g.cx, g.yt - 16 * px, z, T, sp.ins ? sp.ins[0][0] : 'fungo');
    if (st === 'sem_municao') selo(ctx, g.cx, g.yt - 16 * px, z, T, sp.municao);
    if (st === 'esgotada') selo(ctx, g.cx, g.yt - 16 * px, z, T, sp.out);
    if (st === 'ataque') { const w = Math.max(28 * px, (g.x1 - g.x0) * 0.6), y0 = g.yt - 9 * px; ctx.fillStyle = C.painel; ctx.fillRect(g.cx - w / 2 - px, y0 - px, w + 2 * px, 6 * px); ctx.fillStyle = C.perigo; ctx.fillRect(g.cx - w / 2, y0, w * 0.6, 4 * px); }
    return g;
  }
  function selo(ctx, x, y, z, T, kind) {
    const px = 1 / z, k = pulse(T, 0.5, 1);
    ctx.fillStyle = C.painel; ctx.strokeStyle = mix(C.borda, C.quase, k); ctx.lineWidth = 1.5 * px; ctx.beginPath(); ctx.arc(x, y, 12 * px, 0, 6.2832); ctx.fill(); ctx.stroke();
    if (kind) item(ctx, kind, x, y, 14 * px, { gray: true });
  }
  function conteudo(ctx, sp, g, st, z, T, tags) {
    const floor = g.floor, inL = g.x0 + 0.1, inR = g.x1 - 0.1, dIn = g.porta === 'R' ? -1 : 1, lod = LOD(z);
    const inStart = dIn > 0 ? inL : inR, outStart = dIn > 0 ? inR : inL;
    const working = st === 'produzindo' || st === 'pronta' || st === 'nivel2';
    const AH = window.Arte, cic = working && AH.cicloHook ? AH.cicloHook(T, sp, g) : null; AH._brilho = cic ? cic.brilho || 0 : 0;
    if (AH.conteudoHook && AH.conteudoHook(ctx, sp, g, st, z, T, tags)) return; // formigas animadas (D115)
    const nod = working && !(cic && cic.pausa) ? Math.sin(T * 7) * 0.8 : 0, prog = cic ? cic.k : working ? (T * 0.2) % 1 : st === 'saida_cheia' ? 1 : st === 'vazia' ? 0 : 0.35;
    if (sp.cat === 'prod') {
      let x = inStart;
      sp.ins.forEach(([k], i) => { const n = st === 'vazia' || (st === 'falta_ing' && i === 0) ? 0 : 3; const p = pile(ctx, k, n, x, dIn, floor, sp.ins.length > 1 ? 2 : 3, z, tags); x = dIn > 0 ? p.x + p.w + 0.06 : p.x - 0.06; });
      const nOut = st === 'saida_cheia' ? 9 : st === 'vazia' ? 0 : 2;
      const po = pile(ctx, sp.out, nOut, outStart, -dIn, floor, sp.out2 ? 2 : 3, z, tags);
      if (sp.out2 && nOut) pile(ctx, sp.out2, st === 'saida_cheia' ? 3 : 1, dIn > 0 ? po.x - 0.06 : po.x + po.w + 0.06, -dIn, floor, 1, z, tags);
      const lo = dIn > 0 ? x : (sp.out2 ? po.x + po.w + 0.4 : po.x + po.w), hi = dIn > 0 ? (sp.out2 ? po.x - 0.4 : po.x) : x, mid = (lo + hi) / 2;
      const vagas = (sp.vagas || 1) + (st === 'nivel2' ? 1 : 0), filled = st === 'falta_cuid' ? vagas - 1 : vagas;
      for (let i = 0; i < vagas; i++) ant(ctx, 'operaria', mid + (i - (vagas - 1) / 2) * 0.2, floor - 0.07 - (i % 2) * 0.02, (dIn > 0 ? Math.PI : 0) + (working ? Math.sin(T * 6 + i) * 0.08 : 0), z, { dashed: i >= filled, nod });
      if (st === 'vazia') { ctx.globalAlpha = 0.85; item(ctx, sp.out, g.cx, g.yt + 0.26, 0.2); ctx.globalAlpha = 1; }
      progressLine(ctx, g, prog, RES[sp.out].c[0]);
    } else if (sp.cat === 'ext') {
      const cast = sp.casta || 'operaria', vagas = Math.min(3, sp.vagas || 2), filled = st === 'falta_cuid' ? vagas - 1 : vagas;
      for (let i = 0; i < vagas; i++) ant(ctx, cast, g.x0 + 0.92 + i * 0.33, floor - 0.07, 0, z, { dashed: i >= filled, nod });
      pile(ctx, sp.out, st === 'saida_cheia' ? 8 : st === 'esgotada' ? 0 : 2, g.x0 + 0.12, 1, floor, 2, z, tags);
      progressLine(ctx, g, st === 'esgotada' ? 0 : prog, RES[sp.out].c[0]);
    } else if (sp.cat === 'def' || sp.cat === 'atk') {
      if (sp.id === 'posto' || sp.id === 'guerra') {
        const v = (sp.vagas || 4) + (st === 'nivel2' ? 1 : 0), filled = st === 'falta_cuid' ? 1 : v, cast = sp.id === 'guerra' ? 'saqueadora' : 'soldado';
        for (let i = 0; i < v; i++) ant(ctx, cast, g.x0 + 0.3 + i * (1.4 / v), floor - 0.08, Math.PI, z, { dashed: i >= filled, nod: st === 'combate' ? Math.sin(T * 12 + i) : 0 });
        if (sp.id === 'guerra') { ctx.strokeStyle = C.txt2; ctx.lineWidth = 0.03; ctx.beginPath(); ctx.moveTo(g.x1 - 0.25, floor); ctx.lineTo(g.x1 - 0.25, g.yt + 0.12); ctx.stroke(); if (st !== 'sem_municao') item(ctx, 'feromonio', g.x1 - 0.12, g.yt + 0.2, 0.2); }
      }
      if (sp.id === 'torre') {
        const ang = -Math.PI / 4 + Math.sin(T * 0.8) * 0.25, bx = g.cx + 0.2, by = g.yt + 0.1;
        ctx.strokeStyle = mix(C.base, C.def, 0.6); ctx.lineWidth = 0.09; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(bx, by + 0.25); ctx.lineTo(bx + Math.cos(ang) * 0.32, by + 0.25 + Math.sin(ang) * 0.32); ctx.stroke();
        ant(ctx, 'atiradora', g.cx - 0.25, floor - 0.08, 0, z, { dashed: st === 'falta_cuid' });
        pile(ctx, 'acido', st === 'sem_municao' ? 0 : 3, g.x1 - 0.12, -1, floor, 2, z, tags);
        if (st === 'combate' && Math.sin(T * 6) > 0.6) { ctx.fillStyle = C.acu; ctx.beginPath(); ctx.arc(bx + Math.cos(ang) * 0.5, by + 0.25 + Math.sin(ang) * 0.5, 0.05, 0, 6.2832); ctx.fill(); }
      }
      if (sp.id === 'armadilha' && window.Arte.teiaCamara) { const empty = st === 'sem_municao'; window.Arte.teiaCamara(ctx, g, z, T, empty, st === 'combate'); pile(ctx, 'cola', empty ? 0 : 2, g.x1 - 0.12, -1, floor, 2, z, tags); }
      else if (sp.id === 'armadilha') {
        const empty = st === 'sem_municao'; ctx.fillStyle = empty ? mix(C.base, C.ref, 0.3) : mix(C.acu, C.min, 0.5); ctx.globalAlpha = empty ? 0.5 : 0.75;
        ctx.beginPath(); ctx.ellipse(g.cx, floor - 0.03, (g.x1 - g.x0) * 0.42, 0.07, 0, 0, 6.2832); ctx.fill(); ctx.globalAlpha = 1;
        if (!empty) { ctx.strokeStyle = mix(C.acu, C.min, 0.5); ctx.lineWidth = 0.02; for (let i = 0; i < 4; i++) { const sx = g.x0 + 0.4 + i * 0.35; ctx.beginPath(); ctx.moveTo(sx, floor - 0.05); ctx.quadraticCurveTo(sx + 0.05, floor - 0.25, sx + 0.1, g.yw + 0.05); ctx.stroke(); } }
        pile(ctx, 'cola', empty ? 0 : 2, g.x1 - 0.12, -1, floor, 2, z, tags);
      }
      if (sp.id === 'mina') {
        if (st === 'usada') { ctx.fillStyle = mix(C.base, '#000000', 0.4); ctx.beginPath(); ctx.ellipse(g.cx, floor - 0.02, 0.5, 0.06, 0, 0, 6.2832); ctx.fill(); }
        else if (st !== 'sem_municao') { item(ctx, 'gosma', g.cx - 0.2, floor - 0.17, 0.3); item(ctx, 'gosma', g.cx + 0.2, floor - 0.15, 0.26); }
      }
    } else if (sp.id === 'real') {
      ant(ctx, 'rainha', g.cx + 0.2, floor - 0.36, Math.PI, z, { nod: nod * 0.5, scale: 2.1 });
      const eggs = st === 'falta_ing' ? 1 : 4; if (lod !== 'longe') for (let i = 0; i < eggs; i++) item(ctx, 'ovo', g.x1 - 0.32 - (i % 2) * 0.2, floor - 0.13 - Math.floor(i / 2) * 0.24, 0.26);
      pile(ctx, 'fungo', st === 'falta_ing' ? 0 : 3, inL + 0.05, 1, floor, 2, z, tags);
      ant(ctx, 'operaria', inL + 0.75, floor - 0.07, Math.PI, z, { nod });
      progressLine(ctx, g, st === 'falta_ing' ? 0.1 : prog, C.txt);
    } else if (sp.id === 'bercario') {
      const n = st === 'nivel2' ? 5 : 3; if (lod !== 'longe') for (let i = 0; i < n; i++) larva(ctx, g.x0 + 0.45 + i * (n > 3 ? 0.4 : 0.55), floor - 0.12, 1, working ? T : 0, i);
      pile(ctx, 'fungo', st === 'falta_ing' ? 0 : 2, inR, -1, floor, 2, z, tags);
      for (let i = 0; i < (sp.vagas || 2); i++) ant(ctx, 'operaria', g.x0 + 0.95 + i * 0.55, floor - 0.34, 0.3, z, { nod });
      ctx.globalAlpha = 0.85; item(ctx, 'fungo', g.cx, g.yt + 0.28, 0.2); ctx.globalAlpha = 1;
      progressLine(ctx, g, st === 'falta_ing' ? 0.1 : prog, C.veg);
    } else if (sp.id === 'nupcial') {
      const n = st === 'cheio' ? 6 : st === 'nivel2' ? 8 : 4;
      for (let i = 0; i < n; i++) ant(ctx, 'alada', g.x0 + 0.35 + (i % 4) * 0.62, floor - 0.1 - Math.floor(i / 4) * 0.42, Math.PI + Math.sin(T + i) * 0.05, z, {});
      if (lod === 'perto') tags.push({ txt: n + '/' + (st === 'nivel2' ? 10 : 6), x: g.cx, y: g.yt + 0.3 });
    } else if (sp.id === 'deposito') {
      const full = st === 'cheio', fams = [['fungo', 3], ['nectar', 2], ['barro', 4], ['proteina', 2]];
      let x = g.x0 + 0.12; fams.forEach(([k, n]) => { const p = pile(ctx, k, full ? 8 : n, x, 1, floor, 2, z, tags); x = p.x + p.w + 0.1; });
      if (lod === 'perto') tags.push({ txt: full ? '100/100' : '11/100', x: g.cx, y: g.yt + 0.35 });
    } else if (sp.id === 'lixeira') {
      pile(ctx, 'refugo', st === 'cheio' ? 40 : 6, g.x0 + 0.15, 1, floor, 3, z, tags);
      pile(ctx, 'refugo', st === 'cheio' ? 9 : 2, g.x0 + 1.15, 1, floor, 2, z, tags);
      if (lod === 'perto') tags.push({ txt: st === 'cheio' ? '200/200' : '58/200', x: g.cx + 0.4, y: g.yt + 0.3 });
    }
  }

  // ---------------- túneis (D52, D53, D87, D91, D99) ----------------
  const LARG = [0, 0.25, 0.33, 0.42, 0.5];
  function curve(a, b, bend) {
    const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2, dx = b.x - a.x, dy = b.y - a.y, c = { x: mx - dy * bend, y: my + dx * bend };
    const pts = []; for (let i = 0; i <= 14; i++) { const t = i / 14, u = 1 - t; pts.push({ x: u * u * a.x + 2 * u * t * c.x + t * t * b.x, y: u * u * a.y + 2 * u * t * c.y + t * t * b.y }); }
    const cum = [0]; for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
    return { pts, cum, len: cum[cum.length - 1] };
  }
  function at(p, s) { s = Math.max(0, Math.min(p.len, s)); let i = 1; while (i < p.cum.length - 1 && p.cum[i] < s) i++; const a = p.pts[i - 1], b = p.pts[i], seg = (p.cum[i] - p.cum[i - 1]) || 1, t = (s - p.cum[i - 1]) / seg; return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, ang: Math.atan2(b.y - a.y, b.x - a.x) }; }
  function trace(ctx, p, s0 = 0, s1 = p.len) { ctx.beginPath(); let first = true; for (let i = 0; i < p.pts.length; i++) { if (p.cum[i] < s0 || p.cum[i] > s1) continue; const q = p.pts[i]; first ? ctx.moveTo(q.x, q.y) : ctx.lineTo(q.x, q.y); first = false; } if (s1 < p.len) { const e = at(p, s1); ctx.lineTo(e.x, e.y); } }
  const minW = z => ({ perto: 2, medio: 2, longe: 2.5, geral: 3 }[LOD(z)]) / z;
  // st: livre | quase | cheio | alagado | planejado | escavando | rival | galeria. o: { T, dir: 'duplo'|'ida', fila, formigas, inimigos }
  function tunel(ctx, p, lvl, st, z, o = {}) {
    const T = o.T || 0, lod = LOD(z), px = 1 / z, w = Math.max(LARG[lvl] || 0.25, minW(z)), extra = (lod === 'geral' ? 3.5 : lod === 'longe' ? 3 : 2.5) * px;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    if (st === 'planejado') {
      trace(ctx, p); ctx.setLineDash([5 * px, 8 * px]); ctx.strokeStyle = C.txt2; ctx.lineWidth = Math.max(1.4 * px, 0.025); ctx.stroke(); ctx.setLineDash([]);
      return;
    }
    // faixa de terra batida em volta do túnel (rodada 15b): antes do corpo, por baixo do alerta
    const FH = window.Arte && window.Arte.faixaTunelHook, comFaixa = FH && !o.cor && st !== 'escavando';
    if (comFaixa) FH(ctx, p, w, z, st, 'antes');
    if (st === 'quase' || st === 'cheio') { const k = st === 'cheio' ? pulse(T, 1, INTEN) : pulse(T, 0.5, 0.75 * INTEN); trace(ctx, p); ctx.strokeStyle = mix(C.base, st === 'cheio' ? C.cheio : C.quase, k); ctx.lineWidth = w + 2 * extra; ctx.stroke(); }
    if (st === 'escavando') {
      const H = window.Arte; if (H.escavaTunelHook && H.escavaTunelHook(ctx, p, lvl, z, T)) return; // ponta irregular, farelos e argileiras (D117)
      const k = 0.25 + ((T * 0.12) % 0.75); trace(ctx, p, 0, p.len * k); ctx.strokeStyle = C.base; ctx.lineWidth = w; ctx.stroke();
      trace(ctx, p, p.len * k, p.len); ctx.setLineDash([5 * px, 8 * px]); ctx.strokeStyle = C.txt2; ctx.lineWidth = Math.max(1.4 * px, 0.025); ctx.stroke(); ctx.setLineDash([]);
      if (lod !== 'geral') { const e = at(p, p.len * k); ant(ctx, 'cavadora', e.x, e.y, e.ang, z, { nod: Math.sin(T * 9) }); }
      return;
    }
    if (st === 'galeria') { trace(ctx, p); ctx.setLineDash([5 * px, 3 * px]); ctx.lineDashOffset = -T * 6 * px; ctx.strokeStyle = C.atk; ctx.lineWidth = w + 2 * 1.6 * px; ctx.lineCap = 'butt'; ctx.stroke(); ctx.setLineDash([]); ctx.lineDashOffset = 0; ctx.lineCap = 'round'; }
    trace(ctx, p); ctx.strokeStyle = st === 'alagado' ? (o.aguaFill || C.agua) : (o.cor || C.base); ctx.lineWidth = w; ctx.stroke();
    if (comFaixa) FH(ctx, p, w, z, st, 'depois');
    if (st === 'alagado' && lod !== 'geral') { ctx.strokeStyle = o.aguaLinha || '#5F8670'; ctx.lineWidth = 1 * px; ctx.setLineDash([3 * px, 4 * px]); ctx.lineDashOffset = -T * 4 * px; trace(ctx, p); ctx.stroke(); ctx.setLineDash([]); ctx.lineDashOffset = 0; }
    if (st === 'rival') { trace(ctx, p); ctx.setLineDash([3 * px, 3 * px]); ctx.strokeStyle = C.perigo; ctx.lineWidth = Math.max(1.2 * px, 0.04); ctx.stroke(); ctx.setLineDash([]); }
    // setas de sentido: chevrons de Texto 2 a cada 2 células; mão dupla mostra ⇄ no meio
    if (o.dir && (lod === 'perto' || lod === 'medio')) {
      ctx.strokeStyle = C.txt2; ctx.lineWidth = Math.max(1.2 * px, 0.03); const cs = Math.min(w * 0.35, 0.1);
      if (o.dir === 'ida') for (let s = 1; s < p.len; s += 2) { const q = at(p, s); ctx.save(); ctx.translate(q.x, q.y); ctx.rotate(q.ang); ctx.beginPath(); ctx.moveTo(-cs, -cs); ctx.lineTo(0, 0); ctx.lineTo(-cs, cs); ctx.stroke(); ctx.restore(); }
      else { const q = at(p, p.len / 2); ctx.save(); ctx.translate(q.x, q.y); ctx.rotate(q.ang); ctx.beginPath(); ctx.moveTo(-cs * 1.6, -cs * 0.55); ctx.lineTo(cs * 1.6, -cs * 0.55); ctx.lineTo(cs * 0.8, -cs * 1.2); ctx.moveTo(cs * 1.6, cs * 0.55); ctx.lineTo(-cs * 1.6, cs * 0.55); ctx.lineTo(-cs * 0.8, cs * 1.2); ctx.stroke(); ctx.restore(); }
    }
    // formigas andando e fila na boca
    if (lod !== 'geral' && o.formigas) {
      const n = Math.round(p.len * o.formigas), v = st === 'cheio' ? 0.2 : st === 'quase' ? 0.5 : 1;
      for (let i = 0; i < n; i++) { const dir = (o.dir !== 'ida' && lvl >= 2 && i % 2) ? -1 : 1, d = (((i / n) * p.len + dir * T * v) % p.len + p.len) % p.len, q = at(p, d), off = lvl >= 2 && o.dir !== 'ida' ? dir * w * 0.2 : 0; ant(ctx, 'operaria', q.x - Math.sin(q.ang) * off, q.y + Math.cos(q.ang) * off, q.ang + (dir < 0 ? Math.PI : 0), z, { carry: dir > 0 ? ['folha', 'fungo', null][i % 3] : null }); }
    }
    if (lod !== 'geral' && o.inimigos) for (let i = 0; i < o.inimigos; i++) { const q = at(p, p.len * (0.2 + i * 0.6 / Math.max(1, o.inimigos - 1)) + Math.sin(T + i) * 0.1); ant(ctx, o.inimigo || 'rival', q.x, q.y, q.ang + Math.PI, z, { outline: o.outline || 1, T }); }
    if (o.fila && lod !== 'geral') {
      // fila parada dentro do túnel, encostada na boca do fim (porta da câmara)
      const shown = Math.min(10, o.fila), gap = 0.24;
      for (let i = 0; i < shown; i++) { const q = at(p, p.len - 0.15 - i * gap); ant(ctx, 'operaria', q.x, q.y, q.ang, z, { carry: i % 2 ? 'folha' : 'seiva', nod: Math.sin(T * 3 + i) * 0.5 }); }
      if (o.fila > 10 && lod === 'perto' && o.tags) { const q = at(p, p.len - 0.15 - 10.3 * gap); o.tags.push({ txt: '+' + (o.fila - 10), x: q.x, y: q.y - 0.2 }); }
    }
  }
  // barricada no túnel (07 §5): variante A = blocos de barro; B = tampão arredondado. hp de 0 a 1
  function barricada(ctx, p, s, lvl, z, o = {}) {
    const q = at(p, s), w = Math.max(LARG[lvl] || 0.25, minW(z)), px = 1 / z, lod = LOD(z), hp = o.hp == null ? 1 : o.hp, v = o.variante || 'A';
    ctx.save(); ctx.translate(q.x, q.y); ctx.rotate(q.ang);
    const L = 0.22, H = w * 1.25, col = hp > 0 ? mix(C.base, C.min, 0.7) : mix(C.base, C.min, 0.3);
    if (o.alerta) { const k = pulse(o.T || 0, 1, INTEN); ctx.fillStyle = mix(C.base, C.cheio, k); ctx.beginPath(); ctx.roundRect(-L / 2 - 2.5 * px, -H / 2 - 2.5 * px, L + 5 * px, H + 5 * px, v === 'B' ? L / 2 : 2 * px); ctx.fill(); }
    ctx.fillStyle = col;
    if (v === 'B' || lod === 'geral' || lod === 'longe') { ctx.beginPath(); ctx.roundRect(-L / 2, -H / 2, L, H, L / 2); ctx.fill(); }
    else { const n = 3, bh = H / n; for (let i = 0; i < n; i++) { const off = i % 2 ? 0.03 : -0.03; ctx.beginPath(); ctx.roundRect(-L / 2 + off, -H / 2 + i * bh + px * 0.6, L, bh - px * 1.2, 1.5 * px); ctx.fill(); } }
    if (hp < 0.5 && hp > 0 && lod !== 'geral') { ctx.strokeStyle = C.solo; ctx.lineWidth = 1.2 * px; ctx.beginPath(); ctx.moveTo(-L * 0.3, -H * 0.4); ctx.lineTo(L * 0.1, -H * 0.05); ctx.lineTo(-L * 0.15, H * 0.35); ctx.stroke(); }
    ctx.restore();
    if (lod === 'perto' || lod === 'medio') { const bw = 22 * px, y0 = q.y - H / 2 - 8 * px; ctx.fillStyle = C.painel; ctx.fillRect(q.x - bw / 2 - px, y0 - px, bw + 2 * px, 5 * px); ctx.fillStyle = hp > 0.5 ? C.def : hp > 0.25 ? C.quase : C.perigo; ctx.fillRect(q.x - bw / 2, y0, bw * hp, 3 * px); }
  }
  // ninho rival: cúpula com borda dupla vermelha (03 §3.6)
  function ninhoRival(ctx, x, y, z, o = {}) {
    const g = geom({ tam: 'G', cat: 'base' }, x, y, o.seed || 99), px = 1 / z;
    domePath(ctx, g); ctx.fillStyle = mix(C.base, C.perigo, 0.12); ctx.fill();
    domePath(ctx, g); ctx.strokeStyle = C.perigo; ctx.lineWidth = Math.max(2 * px, 0.04); ctx.stroke();
    ctx.save(); ctx.translate(g.cx, (g.yt + g.yb) / 2); ctx.scale(0.86, 0.8); ctx.translate(-g.cx, -(g.yt + g.yb) / 2); domePath(ctx, g); ctx.restore(); ctx.lineWidth = Math.max(1.3 * px, 0.025); ctx.stroke();
    if (LOD(z) !== 'geral') for (let i = 0; i < 4; i++) ant(ctx, 'rival', g.x0 + 0.5 + i * 0.5, g.floor - 0.08, Math.sin((o.T || 0) + i) > 0 ? 0 : Math.PI, z);
    return g;
  }
  function no(ctx, x, y, lvl, z) { ctx.fillStyle = C.base; ctx.beginPath(); ctx.arc(x, y, Math.max(LARG[lvl] * 0.62, minW(z) * 0.62), 0, 6.2832); ctx.fill(); }

  // ---------------- solo, percalços e superfície (D89, D96, D98) ----------------
  const AGUA_VARIANTES = { A: { nome: 'A · azul-acinzentado', fill: '#3E5F6E', linha: '#5C8394' }, B: { nome: 'B · verde-lodo (escolhida)', fill: '#41604F', linha: '#5F8670' }, C: { nome: 'C · cinza-azulado claro', fill: '#4C5C66', linha: '#7790A0' } };
  function blob(seed, x, y, rx, ry) { const r = rng(seed), p = [r() * 6.28, r() * 6.28, r() * 6.28], a = [0.06 + r() * .06, 0.05 + r() * .05, 0.03 + r() * .03]; const pts = []; for (let i = 0; i <= 48; i++) { const th = i / 48 * 6.2832, k = 1 + a[0] * Math.sin(2 * th + p[0]) + a[1] * Math.sin(3 * th + p[1]) + a[2] * Math.sin(5 * th + p[2]); pts.push({ x: x + rx * k * Math.cos(th), y: y + ry * k * Math.sin(th) }); } return pts; }
  function blobPath(ctx, pts) { ctx.beginPath(); pts.forEach((q, i) => i ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y)); ctx.closePath(); }
  // tipo: rocha | argila | areia | agua | toca | oculto. o: { T, agua: 'A'|'B'|'C' }
  function percalco(ctx, tipo, x, y, rx, ry, z, o = {}) {
    const T = o.T || 0, lod = LOD(z), px = 1 / z, pts = blob(o.seed || 41, x, y, rx, ry);
    if (tipo === 'oculto') { const s = Math.max(9 * px, 0.3); ctx.fillStyle = 'rgba(90,75,63,0.5)'; ctx.beginPath(); ctx.arc(x, y, s, 0, 6.2832); ctx.fill(); ctx.fillStyle = C.txt2; ctx.font = 'bold ' + (12 * px) + 'px system-ui'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('?', x, y + 0.5 * px); return; }
    if (tipo === 'toca') {
      const hp = blob(o.seed || 41, x, y, 0.8, 0.6); blobPath(ctx, hp); ctx.fillStyle = '#0B0907'; ctx.fill();
      ctx.strokeStyle = C.perigo; ctx.globalAlpha = 0.55; ctx.lineWidth = 1.4 * px; ctx.setLineDash([4 * px, 4 * px]); ctx.beginPath(); ctx.arc(x, y, rx, 0, 6.2832); ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1;
      ant(ctx, 'aranha', x + Math.sin(T * 0.8) * 0.6, y - 0.9 + Math.cos(T * 0.6) * 0.3, Math.sin(T * 0.5) * 2, z, { outline: o.outline || 0 });
      return;
    }
    const wv = AGUA_VARIANTES[o.agua || 'B'];
    blobPath(ctx, pts); ctx.fillStyle = { rocha: '#4A3F36', argila: '#4B3A2B', areia: '#3B3427', agua: wv.fill }[tipo]; ctx.fill();
    if (lod === 'geral') return;
    ctx.save(); blobPath(ctx, pts); ctx.clip();
    if (tipo === 'rocha') { ctx.strokeStyle = '#5E5045'; ctx.lineWidth = 1.2 * px; ctx.beginPath(); for (let d = -ry * 2; d < rx * 4; d += 0.45) { ctx.moveTo(x - rx * 1.3 + d, y + ry * 1.3); ctx.lineTo(x - rx * 1.3 + d + ry * 2.6, y - ry * 1.3); } ctx.stroke(); }
    if (tipo === 'argila') { ctx.fillStyle = '#6B5642'; const r = rng(31); for (let i = 0; i < rx * ry * 3; i++) { ctx.beginPath(); ctx.arc(x + (r() - .5) * rx * 2.2, y + (r() - .5) * ry * 2.2, 0.09, 0, 6.2832); ctx.fill(); } }
    if (tipo === 'areia') { ctx.fillStyle = '#8A7C64'; const r = rng(37); for (let i = 0; i < rx * ry * 9; i++) { ctx.beginPath(); ctx.arc(x + (r() - .5) * rx * 2.2, y + (r() - .5) * ry * 2.2, 0.045, 0, 6.2832); ctx.fill(); } }
    if (tipo === 'agua') { ctx.strokeStyle = wv.linha; ctx.lineWidth = 1.2 * px; ctx.beginPath(); for (let yy = y - ry; yy < y + ry; yy += 0.6) { for (let xx = x - rx; xx < x + rx; xx += 0.2) { const wy = yy + Math.sin(xx * 3 + T) * 0.08; xx === x - rx ? ctx.moveTo(xx, wy) : ctx.lineTo(xx, wy); } } ctx.stroke(); }
    ctx.restore();
  }
  const ESTACOES = { outono: { nome: 'Outono', ceu: '#21242B', planta: 0.6 }, inverno: { nome: 'Inverno', ceu: '#1A1F27', planta: 0 }, primavera: { nome: 'Primavera', ceu: '#1C2934', planta: 1 }, verao: { nome: 'Verão', ceu: '#1C2530', planta: 0.6 } };
  function cortadouroBoca(ctx, x, z) { ctx.fillStyle = C.base; ctx.beginPath(); ctx.ellipse(x, 0.02, 0.38, 0.22, 0, 0, Math.PI); ctx.fill(); ctx.strokeStyle = C.base; ctx.lineWidth = Math.max(2 / z, 0.07); ctx.beginPath(); ctx.arc(x, 0.05, 0.42, Math.PI, 0); ctx.stroke(); }

  // ---------------- ícones de interface (tamanho em dp; ctx em dp) ----------------
  const ICONES = {
    carregar: 'Carregar', escavar: 'Escavar', cuidar: 'Cuidar', guardar: 'Guardar', reserva: 'Reserva', construir: 'Construir', expedicao: 'Expedição', menu: 'Menu',
    pausa: 'Pausa', play: 'Continuar', rainha: 'Rainha', aladas: 'Aladas / meta', populacao: 'População', onda: 'Onda prevista', voo: 'Voo nupcial', relogio: 'Relógio do ano',
    estoque: 'Estoques', arvore: 'Árvore de criação', demolir: 'Demolir', melhorar: 'Melhorar (nível 2)', sentido: 'Sentido do túnel', fechar: 'Fechar', voltar: 'Voltar', ir: 'Ir até lá', config: 'Configurações', estrela: 'Estrela',
    a_fila: 'Alerta: fila', a_inimigo: 'Alerta: inimigo', a_toca: 'Alerta: toca de aranha', a_agua: 'Alerta: alagamento', a_fome: 'Alerta: fome', a_semrota: 'Alerta: sem rota', a_rainha: 'Alerta: rainha atacada', a_cuidar: 'Alerta: falta cuidadora',
  };
  function icone(ctx, k, x, y, s, col) {
    col = col || C.txt; const r = s / 2, lw = Math.max(1.5, s * 0.09);
    ctx.save(); ctx.translate(x, y); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const L = (pts) => { ctx.beginPath(); pts.forEach(([a, b], i) => i ? ctx.lineTo(a * r, b * r) : ctx.moveTo(a * r, b * r)); ctx.stroke(); };
    const alerta = k.startsWith('a_'), ring = c => { ctx.fillStyle = C.painel; ctx.beginPath(); ctx.arc(0, 0, r * 0.98, 0, 6.2832); ctx.fill(); ctx.strokeStyle = c; ctx.lineWidth = lw; ctx.stroke(); ctx.strokeStyle = col; ctx.fillStyle = col; };
    switch (k) {
      case 'carregar': L([[-0.35, 0.7], [-0.35, -0.7]]); L([[-0.7, -0.35], [-0.35, -0.7], [0, -0.35]]); L([[0.35, -0.7], [0.35, 0.7]]); L([[0, 0.35], [0.35, 0.7], [0.7, 0.35]]); break;
      case 'escavar': L([[-0.6, 0.7], [0.35, -0.25]]); ctx.beginPath(); ctx.moveTo(-0.2 * r, -0.75 * r); ctx.quadraticCurveTo(0.55 * r, -0.65 * r, 0.75 * r, 0.15 * r); ctx.stroke(); break;
      case 'cuidar': ctx.beginPath(); ctx.moveTo(0, 0.7 * r); ctx.bezierCurveTo(-1.0 * r, 0, -0.6 * r, -0.85 * r, 0, -0.35 * r); ctx.bezierCurveTo(0.6 * r, -0.85 * r, 1.0 * r, 0, 0, 0.7 * r); ctx.fill(); break;
      case 'guardar': ctx.beginPath(); ctx.moveTo(-0.65 * r, -0.65 * r); ctx.lineTo(0.65 * r, -0.65 * r); ctx.lineTo(0.55 * r, 0.15 * r); ctx.lineTo(0, 0.78 * r); ctx.lineTo(-0.55 * r, 0.15 * r); ctx.closePath(); ctx.stroke(); break;
      case 'reserva': ctx.setLineDash([lw * 1.2, lw * 1.2]); ctx.beginPath(); ctx.arc(0, 0, 0.62 * r, 0, 6.2832); ctx.stroke(); ctx.setLineDash([]); break;
      case 'construir': L([[0, -0.7], [0, 0.7]]); L([[-0.7, 0], [0.7, 0]]); break;
      case 'expedicao': L([[-0.7, 0.7], [0.6, -0.6]]); L([[0.7, 0.7], [-0.6, -0.6]]); L([[-0.75, 0.25], [-0.25, 0.75]]); L([[0.75, 0.25], [0.25, 0.75]]); break;
      case 'menu': [-0.5, 0, 0.5].forEach(v => L([[-0.65, v], [0.65, v]])); break;
      case 'pausa': ctx.fillRect(-0.45 * r, -0.62 * r, 0.3 * r, 1.24 * r); ctx.fillRect(0.15 * r, -0.62 * r, 0.3 * r, 1.24 * r); break;
      case 'play': ctx.beginPath(); ctx.moveTo(-0.4 * r, -0.65 * r); ctx.lineTo(0.65 * r, 0); ctx.lineTo(-0.4 * r, 0.65 * r); ctx.closePath(); ctx.fill(); break;
      case 'rainha': for (let i = -1; i <= 1; i++) { ctx.beginPath(); ctx.moveTo((i * 0.48 - 0.24) * r, 0.45 * r); ctx.lineTo(i * 0.48 * r, -0.55 * r); ctx.lineTo((i * 0.48 + 0.24) * r, 0.45 * r); ctx.closePath(); ctx.fill(); } ctx.fillRect(-0.72 * r, 0.42 * r, 1.44 * r, 0.22 * r); break;
      case 'aladas': star(ctx, 0, 0, 4, 0.75 * r, 0.26 * r, -Math.PI / 2); ctx.fill(); break;
      case 'populacao': L([[-0.45, 0.75], [-0.45, -0.75]]); ctx.beginPath(); ctx.moveTo(-0.45 * r, -0.72 * r); ctx.lineTo(0.6 * r, -0.4 * r); ctx.lineTo(-0.45 * r, -0.05 * r); ctx.closePath(); ctx.fill(); break;
      case 'onda': ctx.fillStyle = C.perigo; ctx.beginPath(); ctx.moveTo(0, -0.7 * r); ctx.lineTo(0.7 * r, 0.55 * r); ctx.lineTo(-0.7 * r, 0.55 * r); ctx.closePath(); ctx.fill(); break;
      case 'voo': star(ctx, 0, 0, 5, 0.78 * r, 0.33 * r, -Math.PI / 2); ctx.fill(); break;
      case 'relogio': ctx.beginPath(); ctx.arc(0, 0, 0.68 * r, 0, 6.2832); ctx.stroke(); L([[0, 0], [0, -0.45]]); L([[0, 0], [0.32, 0.18]]); break;
      case 'estoque': [[-0.4, 0.3], [0.4, 0.3], [0, -0.38]].forEach(([a, b]) => { ctx.beginPath(); ctx.arc(a * r, b * r, 0.3 * r, 0, 6.2832); ctx.stroke(); }); break;
      case 'arvore': ctx.beginPath(); ctx.arc(0, -0.5 * r, 0.2 * r, 0, 6.2832); ctx.arc(-0.5 * r, 0.5 * r, 0.2 * r, 0, 6.2832); ctx.fill(); ctx.beginPath(); ctx.arc(0.5 * r, 0.5 * r, 0.2 * r, 0, 6.2832); ctx.fill(); L([[0, -0.3], [-0.45, 0.32]]); L([[0, -0.3], [0.45, 0.32]]); break;
      case 'demolir': L([[-0.55, -0.4], [0.55, -0.4]]); L([[-0.2, -0.65], [0.2, -0.65]]); ctx.beginPath(); ctx.moveTo(-0.42 * r, -0.4 * r); ctx.lineTo(-0.32 * r, 0.72 * r); ctx.lineTo(0.32 * r, 0.72 * r); ctx.lineTo(0.42 * r, -0.4 * r); ctx.stroke(); break;
      case 'melhorar': L([[-0.6, 0.15], [0, -0.45], [0.6, 0.15]]); L([[-0.6, 0.65], [0, 0.05], [0.6, 0.65]]); break;
      case 'sentido': L([[-0.7, -0.3], [0.7, -0.3]]); L([[0.35, -0.6], [0.7, -0.3], [0.35, 0]]); L([[0.7, 0.3], [-0.7, 0.3]]); L([[-0.35, 0], [-0.7, 0.3], [-0.35, 0.6]]); break;
      case 'fechar': L([[-0.55, -0.55], [0.55, 0.55]]); L([[0.55, -0.55], [-0.55, 0.55]]); break;
      case 'voltar': L([[0.3, -0.65], [-0.35, 0], [0.3, 0.65]]); break;
      case 'ir': L([[-0.3, -0.65], [0.35, 0], [-0.3, 0.65]]); break;
      case 'config': ctx.beginPath(); ctx.arc(0, 0, 0.32 * r, 0, 6.2832); ctx.stroke(); for (let i = 0; i < 8; i++) { const a = i / 8 * 6.2832; L([[Math.cos(a) * 0.5, Math.sin(a) * 0.5], [Math.cos(a) * 0.75, Math.sin(a) * 0.75]]); } break;
      case 'estrela': ctx.fillStyle = C.acu; star(ctx, 0, 0, 5, 0.8 * r, 0.36 * r, -Math.PI / 2); ctx.fill(); break;
      case 'a_fila': ring('#FFD23F'); [-0.42, -0.14, 0.14, 0.42].forEach(v => { ctx.beginPath(); ctx.arc(v * r, 0.12 * r, 0.1 * r, 0, 6.2832); ctx.fill(); }); ctx.fillRect(-0.5 * r, -0.28 * r, r, 0.12 * r); break;
      case 'a_inimigo': ring(C.perigo); ctx.fillStyle = C.perigo; [-0.32, 0, 0.32].forEach(v => { ctx.beginPath(); ctx.arc(v * r, 0, 0.15 * r, 0, 6.2832); ctx.fill(); }); break;
      case 'a_toca': ring(C.perigo); ctx.strokeStyle = C.perigo; ctx.lineWidth = lw * 0.7; ctx.beginPath(); for (let i = 0; i < 4; i++) { const a = -0.9 + i * 0.6; [-1, 1].forEach(sd => { ctx.moveTo(0, 0); ctx.lineTo(sd * Math.cos(a) * 0.55 * r, Math.sin(a) * 0.45 * r); }); } ctx.stroke(); ctx.fillStyle = C.perigo; ctx.beginPath(); ctx.arc(0, 0, 0.2 * r, 0, 6.2832); ctx.fill(); break;
      case 'a_agua': ring('#8FB3C2'); ctx.fillStyle = '#8FB3C2'; ctx.beginPath(); ctx.moveTo(0, -0.55 * r); ctx.quadraticCurveTo(0.45 * r, 0.1 * r, 0, 0.42 * r); ctx.quadraticCurveTo(-0.45 * r, 0.1 * r, 0, -0.55 * r); ctx.fill(); break;
      case 'a_fome': ring(C.perigo); ctx.fillStyle = C.veg; ctx.beginPath(); ctx.arc(-0.1 * r, 0, 0.32 * r, 0, 6.2832); ctx.fill(); ctx.fillStyle = C.perigo; ctx.fillRect(0.22 * r, -0.07 * r, 0.38 * r, 0.14 * r); break;
      case 'a_semrota': ring('#FFD23F'); ctx.fillStyle = C.txt; ctx.font = 'bold ' + (s * 0.55) + 'px system-ui'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('?', 0, s * 0.03); break;
      case 'a_rainha': ring(C.perigo); ctx.fillStyle = C.perigo; for (let i = -1; i <= 1; i++) { ctx.beginPath(); ctx.moveTo((i * 0.3 - 0.15) * r, 0.3 * r); ctx.lineTo(i * 0.3 * r, -0.35 * r); ctx.lineTo((i * 0.3 + 0.15) * r, 0.3 * r); ctx.closePath(); ctx.fill(); } break;
      case 'a_cuidar': ring('#FFD23F'); ctx.setLineDash([lw * 0.8, lw * 0.8]); ctx.strokeStyle = C.txt; ctx.beginPath(); ctx.moveTo(0, 0.45 * r); ctx.bezierCurveTo(-0.65 * r, 0, -0.4 * r, -0.55 * r, 0, -0.22 * r); ctx.bezierCurveTo(0.4 * r, -0.55 * r, 0.65 * r, 0, 0, 0.45 * r); ctx.stroke(); ctx.setLineDash([]); break;
    }
    ctx.restore();
  }
  // seta na borda da tela (D93)
  function setaBorda(ctx, x, y, ang, tipo, n) {
    const col = tipo === 'inimigo' || tipo === 'toca' || tipo === 'rainha' ? C.perigo : tipo === 'agua' ? '#8FB3C2' : '#FFD23F';
    const dx = Math.cos(ang), dy = Math.sin(ang);
    ctx.fillStyle = C.painel; ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, 18, 0, 6.2832); ctx.fill(); ctx.stroke();
    ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(x + dx * 27, y + dy * 27); ctx.lineTo(x + dx * 19 - dy * 7, y + dy * 19 + dx * 7); ctx.lineTo(x + dx * 19 + dy * 7, y + dy * 19 - dx * 7); ctx.closePath(); ctx.fill();
    icone(ctx, { fila: 'a_fila', inimigo: 'a_inimigo', toca: 'a_toca', agua: 'a_agua', rainha: 'a_rainha' }[tipo], x, y, 26);
    if (n > 1) { ctx.fillStyle = C.txt; ctx.beginPath(); ctx.arc(x + 13, y - 13, 7, 0, 6.2832); ctx.fill(); ctx.fillStyle = C.solo; ctx.font = 'bold 10px system-ui'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(n, x + 13, y - 12.5); }
  }
  // números presos ao mundo, desenhados em tamanho fixo de tela
  function tagsDraw(ctx, tags, z) { const px = 1 / z; ctx.font = 'bold ' + (10 * px) + 'px system-ui'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; tags.forEach(t => { const w = ctx.measureText(t.txt).width + 6 * px; ctx.fillStyle = 'rgba(21,17,14,0.82)'; ctx.fillRect(t.x - w / 2, t.y - 7 * px, w, 14 * px); ctx.fillStyle = C.txt; ctx.fillText(t.txt, t.x, t.y + 0.5 * px); }); }

  window.Arte = { C, INTEN, LOD, rng, mix, pulse, RES, item, shapePath, star, ell, ANT_UNIT, CASTAS, INIMIGOS, ant, combatIcon, larva, DIM, ESTRUTURAS, ESTADOS, NOME_ESTADO, estadosDe, geom, domePath, estrutura, pile, LARG, curve, at, tunel, barricada, ninhoRival, no, minW, percalco, AGUA_VARIANTES, ESTACOES, cortadouroBoca, ICONES, icone, setaBorda, tagsDraw, alertOf };
})();

// ================= camada de detalhe (D110) =================
// Solo claro, superfície viva, plantas, recursos ilustrados de perto, castas com silhueta marcada e tinta leve, ofício nas câmaras e ícones sólidos.
// Liga-se ao núcleo pelos ganchos itemHook, antHook e propsHook.
(function () {
  const A = window.Arte, C = A.C, mix = A.mix, rng = A.rng, LOD = A.LOD, PI = Math.PI, TAU = 6.2832;
  const zpxOf = ctx => { const m = ctx.getTransform(); return Math.hypot(m.a, m.b) / (A.DPR || 1); };
  const ell = (ctx, x, y, rx, ry, rot) => { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rot || 0, 0, TAU); };

  // =============== FUNDO (tema do solo) ===============
  function graos(ctx, x0, y0, w, h, seed, cores, dens, tam) { const r = rng(seed); for (let i = 0; i < w * h * dens; i++) { ctx.fillStyle = cores[i % cores.length]; ctx.beginPath(); ctx.ellipse(x0 + r() * w, y0 + r() * h, tam * (0.5 + r()), tam * (0.4 + r() * 0.7), r() * 3, 0, TAU); ctx.fill(); } }
  function estratos(ctx, x0, y0, w, h, cores, prof, seed) {
    const r = rng(seed), ph = cores.map(() => r() * 6.28);
    const yk = (k, x) => k === 0 ? y0 - 1 : prof[k - 1] + 0.28 * Math.sin(x * 0.55 + ph[k]) + 0.12 * Math.sin(x * 1.7 + ph[k] * 2);
    for (let k = 0; k < cores.length; k++) {
      ctx.fillStyle = cores[k]; ctx.beginPath();
      for (let x = x0; x <= x0 + w + 0.01; x += 0.25) { const y = yk(k, x); x === x0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
      ctx.lineTo(x0 + w, y0 + h + 1); ctx.lineTo(x0, y0 + h + 1); ctx.closePath(); ctx.fill();
    }
  }
  function pedras(ctx, x0, y0, w, h, seed, cor, luz, n) {
    const r = rng(seed);
    for (let i = 0; i < n; i++) { const x = x0 + r() * w, y = y0 + 0.6 + r() * (h - 0.6), rx = 0.07 + r() * 0.16, ry = rx * (0.6 + r() * 0.3), a = (r() - 0.5) * 0.6;
      ctx.fillStyle = cor; ell(ctx, x, y, rx, ry, a); ctx.fill(); ctx.strokeStyle = luz; ctx.lineWidth = rx * 0.35; ctx.beginPath(); ctx.ellipse(x, y, rx * 0.8, ry * 0.7, a, PI * 1.1, PI * 1.75); ctx.stroke(); }
  }
  const SOLO = { topo: '#8E765C', cores: ['#8E765C', '#866E55', '#7C654E', '#725C47', '#695441'], prof: [1.8, 3.6, 5.6, 7.8] };
  function solo(ctx, x0, y0, w, h, z, seed) {
    estratos(ctx, x0, y0, w, h, SOLO.cores, SOLO.prof, 13);
    if (LOD(z) === 'geral') return;
    pedras(ctx, x0, y0, w, h, seed || 3, 'rgba(96,78,60,0.6)', 'rgba(200,180,150,0.35)', w * h * 0.07);
    graos(ctx, x0, y0, w, h, (seed || 3) + 1, ['rgba(110,90,70,0.35)'], 0.5, 0.05);
  }

  // =============== SUPERFÍCIE ===============
  const gnd = x => 0.1 * Math.sin(x * 0.9 + 1) + 0.06 * Math.sin(x * 2.3);
  // desenha céu e chão; plantas = [{tipo, x, h}], buracos = [x] (bocas que cortam a superfície)
  function superficie(ctx, est, x0, w, z, T, plantas, bocas) {
    const ceu = A.ESTACOES[est].ceu, px = 1 / z, lod = LOD(z);
    // céu acima da linha do chão
    const ceuPath = new Path2D(); ceuPath.moveTo(x0, -4); ceuPath.lineTo(x0 + w, -4);
    for (let x = x0 + w; x >= x0 - 0.01; x -= 0.1) ceuPath.lineTo(x, gnd(x));
    ceuPath.closePath();
    { const g = ctx.createLinearGradient(0, -3, 0, 0); g.addColorStop(0, mix(ceu, '#000000', 0.15)); g.addColorStop(1, mix(ceu, '#B8A48C', 0.16)); ctx.fillStyle = g; }
    ctx.fill(ceuPath);
    if (lod !== 'geral') {
      // morros e mato ao fundo, recortados no céu para não vazarem abaixo da linha do chão
      ctx.save(); ctx.clip(ceuPath);
      ctx.fillStyle = mix(ceu, '#56604A', 0.28); ctx.beginPath(); ctx.moveTo(x0, 0.2);
      for (let x = x0; x <= x0 + w; x += 0.25) ctx.lineTo(x, -0.55 - 0.35 * Math.sin(x * 0.35 + 2) - 0.2 * Math.sin(x * 0.9)); ctx.lineTo(x0 + w, 0.2); ctx.closePath(); ctx.fill();
      const r = rng(77); ctx.fillStyle = mix(ceu, '#3F5236', 0.45);
      for (let i = 0; i < w * 1.2; i++) { const x = x0 + r() * w, hh = 0.5 + r() * 1.2; ctx.beginPath(); ctx.moveTo(x - 0.05, 0.1); ctx.quadraticCurveTo(x + (r() - 0.5) * 0.4, -hh * 0.6, x + (r() - 0.5) * 0.3, -hh); ctx.quadraticCurveTo(x + 0.05, -hh * 0.5, x + 0.06, 0.1); ctx.fill(); }
      ctx.restore();
    }
    if (lod !== 'geral') {
      // faixa de húmus logo abaixo do chão
      ctx.strokeStyle = mix(SOLO.topo, '#000000', 0.32); ctx.lineWidth = 0.16; ctx.beginPath();
      for (let x = x0; x <= x0 + w + 0.01; x += 0.2) { const y = gnd(x) + 0.08; x === x0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke();
    }
    // plantas
    (plantas || []).forEach((p, i) => planta(ctx, p.tipo, p.x, gnd(p.x), p.h, est, z, T, i * 7 + 3));
    if (lod !== 'geral') {
      const r = rng(31), k = A.ESTACOES[est].planta;
      for (let x = x0 + 0.1; x < x0 + w; x += 0.22 + r() * 0.25) {
        if ((bocas || []).some(b => Math.abs(b - x) < 0.6)) continue;
        const y = gnd(x), t = r();
        if (t < 0.55) { // tufo de grama
          ctx.strokeStyle = k === 0 ? mix(C.veg, C.ref, 0.65) : mix(C.veg, '#2C3A22', 0.35); ctx.lineWidth = Math.max(1 * px, 0.025); ctx.lineCap = 'round'; ctx.beginPath();
          const hh = (0.12 + r() * 0.14) * (k === 0 ? 0.5 : 1); for (let j = -1; j <= 1; j++) { const sw = Math.sin(T * 1.3 + x) * 0.02; ctx.moveTo(x + j * 0.03, y); ctx.quadraticCurveTo(x + j * 0.06, y - hh * 0.6, x + j * 0.1 + sw, y - hh); } ctx.stroke();
        } else if (t < 0.7) { ctx.fillStyle = mix(SOLO.topo, '#B8A890', 0.35); ell(ctx, x, y - 0.02, 0.05 + r() * 0.04, 0.03, 0); ctx.fill(); }
        else if (t < 0.9) { // folha caída
          const c = [mix(C.veg, '#6B5A3A', 0.55), mix(C.acu, '#6B5A3A', 0.55), mix(C.ani, '#6B5A3A', 0.6)][Math.floor(r() * 3)]; ctx.fillStyle = c; ctx.save(); ctx.translate(x, y - 0.02); ctx.rotate((r() - 0.5) * 1.2); ell(ctx, 0, 0, 0.09, 0.035, 0); ctx.fill(); ctx.restore();
        } else if (k > 0) { // flor pequena
          const hh = 0.18 + r() * 0.1; ctx.strokeStyle = mix(C.veg, '#2C3A22', 0.35); ctx.lineWidth = Math.max(1 * px, 0.02); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - hh); ctx.stroke(); ctx.fillStyle = ['#EFE7DC', '#E8C9D6', '#F2E2A8'][Math.floor(r() * 3)]; ctx.beginPath(); ctx.arc(x, y - hh, 0.045, 0, TAU); ctx.fill();
        }
      }
    }
    return gnd;
  }

  // =============== PLANTAS (mesma função, desenhos diferentes) ===============
  const PLANTAS = { capim: 'Capim', trevo: 'Trevo', samambaia: 'Samambaia', folhaLarga: 'Folha larga', dente: 'Dente-de-leão', arbusto: 'Arbusto' };
  // arbusto de folhinhas (D111): copa em três tufos, flores na primavera, ferrugem no outono, galhos pelados no inverno
  function arbusto(ctx, h, k, est, cf, esc, px, r, sway) {
    const tronco = '#5A4532', topo = -h * 0.2, sw = sway * 2;
    const gal = [[-0.3, -h * 0.55], [0.04, -h * 0.82], [0.3, -h * 0.5], [-0.12, -h * 0.72], [0.16, -h * 0.68]];
    ctx.strokeStyle = tronco; ctx.lineWidth = Math.max(1.4 * px, 0.055); ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(0.02, topo * 0.5, 0, topo); ctx.stroke();
    ctx.lineWidth = Math.max(px, 0.028); gal.forEach(([gx, gy]) => { ctx.beginPath(); ctx.moveTo(0, topo); ctx.quadraticCurveTo(gx * 0.25, (gy + topo) * 0.55, gx + sw, gy); ctx.stroke(); });
    if (k === 0) { ctx.lineWidth = Math.max(0.8 * px, 0.016); ctx.beginPath(); gal.forEach(([gx, gy], i) => { const x = gx + sw; ctx.moveTo(x, gy); ctx.lineTo(x - 0.08, gy - 0.1); ctx.moveTo(x, gy); ctx.lineTo(x + 0.07 + (i % 2) * 0.03, gy - 0.08); ctx.moveTo(x * 0.6, (gy + topo) * 0.6); ctx.lineTo(x * 0.6 + (x < 0 ? -0.1 : 0.1), (gy + topo) * 0.6 - 0.06); }); ctx.stroke(); return; }
    const outono = est === 'outono', blobs = [[-0.24, -h * 0.55, 0.28], [0.24, -h * 0.52, 0.26], [0.02, -h * 0.78, 0.3]];
    const cores = outono ? [mix(cf, '#C47A3A', 0.45), mix(esc, '#8A4A2A', 0.35), mix(cf, '#E2B860', 0.45)] : [cf, esc, mix(cf, '#FFFFFF', 0.14)];
    blobs.forEach(([bx, by, br]) => { ctx.fillStyle = mix(cores[1], '#000000', 0.18); ell(ctx, bx + sw, by + 0.03, br * 0.92, br * 0.74, 0); ctx.fill(); });
    const nf = Math.round(66 * (0.65 + 0.35 * k));
    for (let i = 0; i < nf; i++) { const b = blobs[i % 3], a = r() * TAU, d = Math.sqrt(r()) * b[2] * 0.95, x = b[0] + Math.cos(a) * d + sw, y = b[1] + Math.sin(a) * d * 0.78, cima = y < b[1] - b[2] * 0.15;
      ctx.fillStyle = cima ? (i % 3 ? cores[0] : cores[2]) : (i % 2 ? cores[1] : cores[0]); ell(ctx, x, y, 0.068, 0.032, r() * PI); ctx.fill(); }
    if (k >= 1) { const rr = rng(4); for (let i = 0; i < 7; i++) { const b = blobs[i % 3], a = rr() * TAU, d = Math.sqrt(rr()) * b[2] * 0.8, x = b[0] + Math.cos(a) * d + sw, y = b[1] + Math.sin(a) * d * 0.7 - 0.03;
      ctx.fillStyle = '#EFE6E2'; for (let j = 0; j < 5; j++) { const q = j / 5 * TAU; ctx.beginPath(); ctx.arc(x + Math.cos(q) * 0.032, y + Math.sin(q) * 0.032, 0.026, 0, TAU); ctx.fill(); } ctx.fillStyle = '#E2BE66'; ctx.beginPath(); ctx.arc(x, y, 0.02, 0, TAU); ctx.fill(); } }
    if (outono) { const rr = rng(6); for (let i = 0; i < 4; i++) { ctx.fillStyle = cores[i % 3]; ell(ctx, -0.35 + rr() * 0.7, -0.02, 0.06, 0.025, rr() - 0.5); ctx.fill(); } }
  }

  function corFolha(est, k) { if (k === 0) return mix(C.veg, C.ref, 0.6); if (est === 'outono') return mix(C.veg, '#C9A24A', 0.4); if (est === 'primavera') return mix(C.veg, '#B8F0A0', 0.15); return C.veg; }
  function planta(ctx, tipo, x, gy, h, est, z, T, seed) {
    const k = A.ESTACOES[est].planta, px = 1 / z, r = rng(seed || 5), cf = corFolha(est, k), escura = mix(cf, '#14200F', 0.35), sway = Math.sin(T * 1.1 + x) * 0.03;
    if (LOD(z) === 'geral') { ctx.fillStyle = cf; ctx.fillRect(x - 0.15, gy - h * 0.6, 0.3, h * 0.6); return; }
    ctx.save(); ctx.translate(x, gy); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const caule = (c) => { ctx.strokeStyle = c || (k === 0 ? cf : mix(C.veg, '#2C3A22', 0.3)); };
    if (tipo === 'arbusto') arbusto(ctx, h, k, est, cf, escura, px, r, sway);
    if (tipo === 'capim') {
      const n = 6 + Math.round(k * 6);
      for (let i = 0; i < n; i++) { const bx = (i - (n - 1) / 2) * 0.07, hh = h * (0.45 + r() * 0.55) * (k === 0 ? 0.35 : 0.5 + 0.5 * k), lean = (r() - 0.5) * 0.9 + sway * 4, tx = bx + lean * hh * 0.5;
        ctx.fillStyle = i % 3 ? cf : escura; ctx.beginPath(); ctx.moveTo(bx - 0.035, 0); ctx.quadraticCurveTo(bx + lean * hh * 0.15, -hh * 0.6, tx, -hh); ctx.quadraticCurveTo(bx + lean * hh * 0.2 + 0.02, -hh * 0.55, bx + 0.035, 0); ctx.closePath(); ctx.fill(); }
    }
    if (tipo === 'trevo') {
      const n = k === 0 ? 3 : 3 + Math.round(k * 3);
      for (let i = 0; i < n; i++) { const a = -PI / 2 + (i - (n - 1) / 2) * 0.35, L = h * (0.55 + r() * 0.4) * (k === 0 ? 0.35 : 0.6 + 0.4 * k), ex = Math.cos(a) * L * 0.5 + sway * 3, ey = -L;
        caule(); ctx.lineWidth = Math.max(1 * px, 0.035); ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(ex * 0.3, ey * 0.6, ex, ey); ctx.stroke();
        if (k > 0) for (let j = 0; j < 3; j++) { const b = -PI / 2 + (j - 1) * 2.1, rr = 0.1 + 0.05 * k; ctx.fillStyle = j === 1 ? cf : escura; ctx.beginPath(); ctx.arc(ex + Math.cos(b) * rr * 0.9, ey + Math.sin(b) * rr * 0.9, rr, 0, TAU); ctx.fill(); }
        if (k > 0) { ctx.fillStyle = mix(cf, '#FFFFFF', 0.35); ctx.beginPath(); ctx.arc(ex, ey, 0.025, 0, TAU); ctx.fill(); } }
    }
    if (tipo === 'samambaia') {
      const n = k === 0 ? 2 : 3;
      for (let i = 0; i < n; i++) { const sd = i - (n - 1) / 2, L = h * (k === 0 ? 0.4 : 0.75 + 0.25 * k) * (i === 1 ? 1 : 0.8), ex = sd * L * 0.75 + sway * 4, ey = -L * (i === 1 ? 1 : 0.7);
        const cx = sd * L * 0.1, cy = -L * 1.05; caule(); ctx.lineWidth = Math.max(1 * px, 0.035); ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(cx, cy, ex, ey); ctx.stroke();
        if (k === 0) continue;
        for (let t = 0.2; t < 0.97; t += 0.075) { const u = 1 - t, qx = u * u * 0 + 2 * u * t * cx + t * t * ex, qy = 2 * u * t * cy + t * t * ey, dx = 2 * u * (cx) + 2 * t * (ex - cx), dy = 2 * u * cy + 2 * t * (ey - cy), a = Math.atan2(dy, dx), s = 0.13 * (1 - t * 0.7) * (0.6 + 0.4 * k);
          [-1, 1].forEach(sg => { ctx.fillStyle = sg > 0 ? cf : escura; ell(ctx, qx + Math.cos(a + sg * 1.2) * s * 0.8, qy + Math.sin(a + sg * 1.2) * s * 0.8, s, s * 0.38, a + sg * 1.2); ctx.fill(); }); } }
    }
    if (tipo === 'folhaLarga') {
      const n = k === 0 ? 2 : 2 + Math.round(k);
      for (let i = 0; i < n; i++) { const sd = i % 2 ? -1 : 1, L = h * (0.55 + i * 0.18) * (k === 0 ? 0.4 : 1), ex = sd * (0.25 + i * 0.1) + sway * 4, ey = -L;
        caule(); ctx.lineWidth = Math.max(1.2 * px, 0.045); ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(0, ey * 0.7, ex, ey); ctx.stroke();
        if (k === 0) continue;
        const a = -PI / 2 + sd * 0.9, lw = (0.42 + 0.12 * k), lh = lw * 0.48;
        ctx.save(); ctx.translate(ex, ey); ctx.rotate(-sd * 0.35 + Math.sin(T * 1.3 + i) * 0.05);
        ctx.fillStyle = i % 2 ? escura : cf; ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(sd * lw * 0.5, -lh * 1.3, sd * lw, -lh * 0.2); ctx.quadraticCurveTo(sd * lw * 0.55, lh * 0.6, 0, 0); ctx.fill();
        ctx.strokeStyle = mix(cf, '#14200F', 0.45); ctx.lineWidth = Math.max(0.8 * px, 0.015); ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(sd * lw * 0.5, -lh * 0.45, sd * lw * 0.95, -lh * 0.2); ctx.stroke(); ctx.restore(); }
    }
    if (tipo === 'dente') {
      const n = 6, s = (k === 0 ? 0.18 : 0.28 + 0.1 * k);
      for (let i = 0; i < n; i++) { const sd = i % 2 ? -1 : 1, a = (i < 3 ? 0.25 + i * 0.35 : 0.25 + (i - 3) * 0.35), L = s * (1.2 + (i % 3) * 0.3);
        ctx.fillStyle = i % 2 ? escura : cf; ctx.beginPath(); ctx.moveTo(0, 0); for (let j = 1; j <= 4; j++) { const t = j / 4, xx = sd * Math.cos(a) * L * t, yy = -Math.sin(a) * L * t; ctx.lineTo(xx + (j % 2 ? 1 : -0.3) * 0.05 * sd, yy - (j % 2 ? 0.05 : 0)); } ctx.lineTo(0, -0.03); ctx.closePath(); ctx.fill(); }
      if (k > 0) { const hh = h * 0.9; caule(); ctx.lineWidth = Math.max(1 * px, 0.03); ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(sway * 2, -hh * 0.5, sway * 5, -hh); ctx.stroke();
        if (est === 'primavera' || est === 'verao') { ctx.fillStyle = '#F2D86A'; for (let j = 0; j < 10; j++) { const b = j / 10 * TAU; ell(ctx, sway * 5 + Math.cos(b) * 0.07, -hh + Math.sin(b) * 0.07, 0.06, 0.022, b); ctx.fill(); } ctx.fillStyle = '#D9A93A'; ctx.beginPath(); ctx.arc(sway * 5, -hh, 0.04, 0, TAU); ctx.fill(); }
        else { ctx.strokeStyle = 'rgba(239,231,220,0.75)'; ctx.lineWidth = Math.max(0.7 * px, 0.012); ctx.beginPath(); for (let j = 0; j < 14; j++) { const b = j / 14 * TAU; ctx.moveTo(sway * 5, -hh); ctx.lineTo(sway * 5 + Math.cos(b) * 0.14, -hh + Math.sin(b) * 0.14); } ctx.stroke(); } }
    }
    ctx.restore();
  }

  // =============== RECURSOS DETALHADOS NO ZOOM PERTO ===============
  // Objeto ilustrado dentro da silhueta da forma original. Abaixo de 9 px na tela volta à forma simples.
  function fillCores(ctx, path, cores, rule) {
    path(); if (cores.length === 1) { ctx.fillStyle = cores[0]; ctx.fill(rule || 'nonzero'); return; }
    ctx.save(); path(); ctx.clip(rule || 'nonzero'); ctx.fillStyle = cores[0]; ctx.fillRect(-2, -2, 2, 4); ctx.fillStyle = cores[1]; ctx.fillRect(0, -2, 2, 4); ctx.restore();
  }
  function volume(ctx, path, rule, forte) {
    ctx.save(); path(); ctx.clip(rule || 'nonzero'); const g = ctx.createLinearGradient(-0.9, -1, 0.9, 1); g.addColorStop(0, 'rgba(255,255,255,' + (forte ? 0.3 : 0.22) + ')'); g.addColorStop(0.45, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(0,0,0,' + (forte ? 0.34 : 0.26) + ')'); ctx.fillStyle = g; ctx.fillRect(-2, -2, 4, 4); ctx.restore();
  }
  const brilho = (ctx, x, y, rx, ry, a) => { ctx.fillStyle = 'rgba(255,255,255,0.5)'; ell(ctx, x, y, rx, ry, a); ctx.fill(); };
  const P = {
    folha: c => { c.beginPath(); c.moveTo(0, -1); c.bezierCurveTo(0.6, -0.55, 0.78, 0.15, 0, 0.82); c.bezierCurveTo(-0.78, 0.15, -0.6, -0.55, 0, -1); },
    gota: c => { c.beginPath(); c.moveTo(0, -1); c.bezierCurveTo(0.35, -0.45, 0.8, 0, 0.8, 0.28); c.arc(0, 0.28, 0.8, 0, PI); c.bezierCurveTo(-0.8, 0, -0.35, -0.45, 0, -1); c.closePath(); },
    triRed: c => { c.beginPath(); c.moveTo(0, -0.95); c.arcTo(0.95, 0.78, -0.95, 0.78, 0.22); c.arcTo(-0.95, 0.78, 0, -0.95, 0.22); c.arcTo(0, -0.95, 0.95, 0.78, 0.22); c.closePath(); },
    torrao: c => { const p = [[-0.82, -0.66], [-0.2, -0.86], [0.6, -0.8], [0.86, -0.1], [0.78, 0.7], [0.1, 0.86], [-0.72, 0.8], [-0.9, 0.05]]; c.beginPath(); p.forEach(([a, b], i) => i ? c.lineTo(a, b) : c.moveTo(a, b)); c.closePath(); },
    circ: c => { c.beginPath(); c.arc(0, 0, 0.84, 0, TAU); },
    hex: c => { c.beginPath(); for (let i = 0; i < 6; i++) { const a = i / 6 * TAU; i ? c.lineTo(Math.cos(a) * 0.96, Math.sin(a) * 0.96) : c.moveTo(0.96, 0); } c.closePath(); },
    caps: c => { const h = 0.52; c.beginPath(); c.moveTo(-1 + h, -h); c.lineTo(1 - h, -h); c.arc(1 - h, 0, h, -PI / 2, PI / 2); c.lineTo(-1 + h, h); c.arc(-1 + h, 0, h, PI / 2, PI * 1.5); c.closePath(); },
    pent: c => { c.beginPath(); for (let i = 0; i < 5; i++) { const a = -PI / 2 + i / 5 * TAU; i ? c.lineTo(Math.cos(a) * 0.96, Math.sin(a) * 0.96) : c.moveTo(Math.cos(a) * 0.96, Math.sin(a) * 0.96); } c.closePath(); },
    tijolo: c => { c.beginPath(); c.roundRect(-1, -0.55, 2, 1.1, 0.12); },
    amendoim: c => { c.beginPath(); c.arc(-0.42, 0, 0.56, 0, TAU); c.moveTo(0.98, 0); c.arc(0.42, 0, 0.56, 0, TAU); },
    triInv: c => { c.beginPath(); c.moveTo(0, 0.95); c.arcTo(-0.95, -0.78, 0.95, -0.78, 0.22); c.arcTo(0.95, -0.78, 0, 0.95, 0.22); c.arcTo(0, 0.95, -0.95, -0.78, 0.22); c.closePath(); },
    trap: c => { c.beginPath(); c.moveTo(-0.55, -0.7); c.lineTo(0.55, -0.7); c.quadraticCurveTo(0.9, -0.1, 1, 0.7); c.lineTo(-1, 0.7); c.quadraticCurveTo(-0.9, -0.1, -0.55, -0.7); c.closePath(); },
    est4: c => { c.beginPath(); for (let i = 0; i < 8; i++) { const r = i % 2 ? 0.42 : 1, a = -PI / 2 + i / 8 * TAU; i ? c.lineTo(Math.cos(a) * r, Math.sin(a) * r) : c.moveTo(Math.cos(a) * r, Math.sin(a) * r); } c.closePath(); },
    anel: c => { c.beginPath(); c.arc(0, 0, 0.88, 0, TAU); c.moveTo(0.48, 0); c.arc(0, 0, 0.48, 0, TAU, true); },
    est8: c => A.star(c, 0, 0, 8, 1, 0.58, -PI / 2),
    est5: c => A.star(c, 0, 0, 5, 1, 0.47, -PI / 2),
    ovo: c => { c.beginPath(); c.ellipse(0, 0, 0.6, 0.8, 0, 0, TAU); },
  };
  function itemA(ctx, kind, x, y, s, o, zpx) {
    const d = A.RES[kind], r = s / 2, px = 1 / (r * zpx), cores = d.c, c0 = cores[0], esc = k => mix(c0, '#000000', k), luz = k => mix(c0, '#FFFFFF', k);
    ctx.save(); ctx.translate(x, y); ctx.scale(r, r); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const linha = (cor, w, f) => { ctx.strokeStyle = cor; ctx.lineWidth = w * px; ctx.beginPath(); f(); ctx.stroke(); };
    const N3 = path => { ctx.save(); ctx.scale(1.3, 1.3); path(ctx); ctx.restore(); ctx.strokeStyle = C.txt; ctx.lineWidth = 1.2 * px; ctx.stroke(); };
    switch (kind) {
      case 'folha': fillCores(ctx, () => P.folha(ctx), cores); ctx.save(); P.folha(ctx); ctx.clip(); ctx.fillStyle = 'rgba(0,0,0,0.18)'; ctx.fillRect(0, -1, 1, 2); ctx.restore();
        linha(mix(c0, '#1E3A14', 0.55), 1.1, () => { ctx.moveTo(0, -0.85); ctx.lineTo(0, 1.05); [-0.45, -0.12, 0.22].forEach(t => { ctx.moveTo(0, t); ctx.lineTo(0.36, t - 0.24); ctx.moveTo(0, t); ctx.lineTo(-0.36, t - 0.24); }); }); break;
      case 'seiva': fillCores(ctx, () => P.gota(ctx), cores); volume(ctx, () => P.gota(ctx), null, true); brilho(ctx, -0.28, 0.12, 0.13, 0.26, -0.3); break;
      case 'presa': fillCores(ctx, () => P.triRed(ctx), cores); volume(ctx, () => P.triRed(ctx));
        linha(esc(0.35), 1.1, () => { [0.12, 0.45].forEach(yy => { const hw = 0.9 * (yy + 0.95) / 1.75 * 0.8; ctx.moveTo(-hw, yy); ctx.quadraticCurveTo(0, yy + 0.12, hw, yy); }); });
        linha(esc(0.4), 1.1, () => { [-1, 1].forEach(sd => { ctx.moveTo(sd * 0.48, 0.2); ctx.lineTo(sd * 0.86, 0.02); ctx.moveTo(sd * 0.62, 0.52); ctx.lineTo(sd * 1.0, 0.6); }); });
        ctx.fillStyle = esc(0.3); ctx.beginPath(); ctx.arc(0, -0.62, 0.16, 0, TAU); ctx.fill(); break;
      case 'argila': fillCores(ctx, () => P.torrao(ctx), cores); volume(ctx, () => P.torrao(ctx)); { const q = rng(9); for (let i = 0; i < 7; i++) { ctx.fillStyle = i % 3 ? esc(0.3) : luz(0.35); ctx.beginPath(); ctx.arc((q() - 0.5) * 1.2, (q() - 0.5) * 1.2, 0.05 + q() * 0.05, 0, TAU); ctx.fill(); } } break;
      case 'fungo': fillCores(ctx, () => P.circ(ctx), cores); { const q = rng(4); for (let i = 0; i < 9; i++) { const a = q() * TAU, rr = q() * 0.55; ctx.fillStyle = luz(0.3); ctx.beginPath(); ctx.arc(Math.cos(a) * rr, Math.sin(a) * rr, 0.14 + q() * 0.1, 0, TAU); ctx.fill(); } } volume(ctx, () => P.circ(ctx)); { const q = rng(5); for (let i = 0; i < 6; i++) { ctx.fillStyle = esc(0.3); ctx.beginPath(); ctx.arc((q() - 0.5) * 1.1, (q() - 0.5) * 1.1, 0.04, 0, TAU); ctx.fill(); } } break;
      case 'nectar': fillCores(ctx, () => P.hex(ctx), cores); linha(esc(0.3), 1.3, () => P.hex(ctx)); ctx.save(); ctx.scale(0.58, 0.58); P.hex(ctx); ctx.restore(); ctx.fillStyle = luz(0.3); ctx.fill(); volume(ctx, () => P.hex(ctx), null, true); brilho(ctx, -0.32, -0.38, 0.18, 0.08, -0.5); break;
      case 'proteina': fillCores(ctx, () => P.caps(ctx), cores); volume(ctx, () => P.caps(ctx)); ctx.fillStyle = esc(0.25); ctx.fillRect(-0.06, -0.52, 0.12, 1.04); linha('rgba(255,255,255,0.5)', 1.6, () => { ctx.moveTo(-0.55, -0.28); ctx.lineTo(0.45, -0.28); }); break;
      case 'quitina': fillCores(ctx, () => P.pent(ctx), cores); volume(ctx, () => P.pent(ctx)); linha(luz(0.35), 1, () => { for (let i = 0; i < 5; i++) { const a = -PI / 2 + i / 5 * TAU; ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * 0.9, Math.sin(a) * 0.9); } }); ctx.save(); ctx.scale(0.42, 0.42); P.pent(ctx); ctx.restore(); ctx.fillStyle = esc(0.2); ctx.fill(); break;
      case 'barro': fillCores(ctx, () => P.tijolo(ctx), cores); volume(ctx, () => P.tijolo(ctx)); linha(esc(0.35), 1.1, () => { ctx.moveTo(-0.95, 0); ctx.lineTo(0.95, 0); ctx.moveTo(-0.25, -0.52); ctx.lineTo(-0.25, 0); ctx.moveTo(0.4, 0); ctx.lineTo(0.4, 0.52); }); break;
      case 'pasta': fillCores(ctx, () => P.amendoim(ctx), cores); volume(ctx, () => P.amendoim(ctx)); linha('rgba(255,255,255,0.45)', 1.3, () => { ctx.arc(-0.45, -0.02, 0.3, PI * 1.1, PI * 1.6); ctx.moveTo(0.42 + 0.3 * Math.cos(PI * 1.1), -0.02 + 0.3 * Math.sin(PI * 1.1)); ctx.arc(0.42, -0.02, 0.3, PI * 1.1, PI * 1.6); }); break;
      case 'acido': fillCores(ctx, () => P.triInv(ctx), cores); volume(ctx, () => P.triInv(ctx), null, true); linha('rgba(255,255,255,0.65)', 1, () => { ctx.arc(0, -0.15, 0.13, 0, TAU); ctx.moveTo(0.3, -0.45); ctx.arc(0.22, -0.45, 0.08, 0, TAU); ctx.moveTo(-0.14, -0.5); ctx.arc(-0.2, -0.5, 0.06, 0, TAU); }); break;
      case 'carapaca': fillCores(ctx, () => P.trap(ctx), cores); volume(ctx, () => P.trap(ctx)); linha('rgba(0,0,0,0.35)', 1.1, () => { ctx.moveTo(-0.72, -0.22); ctx.quadraticCurveTo(0, -0.1, 0.72, -0.22); ctx.moveTo(-0.88, 0.25); ctx.quadraticCurveTo(0, 0.38, 0.88, 0.25); }); [[-0.35, -0.48], [0.35, -0.48], [-0.6, 0.5], [0.6, 0.5]].forEach(([a, b]) => { ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.beginPath(); ctx.arc(a, b, 0.07, 0, TAU); ctx.fill(); }); break;
      case 'geleia': fillCores(ctx, () => P.est4(ctx), cores); volume(ctx, () => P.est4(ctx), null, true); brilho(ctx, -0.12, -0.25, 0.1, 0.18, 0.6); ctx.fillStyle = '#FFFFFF'; A.star(ctx, 0.55, -0.6, 4, 0.2, 0.06, 0); ctx.fill(); break;
      case 'cola': fillCores(ctx, () => P.anel(ctx), cores, 'evenodd'); volume(ctx, () => P.anel(ctx), 'evenodd'); ctx.fillStyle = cores[1]; ctx.beginPath(); ctx.moveTo(0.18, 0.8); ctx.quadraticCurveTo(0.24, 1.0, 0.28, 1.1); ctx.arc(0.28, 1.14, 0.09, -PI / 2, PI * 1.5); ctx.quadraticCurveTo(0.34, 0.95, 0.38, 0.76); ctx.fill(); break;
      case 'gosma': fillCores(ctx, () => P.est8(ctx), cores); volume(ctx, () => P.est8(ctx)); linha('rgba(255,255,255,0.6)', 1, () => { ctx.arc(-0.15, -0.1, 0.16, 0, TAU); ctx.moveTo(0.33, 0.2); ctx.arc(0.25, 0.2, 0.08, 0, TAU); }); N3(P.est8); break;
      case 'feromonio': fillCores(ctx, () => P.est5(ctx), cores); volume(ctx, () => P.est5(ctx)); ctx.save(); ctx.scale(0.45, 0.45); P.est5(ctx); ctx.restore(); ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.fill(); N3(P.est5); break;
      case 'refugo': { const q = rng(21); for (let i = 0; i < 6; i++) { const a = i / 6 * TAU + 0.4, rr = i ? 0.5 : 0, cx = Math.cos(a) * rr, cy = Math.sin(a) * rr * 0.8; ctx.fillStyle = i % 2 ? c0 : esc(0.25); ctx.beginPath(); for (let j = 0; j < 5; j++) { const b = j / 5 * TAU + q(), rad = 0.22 + q() * 0.14; j ? ctx.lineTo(cx + Math.cos(b) * rad, cy + Math.sin(b) * rad) : ctx.moveTo(cx + Math.cos(b) * rad, cy + Math.sin(b) * rad); } ctx.closePath(); ctx.fill(); } } break;
      case 'ovo': fillCores(ctx, () => P.ovo(ctx), cores); volume(ctx, () => P.ovo(ctx)); brilho(ctx, -0.2, -0.3, 0.12, 0.2, -0.3); break;
      default: ctx.restore(); return false;
    }
    if (cores.length > 1 && kind !== 'cola') { ctx.strokeStyle = 'rgba(0,0,0,0.22)'; ctx.lineWidth = 1 * px; ctx.beginPath(); ctx.moveTo(0, -1); ctx.lineTo(0, 1); ctx.save(); (P[{ pasta: 'amendoim', acido: 'triInv', carapaca: 'trap', geleia: 'est4', gosma: 'est8', feromonio: 'est5' }[kind]] || P.circ)(ctx); ctx.clip(); ctx.beginPath(); ctx.moveTo(0, -1); ctx.lineTo(0, 1); ctx.stroke(); ctx.restore(); }
    ctx.restore(); return true;
  }
  A.itemHook = (ctx, kind, x, y, s, o) => { if (o.gray) return false; const zpx = zpxOf(ctx); if (s * zpx < 9) return false; return itemA(ctx, kind, x, y, s, o, zpx); };

  // =============== CASTAS (sem antenas, silhueta mais marcada) ===============
  // 6 tons por função (D112): coleta fica creme; a tinta é leve (A.TINTA)
  const GRUPO = { operaria: 'coleta', cortadeira: 'coleta', cavadora: 'obra', soldado: 'frente', tanque: 'frente', atiradora: 'apoio', curandeira: 'apoio', explosiva: 'ataque', saqueadora: 'ataque', alada: 'rep', rainha: 'rep' };
  const COR_GRUPO = { coleta: null, obra: '#C98A55', frente: C.def, apoio: '#5CC6A8', ataque: C.atk, rep: C.acu };
  const NOME_GRUPO = { coleta: 'Coleta', obra: 'Obra', frente: 'Linha de frente', apoio: 'Apoio', ataque: 'Ataque', rep: 'Reprodução' };
  function formiga(ctx, casta, x, y, ang, z, o) {
    const spec = A.CASTAS[casta]; if (!spec) return false;
    const lod = LOD(z), grupo = GRUPO[casta], cg = A.corCasta ? A.corCasta(casta) : COR_GRUPO[grupo];
    const col = o.col || (cg ? mix(C.txt, cg, A.TINTA) : C.txt), sc = A.ANT_UNIT * spec.esc * (o.scale || 1);
    if (lod === 'geral') return true;
    if (lod === 'longe') { ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, Math.max(1.1 / z, 3.2 * sc), 0, TAU); ctx.fill(); return true; }
    ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(sc, sc);
    const dashed = o.dashed, paint = () => { if (dashed) { ctx.setLineDash([1.2, 1.2]); ctx.strokeStyle = C.txt2; ctx.lineWidth = 0.7; ctx.stroke(); ctx.setLineDash([]); } else { ctx.fillStyle = col; ctx.fill(); } };
    const sombra = (f) => { if (dashed) return; ctx.save(); f(); ctx.clip(); ctx.fillStyle = 'rgba(0,0,0,0.16)'; ctx.fillRect(-20, 0.4, 40, 10); ctx.restore(); };
    const E1 = (cx, rx, ry) => { ell(ctx, cx, 0, rx, ry); paint(); sombra(() => ell(ctx, cx, 0, rx, ry)); };
    let hx = 6.3;
    const mand = (len, grossa) => { if (dashed) return; ctx.fillStyle = col; [-1, 1].forEach(sd => { ctx.beginPath(); ctx.moveTo(hx - 0.6, sd * 0.9); ctx.quadraticCurveTo(hx + len * 0.7, sd * (1.2 + grossa), hx + len, sd * 0.15); ctx.quadraticCurveTo(hx + len * 0.5, sd * (0.55 + grossa * 0.3), hx - 0.4, sd * 0.25); ctx.closePath(); ctx.fill(); }); };
    if (A.pernasHook && !dashed) A.pernasHook(ctx, casta, col, z, sc, x, y, o);
    switch (casta) {
      case 'operaria': E1(-4.2, 3.4, 2.5); E1(-0.5, 0.8, 0.8); E1(1.5, 1.8, 1.25); E1(4.5, 1.8, 1.6); hx = 6.3; break;
      case 'cortadeira':
        E1(-4.4, 3.4, 2.5); E1(-0.6, 0.8, 0.8); E1(1.7, 2.0, 1.4);
        if (!dashed) { ctx.fillStyle = col; [-1, 1].forEach(sd => { ctx.beginPath(); ctx.moveTo(0.8, sd * 1.0); ctx.lineTo(0.2, sd * 2.4); ctx.lineTo(1.6, sd * 1.2); ctx.closePath(); ctx.fill(); }); }
        E1(5.2, 2.4, 2.2); hx = 7.4; mand(2.6, 0.5); break;
      case 'cavadora':
        E1(-4.0, 3.2, 2.4); E1(-0.5, 0.8, 0.8); E1(1.5, 1.9, 1.4);
        ctx.beginPath(); ctx.roundRect(2.9, -2.4, 4.2, 4.8, 0.9); paint(); sombra(() => { ctx.beginPath(); ctx.roundRect(2.9, -2.4, 4.2, 4.8, 0.9); });
        ctx.beginPath(); ctx.roundRect(7.3, -2.2, 0.9, 4.4, 0.4); paint(); hx = 8.2; break;
      case 'soldado':
        E1(-4.0, 3.0, 2.3); E1(-0.6, 0.8, 0.8); E1(1.4, 1.8, 1.3); E1(5.9, 3.4, 3.1);
        if (!dashed) { ctx.strokeStyle = 'rgba(0,0,0,0.22)'; ctx.lineWidth = 0.4; ctx.beginPath(); ctx.moveTo(4.2, 0); ctx.lineTo(8.6, 0); ctx.stroke(); }
        hx = 9.0; mand(1.6, 0.9); break;
      case 'tanque':
        E1(-4.6, 3.8, 3.4); E1(-0.6, 0.9, 0.9); E1(1.3, 2.4, 2.4);
        ctx.beginPath(); ctx.arc(3.9, 0, 3.7, -PI / 2, PI / 2); ctx.closePath(); paint();
        if (!dashed) { ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.lineWidth = 0.45; ctx.beginPath(); ctx.arc(3.9, 0, 2.9, -PI / 2 + 0.2, PI / 2 - 0.2); ctx.stroke(); }
        hx = 7.6; break;
      case 'atiradora':
        ctx.beginPath(); ctx.moveTo(-11.5, 0); ctx.quadraticCurveTo(-8.2, -3.6, -4.3, -3.0); ctx.ellipse(-4.3, 0, 3.0, 3.0, 0, -PI / 2, PI / 2); ctx.quadraticCurveTo(-8.2, 3.6, -11.5, 0); ctx.closePath(); paint();
        if (!dashed) { ctx.fillStyle = C.acu; ctx.beginPath(); ctx.arc(-12.2, 0, 0.75, 0, TAU); ctx.fill(); }
        E1(-0.5, 0.8, 0.8); E1(1.5, 1.8, 1.2); E1(4.4, 1.7, 1.5); hx = 6.1; break;
      case 'curandeira':
        ell(ctx, -4.3, 0, 3.3, 2.5); ctx.strokeStyle = dashed ? C.txt2 : col; ctx.lineWidth = 1.4; if (dashed) ctx.setLineDash([1.2, 1.2]); ctx.stroke(); ctx.setLineDash([]);
        if (!dashed) { ctx.fillStyle = col; ctx.fillRect(-4.75, -1.3, 0.9, 2.6); ctx.fillRect(-5.6, -0.45, 2.6, 0.9); }
        E1(-0.5, 0.8, 0.8); E1(1.5, 1.8, 1.25); E1(4.5, 1.8, 1.6); hx = 6.3; break;
      case 'explosiva':
        E1(-5.2, 4.8, 4.2);
        if (!dashed) { ell(ctx, -5.2, 0, 5.9, 5.3); ctx.setLineDash([1.1, 1.1]); ctx.strokeStyle = col; ctx.lineWidth = 0.55; ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = 'rgba(0,0,0,0.28)'; [[-6.5, -1.2], [-4.2, 1.6], [-5.6, 2.0]].forEach(([a, b]) => { ctx.beginPath(); ctx.arc(a, b, 0.6, 0, TAU); ctx.fill(); }); }
        E1(-0.2, 0.8, 0.8); E1(1.6, 1.7, 1.2); E1(4.4, 1.7, 1.5); hx = 6.1; break;
      case 'saqueadora':
        E1(-5.8, 4.8, 1.9); if (!dashed) { ctx.strokeStyle = 'rgba(0,0,0,0.3)'; ctx.lineWidth = 0.5; ctx.beginPath(); [-7.4, -5.2].forEach(a => { ctx.moveTo(a, -1.7); ctx.lineTo(a + 0.4, 1.7); }); ctx.stroke(); }
        E1(-0.6, 0.7, 0.7); E1(1.9, 2.6, 1.0); E1(6.0, 2.1, 1.4); hx = 8.1;
        if (!dashed) { ctx.strokeStyle = col; ctx.lineWidth = 0.55; ctx.lineCap = 'round'; ctx.beginPath(); [-1, 1].forEach(sd => { ctx.moveTo(hx - 0.4, sd * 0.6); ctx.lineTo(hx + 2.4, sd * 0.35); }); ctx.stroke(); } break;
      case 'alada':
        if (!dashed) { ctx.globalAlpha = 0.42; ctx.fillStyle = C.txt; [-1, 1].forEach(sd => { ctx.beginPath(); ctx.ellipse(-2.8, sd * 4.0 * (1 - (o.bate || 0) * 0.6), 6.4, 2.1, sd * (0.24 + (o.bate || 0)), 0, TAU); ctx.fill(); }); ctx.globalAlpha = 0.5; ctx.strokeStyle = C.txt; ctx.lineWidth = 0.3; ctx.beginPath(); [-1, 1].forEach(sd => { const b = 1 - (o.bate || 0) * 0.6; ctx.moveTo(1, sd * 1.4); ctx.quadraticCurveTo(-3, sd * 4.4 * b, -8, sd * 5.4 * b); }); ctx.stroke(); ctx.globalAlpha = 1; }
        E1(-4.4, 3.6, 2.6); E1(-0.5, 0.8, 0.8); E1(1.6, 2.4, 1.7); E1(4.7, 1.8, 1.6); hx = 6.5; break;
      case 'rainha':
        if (!dashed) { ctx.globalAlpha = 0.3; ctx.fillStyle = C.txt; [-1, 1].forEach(sd => { ctx.beginPath(); ctx.ellipse(-1.4, sd * 2.6, 2.6, 1.0, sd * 0.4, 0, TAU); ctx.fill(); }); ctx.globalAlpha = 1; }
        E1(-7.4, 7.2, 4.6); if (!dashed) { ctx.strokeStyle = 'rgba(0,0,0,0.2)'; ctx.lineWidth = 0.45; ctx.beginPath(); [-10.5, -8.0, -5.5].forEach(a => { ctx.moveTo(a, -4.0); ctx.quadraticCurveTo(a - 0.9, 0, a, 4.0); }); ctx.stroke(); }
        E1(-0.1, 0.9, 0.9); E1(1.6, 2.4, 1.9); E1(5.1, 2.1, 1.9); hx = 7.2; break;
    }
    if (A.antenasHook && !dashed) A.antenasHook(ctx, casta, col, z, sc, x, y, o);
    ctx.restore();
    if (o.carry && lod !== 'longe') { const d = (hx + 0.4) * sc + 0.07; A.item(ctx, o.carry, x + Math.cos(ang) * d, y + Math.sin(ang) * d, 0.15); }
    if (o.combatIcon && spec.combate && lod === 'perto') A.combatIcon(ctx, spec.combate, x, y - 0.3 * spec.esc, 8 / z);
    return true;
  }
  A.antHook = (ctx, casta, x, y, ang, z, o) => formiga(ctx, casta, x, y, ang, z, o);

  // =============== OFÍCIO NO FUNDO DAS CÂMARAS ===============
  A.propsHook = (ctx, sp, g, st, z, T) => {
    if (LOD(z) === 'longe' || LOD(z) === 'geral') return;
    const fam = sp.fam[0] || C.txt, w = g.x1 - g.x0, floor = g.floor, px = 1 / z, b = C.base;
    const tom = (c, k) => mix(mix(b, fam, 0.13), c, k);
    ctx.save(); A.domePath(ctx, g); ctx.clip(); ctx.lineCap = 'round';
    const roofAt = x => { let best = g.roof[0]; g.roof.forEach(p => { if (Math.abs(p.x - x) < Math.abs(best.x - x)) best = p; }); return best.y; };
    const nichos = (n, y, c) => { for (let i = 0; i < n; i++) { const nx = g.x0 + w * (i + 0.5) / n; ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(nx - 0.16, y + 0.2); ctx.lineTo(nx - 0.16, y); ctx.arc(nx, y, 0.16, PI, 0); ctx.lineTo(nx + 0.16, y + 0.2); ctx.closePath(); ctx.fill(); } };
    switch (sp.id) {
      case 'jardim': case 'cozinha': case 'geleia': {
        ctx.fillStyle = tom(C.veg, 0.28); ctx.beginPath(); ctx.ellipse(g.cx, floor, w * 0.26, 0.3, 0, PI, 0); ctx.fill();
        for (let i = 0; i < 9; i++) { ctx.fillStyle = tom('#EFE7DC', 0.16 + (i % 3) * 0.05); ctx.beginPath(); ctx.arc(g.cx - w * 0.22 + i * w * 0.055, floor - 0.2 - Math.sin(i * 1.7) * 0.06, 0.06, 0, TAU); ctx.fill(); }
        ctx.strokeStyle = tom('#EFE7DC', 0.22); ctx.lineWidth = Math.max(px, 0.012); for (let i = 0; i < 7; i++) { const x = g.x0 + 0.25 + i * (w - 0.5) / 6, y0 = roofAt(x), L = 0.12 + (i % 3) * 0.08; ctx.beginPath(); ctx.moveTo(x, y0); ctx.quadraticCurveTo(x + Math.sin(T + i) * 0.03, y0 + L * 0.6, x, y0 + L); ctx.stroke(); ctx.fillStyle = ctx.strokeStyle; ctx.beginPath(); ctx.arc(x, y0 + L, 0.022, 0, TAU); ctx.fill(); }
        break; }
      case 'destilaria': case 'cola': {
        ctx.fillStyle = tom(C.acu, 0.2); ctx.beginPath(); ctx.ellipse(g.cx, floor, w * 0.2, 0.05, 0, 0, TAU); ctx.fill();
        for (let i = 0; i < 5; i++) { const x = g.x0 + 0.35 + i * (w - 0.7) / 4, y0 = roofAt(x), L = 0.08 + (i % 2) * 0.06; ctx.fillStyle = tom(C.acu, 0.45); ctx.beginPath(); ctx.moveTo(x - 0.035, y0); ctx.lineTo(x, y0 + L); ctx.lineTo(x + 0.035, y0); ctx.fill(); const f = ((T * 0.5 + i * 0.37) % 1); if (i % 2 === 0) { ctx.beginPath(); ctx.arc(x, y0 + L + f * (floor - y0 - L), 0.025, 0, TAU); ctx.fill(); } }
        break; }
      case 'acida': case 'toxica': {
        [-0.28, 0.28].forEach((dx, j) => { const x = g.cx + dx * w * 0.5; ctx.fillStyle = tom('#000000', 0.25); ctx.beginPath(); ctx.ellipse(x, floor - 0.05, 0.17, 0.14, 0, PI, 0); ctx.fill(); ctx.fillStyle = tom(sp.fam[j] || fam, 0.4); ctx.fillRect(x - 0.15, floor - 0.12, 0.3, 0.03);
          ctx.strokeStyle = tom(sp.fam[j] || fam, 0.45); ctx.lineWidth = Math.max(px, 0.012); for (let k = 0; k < 3; k++) { const f = (T * 0.4 + k / 3 + j * 0.2) % 1; ctx.beginPath(); ctx.arc(x + Math.sin(k * 2 + T) * 0.05, floor - 0.15 - f * 0.4, 0.025 + f * 0.02, 0, TAU); ctx.stroke(); } });
        break; }
      case 'presas': case 'carapaca': {
        ctx.strokeStyle = tom(C.ani, 0.2); ctx.lineWidth = 0.05; ctx.beginPath(); ctx.moveTo(g.x0 + 0.5, g.yw + 0.05); ctx.lineTo(g.cx - 0.1, g.yt + 0.25); ctx.lineTo(g.cx + 0.6, g.yw - 0.02); ctx.lineTo(g.x1 - 0.5, g.yw + 0.12); ctx.stroke();
        ctx.fillStyle = tom(C.ani, 0.2); [[g.cx - 0.1, g.yt + 0.25], [g.cx + 0.6, g.yw - 0.02]].forEach(([a, c]) => { ctx.beginPath(); ctx.arc(a, c, 0.05, 0, TAU); ctx.fill(); });
        break; }
      case 'olaria': case 'poco': {
        const ys = [g.yw - 0.04, g.yw + 0.2]; ys.forEach((y, j) => { ctx.fillStyle = tom('#000000', 0.25); ctx.fillRect(g.x0 + 0.2, y, w - 0.4, 0.03); for (let i = 0; i < 6; i++) { ctx.fillStyle = tom(C.min, 0.35 + (i % 2) * 0.1); ctx.fillRect(g.x0 + 0.3 + i * (w - 0.6) / 6 + j * 0.08, y - 0.07, 0.13, 0.07); } });
        break; }
      case 'real': {
        ctx.fillStyle = tom(C.acu, 0.18); ctx.beginPath(); ctx.ellipse(g.cx + 0.15, floor + 0.02, w * 0.36, 0.13, 0, PI, TAU); ctx.fill();
        nichos(4, g.yw - 0.05, tom('#000000', 0.2)); ctx.fillStyle = tom('#EFE7DC', 0.1); for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.ellipse(g.x0 + w * (i + 0.5) / 4, g.yw + 0.03, 0.06, 0.09, 0, 0, TAU); ctx.fill(); }
        ctx.fillStyle = tom(C.acu, 0.3); const cx = g.cx, cy = g.yt + 0.18; ctx.beginPath(); ctx.moveTo(cx - 0.16, cy + 0.06); ctx.lineTo(cx - 0.16, cy - 0.05); ctx.lineTo(cx - 0.08, cy + 0.01); ctx.lineTo(cx, cy - 0.08); ctx.lineTo(cx + 0.08, cy + 0.01); ctx.lineTo(cx + 0.16, cy - 0.05); ctx.lineTo(cx + 0.16, cy + 0.06); ctx.closePath(); ctx.fill();
        break; }
      case 'bercario': {
        for (let i = 0; i < 3; i++) { ctx.fillStyle = tom('#000000', 0.2); ctx.beginPath(); ctx.ellipse(g.x0 + 0.45 + i * 0.55, floor, 0.24, 0.08, 0, PI, TAU); ctx.fill(); }
        ctx.strokeStyle = tom(C.veg, 0.3); ctx.lineWidth = Math.max(px, 0.014); for (let i = 0; i < 6; i++) { const x = g.x0 + 0.3 + i * (w - 0.6) / 5, y0 = roofAt(x); ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y0 + 0.1 + (i % 2) * 0.05); ctx.stroke(); }
        break; }
      case 'nupcial': {
        const gr = ctx.createLinearGradient(0, g.yt, 0, floor); gr.addColorStop(0, 'rgba(255,240,200,0.12)'); gr.addColorStop(1, 'rgba(255,240,200,0)'); ctx.fillStyle = gr; ctx.beginPath(); ctx.moveTo(g.cx - 0.15, g.yt); ctx.lineTo(g.cx + 0.15, g.yt); ctx.lineTo(g.cx + 0.6, floor); ctx.lineTo(g.cx - 0.6, floor); ctx.fill();
        break; }
      case 'posto': case 'torre': case 'armadilha': case 'mina': {
        const dx = g.porta === 'R' ? 1 : -1, x = g.porta === 'R' ? g.x1 - 0.1 : g.x0 + 0.1;
        ctx.strokeStyle = tom('#000000', 0.32); ctx.lineWidth = 0.035; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(x - dx * (0.12 + i * 0.08), floor); ctx.lineTo(x - dx * (0.04 + i * 0.08), floor - 0.2 - i * 0.03); ctx.stroke(); }
        ctx.fillStyle = tom(C.def, 0.3); [g.cx - 0.3, g.cx + 0.3].forEach(sx => { const sy = g.yw - 0.08; ctx.beginPath(); ctx.moveTo(sx - 0.08, sy - 0.08); ctx.lineTo(sx + 0.08, sy - 0.08); ctx.lineTo(sx + 0.07, sy + 0.02); ctx.lineTo(sx, sy + 0.1); ctx.lineTo(sx - 0.07, sy + 0.02); ctx.closePath(); ctx.fill(); });
        break; }
      case 'guerra': {
        for (let i = 0; i < 3; i++) { const x = g.x0 + 0.4 + i * 0.45, y0 = roofAt(x); ctx.fillStyle = tom(C.atk, 0.4); ctx.beginPath(); ctx.moveTo(x - 0.08, y0); ctx.lineTo(x + 0.08, y0); ctx.lineTo(x, y0 + 0.22 + Math.sin(T * 2 + i) * 0.01); ctx.fill(); }
        break; }
      case 'deposito': {
        nichos(5, g.yw - 0.12, tom('#000000', 0.2)); nichos(5, g.yt + 0.32, tom('#000000', 0.16));
        break; }
      case 'lixeira': {
        const q = rng(8); for (let i = 0; i < 6; i++) { ctx.fillStyle = tom('#000000', 0.15 + q() * 0.1); ctx.beginPath(); ctx.ellipse(g.x0 + q() * w, g.yw + q() * (floor - g.yw), 0.1 + q() * 0.12, 0.05 + q() * 0.06, q(), 0, TAU); ctx.fill(); }
        ctx.fillStyle = tom('#EFE7DC', 0.3); for (let i = 0; i < 3; i++) { const a = T * 2 + i * 2.1; ctx.beginPath(); ctx.arc(g.cx + Math.cos(a) * 0.25, g.yw - 0.05 + Math.sin(a * 1.3) * 0.08, 0.018, 0, TAU); ctx.fill(); }
        break; }
      default: {
        ctx.strokeStyle = tom('#000000', 0.28); ctx.lineWidth = 0.03; for (let i = 0; i < 5; i++) { const x = g.x0 + 0.2 + i * (w - 0.4) / 4, y0 = roofAt(x); ctx.beginPath(); ctx.moveTo(x, y0); ctx.quadraticCurveTo(x + 0.05, y0 + 0.08, x - 0.02, y0 + 0.16); ctx.stroke(); }
      }
    }
    ctx.restore();
  };

  // =============== ÍCONES ===============
  const ICS = {
    carregar: { nome: 'Carregar', f: c => { const seta = (x, up) => { const s = up ? -1 : 1; c.moveTo(x - 0.11, -s * 0.75); c.lineTo(x - 0.11, s * 0.2); c.lineTo(x - 0.34, s * 0.2); c.lineTo(x, s * 0.82); c.lineTo(x + 0.34, s * 0.2); c.lineTo(x + 0.11, s * 0.2); c.lineTo(x + 0.11, -s * 0.75); c.closePath(); }; seta(-0.42, true); seta(0.42, false); } },
    escavar: { nome: 'Escavar', f: c => { c.save(); c.rotate(-0.7); c.rect(-0.08, -0.95, 0.16, 0.95); c.moveTo(-0.3, -1.0); c.rect(-0.3, -1.05, 0.6, 0.16); c.moveTo(-0.36, 0.02); c.lineTo(0.36, 0.02); c.lineTo(0.36, 0.48); c.quadraticCurveTo(0.2, 0.85, 0, 0.98); c.quadraticCurveTo(-0.2, 0.85, -0.36, 0.48); c.closePath(); c.restore(); } },
    cuidar: { nome: 'Cuidar', f: c => { c.moveTo(0, 0.8); c.bezierCurveTo(-1.15, 0, -0.65, -0.98, 0, -0.38); c.bezierCurveTo(0.65, -0.98, 1.15, 0, 0, 0.8); c.closePath(); } },
    guardar: { nome: 'Guardar', f: c => { c.moveTo(0, -0.9); c.lineTo(0.76, -0.6); c.lineTo(0.7, 0.08); c.quadraticCurveTo(0.52, 0.66, 0, 0.94); c.quadraticCurveTo(-0.52, 0.66, -0.7, 0.08); c.lineTo(-0.76, -0.6); c.closePath(); } },
    reserva: { nome: 'Reserva', f: c => { const R = 0.82, cx = 0.36, cy = -0.26, r2 = 0.66, d = Math.hypot(cx, cy), a = (R * R - r2 * r2 + d * d) / (2 * d), h = Math.sqrt(R * R - a * a), bx = cx * a / d, by = cy * a / d, p1 = [bx + h * cy / d, by - h * cx / d], p2 = [bx - h * cy / d, by + h * cx / d];
      const t1 = Math.atan2(p1[1], p1[0]), t2 = Math.atan2(p2[1], p2[0]), u1 = Math.atan2(p1[1] - cy, p1[0] - cx), u2 = Math.atan2(p2[1] - cy, p2[0] - cx); c.moveTo(p1[0], p1[1]); c.arc(0, 0, R, t1, t2, true); c.arc(cx, cy, r2, u2, u1, false); c.closePath(); } },
    construir: { nome: 'Construir', f: c => { c.moveTo(-0.88, 0.72); c.lineTo(-0.88, 0.05); c.arc(0, 0.05, 0.88, PI, 0); c.lineTo(0.88, 0.72); c.closePath(); const p = [[-0.1, -0.42], [0.1, -0.42], [0.1, -0.03], [0.42, -0.03], [0.42, 0.17], [0.1, 0.17], [0.1, 0.52], [-0.1, 0.52], [-0.1, 0.17], [-0.42, 0.17], [-0.42, -0.03], [-0.1, -0.03]]; p.forEach(([a, b], i) => i ? c.lineTo(a, b) : c.moveTo(a, b)); c.closePath(); }, rule: 'evenodd' },
    expedicao: { nome: 'Expedição', f: c => { c.rect(-0.7, -0.92, 0.15, 1.82); c.moveTo(-0.55, -0.86); c.quadraticCurveTo(-0.05, -1.05, 0.2, -0.8); c.quadraticCurveTo(0.5, -0.56, 0.86, -0.72); c.lineTo(0.86, 0.06); c.quadraticCurveTo(0.5, 0.22, 0.2, -0.02); c.quadraticCurveTo(-0.05, -0.25, -0.55, -0.08); c.closePath(); } },
    menu: { nome: 'Menu', f: c => [-0.55, 0, 0.55].forEach(y => { c.moveTo(-0.78 + 0.1, y - 0.11); c.roundRect(-0.78, y - 0.11, 1.56, 0.22, 0.11); }) },
    pausa: { nome: 'Pausa', f: c => { c.roundRect(-0.58, -0.72, 0.4, 1.44, 0.12); c.moveTo(0.18, -0.6); c.roundRect(0.18, -0.72, 0.4, 1.44, 0.12); } },
    rainha: { nome: 'Rainha', f: c => { c.moveTo(-0.88, 0.62); c.lineTo(-0.88, -0.46); c.lineTo(-0.44, -0.04); c.lineTo(0, -0.74); c.lineTo(0.44, -0.04); c.lineTo(0.88, -0.46); c.lineTo(0.88, 0.62); c.closePath(); } },
    aladas: { nome: 'Aladas', f: c => [-1, 1].forEach(s => { c.moveTo(s * 0.06, 0.5); c.bezierCurveTo(s * 0.35, -0.6, s * 1.02, -0.7, s * 0.98, -0.2); c.bezierCurveTo(s * 0.95, 0.25, s * 0.45, 0.52, s * 0.06, 0.5); c.closePath(); }) },
    populacao: { nome: 'População', f: c => { [-1, 1].forEach(sd => [[-0.3, -0.52], [-0.18, -0.2], [-0.06, 0.16]].forEach(([y0, y1]) => { const x0 = sd * 0.12, x1 = sd * 0.64, n = 0.045; c.moveTo(x0, y0 - n); c.lineTo(x1, y1 - n); c.lineTo(x1, y1 + n); c.lineTo(x0, y0 + n); c.closePath(); })); c.ellipse(0, -0.64, 0.25, 0.23, 0, 0, TAU); c.moveTo(0.21, -0.18); c.ellipse(0, -0.18, 0.21, 0.24, 0, 0, TAU); c.moveTo(0.38, 0.46); c.ellipse(0, 0.46, 0.38, 0.44, 0, 0, TAU); } },
    onda: { nome: 'Onda prevista', cor: C.perigo, f: c => { c.moveTo(0, -0.9); c.lineTo(0.95, 0.76); c.lineTo(-0.95, 0.76); c.closePath(); c.moveTo(-0.08, -0.32); c.rect(-0.09, -0.32, 0.18, 0.62); c.moveTo(0.1, 0.5); c.arc(0, 0.5, 0.1, 0, TAU); }, rule: 'evenodd' },
    play: { nome: 'Continuar', f: c => { c.moveTo(-0.5, -0.8); c.quadraticCurveTo(-0.55, -0.9, -0.38, -0.84); c.lineTo(0.82, -0.1); c.quadraticCurveTo(0.95, 0, 0.82, 0.1); c.lineTo(-0.38, 0.84); c.quadraticCurveTo(-0.55, 0.9, -0.5, 0.8); c.closePath(); } },
    voo: { nome: 'Voo nupcial', f: c => A.star(c, 0, 0.05, 5, 0.95, 0.42, -PI / 2) },
    estrela: { nome: 'Estrela', cor: C.acu, f: c => A.star(c, 0, 0.05, 5, 0.95, 0.42, -PI / 2) },
    relogio: { nome: 'Relógio do ano', rule: 'evenodd', f: c => { c.arc(0, 0, 0.9, 0, TAU); const p = [[-0.09, -0.62], [0.09, -0.62], [0.09, -0.06], [0.47, 0.16], [0.38, 0.32], [-0.09, 0.06]]; p.forEach(([a, b], i) => i ? c.lineTo(a, b) : c.moveTo(a, b)); c.closePath(); } },
    estoque: { nome: 'Estoques', f: c => { [[-0.44, 0.36], [0.44, 0.36], [0, -0.4]].forEach(([a, b]) => { c.moveTo(a + 0.38, b); c.arc(a, b, 0.38, 0, TAU); }); } },
    arvore: { nome: 'Árvore de criação', f: c => { [[0, -0.6], [-0.58, 0.55], [0.58, 0.55]].forEach(([a, b]) => { c.moveTo(a + 0.28, b); c.arc(a, b, 0.28, 0, TAU); }); [[-1], [1]].forEach(([sd]) => { c.moveTo(-0.07 * sd, -0.45); c.lineTo(0.07 * sd, -0.45); c.lineTo(sd * 0.62, 0.38); c.lineTo(sd * 0.45, 0.45); c.closePath(); }); } },
    demolir: { nome: 'Demolir', rule: 'evenodd', f: c => { c.roundRect(-0.78, -0.66, 1.56, 0.2, 0.06); c.moveTo(-0.24, -0.62); c.roundRect(-0.24, -0.88, 0.48, 0.22, 0.08); c.moveTo(-0.6, -0.36); c.lineTo(0.6, -0.36); c.lineTo(0.48, 0.86); c.quadraticCurveTo(0.46, 0.92, 0.38, 0.92); c.lineTo(-0.38, 0.92); c.quadraticCurveTo(-0.46, 0.92, -0.48, 0.86); c.closePath(); [-0.22, 0.1].forEach(x => { c.moveTo(x, -0.16); c.rect(x, -0.16, 0.12, 0.86); }); } },
    melhorar: { nome: 'Melhorar (nível 2)', f: c => [-0.3, 0.42].forEach(y => { c.moveTo(-0.8, y + 0.26); c.lineTo(0, y - 0.5); c.lineTo(0.8, y + 0.26); c.lineTo(0.8, y + 0.56); c.lineTo(0, y - 0.2); c.lineTo(-0.8, y + 0.56); c.closePath(); }) },
    sentido: { nome: 'Sentido do túnel', f: c => { const seta = (y, sd) => { c.moveTo(-0.85 * sd, y - 0.1); c.lineTo(0.3 * sd, y - 0.1); c.lineTo(0.3 * sd, y - 0.34); c.lineTo(0.88 * sd, y); c.lineTo(0.3 * sd, y + 0.34); c.lineTo(0.3 * sd, y + 0.1); c.lineTo(-0.85 * sd, y + 0.1); c.closePath(); }; seta(-0.4, 1); seta(0.4, -1); } },
    fechar: { nome: 'Fechar', f: c => { c.save(); c.rotate(PI / 4); c.roundRect(-0.9, -0.13, 1.8, 0.26, 0.13); c.roundRect(-0.13, -0.9, 0.26, 1.8, 0.13); c.restore(); } },
    voltar: { nome: 'Voltar', f: c => { c.moveTo(0.3, -0.88); c.lineTo(0.56, -0.64); c.lineTo(-0.02, 0); c.lineTo(0.56, 0.64); c.lineTo(0.3, 0.88); c.lineTo(-0.5, 0.12); c.quadraticCurveTo(-0.62, 0, -0.5, -0.12); c.closePath(); } },
    ir: { nome: 'Ir até lá', f: c => { c.moveTo(-0.3, -0.88); c.lineTo(-0.56, -0.64); c.lineTo(0.02, 0); c.lineTo(-0.56, 0.64); c.lineTo(-0.3, 0.88); c.lineTo(0.5, 0.12); c.quadraticCurveTo(0.62, 0, 0.5, -0.12); c.closePath(); } },
    config: { nome: 'Configurações', rule: 'evenodd', f: c => { const n = 8; for (let i = 0; i < n * 4; i++) { const a = i / (n * 4) * TAU - 0.1, r = (i % 4 < 2) ? 0.95 : 0.7; i ? c.lineTo(Math.cos(a) * r, Math.sin(a) * r) : c.moveTo(Math.cos(a) * r, Math.sin(a) * r); } c.closePath(); c.moveTo(0.32, 0); c.arc(0, 0, 0.32, 0, TAU); } },
  };
  const iconeBase = A.icone;
  function icone(ctx, k, x, y, s, col) {
    const ic = ICS[k]; if (!ic) return iconeBase(ctx, k, x, y, s, col);
    ctx.save(); ctx.translate(x, y); ctx.scale(s / 2, s / 2); ctx.beginPath(); ic.f(ctx);
    ctx.fillStyle = ic.cor || col || C.txt; ctx.fill(ic.rule || 'nonzero'); ctx.restore();
  }


  // =============== PERNAS E ANTENAS (D113) ===============
  // Só no zoom perto. As pernas mexem em tripé quando a formiga anda e param quando ela trabalha (quem recebe "nod").
  // As antenas são finas, mais escuras que o corpo e abrem em V, para não parecerem a mandíbula da cortadeira.
  const TORAX = { operaria: 1.5, cortadeira: 1.7, cavadora: 1.5, soldado: 1.4, tanque: 1.3, atiradora: 1.5, curandeira: 1.5, explosiva: 1.6, saqueadora: 1.9, alada: 1.6, rainha: 1.6 };
  const PERNA = { tanque: 1.15, soldado: 1.05, rainha: 1.2, saqueadora: 1.1 };
  const CABECA = { operaria: [5.3, 0.9], cortadeira: [6.3, 1.3], cavadora: [6.6, 1.7], soldado: [7.6, 1.6], tanque: [5.8, 1.6], atiradora: [5.2, 0.9], curandeira: [5.3, 0.9], explosiva: [5.2, 0.9], saqueadora: [7.0, 0.9], alada: [5.5, 0.9], rainha: [6.0, 1.1] };
  A.pernasHook = (ctx, casta, col, z, sc, x, y, o) => {
    if (LOD(z) !== 'perto') return;
    const zs = z * sc, tx = TORAX[casta] || 1.5, L = 3.6 * (PERNA[casta] || 1), anda = !('nod' in o) && !o.dashed, fase = (A.TEMPO || 0) * 13 + x * 9 + y * 5;
    ctx.strokeStyle = mix(col, C.base, 0.3); ctx.lineWidth = Math.max(1 / zs, 0.42); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath();
    // [ponto no tórax, ângulo da coxa, dobra da canela]: frente, meio, trás
    [[0.7, 0.85, -0.45], [0, 1.6, 0.05], [-0.7, 2.35, 0.5]].forEach(([dx, a, dobra], i) => [-1, 1].forEach(sd => {
      const grupo = (i % 2 === 0) === (sd > 0), sw = anda ? Math.sin(fase + (grupo ? 0 : PI)) * 0.28 : 0;
      const a1 = a + sw, bx = tx + dx, by = sd * 0.55, kx = bx + Math.cos(a1) * L * 0.45, ky = by + sd * Math.sin(a1) * L * 0.45;
      const a2 = a1 + dobra, fx = kx + Math.cos(a2) * L * 0.62, fy = ky + sd * Math.sin(a2) * L * 0.62;
      ctx.moveTo(bx, by); ctx.lineTo(kx, ky); ctx.lineTo(fx, fy);
    }));
    ctx.stroke();
  };
  A.antenasHook = (ctx, casta, col, z, sc, x, y, o) => {
    if (LOD(z) !== 'perto') return;
    const zs = z * sc, [bx, by] = CABECA[casta] || [5.3, 0.9], t = (A.TEMPO || 0) * 3 + x * 4, cor = mix(col, C.base, 0.4);
    ctx.strokeStyle = cor; ctx.fillStyle = cor; ctx.lineWidth = Math.max(1 / zs, 0.36); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    [-1, 1].forEach(sd => {
      const w = Math.sin(t + sd) * 0.18, ex = bx + 0.9, ey = sd * (by + 1.5), a2 = 0.45 + w, px = ex + Math.cos(a2) * 2.6, py = ey + sd * Math.sin(a2) * 2.6;
      ctx.beginPath(); ctx.moveTo(bx, sd * by); ctx.lineTo(ex, ey); ctx.lineTo(px, py); ctx.stroke();
      ctx.beginPath(); ctx.arc(px, py, Math.max(0.8 / zs, 0.34), 0, TAU); ctx.fill();
    });
  };

  // =============== CICLO DE PRODUÇÃO: PAUSA E SALTO DO ITEM (D113) ===============
  // Cada item leva A.CICLO s (no protótipo; no jogo vem da receita). Depois a barra fica cheia e acende por A.PAUSA s,
  // as formigas param, e o item recém-feito pula como moedinha até acima do teto da câmara.
  const DUR_SALTO = 0.9, easeOut = t => 1 - (1 - t) * (1 - t);
  const faseCiclo = (T, g) => { const p = A.CICLO + A.PAUSA; return ((T + g.x0 * 0.73) % p + p) % p; };
  A.cicloHook = (T, sp, g) => {
    const u = faseCiclo(T, g); if (u < A.CICLO) return { k: u / A.CICLO };
    const q = (u - A.CICLO) / A.PAUSA; return { k: 1, pausa: true, brilho: 0.55 * (1 - q * 0.6) };
  };
  function salto(ctx, sp, g, z, T) {
    const lod = LOD(z); if (!sp.out || lod === 'geral' || lod === 'longe') return;
    const u = faseCiclo(T, g); if (u < A.CICLO || u > A.CICLO + DUR_SALTO) return;
    const t = (u - A.CICLO) / DUR_SALTO, px = 1 / z, s = Math.max(0.27, 12 * px), x0 = g.cx, y0 = g.floor - 0.25;
    const sobe = easeOut(Math.min(1, t / 0.5)), y = y0 + (g.yt - Math.max(0.25, 12 * px) - y0) * sobe, alfa = t < 0.6 ? 1 : 1 - (t - 0.6) / 0.4;
    ctx.save(); ctx.globalAlpha = alfa; ctx.translate(x0, y); ctx.scale(Math.max(0.15, Math.abs(Math.cos(t * PI * 3))), 1); A.item(ctx, sp.out, 0, 0, s); ctx.restore();
    if (t > 0.45 && t < 0.85) { const k = (t - 0.45) / 0.4; ctx.save(); ctx.globalAlpha = 1 - k; ctx.strokeStyle = '#FFF6E0'; ctx.lineWidth = Math.max(1.5 * px, 0.02); ctx.lineCap = 'round'; ctx.beginPath(); for (let i = 0; i < 4; i++) { const a = i * PI / 2 + PI / 4, r0 = s * (0.6 + k * 0.3), r1 = s * (0.9 + k * 0.5); ctx.moveTo(x0 + Math.cos(a) * r0, y + Math.sin(a) * r0); ctx.lineTo(x0 + Math.cos(a) * r1, y + Math.sin(a) * r1); } ctx.stroke(); ctx.restore(); }
  }
  A.posHook = (ctx, sp, g, st, z, T) => { if (st === 'produzindo' && (sp.cat === 'prod' || sp.cat === 'ext')) salto(ctx, sp, g, z, T); };


  // =============== ENCAIXE DO TÚNEL NA PORTA (D114) ===============
  // O túnel chega reto na porta: no nível do chão nas portas de lado e de cima nas de teto.
  // Na abertura a cor do túnel entra na câmara em degradê, o chão continua um pouco para fora,
  // e um batente de terra batida (lintel e soleira; dois postes no teto) marca a porta.
  function caminhoPorta(src, g, lvl) {
    const w = Math.max(A.LARG[lvl] || 0.25, 0.1); let pre, fim, c;
    if (g.porta === 'T') { pre = { x: g.cx, y: g.yt - 0.5 }; fim = { x: g.cx, y: g.yt + 0.3 }; c = { x: g.cx, y: pre.y - 0.9 }; }
    else { const dy = g.floor - w / 2 + 0.005, sd = g.porta === 'R' ? 1 : -1, wx = sd > 0 ? g.x1 : g.x0; pre = { x: wx + sd * 0.55, y: dy }; fim = { x: wx - sd * 0.3, y: dy }; c = { x: pre.x + sd * 0.9, y: dy }; }
    const pts = [];
    for (let i = 0; i <= 16; i++) { const t = i / 16, u = 1 - t; pts.push({ x: u * u * src.x + 2 * u * t * c.x + t * t * pre.x, y: u * u * src.y + 2 * u * t * c.y + t * t * pre.y }); }
    for (let i = 1; i <= 6; i++) { const t = i / 6; pts.push({ x: pre.x + (fim.x - pre.x) * t, y: pre.y + (fim.y - pre.y) * t }); }
    const cum = [0]; for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
    return { pts, cum, len: cum[cum.length - 1] };
  }
  function dentroCupula(g, x, y) {
    if (x < g.x0 || x > g.x1 || y > g.yb) return false; if (y >= g.yw) return true;
    for (let i = 1; i < g.roof.length; i++) { const a = g.roof[i - 1], b = g.roof[i]; if ((x - a.x) * (x - b.x) <= 0) { const t = (x - a.x) / ((b.x - a.x) || 1); return y >= a.y + (b.y - a.y) * t; } }
    return false;
  }
  const sParede = (p, g) => { for (let s = 0; s <= p.len; s += 0.02) { const q = A.at(p, s); if (dentroCupula(g, q.x, q.y)) return s; } return p.len; };
  const rgbaDe = (hex, a) => { const n = parseInt(hex.slice(1), 16); return 'rgba(' + (n >> 16) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')'; };
  function corteCaminho(p, s) { const pts = [], cum = []; for (let i = 0; i < p.pts.length && p.cum[i] < s; i++) { pts.push(p.pts[i]); cum.push(p.cum[i]); } const e = A.at(p, s); pts.push({ x: e.x, y: e.y }); cum.push(s); return { pts, cum, len: s }; }
  // desenha a abertura por cima da câmara; devolve a distância em que o túnel cruza a parede
  function encaixe(ctx, p, g, lvl, z) {
    const px = 1 / z, w = Math.max(A.LARG[lvl] || 0.25, 2 / z), sw = sParede(p, g), lado = g.porta !== 'T', a0 = Math.max(0, sw - 0.9);
    const qA = A.at(p, sw - 0.35), qB = A.at(p, p.len), grad = ctx.createLinearGradient(qA.x, qA.y, qB.x, qB.y);
    grad.addColorStop(0, C.base); grad.addColorStop(0.45, C.base); grad.addColorStop(1, rgbaDe(C.base, 0));
    ctx.beginPath(); const Ls = [], Rs = [];
    for (let s = a0; s <= p.len + 1e-6; s += 0.03) { const q = A.at(p, Math.min(s, p.len)), nx = -Math.sin(q.ang), ny = Math.cos(q.ang); Ls.push([q.x + nx * w / 2, q.y + ny * w / 2]); Rs.push([q.x - nx * w / 2, q.y - ny * w / 2]); }
    Ls.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); for (let i = Rs.length - 1; i >= 0; i--) ctx.lineTo(Rs[i][0], Rs[i][1]); ctx.closePath(); ctx.fillStyle = grad; ctx.fill();
    { const FH = A.faixaTunelHook; if (FH) FH(ctx, p, w, z, 'livre', 'porta', a0, sw); } // a faixa do túnel continua até a parede
    if (LOD(z) === 'geral') return sw;
    const sd = g.porta === 'R' ? 1 : -1, wx = sd > 0 ? g.x1 : g.x0, piso = mix(C.base, '#000000', 0.25);
    if (lado) { const fg = ctx.createLinearGradient(wx, 0, wx + sd * 0.55, 0); fg.addColorStop(0, piso); fg.addColorStop(1, rgbaDe(piso, 0)); ctx.fillStyle = fg; ctx.fillRect(Math.min(wx, wx + sd * 0.55), g.yb - 0.035, 0.55, 0.035); }
    if (A.semBatente) return sw; // rodada 15b: a faixa de terra batida contínua faz o papel do batente
    if (A.batenteHook) { A.batenteHook(ctx, p, g, sw, w, z); return sw; } // rodada 15c: outra forma de batente
    const q = A.at(p, sw), nx = -Math.sin(q.ang), ny = Math.cos(q.ang), tx = Math.cos(q.ang), ty = Math.sin(q.ang), e = Math.max(0.09, 3 * px), L = 0.22;
    const BAT = mix(C.base, SOLO.topo, 0.42), LUZ = mix(SOLO.topo, '#FFFFFF', 0.18); ctx.lineCap = 'round';
    [-1, 1].forEach(k => {
      if (lado && ((g.porta === 'R' ? -k : k) > 0)) return; // na porta de lado, o lado do chão vira soleira
      const off = w / 2 + e / 2, o2 = off + e * 0.42;
      ctx.strokeStyle = BAT; ctx.lineWidth = e; ctx.beginPath(); ctx.moveTo(q.x + nx * k * off - tx * L, q.y + ny * k * off - ty * L); ctx.lineTo(q.x + nx * k * off + tx * L * 0.45, q.y + ny * k * off + ty * L * 0.45); ctx.stroke();
      ctx.strokeStyle = LUZ; ctx.lineWidth = Math.max(1 * px, e * 0.2); ctx.beginPath(); ctx.moveTo(q.x + nx * k * o2 - tx * L, q.y + ny * k * o2 - ty * L); ctx.lineTo(q.x + nx * k * o2 + tx * L * 0.45, q.y + ny * k * o2 + ty * L * 0.45); ctx.stroke();
    });
    if (lado) { ctx.fillStyle = BAT; ctx.beginPath(); ctx.roundRect(Math.min(wx - sd * 0.24, wx + sd * 0.12), g.yb - 0.02, 0.36, Math.max(0.06, 2 * px), 0.02); ctx.fill(); }
    return sw;
  }
  // túnel + câmara + abertura, na ordem certa. o: { T, tags, seed, est, formigas, dir, fila }
  function ligacao(ctx, sp, gx, gy, src, lvl, z, o = {}) {
    const g = A.geom(sp, gx, gy, o.seed), p = caminhoPorta(src, g, lvl), T = o.T || 0;
    A.tunel(ctx, p, lvl, o.st || 'livre', z, { T });
    A.estrutura(ctx, sp, gx, gy, o.est || 'produzindo', z, { T, tags: o.tags, seed: o.seed });
    const sw = encaixe(ctx, p, g, lvl, z);
    // formigas e setas por cima da abertura, para não sumirem na parede; a fila espera do lado de fora
    const carga = A.cargaHook && A.cargaHook(ctx, sp, g, p, o.est || 'produzindo', z, T); // carregadoras entrando (D115)
    if (!carga) A.tunel(ctx, p, lvl, 'livre', z, { T, cor: 'rgba(0,0,0,0)', formigas: o.formigas, dir: o.dir });
    if (o.fila) A.tunel(ctx, corteCaminho(p, sw - 0.05), lvl, 'livre', z, { T, cor: 'rgba(0,0,0,0)', fila: o.fila, tags: o.tags });
    return { g, p };
  }
  // pedaço de túnel na porta das câmaras do catálogo
  A.stubHook = (ctx, g, z, fase, sp, st, T) => {
    const w = A.LARG[1], src = g.porta === 'T' ? { x: g.cx, y: g.yt - 0.95 } : { x: (g.porta === 'R' ? g.x1 + 0.95 : g.x0 - 0.95), y: g.floor - w / 2 + 0.005 }, p = caminhoPorta(src, g, 1);
    if (fase === 'antes') A.tunel(ctx, p, 1, 'livre', z, {}); else { encaixe(ctx, p, g, 1, z); if (A.cargaHook) A.cargaHook(ctx, sp, g, p, st, z, T || 0); }
  };


  // =============== FORMIGAS DENTRO DAS CÂMARAS (D115) ===============
  // Cada formiga segue um roteiro (anda, pega, trabalha, espera) preso ao ciclo da câmara (D113).
  // Produção: cada formiga do posto faz a receita inteira (vai e volta) e o ingrediente vira produto no posto;
  // farelos só no zoom perto. As carregadoras entram pela porta, passam na frente das pilhas, deixam o
  // ingrediente e, quando há pedido, levam o produto. Câmara parada: as formigas esperam pelo que falta.
  // Base: rainha respira e põe ovo, cuidadoras alimentam as larvas, a carregadora do depósito desce pela
  // parede da cúpula, um soldado do posto vai olhar a porta. Só nos zooms perto e médio.
  (() => {
    const ITEM = 0.27, GAP = 0.03, VEL = 1.2, PEGA = 0.2, VIRA = 0.16;
    const per = () => A.CICLO + A.PAUSA, tempo = (T, g) => T + g.x0 * 0.73, mod = (t, p) => ((t % p) + p) % p;
    const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v)), suave = k => k * k * (3 - 2 * k), lado = d => d > 0 ? 0 : PI;
    const perto = z => LOD(z) === 'perto', ativo = z => LOD(z) === 'perto' || LOD(z) === 'medio';
    const cache = new Map(), memo = (k, f) => { if (!cache.has(k)) cache.set(k, f()); return cache.get(k); };
    const chaveDe = (sp, g) => sp.id + '|' + g.x0.toFixed(2) + '|' + g.y.toFixed(2) + '|' + g.porta;

    // ---------- roteiros ----------
    function rota(x, y, ang, vel) {
      const r = { x, y, ang, a0: ang, t: 0, L: [], ev: [], vel: vel || VEL };
      r.anda = (x2, c, y2) => {
        if (y2 == null) y2 = r.y; const d = Math.hypot(x2 - r.x, y2 - r.y); if (d < 1e-4) return r;
        const a = Math.atan2(y2 - r.y, x2 - r.x); r.L.push({ t0: r.t, d: d / r.vel, x0: r.x, y0: r.y, x1: x2, y1: y2, c, p: 'anda', a });
        r.t += d / r.vel; r.x = x2; r.y = y2; r.ang = a; return r;
      };
      r.segue = (pts, c) => { pts.forEach(q => r.anda(q.x, c, q.y)); return r; };
      r.para = (d, p, c, olha) => { const a = olha != null ? olha : r.ang; r.L.push({ t0: r.t, d, x0: r.x, y0: r.y, x1: r.x, y1: r.y, c, p, a }); r.t += d; r.ang = a; return r; };
      r.ate = (t, p, c, olha) => r.para(Math.max(0, t - r.t), p, c, olha);
      r.marca = (chave, sinal) => { r.ev.push({ t: r.t, chave, sinal }); return r; };
      return r;
    }
    const angLerp = (a, b, k) => a + (mod(b - a + PI, TAU) - PI) * k;
    function onde(r, t) {
      if (!r.L.length) return { x: r.x, y: r.y, ang: r.a0, p: 'espera' };
      let i = 0; while (i < r.L.length - 1 && t >= r.L[i].t0 + r.L[i].d) i++;
      const s = r.L[i], k = s.d > 0 ? clamp((t - s.t0) / s.d) : 1, a0 = i > 0 ? r.L[i - 1].a : r.a0;
      const q = { x: s.x0 + (s.x1 - s.x0) * k, y: s.y0 + (s.y1 - s.y0) * k, c: s.c, p: s.p };
      // meia-volta no chão: a formiga vira "de lado", como a moedinha, em vez de girar pela vertical
      if (Math.abs(mod(s.a - a0 + PI, TAU) - PI) > 2.2 && Math.abs(Math.sin(s.a)) < 0.5) { const kv = clamp((t - s.t0) / (VIRA * 1.4)); q.ang = kv < 0.5 ? a0 : s.a; q.flip = Math.max(0.12, Math.abs(Math.cos(kv * PI))); }
      else q.ang = angLerp(a0, s.a, clamp((t - s.t0) / VIRA));
      return q;
    }
    function desenha(ctx, casta, q, z, T, extra) {
      const o = Object.assign({}, extra); if (q.c) o.carry = q.c;
      if (q.p === 'trabalha') o.nod = Math.sin(T * 7) * 0.8; else if (q.p === 'pega') o.nod = 0.7; else if (q.p !== 'anda') o.nod = 0;
      if (q.flip && q.flip < 0.999) { ctx.save(); ctx.translate(q.x, q.y); ctx.scale(q.flip, 1); ctx.translate(-q.x, -q.y); A.ant(ctx, casta, q.x, q.y, q.ang, z, o); ctx.restore(); }
      else A.ant(ctx, casta, q.x, q.y, q.ang, z, o);
    }
    // itens numa pilha a partir de eventos que se repetem, cada um com seu período
    const conta = (evs, t) => { let s = 0; for (const e of evs) s += e.sinal * (Math.floor((t - e.t) / e.per) + 1); return s; };
    const minimos = new Map();
    function contaNorm(chave, evs, t, base) {
      if (!evs.length) return base;
      if (!minimos.has(chave)) { let m = Infinity; const P = Math.max(...evs.map(e => e.per)); for (let s = 1000; s < 1000 + P; s += 0.02) m = Math.min(m, conta(evs, s)); minimos.set(chave, m); }
      return base + conta(evs, t) - minimos.get(chave);
    }
    function barra(ctx, g, k, col, brilho) {
      const x0 = g.x0 + 0.12, x1 = g.x1 - 0.12, y = g.yb - 0.02; ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(x0, y - 0.025, x1 - x0, 0.045);
      ctx.fillStyle = brilho ? mix(col, '#FFFFFF', brilho) : col; ctx.fillRect(x0, y - 0.025, (x1 - x0) * clamp(k), 0.045);
    }
    const brilhoDe = (u, CI, PA) => u < CI ? 0 : 0.55 * (1 - (u - CI) / PA * 0.6);

    // ---------- câmaras de produção ----------
    function layout(sp, g) {
      const dIn = g.porta === 'R' ? -1 : 1, inStart = dIn > 0 ? g.x0 + 0.1 : g.x1 - 0.1, outStart = dIn > 0 ? g.x1 - 0.1 : g.x0 + 0.1;
      const wCol = c => c * ITEM + (c - 1) * GAP, cIn = sp.ins.length > 1 ? 2 : 3, cOut = sp.out2 ? 2 : 3;
      const ins = []; let x = inStart; sp.ins.forEach(([k]) => { const w = wCol(cIn); ins.push({ k, xs: x, mid: x + dIn * w / 2 }); x += dIn * (w + 0.06); });
      const wIn = sp.ins.length * wCol(cIn) + (sp.ins.length - 1) * 0.06, wOut = wCol(cOut), wOut2 = sp.out2 ? ITEM + 0.06 : 0;
      const xiF = inStart + dIn * wIn, xoF = outStart - dIn * (wOut + wOut2), xs = (xiF + xoF) / 2;
      const ING = []; sp.ins.forEach(([k, n]) => { for (let i = 0; i < n; i++) ING.push(k); });
      const fimX = (dIn > 0 ? g.x0 : g.x1) + dIn * 0.3;
      return { dIn, inStart, outStart, cIn, cOut, ins, wOut, xiF, xoF, xs, ING, Y: g.floor - 0.07, fimX, xOut: outStart - dIn * wOut / 2,
        out2X: dIn > 0 ? outStart - wOut - 0.06 : outStart + wOut + 0.06, Sin: xs - dIn * 0.24, Sout: xs + dIn * 0.24, Pin: xiF + dIn * 0.12, Pout: xoF - dIn * 0.12 };
    }
    // formigas do posto: cada uma leva o produto pronto à saída, busca ingrediente e trabalha
    function roteiroPosto(L, n) {
      const CI = A.CICLO, P = per(), dIn = L.dIn, posto = [];
      const viagens = (r, lista) => lista.forEach(k => {
        r.anda(L.Pin, null).para(PEGA, 'pega', null, lado(-dIn)).marca('in:' + k, -1);
        r.anda(L.Sin, k); posto.push({ t: r.t, k }); r.para(0.15, 'pega', null, lado(dIn));
      });
      const r0 = rota(L.Sout, L.Y, lado(-dIn)); r0.para(PEGA, 'pega', null); const pegaProduto = r0.t;
      r0.anda(L.Pout, '__produto').para(PEGA, 'pega', '__produto', lado(dIn)).marca('out', 1);
      const lista0 = n === 1 ? L.ING : L.ING.slice(0, Math.floor(L.ING.length / 2));
      viagens(r0, lista0); r0.anda(L.Sout, null).ate(CI, 'trabalha', null, lado(-dIn)).ate(P, 'espera');
      const ants = [r0];
      if (n > 1) { const r1 = rota(L.Sin, L.Y, lado(dIn)); r1.para(0.35, 'espera'); viagens(r1, L.ING.slice(lista0.length)); r1.ate(CI, 'trabalha', null, lado(dIn)).ate(P, 'espera'); ants.push(r1); }
      const ev = []; ants.forEach(r => r.ev.forEach(e => ev.push(e)));
      return { ants, ev, posto, pegaProduto, tAll: Math.max(...posto.map(q => q.t)) };
    }
    // carregadoras: 2 por ingrediente da receita a cada 2 ciclos; duas delas também levam o produto.
    // O roteiro começa na porta; o trecho no túnel é somado na hora de desenhar.
    function roteiroCarga(L) {
      const PC = per() * 2, nc = 2 * L.ING.length, out = [];
      for (let k = 0; k < nc; k++) {
        const ing = L.ING[k % L.ING.length], leva = k % L.ING.length === 0, alvo = L.ins.find(q => q.k === ing).mid, r = rota(L.fimX, L.Y, lado(L.dIn));
        r.anda(alvo, ing).para(PEGA, 'pega', ing).marca('in:' + ing, 1); r.L[r.L.length - 1].c = null;
        let c = null; if (leva) { r.anda(L.xOut, null).para(PEGA, 'pega', null).marca('out', -1); c = '__produto'; r.L[r.L.length - 1].c = c; }
        r.anda(L.fimX, c); out.push({ r, chega: k * PC / nc, PC, sai: c });
      }
      return out;
    }
    function prodDados(sp, g) {
      const ch = chaveDe(sp, g);
      return memo('prod' + ch, () => {
        const L = layout(sp, g), posto = roteiroPosto(L, sp.vagas || 1), carga = roteiroCarga(L), P = per(), evs = [];
        posto.ev.forEach(e => evs.push({ t: e.t, sinal: e.sinal, chave: e.chave, per: P }));
        carga.forEach(({ r, chega, PC }) => r.ev.forEach(e => evs.push({ t: e.t + chega, sinal: e.sinal, chave: e.chave, per: PC })));
        return { L, posto, carga, evs, ch };
      });
    }
    function prodConteudo(ctx, sp, g, st, z, T, tags) {
      const D = prodDados(sp, g), L = D.L, n = sp.vagas || 1, CI = A.CICLO, P = per(), t = tempo(T, g), u = mod(t, P), floor = g.floor;
      const conta1 = k => contaNorm(D.ch + k, D.evs.filter(e => e.chave === k), t, 1);
      L.ins.forEach(q => A.pile(ctx, q.k, st === 'falta_ing' ? 0 : st === 'saida_cheia' ? 3 : conta1('in:' + q.k), q.xs, L.dIn, floor, L.cIn, z, tags));
      A.pile(ctx, sp.out, st === 'saida_cheia' ? 9 : st === 'falta_ing' ? 2 : conta1('out'), L.outStart, -L.dIn, floor, L.cOut, z, tags);
      if (sp.out2) A.pile(ctx, sp.out2, st === 'saida_cheia' ? 3 : 1, L.out2X, -L.dIn, floor, 1, z, tags);
      if (st === 'produzindo') {
        const ps = D.posto, len = L.ING.length, m = clamp((u - ps.tAll) / Math.max(0.3, CI - ps.tAll)), pronto = u >= CI || u < ps.pegaProduto;
        if (!pronto) ps.posto.forEach((q, j) => { if (u < q.t) return; const s = 0.2 * (1 - m); if (s > 0.02) A.item(ctx, q.k, L.xs + (j - (len - 1) / 2) * 0.2 * (1 - m * 0.7), floor - 0.1, s); });
        if (pronto) A.item(ctx, sp.out, L.xs, floor - 0.12, 0.24); else if (m > 0) A.item(ctx, sp.out, L.xs, floor - 0.12, 0.24 * suave(m));
        // farelos só no zoom perto; no médio fica só o ingrediente virando produto
        if (perto(z) && m > 0 && m < 1) {
          for (let q = 0; q < 5; q++) {
            const ph = mod(u * 1.7 + q / 5, 1), sd = q % 2 ? 1 : -1, res = A.RES[L.ING[q % len]] || A.RES[sp.out];
            ctx.globalAlpha = 1 - ph; ctx.fillStyle = res.c[0]; ctx.beginPath();
            ctx.arc(L.xs + sd * (0.06 + ph * 0.2 + (q % 3) * 0.03), floor - 0.14 - Math.sin(ph * PI) * (0.16 + (q % 3) * 0.05), Math.max(0.02, 1.4 / z), 0, TAU); ctx.fill();
          }
          ctx.globalAlpha = 1;
        }
        ps.ants.forEach(r => { const q = onde(r, u); if (q.c === '__produto') q.c = sp.out; desenha(ctx, 'operaria', q, z, T); });
        const cic = A.cicloHook ? A.cicloHook(T, sp, g) : { k: u / CI };
        barra(ctx, g, cic.k, A.RES[sp.out].c[0], A._brilho);
      } else {
        // parada: esperam pelo que falta (falta ingrediente: na pilha vazia, olhando a porta; saída cheia: na pilha de saída, com o produto)
        const olhar = i => Math.sin(T * 0.9 + i * 2) > 0.7 ? 0.25 * Math.sin(T * 3 + i) : 0, dIn = L.dIn;
        if (st === 'falta_ing') for (let i = 0; i < n; i++) desenha(ctx, 'operaria', { x: L.inStart + dIn * (0.3 + i * 0.36), y: L.Y, ang: lado(-dIn) + olhar(i), p: 'espera' }, z, T);
        else {
          A.item(ctx, sp.out, L.xs, floor - 0.12, 0.24);
          desenha(ctx, 'operaria', { x: L.Pout, y: L.Y, ang: lado(dIn) + olhar(0), p: 'espera', c: sp.out }, z, T);
          if (n > 1) desenha(ctx, 'operaria', { x: L.Pout - dIn * 0.36, y: L.Y, ang: lado(dIn) + olhar(1), p: 'espera' }, z, T);
        }
        barra(ctx, g, st === 'saida_cheia' ? 1 : 0.35, A.RES[sp.out].c[0], 0);
      }
      return true;
    }
    // desenha uma carregadora pelo túnel p (entrando e saindo) e pelo roteiro de dentro
    function carregadora(ctx, p, sEnd, ri, tau, ida, volta, z, T, yDentro) {
      const dt = sEnd / VEL, ti = ri.t, tot = 2 * dt + ti; if (tau < 0 || tau > tot) return;
      let q;
      if (tau < dt) { const e = A.at(p, tau * VEL); q = { x: e.x, y: e.y, ang: e.ang, c: ida, p: 'anda' }; }
      else if (tau < dt + ti) {
        const ti0 = tau - dt; q = onde(ri, ti0);
        if (yDentro != null) { const fy = A.at(p, sEnd).y, dy = fy - yDentro; if (ti0 < 0.2) q.y += dy * (1 - ti0 / 0.2); if (ti - ti0 < 0.2) q.y += dy * (1 - (ti - ti0) / 0.2); }
      } else { const e = A.at(p, sEnd - (tau - dt - ti) * VEL); q = { x: e.x, y: e.y, ang: e.ang + PI, c: volta, p: 'anda' }; }
      const s = tau < dt ? tau * VEL : tau > dt + ti ? sEnd - (tau - dt - ti) * VEL : sEnd, fade = clamp(s / 0.35);
      if (fade < 1) ctx.globalAlpha = fade; desenha(ctx, 'operaria', q, z, T); ctx.globalAlpha = 1;
    }
    function cargaProd(ctx, sp, g, p, z, T) {
      const D = prodDados(sp, g), t = tempo(T, g);
      D.carga.forEach(({ r, chega, PC, sai }) => {
        const dt = p.len / VEL, base = mod(t - (chega - dt), PC);
        for (let m = 0; m < 3; m++) carregadora(ctx, p, p.len, r, base + m * PC, r.L[0].c, sai === '__produto' ? sp.out : null, z, T, D.L.Y);
      });
      return true;
    }

    // ---------- câmara real ----------
    function real(ctx, sp, g, z, T, tags) {
      const CR = A.CICLO * 1.8, PA = A.PAUSA, PR = CR + PA, u = mod(tempo(T, g), PR), floor = g.floor, Y = floor - 0.07, inL = g.x0 + 0.1;
      const sc = A.ANT_UNIT * A.CASTAS.rainha.esc * 2.1, qx = g.cx + 0.2, qy = floor - 0.36, cabeca = qx - 7.2 * sc, ponta = qx + 14.6 * sc, xf = inL + 0.05 + 2 * ITEM + GAP;
      const r = memo('real' + chaveDe(sp, g), () => {
        const r = rota(cabeca - 0.4, Y, PI); r.para(0.3, 'espera').anda(xf + 0.1).para(PEGA, 'pega', null).marca('f', -1);
        r.anda(cabeca - 0.16, 'fungo').para(0.2, 'pega', 'fungo', 0).para(2.4, 'trabalha', null, 0).anda(cabeca - 0.4, null).ate(PR, 'espera', null, 0); return r;
      });
      const bota = CR - 1.3, k = clamp((u - bota) / 1.3), sopro = 1 + 0.02 * Math.sin(T * 2.2) + (u > bota && u < CR ? 0.035 * Math.sin(T * 10) : 0);
      A.pile(ctx, 'fungo', u > r.ev[0].t ? 2 : 3, inL + 0.05, 1, floor, 2, z, tags);
      const feed = r.L.find(s => s.p === 'trabalha'), comendo = u > feed.t0 && u < feed.t0 + feed.d;
      A.ant(ctx, 'rainha', qx, qy, PI, z, { nod: comendo ? Math.sin(T * 6) * 0.4 : 0, scale: 2.1 * sopro });
      // ovos: o de cima é levado ao berçário no começo do ciclo; o novo nasce na ponta do abdômen e cai na pilha
      const ovos = [[g.x1 - 0.32, floor - 0.13], [g.x1 - 0.52, floor - 0.13], [g.x1 - 0.32, floor - 0.37]], some = u < 0.6 ? 1 - u / 0.6 : 0;
      A.item(ctx, 'ovo', ovos[0][0], ovos[0][1], 0.26); A.item(ctx, 'ovo', ovos[1][0], ovos[1][1], 0.26);
      if (some) { ctx.globalAlpha = some; A.item(ctx, 'ovo', ovos[2][0], ovos[2][1], 0.26); ctx.globalAlpha = 1; }
      if (u > bota) { const cai = clamp((u - CR) / 0.4); A.item(ctx, 'ovo', ponta + (ovos[2][0] - ponta) * cai, qy + 0.05 + (ovos[2][1] - qy - 0.05) * suave(cai), 0.26 * Math.max(0.2, k)); }
      desenha(ctx, 'operaria', onde(r, u), z, T);
      barra(ctx, g, u < CR ? u / CR : 1, C.txt, brilhoDe(u, CR, PA));
      return true;
    }
    // ---------- berçário ----------
    function bercario(ctx, sp, g, z, T, tags) {
      const P = per(), CI = A.CICLO, t = tempo(T, g), u = mod(t, P), c = Math.floor(t / P), floor = g.floor, Y = floor - 0.07, inR = g.x1 - 0.1;
      const lx = i => g.x0 + 0.45 + i * 0.55, frente = inR - 2 * ITEM - GAP;
      const rs = [0, 1].map(j => { const alvo = mod(c * 2 + j, 3); return { alvo, r: memo('berc' + chaveDe(sp, g) + j + alvo, () => {
        const casa = frente - 0.18 - j * 0.34, r = rota(casa, Y, PI); r.para(0.2 + j * 0.9, 'espera').anda(frente - 0.12).para(PEGA, 'pega', null, 0).marca('f', -1);
        r.anda(lx(alvo) + 0.3, 'fungo').para(0.15, 'pega', 'fungo', PI).para(1.3, 'trabalha', null, PI).anda(casa, null).ate(P, 'espera', null, PI); return r;
      }) }; });
      A.pile(ctx, 'fungo', 3 - rs.filter(({ r }) => u > r.ev[0].t).length, inR, -1, floor, 2, z, tags);
      for (let i = 0; i < 3; i++) {
        let s = 1, w = T;
        rs.forEach(({ alvo, r }) => { if (alvo !== i) return; const f = r.L.find(q => q.p === 'trabalha'); if (u > f.t0 && u < f.t0 + f.d) { const k = (u - f.t0) / f.d; s = 1 + 0.1 * Math.sin(k * PI); w = T * 3.2; A.item(ctx, 'fungo', lx(i) + 0.14, floor - 0.13, 0.14 * (1 - k) + 0.02); } });
        A.larva(ctx, lx(i), floor - 0.12, s, w, i);
      }
      rs.forEach(({ r }) => desenha(ctx, 'operaria', onde(r, u), z, T));
      ctx.globalAlpha = 0.85; A.item(ctx, 'fungo', g.cx, g.yt + 0.28, 0.2); ctx.globalAlpha = 1;
      barra(ctx, g, u < CI ? u / CI : 1, C.veg, brilhoDe(u, CI, A.PAUSA));
      return true;
    }
    // ---------- posto de guarda ----------
    function posto(ctx, sp, g, z, T) {
      const Y = g.floor - 0.08, v = sp.vagas || 4, sd = g.porta === 'R' ? -1 : 1, x0 = sd > 0 ? g.x0 : g.x1, sx = i => x0 + sd * (0.3 + i * (1.4 / v)), fora = lado(-sd);
      const r = memo('posto' + chaveDe(sp, g), () => { const r = rota(sx(0), Y, fora, 0.6); r.para(2.4, 'espera').anda(x0 + sd * 0.12).para(1.8, 'espera', null, fora).para(0.5, 'espera', null, lado(sd)).anda(sx(0)).para(0.4, 'espera', null, lado(sd)).para(1.2, 'espera', null, fora); return r; });
      for (let i = 1; i < v; i++) { const vira = Math.sin(T * 0.7 + i * 2.3) > 0.55 ? 0.3 * Math.sin(T * 2 + i) : 0; desenha(ctx, 'soldado', { x: sx(i), y: Y, ang: fora + vira, p: 'espera' }, z, T); }
      desenha(ctx, 'soldado', onde(r, mod(T + g.x0, r.t)), z, T);
      return true;
    }
    // ---------- depósito (porta no teto) ----------
    const FAMS_DEP = [['fungo', 3], ['nectar', 2], ['barro', 4], ['proteina', 2]];
    function depDados(sp, g) {
      return memo('dep' + chaveDe(sp, g), () => {
        const PC = per() * 2, Y = g.floor - 0.07, ins = 0.13, xs = FAMS_DEP.map((_, i) => g.x0 + 0.12 + i * (2 * ITEM + GAP + 0.1));
        const teto = g.roof.slice(0, 21).reverse().map(q => ({ x: q.x + (g.cx - q.x) * (ins / (g.x1 - g.x0) * 2), y: q.y + ins }));
        const viagem = (traz, leva, ia, ib) => {
          const r = rota(teto[0].x, teto[0].y, PI); r.segue(teto.slice(1), traz).anda(g.x0 + ins, traz, Y);
          r.anda(xs[ia] + ITEM, traz, Y).para(PEGA, 'pega', traz).marca(FAMS_DEP[ia][0], 1); r.L[r.L.length - 1].c = null;
          r.anda(xs[ib] + ITEM, null, Y).para(PEGA, 'pega', null).marca(FAMS_DEP[ib][0], -1); r.L[r.L.length - 1].c = leva;
          r.anda(g.x0 + ins, leva, Y).anda(teto[teto.length - 1].x, leva, teto[teto.length - 1].y).segue(teto.slice().reverse().slice(1), leva); return r;
        };
        const carga = [{ r: viagem('nectar', 'fungo', 1, 0), chega: 0, PC, ida: 'nectar', sai: 'fungo' }, { r: viagem('fungo', 'nectar', 0, 1), chega: PC / 2, PC, ida: 'fungo', sai: 'nectar' }];
        const evs = []; carga.forEach(({ r, chega }) => r.ev.forEach(e => evs.push({ t: e.t + chega, sinal: e.sinal, chave: e.chave, per: PC })));
        return { xs, carga, evs, ins, ch: chaveDe(sp, g) };
      });
    }
    function deposito(ctx, sp, g, z, T, tags) {
      const D = depDados(sp, g), t = tempo(T, g);
      FAMS_DEP.forEach(([k, n], i) => A.pile(ctx, k, contaNorm(D.ch + k, D.evs.filter(e => e.chave === k), t, n - 1), D.xs[i], 1, g.floor, 2, z, tags));
      if (perto(z)) tags.push({ txt: '11/100', x: g.cx, y: g.yt + 0.35 });
      return true;
    }
    function cargaDep(ctx, sp, g, p, z, T) {
      const D = depDados(sp, g), t = tempo(T, g); let sEnd = p.len;
      for (let s = 0; s <= p.len; s += 0.02) { if (A.at(p, s).y >= g.yt + D.ins) { sEnd = s; break; } }
      D.carga.forEach(({ r, chega, PC, ida, sai }) => { const base = mod(t - (chega - sEnd / VEL), PC); for (let m = 0; m < 3; m++) carregadora(ctx, p, sEnd, r, base + m * PC, ida, sai, z, T, null); });
      return true;
    }

    // ---------- ganchos ----------
    A.conteudoHook = (ctx, sp, g, st, z, T, tags) => {
      if (!ativo(z)) return false;
      if (sp.cat === 'prod' && (st === 'produzindo' || st === 'falta_ing' || st === 'saida_cheia') && (sp.vagas || 1) <= 2) return prodConteudo(ctx, sp, g, st, z, T, tags);
      if (st !== 'produzindo' && st !== 'pronta') return false;
      if (sp.id === 'real') return real(ctx, sp, g, z, T, tags);
      if (sp.id === 'bercario') return bercario(ctx, sp, g, z, T, tags);
      if (sp.id === 'deposito') return deposito(ctx, sp, g, z, T, tags);
      if (sp.id === 'posto' && st === 'pronta') return posto(ctx, sp, g, z, T);
      return false;
    };
    // carregadoras pelo túnel da porta; devolve true quando desenhou (aí o túnel não põe as formigas genéricas)
    A.cargaHook = (ctx, sp, g, p, st, z, T) => {
      if (!ativo(z) || !sp) return false;
      if (sp.cat === 'prod' && st === 'produzindo' && (sp.vagas || 1) <= 2) return cargaProd(ctx, sp, g, p, z, T);
      if (sp.id === 'deposito' && st === 'produzindo') return cargaDep(ctx, sp, g, p, z, T);
      return false;
    };
  })();

  // ================= combate (D116) =================
  // Luta: investida com tranco. Golpe a cada 0,6 s, risquinho claro no contato; quem apanha fica branco por 0,09 s e é empurrado.
  // Vida: barrinha só enquanto a formiga leva dano ou está com menos de 100% (vermelha no inimigo, verde nas suas).
  // Morte: tomba de lado, perde a cor e some; o inimigo vira presa no chão.
  // Efeitos: ácido em arco com fio traçante, respingo e bolhinhas de lentidão; cura com anel e cruzinhas;
  // explosão com anel e estilhaços, deixando 4 s de teia de cola cor de terra.
  // Câmara atacada: os inimigos entram e mordem o posto e a pilha de entrada; as formigas se encolhem no fundo.
  (() => {
    const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v)), suave = k => k * k * (3 - 2 * k), mod = (t, p) => ((t % p) + p) % p;
    const ativo = z => LOD(z) === 'perto' || LOD(z) === 'medio';
    const GOLPE = 0.6, FAISCA = 0.12, CINZA = '#6E625A', BRANCO = '#FFF6E0', TEIA = '#7C6754', TEIA_L = '#C4B19A';

    // ---------- lutas roteirizadas ----------
    // lutador: { id, casta, ini (inimigo), faixa (-1 | 1), s: [[t, s]] ao longo do túnel, luta: [[t0, t1, alvo]], morre, vida: [[t, v]] }
    function interp(pts, t) {
      if (t <= pts[0][0]) return pts[0][1];
      for (let i = 1; i < pts.length; i++) if (t <= pts[i][0]) { const [t0, a] = pts[i - 1], [t1, b] = pts[i]; return a + (b - a) * ((t - t0) / ((t1 - t0) || 1)); }
      return pts[pts.length - 1][1];
    }
    const corDe = L => { if (L.ini) return C.perigo; const cg = A.COR_GRUPO[A.GRUPO[L.casta]]; return cg ? mix(C.txt, cg, A.TINTA) : C.txt; };
    function estado(L, t) {
      const sNow = interp(L.s, t), v = sNow - interp(L.s, t - 0.05), anda = Math.abs(v) > 0.002;
      let luta = null; (L.luta || []).forEach(([a, b, alvo]) => { if (t >= a && t < b) luta = { a, b, alvo }; });
      return { s: sNow, anda, olha: anda ? Math.sign(v) : (L.ini ? -1 : 1), luta, morto: L.morre != null && t >= L.morre };
    }
    function pos(cena, s, faixa) {
      const q = A.at(cena.p, s), w = A.LARG[cena.lvl] || 0.33, nx = -Math.sin(q.ang), ny = Math.cos(q.ang), off = w * 0.24 * (faixa || 0);
      return { x: q.x + nx * off, y: q.y + ny * off, ang: q.ang };
    }
    // golpes: um a cada GOLPE s, com fase própria por lutador
    function golpe(L, luta, t) {
      const fase = (L.id.charCodeAt(0) * 0.13 + L.id.charCodeAt(1) * 0.07) % GOLPE, base = luta.a + 0.2 + fase;
      if (t < base) return null; const th = base + Math.floor((t - base) / GOLPE) * GOLPE; return th < luta.b ? { th, ph: t - th } : null;
    }
    const vidaDe = (L, t) => L.vida ? interp(L.vida, t) : 1;
    const escDe = c => (A.CASTAS[c] || A.INIMIGOS[c] || { esc: 1 }).esc;

    function cena(ctx, z, T, cn) {
      const t = mod(T, cn.dur), px = 1 / z, por = {}, fim = clamp((cn.dur - t) / 0.4), ini = clamp(t / 0.3);
      cn.lut.forEach(L => { por[L.id] = L; });
      // último golpe recebido por cada lutador (para o branco e o tranco)
      const recebe = {};
      cn.lut.forEach(L => {
        for (let back = 0; back < 4; back++) {
          const tb = t - back * GOLPE, e = estado(L, tb); if (!e.luta || e.morto) continue;
          const g = golpe(L, e.luta, tb); if (g) { if (!recebe[e.luta.alvo] || recebe[e.luta.alvo].th < g.th) recebe[e.luta.alvo] = { th: g.th, de: L.id }; break; }
        }
      });
      // teia de cola da explosão, por baixo das formigas
      (cn.fx || []).forEach(f => { if (f.tipo === 'explosao' && t >= f.t && t - f.t <= 4) teia(ctx, cn, pos(cn, f.s, 0), t - f.t, t, z, fim); });
      // presas no chão
      cn.lut.forEach(L => {
        if (!L.ini || L.morre == null || t < L.morre) return; const ap = clamp((t - L.morre - 0.5) / 0.3); if (ap <= 0) return;
        const q = pos(cn, estado(L, L.morre).s, L.faixa); ctx.save(); ctx.globalAlpha = ap * fim; A.item(ctx, 'presa', q.x, q.y + 0.03 * (1 - ap), Math.max(0.2, 9 * px)); ctx.restore();
      });
      // formigas
      cn.lut.forEach(L => {
        if (t < L.s[0][0]) return;
        const e = estado(L, t), vida = vidaDe(L, t), rec = recebe[L.id];
        let q = pos(cn, e.s, L.faixa), ang = q.ang + (e.olha > 0 ? 0 : PI), col = corDe(L), alfa = ini * fim, esc = 1;
        const o = {}; if (!e.anda) o.nod = 0;
        if (e.luta && !e.morto) {
          const alvo = por[e.luta.alvo], qa = pos(cn, estado(alvo, t).s, alvo.faixa); ang = Math.atan2(qa.y - q.y, qa.x - q.x);
          const g = golpe(L, e.luta, t);
          if (g && g.ph < 0.16) { const k = Math.sin(g.ph / 0.16 * PI) * 0.06; q = { x: q.x + Math.cos(ang) * k, y: q.y + Math.sin(ang) * k }; }
        }
        if (rec && !e.morto) {
          const k = t - rec.th;
          if (k >= 0 && k < 0.18) { const dq = pos(cn, estado(por[rec.de], t).s, por[rec.de].faixa), a = Math.atan2(q.y - dq.y, q.x - dq.x), d = 0.035 * (1 - k / 0.18); q = { x: q.x + Math.cos(a) * d, y: q.y + Math.sin(a) * d }; if (k < 0.09) col = '#FFFFFF'; }
        }
        // a explosiva incha antes de explodir e some na explosão
        const exp = (cn.fx || []).find(f => f.tipo === 'explosao' && f.de === L.id);
        if (exp && t >= exp.t) return;
        if (exp && t > exp.t - 0.5) esc = 1 + 0.25 * suave((t - (exp.t - 0.5)) / 0.5);
        if (e.morto) {
          const k = t - L.morre; if (k > 0.8) return;
          ang += (e.olha > 0 ? 1 : -1) * 0.9 * suave(clamp(k / 0.45)); col = mix(col, CINZA, clamp(k / 0.5)); alfa *= k < 0.5 ? 1 : 1 - (k - 0.5) / 0.3; esc *= 1 - 0.1 * clamp(k / 0.5); o.nod = 0;
        }
        ctx.save(); ctx.globalAlpha = alfa; o.col = col; if (esc !== 1) o.scale = esc;
        A.ant(ctx, L.casta, q.x, q.y, ang, z, o); ctx.restore();
        // na faixa de baixo do túnel, a barrinha vai embaixo da formiga
        if (!e.morto && vida < 0.999) barrinha(ctx, q.x, q.y + (L.faixa > 0 ? 0.17 : -0.2) * escDe(L.casta), vida, L.ini, z, alfa);
        if (e.luta && !e.morto) { const g = golpe(L, e.luta, t); if (g && g.ph > 0.06 && g.ph < 0.06 + FAISCA) faisca(ctx, q.x + Math.cos(ang) * 0.17, q.y + Math.sin(ang) * 0.17, (g.ph - 0.06) / FAISCA, z, alfa); }
      });
      efeitos(ctx, z, t, cn, por, fim);
    }
    function barrinha(ctx, x, y, v, ini, z, al) {
      const px = 1 / z, w = Math.max(0.26, 14 * px), h = Math.max(0.035, 2.5 * px);
      ctx.save(); ctx.globalAlpha = al; ctx.fillStyle = 'rgba(20,14,10,0.75)'; ctx.fillRect(x - w / 2 - px, y - h / 2 - px, w + 2 * px, h + 2 * px);
      ctx.fillStyle = ini ? C.perigo : mix(C.veg, '#FFFFFF', 0.15); ctx.fillRect(x - w / 2, y - h / 2, w * clamp(v), h); ctx.restore();
    }
    function faisca(ctx, x, y, k, z, al) {
      const px = 1 / z; ctx.save(); ctx.globalAlpha = al * (1 - k); ctx.strokeStyle = BRANCO; ctx.lineWidth = Math.max(1.3 * px, 0.014); ctx.lineCap = 'round'; ctx.beginPath();
      for (let i = 0; i < 4; i++) { const a = i * PI / 2 + PI / 4, r0 = Math.max(0.025, 1.5 * px) + k * 0.03, r1 = r0 + Math.max(0.05, 4 * px); ctx.moveTo(x + Math.cos(a) * r0, y + Math.sin(a) * r0); ctx.lineTo(x + Math.cos(a) * r1, y + Math.sin(a) * r1); }
      ctx.stroke(); ctx.restore();
    }
    // raiz: cone curvo grudado numa superfície (teto, dir = 1; chão, dir = -1), largo na base e fino na ponta
    function raiz(ctx, x, y, dir, w, h, tx) {
      ctx.beginPath(); ctx.moveTo(x - w, y); ctx.quadraticCurveTo(x - w * 0.12, y + dir * h * 0.35, x + (tx || 0), y + dir * h); ctx.quadraticCurveTo(x + w * 0.12, y + dir * h * 0.35, x + w, y); ctx.closePath(); ctx.fill();
    }
    // teia de cola: cinco fios finos cor de terra do teto ao chão, balançando devagar, com gotinhas; arrebentam no fim
    function teia(ctx, cn, c, k, t, z, fim) {
      const px = 1 / z, hw = Math.max(A.LARG[cn.lvl] || 0.33, A.minW(z)) / 2, abre = suave(clamp(k / 0.25)), al = clamp((4 - k) / 0.6) * clamp(k / 0.15) * fim;
      const quebra = clamp((k - 3.3) / 0.6), T0 = -hw * 0.88, F0 = hw * 0.86, meio = (T0 + F0) / 2;
      ctx.save(); ctx.translate(c.x, c.y); ctx.rotate(c.ang); ctx.globalAlpha = al * 0.95; ctx.lineCap = 'round'; ctx.strokeStyle = TEIA;
      [-0.46, -0.22, 0.02, 0.25, 0.47].forEach((x0, j) => {
        const x = x0 * abre, sw = 0.035 * Math.sin(t * 1.3 + j * 1.7), dx = 0.04 * Math.sin(j * 2.3);
        const P = u => ({ x: (1 - u) * (1 - u) * x + 2 * u * (1 - u) * (x + sw) + u * u * (x + dx), y: (1 - u) * (1 - u) * T0 + 2 * u * (1 - u) * (meio + 0.03) + u * u * F0 });
        ctx.fillStyle = TEIA; raiz(ctx, x, T0, 1, 0.024, 0.06, sw * 0.15); raiz(ctx, x + dx, F0, -1, 0.024, 0.05, sw * 0.12);
        ctx.lineWidth = Math.max(1.1 * px, 0.011) * (j % 2 ? 1 : 1.35) * 0.75;
        if (quebra <= 0) { ctx.beginPath(); ctx.moveTo(x, T0); ctx.quadraticCurveTo(x + sw, meio + 0.03, x + dx, F0); ctx.stroke(); }
        else { const r = 1 - quebra; ctx.beginPath(); ctx.moveTo(x, T0); ctx.lineTo(x + sw * 0.5, T0 + (meio - T0) * r); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x + dx, F0); ctx.lineTo(x + dx + sw * 0.5, F0 - (F0 - meio) * r); ctx.stroke(); }
        if (quebra <= 0) [0.28, 0.55, 0.8].forEach((u, i) => {
          if ((i + j) % 2 && i !== 1) return; const q = P(u), rr = Math.max(0.012, 1.1 * px) * (1 + 0.3 * ((i + j) % 2));
          ctx.fillStyle = TEIA; ctx.beginPath(); ctx.arc(q.x, q.y, rr, 0, TAU); ctx.fill(); ctx.fillStyle = TEIA_L; ctx.beginPath(); ctx.arc(q.x - rr * 0.3, q.y - rr * 0.3, rr * 0.4, 0, TAU); ctx.fill();
        });
      });
      ctx.restore();
    }
    // fio do ácido: desenha o arco inteiro da atiradora até onde a gota está e se apaga 0,3 s depois do impacto
    function fio(ctx, ponto, k, r, fim) {
      if (k < 0 || k > 1 + 0.3 / 0.35) return; const ate = Math.min(1, k), some = k > 1 ? 1 - (k - 1) / (0.3 / 0.35) : 1;
      const h = ponto(ate), o = ponto(0), gr = ctx.createLinearGradient(o.x, o.y, h.x, h.y);
      gr.addColorStop(0, 'rgba(245,184,65,0)'); gr.addColorStop(1, C.acu);
      ctx.save(); ctx.globalAlpha = fim * 0.75 * some; ctx.strokeStyle = gr; ctx.lineWidth = r * 0.55; ctx.lineCap = 'round'; ctx.beginPath();
      for (let i = 0; i <= 16; i++) { const p = ponto(ate * i / 16); if (i) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y); }
      ctx.stroke(); ctx.restore();
    }
    function efeitos(ctx, z, t, cn, por, fim) {
      const px = 1 / z; ctx.save();
      (cn.fx || []).forEach(f => {
        if (f.tipo === 'acido') {
          const de = por[f.de], al = por[f.para], q0 = pos(cn, estado(de, f.t).s, de.faixa), q1 = pos(cn, estado(al, f.t + 0.35).s, al.faixa), r = Math.max(0.03, 2 * px), k = (t - f.t) / 0.35;
          const ponto = kk => ({ x: q0.x + (q1.x - q0.x) * kk, y: q0.y + (q1.y - q0.y) * kk - Math.sin(kk * PI) * 0.28 });
          fio(ctx, ponto, k, r, fim);
          if (k >= 0 && k < 1) {
            const pp = ponto(k); ctx.globalAlpha = fim; ctx.fillStyle = C.acu; ctx.beginPath(); ctx.arc(pp.x, pp.y, r, 0, TAU); ctx.fill();
            ctx.fillStyle = BRANCO; ctx.globalAlpha = fim * 0.85; ctx.beginPath(); ctx.arc(pp.x - r * 0.32, pp.y - r * 0.34, r * 0.34, 0, TAU); ctx.fill();
          }
          // respingo no alvo
          const ks = (t - f.t - 0.35) / 0.25;
          if (ks >= 0 && ks < 1) { ctx.fillStyle = C.acu; ctx.globalAlpha = fim * (1 - ks); for (let j = 0; j < 4; j++) { const a = -PI / 2 + (j - 1.5) * 0.6; ctx.beginPath(); ctx.arc(q1.x + Math.cos(a) * ks * 0.12, q1.y + Math.sin(a) * ks * 0.12, r * 0.7, 0, TAU); ctx.fill(); } }
          // alvo lento: bolhinhas por 2 s
          const dk = t - (f.t + 0.35);
          if (dk > 0 && dk < 2 && !(al.morre != null && t > al.morre)) { const qa = pos(cn, estado(al, t).s, al.faixa); ctx.strokeStyle = mix(C.acu, C.veg, 0.4); ctx.lineWidth = Math.max(px, 0.01); for (let j = 0; j < 3; j++) { const ph = mod(dk * 1.3 + j / 3, 1); ctx.globalAlpha = fim * (1 - ph) * clamp((2 - dk) / 0.3); ctx.beginPath(); ctx.arc(qa.x + (j - 1) * 0.07, qa.y - 0.08 - ph * 0.18, Math.max(0.018, 1.3 * px), 0, TAU); ctx.stroke(); } }
        }
        if (f.tipo === 'cura' && t >= f.t0 && t < f.t1) {
          const de = por[f.de], al = por[f.para], qd = pos(cn, estado(de, t).s, de.faixa), qa = pos(cn, estado(al, t).s, al.faixa), verde = mix(C.veg, '#FFFFFF', 0.2);
          ctx.fillStyle = verde;
          for (let j = 0; j < 2; j++) { const ph = mod((t - f.t0) * 1.1 + j / 2, 1), s = Math.max(0.03, 2.2 * px), x = qa.x + (j ? 0.06 : -0.05), y = qa.y - 0.1 - ph * 0.22; ctx.globalAlpha = fim * (1 - ph); ctx.fillRect(x - s / 2, y - s * 0.16, s, s * 0.32); ctx.fillRect(x - s * 0.16, y - s / 2, s * 0.32, s); }
          const ph = mod(t - f.t0, 1); ctx.strokeStyle = verde; ctx.lineWidth = Math.max(1.2 * px, 0.012); ctx.globalAlpha = fim * 0.55 * (1 - ph); ctx.beginPath(); ctx.arc(qd.x, qd.y, 0.16 + ph * 0.18, 0, TAU); ctx.stroke();
        }
        if (f.tipo === 'explosao' && t >= f.t) {
          const k = t - f.t, c = pos(cn, f.s, 0);
          if (k < 0.45) {
            const kk = k / 0.45; ctx.strokeStyle = mix(C.acu, '#FFFFFF', 0.35); ctx.lineWidth = Math.max(2 * px, 0.03) * (1 - kk * 0.6); ctx.globalAlpha = fim * (1 - kk); ctx.beginPath(); ctx.arc(c.x, c.y, 0.1 + kk * 0.9, 0, TAU); ctx.stroke();
            ctx.fillStyle = mix(C.acu, '#FFFFFF', 0.4); ctx.globalAlpha = fim * 0.3 * (1 - kk); ctx.beginPath(); ctx.arc(c.x, c.y, 0.1 + kk * 0.6, 0, TAU); ctx.fill();
          }
          if (k < 0.6) { const kk = k / 0.6; ctx.fillStyle = '#3A2E26'; ctx.globalAlpha = fim * (1 - kk); for (let j = 0; j < 9; j++) { const a = j / 9 * TAU + 0.3, d = 0.12 + kk * (0.5 + (j % 3) * 0.15); ctx.beginPath(); ctx.arc(c.x + Math.cos(a) * d, c.y + Math.sin(a) * d * 0.6 + kk * kk * 0.15, Math.max(0.018, 1.4 * px), 0, TAU); ctx.fill(); } }
        }
      });
      ctx.restore();
    }

    // ---------- cenas do catálogo ----------
    // luta no túnel de nível 2 (frente de 2): dois soldados contra três formigas rivais
    const L1 = () => ({ lvl: 2, dur: 10, lut: [
      { id: 'r1', casta: 'rival', ini: true, faixa: -1, s: [[0, 5.8], [2.8, 2.64]], luta: [[2.8, 4.8, 'a1']], morre: 4.8, vida: [[2.8, 1], [4.8, 0]] },
      { id: 'r2', casta: 'rival', ini: true, faixa: 1, s: [[0.3, 5.8], [3.1, 2.54]], luta: [[3.1, 6.4, 'a2']], morre: 6.4, vida: [[3.1, 1], [6.4, 0]] },
      { id: 'r3', casta: 'rival', ini: true, faixa: -1, s: [[1.0, 5.8], [3.4, 3.06], [5.0, 3.06], [5.5, 2.66]], luta: [[5.5, 7.4, 'a1']], morre: 7.4, vida: [[5.5, 1], [7.4, 0]] },
      { id: 'a1', casta: 'soldado', faixa: -1, s: [[0.6, -0.2], [2.8, 2.3], [7.9, 2.3], [10, 0.1]], luta: [[2.8, 4.8, 'r1'], [5.5, 7.4, 'r3']], vida: [[0, 1], [2.8, 1], [4.8, 0.8], [5.5, 0.8], [7.4, 0.6]] },
      { id: 'a2', casta: 'soldado', faixa: 1, s: [[0.8, -0.2], [3.1, 2.2], [6.9, 2.2], [9.2, -0.2]], luta: [[3.1, 6.4, 'r2']], vida: [[3.1, 1], [6.4, 0.42]] },
    ] });
    // linha de defesa: tanque e soldado na frente, atiradora e curandeira atrás, explosiva entrando
    const L2 = () => ({ lvl: 2, dur: 10, lut: [
      { id: 'r1', casta: 'rival', ini: true, faixa: -1, s: [[0, 5.8], [2.6, 2.78]], luta: [[2.6, 5.0, 'tq']], morre: 5.0, vida: [[2.6, 1], [5.0, 0]] },
      { id: 'r2', casta: 'rival', ini: true, faixa: 1, s: [[0.4, 5.8], [3.0, 2.62]], luta: [[3.0, 6.25, 'sd']], morre: 6.25, vida: [[3.0, 1], [6.2, 0.5], [6.25, 0]] },
      { id: 'r3', casta: 'rival', ini: true, faixa: -1, s: [[0.9, 5.8], [3.3, 3.12]], morre: 6.25, vida: [[6.2, 1], [6.25, 0]] },
      { id: 'r4', casta: 'rival', ini: true, faixa: 1, s: [[1.4, 5.8], [3.7, 3.0]], morre: 6.25, vida: [[6.2, 1], [6.25, 0]] },
      { id: 'sr', casta: 'soldadoRival', ini: true, faixa: -1, s: [[2.4, 5.8], [5.0, 3.62], [5.7, 2.82]], luta: [[5.7, 8.9, 'tq']], morre: 8.9, vida: [[5.7, 1], [8.9, 0]] },
      { id: 'tq', casta: 'tanque', faixa: -1, s: [[0, 2.42]], luta: [[2.6, 5.0, 'r1'], [5.7, 8.9, 'sr']], vida: [[2.6, 1], [5.0, 0.72], [6.4, 0.6], [8.9, 0.82]] },
      { id: 'sd', casta: 'soldado', faixa: 1, s: [[0, 2.28]], luta: [[3.0, 6.2, 'r2']], vida: [[3.0, 1], [3.6, 0.82], [6.2, 0.9]] },
      { id: 'at', casta: 'atiradora', faixa: -1, s: [[0, 1.4]] },
      { id: 'cu', casta: 'curandeira', faixa: 1, s: [[0, 1.3]] },
      { id: 'ex', casta: 'explosiva', faixa: 1, s: [[3.6, -0.2], [5.7, 3.05]] },
    ], fx: [
      ...[3.0, 3.9, 4.6].map(t => ({ tipo: 'acido', de: 'at', para: 'r1', t })), ...[6.3, 7.2, 8.1].map(t => ({ tipo: 'acido', de: 'at', para: 'sr', t })),
      { tipo: 'cura', de: 'cu', para: 'sd', t0: 3.6, t1: 6.1 }, { tipo: 'cura', de: 'cu', para: 'tq', t0: 6.5, t1: 9.0 },
      { tipo: 'explosao', de: 'ex', s: 3.0, t: 6.2 },
    ] });
    // devolve um desenho (ctx, z, T) da luta num túnel reto de nível 2, de x -0,3 a 5,9
    function luta(roteiro) {
      const cn = roteiro(); cn.p = A.curve({ x: -0.3, y: 0.82 }, { x: 5.9, y: 0.7 }, 0.03);
      return (ctx, z, T) => { A.tunel(ctx, cn.p, cn.lvl, 'livre', z, { T }); cena(ctx, z, T, cn); };
    }

    // ---------- câmara atacada (produção, zooms perto e médio) ----------
    // conteúdo: pilhas e as formigas encolhidas no fundo, tremendo; os inimigos entram depois, por cima (ataqueHook)
    function dentro(ctx, sp, g, z, T, tags) {
      const floor = g.floor, sd = g.porta === 'R' ? -1 : 1, inStart = sd > 0 ? g.x0 + 0.1 : g.x1 - 0.1, outStart = sd > 0 ? g.x1 - 0.1 : g.x0 + 0.1;
      let x = inStart;
      sp.ins.forEach(([k]) => { const p = A.pile(ctx, k, 3, x, sd, floor, sp.ins.length > 1 ? 2 : 3, z, tags); x = sd > 0 ? p.x + p.w + 0.06 : p.x - 0.06; });
      const po = A.pile(ctx, sp.out, 2, outStart, -sd, floor, sp.out2 ? 2 : 3, z, tags);
      if (sp.out2) A.pile(ctx, sp.out2, 1, sd > 0 ? po.x - 0.06 : po.x + po.w + 0.06, -sd, floor, 1, z, tags);
      const fundo = sd > 0 ? g.x1 - 1.05 : g.x0 + 1.05, n = sp.vagas || 1;
      for (let i = 0; i < Math.max(2, n); i++) A.ant(ctx, 'operaria', fundo - sd * i * 0.3 + Math.sin(T * 31 + i * 2) * 0.006, floor - 0.07, sd > 0 ? PI : 0, z, { nod: 0 });
      const x0 = g.x0 + 0.12, x1 = g.x1 - 0.12, y = g.yb - 0.02; ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(x0, y - 0.025, x1 - x0, 0.045);
      ctx.fillStyle = A.RES[sp.out].c[0]; ctx.fillRect(x0, y - 0.025, (x1 - x0) * 0.35, 0.045);
      return true;
    }
    const temAtaque = (sp, st, z) => st === 'ataque' && ativo(z) && sp.cat === 'prod' && sp.ins && (sp.vagas || 1) <= 2;
    const h0 = A.conteudoHook;
    A.conteudoHook = (ctx, sp, g, st, z, T, tags) => (A.ataqueHook && temAtaque(sp, st, z)) ? dentro(ctx, sp, g, z, T, tags) : (h0 ? h0(ctx, sp, g, st, z, T, tags) : false);
    // inimigos mordendo o posto e a pilha de entrada, soltando lascas da cor do recurso
    A.ataqueHook = (ctx, sp, g, st, z, T) => {
      if (!temAtaque(sp, st, z)) return false;
      const floor = g.floor, Y = floor - 0.07, sd = g.porta === 'R' ? -1 : 1, wx = sd > 0 ? g.x0 : g.x1, px = 1 / z, xs = (g.x0 + g.x1) / 2;
      const lascas = (x, y, cor, fase, dir) => { ctx.save(); ctx.fillStyle = cor; for (let j = 0; j < 3; j++) { const ph = mod(T * 1.45 + fase + j * 0.11, 1); if (ph > 0.45) continue; const k = ph / 0.45; ctx.globalAlpha = 1 - k; ctx.beginPath(); ctx.arc(x + dir * (0.05 + k * 0.2) * (1 + j * 0.4), y - Math.sin(k * PI) * (0.12 + j * 0.05) + k * 0.06, Math.max(0.018, 1.4 * px), 0, TAU); ctx.fill(); } ctx.restore(); };
      const morde = (x, y, ang, fase) => { const ph = mod(T * 1.45 + fase, 1), k = ph < 0.22 ? Math.sin(ph / 0.22 * PI) * 0.06 : 0; A.ant(ctx, 'rival', x + Math.cos(ang) * k, y + Math.sin(ang) * k, ang, z, { nod: 0 }); };
      morde(xs - sd * 0.32, Y, sd > 0 ? 0 : PI, 0); morde(wx + sd * 0.55, Y, sd > 0 ? 0 : PI, 0.5);
      lascas(xs - sd * 0.15, floor - 0.1, A.RES[sp.out].c[0], 0.05, sd); lascas(wx + sd * 0.72, floor - 0.12, A.RES[sp.ins[0][0]].c[0], 0.55, sd);
      return true;
    };

    // armadilha de cola (D116): a mesma teia de terra, do teto da cúpula ao chão, com gotinhas brilhando.
    // Sem munição, os fios estão arrebentados e apagados. Em combate, os fios tremem.
    const tetoY = (g, x) => { const r = g.roof; for (let i = 1; i < r.length; i++) { const a = r[i - 1], b = r[i]; if ((x - a.x) * (x - b.x) <= 0) { const k = (x - a.x) / ((b.x - a.x) || 1); return a.y + (b.y - a.y) * k; } } return g.yw; };
    A.teiaCamara = (ctx, g, z, T, vazia, treme) => {
      const px = 1 / z, n = 5, x0 = g.x0 + 0.35, x1 = g.x1 - 0.6, F0 = g.floor - 0.01;
      ctx.save(); ctx.lineCap = 'round'; ctx.strokeStyle = TEIA; ctx.globalAlpha = vazia ? 0.55 : 0.95;
      for (let j = 0; j < n; j++) {
        const x = x0 + (x1 - x0) * j / (n - 1) + 0.04 * Math.sin(j * 2.1), T0 = tetoY(g, x) + 0.03, meio = (T0 + F0) / 2;
        const sw = (treme ? 0.02 * Math.sin(T * 23 + j * 2) : 0) + 0.035 * Math.sin(T * 1.3 + j * 1.7), dx = 0.05 * Math.sin(j * 2.3);
        ctx.fillStyle = TEIA; raiz(ctx, x, T0, 1, 0.026, 0.07, sw * 0.15); raiz(ctx, x + dx, F0, -1, 0.026, 0.06, sw * 0.12);
        ctx.lineWidth = Math.max(1.1 * px, 0.012) * (j % 2 ? 1 : 1.35) * 0.8;
        if (vazia) { ctx.beginPath(); ctx.moveTo(x, T0); ctx.lineTo(x + sw * 0.5, T0 + (meio - T0) * 0.45); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x + dx, F0); ctx.lineTo(x + dx + sw * 0.5, F0 - (F0 - meio) * 0.3); ctx.stroke(); continue; }
        ctx.beginPath(); ctx.moveTo(x, T0); ctx.quadraticCurveTo(x + sw, meio + 0.03, x + dx, F0); ctx.stroke();
        [0.28, 0.55, 0.8].forEach((u, i) => {
          if ((i + j) % 2 && i !== 1) return; const qx = (1 - u) * (1 - u) * x + 2 * u * (1 - u) * (x + sw) + u * u * (x + dx), qy = (1 - u) * (1 - u) * T0 + 2 * u * (1 - u) * (meio + 0.03) + u * u * F0, rr = Math.max(0.013, 1.1 * px) * (1 + 0.3 * ((i + j) % 2));
          ctx.fillStyle = TEIA; ctx.beginPath(); ctx.arc(qx, qy, rr, 0, TAU); ctx.fill(); ctx.fillStyle = TEIA_L; ctx.beginPath(); ctx.arc(qx - rr * 0.3, qy - rr * 0.3, rr * 0.4, 0, TAU); ctx.fill();
        });
      }
      ctx.restore();
    };

    A.combate = { luta, cena, L1, L2 };
  })();

  // ================= eventos dentro do formigueiro (D117) =================
  // Escavação: ponta irregular, farelos claros e duas argileiras que vão vazias à ponta e voltam com argila.
  // Obra: a câmara abre da porta para o fundo, o contorno enche como barra e o custo que falta fica no meio.
  // Nascimento: a larva se encolhe, estoura num anel da cor da casta e a formiga sai pulando até a porta.
  // Onda: prévia tracejada vermelha da ponta rival até a câmara alvo, com anel no impacto; a ponta joga farelos.
  // Expedição: os soldados saem das vagas em coluna e deixam um rastro violeta pontilhado que some em 5 s.
  // Cada cena é um loop roteirizado (9 ou 10 s) para o catálogo; no jogo, o tempo de cada uma vem do 02.
  (() => {
    const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v)), mod = (t, p) => ((t % p) + p) % p;
    const ES = id => A.ESTRUTURAS.find(e => e.id === id), reto = (a, b) => A.curve(a, b, 0.0001);
    const TERRA = '#C4AD8C'; // farelo: terra solta, mais clara que o solo para aparecer no túnel e na terra

    // farelos jogados para trás em arco, a partir da ponta (x, y), com ângulo de avanço ang
    function farelos(ctx, x, y, ang, T, z, cor, n, alcance) {
      const px = 1 / z, bx = -Math.cos(ang), by = -Math.sin(ang); ctx.save(); ctx.fillStyle = cor || TERRA;
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

    // ---------- escavação de túnel: nó à esquerda, 3,3 células para a direita; 7 s cavando, 2 s pronto ----------
    function escavacao(ctx, z, T) {
      const t = mod(T, 9), k = clamp(t / 7), a = { x: 0.6, y: 0.72 }, b = { x: 3.9, y: 0.56 }, P = reto(a, b), w = A.LARG[1];
      A.tunel(ctx, reto({ x: -0.6, y: 0.78 }, a), 1, 'livre', z, { T });
      const L = P.len * k, q = A.at(P, Math.max(0.01, L));
      if (k < 1) A.tunel(ctx, P, 1, 'planejado', z, { T });
      if (L > 0.02) A.tunel(ctx, reto(a, q), 1, 'livre', z, { T });
      A.no(ctx, a.x, a.y, 1, z);
      if (k >= 1) return;
      pontaIrregular(ctx, q.x, q.y, q.ang, w);
      [1.3, 2.7].forEach(t0 => { // argileiras: vão vazias, voltam com argila e somem quando o túnel fica pronto
        const r = vaiVem(t, tt => Math.max(0.1, P.len * clamp(tt / 7) - 0.3), t0, 0.9); if (!r) return;
        const e = A.at(P, Math.max(0.02, r.s)); ctx.save(); ctx.globalAlpha = clamp((t - t0) / 0.3) * clamp((7 - t) / 0.4);
        A.ant(ctx, 'operaria', e.x, e.y + (r.volta ? 0.03 : -0.03), e.ang + (r.volta ? PI : 0), z, r.volta ? { carry: 'argila' } : {}); ctx.restore();
      });
      A.ant(ctx, 'cavadora', q.x - Math.cos(q.ang) * 0.13, q.y - Math.sin(q.ang) * 0.13, q.ang, z, { nod: Math.sin(T * 9) });
      farelos(ctx, q.x, q.y, q.ang, T, z, TERRA, 4);
    }

    // ---------- obra de câmara: jardim de fungo, 7,5 s de obra e a câmara pronta até os 10 s ----------
    const JAR = ES('jardim'), GX = 1.2, GY = 0;
    function perimetro(g) { let L = (g.x1 - g.x0) + 2 * (g.yb - g.yw); for (let i = 1; i < g.roof.length; i++) L += Math.hypot(g.roof[i].x - g.roof[i - 1].x, g.roof[i].y - g.roof[i - 1].y); return L; }
    function tracejado(ctx, g, px) { A.domePath(ctx, g); ctx.setLineDash([5 * px, 8 * px]); ctx.strokeStyle = C.txt2; ctx.lineWidth = Math.max(1.2 * px, 0.025); ctx.stroke(); ctx.setLineDash([]); }
    function obra(ctx, z, T, tags) {
      const t = mod(T, 10), k = clamp(t / 7.5), g = A.geom(JAR, GX, GY, 7), px = 1 / z, xf = g.x0 + (g.x1 - g.x0) * k;
      if (A.perfil) A.perfil.registra(ctx, g); // as cavadoras dentro da obra ficam de pé (D120)
      A.tunel(ctx, A.curve({ x: -0.5, y: 0.45 }, { x: g.door.x + 0.02, y: g.door.y }, 0.05), 1, 'livre', z, { T });
      if (k < 1) {
        ctx.save(); A.domePath(ctx, g); ctx.clip();
        ctx.fillStyle = C.base; ctx.beginPath(); ctx.moveTo(g.x0 - 0.2, g.yt - 0.2);
        for (let y = g.yt - 0.2; y <= g.yb + 0.2; y += 0.05) ctx.lineTo(xf + 0.05 * Math.sin(y * 19) + 0.03 * Math.sin(y * 7 + 1), y);
        ctx.lineTo(g.x0 - 0.2, g.yb + 0.2); ctx.closePath(); ctx.fill(); ctx.restore();
        tracejado(ctx, g, px);
        const Pm = perimetro(g); A.domePath(ctx, g); ctx.setLineDash([Pm * k, Pm * 2]); ctx.strokeStyle = C.txt; ctx.lineWidth = Math.max(2 * px, 0.035); ctx.stroke(); ctx.setLineDash([]);
        const Y = g.floor - 0.08;
        [0, 1].forEach(i => A.ant(ctx, 'cavadora', Math.max(g.x0 + 0.2, xf - 0.14 - i * 0.05), i ? g.yw + 0.05 : Y, 0, z, { nod: Math.sin(T * 9 + i * 2) }));
        farelos(ctx, xf, Y - 0.05, 0, T, z, TERRA, 4); farelos(ctx, xf, g.yw + 0.02, 0, T + 0.3, z, TERRA, 3);
        const r = vaiVem(t, tt => Math.max(0.1, (g.x1 - g.x0) * clamp(tt / 7.5) - 0.45), 1.8, 0.9);
        if (r) { ctx.save(); ctx.globalAlpha = clamp((t - 1.8) / 0.3) * clamp((7.5 - t) / 0.4); A.ant(ctx, 'operaria', g.x0 + 0.15 + r.s, Y + 0.02, r.volta ? PI : 0, z, r.volta ? { carry: 'argila' } : {}); ctx.restore(); }
        if (LOD(z) === 'perto' || LOD(z) === 'medio') tags.push({ txt: Math.ceil(24 * (1 - k)) + ' pt', x: g.cx, y: g.yt + 0.32 });
      } else {
        // a câmara cavada fica por baixo e o conteúdo aparece por cima (sem piscar o solo); no fim do loop volta ao solo devagar
        const sai = clamp((10 - t) / 0.6);
        if (sai < 1) tracejado(ctx, g, px);
        ctx.save(); ctx.globalAlpha = sai; ctx.fillStyle = C.base; A.domePath(ctx, g); ctx.fill();
        ctx.globalAlpha = sai * clamp((t - 7.5) / 0.5); A.estrutura(ctx, JAR, GX, GY, 'vazia', z, { T, tags: sai > 0.5 ? tags : [], seed: 7 }); ctx.restore();
      }
    }

    // ---------- nascimento: berçário com duas larvas comendo; a da direita nasce soldado e vai à porta. 9 s ----------
    const BERC = ES('bercario'), BX = 0.6, BY = -0.35;
    function nascimento(ctx, z, T, tags) {
      const t = mod(T, 9), h = A.conteudoHook;
      A.conteudoHook = (c2, sp, g) => { conteudoBerc(c2, sp, g, z, T, t, tags); return true; };
      try { A.tunel(ctx, A.curve({ x: -0.6, y: 0.95 }, { x: BX + 0.12, y: BY + 1.63 }, 0.05), 1, 'livre', z, { T }); A.estrutura(ctx, BERC, BX, BY, 'produzindo', z, { T, tags, seed: 3 }); } finally { A.conteudoHook = h; }
    }
    function conteudoBerc(ctx, sp, g, z, T, t, tags) {
      const floor = g.floor, Y = floor - 0.07, lx = i => g.x0 + 0.45 + i * 0.55, x2 = lx(2), yL = floor - 0.12, px = 1 / z, cor = C.def; // soldado: cor da casta
      A.pile(ctx, 'fungo', 2, g.x1 - 0.1, -1, floor, 2, z, tags);
      A.larva(ctx, lx(0), yL, 1, T, 0); A.larva(ctx, lx(1), yL, 1, T * 1.1, 1);
      A.ant(ctx, 'operaria', lx(0) + 0.3, Y - 0.22, 0.3, z, { nod: Math.sin(T * 7) * 0.6 });
      // a larva da direita cresce, se encolhe, estoura num anel e a formiga sai pulando
      if (t < 3.2) A.larva(ctx, x2, yL, 0.85 + 0.3 * t / 3.2, T, 2);
      else if (t < 3.5) A.larva(ctx, x2, yL + 0.02 * (t - 3.2) / 0.3, 1.15 * (1 - 0.35 * (t - 3.2) / 0.3), T * 3, 2);
      if (t >= 3.5 && t < 4.1) { const k = (t - 3.5) / 0.6; ctx.save(); ctx.globalAlpha = 1 - k; ctx.strokeStyle = cor; ctx.lineWidth = Math.max(2 * px, 0.03) * (1 - k * 0.5); ctx.beginPath(); ctx.arc(x2, yL, 0.08 + k * 0.3, 0, TAU); ctx.stroke(); ctx.restore(); }
      if (t >= 3.5 && t < 4.4) { const k = clamp((t - 3.5) / 0.6); A.ant(ctx, 'soldado', x2, Y - Math.sin(k * PI) * 0.25, PI, z, { nod: 0, scale: 0.7 + 0.3 * k }); }
      if (t >= 4.4) { // anda até a porta e some no túnel
        const dx = x2 - (g.door.x + 0.05), kS = (t - 4.4) / (dx / 0.9);
        if (kS < 1.15) { const x = x2 - dx * Math.min(1, kS), y = Y - (kS > 0.75 ? (Y - g.door.y - 0.04) * clamp((kS - 0.75) / 0.25) : 0); ctx.save(); ctx.globalAlpha = kS > 1 ? 1 - (kS - 1) / 0.15 : 1; A.ant(ctx, 'soldado', x, y, PI, z, {}); ctx.restore(); }
      }
      if (t > 8.2) { ctx.save(); ctx.globalAlpha = clamp((t - 8.2) / 0.6); A.larva(ctx, x2, yL, 0.85, T, 2); ctx.restore(); } // a próxima larva chega
      const kb = clamp(t / 3.5), x0 = g.x0 + 0.12, x1 = g.x1 - 0.12, y = g.yb - 0.02;
      ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(x0, y - 0.025, x1 - x0, 0.045);
      ctx.fillStyle = C.veg; ctx.fillRect(x0, y - 0.025, (x1 - x0) * (t < 8.2 ? kb : 0), 0.045);
    }

    // ---------- onda chegando: a boca rival fica à direita, fora da tela; o túnel rival cava até a parede do jardim. 10 s ----------
    const JAR2 = Object.assign({}, ES('jardim'), { porta: 'L' }), OX = -0.2, OY = 0;
    function onda(ctx, z, T, tags) {
      const t = mod(T, 10), px = 1 / z, g = A.geom(JAR2, OX, OY, 5), yT = g.floor - 0.2, x0 = 6.4, xAlvo = g.x1 + 0.04, k = clamp(t / 8), xf = x0 + (xAlvo - x0) * k;
      A.tunel(ctx, A.curve({ x: -1.2, y: 0.2 }, { x: g.door.x + 0.02, y: g.door.y }, 0.05), 1, 'livre', z, { T });
      A.estrutura(ctx, JAR2, OX, OY, t > 8.3 ? 'ataque' : 'produzindo', z, { T, tags, seed: 5 });
      if (k < 1) { // prévia: linha tracejada da ponta até a câmara alvo e anel pulsando devagar (0,8 Hz) no impacto
        ctx.save(); ctx.setLineDash([4 * px, 5 * px]); ctx.lineDashOffset = T * 6 * px; ctx.strokeStyle = C.perigo; ctx.globalAlpha = 0.8; ctx.lineWidth = Math.max(1.4 * px, 0.02);
        ctx.beginPath(); ctx.moveTo(xf - 0.12, yT); ctx.lineTo(xAlvo, yT); ctx.stroke(); ctx.setLineDash([]);
        const pu = 0.5 + 0.5 * Math.sin(T * 2 * PI * 0.8); ctx.globalAlpha = 0.5 + 0.4 * pu; ctx.lineWidth = Math.max(1.6 * px, 0.025); ctx.beginPath(); ctx.arc(xAlvo, yT, 0.1 + 0.03 * pu, 0, TAU); ctx.stroke(); ctx.restore();
      }
      A.tunel(ctx, reto({ x: xf, y: yT }, { x: x0 + 0.5, y: yT }), 1, 'rival', z, { T });
      if (k < 1) pontaIrregular(ctx, xf, yT, PI, A.LARG[1]);
      [0, 0.38, 0.8].forEach((d, i) => { // a rival da frente cava, as outras seguem
        const x = (k < 1 ? xf + 0.13 : xAlvo + 0.18) + d; if (x > x0 + 0.25) return;
        A.ant(ctx, 'rival', x + (k >= 1 ? Math.sin(T * 9 + i) * 0.01 : 0), yT + (i % 2 ? 0.025 : -0.02), PI, z, { nod: i === 0 && k < 1 ? Math.sin(T * 9) : 0 });
      });
      if (k < 1) farelos(ctx, xf, yT, PI, T, z, TERRA, 6);
    }

    // ---------- expedição saindo: posto de guarda com porta à direita; três soldados saem em coluna. 10 s ----------
    const POSTO = Object.assign({}, ES('posto'), { porta: 'R' }), PX = 0.1, PY = 0;
    function rota(pts) { const cum = [0]; for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y)); return { pts, cum, len: cum[cum.length - 1] }; }
    function naRota(r, d) {
      d = clamp(d, 0, r.len); let i = 1; while (i < r.cum.length - 1 && r.cum[i] < d) i++;
      const a = r.pts[i - 1], b = r.pts[i], k = (d - r.cum[i - 1]) / ((r.cum[i] - r.cum[i - 1]) || 1); return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k, ang: Math.atan2(b.y - a.y, b.x - a.x) };
    }
    function expedicao(ctx, z, T, tags) {
      const t = mod(T, 10), px = 1 / z, g = A.geom(POSTO, PX, PY, 2), NO = { x: g.x1 + 1.65, y: g.floor - A.LARG[1] / 2 + 0.005 }, M = A.curve(NO, { x: 6.7, y: 0.55 }, 0.04), saiu = t > 1.0;
      A.tunel(ctx, M, 2, 'livre', z, { T });
      // sem o gancho das câmaras animadas: os soldados ficam parados nas vagas e quem sai é desenhado aqui
      const h0 = A.conteudoHook; A.conteudoHook = null; let r0;
      try { r0 = A.ligacao(ctx, POSTO, PX, PY, NO, 1, z, { T, tags, seed: 2, est: saiu ? 'falta_cuid' : 'pronta' }); } finally { A.conteudoHook = h0; }
      A.no(ctx, NO.x, NO.y, 2, z);
      const p = r0.p, Y = g.floor - 0.08, N = 3, vaga = i => g.x0 + 0.3 + (3 - i) * 0.35; // saem as vagas 3, 2 e 1; a 0 fica de guarda
      if (t > 9.3) { ctx.save(); ctx.globalAlpha = clamp((t - 9.3) / 0.7); for (let i = 0; i < N; i++) A.ant(ctx, 'soldado', vaga(i), Y, PI, z, {}); ctx.restore(); } // voltam às vagas para emendar o loop
      if (!saiu) return;
      const pts = [{ x: vaga(N - 1), y: Y }, { x: p.pts[p.pts.length - 1].x - 0.12, y: Y }];
      for (let s = p.len; s >= 0; s -= 0.05) pts.push(A.at(p, s));
      for (let s = 0.05; s <= M.len; s += 0.05) pts.push(A.at(M, s));
      const R = rota(pts), espaco = 0.55, VEL = 0.85, base = i => vaga(i) - vaga(N - 1), s0 = base(0) + (t - 1.0) * VEL;
      const pos = i => { const d = Math.max(base(i), s0 - i * espaco); return Object.assign(naRota(R, d), { d }); }; // cada um espera o da frente abrir distância
      const lider = pos(0);
      // rastro de feromônio: pontilhado violeta por onde a coluna passou, some em 5 s
      ctx.save(); ctx.fillStyle = C.atk;
      for (let d = base(0); d < lider.d - 0.1; d += 0.14) { const idade = t - (1.0 + (d - base(0)) / VEL), al = 0.85 * clamp(1 - idade / 5); if (al <= 0) continue; const q = naRota(R, d); ctx.globalAlpha = al; ctx.beginPath(); ctx.arc(q.x, q.y + 0.005, Math.max(0.018, 1.5 * px), 0, TAU); ctx.fill(); }
      ctx.restore();
      for (let i = 0; i < N; i++) { const q = pos(i); if (q.d > R.len - 0.05) continue; A.ant(ctx, 'soldado', q.x, q.y, q.ang, z, {}); }
    }

    // ---------- estados parados "escavando" do catálogo: o quadro do meio da animação ----------
    // túnel: 60% cavado, ponta irregular, cavadora e farelos; duas argileiras vão e voltam entre o nó e a ponta
    function trecho(p, s0, s1) { const pts = [A.at(p, s0)]; for (let i = 0; i < p.pts.length; i++) if (p.cum[i] > s0 && p.cum[i] < s1) pts.push(p.pts[i]); pts.push(A.at(p, s1)); const cum = [0]; for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y)); return { pts, cum, len: cum[cum.length - 1] }; }
    A.escavaTunelHook = (ctx, p, lvl, z, T) => {
      const k = 0.6, L = p.len * k, q = A.at(p, L), lod = LOD(z), w = Math.max(A.LARG[lvl] || 0.25, A.minW(z));
      A.tunel(ctx, trecho(p, L, p.len), lvl, 'planejado', z, { T });
      A.tunel(ctx, trecho(p, 0, L), lvl, 'livre', z, { T });
      if (lod === 'geral') return true;
      pontaIrregular(ctx, q.x, q.y, q.ang, w);
      const Lm = Math.max(0.1, L - 0.3), per = 2 * Lm / 0.9 + 0.55;
      if (lod !== 'longe') [0, 0.5].forEach(of => {
        const r = vaiVem(mod(T + of * per, per), () => Lm, 0, 0.9), e = A.at(p, Math.max(0.02, r.s));
        A.ant(ctx, 'operaria', e.x, e.y + (r.volta ? 0.03 : -0.03), e.ang + (r.volta ? PI : 0), z, r.volta ? { carry: 'argila' } : {});
      });
      A.ant(ctx, 'cavadora', q.x - Math.cos(q.ang) * 0.13, q.y - Math.sin(q.ang) * 0.13, q.ang, z, { nod: Math.sin(T * 9) });
      farelos(ctx, q.x, q.y, q.ang, T, z, TERRA, 4);
      return true;
    };
    // câmara: metade cavada a partir da porta; contorno tracejado com metade cheia; custo que falta no meio
    A.obraHook = (ctx, sp, g, z, T, tags) => {
      const k = 0.5, px = 1 / z, lod = LOD(z), porta = g.porta || 'L', Y = g.floor - 0.08;
      const xf = porta === 'R' ? g.x1 - (g.x1 - g.x0) * k : g.x0 + (g.x1 - g.x0) * k, yf = g.yt + (g.yb - g.yt) * k;
      // a parte cavada vai da porta até a frente irregular; o resto continua solo
      ctx.save(); A.domePath(ctx, g); ctx.clip();
      ctx.fillStyle = C.base; ctx.beginPath();
      if (porta === 'T') { ctx.moveTo(g.x0 - 0.2, g.yt - 0.2); ctx.lineTo(g.x1 + 0.2, g.yt - 0.2); for (let x = g.x1 + 0.2; x >= g.x0 - 0.2; x -= 0.05) ctx.lineTo(x, yf + 0.05 * Math.sin(x * 19) + 0.03 * Math.sin(x * 7 + 1)); }
      else { const lado = porta === 'R' ? g.x1 + 0.2 : g.x0 - 0.2; ctx.moveTo(lado, g.yt - 0.2); for (let y = g.yt - 0.2; y <= g.yb + 0.2; y += 0.05) ctx.lineTo(xf + 0.05 * Math.sin(y * 19) + 0.03 * Math.sin(y * 7 + 1), y); ctx.lineTo(lado, g.yb + 0.2); }
      ctx.closePath(); ctx.fill(); ctx.restore();
      tracejado(ctx, g, px);
      const Pm = perimetro(g); A.domePath(ctx, g); ctx.setLineDash(porta === 'R' ? [0, Pm * (1 - k), Pm * k, Pm * 2] : [Pm * k, Pm * 2]); ctx.strokeStyle = C.txt; ctx.lineWidth = Math.max(2 * px, 0.035); ctx.stroke(); ctx.setLineDash([]); // a barra cresce a partir do lado da porta
      if (lod === 'geral') return true;
      if (porta === 'T') {
        [-1, 1].forEach(sd => A.ant(ctx, 'cavadora', g.cx + sd * 0.22, yf - 0.12, PI / 2, z, { nod: Math.sin(T * 9 + sd) }));
        farelos(ctx, g.cx, yf - 0.02, PI / 2, T, z, TERRA, 4);
      } else {
        const dir = porta === 'R' ? -1 : 1, ang = dir > 0 ? 0 : PI;
        [0, 1].forEach(i => A.ant(ctx, 'cavadora', xf - dir * (0.14 + i * 0.05), i ? g.yw + 0.05 : Y, ang, z, { nod: Math.sin(T * 9 + i * 2) }));
        farelos(ctx, xf, Y - 0.05, ang, T, z, TERRA, 4); farelos(ctx, xf, g.yw + 0.02, ang, T + 0.3, z, TERRA, 3);
        if (lod !== 'longe') { const Lm = Math.abs(xf - (porta === 'R' ? g.x1 : g.x0)) - 0.45, per = 2 * Lm / 0.9 + 0.55; if (Lm > 0.1) { const r = vaiVem(mod(T, per), () => Lm, 0, 0.9), x0 = porta === 'R' ? g.x1 - 0.15 : g.x0 + 0.15; A.ant(ctx, 'operaria', x0 + dir * r.s, Y + 0.02, r.volta ? ang + PI : ang, z, r.volta ? { carry: 'argila' } : {}); } }
      }
      if (tags && (lod === 'perto' || lod === 'medio')) tags.push({ txt: Math.ceil((sp.tam === 'G' ? 36 : sp.tam === 'M' ? 24 : sp.cat === 'ext' ? 15 : 12) * (1 - k)) + ' pt', x: g.cx, y: g.yt + 0.32 });
      return true;
    };

    A.eventos = { escavacao, obra, nascimento, onda, expedicao, farelos, pontaIrregular, vaiVem };
  })();

  // ================= eventos da superfície (D118) =================
  // Corte: a cortadeira sobe pelo caule, corta um pedaço (a folha fica mordida e cresce de novo) e desce com o pedaço em pé, como vela.
  // Ataque por cima: durante o aviso, o arco do cortadouro fica vermelho e pulsa a 1 Hz; a aranha anda com as pernas mexendo.
  // Voo nupcial: revoada. As aladas saem quase juntas e sobem em leque, girando, batendo as asas e ficando menores.
  // Estação: troca aos poucos (1,6 s), com folhas caindo no inverno e no outono e brotos abrindo na primavera.
  // Cada cena é um loop roteirizado para o catálogo; no jogo, os tempos vêm do 02.
  (() => {
    const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v)), suave = k => k * k * (3 - 2 * k), mod = (t, p) => ((t % p) + p) % p, lerp = (a, b, k) => a + (b - a) * k;
    const gnd = x => A.gnd(x);
    function rota(pts) { const cum = [0]; for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y)); return { pts, cum, len: cum[cum.length - 1] }; }
    function naRota(r, d) {
      d = clamp(d, 0, r.len); let i = 1; while (i < r.cum.length - 1 && r.cum[i] < d) i++;
      const a = r.pts[i - 1], b = r.pts[i], k = (d - r.cum[i - 1]) / ((r.cum[i] - r.cum[i - 1]) || 1); return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k, ang: Math.atan2(b.y - a.y, b.x - a.x) };
    }
    // cortadouro: túnel que desce, boca e, se pedido, o arco em alerta
    function cortadouro(ctx, xb, z, T, arco) {
      const tun = A.curve({ x: xb, y: gnd(xb) + 0.05 }, { x: xb + 0.9, y: 0.75 }, 0.1);
      A.tunel(ctx, tun, 1, 'livre', z, { T });
      ctx.save(); ctx.translate(0, gnd(xb)); A.cortadouroBoca(ctx, xb, z);
      if (arco) { ctx.strokeStyle = arco.cor; ctx.globalAlpha = arco.a; ctx.lineWidth = Math.max(2.2 / z, 0.07); ctx.beginPath(); ctx.arc(xb, 0.05, 0.42, PI, 0); ctx.stroke(); }
      ctx.restore(); return tun;
    }
    // caminho do fundo do túnel até a boca e daí pelo chão até xFim; a formiga aparece aos poucos no trecho do túnel
    const SURGE = 0.45, alfaTunel = d => clamp((d - 0.1) / (SURGE - 0.1));
    function saida(tun, xb, xFim, dy) {
      const pts = []; for (let s = SURGE; s > 0; s -= 0.05) pts.push(A.at(tun, s));
      const sg = Math.sign(xFim - xb) || 1; for (let x = xb + sg * 0.12; sg > 0 ? x <= xFim : x >= xFim; x += sg * 0.08) pts.push({ x, y: gnd(x) - dy });
      return rota(pts);
    }
    // pedaço de folha em pé (a vela): base em (x, y), virado para cima
    function vela(ctx, x, y, s, rot, cor) {
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.fillStyle = cor; ctx.beginPath(); ctx.moveTo(-s, 0); ctx.quadraticCurveTo(-s * 0.9, -s * 1.5, s * 0.2, -s * 1.25); ctx.quadraticCurveTo(s * 1.1, -s * 0.9, s, 0); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = mix(cor, '#14200F', 0.4); ctx.lineWidth = s * 0.12; ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(-s * 0.1, -s * 0.6, s * 0.1, -s * 1.15); ctx.stroke(); ctx.restore();
    }
    // geometria da folha larga (a mesma do A.planta, na primavera): caule, ponto do corte e meio da folha
    function folhaGeo(xp, h, T, i) {
      const k = 1, gy = gnd(xp), sway = Math.sin(T * 1.1 + xp) * 0.03, sd = i % 2 ? -1 : 1, L = h * (0.55 + i * 0.18), ex = sd * (0.25 + i * 0.1) + sway * 4, ey = -L;
      const rb = -sd * 0.35 + Math.sin(T * 1.3 + i) * 0.05, lw = 0.42 + 0.12 * k, lh = lw * 0.48;
      const loc = (lx, ly) => ({ x: xp + ex + lx * Math.cos(rb) - ly * Math.sin(rb), y: gy + ey + lx * Math.sin(rb) + ly * Math.cos(rb) });
      const caule = []; for (let j = 0; j <= 12; j++) { const t = j / 12, u = 1 - t; caule.push({ x: xp + t * t * ex, y: gy + 2 * u * t * ey * 0.7 + t * t * ey }); }
      return { gy, sd, caule, corte: loc(sd * lw * 0.6, -lh * 0.7), meio: loc(sd * lw * 0.42, -lh * 0.25) };
    }
    // mordida na folha: um furo da cor do céu (refaz o degradê do A.superficie)
    function mordida(ctx, p, r, est) {
      if (r <= 0.004) return; const ceu = A.ESTACOES[est].ceu, g = ctx.createLinearGradient(0, -3, 0, 0);
      g.addColorStop(0, mix(ceu, '#000000', 0.15)); g.addColorStop(1, mix(ceu, '#B8A48C', 0.16));
      ctx.save(); ctx.fillStyle = g; ctx.beginPath(); [-1, 0, 1].forEach(j => ctx.arc(p.x + j * r * 0.55, p.y - Math.abs(j) * r * 0.1, r * (j ? 0.62 : 0.8), 0, TAU)); ctx.fill(); ctx.restore();
    }

    // ---------- corte na planta: três cortadeiras, uma por folha; 12 s (0–5 sobe, 5–6,2 corta, 6,2–11,2 desce, 11,2–12 no túnel) ----------
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
          // de perfil (D120), a vela vai presa na boca; vista de cima, ela vai à frente da cabeça
          A.ant(ctx, 'cortadeira', q.x, q.y, ang, z, { vela: { cor: cf, rot: Math.sin(T * 5 + j) * 0.12 } });
          if (!(A.perfil && A.perfil.ultimo())) vela(ctx, q.x + Math.cos(ang) * 0.17, q.y + Math.sin(ang) * 0.17, 0.1, Math.sin(T * 5 + j) * 0.12 + (Math.abs(Math.cos(ang)) < 0.5 ? 0.25 * Math.sign(Math.sin(ang)) : 0), cf);
        } else A.ant(ctx, 'cortadeira', q.x, q.y, ang, z, {});
        ctx.restore();
      }
    }

    // ---------- ataque por cima: aviso de 0,5 a 9,9 s (no jogo, 45 s); a aranha entra aos 6 s, morde a cortadeira e desce. 14 s ----------
    const XB2 = 1.0, XP2 = 2.3, XE2 = 6.9, V2 = 1.1;
    function ataqueCima(ctx, z, T) {
      const t = mod(T, 14), emAviso = t > 0.5 && t < 9.9;
      A.superficie(ctx, 'outono', -1, 9, z, T, [{ tipo: 'capim', x: XP2, h: 1.0 }, { tipo: 'dente', x: 4.4, h: 0.9 }], [XB2]);
      const tun = cortadouro(ctx, XB2, z, T, emAviso ? { cor: C.perigo, a: (0.55 + 0.45 * Math.sin(T * 2 * PI)) * clamp((t - 0.5) / 0.4) } : null);
      // cortadeira 1: corta no pé do capim até a aranha chegar; tomba e some; volta no fim
      const xc = XP2 - 0.1, yc = gnd(xc) - 0.08, tMord = 6 + (XE2 - (xc + 0.38)) / V2;
      if (t < tMord + 0.1) A.ant(ctx, 'cortadeira', xc, yc, -0.25, z, { nod: Math.sin(T * 9) });
      else if (t < tMord + 0.9) { const k = (t - tMord - 0.1) / 0.8; ctx.save(); ctx.globalAlpha = 1 - k; A.ant(ctx, 'cortadeira', xc, yc + 0.03 * k, -0.25 + suave(clamp(k * 2)) * PI / 2, z, { col: mix(C.txt, '#6B6159', k) }); ctx.restore(); }
      else if (t > 13.3) { ctx.save(); ctx.globalAlpha = (t - 13.3) / 0.7; A.ant(ctx, 'cortadeira', xc, yc, -0.25, z, {}); ctx.restore(); }
      // cortadeira 2: vai, volta com folha e entra aos 5,6 s; sai de novo no fim
      const ch = saida(tun, XB2, XP2 - 0.4, 0.08); let d2 = null, v2 = false;
      if (t < 2.2) d2 = lerp(SURGE, ch.len, suave(t / 2.2)); else if (t < 3.0) d2 = ch.len; else if (t < 5.6) { d2 = ch.len * (1 - suave((t - 3) / 2.6)); v2 = true; } else if (t > 13.2) d2 = SURGE * (t - 13.2) / 0.8;
      if (d2 != null) { const q = naRota(ch, d2); ctx.save(); ctx.globalAlpha = alfaTunel(d2); A.ant(ctx, 'cortadeira', q.x, q.y, v2 ? q.ang + PI : q.ang, z, v2 ? { carry: 'folha' } : (t >= 2.2 && t < 3 ? { nod: Math.sin(T * 9) } : {})); ctx.restore(); }
      // aranha: entra pela borda, para e morde (pernas quietas), segue até a boca e desce
      if (t > 6 && t < 13) {
        let x, y, ang = PI, a = 1, lung = 0;
        const xm = xc + 0.38, tSai = tMord + 0.6, tBoca = tSai + (xm - (XB2 + 0.15)) / V2;
        if (t < tMord) x = XE2 - (t - 6) * V2;
        else if (t < tSai) { x = xm; lung = Math.max(0, Math.sin((t - tMord) / 0.6 * PI * 2)) * 0.1; }
        else if (t < tBoca) x = xm - (t - tSai) * V2;
        if (x != null) { y = gnd(x) - 0.13; x -= lung; }
        else { const xb = XB2 + 0.15, R = rota([{ x: xb, y: gnd(xb) - 0.13 }, A.at(tun, 0.12), A.at(tun, 0.35), A.at(tun, 0.6)]), q = naRota(R, (t - tBoca) * V2); x = q.x; y = q.y; ang = q.ang; a = 1 - clamp((t - tBoca - 0.3) / 0.4); }
        ctx.save(); ctx.globalAlpha = a * clamp((t - 6) / 0.3); A.ant(ctx, 'aranha', x, y, ang, z, t >= tMord && t < tSai ? { nod: 0 } : {}); ctx.restore();
      }
    }

    // ---------- voo nupcial: revoada de seis aladas pelo cortadouro; 12 s ----------
    const XB3 = 1.4, N3 = 6;
    function voo(ctx, z, T) {
      const t = mod(T, 12);
      A.superficie(ctx, 'verao', -1, 8, z, T, [{ tipo: 'dente', x: 3.6, h: 1.0 }, { tipo: 'capim', x: 0.1, h: 0.9 }], [XB3]);
      const tun = cortadouro(ctx, XB3, z, T), ch = saida(tun, XB3, XB3 + 0.45, 0.08), y0 = gnd(XB3 + 0.45) - 0.1;
      for (let k = 0; k < N3; k++) {
        const tS = 1 + k * 0.28, sobe = 1.0, abre = 0.15, dur = 4.6, u0 = t - tS; if (u0 < 0) continue;
        if (u0 < sobe) { const d = ch.len * suave(u0 / sobe), q = naRota(ch, d); ctx.save(); ctx.globalAlpha = alfaTunel(d); A.ant(ctx, 'alada', q.x, q.y, q.ang, z, { bate: 0.9 }); ctx.restore(); continue; }
        if (u0 < sobe + abre) { const k2 = (u0 - sobe) / abre; A.ant(ctx, 'alada', XB3 + 0.45, y0, 0, z, { bate: 0.9 * (1 - suave(k2)) }); continue; }
        const u = (u0 - sobe - abre) / dur; if (u >= 1) continue;
        const pos = uu => { const a = -PI / 2 + (k - 2.5) * 0.26, dd = (2.9 + (k % 2) * 0.6) * suave(clamp(uu * 1.1)), w = 0.22 * (Math.sin(uu * 10 + k * 1.7) - Math.sin(k * 1.7)) * (0.3 + uu); // leque com espiral
          return { x: XB3 + 0.45 + Math.cos(a) * dd - Math.sin(a) * w, y: y0 + Math.sin(a) * dd + Math.cos(a) * w }; };
        const p = pos(u), p2 = pos(Math.min(1, u + 0.01));
        ctx.save(); ctx.globalAlpha = 1 - clamp((u - 0.75) / 0.25); A.ant(ctx, 'alada', p.x, p.y, Math.atan2(p2.y - p.y, p2.x - p.x), z, { scale: 1 - 0.5 * u, bate: 0.5 + 0.5 * Math.sin(T * 2 * PI * 6 + k) }); ctx.restore();
      }
    }

    // ---------- troca de estação: outono, inverno, primavera e verão, 4 s cada; a troca leva 1,6 s ----------
    const SEQ = ['outono', 'inverno', 'primavera', 'verao'], PL4 = [{ tipo: 'capim', x: 0.5, h: 1.0 }, { tipo: 'folhaLarga', x: 1.8, h: 1.5 }, { tipo: 'dente', x: 3.2, h: 1.0 }, { tipo: 'arbusto', x: 4.5, h: 1.2 }];
    // desenha a superfície no meio de uma troca: o tamanho das plantas é interpolado e as cores das duas estações se misturam
    function superficieTroca(ctx, de, para, u, x0, w, z, T, plantas, bocas) {
      const E = A.ESTACOES, k0 = E[de].planta, k1 = E[para].planta, k = lerp(k0, k1, u);
      try {
        E[de].planta = k; E[para].planta = k;
        if (u < 1) A.superficie(ctx, de, x0, w, z, T, plantas, bocas);
        if (u > 0) { ctx.save(); ctx.globalAlpha = u; A.superficie(ctx, para, x0, w, z, T, plantas, bocas); ctx.restore(); }
      } finally { E[de].planta = k0; E[para].planta = k1; }
    }
    function estacao(ctx, z, T, tags) {
      const t = mod(T, 16), i = Math.floor(t / 4), de = SEQ[(i + 3) % 4], para = SEQ[i], tt = t - i * 4;
      superficieTroca(ctx, de, para, suave(clamp(tt / 1.6)), -1, 8, z, T, PL4, []);
      const px = 1 / z;
      // folhas caindo: no inverno (todas) e no começo do outono (poucas, amarelas)
      if ((para === 'inverno' || para === 'outono') && tt < 3.6) {
        const n = para === 'inverno' ? 18 : 7, cores = para === 'inverno' ? [mix(C.veg, '#C47A3A', 0.5), mix(C.veg, '#C9A24A', 0.45), '#A8743E'] : [mix(C.veg, '#E2B860', 0.5), mix(C.veg, '#C9A24A', 0.4)];
        ctx.save();
        for (let j = 0; j < n; j++) {
          const pl = PL4[j % 4], t0 = (j / n) * 1.2, u = (tt - t0) / 2.2; if (u <= 0 || u >= 1) continue;
          const xa = pl.x + ((j * 37) % 7 - 3) * 0.08, yTopo = gnd(pl.x) - pl.h * (0.5 + ((j * 13) % 5) * 0.08), x = xa + u * (0.9 + (j % 3) * 0.3) + 0.1 * Math.sin(u * 9 + j), y = lerp(yTopo, gnd(x) - 0.02, Math.min(1, u * 1.25));
          ctx.globalAlpha = u > 0.8 ? (1 - u) / 0.2 : 1; ctx.fillStyle = cores[j % cores.length]; ell(ctx, x, y, 0.06, 0.025, Math.sin(u * 8 + j) * 1.2); ctx.fill();
        }
        ctx.restore();
      }
      // brotos e flores abrindo na primavera
      if (para === 'primavera' && tt < 3.8) {
        ctx.save();
        for (let j = 0; j < 10; j++) {
          const x = 0.15 + j * 0.52 + ((j * 29) % 5) * 0.04, y = gnd(x), k = suave(clamp((tt - 0.3 - j * 0.1) / 0.8)); if (k <= 0) continue;
          ctx.globalAlpha = clamp((3.8 - tt) / 0.6); ctx.strokeStyle = mix(C.veg, '#B8F0A0', 0.2); ctx.lineWidth = Math.max(1 * px, 0.02); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - 0.16 * k); ctx.stroke();
          ctx.fillStyle = mix(C.veg, '#B8F0A0', 0.25); [-1, 1].forEach(sd => { ell(ctx, x + sd * 0.04 * k, y - 0.12 * k, 0.045 * k, 0.02 * k, sd * 0.5); ctx.fill(); });
          if (j % 2) { ctx.fillStyle = ['#EFE7DC', '#E8C9D6', '#F2E2A8'][j % 3]; ctx.beginPath(); ctx.arc(x, y - 0.18 * k, 0.035 * k, 0, TAU); ctx.fill(); }
        }
        ctx.restore();
      }
      if (LOD(z) !== 'geral') tags.push({ txt: A.ESTACOES[para].nome, x: 1.15, y: -1.85 });
    }

    Object.assign(A.eventos, { corte, ataqueCima, voo, estacao, superficieTroca, vela });
  })();

  // ================= formigas e aranha de perfil (D120) =================
  // O formigueiro é um corte de lado: na superfície e dentro das câmaras, as formigas e os inimigos aparecem de perfil,
  // "de pé", com os pés tocando o chão. Nos túneis continuam vistos de cima; a troca é na porta e na boca do cortadouro.
  // Corpo com volume e sem olho; pernas em tripé com o corpo balançando de leve e as antenas tateando; aranha de pernas altas.
  // Quem decide o lugar é um classificador: A.estrutura liga o da câmara (piso, parede e teto da cúpula) e as cenas da
  // superfície ligam o do chão (A.perfil.naSup). No piso da câmara, virar no lugar encolhe a largura, como um giro.
  (() => {
    const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v)), lerp = (a, b, k) => a + (b - a) * k;
    let lugar = null, ultimo = false;
    function comLugar(f, fn) { const p = lugar; lugar = f(p); try { return fn(); } finally { lugar = p; } }

    // corpos (unidade = ANT_UNIT; frente em +x, cima em -y; eixo do corpo em y = 0, pés em y = H)
    // gas, pec, tor, pro, cab: [x, y, rx, ry, giro]. hips: onde a perna sai do tórax; pes: x do pé parado; L: [coxa, canela]
    const BASE = {
      H: 3.6, gas: [-4.4, 0.1, 3.3, 2.3, -0.15], pec: [-0.6, -0.45, 0.7, 0.9, 0], tor: [1.6, -0.35, 2.0, 1.15, -0.2], pro: [2.5, -0.75, 1.05, 0.9, 0], cab: [4.7, -0.9, 1.75, 1.45, 0.35],
      hips: [[2.6, 0.3], [1.6, 0.5], [0.7, 0.45]], pes: [5.0, 1.9, -2.6], L: [[2.5, 3.0], [2.3, 2.8], [2.8, 3.3]], mand: 'normal',
    };
    const VAR = {
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
    const corpos = {}, corpoDe = c => corpos[c] || (corpos[c] = Object.assign({}, BASE, VAR[c] || {}));
    // aranha de pernas altas: a canela bem mais longa que a coxa faz o joelho subir acima do corpo
    const ARANHA = { H: 2.8, cef: [1.8, -0.9, 1.9, 1.4, 0.08], abd: [-2.5, -1.5, 2.9, 2.4, 0.35], hips: [[2.7, 0.1], [2.2, 0.25], [1.6, 0.25], [1.0, 0.1]], pes: [7.5, 4.8, -1.8, -5.0], L: [[3.4, 6.0], [3.0, 5.0], [3.0, 5.0], [3.4, 6.0]], lw: 0.5 };

    // perna de dois segmentos: o joelho fica sempre do lado de cima
    function ik(hx, hy, fx, fy, L1, L2) {
      let d = Math.hypot(fx - hx, fy - hy) || 1e-6; const ux = (fx - hx) / d, uy = (fy - hy) / d;
      if (d > L1 + L2 - 0.02) { d = L1 + L2 - 0.02; fx = hx + ux * d; fy = hy + uy * d; }
      d = Math.max(d, Math.abs(L1 - L2) + 0.02);
      const a = (L1 * L1 - L2 * L2 + d * d) / (2 * d), h = Math.sqrt(Math.max(0, L1 * L1 - a * a)), px = hx + ux * a, py = hy + uy * a;
      const k1 = { x: px - uy * h, y: py + ux * h }, k2 = { x: px + uy * h, y: py - ux * h }, k = k1.y < k2.y ? k1 : k2;
      return { kx: k.x, ky: k.y, fx, fy };
    }
    // forma com volume: parte de baixo mais escura e um brilho em cima (sem olho)
    function pinta(S, cam, cx, cy, rx, ry) {
      const ctx = S.ctx; cam();
      if (S.dashed) { ctx.setLineDash([1.2, 1.2]); ctx.strokeStyle = C.txt2; ctx.lineWidth = 0.7; ctx.stroke(); ctx.setLineDash([]); return; }
      ctx.fillStyle = S.col; ctx.fill();
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
      const ctx = S.ctx, [hx, hy, rx, ry] = S.B.cab, bx = hx + rx * 0.3, by = hy - ry * 0.75, w = Math.sin(S.t3) * 0.16;
      ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = Math.max(S.lw * 0.85, 0.34);
      [[false, 0.35], [true, 0]].forEach(([perto, off]) => {
        const cor = perto ? S.corAnt : S.corAntLonge, a1 = -1.2 + w + (perto ? 0 : -0.14), ex = bx + off + Math.cos(a1) * 2.0, ey = by + Math.sin(a1) * 2.0;
        const a2 = -0.3 + w * 1.6 + (perto ? 0 : 0.12) + Math.sin(S.t3 * 1.3 + (perto ? 0 : 1)) * 0.12, px = ex + Math.cos(a2) * 2.6, py = ey + Math.sin(a2) * 2.6;
        ctx.strokeStyle = cor; ctx.beginPath(); ctx.moveTo(bx + off, by); ctx.lineTo(ex, ey); ctx.lineTo(px, py); ctx.stroke();
        ctx.fillStyle = cor; ctx.beginPath(); ctx.arc(px, py, Math.max(ctx.lineWidth * 0.85, 0.32), 0, TAU); ctx.fill();
      });
    }
    function mandibula(S, tipo) {
      if (S.dashed) return; const ctx = S.ctx, [hx, hy, rx, ry] = S.B.cab, mx = hx + rx * 0.78, my = hy + ry * 0.45;
      const len = tipo === 'grande' ? 2.4 : tipo === 'longa' ? 2.8 : 1.3, gr = tipo === 'grande' ? 0.9 : 0.45;
      ctx.fillStyle = mix(S.col, C.base, 0.18); ctx.beginPath(); ctx.moveTo(mx - 0.5, my - gr); ctx.quadraticCurveTo(mx + len * 0.8, my - gr * 0.6, mx + len, my + 0.55); ctx.quadraticCurveTo(mx + len * 0.4, my + 0.15, mx - 0.4, my + gr * 0.5); ctx.closePath(); ctx.fill();
    }
    // asa da alada: fechada (bate 1) deitada para trás; aberta (bate 0) erguida
    function asa(S, perto, bate) {
      const ctx = S.ctx, [tx, ty, , tr] = S.B.tor, r = lerp(0.12, 1.25, 1 - bate) + (perto ? 0 : 0.22);
      ctx.save(); ctx.translate(tx + 0.2, ty - tr * 0.85); ctx.rotate(r); ctx.globalAlpha *= perto ? 0.42 : 0.28; ctx.fillStyle = C.txt;
      ctx.beginPath(); ctx.ellipse(-4.2, -0.15, 4.7, 1.3, 0, 0, TAU); ctx.fill();
      ctx.strokeStyle = C.txt; ctx.lineWidth = 0.3; ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(-3, -0.9, -8.2, -0.5); ctx.stroke(); ctx.restore();
    }

    function corpoFormiga(S, o) {
      const ctx = S.ctx, B = S.B;
      if (B.asas && !S.dashed) asa(S, false, o.bate == null ? 1 : o.bate);
      if (B.gota) { const cam = () => { ctx.beginPath(); ctx.moveTo(-11.2, -1.8); ctx.quadraticCurveTo(-8.4, -3.4, -4.6, -2.5); ctx.ellipse(-4.4, 0, 2.9, 2.5, 0, -PI / 2, PI / 2); ctx.quadraticCurveTo(-8.0, 2.4, -11.2, -1.8); ctx.closePath(); }; pinta(S, cam, -6, 0, 5, 2.5); if (!S.dashed) { ctx.fillStyle = C.acu; ctx.beginPath(); ctx.arc(-11.8, -2.1, 0.75, 0, TAU); ctx.fill(); } }
      else if (B.anel) { const [x, y, rx, ry, r] = B.gas; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, r, 0, TAU); ctx.strokeStyle = S.dashed ? C.txt2 : S.col; ctx.lineWidth = 1.4; if (S.dashed) ctx.setLineDash([1.2, 1.2]); ctx.stroke(); ctx.setLineDash([]); if (!S.dashed) { ctx.fillStyle = S.col; ctx.fillRect(x - 0.45, y - 1.3, 0.9, 2.6); ctx.fillRect(x - 1.3, y - 0.45, 2.6, 0.9); } }
      else E(S, B.gas);
      if (B.bomba && !S.dashed) { const [x, y, rx, ry] = B.gas; ctx.beginPath(); ctx.ellipse(x, y, rx + 1.0, ry + 1.0, 0, 0, TAU); ctx.setLineDash([1.1, 1.1]); ctx.strokeStyle = S.col; ctx.lineWidth = 0.55; ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = 'rgba(0,0,0,0.28)'; [[-6.6, -1.6], [-4.3, 1.0], [-5.8, 1.9]].forEach(([a, b]) => { ctx.beginPath(); ctx.arc(a, b, 0.6, 0, TAU); ctx.fill(); }); }
      if (B.listras && !S.dashed) { ctx.strokeStyle = 'rgba(0,0,0,0.2)'; ctx.lineWidth = 0.45; ctx.beginPath(); [-10.5, -8.0, -5.5].forEach(a => { ctx.moveTo(a, -4.0); ctx.quadraticCurveTo(a - 0.9, 0, a, 3.6); }); ctx.stroke(); }
      if (B.toco && !S.dashed) { ctx.save(); ctx.globalAlpha *= 0.3; ctx.fillStyle = C.txt; ctx.beginPath(); ctx.ellipse(0.0, -2.4, 2.6, 0.9, 0.3, 0, TAU); ctx.fill(); ctx.restore(); }
      E(S, B.pec); E(S, B.tor); E(S, B.pro);
      if (B.espinhos && !S.dashed) { ctx.fillStyle = S.col; [[0.9, -1.2, 0.5, -2.5], [2.3, -1.5, 2.1, -2.7]].forEach(([a, b, c, d]) => { ctx.beginPath(); ctx.moveTo(a - 0.45, b + 0.3); ctx.lineTo(c, d); ctx.lineTo(a + 0.45, b + 0.3); ctx.closePath(); ctx.fill(); }); }
      // cabeça: balança com o "nod" de quem trabalha
      ctx.save();
      if ('nod' in o && o.nod) { const [hx, hy, rx] = B.cab, nx = hx - rx * 0.8; ctx.translate(nx, hy); ctx.rotate(o.nod * 0.2); ctx.translate(-nx, -hy); }
      if (B.caixa) { pinta(S, () => { ctx.beginPath(); ctx.roundRect(3.0, -2.6, 3.9, 3.4, 0.9); }, 5, -0.9, 2, 1.7); pinta(S, () => { ctx.beginPath(); ctx.roundRect(7.1, -2.4, 0.9, 3.3, 0.4); }, 7.5, -0.8, 0.5, 1.6); }
      else { E(S, B.cab); mandibula(S, B.mand); }
      if (B.faixa && !S.dashed) { const [hx, hy, rx, ry, r] = B.cab; ctx.save(); ctx.beginPath(); ctx.ellipse(hx, hy, rx, ry, r, 0, TAU); ctx.clip(); ctx.fillStyle = '#A92A35'; ctx.fillRect(hx - 1.6, hy - 3, 1.4, 6); ctx.restore(); }
      if (B.escudo) { pinta(S, () => { ctx.beginPath(); ctx.arc(4.6, -0.9, 2.9, -PI / 2, PI / 2); ctx.closePath(); }, 5.6, -0.9, 1.5, 2.9); if (!S.dashed) { ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.lineWidth = 0.45; ctx.beginPath(); ctx.arc(4.6, -0.9, 2.2, -PI / 2 + 0.2, PI / 2 - 0.2); ctx.stroke(); } }
      if (S.lod === 'perto' && !S.dashed) antenas(S);
      ctx.restore();
    }
    function corpoAranha(S, o) {
      const ctx = S.ctx, B = S.B, perna = perto => {
        const traca = () => { ctx.beginPath(); B.hips.forEach(([hx, hy], i) => {
          const grupo = (i % 2 === 0) === perto, p = S.fase + (grupo ? 0 : PI), dx = perto ? 0 : 0.6, dy = perto ? 0 : -0.3;
          const sw = S.anda ? Math.sin(p) * 1.0 : 0, ergue = S.anda ? Math.max(0, Math.cos(p)) * 0.9 : 0;
          const k = ik(hx + dx, hy + dy, B.pes[i] + dx + sw, B.H - ergue, B.L[i][0], B.L[i][1]);
          ctx.moveTo(hx + dx, hy + dy); ctx.lineTo(k.kx, k.ky); ctx.lineTo(k.fx, k.fy);
        }); ctx.stroke(); };
        ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        if (S.lod === 'perto') { ctx.strokeStyle = '#120D0A'; ctx.lineWidth = B.lw + 0.35; traca(); }
        ctx.strokeStyle = perto ? S.col : mix(S.col, '#120D0A', 0.45); ctx.lineWidth = Math.max(B.lw, S.lw); traca();
      };
      perna(false); E(S, B.abd); E(S, B.cef);
      const [cx, cy, rx, ry] = B.cef;
      if (!S.dashed) {
        // quelíceras: abrem quando ela morde (parada, com "nod")
        const abre = 'nod' in o ? 0.35 + 0.35 * Math.max(0, Math.sin((A.TEMPO || 0) * 14)) : 0.1;
        ctx.fillStyle = mix(S.col, '#120D0A', 0.3); ctx.save(); ctx.translate(cx + rx * 0.85, cy + ry * 0.45); ctx.rotate(abre); ctx.beginPath(); ctx.moveTo(-0.4, -0.5); ctx.quadraticCurveTo(1.1, -0.2, 0.6, 1.5); ctx.quadraticCurveTo(0.2, 0.6, -0.5, 0.4); ctx.closePath(); ctx.fill(); ctx.restore();
        if (S.lod === 'perto') { ctx.strokeStyle = S.col; ctx.lineWidth = 0.55; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(cx + rx * 0.7, cy + ry * 0.2); ctx.lineTo(cx + rx * 0.7 + 1.3, cy + ry * 0.2 + 0.6); ctx.lineTo(cx + rx * 0.7 + 1.7, cy + ry * 0.2 + 1.6); ctx.stroke(); }
      }
      perna(true);
    }

    // desenha de perfil. L: { pe (distância até o chão, em células), n (normal do chão), modo 'chao', voa }
    function perfil(ctx, casta, x, y, ang, z, o, L) {
      const lod = LOD(z), inimigo = !!A.INIMIGOS[casta], spec = A.CASTAS[casta] || A.INIMIGOS[casta] || A.CASTAS.operaria, aranha = casta === 'aranha';
      const sc = A.ANT_UNIT * spec.esc * (o.scale || 1), B = aranha ? ARANHA : corpoDe(casta);
      const cg = inimigo ? null : (A.corCasta ? A.corCasta(casta) : A.COR_GRUPO[A.GRUPO[casta]]);
      const col = o.col || (inimigo ? C.perigo : cg ? mix(C.txt, cg, A.TINTA) : C.txt);
      const ca = Math.cos(ang), sa = Math.sin(ang);
      let rot = ang, fx = 1, fy = 1;
      if (L.voa) { const fc = ca >= 0 ? 1 : -1, t = fc > 0 ? ang : ang - PI; rot = clamp(Math.atan2(Math.sin(t), Math.cos(t)), -0.6, 0.6); fx = fc; }
      else if (L.modo === 'chao') { rot = L.tilt || 0; fx = (ca >= 0 ? 1 : -1) * Math.max(0.12, Math.abs(ca)); }
      else { const n = L.n || { x: 0, y: 1 }, lx = -sa, ly = ca, d = lx * n.x + ly * n.y; if (Math.abs(d) > 0.3) fy = Math.sign(d); else { const n2 = Math.abs(n.y) > 0.5 ? { x: 1, y: 0 } : { x: 0, y: 1 }; fy = Math.sign(lx * n2.x + ly * n2.y) || 1; } }
      const anda = !('nod' in o) && !o.dashed && !L.voa && lod === 'perto', fase = (A.TEMPO || 0) * (aranha ? 11 : 13) + x * 9 + y * 5;
      const S = {
        ctx, B, col, lod, dashed: o.dashed, anda, voa: L.voa, fase, t3: (A.TEMPO || 0) * 3 + x * 4,
        lw: Math.max(1 / (z * sc), 0.42), corPerna: mix(col, C.base, 0.3), corPernaLonge: mix(col, C.base, 0.6), corAnt: mix(col, C.base, 0.4), corAntLonge: mix(col, C.base, 0.62),
      };
      const pe = L.voa ? null : (L.pe == null ? 0.075 : L.pe), bob = anda ? 0.16 * Math.cos(2 * fase) : 0;
      const inv = ctx.getTransform().inverse();
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sc * fx, sc * fy);
      ctx.translate(0, pe == null ? 0 : pe / sc - B.H); // pés no chão
      if (bob) { ctx.translate(0, -Math.abs(bob)); ctx.rotate(0.025 * Math.sin(fase)); }
      if (aranha) corpoAranha(S, o);
      else {
        if (!o.dashed) pernas(S, false);
        corpoFormiga(S, o);
        if (!o.dashed) pernas(S, true);
        if (B.asas && !o.dashed) asa(S, true, o.bate == null ? 1 : o.bate);
      }
      const m1 = ctx.getTransform(), W = (lx, ly) => inv.transformPoint(m1.transformPoint(new DOMPoint(lx, ly)));
      ctx.restore();
      if (!aranha) {
        const [hx, hy, rx, ry] = B.cab;
        if (o.carry) { const p = W(hx + rx * 0.9 + 0.06 / sc, hy - 0.4); A.item(ctx, o.carry, p.x, p.y, 0.15); }
        // a vela sai da boca para o lado das costas, um pouco inclinada para trás (no caule, fica de lado)
        if (o.vela && A.eventos && A.eventos.vela) { const b = W(hx + rx * 0.55, hy - ry * 0.55), f0 = W(0, 0), up = W(-0.3, -1); A.eventos.vela(ctx, b.x, b.y, 0.1, o.vela.rot + Math.atan2(up.x - f0.x, -(up.y - f0.y)), o.vela.cor); }
      }
      if (o.combatIcon && spec.combate && lod === 'perto') A.combatIcon(ctx, spec.combate, x, y - 0.3 * spec.esc, 8 / z);
    }

    // ---------- onde a formiga está ----------
    // superfície: acima da linha do chão. No chão os pés tocam a terra; subindo na planta, os pés ficam no caule
    const lugarSup = prev => (x, y, ang, casta, o) => {
      const d = A.gnd(x) - y; if (d < -0.02) return prev ? prev(x, y, ang, casta, o) : null;
      if (casta === 'alada' && o.bate != null && d > 0.16) return { tipo: 'sup', voa: true };
      return { tipo: 'sup', n: { x: 0, y: 1 }, pe: d < 0.25 && Math.abs(Math.cos(ang)) > 0.3 ? Math.max(0, d) : 0 };
    };
    // câmara: dentro da cúpula. No piso, de pé; na parede e no teto, os pés vão para a terra
    const naCamara = (g, x, y, ang) => {
      const rx = (g.x1 - g.x0) / 2, ry = g.yw - g.yt, ux = (x - g.cx) / rx, uy = (y - g.yw) / ry;
      if (!(x > g.x0 - 0.03 && x < g.x1 + 0.03 && y < g.yb + 0.03 && (y > g.yw || ux * ux + uy * uy < 1.2))) return null;
      const dChao = g.floor - y; let dP, n;
      if (y > g.yw) { const dl = x - g.x0, dr = g.x1 - x; dP = Math.min(dl, dr); n = { x: dl < dr ? -1 : 1, y: 0 }; }
      else { const r = Math.hypot(ux, uy) || 1e-6, nx = ux / rx, ny = uy / ry, nl = Math.hypot(nx, ny) || 1; dP = Math.max(0, (1 - r) * Math.min(rx, ry)); n = { x: nx / nl, y: ny / nl }; }
      if (dChao < 0.4 && dChao > -0.05 && dP > 0.2) return { tipo: 'cam', modo: 'chao', pe: Math.max(0, dChao) };
      if (Math.abs(Math.cos(ang)) > 0.35 && dChao < 0.4) return { tipo: 'cam', n: { x: 0, y: 1 }, pe: Math.max(0, dChao) };
      return { tipo: 'cam', n, pe: clamp(dP, 0, 0.25) };
    };
    const lugarCam = (g, prev) => (x, y, ang, casta, o) => naCamara(g, x, y, ang) || (prev ? prev(x, y, ang, casta, o) : null);
    // câmaras já desenhadas neste quadro e neste canvas: as formigas desenhadas depois, por fora de A.estrutura, também ficam de pé
    const vistas = new WeakMap();
    function registra(ctx, g) { let r = vistas.get(ctx); if (!r || r.t !== A.TEMPO) { r = { t: A.TEMPO, gs: [] }; vistas.set(ctx, r); } r.gs.push(g); }
    function lugarPadrao(ctx, x, y, ang) { const r = vistas.get(ctx); if (!r || r.t !== A.TEMPO) return null; for (const g of r.gs) { const L = naCamara(g, x, y, ang); if (L) return L; } return null; }

    const antHook0 = A.antHook;
    A.antHook = (ctx, casta, x, y, ang, z, o) => {
      ultimo = false;
      if (A.perfil.ligado && casta !== 'lacraia' && (LOD(z) === 'perto' || LOD(z) === 'medio')) {
        const L = (lugar && lugar(x, y, ang, casta, o)) || lugarPadrao(ctx, x, y, ang);
        if (L) { perfil(ctx, casta, x, y, ang, z, o, L); ultimo = true; return true; }
      }
      return antHook0 ? antHook0(ctx, casta, x, y, ang, z, o) : false;
    };
    const est0 = A.estrutura;
    A.estrutura = function (ctx, sp, x, y, st, z, o = {}) {
      const g = A.geom(sp, x, y, o.seed), args = arguments; registra(ctx, g);
      return comLugar(prev => lugarCam(g, prev), () => est0.apply(this, args));
    };
    const naSup = fn => function (...a) { return comLugar(prev => lugarSup(prev), () => fn.apply(this, a)); };
    // piso reto (fichas do catálogo): pés na linha y = chao
    const piso = (chao, fn) => comLugar(() => (x, y) => ({ tipo: 'cam', modo: 'chao', pe: Math.max(0, chao - y) }), fn);
    A.perfil = { ligado: true, naSup, piso, registra, ultimo: () => ultimo };
    ['corte', 'ataqueCima', 'voo', 'estacao'].forEach(k => { if (A.eventos && A.eventos[k]) A.eventos[k] = naSup(A.eventos[k]); });
  })();

  Object.assign(A, { TINTA: 0.25, caminhoPorta, encaixe, ligacao, CICLO: 4, PAUSA: 0.8, salto, NOME_GRUPO, SOLO, solo, superficie, gnd, PLANTAS, planta, itemA, formiga, GRUPO, COR_GRUPO, ICS, icone });
})();

// ---------------- D124: câmara em arco cheio, terra batida, brilho do trabalho e ofício mais presente (rodada 15) ----------------
(function () {
  const A = window.Arte, C = A.C, mix = A.mix;
  const rgba = (hex, a) => 'rgba(' + [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16)).join(',') + ',' + a + ')';
  const semente = g => Math.abs(Math.round(g.x * 13 + g.y * 7)) + 1;
  // forma: sem parede reta; meia superelipse de ombros cheios, com os cantos do chão redondos
  function arcoCheio(ctx, g) {
    const rb = 0.3, base = g.yb - rb * 0.55, rx = (g.x1 - g.x0) / 2, ry = base - g.yt, n = 2.35, r = A.rng(semente(g)), ph = r() * 6.28;
    ctx.beginPath(); ctx.moveTo(g.x0 + rb, g.yb); ctx.quadraticCurveTo(g.x0, g.yb, g.x0, base);
    for (let k = 0; k <= 48; k++) {
      const th = Math.PI + k / 48 * Math.PI, c = Math.cos(th), s = Math.sin(th), v = 1 + 0.035 * Math.sin(3 * th + ph) * Math.sin(k / 48 * Math.PI);
      ctx.lineTo(g.cx + rx * Math.sign(c) * Math.pow(Math.abs(c), 2 / n), base + ry * v * Math.sign(s) * Math.pow(Math.abs(s), 2 / n));
    }
    ctx.quadraticCurveTo(g.x1, g.yb, g.x1 - rb, g.yb); ctx.closePath();
  }
  // parede de terra batida por fora, interior tingido (D103), luz quente do chão e piso de terra
  function terraBatida(ctx, sp, g, st, z, T, fill) {
    const lod = A.LOD(z), fam = sp.fam[0], px = 1 / z, w = g.x1 - g.x0, h = g.yb - g.yt;
    if (lod !== 'geral') {
      A.domePath(ctx, g); ctx.lineJoin = 'round'; ctx.strokeStyle = 'rgba(70,52,38,0.45)'; ctx.lineWidth = 0.26; ctx.stroke();
      A.domePath(ctx, g); ctx.strokeStyle = 'rgba(52,39,29,0.6)'; ctx.lineWidth = 0.12; ctx.stroke();
      // o alerta continua sendo o pulso na borda (D103), agora por cima da terra batida
      const a = A.alertOf(st); if (a) { const k = a === 'red' ? A.pulse(T, 1, A.INTEN) : A.pulse(T, 0.5, 0.75 * A.INTEN); A.domePath(ctx, g); ctx.strokeStyle = mix('#3A2C20', a === 'red' ? C.cheio : C.quase, Math.min(1, k * 2.2)); ctx.lineWidth = 0.12 + 3 * px; ctx.stroke(); }
    }
    A.domePath(ctx, g);
    if (sp.fam.length === 2) { ctx.save(); ctx.clip(); ctx.fillStyle = fill(mix(C.base, sp.fam[0], 0.13)); ctx.fillRect(g.x0 - 1, g.yt - 1, g.cx - g.x0 + 1, 4); ctx.fillStyle = fill(mix(C.base, sp.fam[1], 0.13)); ctx.fillRect(g.cx, g.yt - 1, g.x1 - g.cx + 1, 4); ctx.restore(); }
    else { ctx.fillStyle = fill(fam ? mix(C.base, fam, 0.13) : C.base); ctx.fill(); }
    if (lod === 'geral') return true;
    ctx.save(); A.domePath(ctx, g); ctx.clip();
    const sh = ctx.createLinearGradient(0, g.yt, 0, g.yb); sh.addColorStop(0, 'rgba(0,0,0,0.38)'); sh.addColorStop(0.6, 'rgba(0,0,0,0.08)'); sh.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = sh; ctx.fillRect(g.x0 - 1, g.yt - 1, w + 2, h + 2);
    if (st !== 'pausada') {
      const quente = mix('#FFCF8F', fam || '#FFCF8F', fam ? 0.35 : 0), rg = ctx.createRadialGradient(g.cx, g.floor, 0, g.cx, g.floor, Math.max(w * 0.62, h * 1.1));
      rg.addColorStop(0, rgba(quente, 0.26)); rg.addColorStop(0.45, rgba(quente, 0.1)); rg.addColorStop(1, rgba(quente, 0)); ctx.fillStyle = rg; ctx.fillRect(g.x0 - 1, g.yt - 1, w + 2, h + 2);
    }
    A.domePath(ctx, g); const rl = ctx.createLinearGradient(0, g.yt, 0, g.yb); rl.addColorStop(0, 'rgba(255,232,200,0.16)'); rl.addColorStop(1, 'rgba(255,232,200,0.03)'); ctx.strokeStyle = rl; ctx.lineWidth = 0.1; ctx.stroke();
    const nv2 = st === 'nivel2';
    ctx.fillStyle = nv2 ? mix(C.base, C.min, 0.45) : mix(C.base, C.min, 0.16); ctx.fillRect(g.x0, g.yb - 0.08, w, 0.08);
    ctx.fillStyle = 'rgba(255,232,200,0.10)'; ctx.fillRect(g.x0, g.yb - 0.08, w, 0.014);
    ctx.restore();
    return true;
  }
  const propsBase = A.propsHook;
  // ofício mais presente: o mesmo cenário da D110, com mais luz e um pouco mais de cor
  const propsVivo = (ctx, sp, g, st, z, T) => { if (!propsBase) return; ctx.save(); ctx.filter = 'brightness(1.75) saturate(1.2)'; propsBase(ctx, sp, g, st, z, T); ctx.restore(); };
  Object.assign(A, { arcoCheio, terraBatida, propsBase, propsVivo, formaHook: arcoCheio, cascaHook: terraBatida, propsHook: propsVivo });
})();


// =============== TERRA BATIDA NOS TÚNEIS (D125) ===============
// O túnel ganha a mesma terra batida da câmara (D124), mais fina: uma faixa escura em volta e o fio de luz
// nas bordas de dentro. Fases: 'antes' (faixa, por baixo do corpo), 'depois' (fio de luz) e 'porta'
// (o fio de luz continua até a parede da câmara, por cima do encaixe). O batente da D114 continua.
(() => {
  const A = window.Arte, C = A.C, H1 = 0.11, H2 = 0.05;
  const caminho = (ctx, p) => { ctx.beginPath(); p.pts.forEach((q, i) => i ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y)); };
  function terraBatidaTunel(ctx, p, w, z, st, fase, s0, s1) {
    if (A.LOD(z) === 'geral') return; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    if (fase === 'antes') { caminho(ctx, p); ctx.strokeStyle = 'rgba(70,52,38,0.45)'; ctx.lineWidth = w + H1; ctx.stroke(); caminho(ctx, p); ctx.strokeStyle = 'rgba(52,39,29,0.6)'; ctx.lineWidth = w + H2; ctx.stroke(); return; }
    if (st === 'alagado') return;
    if (fase === 'porta') { const pts = []; for (let t = s0; t <= s1; t += 0.03) pts.push(A.at(p, t)); p = { pts }; ctx.lineCap = 'butt'; }
    caminho(ctx, p); ctx.strokeStyle = 'rgba(255,232,200,0.13)'; ctx.lineWidth = w; ctx.stroke();
    caminho(ctx, p); ctx.strokeStyle = C.base; ctx.lineWidth = Math.max(w - 0.1, w * 0.55); ctx.stroke();
  }
  Object.assign(A, { terraBatidaTunel, faixaTunelHook: terraBatidaTunel });
})();
