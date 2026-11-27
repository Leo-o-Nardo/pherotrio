'use strict';
// Rodada 12 · Som e música (Q31). Rascunhos sintetizados no navegador (Web Audio), só para comparar direções.
(() => {
  let ctx, master, revIn, sfxBus, BR, MA, RO, VOL = null;
  const nivelVol = { mus: 0.8, efe: 0.8 }; // configurações do jogo: volume da música e dos efeitos (D121)
  const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
  const rnd = (a, b) => a + Math.random() * (b - a);

  function init() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -16; comp.ratio.value = 3; comp.attack.value = 0.01; comp.release.value = 0.25;
    master = ctx.createGain(); master.gain.value = 0.8; master.connect(comp); comp.connect(ctx.destination);
    const rev = ctx.createConvolver(); rev.buffer = impulso(2.8, 2.4); revIn = ctx.createGain(); revIn.connect(rev);
    const rg = ctx.createGain(); rg.gain.value = 0.5; rev.connect(rg); rg.connect(master);
    VOL = { mus: ctx.createGain(), musR: ctx.createGain(), efe: ctx.createGain(), efeR: ctx.createGain() };
    VOL.mus.connect(master); VOL.musR.connect(revIn); VOL.efe.connect(master); VOL.efeR.connect(revIn);
    setVol('mus', nivelVol.mus); setVol('efe', nivelVol.efe);
    sfxBus = ctx.createGain(); sfxBus.gain.value = 0.9; sfxBus.connect(VOL.efe);
    const ss = ctx.createGain(); ss.gain.value = 0.22; sfxBus.connect(ss); ss.connect(VOL.efeR);
    BR = ruido('branco'); MA = ruido('marrom'); RO = ruido('rosa');
  }
  // volume de 0 a 1, com curva perceptiva; o ambiente segue o volume dos efeitos
  function setVol(k, v) {
    nivelVol[k] = v; if (!VOL) return; const g = v * v / 0.64, t = ctx.currentTime;
    VOL[k].gain.setTargetAtTime(g, t, 0.05); VOL[k + 'R'].gain.setTargetAtTime(g, t, 0.05);
  }
  function impulso(dur, dec) {
    const n = ctx.sampleRate * dur, b = ctx.createBuffer(2, n, ctx.sampleRate);
    for (let c = 0; c < 2; c++) { const d = b.getChannelData(c); for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, dec); }
    return b;
  }
  function ruido(tipo) {
    const n = ctx.sampleRate * 3, b = ctx.createBuffer(1, n, ctx.sampleRate), d = b.getChannelData(0);
    let l = 0, b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < n; i++) {
      const w = Math.random() * 2 - 1;
      if (tipo === 'branco') d[i] = w;
      else if (tipo === 'marrom') { l = (l + 0.02 * w) / 1.02; d[i] = l * 3.5; }
      else { b0 = 0.99886 * b0 + w * 0.0555179; b1 = 0.99332 * b1 + w * 0.0750759; b2 = 0.969 * b2 + w * 0.153852; b3 = 0.8665 * b3 + w * 0.3104856; b4 = 0.55 * b4 + w * 0.5329522; b5 = -0.7616 * b5 - w * 0.016898; d[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11; b6 = w * 0.115926; }
    }
    return b;
  }

  // ---------- peças básicas ----------
  function tom(tipo, f, t, v, a, dec, dest, o = {}) {
    const os = ctx.createOscillator(), g = ctx.createGain(); os.type = tipo; os.frequency.setValueAtTime(f, t);
    if (o.ate) os.frequency.exponentialRampToValueAtTime(o.ate, t + (o.em || dec));
    if (o.det) os.detune.value = o.det; if (o.lfo) o.lfo.connect(os.detune);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(Math.max(v, 0.0002), t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + dec);
    let n = os; if (o.lp) { const f2 = ctx.createBiquadFilter(); f2.type = 'lowpass'; f2.frequency.value = o.lp; os.connect(f2); n = f2; }
    n.connect(g); g.connect(dest); os.start(t); os.stop(t + a + dec + 0.05);
  }
  function sopro(t, v, a, dec, dest, filtros, buf) {
    const s = ctx.createBufferSource(); s.buffer = buf || BR; s.loop = true; let n = s;
    filtros.forEach(([tp, f, q]) => { const b = ctx.createBiquadFilter(); b.type = tp; b.frequency.value = f; if (q) b.Q.value = q; n.connect(b); n = b; });
    const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(Math.max(v, 0.0002), t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + dec);
    n.connect(g); g.connect(dest); s.start(t, Math.random() * 2); s.stop(t + a + dec + 0.05);
  }

  // ---------- instrumentos ----------
  const I = {
    kalimba(t, m, v, d) { const f = mtof(m); tom('sine', f, t, v * 0.55, 0.003, 1.6, d); tom('sine', f * 2.01, t, v * 0.1, 0.002, 0.35, d); tom('sine', f * 5.95, t, v * 0.09, 0.001, 0.08, d); sopro(t, v * 0.04, 0.001, 0.015, d, [['bandpass', 2500, 1]]); },
    madeira(t, m, v, d) { const f = mtof(m); tom('sine', f, t, v * 0.6, 0.002, 0.5, d); tom('sine', f * 3.93, t, v * 0.12, 0.001, 0.07, d); tom('sine', f * 9.2, t, v * 0.03, 0.001, 0.03, d); },
    sino(t, m, v, d) {
      const f = mtof(m), c = ctx.createOscillator(), mo = ctx.createOscillator(), mg = ctx.createGain(), g = ctx.createGain();
      c.frequency.value = f; mo.frequency.value = f * 3.5; mg.gain.setValueAtTime(f * 1.4, t); mg.gain.exponentialRampToValueAtTime(f * 0.04, t + 1.2);
      mo.connect(mg); mg.connect(c.frequency); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v * 0.3, t + 0.004); g.gain.exponentialRampToValueAtTime(0.0001, t + 2.6);
      c.connect(g); g.connect(d); c.start(t); mo.start(t); c.stop(t + 2.7); mo.stop(t + 2.7);
    },
    piano(t, m, v, d, lfo) { const f = mtof(m); tom('sine', f, t, v * 0.5, 0.004, 1.7, d, { lfo }); tom('sine', f * 2, t, v * 0.12, 0.003, 0.5, d, { lfo }); tom('triangle', f * 4, t, v * 0.03, 0.001, 0.08, d); },
    trompa(t, m, v, dur, d) {
      const os = ctx.createOscillator(), lp = ctx.createBiquadFilter(), g = ctx.createGain(); os.type = 'sawtooth'; os.frequency.value = mtof(m);
      lp.type = 'lowpass'; lp.frequency.setValueAtTime(300, t); lp.frequency.linearRampToValueAtTime(900, t + 0.3); lp.frequency.linearRampToValueAtTime(400, t + dur);
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(v * 0.25, t + 0.25); g.gain.setValueAtTime(v * 0.25, t + dur * 0.6); g.gain.linearRampToValueAtTime(0.0001, t + dur);
      os.connect(lp); lp.connect(g); g.connect(d); os.start(t); os.stop(t + dur + 0.05);
    },
    baixo(t, m, v, dur, d, tipo) {
      const os = ctx.createOscillator(), g = ctx.createGain(); os.type = tipo || 'sine'; os.frequency.value = mtof(m);
      let n = os; if (tipo && tipo !== 'sine') { const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 320; os.connect(lp); n = lp; }
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(v, t + 0.08); g.gain.setTargetAtTime(0.0001, t + dur * 0.7, dur * 0.15);
      n.connect(g); g.connect(d); os.start(t); os.stop(t + dur + 0.6);
    },
    pad(t, notas, dur, v, d, estilo) {
      const saw = estilo === 'B', lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = 0.5;
      lp.frequency.setValueAtTime(saw ? 500 : 650, t); lp.frequency.linearRampToValueAtTime(saw ? 1500 : 1000, t + dur * 0.6); lp.frequency.linearRampToValueAtTime(saw ? 700 : 750, t + dur + 1);
      const g = ctx.createGain(), vv = v / notas.length * (saw ? 0.35 : 0.9);
      g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(vv, t + Math.min(1.2, dur * 0.4)); g.gain.setValueAtTime(vv, t + dur); g.gain.linearRampToValueAtTime(0.0001, t + dur + 1.2);
      lp.connect(g); g.connect(d);
      notas.forEach(m => [-7, 7].forEach(dt => { const o = ctx.createOscillator(); o.type = saw ? 'sawtooth' : 'triangle'; o.frequency.value = mtof(m); o.detune.value = dt; o.connect(lp); o.start(t); o.stop(t + dur + 1.3); }));
    },
    bumbo(t, v, d, f0, f1) { tom('sine', f0 || 140, t, v, 0.002, 0.35, d, { ate: f1 || 45, em: 0.12 }); },
    caixa(t, v, d) { sopro(t, v * 0.5, 0.001, 0.16, d, [['bandpass', 1800, 0.8]]); tom('triangle', 190, t, v * 0.25, 0.001, 0.08, d); },
    chimbal(t, v, d) { sopro(t, v * 0.25, 0.001, 0.04, d, [['highpass', 7000]]); },
    chocalho(t, v, d) { sopro(t, v * 0.22, 0.012, 0.07, d, [['bandpass', 6500, 1.2]]); },
    tambor(t, v, d) { tom('sine', 95, t, v * 0.8, 0.003, 0.5, d, { ate: 58, em: 0.25 }); sopro(t, v * 0.2, 0.002, 0.08, d, [['lowpass', 500]]); },
    taiko(t, v, d) { tom('sine', 105, t, v, 0.003, 0.9, d, { ate: 46, em: 0.4 }); sopro(t, v * 0.35, 0.002, 0.2, d, [['lowpass', 300]]); },
    chiado(t, d) { const n = Math.floor(Math.random() * 3); for (let i = 0; i < n; i++) sopro(t + Math.random() * 0.2, rnd(0.02, 0.06), 0.0005, 0.002, d, [['highpass', 2500]]); },
  };

  // ---------- música em camadas ----------
  // ré maior; na tensão vira ré menor. 4 compassos, 8 colcheias cada.
  const HARM = {
    maior: [[50, [62, 66, 69, 73]], [47, [59, 62, 66, 69]], [43, [55, 59, 62, 66]], [45, [57, 61, 64, 69]]],
    menor: [[50, [62, 65, 69, 72]], [46, [58, 62, 65, 69]], [43, [55, 58, 62, 65]], [45, [57, 61, 64, 67]]],
  };
  const ESC = { maior: [62, 64, 66, 69, 71, 74, 76, 78, 81], menor: [62, 65, 67, 69, 72, 74, 77, 79, 81] };
  let musAtual = null;

  function Musica(estilo, nivel0, vol) {
    const bpm = { A: 84, B: 66, C: 76 }[estilo], oit = 60 / bpm / 2, agora = ctx.currentTime;
    const out = ctx.createGain(); out.gain.setValueAtTime(0.0001, agora); out.gain.linearRampToValueAtTime(vol || 0.8, agora + 1.2); out.connect(VOL.mus);
    const snd = ctx.createGain(); snd.gain.value = { A: 0.45, B: 0.6, C: 0.2 }[estilo]; out.connect(snd); snd.connect(VOL.musR);
    const extra = []; let saida = out, lfo = null;
    if (estilo === 'C') { const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2600; lp.connect(out); saida = lp; const lo = ctx.createOscillator(); lo.frequency.value = 0.35; const lg = ctx.createGain(); lg.gain.value = 9; lo.connect(lg); lo.start(); lfo = lg; extra.push(() => { lo.stop(); lg.disconnect(); }); }
    if (estilo === 'B') { const dl = ctx.createDelay(1), fb = ctx.createGain(), lp = ctx.createBiquadFilter(), wet = ctx.createGain(); dl.delayTime.value = oit * 1.5; fb.gain.value = 0.38; lp.type = 'lowpass'; lp.frequency.value = 2200; wet.gain.value = 0.35; out.connect(dl); dl.connect(lp); lp.connect(fb); fb.connect(dl); lp.connect(wet); wet.connect(VOL.mus); extra.push(() => { wet.disconnect(); }); }
    const L = [0, 1, 2, 3].map(() => { const g = ctx.createGain(); g.connect(saida); return g; });
    const alvo = (i, n) => i === 3 ? (n === 3 ? 1.25 : 0.0001) : (i <= n ? 1 : 0.0001);
    let nivel = nivel0, modo = nivel0 === 3 ? 'menor' : 'maior', passo = 0, idx = 4;
    const t0 = agora + 0.1; let prox = t0;
    L.forEach((g, i) => { g.gain.value = alvo(i, nivel0); });
    function setNivel(n) { nivel = n; L.forEach((g, i) => g.gain.setTargetAtTime(alvo(i, n), ctx.currentTime, 0.7)); }
    function anda(esc, salto) { idx = Math.max(0, Math.min(esc.length - 1, idx + salto)); return esc[idx]; }
    function tocar(p, t) {
      const e = p % 8, bar = Math.floor(p / 8) % 4;
      if (e === 0) modo = nivel === 3 ? 'menor' : 'maior';
      const [rb, ac] = HARM[modo][bar], esc = ESC[modo];
      if (estilo === 'C' && p % 2) t += oit * 0.16;
      // camada 0: tapete e baixo
      if (e === 0) I.pad(t, ac, oit * 8, estilo === 'B' ? 0.5 : 0.32, L[0], estilo);
      if (estilo === 'A') { if (e === 0) I.baixo(t, rb - 12, 0.3, oit * 4, L[0]); if (e === 4) I.baixo(t, rb - 5, 0.22, oit * 4, L[0]); }
      if (estilo === 'B' && e === 0) I.baixo(t, rb - 12, 0.28, oit * 8, L[0]);
      if (estilo === 'C') { if (e === 0 || e === 3) I.baixo(t, rb - 12, 0.3, oit * 2.5, L[0]); if (e === 6) I.baixo(t, rb - 5, 0.24, oit * 2, L[0]); I.chiado(t, L[0]); }
      // camada 1: melodia
      const r = Math.random();
      if (estilo === 'A') { if (r < (e % 2 ? 0.32 : 0.6)) I.kalimba(t, anda(esc, [-2, -1, -1, 1, 1, 2][Math.floor(Math.random() * 6)]), rnd(0.45, 0.8), L[1]); }
      if (estilo === 'B') { if (e % 2 === 0 && r < 0.38) I.sino(t, ac[Math.floor(Math.random() * 4)] + 12, rnd(0.4, 0.65), L[1]); }
      if (estilo === 'C') { if (e === 0 || e === 3) ac.forEach((m, k) => I.piano(t + k * 0.012, m, 0.22, L[1], lfo)); if (e % 2 === 0 && e && r < 0.3) I.piano(t, anda(esc, [-1, 1, 2][Math.floor(Math.random() * 3)]) + 12, 0.35, L[1], lfo); }
      // camada 2: ritmo
      if (estilo === 'A') { I.chocalho(t, e % 2 ? 0.7 : 0.4, L[2]); if (e === 0 || e === 5) I.tambor(t, 0.5, L[2]); if (e === 2 || e === 6) I.madeira(t, 86, 0.18, L[2]); }
      if (estilo === 'B') { if (e === 0 || e === 4) I.bumbo(t, 0.45, L[2], 110, 40); if (e % 2) I.chimbal(t, 0.5, L[2]); I.madeira(t, ac[e % 4] + 12, 0.16, L[2]); }
      if (estilo === 'C') { if (e === 0 || (e === 5 && r < 0.5)) I.bumbo(t, 0.7, L[2]); if (e === 2 || e === 6) I.caixa(t, 0.5, L[2]); I.chimbal(t, e % 2 ? 0.6 : 0.35, L[2]); }
      // camada 3: onda e combate, mais forte (D121): tambores em padrão de marcha, baixo pulsando, ataques graves
      const tk = [1, 0, 0.5, 0.75, 0.95, 0, 0.6, 0.45][e]; if (tk) I.taiko(t, tk, L[3]);
      if (e === 4) I.caixa(t, 0.45, L[3]);
      if (bar === 3 && e >= 6) I.caixa(t + oit * 0.5, 0.3, L[3]);
      I.baixo(t, rb - 12, e % 2 ? 0.16 : 0.26, oit * 0.8, L[3], 'sawtooth');
      if (e === 0) I.trompa(t, rb, 0.85, oit * 1.8, L[3]);
      if (e === 0 && bar === 3) I.trompa(t + oit * 6, rb + 3, 0.7, oit * 2, L[3]);
      if (e === 0 && bar % 2 === 0) I.baixo(t, 38, 0.32, oit * 16, L[3], 'sawtooth');
    }
    const id = setInterval(() => { while (prox < ctx.currentTime + 0.25) { tocar(passo, prox); passo++; prox += oit; } }, 40);
    const m = {
      nivel: setNivel, oit, modo: () => modo,
      quant: () => { const n = ctx.currentTime + 0.03; return t0 + Math.ceil((n - t0) / oit) * oit; },
      parar() {
        clearInterval(id); const t = ctx.currentTime; out.gain.cancelScheduledValues(t); out.gain.setValueAtTime(Math.max(out.gain.value, 0.0001), t); out.gain.linearRampToValueAtTime(0.0001, t + 0.6);
        setTimeout(() => { out.disconnect(); extra.forEach(f => f()); }, 3200); if (musAtual === m) musAtual = null;
      },
    };
    musAtual = m; return m;
  }

  // ---------- ambiente ----------
  function Ambiente(onde, vol) {
    const agora = ctx.currentTime, out = ctx.createGain(); out.gain.setValueAtTime(0.0001, agora); out.gain.linearRampToValueAtTime(vol || 1, agora + 1.5); out.connect(VOL.efe);
    const dn = ctx.createGain(); dn.connect(out); const sd = ctx.createGain(); sd.gain.value = 0.5; dn.connect(sd); sd.connect(VOL.efeR);
    const vivos = [], timers = [];
    function laco(buf, filtros, v, lfo) {
      const s = ctx.createBufferSource(); s.buffer = buf; s.loop = true; let n = s, prim = null;
      filtros.forEach(([tp, f, q]) => { const b = ctx.createBiquadFilter(); b.type = tp; b.frequency.value = f; if (q) b.Q.value = q; if (!prim) prim = b; n.connect(b); n = b; });
      const g = ctx.createGain(); g.gain.value = v; n.connect(g); g.connect(out);
      if (lfo) { const o = ctx.createOscillator(), og = ctx.createGain(); o.frequency.value = lfo[0]; og.gain.value = lfo[1]; o.connect(og); og.connect(lfo[2] === 'f' ? prim.frequency : g.gain); o.start(); vivos.push(o); }
      s.start(0, Math.random() * 2); vivos.push(s);
    }
    function cada(min, max, fn) { const go = () => { fn(ctx.currentTime + 0.05); timers.push(setTimeout(go, rnd(min, max) * 1000)); }; timers.push(setTimeout(go, rnd(0.1, max * 0.5) * 1000)); }
    const gota = t => { const f = rnd(1000, 1900); tom('sine', f, t, 0.1, 0.002, 0.12, dn, { ate: f * 0.55, em: 0.06 }); };
    const terrinha = t => { const n = 6 + Math.floor(Math.random() * 10); for (let i = 0; i < n; i++) sopro(t + i * rnd(0.02, 0.07), 0.05 * (1 - i / n) + 0.01, 0.001, 0.012, dn, [['bandpass', rnd(800, 2300), 1.5]]); };
    const passaro = t => {
      const b = rnd(2600, 4200);
      if (Math.random() < 0.4) { for (let i = 0; i < 8; i++) tom('sine', b, t + i * 0.045, 0.035, 0.004, 0.03, dn, { ate: b * 1.15, em: 0.03 }); return; }
      const n = 2 + Math.floor(Math.random() * 4); for (let i = 0; i < n; i++) tom('sine', b * rnd(1, 1.1), t + i * 0.12, 0.05, 0.005, 0.06, dn, { ate: b * rnd(1.3, 1.6), em: 0.05 });
    };
    if (onde === 'subsolo') { laco(MA, [['lowpass', 220]], 0.5, [0.07, 0.15]); cada(1.8, 5, gota); cada(5, 11, terrinha); }
    if (onde === 'primavera') {
      laco(BR, [['highpass', 1500], ['lowpass', 7000]], 0.09); laco(RO, [['lowpass', 900]], 0.32);
      cada(0.12, 0.2, t => { for (let k = 0; k < 3; k++) sopro(t + Math.random() * 0.15, rnd(0.03, 0.08), 0.001, rnd(0.006, 0.016), dn, [['bandpass', rnd(2500, 6500), 4]]); });
      cada(2, 5, passaro);
    }
    if (onde === 'verao') {
      laco(RO, [['lowpass', 500]], 0.3, [0.05, 0.1]);
      cada(0.55, 0.75, t => { for (let k = 0; k < 3; k++) tom('sine', 4300, t + k * 0.05, 0.06, 0.004, 0.025, dn); });
      cada(0.8, 1.1, t => { for (let k = 0; k < 4; k++) tom('sine', 3850, t + k * 0.04, 0.04, 0.004, 0.02, dn); });
      cada(9, 16, t => { const s = ctx.createBufferSource(); s.buffer = BR; s.loop = true; const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 5200; bp.Q.value = 6; const am = ctx.createGain(), g = ctx.createGain(); am.gain.value = 0.5; const o = ctx.createOscillator(); o.frequency.value = 42; const og = ctx.createGain(); og.gain.value = 0.5; o.connect(og); og.connect(am.gain); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.09, t + 1.5); g.gain.exponentialRampToValueAtTime(0.0001, t + 4); s.connect(bp); bp.connect(am); am.connect(g); g.connect(dn); s.start(t); o.start(t); s.stop(t + 4.1); o.stop(t + 4.1); });
      cada(6, 12, passaro);
    }
    if (onde === 'outono') {
      laco(RO, [['bandpass', 500, 0.8]], 0.35, [0.08, 250, 'f']); laco(MA, [['lowpass', 300]], 0.25, [0.11, 0.12]);
      cada(1.5, 4, t => { const n = 10 + Math.floor(Math.random() * 20); let tt = t; for (let i = 0; i < n; i++) { tt += rnd(0.008, 0.04); sopro(tt, rnd(0.015, 0.05), 0.001, 0.015, dn, [['bandpass', rnd(3000, 5500), 1]]); } });
      cada(8, 15, passaro);
    }
    if (onde === 'inverno') {
      laco(RO, [['bandpass', 800, 9]], 0.2, [0.06, 300, 'f']); laco(MA, [['lowpass', 180]], 0.35, [0.05, 0.2]);
      cada(6, 10, t => sopro(t, 0.22, 1.5, 2.5, dn, [['bandpass', 600, 1.2]], RO));
    }
    return {
      parar() {
        timers.forEach(clearTimeout); const t = ctx.currentTime; out.gain.cancelScheduledValues(t); out.gain.setValueAtTime(Math.max(out.gain.value, 0.0001), t); out.gain.linearRampToValueAtTime(0.0001, t + 0.8);
        setTimeout(() => { vivos.forEach(v => { try { v.stop(); } catch (e) {} }); out.disconnect(); sd.disconnect(); }, 1000);
      },
    };
  }

  // ---------- efeitos ----------
  const NOTA = () => (musAtual && musAtual.modo() === 'menor') ? ESC.menor : ESC.maior;
  let ent = 0;
  const NAT = {
    toque(t) { sopro(t, 0.7, 0.001, 0.014, sfxBus, [['bandpass', 2200, 2]]); tom('sine', 180, t, 0.45, 0.002, 0.05, sfxBus, { ate: 120, em: 0.05 }); },
    entrega(t) { sopro(t, 0.8, 0.002, 0.06, sfxBus, [['bandpass', 700, 1.5]]); sopro(t + 0.03, 0.35, 0.002, 0.04, sfxBus, [['bandpass', 1100, 2]]); },
    escavar(t) { for (let i = 0; i < 9; i++) sopro(t + i * 0.055 + Math.random() * 0.02, rnd(0.4, 0.7), 0.002, rnd(0.03, 0.06), sfxBus, [['bandpass', rnd(900, 1800), 1.2], ['lowpass', 2500]]); tom('sine', 70, t, 0.2, 0.01, 0.25, sfxBus); },
    nascimento(t) { tom('sine', 300, t, 0.45, 0.003, 0.12, sfxBus, { ate: 700, em: 0.08 }); sopro(t, 0.08, 0.002, 0.06, sfxBus, [['highpass', 3000]]); },
    obra(t) { tom('sine', 90, t, 0.45, 0.004, 0.4, sfxBus, { ate: 55, em: 0.2 }); for (let i = 0; i < 6; i++) sopro(t + 0.1 + i * 0.06, 0.1 * (1 - i / 7), 0.002, 0.05, sfxBus, [['bandpass', rnd(1200, 2000), 1]]); },
    onda(t) { sopro(t, 0.55, 1.2, 2.2, sfxBus, [['lowpass', 180]], MA); tom('sine', 55, t, 0.35, 1, 2.4, sfxBus); },
    combate(t) { for (let i = 0; i < 5; i++) { const tt = t + i * 0.13 + Math.random() * 0.04; sopro(tt, 0.7, 0.001, 0.025, sfxBus, [['bandpass', 3200, 3]]); sopro(tt + 0.012, 0.4, 0.001, 0.02, sfxBus, [['bandpass', 1800, 2]]); } },
    rainha(t) { for (let i = 0; i < 14; i++) sopro(t + i * rnd(0.05, 0.09), rnd(0.15, 0.3), 0.001, 0.02, sfxBus, [['bandpass', rnd(2200, 3400), 3]]); sopro(t, 0.4, 0.15, 1.3, sfxBus, [['lowpass', 150]], MA); },
    voo(t) {
      const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 650; bp.Q.value = 1; const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.12, t + 0.6); g.gain.exponentialRampToValueAtTime(0.0001, t + 2.2); bp.connect(g); g.connect(sfxBus);
      for (let k = 0; k < 5; k++) { const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.setValueAtTime(rnd(170, 230), t); o.frequency.linearRampToValueAtTime(rnd(200, 260), t + 2); o.connect(bp); o.start(t); o.stop(t + 2.3); }
    },
    invalido(t) { tom('sine', 120, t, 0.55, 0.003, 0.12, sfxBus, { ate: 80, em: 0.1 }); sopro(t, 0.3, 0.002, 0.06, sfxBus, [['lowpass', 600]]); },
  };
  const TON = {
    toque(t) { I.madeira(t, 86, 0.25, sfxBus); },
    entrega(t) { const e = NOTA(); I.kalimba(t, e[[0, 2, 4, 3, 5, 4, 2, 1][ent++ % 8]] + 12, 0.32, sfxBus); },
    escavar(t) { for (let i = 0; i < 4; i++) I.madeira(t + i * 0.12, i % 2 ? 50 : 57, 0.3, sfxBus); },
    nascimento(t) { const e = NOTA(); I.kalimba(t, e[2] + 12, 0.4, sfxBus); I.kalimba(t + 0.12, e[4] + 12, 0.45, sfxBus); },
    obra(t) { const e = NOTA(); [0, 2, 3, 5].forEach((k, i) => I.kalimba(t + i * 0.09, e[k] + 12, 0.38, sfxBus)); },
    onda(t) { I.trompa(t, 50, 0.9, 1.1, sfxBus); I.trompa(t + 0.55, 53, 0.9, 1.4, sfxBus); },
    combate(t) { [50, 51, 50, 51].forEach((m, i) => I.madeira(t + i * 0.1, m, 0.35, sfxBus)); },
    rainha(t) { [81, 80, 81, 80, 81, 80].forEach((m, i) => I.sino(t + i * 0.16, m, 0.55, sfxBus)); I.trompa(t, 50, 0.7, 1.2, sfxBus); },
    voo(t) { const e = ESC.maior; [0, 1, 2, 3, 4, 5, 6, 7].forEach((k, i) => I.kalimba(t + i * 0.07, e[k] + 12, 0.3, sfxBus)); I.sino(t + 0.6, 93, 0.4, sfxBus); },
    invalido(t) { I.madeira(t, 57, 0.35, sfxBus); I.madeira(t + 0.11, 54, 0.35, sfxBus); },
  };
  // misto: o que é físico soa natural; o que é informação soa como nota
  const MIS = {
    toque: TON.toque, entrega: TON.entrega, escavar: NAT.escavar, nascimento: TON.nascimento, combate: NAT.combate, invalido: TON.invalido,
    obra(t) { NAT.obra(t); TON.obra(t + 0.05); }, onda(t) { NAT.onda(t); TON.onda(t + 0.2); },
    rainha(t) { TON.rainha(t); sopro(t, 0.3, 0.15, 1.3, sfxBus, [['lowpass', 150]], MA); }, voo(t) { NAT.voo(t); TON.voo(t + 0.3); },
  };
  const SFX = { A: NAT, B: TON, C: MIS };
  const TONAIS = { B: () => true, C: ev => !['escavar', 'combate'].includes(ev) };
  function efeito(conj, ev) {
    init(); let t = ctx.currentTime + 0.02;
    if (musAtual && TONAIS[conj] && TONAIS[conj](ev)) t = musAtual.quant(); // nota presa na batida da música
    SFX[conj][ev](t);
  }

  window.Som = { init, Musica, Ambiente, efeito, setVol, vol: k => nivelVol[k], ctx: () => ctx, master: () => master };
})();
