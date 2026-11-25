# 03 · Arte e interface

> Etapa (c). Escrito em 2026-11-25.
>
> **Aplica estas decisões:**
> - D33: tema escuro;
> - D34: formigas de três círculos;
> - D35: botões + e −;
> - D36: pausa, 1× e 2×;
> - D37: nome provisório;
> - D48: formas dos recursos;
> - D53: indicadores de trânsito.
>
> **Decisões novas:** D54 a D59, no `06`. Elas ainda estão como provisórias.
>
> Os números deste documento são **hipóteses a calibrar** no protótipo, salvo quando indicado.

## 0. Resumo em uma tela

- **Visual:** formicário escuro visto de lado. A terra é quase preta, os túneis são marrom-escuros, e tudo o que importa tem cor viva por cima.
- **Forma antes de cor:**
  - cada recurso, casta e inimigo tem uma silhueta própria;
  - a cor só reforça a família ou o lado;
  - nenhum estado depende só de cor.
- **Três níveis de zoom.** De perto aparece o detalhe (círculos, ícones, números). No meio aparecem os símbolos. De longe só ficam pontos, a cor dos túneis e os alertas.
- **Tela em retrato:**
  - informação no topo (ano, ondas, estoques);
  - mapa no centro;
  - ações na faixa do polegar, embaixo.
- **Toque:**
  - alvos de pelo menos 48 dp;
  - um dedo arrasta a câmera;
  - pinça dá zoom;
  - construir é um modo, e nele arrastar a partir de um nó desenha túnel.

## 1. Direção de arte

Cinco regras. Elas valem para qualquer arte nova.

> **Revisão (2026-11-25, D61):**
> - o usuário testou o protótipo visual com formigas de patas e mundo ilustrado e **não aprovou**;
> - o jogo volta ao estilo **minimalista**, e as formigas continuam sem patas (D34);
> - a aparência do **mundo** passa para uma etapa própria, (c2) direção de arte. Ela cobre formigas, câmaras, traçado dos túneis, solo e as cores do mundo;
> - este documento continua valendo para **interface**: HUD, telas, toque, alertas e acessibilidade.
> - O que for de aparência do mundo aqui (§3) é provisório até a (c2).

1. **Plano, sem textura.** Formas sólidas, sem degradê, sombra, brilho ou ruído, como no Achikaps e no rymdkapsel (ver `01` §7). Como isso se aplica ao mundo do jogo será detalhado na etapa (c2).
2. **Forma é identidade, cor é família.** Se a tela ficasse em tons de cinza, o jogador ainda saberia o que é cada coisa.
3. **O fundo some, o fluxo aparece.** A terra e os túneis vazios ficam escuros e com pouco contraste. Formigas, recursos e alertas ficam claros e saturados.
4. **Vermelho é só perigo.** Inimigos, túnel cheio, fome e alvo atacado. Nenhum recurso ou estrutura do jogador usa vermelho.
5. **Menos movimento que informação.** Uma coisa só se mexe quando muda de estado ou está trabalhando. A animação nunca decora (§5).

## 2. Paleta (D54)

Contraste calculado pela fórmula da WCAG 2.x, em 2026-11-25, contra os dois fundos do mapa.
- **Texto** precisa de pelo menos 4,5:1 (1.4.3).
- **Gráficos e ícones** precisam de pelo menos 3:1 (1.4.11).

### 2.1 Fundos

| Nome | Hex | Uso |
|---|---|---|
| Solo | `#15110E` | Terra não escavada, fundo geral |
| Escavado | `#2B231D` | Interior de túneis e câmaras |
| Painel | `#211B17` | Painéis, barras e menus |
| Borda | `#5A4B3F` | Contorno de câmara, divisórias (decorativo, 1,8:1; nunca carrega informação) |
| Céu | `#1C2530` | Faixa da superfície (D08) |

### 2.2 Cores com significado

| Nome | Hex | Uso | Contraste no escavado | Contraste no solo |
|---|---|---|---|---|
| Texto | `#EFE7DC` | Texto principal, formigas do jogador | 12,6 | 15,3 |
| Texto 2 | `#B3A697` | Texto secundário, rótulos | 6,5 | 7,9 |
| Vegetal | `#7FD16B` | Folha, fungo, plantas | 8,3 | 10,0 |
| Açúcar | `#F5B841` | Seiva, néctar | 8,7 | 10,6 |
| Animal | `#F06E9A` | Presa, proteína, quitina | 5,4 | 6,6 |
| Mineral | `#BFA88A` | Argila, barro | 6,7 | 8,2 |
| Refugo | `#857A6E` | Refugo, lixeira | 3,7 | 4,5 |
| Inimigo / perigo | `#FF4F5E` | Inimigos, alertas, túnel cheio | 4,8 | 5,8 |
| Defesa | `#6FB3E8` | Postos, barricada, torre, armadilha, mina | 6,8 | 8,3 |
| Ataque | `#9A6BFF` | Galeria de assalto, posto de guerra, expedição | 4,4 | 5,4 |
| Túnel livre | `#4FD1B0` | Ocupação abaixo de 70% | 8,1 | 9,9 |
| Túnel quase cheio | `#FFD23F` | Ocupação de 70% a 99% | 10,7 | 13,0 |
| Túnel cheio | `#FF4F5E` | Cheio e com fila (igual a perigo) | 4,8 | 5,8 |

