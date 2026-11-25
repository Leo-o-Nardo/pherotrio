# 00 · Índice do design

> Fechamento da fase de design (etapas a até e). Escrito em 2026-11-25.
>
> Nome do jogo provisório: **Pherotrio** (Q01).

## 1. O jogo em 30 segundos

- **O que é:** estratégia econômica minimalista num formigueiro em corte lateral, para Android, em retrato. Inspirado na mecânica do Achikaps.
- **O jogador é a colônia:**
  - escava túneis e câmaras;
  - ajusta quantas operárias carregam, escavam, cuidam e guardam;
  - escolhe a dieta dos berçários.
  - As formigas fazem o resto sozinhas.
- **O coração do jogo:**
  - uma **árvore de criação** com 17 recursos, que libera 10 castas e 26 estruturas;
  - uma **rede de túneis com trânsito de verdade**: capacidade, filas, sentido e 4 níveis.
- **Campanha:** 3 arcos de 5 fases. A colônia cresce por 5 anos, faz o voo nupcial e funda um ninho novo com um traço herdado.
- **Monetização:** o arco 1 é grátis. O resto se libera com uma compra única ou com anúncios premiados opcionais. Sem energia e sem pay-to-win.

## 2. Documentos

| Arquivo | O que tem | Etapa | Status |
|---|---|---|---|
| [`01-visao.md`](01-visao.md) | Pitch, fantasia, pilares, referências, público | (a) | Aprovado |
| [`02-mecanicas.md`](02-mecanicas.md) | Sistemas: loop, transporte, papéis, mapa e túneis, ciclo de vida, combate, ondas, expedição, vitória, diagnóstico | (b) | Aprovado |
| [`07-arvore-de-criacao.md`](07-arvore-de-criacao.md) | **Fonte da verdade do conteúdo:** recursos, receitas, castas, estruturas, upgrades, inimigos | (b2) | Aprovado |
| [`03-arte-e-interface.md`](03-arte-e-interface.md) | Paleta, legibilidade, telas, gestos, feedback, acessibilidade | (c) | Interface aprovada; **o visual do mundo será refeito na etapa (c2)** (D61) |
| [`04-conteudo-e-progressao.md`](04-conteudo-e-progressao.md) | As 15 fases, arcos, transição, traços, dificuldade, tutorial, desafios, sandbox | (d) | Aprovado |
| [`05-escopo-e-prototipo.md`](05-escopo-e-prototipo.md) | Escopo, arquitetura, esforço, protótipos e critérios, testes, roteiro, Steam, China, receita | (e) | Aprovado |
| [`06-decisoes.md`](06-decisoes.md) | **Fonte da verdade das decisões:** D01 a D86 e as questões em aberto | Todas | Vivo |
| `08-direcao-de-arte.md` | Visual do mundo: traçado dos túneis, câmaras, formigas, cores | (c2) | **A escrever (próxima etapa)** |
| `../prototipo-visual/` | Rascunho de interação em HTML. **Não é referência de estilo** (D61) | — | Histórico |

### Como ler

- **Para entender o jogo:** 01 → 02 → 07 → 04.
- **Para construir:** 05 → 02 → 07 → 03.
- **Em caso de conflito:**
  - o `06` vence sobre os outros;
  - o `07` vence sobre o `02` em tudo que é conteúdo (receitas, castas, estruturas).
- **Convenções:**
  - `Dxx` é uma decisão e `Qxx` é uma questão em aberto, as duas no `06`;
  - números são **hipóteses a calibrar** no protótipo, salvo quando indicado.

## 3. Etapas

| Etapa | Status |
|---|---|
| (a) Visão | ✅ |
| (b) Mecânicas | ✅ |
| (b2) Árvore de criação | ✅ |
| (c) Interface e UX | ✅ (o visual do mundo passou para a c2) |
| (d) Conteúdo e progressão | ✅ |
| (e) Escopo e protótipo | ✅ |
| Fechamento (este índice) | ✅ |
| **(c2) Direção de arte do mundo** | ⏭ Próxima |
| Protótipo 1 (início do código) | Depois da c2, ou em paralelo a partir do portão de desempenho |

## 4. O que está decidido

- **Núcleo:**
  - o jogador constrói e as formigas executam (P1);
  - papéis com botões + e − (D14, D35);
  - transporte por pedidos (`02` §2.2).
- **Túneis (D52, D53):**
  - limite rígido com fila;
  - sentido escolhido pelo jogador;
  - 4 níveis;
  - a largura muda o combate;
  - indicadores de trânsito;
  - construção em segmentos de até 3 células, formando uma teia.
