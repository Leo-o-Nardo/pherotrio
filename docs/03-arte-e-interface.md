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

> **Revisão (2026-11-26, D100):** o objetivo é um jogo **bonito e bem feito**. O minimalismo é referência, não regra.
> - As regras 1 e 5 viram guias: cedem quando um detalhe deixa o jogo mais bonito sem atrapalhar a leitura.
> - As regras 2, 3 e 4 continuam firmes, porque protegem a leitura.

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
| Solo | `#8E765C` → `#695441` | Terra não escavada: camadas claras e quentes que escurecem pouco com a profundidade (D110) |
| Fundo da interface | `#15110E` | Fundo atrás de painéis e menus |
| Túnel / escavado | `#30261F` | Interior de túneis e câmaras, agora mais escuro que o solo (D110) |
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
- **Mapa:** grade de células quadradas, cerca de 80 × 80 por arco (D94), que se abre do centro para os lados (D95).
- **Zoom:** até **64 dp por célula**.
  - Zoom inicial: 24 dp, com que 15 células ocupam os 360 dp da tela.
  - **Zoom afastado no máximo: o mapa inteiro cabe na tela** (D92). Para 80 × 80, isso dá cerca de 4,5 dp por célula: um mapa esquemático para ver e escolher aonde ir.

| Nível | Zoom | Formigas | Recursos | Estruturas | Túneis |
|---|---|---|---|---|---|
| **Perto** | 36 a 64 dp/cél | 3 círculos (D34) e o recurso carregado em cima | Forma completa | Ícone da receita, vagas, barra de progresso, números | Espessura, cor, setas de sentido, pontos de fila |
| **Médio** | 18 a 35 dp/cél | 3 círculos simplificados, recurso como ponto da família | Forma sem contorno duplo | Ícone e anel de progresso | Espessura, cor, setas |
| **Longe** | 12 a 17 dp/cél | Ponto de 2 dp: Texto se vazia, cor da família se carregando, vermelho se inimiga | Não aparece | Bloco na cor da categoria | Interior claro e pulso na borda (D91) |
| **Visão geral** | Abaixo de 12 dp/cél, até o mapa inteiro (D92) | Não aparecem | Não aparecem | Forma cheia com borda da categoria | Linha de pelo menos 3 dp e pulso na borda mais grosso; regiões fechadas escurecidas |

- **Alertas não escalam com o zoom.** O ícone de alerta tem sempre 24 dp na tela, em qualquer nível. Isso resolve o risco de "fila invisível no zoom distante" (D52).
- **Ícones de interface sólidos (D110):** preenchidos, de cantos redondos e com recortes, em 24 dp.
- **Transição entre níveis:** troca direta, com uma margem de 2 dp/cél para não piscar no limite. Sem animação de transição.

### 3.2 Solo, túneis e nós