**Ajuste em relação à proposta do `07` §11:** a família animal passou de coral para **rosa** (`#F06E9A`). O coral ficava parecido demais com o vermelho de perigo, e quase igual ao verde para quem tem deuteranopia. O túnel quase cheio passou de âmbar para **amarelo** (`#FFD23F`), para se afastar do açúcar.

### 2.3 Teste de daltonismo

Teste feito em 2026-11-25 com simulação de Machado et al. (2009), severidade máxima. Os valores são a distância perceptual ΔE (CIELAB) do par mais parecido em cada grupo.

| Grupo | Visão normal | Deuteranopia | Protanopia | Tritanopia |
|---|---|---|---|---|
| Famílias de recurso (4 cores) | 48 | **13** | 18 | 22 |
| Estados do túnel (3 cores) | 82 | 37 | 29 | 67 |
| Lados (formiga, inimigo, defesa, ataque) | 46 | 35 | 41 | 38 |

**Leitura:**
- Estados de túnel e lados se distinguem bem em todos os tipos de daltonismo testados.
- Vegetal e animal ficam parecidos na deuteranopia (ΔE 13). Isso era esperado: verde e rosa caem no mesmo amarelo-acinzentado.
- **Isso é aceitável só porque a forma é a identidade** (regra 2). Folha é losango e presa é triângulo, e o jogador não precisa da cor para separá-las.

**Regra:** toda cor com significado tem um reforço que não é cor:
- recurso tem a forma;
- túnel cheio tem os pontos de fila e o contorno pulsando;
- inimigo tem uma silhueta diferente da das formigas do jogador.

### 2.4 Cor dos combinados

- Os recursos combinados (N2 e N3) são pintados em **metades** com as cores dos ingredientes (D48).
- A divisão é sempre **vertical**, com o ingrediente principal à esquerda.
- Entre as metades há uma linha de 1 dp na cor do fundo.
- O N3 ganha contorno duplo: um anel externo de 1 dp em Texto, afastado 1 dp da forma.

## 3. Linguagem visual

### 3.1 Grade, escala e níveis de detalhe (D55)

- **Tela de referência:** celular em retrato, 360 × 800 dp, que é o menor caso comum de Android. Tudo é desenhado para ela e escala para cima.
- **Mapa:** grade de células quadradas, por exemplo 15 × 30 numa fase média (D32).
- **Zoom:** de **12 a 64 dp por célula**.
  - Zoom inicial: 24 dp, com que os 15 de largura ocupam os 360 dp da tela.
  - Zoom afastado no máximo: o mapa de 15 × 30 inteiro cabe na tela (180 × 360 dp).

| Nível | Zoom | Formigas | Recursos | Estruturas | Túneis |
|---|---|---|---|---|---|
| **Perto** | 36 a 64 dp/cél | 3 círculos (D34) e o recurso carregado em cima | Forma completa | Ícone da receita, vagas, barra de progresso, números | Espessura, cor, setas de sentido, pontos de fila |
| **Médio** | 18 a 35 dp/cél | 3 círculos simplificados, recurso como ponto da família | Forma sem contorno duplo | Ícone e anel de progresso | Espessura, cor, setas |
| **Longe** | 12 a 17 dp/cél | Ponto de 2 dp: Texto se vazia, cor da família se carregando, vermelho se inimiga | Não aparece | Bloco na cor da categoria | Só cor de estado |

- **Alertas não escalam com o zoom.** O ícone de alerta tem sempre 24 dp na tela, em qualquer nível. Isso resolve o risco de "fila invisível no zoom distante" (D52).
- **Transição entre níveis:** troca direta, com uma margem de 2 dp/cél para não piscar no limite. Sem animação de transição.

### 3.2 Solo, túneis e nós

