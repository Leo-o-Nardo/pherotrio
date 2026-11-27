# 01 — Visão

> Status: **etapa (a) aprovada**. Última revisão: 2026-11-25 (monetização atualizada pela D82).
> Nome do jogo: **em aberto** (a pasta do projeto se chama "Pherotrio"; ver Q01 em `06-decisoes.md`).

---

## 1. Pitch

**Uma frase**

Escave um formigueiro em corte lateral, combine folhas, seiva, presas e argila em uma árvore de recursos e crie novas castas e defesas para sobreviver aos formigueiros rivais até o voo nupcial.

**Um parágrafo**

Você não controla formigas: você é a colônia. Decide onde escavar túneis e câmaras, o que cada berçário dá de comer às larvas e quantas operárias vão carregar, escavar, cuidar ou guardar, e as formigas executam sozinhas. Folhas viram fungo, seiva vira néctar, presas viram proteína, e as combinações desses recursos (pasta, ácido, carapaça, geleia, cola) liberam castas, defesas e upgrades, cada um exigindo o seu recurso. Cada cortadouro aberto para colher mais folhas é também uma porta para predadores, e os ninhos rivais cavam até você pelos lados. Uma fase dura um ano da colônia (de 12 a 20 minutos, quatro estações). A mesma colônia cresce por 5 anos, e no fim de cada arco as aladas saem no voo nupcial e fundam um ninho novo, com um traço herdado (D67, D73). Se a rainha morre, a fase acaba.

## 2. Fantasia do jogador

**"Eu sou o formigueiro."** O jogador é a vontade coletiva da colônia (superorganismo), não a rainha nem um comandante. A rainha é a peça mais valiosa e mais frágil do tabuleiro: fica no fundo do ninho, põe os ovos e, se morrer, a partida acaba.

O prazer central é ver uma máquina viva que você projetou funcionando sozinha: filas de carregadoras fluindo por túneis que você escavou, larvas virando soldados porque você trocou a dieta de um berçário três minutos antes, e uma porta tampada por uma formiga-tanque segurando a onda que você previu.

## 3. Pilares de design

### P1. Você constrói, as formigas fazem

- **Na prática:** o jogador tem só quatro ferramentas: (1) posicionar e melhorar câmaras, túneis e postos de guarda, (2) ajustar os sliders de papéis das operárias, (3) escolher a dieta de cada berçário, (4) decidir expedições contra rivais. Todo movimento de formiga é automático.
- **Não fazer:** selecionar, arrastar ou comandar formigas individualmente. Nada de botões de habilidade por unidade. Se uma situação parece exigir micro, a resposta está numa estrutura ou num slider, não num comando.

### P2. Toda formiga custa uma cadeia

- **Na prática:** cada casta exige pelo menos um recurso processado, e cada recurso processado exige uma estrutura com operárias trabalhando e carregadoras abastecendo. Querer atiradoras significa ter seiva virando néctar, presas virando proteína, uma câmara ácida combinando os dois, carregadoras e um berçário com a dieta certa, e isso leva minutos. A árvore completa está em `07-arvore-de-criacao.md`.
- **Não fazer:** moeda única que compra tudo. Recursos que não alimentam nenhuma decisão. Unidades que aparecem instantaneamente.

### P3. A ameaça entra por onde você cresceu

- **Na prática:** cada cortadouro (entrada) aumenta a colheita e também a área a defender. Ninhos rivais cavam até o seu pelos lados. O layout do ninho é a sua defesa: gargalos, postos de guarda e profundidade da rainha importam.
- **Não fazer:** ondas que ignoram o layout. Torres de defesa autônomas sem custo logístico. Um único ponto de entrada fixo.

### P4. A colônia se lê em qualquer zoom

- **Na prática:** formas geométricas simples, recursos e castas distinguidos por cor **e** forma, gargalos visíveis (fila parada, câmara piscando, contador vermelho). A colônia pode crescer sem limite de câmaras num mapa com rolagem e zoom (D32). Com zoom afastado, o detalhe cai (formigas viram pontos) e os alertas continuam visíveis; alertas fora da tela apontam para onde está o problema.
- **Não fazer:** decoração sem função, textos longos, painéis de números como forma principal de feedback, mais tipos de estrutura do que o jogador consegue distinguir pela forma.

### P5. A biologia inspira, a diversão decide

- **Na prática:** cada casta e estrutura nasce de um comportamento real de formiga, exagerado para virar mecânica (a formiga que tampa a porta com a cabeça, a que explode, a que cultiva fungo). Um cartão curto de cada casta cita a espécie que a inspirou, como tempero.
- **Não fazer:** sacrificar diversão por fidelidade. Conteúdo educacional. Misturar espécies é permitido (a colônia do jogo é fictícia).

## 4. Público, plataforma e formato