- **Conteúdo (D44, D77):** 17 recursos, 10 castas, 26 estruturas e 4 inimigos com traços. Tudo entra no lançamento, incluindo o N3.
- **Campanha (D67 a D76):**
  - 3 arcos × 5 fases;
  - inverno de transição com checkpoint;
  - mapa grande que se abre por regiões;
  - voo no fim do arco e 1 traço entre 3;
  - estrelas;
  - 8 desafios;
  - sandbox;
  - 3 dificuldades.
- **Interface (D54 a D59):**
  - tema escuro, paleta testada para daltonismo;
  - 3 níveis de detalhe;
  - layout em retrato;
  - fonte Atkinson Hyperlegible;
  - acessibilidade mínima.
- **Tecnologia (D81, D85, D86):**
  - TypeScript, Vite, PixiJS, HTML/CSS e Capacitor;
  - simulação determinística, separada do desenho;
  - portão de desempenho primeiro;
  - bots e métricas locais.
- **Negócio:**
  - monetização híbrida (D82);
  - Android primeiro;
  - Steam depois (D83);
  - China pela Steam (D84).
- **Testes (D79, D80):**
  - o usuário e Claude testam os protótipos;
  - teste fechado da Play Store com 12 ou mais testadores por 14 dias;
  - Redmi Note 14 mais um celular de entrada.

## 5. O que está em aberto

| Quando | Questões |
|---|---|
| **Etapa (c2)** | Q25 traçado dos túneis · Q26 cores do mundo (azul repetido) · Q27 minimapa |
| **Antes do portão de desempenho** | Q32 modelo do celular de entrada |
| **Nos protótipos** | Q03 receitas e tempos · Q15 prioridade das cuidadoras · Q18 tamanho da colônia · Q20 leitura dos recursos · Q21 inimigos no túnel · Q22 mudar sentido com formigas dentro · Q23 silhuetas das castas |
| **Durante o protótipo 2** | Q31 som e música |
| **Antes do protótipo 3** | Q01 nome do jogo |
| **Antes do teste fechado ou no lançamento** | Q33 métricas anônimas · Q10 preço final |
| **Depois do lançamento** | Q09 eventos ambientais · Q29 Electron ou Tauri · Q30 tradução para chinês |

Também ficam em aberto as 39 decisões **provisórias**, que o protótipo pode derrubar. Elas estão marcadas no `06`.

## 6. Os 3 maiores riscos

1. **O núcleo de logística não divertir.**
   - O jogo inteiro aposta que montar e manter a teia de túneis é prazeroso.
   - O congestionamento pode virar caos ou tarefa repetitiva.
   - **Mitigação:** o protótipo 1 com critérios medidos e uma decisão explícita de seguir, ajustar ou repensar (`05` §5).
2. **Complexidade e leitura para um jogador novo, numa tela de celular.**
   - São 17 recursos, 10 castas e túneis com 4 níveis em 360 dp de largura.
   - Esse risco piora porque só quem desenhou o jogo testa os protótipos (D79).
   - **Mitigação:**
     - abertura gradual da árvore (D62);
     - tutorial embutido (D63);
     - testes de leitura (Q20, Q23);
     - métricas (D86);
     - 2 ou 3 pessoas de fora no protótipo 3.
3. **Projeto longo com retorno incerto.**
   - São de 43 a 68 semanas focadas, e o cenário realista de receita é modesto (cerca de R$ 5 mil no 1º ano Android, `05` §9.3).
   - O risco é perder o ritmo antes de chegar à loja.
   - **Mitigação:**
     - marcos curtos com algo jogável no fim de cada um;
     - o arco 3 como corte de reserva (D77);
     - a Steam como segunda chance comercial.

> O desempenho em celular fraco também é um risco sério, mas é o mais barato de descobrir: o portão sai na primeira ou segunda semana de código.

## 7. Próxima ação

1. **Etapa (c2): direção de arte do mundo.**
   - Uma rodada de entrevista sobre traçado dos túneis, forma das câmaras, formigas sem patas e cores do mundo.
   - Depois, mini-protótipos visuais de uma tela, testados no Redmi Note 14.
   - O resultado é o `08-direcao-de-arte.md`.
2. **Em seguida, o M0 e o M1** (`05` §8):
   - `git init`;
   - projeto base gerando APK;
   - portão de desempenho.
   - O portão pode começar em paralelo à c2, porque só usa formas simples.