- **Solo:** cor Solo lisa. A rocha (que não pode ser escavada, se a fase tiver) é Borda, com hachura diagonal de 45°.
- **Túnel:**
  - **Interior:** cor Escavado.
  - **Contorno de estado:** linha central na cor de ocupação (D53), com 30% da largura.
  - **Largura pelo nível:** proporcional à célula. No zoom inicial de 24 dp: 6, 9, 12 e 15 dp do nível 1 ao 4.
- **Setas de sentido:** chevrons de Texto 2 a cada 2 células. Mão dupla mostra ⇄ no meio do segmento.
- **Fila:** pontos empilhados fora da boca do túnel, até 10 visíveis, depois "+N".
- **Nó:** círculo Escavado com diâmetro de 1,2 vez a largura do túnel mais largo que chega nele. Com toque longo, o nó mostra os túneis ligados.
- **Obra planejada:** contorno tracejado em Texto 2, com o custo em pt ao lado. O interior fica vazio até a escavação começar.

### 3.3 Câmaras e estruturas

- **Formato:** retângulo de cantos arredondados (raio de 25% da célula) ocupando as células da estrutura.
- **Cor:**
  - interior Escavado;
  - **borda de 2 dp na cor da categoria:**
    - produção usa a família do produto (uma câmara ácida tem borda nas cores açúcar + animal, em metades como o ácido);
    - base (câmara real, berçário, depósito, lixeira, câmara nupcial) usa Texto 2;
    - defesa usa a cor Defesa;
    - ataque usa a cor Ataque.
- **Conteúdo (zoom perto):**
  - no centro, o **ícone do produto** (forma do recurso, 40% da menor dimensão);
  - em cima, os **ingredientes pequenos com a quantidade em estoque**, como "▲2 ●1";
  - embaixo, as **vagas de Cuidar**, como pips, cheios ou vazios (ex.: ●●○);
  - um **anel de progresso** ao redor do ícone, que enche durante a receita.
- **Ícone da câmara real:** coroa simplificada, ou seja, três triângulos.
- **Ícone do berçário:** ovo, uma elipse vertical, com a forma da dieta escolhida dentro.
- **Extratora:**
  - fica dentro do anel da fonte (D20);
  - a fonte é um círculo tracejado na cor da família;
  - o anel mostra a reserva restante como arco: um bolsão de raízes com 300 de 600 de seiva mostra meio arco.
- **Nível 2:** a borda fica dupla.

**Estados da estrutura (sempre forma + cor):**

| Estado | Sinal |
|---|---|
| Produzindo | Anel de progresso enchendo |
| Falta ingrediente | Ícone do ingrediente que falta, cinza, com um "!" pequeno, em cima da câmara |
| Falta cuidadora | Pips vazios piscando devagar (1 Hz) |
| Saída cheia (ninguém buscou) | Produtos empilhados fora da câmara e borda tracejada |
| Pausada pelo jogador | Ícone ‖ no lugar do produto, interior 50% mais escuro |
| Sob ataque | Borda vermelha piscando a 1 Hz e barra de vida aparente |

### 3.4 Recursos

A forma e a família de cada recurso seguem a tabela do `07` §11, com uma mudança: a família animal agora é rosa (§2.2).

| Contexto | Tamanho | Detalhe |
|---|---|---|
| Carregado por formiga (perto) | 10 dp | Forma cheia, sem contorno duplo |
| Ícone em câmara | 40% da câmara | Forma completa |
| Painel e árvore | 24 dp | Forma completa, contorno duplo no N3 |
| Barra de estoque (HUD) | 16 dp | Forma completa |

- **Tamanho mínimo:** 10 dp. Abaixo disso, vira ponto colorido.
- **A Q20 continua aberta** até o teste de leitura das 17 formas a 10 e 12 dp num celular real.
- **Risco já visível nas formas:**
  - pentágono (quitina) e hexágono (néctar) são difíceis de separar a 10 dp;
  - círculo (fungo) e anel (cola) também se confundem se o anel for fino.
- Se o teste falhar, a proposta é:
  - trocar a quitina por um **escudo** (pentágono com a base em ponta);
  - deixar o anel da cola com espessura de 35% do diâmetro.

### 3.5 Formigas e castas

Todas as castas usam três círculos: cabeça, tórax e abdômen (D34). Elas são as formigas do jogador, na cor Texto.

O que muda entre elas é **proporção e um detalhe**, para que se distingam pela silhueta.