| Item | Decisão |
|---|---|
| Público | Adultos de 18 a 40 anos que jogam estratégia curta no celular: quem gostou de Mini Metro, rymdkapsel, Achikaps, Islanders. Gostam de otimizar sistemas, não de grind nem de PvP. |
| Plataforma | Android primeiro, tela em **retrato**. iOS depois, se o Android validar. |
| Sessão | Fase de 12 min (iniciais) a 20 min (finais) = 1 ano da colônia em 4 estações (outono → inverno → primavera → verão). Campanha em **3 arcos de 5 fases**: a mesma colônia cresce por 5 anos, o voo nupcial fecha o arco e funda um ninho novo, com um traço da linhagem escolhido pelo jogador (D67; ver `04`). Sandbox configurável. Modo "ano com variações sorteadas" depois do MVP. |
| Vitória | Fim do arco: voo nupcial com X aladas. Fases intermediárias: objetivo próprio do ano (D73). Fases de assalto: destruir o ninho rival (D71). |
| Derrota | A rainha morre (atacada ou por fome). |
| Monetização | Híbrida (D82): o arco 1 é grátis. O resto se libera com uma compra única ou, fase a fase, com anúncios premiados opcionais. Sem energia, sem anúncio que interrompe, sem moedas, sem pay-to-win. |
| Idiomas | PT-BR e EN desde o início. |

## 5. Visão do sistema em uma página

Os sistemas ficam em `02-mecanicas.md`, e o conteúdo (recursos, receitas, castas, estruturas) em `07-arvore-de-criacao.md`. Aqui só o esqueleto, para dar coerência. A **árvore de criação é o centro do jogo** (D38).

- **Tabuleiro:** corte lateral vertical. Uma faixa fina de superfície no topo com plantas em posições fixas. Abaixo, o solo onde o jogador escava túneis e câmaras.
- **Recursos:** 4 naturais (folha das plantas, seiva dos bolsões de raízes, presa de inimigos mortos, argila de toda escavação) → 5 processados N1 → 5 combinados N2 → 2 combinados N3 (pós-MVP).
- **Extração:** plantas e bolsões de raízes ficam em posições fixas, e o extrator precisa ser construído dentro do anel da fonte (cortadouro embaixo da planta, coletor de seiva ao lado do bolsão). Os bolsões se esgotam e empurram a expansão. Presa vem de inimigos mortos e de expedições; argila, de escavar.
- **População:** a rainha põe ovos → o ovo vai para um berçário → a larva é alimentada conforme a **dieta** do berçário → nasce a casta correspondente.
- **Papéis das operárias (sliders):** Carregar, Escavar, Cuidar, Guardar e Reserva (as que sobram, que defendem a rainha).
- **Castas no MVP (proposta, `07` §12):** econômicas (operária, cortadeira, cavadora), de combate (soldado, tanque, atiradora, curandeira) e alada. Depois do MVP: explosiva e saqueadora.
- **Estruturas de defesa e ataque:** posto de guarda, barricada, torre ácida, armadilha de cola e galeria de assalto no MVP; mina de gosma e posto de guerra depois.
- **Ameaças no MVP:** predadores que descem pelos cortadouros (de cima) e um ninho rival que ataca pelos túneis laterais (dos lados). Depois do MVP: escavadores que furam o solo em qualquer ponto (de baixo).
- **Defesa:** postos de guarda que o jogador posiciona; as formigas de combate se distribuem sozinhas entre eles.
- **Contra-ataque:** expedição ao ninho rival, que tem vida, manda ondas e devolve saque quando atacado.

## 6. Diferencial frente às referências

| Referência | O que ela faz | O que fazemos diferente |
|---|---|---|
| **Achikaps** | Rede de módulos, trabalhadores por sliders (Construir, Carregar, Defender, Ocioso), ondas de invasores, campanha + sandbox. | Mantemos o núcleo (infraestrutura + sliders + logística), de propósito. Acrescentamos: corte lateral com profundidade e ataques de 3 direções; população que nasce de uma cadeia com atraso (ovo → larva → casta); castas de combate com funções distintas, cada uma presa a uma cadeia de produção; ninho rival que pode ser atacado; vitória por voo nupcial e ritmo de estações. |
| **rymdkapsel** | RTS minimalista com salas em formato de Tetris, ondas, derrota quando todos morrem. | A crítica recorrente a ele é falta de profundidade e cenários. Nossa resposta: cadeias de produção e castas dão mais decisões por minuto, e a campanha introduz regras em sequência. Risco compartilhado: comportamento de trabalhadores que parece "burro". |
| **Empires of the Undergrowth** | Formigueiro escavado, rainha a proteger, ordens por marcadores de feromônio, RTS para PC. | Mobile, sem controle de grupos, sessões curtas, visual esquemático. |
| **SimAnt** | Já em 1991 tinha distribuição de tarefas (coleta, cuidado, escavação) e escolha de casta da rainha. | Sliders de castas não são novidade. Nossa novidade é ligar a casta a uma cadeia de produção e ao layout espacial de defesa. |
| **Jogos F2P de formiga** (The Ants: Underground Kingdom, Pocket Ants) | Base-building com PvP e monetização agressiva. Reclamação recorrente: pay-to-win. | Jogo fechado, honesto, offline. Paga uma vez, ou libera com anúncios opcionais. Nada de energia ou pay-to-win. |

## 7. Referências pesquisadas: o que aprendemos