- **Solo:** terra clara em camadas onduladas, com pedrinhas e pouco granulado; o túnel escuro se destaca sobre ela (D89, D110).
- **Percalços (D96, visual provisório até a c2):**
  - **rocha:** Borda com hachura diagonal de 45°;
  - **argila dura:** manchas de Mineral escuro, pontilhadas;
  - **areia solta:** pontilhado fino e claro;
  - **água:** bolsão de contorno liso em verde-lodo (#41604F, ondas #5F8670), para não competir com a cor de defesa (D109);
  - **toca de predador:** buraco escuro com anel vermelho tracejado do alcance;
  - **fora da visão (D98):** só um "?" discreto.
- **Túnel:**
  - **Interior:** cor Escavado.
  - **Terra batida (D125):** como a câmara, o túnel tem uma faixa de terra mais escura em volta, fina (uns 40% da parede da câmara), e um fio de luz nas bordas de dentro, que segue até a parede da câmara. Some na visão geral. O nó não tem o fio de luz.
  - **Contorno de estado:** linha central na cor de ocupação (D53), com 30% da largura.
  - **Largura pelo nível (D99):** proporcional à célula. No zoom inicial de 24 dp: 6, 8, 10 e 12 dp do nível 1 ao 4. Na tela, nunca fica mais fino que 2 dp (perto e médio), 2,5 dp (longe) ou 3 dp (visão geral).
- **Setas de sentido:** chevrons de Texto 2 a cada 2 células. Mão dupla mostra ⇄ no meio do segmento.
- **Fila:** formigas paradas dentro do túnel, do lado de fora da porta, até 10 visíveis, depois "+N" (D114).
- **Nó:** círculo Escavado com diâmetro de 1,2 vez a largura do túnel mais largo que chega nele. Com toque longo, o nó mostra os túneis ligados.
- **Obra planejada:** contorno tracejado em Texto 2 (traço de 5 dp, vão de 8 dp; D109), com o custo em pt ao lado. O interior fica vazio até a escavação começar.

### 3.3 Câmaras e estruturas (D101 a D105, D124)

- **Tamanho (D105):** o desenho ocupa exatamente as células da estrutura.
  - pequena, 2 × 1: extratoras e defesa ou ataque com lugar fixo;
  - média, 3 × 1: as 11 de produção e a lixeira;
  - grande, 3 × 2: câmara real, berçário, depósito e câmara nupcial.
- **Formato (D101, D124):** arco cheio, sem parede reta: um arco só, de ombros cheios, que desce até o chão reto com os cantos arredondados. Sempre na horizontal.
  - O túnel entra pela lateral ou pelo teto, nunca pelo chão.
  - **Encaixe (D114):** o túnel chega reto na porta, no nível do chão nas portas de lado e de cima nas de teto. A cor do túnel entra na câmara em degradê, e um batente de terra batida marca a porta: lintel e soleira nas portas de lado, dois postes na de teto (confirmado na D125). As formigas passam por cima da abertura.
  - O teto tem uma leve variação própria por câmara, de no máximo 10% da altura.
  - Câmaras de base são mais altas; as de defesa, mais baixas.
- **Cor (D103):**
  - interior na cor dos túneis (`#43362B`), com 10 a 15% da cor da família do produto. Defesa usa a cor Defesa, ataque usa a cor Ataque, e a base fica sem tinta;
  - combinados (N2 e N3) com a tinta em metades, como o recurso (D48);
  - **sem borda de cor.** A borda só ganha cor em alerta, com o pulso dos túneis (D91): amarelo suave para atenção e vermelho suave para ataque.
- **Parede e luz (D124):**
  - **terra batida:** em volta da câmara há uma faixa de terra mais escura, como terra socada, e um fio de luz na borda de dentro, mais forte no teto. O chão é um piso de terra batida;
  - **brilho do trabalho:** o teto fica no escuro, e uma luz quente sai do chão, tingida pela família do produto (neutra na base). Pausada, a câmara fica sem luz;
  - os túneis têm a mesma terra batida, mais fina (D125, §3.2).
- **Conteúdo (D102):**
  - **produção:** ingredientes empilhados no chão do lado de onde chegam, cuidadoras trabalhando no meio e produto pronto no outro canto. Um ícone pequeno do produto aparece no teto só quando a câmara está vazia;
  - **base:** a rainha e os ovos na câmara real, as larvas no berçário, pilhas por família no depósito, as aladas na câmara nupcial e o monte de refugo na lixeira;
  - **pilhas:** até 5 itens. Acima disso, o número aparece no zoom perto.
  - **carregadoras:** entram pela porta, deixam o item na pilha de ingredientes (ou pegam na de produto) e saem pela mesma porta. A formiga nunca some ao entrar.
- **Por zoom:** perto e médio mostram tudo; longe mostra as pilhas como pontos coloridos; a visão geral mostra só a forma tingida.
- **Extratora:**
  - fica dentro do anel da fonte (D20);
  - a fonte é um círculo tracejado na cor da família;
  - o anel mostra a reserva restante como arco: um bolsão de raízes com 300 de 600 de seiva mostra meio arco.
- **Nível 2:** o piso de terra batida fica mais claro (D103, D124).

**Estados da estrutura (D104, sempre forma + cor):**

| Estado | Sinal |
|---|---|
| Produzindo | Linha fina no chão enchendo da esquerda para a direita, na cor do produto; cuidadoras trabalhando |
| Falta ingrediente | Selo pequeno acima da câmara com a forma do ingrediente que falta, em cinza, e pulso amarelo na borda |
| Falta cuidadora | Silhueta tracejada de formiga na vaga vazia e pulso amarelo na borda |
| Saída cheia (ninguém buscou) | Pilha de produto no máximo e pulso amarelo na borda |
| Pausada pelo jogador | Interior 50% mais escuro e ícone ‖ no teto |
| Sob ataque | Pulso vermelho na borda e barra de vida acima da câmara |

- **Números** (estoque, vagas, tempo) só no zoom perto. O resto fica no painel, ao tocar na câmara.
- **Ofício no fundo (D110):** cada câmara tem cenário do próprio trabalho atrás do conteúdo, com luz e cor suficientes para cada câmara ter cara própria (D124): fungo e fios no jardim, gotas na destilaria, tachos na câmara ácida, prateleiras na olaria, almofada e nichos na câmara real, estacas e escudos na defesa, flâmulas no posto de guerra, nichos no depósito.

### 3.4 Recursos

A forma e a família de cada recurso seguem a tabela do `07` §11, com uma mudança: a família animal agora é rosa (§2.2).

No zoom perto (item com 9 px ou mais na tela), cada recurso vira um **objeto ilustrado dentro da silhueta da forma**: folha com nervura, gota com brilho, favo de néctar, tijolo de barro, torrão de argila, bola de fungo, placa de quitina e assim por diante. No zoom médio volta à forma simples; no longe, ponto colorido (D110).

| Contexto | Tamanho | Detalhe |
|---|---|---|
| Carregado por formiga (perto) | 10 dp | Forma cheia, sem contorno duplo |
| Na pilha da câmara (D102) | 0,27 célula (cerca de 6,5 dp no zoom inicial e 10 dp a partir de 36 dp por célula) | Forma cheia; no zoom longe vira ponto colorido. Pode ficar pequeno no zoom médio, porque o jogador aproxima para ver (D107) |
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

Todas as castas usam três elipses com cintura: cabeça, tórax e abdômen (D34, D90), carregando o item pela boca (D109). No zoom perto ganham seis pernas finas, que mexem quando a formiga anda, e antenas finas abertas em V; no médio e no longe não têm pernas nem antenas (D113). O corpo é creme (Texto), **levemente tingido pela função**, com 25% de cor (D112): coleta (operária e cortadeira) fica creme, obra (cavadora) em barro, linha de frente (soldado e tanque) em azul, apoio (atiradora e curandeira) em verde-água, ataque (explosiva e saqueadora) em violeta e reprodução (alada e rainha) em dourado. A silhueta de cada casta é marcada (ver o catálogo visual); a tabela abaixo é a referência original.

**De perfil (D120):** na superfície e dentro das câmaras, as formigas aparecem de lado e de pé, com volume e sem olho. As pernas andam em tripé, o corpo balança de leve e as antenas tateiam. Nos túneis continuam vistas de cima, e a troca acontece na porta.

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
| Rainha | M · M · muito G | Abdômen três vezes maior; só respira e põe ovos (D115) |

- **Tamanho:** no zoom inicial, a operária tem 8 dp de comprimento e o tanque 11 dp.
- **Seleção e papel:** a formiga não mostra o papel no corpo. O papel aparece pelo que ela faz e pelo painel de operárias (§6.5).
- **Teste de leitura:** as 11 silhuetas precisam ser reconhecíveis a 8 dp. Se não forem, as castas de combate ganham um **ícone flutuante de 8 dp no zoom perto**, que pode ser escudo, alvo, cruz ou bomba (Q23).

### 3.6 Inimigos

Inimigos são **vermelho de perigo, sem contorno** (D109). Cada um tem uma silhueta própria, diferente de todas as castas do jogador. Na superfície e nas câmaras, a aranha aparece de perfil, com pernas altas e os joelhos acima do corpo (D120); a lacraia continua vista de cima.

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

- **Faixa fixa no topo do mapa**, com cerca de 3 células de altura e céu em degradê (D110).
- **Chão vivo (D110):** linha ondulada com faixa de húmus, grama baixa, pedrinhas, folhas caídas, flores pequenas e morros e mato em silhueta ao fundo.
- **Plantas:** capim, trevo, samambaia, folha larga, dente-de-leão e arbusto de folhinhas, todas com a mesma função e desenho diferente (D110, D111).
  - O tamanho da planta mostra a produção da estação (D23): no inverno fica só o caule.
- **Cortadouro:** um buraco na linha do chão, com um arco Escavado. Durante o aviso de ataque por cima, o arco fica vermelho e pulsa (D118).
- **Fundo:** os morros e o mato em silhueta ficam só no céu, sem passar da linha do chão (D118).
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
| Formiga andando | Movimento linear. No zoom perto as pernas mexem em passo de tripé; paradas quando ela trabalha numa câmara (D113) |
| Estrutura produzindo | Nada pulsa. Ao terminar um item, ele pula como moedinha acima da câmara e a barra fica cheia e acesa por 0,8 s (D113) |
| Formigas na câmara (D115, zooms perto e médio) | Cada formiga do posto faz a receita inteira: leva o produto à pilha de saída, busca o ingrediente e trabalha no posto, onde o ingrediente encolhe e o produto cresce (farelos só no perto). As carregadoras entram pela porta, passam na frente das pilhas, deixam o ingrediente e levam o produto. Câmara parada: as formigas esperam na pilha vazia, viradas para a porta, ou na saída cheia, segurando o produto. Meia-volta no chão: a formiga vira de lado, não gira pela vertical |
| Câmaras da base (D115) | Rainha respira, põe o ovo na ponta do abdômen e recebe fungo de uma operária. Cuidadoras levam fungo a cada larva, que se mexe ao comer. No depósito, a carregadora desce pela parede da cúpula. No posto de guarda, um soldado vai olhar a porta e volta |
| Alerta | Pisca a no máximo **1 Hz**; nunca mais de 3 flashes por segundo (WCAG 2.3.1) |
| Recurso entregue | O recurso some no ícone da câmara com escala 1 → 0 em 150 ms |
| Luta corpo a corpo (D116) | Golpe a cada 0,6 s: o lutador avança e recua, com um risquinho claro no contato. Quem apanha fica branco por 0,09 s e é empurrado para trás |
| Vida em combate (D116) | A barrinha só aparece enquanto a formiga leva dano ou está com menos de 100% de vida: vermelha nos inimigos, verde nas suas. Na faixa de baixo do túnel, a barrinha fica embaixo da formiga |
| Formiga morta (D116) | Tomba de lado, perde a cor e, em menos de 1 s, o inimigo vira presa no chão. As suas formigas tombam e somem |
| Efeitos das castas (D116) | Ácido: gota em arco com brilho, um fio fino que desenha o arco e some 0,3 s depois do impacto, respingo no alvo e bolhinhas por 2 s no alvo lento. Cura: anel verde pulsando devagar na curandeira e cruzinhas subindo de quem é curado. Explosão: a explosiva incha, explode num anel com estilhaços e deixa por 4 s uma teia de cola: cinco fios finos cor de terra, do teto ao chão, com gotinhas brilhando, que arrebentam no fim |
| Câmara atacada (D116) | Os inimigos entram e mordem o posto e a pilha de entrada, soltando lascas. As formigas de dentro se encolhem no fundo, tremendo |
| Escavação de túnel (D117) | A ponta fica irregular e a cavadora joga farelos claros para trás. Duas operárias vão vazias até a ponta e voltam com uma bolinha de argila |
| Obra de câmara (D117) | A câmara abre da porta para o fundo, com a frente irregular e duas cavadoras nela. O contorno tracejado enche como barra e o custo que falta fica no meio. No fim, o conteúdo aparece aos poucos sobre a câmara escura |
| De perfil (D120) | Na superfície e nas câmaras, formigas e aranha ficam de pé, de lado. Na parede e no teto da cúpula, os pés ficam na terra. Ao virar no chão, a formiga encolhe de lado. A cortadeira leva a vela na boca. Nos túneis, vista de cima |
| Estados parados do catálogo (D119) | O túnel e a câmara "escavando" mostram o quadro do meio dessas animações. A armadilha de cola tem a teia de terra da D116 do teto ao chão; sem munição, só os tocos dos fios |
| Nascimento (D117) | A larva cresce, se encolhe e estoura num anel da cor da casta. A formiga sai pulando, como a moedinha dos itens, e anda até a porta |
| Onda chegando (D117) | Uma linha vermelha tracejada liga a ponta do túnel rival à câmara alvo, com um anel pulsando no impacto. A ponta rival joga farelos para trás |
| Expedição saindo (D117) | Os soldados saem das vagas um atrás do outro e deixam um rastro pontilhado violeta que some em 5 s. As vagas vazias ficam tracejadas |
| Corte na planta (D118) | A cortadeira sobe pelo caule e corta um pedaço da folha, que fica mordida e cresce de novo. Desce com o pedaço em pé sobre a cabeça, como vela, até o cortadouro; no túnel a carga é o ícone de folha |
| Ataque por cima (D118) | Durante o aviso, o arco do cortadouro alvo fica vermelho e pulsa a 1 Hz. A aranha anda com as pernas mexendo em dois grupos alternados e para as pernas quando morde |
| Voo nupcial (D118) | Revoada: as aladas saem do cortadouro quase juntas e sobem em leque, girando, batendo as asas e diminuindo até sumir |
| Troca de estação (D118) | 1,6 s: as plantas murcham ou crescem e as cores mudam. Folhas caem rodando no inverno e no começo do outono; brotos e flores abrem na primavera |
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

### 6.1 Tela de jogo (D56, D123)

```
┌────────────────────────────────────┐
│╭──────────────────────────────────╮│ ← ilha do tempo (40 dp), translúcida,
││Primavera ◉ ◉        ◉ ◉ ◉ ◉      ││   sobre o céu: estação, ★ quanto falta
││★ 5:24  ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬|▬▬▬▬▬▬▬ ★ ││   para o voo, linha das 4 estações e
│╰──────────────────────────────────╯│   o inimigo de cada onda (◉)
│╭────────────────────────╮ ╭──╮╭──╮ │ ← ilha da colônia: fungo grande com o
││● 54 +14/min  ✦ 0/6 ⚑ 30│ │‖ ││1×│ │   saldo, objetivo e população;
│╰────────────────────────╯ ╰──╯╰──╯ │   pausa e 1×/2× (40 dp)
│ ╭───────────╮                      │ ← alerta da rainha: só quando ela é
│ │♛ Rainha ▬ │   ~~ céu ~~   ψ      │   atacada (vermelho, pulsando)
│ ╰───────────╯                      │
│ ═══◯════════════════◯═════════════ │ ← superfície e cortadouros
│    ║                ║              │
│    ●══════[jardim]══●              │
│    ║                ║         ◀ !  │ ← alerta fora da tela (24 dp)
│ [real]          [berçário]         │
│    ●═══[depósito]                  │       MAPA (vai até o topo;
│                                    │   rolagem e zoom)
├────────────────────────────────────┤
│ ⇅ 8   ⛏ 4   ♥ 6   ⛨ 3   ◌ 5        │ ← 48 dp: papéis (toque abre §6.5)
├────────────────────────────────────┤
│  [ ✚ Construir ] [ ⚔ Expedição ] ☰ │ ← 64 dp: ações (faixa do polegar)
└────────────────────────────────────┘
```

- **Barra de cima (D123):** não há faixa. O mapa vai até o topo, e por cima ficam ilhas translúcidas com cantos arredondados.
- **Ilha do tempo:**
  - à esquerda ficam o nome da estação, na cor dela, e quanto falta para o voo, com a ★;
  - a linha mostra as 4 estações em cores (outono, inverno, primavera, verão), preenchidas até o cursor de agora, e a ★ do voo no fim;
  - cada onda prevista é um disco com a silhueta do inimigo: rivais, soldados, aranha ou lacraia. A onda que chega em menos de 45 s pisca em vermelho, e as que já passaram ficam apagadas (D25);
  - tocar numa onda abre o detalhe: de onde vem, o traço e quando chega.
- **Ilha da colônia:**
  - o fungo aparece grande, com o saldo por minuto, que fica vermelho quando é negativo;
  - o objetivo da fase (aladas X/6 ou o que a fase pedir, D73) e a população ficam menores;
  - tocar abre o painel de estoques completo, com os 17 recursos e o saldo de cada um.
- **Velocidade:** a pausa e um botão que alterna entre 1× e 2×, os dois de 40 dp.
- **Rainha:** não ocupa lugar fixo. Quando ela é atacada, aparece logo abaixo das ilhas um alerta vermelho pulsando, com a vida dela. Tocar no alerta leva a câmera até a câmara real.
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
│ │ ◇● │ │ ▲● │ │ ⬡  │ │ ▼  │ │ ⬠  │ │ ← cartões de 64 dp (D122, A2): ícone
│ │    │ │    │ │    │ │    │ │    │ │   no disco da cor da família,
│ │20pt│ │20pt│ │20pt│ │20pt│ │ 🔒 │ │   custo, cadeado se a fase
│ └────┘ └────┘ └────┘ └────┘ └────┘ │   não liberou
├────────────────────────────────────┤
│ [ ✕ Cancelar ]      [ ✓ Confirmar ]│
└────────────────────────────────────┘
```

- **Túnel:** arrastar a partir de um nó ou câmara desenha o túnel, que se alinha à grade em segmentos retos de até 3 células (02 §4.1). Soltar cria um nó novo, ou liga a um nó existente se terminar sobre ele.
- **Grade (D122):** aparece só em volta do dedo, num raio de umas 3 células.
- **Estrutura:** toque no cartão, depois toque no lugar. A estrutura aparece como fantasma:
  - verde-água quando há rota a até 3 células: o túnel de ligação e o nó são planejados sozinhos e somados ao custo;
  - âmbar quando não há rota perto: dá para construir, mas a obra fica desconectada até o jogador cavar a rota;
  - vermelho quando o lugar está ocupado.
- **Confirmar:** manda tudo o que foi planejado para a fila de obras (D36). As escavadoras seguem a ordem em que as obras foram marcadas.
- **Pausa automática:** opção nas configurações, desligada por padrão (D36).

### 6.3 Painel de estrutura

Todos os painéis são uma gaveta que expande (D122): sobem curtos, com o essencial, e abrem por inteiro ao arrastar para cima ou tocar. A gaveta fica por cima do mapa, com os cantos arredondados mostrando o mapa atrás. Curta, ocupa no máximo 45% da tela, para o mapa continuar visível.

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
│ ▕████▒▒▒░░░░▓▓▏ divisão da colônia │ ← barra nas cores dos papéis (D122)
│ ⇅ Carregar  8 +3 cortad. [ − ][ + ]│
│ ⛏ Escavar   4 +1 cavad.  [ − ][ + ]│
│ ♥ Cuidar    6            [ − ][ + ]│
│ ⛨ Guardar   3            [ − ][ + ]│
│ ◌ Reserva   5  (defende a rainha)  │
│ Pedidos sem carregadora: 4 (!)     │ ← diagnóstico (02 §9)
├────────────────────────────────────┤
```

- **Barras (D122, B1):** no alto, a barra mostra a divisão da colônia nas cores dos papéis. Embaixo de cada linha, uma barrinha mostra a parte daquele papel.
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
| Túnel quase cheio | Borda amarela suave pulsando a 0,5 Hz (D91) | — | — |
| Túnel cheio com fila | Borda vermelha suave pulsando a 1 Hz (D91) e formigas na fila fora da boca | Seta amarela na borda da tela se a fila passa de 5 (D93) | — |
| Sem rota | Formigas paradas com "?" em cima | Aviso fixo "Sem rota de volta" | — |
| Falta ingrediente | Ícone cinza do ingrediente com "!" | — | Toque leva à câmara que produz o ingrediente |
| Falta cuidadora | Pips vazios piscando | Número de Cuidar fica amarelo | — |
| Depósito cheio | Borda tracejada e pilha fora | Ícone no painel de estoques | — |
| Fome (saldo de fungo negativo) | — | Fungo vermelho na barra; ao começar a matar (D24), borda vermelha de 4 dp na tela | Vibração curta ao morrer a 1ª formiga |
| Onda chegando | — | Marca da onda pisca na linha do ano 20 s antes; seta vermelha na boca de entrada | Som de aviso |
| Inimigo dentro do ninho | Inimigo vermelho; célula com contorno vermelho | Seta vermelha com o número de inimigos | — |
| Rainha atacada | Câmara real com borda vermelha piscando | Alerta no topo: "Rainha sob ataque" com o botão "Ir" | Vibração longa |
| Câmara nupcial atacada | Igual à rainha | Igual, com o ícone ✦ | Vibração longa |

- **Setas na borda (D93):** no máximo 4 por vez; problemas na mesma direção viram uma seta com número; tocar leva a câmera até lá; somem na visão geral.
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
| Audição | Todo som tem sinal visual equivalente; o jogo é jogável sem som. Volume separado de música e de efeitos (D121) |
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

## 15. Som e música (D121)

Tudo é sintetizado no código. O rascunho de referência está em `prototipo-arte/catalogo/som.html`.

- **Música:** orgânica acústica, com kalimba, marimba de madeira, chocalho e um tapete quente, em ré maior. É uma faixa em camadas que reagem ao jogo:

| Momento | Camadas |
|---|---|
| Começo calmo | Tapete e baixo |
| Colônia crescendo | + melodia de kalimba |
| Colônia cheia | + ritmo: chocalho, tambor e madeira |
| Onda e combate | Tudo vira tom menor e entra a tensão, mais forte: tambores graves em marcha, baixo pulsando, ataques graves e caixa |

- **Efeitos:**
  - o que é físico soa natural: escavar, mordida, asas do voo;
  - o que é informação soa como nota da escala da música, presa à batida: toque, entrega, nascimento, obra pronta, lugar inválido e alertas (onda, rainha atacada);
  - entregas só na área visível, no máximo umas 4 por segundo, e nada no zoom longe.
- **Ambiente:** acompanha a câmera.
  - Na superfície, o tempo da estação: chuva e pássaros na primavera, grilos e cigarra no verão, vento e folhas no outono, vento frio no inverno.
  - No fundo, terra abafada, gotas e terrinha caindo.
- **Configurações:** volume da música e volume dos efeitos, que inclui o ambiente, de 0 a 100%.