| Casta | Silhueta (cabeça · tórax · abdômen) | Detalhe |
|---|---|---|
| Operária | P · P · M | Nenhum (a referência) |
| Cortadeira | M · P · M | Dois traços de mandíbula na frente |
| Cavadora | M quadrada · P · M | Cabeça em quadrado arredondado |
| Soldado | G · P · M | Cabeça grande |
| Tanque | G achatada · M · M | Cabeça em semicírculo, como uma tampa |
| Atiradora | P · P · G em gota | Abdômen pontudo para trás |
| Curandeira | P · P · M vazado | Abdômen em anel |
| Explosiva | P · P · G | Abdômen inchado com borda tracejada |
| Saqueadora | P · P · P alongados | Corpo em elipses, mais baixo e comprido |
| Alada | P · M · M | Duas asas em elipse com 40% de opacidade |
| Rainha | M · M · muito G | Abdômen três vezes maior, imóvel |

- **Tamanho:** no zoom inicial, a operária tem 8 dp de comprimento e o tanque 11 dp.
- **Seleção e papel:** a formiga não mostra o papel no corpo. O papel aparece pelo que ela faz e pelo painel de operárias (§6.5).
- **Teste de leitura:** as 11 silhuetas precisam ser reconhecíveis a 8 dp. Se não forem, as castas de combate ganham um **ícone flutuante de 8 dp no zoom perto**, que pode ser escudo, alvo, cruz ou bomba (Q23).

### 3.6 Inimigos

Inimigos são **vermelho de perigo, com contorno escuro de 1 dp**. Cada um tem uma silhueta própria, diferente de todas as castas do jogador.

| Inimigo | Silhueta | Traço (D46) |
|---|---|---|
| Formiga rival | 3 círculos iguais, todos P, em vermelho | Enxame: aparecem em grupo |
| Soldado rival | Cabeça G com uma placa (retângulo) em cima | Blindado: a placa mostra a armadura |
| Aranha | Corpo de 2 círculos com 8 traços curtos | Rápida |
| Lacraia (chefe) | Corrente de 8 a 12 segmentos que se movem em onda | Chefe: tem barra de vida sempre visível |

- **Ninho rival:**
  - é uma câmara grande com borda vermelha dupla e a barra de vida embaixo;
  - os túneis que os rivais cavam (D27) têm a linha central vermelha tracejada, para o jogador ver por onde vão entrar.

### 3.7 Superfície

- **Faixa fixa no topo do mapa**, com cerca de 3 células de altura e cor Céu.
- **Plantas:** silhuetas verticais na cor Vegetal, com folhas em losango.
  - O tamanho da planta mostra a produção da estação (D23): no inverno fica só o caule.
- **Olheiro:** um buraco na linha do chão, com um arco Escavado.
- **Estação:** a cor Céu muda levemente, com no máximo 8% de diferença de luminosidade entre as estações. O nome da estação aparece sempre no topo da tela. A cor nunca é o único sinal.

## 4. Tipografia (D58)

- **Fonte:** Atkinson Hyperlegible (licença livre OFL, do Braille Institute; ✅ licença verificada). Foi feita para baixa visão e separa bem 1/l/I e 0/O.
  - ❓ **A verificar:** se a fonte tem algarismos tabulares (mesma largura). Números que mudam rápido no HUD (estoques, relógio) precisam deles para não "dançar".
  - Se não tiver, os números usam **Inter**, que tem algarismos tabulares, e o texto continua em Atkinson.
- **Dois pesos:** regular e negrito.

| Uso | Tamanho | Peso |
|---|---|---|
| Título de tela | 20 sp | negrito |
| Texto de painel | 16 sp | regular |
| Rótulo, botão | 14 sp | negrito |
| Número ao lado de ícone | 12 sp | negrito |

- **12 sp é o mínimo absoluto**, e só para números ao lado de um ícone que já diz o que o número é.
- **Texto no mapa:** não existe, exceto números de estoque e custos no zoom perto. Nomes de estrutura aparecem só no painel.
- **Escala de texto:** o jogo respeita a escala de fonte do Android até 130%, e tem uma opção própria (100%, 115%, 130%). Os painéis são desenhados para caber com 130% em PT-BR, que é o idioma mais longo dos dois (D06).

## 5. Regras de animação

| Regra | Valor |
|---|---|
| Painel abrindo ou fechando | 200 ms, desacelerando no fim |
| Botão pressionado | Escala 0,96 por 80 ms |
| Formiga andando | Movimento linear, sem animação de pernas (não tem pernas) |
| Estrutura produzindo | Só o anel de progresso se mexe; nada pulsa |
| Alerta | Pisca a no máximo **1 Hz**; nunca mais de 3 flashes por segundo (WCAG 2.3.1) |
| Recurso entregue | O recurso some no ícone da câmara com escala 1 → 0 em 150 ms |
| Inimigo morto | Vira o ícone de presa no chão (troca direta) |
| Tremor de tela | Não existe |