Legenda: ✅ verificado em fonte · ⚠️ verificado parcialmente · ❓ não verificado

### Achikaps (Yiotro / Ivan Yakovliev)
- ✅ Estruturas de produção, trabalhadores divididos em Construir, Carregar, Defender e Ocioso por sliders. Os trabalhadores carregam recursos entre estruturas e também precisam ocupá-las. ([JayIsGames](https://jayisgames.com/review/achikaps.php))
- ✅ A tensão vem de tirar trabalhadores da produção para defender contra invasores periódicos. (JayIsGames)
- ✅ Campanha com tutorial gradual, modo sandbox, gratuito na App Store. ([App Store](https://apps.apple.com/us/app/achikaps/id1515537717))
- ✅ Crítica: a alocação de trabalhadores foi descrita como "finicky" (chata de ajustar). **Lição: os sliders precisam ser muito bons no toque.**
- ⚠️ Pelo print enviado pelo usuário: rede de nós ligados por linhas retas, módulos circulares presos por "hastes", cerca de 7 tipos de módulo diferenciados por cor e ícone, inimigos espinhosos vindo das bordas, interface mínima, tela em retrato. Fim de partida com mais de 60 módulos fica denso.
- ❓ Como novos trabalhadores são gerados, custos, ritmo das ondas, modelo de monetização no Android.

### rymdkapsel (Grapefrukt, 2013)
- ✅ RTS minimalista, salas comparadas a Tetris, ondas de dificuldade crescente, derrota quando todos os trabalhadores morrem. ([Wikipedia](https://en.wikipedia.org/wiki/Rymdkapsel))
- ✅ Recepção favorável, com críticas a falta de profundidade, poucos cenários e IA de trabalhadores mal otimizada. ([Game Informer](https://gameinformer.com/games/rymdkapsel/b/playstation_vita/archive/2013/06/03/rymdkapsel-review), [Softpedia](https://www.softpedia.com/reviews/games/pc/Rymdkapsel-Review-428294.shtml))
- ✅ 200 mil cópias vendidas até dez/2013, muito por causa de um Humble Bundle.

### Empires of the Undergrowth
- ✅ Ninho escavado com câmaras de comida e berçário. Rainha a proteger. Ovos param de chocar sem comida. Ordens por marcadores de feromônio. Avaliações "Overwhelmingly Positive" no Steam. ([Steam](https://store.steampowered.com/app/463530/))
- ❓ Taxas de postura e tempos de desenvolvimento das larvas.

### SimAnt (Maxis, 1991)
- ✅ O jogador distribui o tempo entre coleta, cuidado e escavação e escolhe se a rainha produz operárias, soldados ou reprodutores. A chuva apaga trilhas de feromônio. ([Wikipedia](https://en.wikipedia.org/wiki/SimAnt), [PC Gamer](https://www.pcgamer.com/saturday-crapshoot-simant))

### Myrmidon
- ⚠️ Só foi encontrado um protótipo de uma semana no itch.io, focado no ninho. ([itch.io](https://headmounteddingus.itch.io/myrmidon)) Pode não ser o jogo que o usuário tinha em mente.

### Jogos F2P de formiga
- ✅ The Ants: Underground Kingdom: crítica recorrente de pay-to-win em raides e de forte dependência de compras. ([Android Central](https://www.androidcentral.com/ants-underground-kingdom-android-game-week), [Gamerefinery](https://gamerefinery.com/the-ants-stands-out-with-its-unique-theme-and-heavy-emphasis-on-social-elements))

### Biologia usada como inspiração (não precisa ser fiel; ver P5)
- ✅ Formigas-cortadeiras cultivam fungo com folhas, o fungo alimenta larvas e rainha, e o lixo vai para câmaras separadas. ([PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC5451793), [Wikipedia](https://www.wikipedia.org/wiki/Leaf_Cutter)) → jardim de fungo e lixeira.
- ✅ *Formica archboldi* imobiliza presas com jato direcionado de ácido fórmico. ([ScienceDaily](https://sciencedaily.com/releases/2018/11/181116110533.htm)) → atiradora.
- ✅ Soldados de *Colobopsis* tampam a entrada do ninho com a cabeça (fragmose). ([AntWiki](https://antwiki.org/wiki/Phragmosis)) → tanque.
- ✅ *Colobopsis explodens* rompe o próprio corpo e libera uma gosma pegajosa e tóxica, morrendo no processo. ([Smithsonian](https://www.smithsonianmag.com/smart-news/exploding-ant-ruptures-its-own-body-defend-its-nest-180968857/)) → explosiva (pós-MVP).
- ⚠️ *Labidus coecus* foi observada atacando colônias de outras formigas por baixo da terra. ([AntWiki](https://antwiki.org/wiki/Labidus_coecus)) → ameaça "de baixo" (pós-MVP).
- ⚠️ Formiga-acrobata (*Crematogaster*): ferrão móvel; spray de veneno só confirmado numa espécie africana. ([NC State](https://content.ces.ncsu.edu/acrobat-ants)) → **cortada** por ser redundante com a atiradora.