- **Movimento reduzido:** uma opção nas configurações, que também segue a configuração do sistema. Com ela ligada:
  - alertas ficam fixos em vez de piscar;
  - painéis aparecem sem deslizar;
  - formigas continuam andando, porque isso é informação de jogo.
- **Desempenho:** o protótipo precisa manter 60 fps com 150 formigas visíveis no zoom médio num celular de entrada. Esse é o limite da D22 com folga.
  - O nível longe existe também para isso, porque desenha pontos em vez de três círculos.
  - ❓ O celular de referência ainda não foi escolhido.

## 6. Telas

Os wireframes são para a tela de referência de 360 × 800 dp. A largura do desenho ASCII equivale a 360 dp.

### 6.1 Tela de jogo (D56)

```
┌────────────────────────────────────┐
│ OUTONO ▕██░░░░░░░░░░░▏ 1:40 ‖ 1× 2×│ ← 56 dp: linha do ano + velocidade
│        ▲    ▲ ▲         ★          │   ▲ = onda prevista, ★ = voo nupcial
├────────────────────────────────────┤
│ ● 42 +3/min  ♛ 1  ✦ 0/6  ⚑ 38      │ ← 40 dp: fungo (estoque e saldo),
│                                    │   rainha, aladas/meta, população
├────────────────────────────────────┤
│  ~~ céu ~~   ψ        ψ            │
│ ═══◯════════════════◯═════════════ │ ← superfície e olheiros
│    ║                ║              │
│    ●══════[jardim]══●              │
│    ║                ║         ◀ !  │ ← alerta fora da tela (24 dp)
│ [real]          [berçário]         │
│    ║                               │
│    ●═══[depósito]                  │       MAPA
│                                    │   (rolagem e zoom)
│                                    │
│                                    │
├────────────────────────────────────┤
│ ⇅ 8   ⛏ 4   ♥ 6   ⛨ 3   ◌ 5        │ ← 48 dp: papéis (toque abre §6.5)
├────────────────────────────────────┤
│  [ ✚ Construir ] [ ⚔ Expedição ] ☰ │ ← 64 dp: ações (faixa do polegar)
└────────────────────────────────────┘
```

- **Linha do ano (topo):**
  - mostra a estação, o relógio do ano (D25) e as ondas previstas como marcas na linha, com o ícone do traço do inimigo;
  - tocar numa onda abre o detalhe: de onde vem, o traço e quando chega.
- **Barra de estado:**
  - mostra só o que decide a partida: fungo (estoque e saldo por minuto, que fica vermelho quando é negativo), rainha, aladas em relação à meta da fase (D31) e população;
  - tocar abre o painel de estoques completo, com os 17 recursos e o saldo de cada um.
- **Faixa de papéis:**
  - Carregar ⇅, Escavar ⛏, Cuidar ♥, Guardar ⛨ e Reserva ◌, com o número de cada um;
  - fica sempre visível, porque é o controle mais usado (D14).
- **Ações:**
  - Construir abre o modo de construção (§6.2);
  - Expedição abre a §6.6;
  - ☰ abre a árvore (§6.9), as configurações e o menu de sair.
- **Alertas fora da tela:** seta na borda apontando para onde está o problema. Tocar na seta leva a câmera até lá.

### 6.2 Modo de construção

```
┌────────────────────────────────────┐
│ CONSTRUINDO · jogo em pausa opc.   │ ← faixa colorida indica o modo
├────────────────────────────────────┤
│                                    │
│   (mapa com a grade visível e      │
│    células válidas destacadas)     │
│                                    │
│    ●┄┄┄┄┄┄┄○  3 cél · 12 pt        │ ← túnel planejado (tracejado)
│                                    │
├────────────────────────────────────┤
│ Túnel  Base  Produção  Defesa  Ataq│ ← abas por categoria
│ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ │
│ │ ◇● │ │ ▲● │ │ ⬡  │ │ ▼  │ │ ⬠  │ │ ← cartões de 64 dp: ícone,
│ │20pt│ │20pt│ │20pt│ │20pt│ │ 🔒 │ │   custo, cadeado se a fase
│ └────┘ └────┘ └────┘ └────┘ └────┘ │   não liberou
├────────────────────────────────────┤
│ [ ✕ Cancelar ]      [ ✓ Confirmar ]│
└────────────────────────────────────┘
```

- **Túnel:** arrastar a partir de um nó ou câmara desenha o túnel, que se alinha à grade em segmentos retos de até 3 células (02 §4.1). Soltar cria um nó novo, ou liga a um nó existente se terminar sobre ele.
- **Estrutura:** toque no cartão, depois toque no lugar. A estrutura aparece como fantasma, verde-água se o lugar é válido e vermelho se não é.
- **Confirmar:** manda tudo o que foi planejado para a fila de obras (D36). As escavadoras seguem a ordem em que as obras foram marcadas.
- **Pausa automática:** opção nas configurações, desligada por padrão (D36).

### 6.3 Painel de estrutura

O painel sobe de baixo e ocupa no máximo 45% da tela, para o mapa continuar visível.

```
├────────────────────────────────────┤
│ Câmara ácida · nv1           [✕]   │
│  ⬡ 1 + ⬭ 1  →  ▼ 1   em 6 s        │ ← receita com as formas
│  estoque: ⬡ 3  ⬭ 0 (!)  saída: ▼ 2 │ ← falta destacada
│  Cuidadoras ●●○  [ − ] [ + ]       │ ← muda só esta câmara
│  [ ‖ Pausar ]  [ ⬆ nv2: 25pt + 3 ○]│
│  [ ↻ Mover ]   [ 🗑 Demolir ]      │
├────────────────────────────────────┤
```

- **Vagas de Cuidar:** os botões + e − do painel reservam cuidadoras para aquela câmara. As vagas não reservadas são preenchidas pela prioridade fixa (Q15).
- **Upgrade:** o botão mostra o custo com a forma do recurso. Se faltar algo, o que falta aparece em vermelho, e o botão continua tocável: tocar mostra onde produzir o que falta.
- **Demolir:** pede confirmação e não devolve nada (`02` §4.1).

### 6.4 Painel de túnel

```
├────────────────────────────────────┤
│ Túnel · 4 células · nv2      [✕]   │
│ Ocupação ███████░░░ 70%  fila 3    │
│ Sentido  [ ⇄ ] [ → ] [ ← ]         │ ← botões de 48 dp
│ Capacidade 12 (6 por sentido)      │
│ Frente de combate 2                │
│ [ ⬆ nv3: 16pt + 8▬ + 4○ ]          │
├────────────────────────────────────┤
```

- O botão de sentido mostra o efeito antes de confirmar. Se a mudança deixar estruturas sem rota, aparece o aviso "Deixa o jardim sem rota de volta" e é preciso tocar de novo para confirmar.
- **Seleção por arraste:** tocar num túnel e arrastar ao longo dele seleciona vários segmentos, para fazer o mesmo upgrade em todos de uma vez.

### 6.5 Painel de operárias (D35)

```
├────────────────────────────────────┤
│ Operárias · 26                [✕]  │
│ ⇅ Carregar  8 +3 cortad. [ − ][ + ]│
│ ⛏ Escavar   4 +1 cavad.  [ − ][ + ]│
│ ♥ Cuidar    6            [ − ][ + ]│
│ ⛨ Guardar   3            [ − ][ + ]│
│ ◌ Reserva   5  (defende a rainha)  │
│ Pedidos sem carregadora: 4 (!)     │ ← diagnóstico (02 §9)
├────────────────────────────────────┤
```

- Os botões + e − têm 56 × 48 dp. Segurar repete a ação a 5 por segundo, depois de 400 ms.
- A Reserva não tem botões. Ela é o "pote" de onde os outros papéis tiram formigas.
- A última linha mostra o diagnóstico mais urgente daquele papel. Por exemplo, para Carregar: os pedidos sem carregadora.

### 6.6 Expedição (D21)

```
├────────────────────────────────────┤
│ Expedição → Ninho rival  ♥ 140/200 │
│ Rota: 9 cél · passa por 2 túneis nv1│
│ Combatentes  ◄━━━━━●━━━━► 12 de 20 │
│ Soldados 6 · Tanques 2 · Atir. 4   │
│ Ficam na defesa: 8                 │
│ [ Cancelar ]          [ ⚔ Partir ] │
├────────────────────────────────────┤
```

- Este é o único slider de arrastar do jogo. Ele tem setas nos lados para ajustar de 1 em 1.
- A linha **Rota** avisa se o caminho passa por túneis estreitos. Pela frente de combate e pela capacidade (D52, D53), túneis estreitos atrasam a expedição.

### 6.7 Antes da fase (briefing)

- **Uma tela só, com rolagem:**
  - mapa em miniatura;
  - **cardápio da fase:** os galhos da árvore liberados e os favorecidos (D39), mostrados como ícones de recursos e castas;
  - linha do ano com as ondas e os traços dos inimigos;
  - meta de aladas e critérios de estrela.
- **Botões:** "Começar" e "Ver árvore".
- **Novidades da fase (D51):** quando a fase traz coisas novas, cada uma aparece como um cartão com a forma, uma frase e a espécie que a inspirou (D16).

### 6.8 Fim de fase

- **Vitória:**
  - estrelas;
  - aladas que voaram;
  - três números da partida: pico de população, entregas por minuto e ondas vencidas;
  - "Próxima fase".
- **Derrota:**
  - a causa em uma frase, como "A rainha morreu: o túnel da esquerda tinha só 1 guarda";
  - um **replay em linha do tempo** com os três momentos críticos, que levam ao mapa congelado naquele instante;
  - "Tentar de novo".
- Os textos de causa usam o diagnóstico do `02` §9.

### 6.9 Árvore (consulta)

- **Mostra o grafo do `07` §1** em quatro colunas: natural → N1 → N2 → N3. Ao lado ficam as castas e estruturas que cada recurso libera.
- **Interação:**
  - tocar num item destaca tudo o que entra nele e tudo o que sai dele;
  - o que a fase não liberou aparece com cadeado.
- **Abre em pausa**, de qualquer lugar.

### 6.10 Menu principal e campanha

- **Menu principal:** Campanha, Sandbox, Configurações e Créditos.
- **Campanha:** um mapa vertical de cerca de 15 fases (D51), cada uma com estrelas. As fases bloqueadas mostram só o número.
- **Sandbox:** escolhe tamanho do mapa, estações e galhos liberados. O detalhe vai para o `04`.

## 7. Fluxo de navegação

```
Abertura ─► Menu principal
               ├─► Campanha ─► Mapa de fases ─► Briefing ─► JOGO ─► Fim de fase ─┐
               │                    ▲                                          │
               │                    └──────────────────────────────────────────┘
               ├─► Sandbox ─► Opções da partida ─► JOGO
               ├─► Configurações
               └─► Créditos

JOGO (camadas sobre o mapa; o mapa nunca é trocado):
  ├─ Construir (modo)           ├─ Painel de estrutura / túnel / nó
  ├─ Operárias (painel)         ├─ Expedição (painel)
  ├─ Estoques (painel)          ├─ Detalhe de onda (balão)
  └─ ☰ ─► Árvore · Configurações · Sair (pausa automática)
```

- **Regras do fluxo:**
  - **Um painel por vez:** abrir outro fecha o anterior.
  - **Voltar** (gesto do Android) fecha o painel aberto; sem painel aberto, abre o ☰. Nunca sai da partida direto.
  - **Sair do app:** a partida é salva automaticamente ao sair, e ao voltar o jogo está em pausa.

## 8. Controles de toque (D57)

| Gesto | Fora do modo de construção | No modo de construção |
|---|---|---|
| Toque | Seleciona e abre o painel | Coloca a estrutura escolhida ou o fim do túnel |
| Arrastar com 1 dedo no solo | Move a câmera | Move a câmera |
| Arrastar com 1 dedo a partir de um nó ou câmara | Move a câmera | **Desenha um túnel** |
| Arrastar ao longo de um túnel | Move a câmera | Seleciona vários segmentos |
| Pinça | Zoom | Zoom |
| Toque duplo | Alterna entre zoom perto e médio no ponto tocado | Igual |
| Toque longo (400 ms) | Info rápida: receita, vida, ocupação | Mostra o alcance da defesa |
| Segurar + ou − | Repete (D35) | — |

- **Alvos de toque:**
  - pelo menos 48 × 48 dp (recomendação do Android/Material, ✅) e 8 dp entre alvos vizinhos;
  - botões frequentes (papéis, velocidade) têm 56 dp;
  - no mapa, a área de toque de um nó ou túnel é de pelo menos 32 dp, mesmo quando o desenho é menor. Se dois alvos se sobrepõem, ganha o mais próximo do dedo e aparece um seletor.
- **Por que o túnel só se desenha no modo de construção:** fora dele, arrastar sempre move a câmera. Assim o jogador nunca cava um túnel por acidente quando só queria olhar.
- **Mão esquerda:** a opção "Inverter barra de ações" espelha os botões de Construir e Expedição.

## 9. Gargalos e perigo

Todo problema tem três camadas de sinal:
1. **no lugar**, no próprio mapa;
2. **na borda**, como seta quando está fora da tela;
3. **no resumo**, como ícone na barra de estado ou na linha do ano.

| Problema | No lugar | Na borda / resumo | Extra |
|---|---|---|---|
| Túnel cheio com fila | Linha vermelha, pontos de fila, contorno pulsando a 1 Hz (D53) | Seta amarela se a fila passa de 5 | — |
| Sem rota | Formigas paradas com "?" em cima | Aviso fixo "Sem rota de volta" | — |
| Falta ingrediente | Ícone cinza do ingrediente com "!" | — | Toque leva à câmara que produz o ingrediente |
| Falta cuidadora | Pips vazios piscando | Número de Cuidar fica amarelo | — |
| Depósito cheio | Borda tracejada e pilha fora | Ícone no painel de estoques | — |
| Fome (saldo de fungo negativo) | — | Fungo vermelho na barra; ao começar a matar (D24), borda vermelha de 4 dp na tela | Vibração curta ao morrer a 1ª formiga |
| Onda chegando | — | Marca da onda pisca na linha do ano 20 s antes; seta vermelha na boca de entrada | Som de aviso |
| Inimigo dentro do ninho | Inimigo vermelho; célula com contorno vermelho | Seta vermelha com o número de inimigos | — |
| Rainha atacada | Câmara real com borda vermelha piscando | Alerta no topo: "Rainha sob ataque" com o botão "Ir" | Vibração longa |
| Câmara nupcial atacada | Igual à rainha | Igual, com o ícone ✦ | Vibração longa |

- **Hierarquia:** só **um** alerta vermelho aparece no topo por vez, o mais grave. A ordem é: rainha, aladas, inimigo dentro, fome, onda chegando. Os outros ficam como setas.
- **Vibração:** pode ser desligada e nunca é o único sinal.

## 10. Tema claro

Fica fora do MVP (D33). Se for feito, ele precisa de uma paleta própria de famílias, refeita e testada pelos mesmos critérios da §2, e não de uma inversão das cores.

## 11. Acessibilidade (D59)

| Tema | O que o jogo faz |
|---|---|
| Daltonismo | Forma é identidade (§2.3). Todo estado tem sinal que não é cor. Não tem "modo daltônico" de troca de paleta: o jogo é desenhado para não precisar. |
| Baixa visão | Fonte Atkinson Hyperlegible; escala de texto até 130%; alertas com tamanho fixo de 24 dp em qualquer zoom |
| Motor | Alvos de 48 dp ou mais; pausa a qualquer momento; obras planejadas em pausa (D36); nenhuma ação exige gesto rápido ou preciso |
| Fotossensibilidade | Nada pisca a mais de 1 Hz; não tem tremor de tela |
| Movimento | Opção de movimento reduzido (§5) |
| Audição | Todo som tem sinal visual equivalente; o jogo é jogável sem som |
| Cognitivo | Novidades apresentadas aos poucos (D51); árvore de consulta sempre disponível em pausa; fim de fase explica a causa da derrota |
| Leitor de tela | Fora do MVP. Os menus usam componentes com rótulo, para não fechar essa porta |

## 12. Idiomas e texto

- PT-BR e EN desde o início (D06). Todo texto fica em arquivo de tradução, nunca fixo no código.
- Os painéis são medidos em PT-BR com 130% de escala, que é o pior caso.
- Os ícones dos papéis e dos recursos substituem palavras sempre que possível. Os nomes aparecem no toque longo.
- Números usam o formato do idioma: "1,5" em PT-BR e "1.5" em EN.

## 13. Riscos

| Risco | Efeito | Mitigação |
|---|---|---|
| 17 formas pequenas demais para ler (Q20) | Jogador confunde recursos, a árvore perde sentido | Teste em celular real a 10 e 12 dp; trocas já propostas na §3.4 |
| 11 silhuetas de casta parecidas a 8 dp | Não se sabe quem está defendendo | Teste no protótipo; ícone flutuante no zoom perto como reserva (Q23) |
| Mapa grande e muitos alertas | Jogador perde a noção do todo | Hierarquia de um alerta vermelho por vez, setas na borda, zoom longe que mostra o mapa inteiro |
| Painel cobrindo o mapa na tela pequena | Jogador não vê o efeito do que muda | Painel com no máximo 45% da altura; o mapa rola para manter o item selecionado visível |
| Desempenho com muitas formigas | Queda de fps em celular fraco | Nível longe com pontos; meta de 60 fps com 150 formigas (§5) |
| Muitos controles por túnel (nível e sentido) | Microgestão cansativa | Túnel nasce em mão dupla; seleção de vários segmentos; aviso de sem rota antes de confirmar |

## 14. Questões em aberto desta etapa

- **Q20:** teste de leitura das 17 formas de recurso. Continua aberta e vai para o protótipo.
- **Q23 (nova):** as 11 silhuetas de casta são suficientes a 8 dp, ou é preciso um ícone flutuante? Vai para o protótipo.
- **Q24 (nova):** qual é o celular de referência para desempenho (modelo e ano)? Fica para a etapa (e).
