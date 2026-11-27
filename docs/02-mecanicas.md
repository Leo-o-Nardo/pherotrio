# 02 — Mecânicas e sistemas

> Status: **etapa (b) aprovada**. Última revisão: 2026-11-25.
> Todos os números são **hipóteses a calibrar** no protótipo. Eles existem para mostrar que a economia fecha e para dar um ponto de partida, não como valores finais.
> Decisões citadas como `Dxx` estão em `06-decisoes.md`.
>
> **Revisado em 2026-11-25:** recursos, receitas, castas, estruturas e upgrades agora vivem em `07-arvore-de-criacao.md` (D38, D44). Este documento fica com os **sistemas**: loop, transporte, sliders, mapa, ciclo de vida, combate, ondas, expedição, vitória e diagnóstico. O limite de 12 câmaras foi removido (D32).

---

## 0. Unidades usadas neste documento

| Unidade | Significado |
|---|---|
| **célula** | Um quadrado da grade do mapa. Uma estrutura ocupa de 2 × 1 a 3 × 2 células, conforme o tipo (D105). O mapa tem cerca de 80 × 80 células por arco (D94); linha 0 = superfície. |
| **s / min** | Tempo de jogo em velocidade 1×. |
| **pt** | Ponto de escavação. Uma escavadora produz 1 pt/s trabalhando no local. |
| **/min** | Taxa por minuto. |

## 1. Loop central

### 1.1 Segundo a segundo
O jogador **observa fluxos e reage a sinais**: filas de carregadoras nos túneis, um ícone de "sem entrada" piscando no jardim, uma seta de onda aparecendo na linha do tempo. As ações típicas levam 1 ou 2 toques: mover 3 formigas de Carregar para Cuidar, pausar uma câmara, posicionar um túnel.

### 1.2 Minuto a minuto
A cada 30 a 60 s surge uma **decisão de investimento**:
- trocar a dieta de um berçário (operárias agora ou tanques para a onda de daqui a 2 minutos?);
- abrir um novo cortadouro ou coletor de seiva (mais recurso; um cortadouro também é mais uma porta para defender);
- fazer upgrade de um túnel engarrafado;
- mandar uma expedição agora, aproveitando que a onda acabou;
- começar a encher a câmara nupcial, sabendo que as aladas comem e não trabalham.

### 1.3 Sessão (uma fase, cerca de 12 min)
Um ano em 4 estações, sempre na ordem **outono → inverno → primavera → verão** (D23). Cada estação dura de 3 min (fases iniciais, 12 min no total) a 5 min (fases finais, 20 min no total) (D42). O arco de uma fase de 12 min é:

| Estação | Tempo | O que o jogador faz |
|---|---|---|
| Outono | 0:00–3:00 | Monta a base, primeiros extratores, estoca fungo. Ondas fracas e frequentes fornecem as primeiras presas. |
| Inverno | 3:00–6:00 | Sem folha. Vive do estoque, escava, faz upgrades. Rival quieto: melhor janela para expedição. |
| Primavera | 6:00–9:00 | Folha no máximo. Cresce rápido, cria castas de combate, começa as aladas. |
| Verão | 9:00–12:00 | Ondas fortes e um chefe. Protege a câmara nupcial. Às 12:00, voo nupcial: fim da fase. |

## 2. Recursos e fluxo

### 2.1 Recursos e receitas

**Movido para `07-arvore-de-criacao.md`** (§1 e §2): 4 recursos naturais (folha, seiva, presa, argila), 5 processados N1, 5 combinados N2, 2 combinados N3 e o refugo. O fungo continua sendo a base da manutenção de todas as formigas e dos ovos da rainha.

### 2.2 Regras de transporte (sistema de pedidos)
1. Cada estrutura tem um **estoque de entrada** pequeno (ex.: jardim guarda até 6 folhas). Quando cai abaixo da metade, a estrutura emite um **pedido**.
2. Cada estrutura tem um **estoque de saída** (ex.: 6 fungo). O que está na saída fica disponível para quem pedir.
3. Uma carregadora livre pega o pedido de maior prioridade: `prioridade = urgência ÷ distância`. A urgência sobe com o tempo que o pedido está esperando. Ela busca o recurso na fonte mais próxima com estoque (saída de uma estrutura ou depósito) e entrega.
4. Saídas cheias sem pedidos vão para o **depósito** mais próximo com espaço. Sem depósito com espaço, a estrutura **para** e mostra o ícone "saída cheia".
5. Cada carregadora leva **1 unidade por viagem** (a cortadeira leva 2; ver `07` §4.2).

- **Problema que resolve:** dá vida visível à economia (filas de formigas) e cria gargalos que o jogador enxerga e corrige com mais carregadoras, túneis mais curtos ou upgrades.
- **Risco de balanceamento:** formigas indo e voltando sem lógica aparente fazem o jogador achar a IA "burra", que é exatamente a crítica ao rymdkapsel. **Mitigação:** a regra é simples e determinística, e cada pedido parado aparece como ícone na estrutura.

## 3. Operárias e sliders

### 3.1 Papéis (D14)

| Slider | O que faz | Para onde vai |
|---|---|---|
| **Carregar** | Atende pedidos de transporte; corta folha no cortadouro; recolhe corpos (presa) | Rede inteira |
| **Escavar** | Constrói túneis, câmaras e upgrades (1 pt/s no local) | Obras pendentes, na ordem em que foram pedidas |
| **Cuidar** | Ocupa as vagas de trabalho dentro das estruturas (extratoras, processadoras, berçários) | Estruturas com vaga livre, por prioridade (abaixo) |
| **Guardar** | Fica nos postos de guarda e cortadouros; luta com força de operária | Postos, divididos igualmente |
| **Reserva** (o que sobra) | Fica na câmara real; defende a rainha se um inimigo chegar até ela | Câmara real |

- O slider mostra **número de formigas**, não porcentagem, porque com 60 a 120 formigas a contagem é legível.
- Ao mudar um slider, as formigas se realocam caminhando, sem teletransporte. Uma troca grande leva alguns segundos para fazer efeito.
- **Prioridade das cuidadoras** (fixa no MVP): berçário > jardim de fungo > extratoras > processadoras N1 > N2 > N3. O jogador pode **pausar** qualquer estrutura com um toque, o que libera as vagas dela.

- **Problema que resolve:** é a principal ferramenta de controle sem micro (pilar P1). A Reserva tem uma função real: é a última linha de defesa da rainha. Por isso ela não é um papel vazio.
- **Risco de balanceamento:** existir uma distribuição ótima fixa ("sempre 40% Carregar"). **Mitigação:** as estações mudam qual é o gargalo. No inverno Escavar vale mais, na primavera Carregar e Cuidar, no verão Guardar. A crítica de "finicky" ao Achikaps vale aqui: a interface dos sliders é um risco de UX e será tratada na etapa (c).

## 4. Mapa, escavação e estruturas

### 4.1 Regras de posicionamento
- **Grade:** um mapa por arco, com cerca de 80 × 80 células (D94), que se abre por regiões do centro para os lados (D95). Rolagem nos dois eixos e zoom de pinça (D32); afastando ao máximo, o mapa inteiro cabe na tela (D92). No zoom inicial (24 dp por célula, D55), a tela em retrato mostra cerca de 15 colunas. O terreno tem **percalços** (§4.4).
- **Rede (teia de túneis):**
  - estruturas ficam em células e se ligam a **nós** (cruzamentos);
  - nós se ligam por **segmentos de túnel de no máximo 3 células**;
  - o jogador monta a rede **parte por parte**: cava um segmento, coloca um nó, cava o próximo, e assim forma uma teia;
  - túneis não se cruzam: para cruzar, você coloca um nó;
  - o traçado visual do segmento (reto, curvo ou orgânico) fica para a etapa de direção de arte (Q25).
- **Conexão (D122):** se a estrutura fica a até 3 células de uma rota (túnel ou nó), o túnel de ligação e o nó são planejados sozinhos, com o custo somado. Mais longe, ela pode ser construída, mas fica inativa, com o ícone de "desconectada", até o jogador cavar a rota. Uma estrutura sem caminho até a câmara real também fica inativa.
- **Extratores (D20):** o cortadouro precisa estar dentro do anel da planta (até 1 célula de distância da base). O coletor de seiva precisa estar dentro do anel do bolsão de raízes (até 1 célula). O poço de argila pode ficar em qualquer célula escavável.
- **Sem limite de câmaras** (D32). O crescimento é limitado pela economia (manutenção, mão de obra de escavação) e pelo tamanho do mapa da fase.
- **Demolir:** 1 toque e confirmação. Não devolve nada.

### 4.2 Custos de escavação

| Obra | Custo (pt) | Com 4 escavadoras (sem contar a caminhada) |
|---|---|---|
| Túnel nível 1 | 4 por célula | 1 s por célula |
| Túnel níveis 2 a 4 | ver a tabela de túneis abaixo (D52) | — |
| Nó | 2 | < 1 s |
| Câmara média, 3 × 1 (produção e lixeira, D105) | 24 | 6 s |
| Câmara grande, 3 × 2 (câmara real, berçário, depósito, câmara nupcial, D105) | 36 | 9 s |
| Extratora, 2 × 1 (cortadouro, coletor de seiva, poço de argila) | 15 | 4 s |
| Posto de guarda e estruturas de defesa | 10 a 15 + recursos (ver `07` §5) | 3 a 4 s |
| Upgrade de estrutura para nível 2 | 25 pt + recurso específico (ver `07` §3 e §6; D47) | 7 s |

Toda escavação rende **1 argila a cada 5 pt** (ver `07` §2.1).

**Túneis: limite rígido com fila (D52, D53)**

Todo túnel tem uma capacidade fixa. Quando está cheio, a formiga seguinte espera numa **fila** na boca do túnel. A velocidade dentro do túnel não muda: 1 s por célula em qualquer nível. O que o upgrade aumenta é quantas formigas cabem ao mesmo tempo.

| Nível | Capacidade por célula | Frente de combate | Custo por célula (além do anterior) | Espessura na tela |
|---|---|---|---|---|
| 1 | 2 | 1 | 4 pt | fina |
| 2 | 3 | 2 | +4 pt, +2 barro | média |
| 3 | 4 | 2 | +4 pt, +2 barro, +1 cola | grossa |
| 4 | 5 | 3 | +6 pt, +3 barro, +1 carapaça | muito grossa |

*Hipóteses a calibrar no protótipo.* Capacidade do túnel = células × capacidade por célula (ex.: túnel de 4 células no nível 1 = 8 formigas).

- **Sentido, definido pelo jogador em cada túnel:**
  - **mão dupla (⇄):** cada sentido usa metade da capacidade, arredondada para baixo;
  - **só ida (→) ou só volta (←):** a capacidade inteira vai para um sentido, e o outro fica proibido.
  - Com dois túneis de mão única, um de ida e um de volta, o jogador monta um **circuito**, que dá o dobro de fluxo de um túnel de mão dupla do mesmo nível.
- **Fila:** é por ordem de chegada (FIFO), na boca do túnel. Entra uma formiga a cada *tempo de travessia ÷ capacidade naquele sentido*, para que o fluxo seja contínuo e não em rajadas.
  - Fluxo máximo por sentido = capacidade do sentido ÷ tempo de travessia. Ex.: 4 células, nível 1, mão dupla → 4 formigas ÷ 4 s = 1 formiga/s em cada sentido.
- **Escolha de rota:** a carregadora escolhe, entre os túneis permitidos naquele sentido, o de menor tempo estimado: *células + tamanho da fila × células ÷ capacidade do sentido*. Ela não troca de fila depois que entra numa.
- **Sem rota:** se nenhum túnel permite um sentido, as formigas que precisam dele ficam paradas, e a interface mostra o aviso "sem rota de volta" (ou de ida). O jogo avisa, mas não impede a configuração.
- **Indicadores (D53):**
  - **cor do túnel** pela ocupação do sentido mais cheio: verde-água abaixo de 70%, amarelo de 70% a 99%, vermelho quando está cheio e com fila;
  - **espessura** pelo nível;
  - **setas** pelo sentido;
  - **pontos da fila** desenhados na boca do túnel;
  - **aviso** de sem rota.
- **Inimigos (provisório):** ignoram o sentido e não contam na capacidade, que vale só para as formigas do jogador. A interação entre inimigos e trânsito fica em aberto (Q21).
- **Simulador de referência:** o comportamento acima foi testado no simulador de rotas mostrado na etapa (b2), em 2026-11-25.

- **Problema que resolve:** escavar custa mão de obra, não recurso. Assim o jogador sente o custo de oportunidade (escavadoras não carregam) sem uma moeda extra. Como escavar rende argila, expandir também alimenta construção. Upgrades pedem recursos específicos, o que dá uso a cada galho da árvore.
- **Risco de balanceamento:** escavar barato demais deixa o layout irrelevante. Escavar caro demais deixa o começo lento. A primeira variável a ajustar no protótipo é o custo da câmara (24 pt a média e 36 pt a grande, D105).

### 4.3 Estruturas

**A lista de estruturas, receitas, vagas e upgrades foi movida para `07-arvore-de-criacao.md`** (§3, §5 e §6). Aqui ficam só as regras de sistema que valem para todas.

**Limite de produção das plantas** (por planta, em folhas/min):

| Outono | Inverno | Primavera | Verão |
|---|---|---|---|
| 20 | 0 | 40 | 20 |

**Bolsões de raízes:** 300 a 600 seiva cada, definido por fase. Esgotado, o coletor de seiva para.

**Refugo:** o jardim guarda até 10 refugos. Com 10, a produção cai 50%; com 15, para. Uma carregadora leva o refugo até a lixeira (D13).

Para cada estrutura, o problema que resolve e o risco:

| Estrutura | Problema de jogabilidade que resolve | Risco de balanceamento |
|---|---|---|
| Câmara real | Ritmo de crescimento limitado e previsível: a população é uma cadeia, não uma compra (D02). | 4 ovos/min pode ser lento demais na primavera. O upgrade é a válvula. |
| Cortadouro | Liga economia e defesa: cada cortadouro é uma porta (P3). | Se uma planta der folha demais, um cortadouro basta e a expansão perde sentido. |
| Coletor de seiva | Recurso finito que obriga a expandir (D20). | Bolsões grandes demais anulam a pressão. Pequenos demais deixam o galho do néctar inviável. |
| Poço de argila | Mantém a argila disponível quando a escavação para. | Se for eficiente demais, ninguém escava pelo mapa. |
| Jardim | Coração da economia; consome 2 recursos (folha e trabalho). | É a estrutura mais sensível do jogo. Calibrar primeiro. |
| Lixeira | Cria um fluxo "de volta" e carga logística constante. | Pode virar tarefa chata. Critério de corte na D13. |
| Processadoras N1, N2 e N3 | Transformam recurso bruto em requisito de casta e de estrutura (P2). | 11 processadoras quase iguais podem parecer repetitivas. Diferenciar por proporção, tempo e desenho. |
| Depósito | Dá sentido ao inverno (estocar) e evita estruturas paradas por "saída cheia". | Capacidade alta demais elimina a tensão do inverno. |
| Berçário | Decisão de dieta = decisão de composição do exército (D09). | Trocar a dieta no meio desperdiça recursos? Regra: a larva atual termina com a dieta antiga. |
| Câmara nupcial | Torna a vitória um investimento físico que pode ser atacado. | Se for fácil de defender, as aladas viram detalhe. O chefe do verão mira nela. |
| Posto de guarda | Controle espacial da defesa sem micro (D19). | Um único posto na entrada certa pode bastar. As 2 direções de ataque (D10) evitam isso. |

### 4.4 Percalços do terreno (D96 a D98)

Os percalços existem para obrigar o jogador a montar **rotas diferentes**. Como cada túnel tem capacidade limitada (D52), um terreno que estreita ou bloqueia a passagem força a dividir o fluxo.

| Percalço | Regra (hipótese a calibrar) | Arco onde é ênfase (D97) |
|---|---|---|
| **Rocha** | Não pode ser escavada | Todos |
| **Argila dura** | Escavar custa 3 vezes mais pontos e tempo, e rende o dobro de argila (D41) | 2 (F6) |
| **Areia solta** | Túnel não passa do nível 2 sem reforço de barro por célula. Estrutura em areia precisa de reforço | 3 (F11) |
| **Água** | Na primavera, túneis e câmaras a até 2 células de um bolsão alagam e ficam fechados até o verão. As formigas lá dentro saem. Aviso no inverno. Dique de barro protege uma célula | 2 (F8) |
| **Toca de predador** | Formigas a até 4 células podem ser atacadas pela aranha da toca. A toca pode ser destruída em combate e rende presa | 1 (F4) e 3 |

- **Visibilidade (D98):**
  - até cerca de 3 células de qualquer túnel, nó ou câmara, o terreno aparece por completo;
  - mais longe, um percalço aparece só como "?";
  - fontes, plantas e ninhos rivais aparecem sempre.
- **Alagamento e rotas:** quando um túnel alaga, as rotas são recalculadas na hora. Se não houver outra rota, aparece o aviso "Sem rota" (§9).
- **Diagnóstico:** o painel do túnel mostra o percalço por onde ele passa (ex.: "areia: nível máximo 2").

## 5. Ciclo de vida e castas

### 5.1 Ciclo
```
Rainha (1 fungo) ─► OVO ─► vai para a vaga livre do berçário mais próximo
                     └─ sem vaga: a rainha para de pôr e mostra o ícone "sem berçário"
LARVA ─► recebe os recursos da dieta do berçário (entregues pelas carregadoras)
      ─► só cresce enquanto houver cuidadora na vaga e dieta completa
      ─► ao fim do tempo, nasce a casta da dieta
```
Ao trocar a dieta de um berçário, as larvas que já estão lá terminam com a dieta antiga e as novas entram com a nova.

### 5.2 Dietas e castas

**Movido para `07-arvore-de-criacao.md` §4**: 10 castas (3 econômicas, 6 de combate, 1 de reprodução), com dieta, tempo de larva, manutenção e comportamento base. A rainha consome 1,0 fungo/min.

### 5.3 Manutenção e fome (D24)
- Toda formiga consome fungo continuamente, debitado do depósito ou da saída do jardim mais próximo. Ninguém morre de velhice.
- **Fome** (fungo = 0):
  1. a rainha para de pôr ovos;
  2. as larvas param de crescer;
  3. a cada 10 s morre 1 adulta, nesta ordem: reserva → operárias → castas de combate → aladas;
  4. depois de 60 s seguidos de fome, a rainha morre: **derrota**.
- **Problema que resolve:** limita a população pelo fungo, e não por um número arbitrário. Faz das castas de combate um investimento com custo contínuo.
- **Risco de balanceamento:** a manutenção pode ser irrelevante (barata demais) ou travar o crescimento (cara demais).
- **Conta de referência:** na primavera, com 70 operárias, 15 combatentes, 6 aladas e a rainha, a manutenção é 70×0,2 + 15×0,6 + 6×0,5 + 1 = **27 fungo/min**. Dois jardins de nível 2 produziriam 44/min, mas 2 plantas na primavera dão 80 folhas/min, o que limita a produção a **40 fungo/min**. Sobram cerca de 13/min para crescer (cerca de 2,5 operárias/min). Para crescer mais rápido seria preciso uma 3ª planta, e portanto mais uma porta para defender. Isso fica dentro da faixa de 60 a 120 formigas no pico (D22).
- **Conta do inverno:** 3 min × cerca de 20/min = **60 fungo** de estoque mínimo. Um depósito de nível 1 (100) basta se o jogador começar a estocar no outono.

## 6. Combate

### 6.1 Regras gerais
- Todo combate é automático. Formigas de combate ficam nos **postos de guarda** (D19), divididas igualmente entre os postos com vaga, e atacam inimigos a até 2 células do posto.
- As regras especiais de cada casta (bloqueio do tanque, lentidão da atiradora, cura, explosão) e das estruturas de defesa e ataque estão em `07-arvore-de-criacao.md` §4.2 e §5.
- **A largura do túnel muda o combate (D53).** A *frente de combate* é quantas formigas de cada lado lutam corpo a corpo lado a lado numa célula: 1 no nível 1, 2 nos níveis 2 e 3, 3 no nível 4.
  - **Túnel estreito é gargalo:** poucos inimigos chegam ao mesmo tempo, e um defensor bom segura muitos. Serve contra enxame.
  - **Túnel largo deixa passar mais gente dos dois lados:** é melhor para a expedição sair e para muitos soldados lutarem juntos, e pior para segurar um enxame.
  - **Tanque:** cada tanque bloqueia **uma faixa** da frente. No nível 1, um tanque fecha o túnel; no nível 4 são precisos três (atualiza D29).
  - **Atiradoras e explosões não dependem da frente:** atiram por cima dos aliados, e a explosão atinge a célula inteira.
  - Isso cria um conflito de propósito: alargar uma rota de carga também alarga a porta para o inimigo.
- Inimigos mortos deixam **corpos (presa)** no local. Carregadoras os recolhem quando não há inimigo a até 2 células.
- **Alvo dos inimigos:**
  - formigas rivais vão para a câmara real;
  - aranhas atacam a primeira formiga que encontram (as carregadoras no cortadouro são as vítimas típicas);
  - o chefe do verão vai para a câmara nupcial.

### 6.2 Atributos das formigas do jogador

**Movido para `07-arvore-de-criacao.md` §4.2.** A rainha tem vida 80, é imóvel e não ataca; se morrer, é derrota.

### 6.3 Inimigos do MVP

Os traços de cada inimigo (enxame, blindado, rápido, chefe) e contra quais castas cada um é fraco estão em `07` §9 (D46).

| Inimigo | Vem de | Vida | Dano/s | Velocidade | Presa ao morrer | Comportamento |
|---|---|---|---|---|---|---|
| Formiga rival | lado | 12 | 2 | 1,0 | 1 | Segue para a câmara real |
| Soldado rival | lado | 40 | 5 | 0,7 | 3 | Segue para a câmara real |
| Aranha | cima (cortadouro) | 70 | 8 | 1,2 | 5 | Caça a formiga mais próxima |
| Lacraia (chefe do verão) | cima (cortadouro) | 300 | 12 | 0,6 | 20 | Vai para a câmara nupcial |

### 6.4 Direções de ataque (D10)
- **De cima:** inimigos caminham pela faixa de superfície e descem por um **cortadouro**. A linha do tempo mostra qual cortadouro cerca de 45 s antes. **Sem cortadouro, não há ataque de cima**, mas também não há folha.
- **Dos lados:** cada fase tem 1 ou 2 **bocas rivais** na borda lateral do mapa. Uma onda lateral sai da boca e **cava em linha reta** (0,5 cél/s) até a estrutura mais próxima do jogador. **O túnel cavado permanece.** Cada onda lateral deixa um novo acesso ao seu ninho, e esse acesso também serve para as suas expedições (D27).
- **De baixo:** pós-MVP.

### 6.5 Ondas por estação (fase de dificuldade média)

| Estação | Ondas | Composição típica |
|---|---|---|
| Outono | 3, uma a cada cerca de 60 s (a 1ª em 1:00) | 1ª: 2 formigas rivais; depois 3 a 4 formigas rivais (sem aranha no outono) |
| Inverno | 1 | 1 aranha |
| Primavera | 2 | 6 formigas rivais + 1 soldado rival |
| Verão | 3 | 8 rivais + 2 soldados; 1 aranha + rivais; **chefe (lacraia)** às 11:30 |

As ondas laterais têm tamanho multiplicado pela vida atual do ninho rival (um rival com 50% de vida manda ondas com metade do tamanho). Por isso a expedição tem efeito estratégico.

- **Problema que resolve:** dá ritmo previsível à fase (linha do tempo, D25) e cria picos que testam a economia.
- **Risco de balanceamento:** o outono precisa dar presa suficiente para os primeiros tanques **sem** matar quem ainda não tem defesa. A primeira onda deve ser vencível só com operárias no papel Guardar.

## 7. Ninho rival e expedição

### 7.1 Ninho rival (D17)
- Estrutura fixa fora da borda lateral, com **vida 400** (varia por fase).
- Fora do inverno, regenera 0,5 de vida/s. No inverno não regenera e tem metade dos guardiões.
- Guardiões: 8 formigas rivais + 2 soldados (inverno: 4 + 1). Renascem a cada nova estação.
- Destruído: acabam as ondas laterais naquele ano, e no ano seguinte outra colônia ocupa o território (D76). Nas fases de assalto, destruir o rival é a vitória (D71).

### 7.2 Expedição (D21)
1. Toque no ninho rival → escolha **quantas** castas de combate vão (um slider de 0 até o total disponível) → confirme.
2. Só é possível se houver **caminho** da sua rede até uma boca rival (por um túnel cavado por uma onda ou por um que você escavou).
3. As formigas saem dos postos (que ficam desfalcados), caminham, lutam contra os guardiões, causam dano ao ninho até ficarem abaixo de 30% da vida ou até o ninho cair, e voltam.
4. **Saque:** 1 presa por guardião morto + 1 presa a cada 20 de dano no ninho, trazidos pelas sobreviventes.
- **Problema que resolve:** dá ao jogador um verbo ofensivo com decisão de momento e risco, sem micro.
- **Risco de balanceamento:**
  - expedição no inverno forte demais: o rival é destruído sempre na primeira estação fria;
  - expedição inútil: o jogador ignora o sistema.
  - **Alvo:** uma expedição de inverno bem preparada deve tirar cerca de 40% da vida do ninho.

## 8. Vitória, derrota e fim da fase

| Resultado | Condição |
|---|---|
| **Vitória na última fase do arco** (D31, D73) | Às 12:00, ter pelo menos **X aladas vivas** na câmara nupcial (arcos 1, 2 e 3: X = 6, 8 e 15). |
| **Vitória nas fases intermediárias** (D73) | Às 12:00, rainha viva e objetivo do ano cumprido (ex.: "chegar a 30 operárias"; lista no `04` §2). |
| **Vitória nas fases de assalto** (D71) | Destruir o ninho rival antes das 12:00. Nas outras fases, destruir o rival dá saque e acaba com as ondas laterais, mas não vence. |
| **Derrota** | A rainha morre: inimigo na câmara real ou 60 s seguidos de fome. |
| **Fim sem vitória** | Às 12:00, objetivo não cumprido (ou menos de X aladas no fim do arco): a fase acaba como "colônia sobreviveu, mas não cumpriu o ano". O jogador repete a partir do checkpoint da fase (D72). |

**Estrelas (D70):** 1 por vencer; a 2ª e a 3ª por objetivos próprios de cada fase (`04` §2).

## 9. Como o jogador entende por que a colônia está falhando

Princípio: **todo problema tem um lugar na tela**. Nada fica escondido só em números.

| Sinal | Onde aparece | O que significa | Ação típica |
|---|---|---|---|
| Ícone "sem entrada" | Sobre a estrutura | Falta recurso de entrada | Mais Carregar, ou mais produção na origem |
| Ícone "saída cheia" | Sobre a estrutura | Ninguém busca a produção | Mais Carregar, ou um depósito |
| Ícone "sem trabalhadoras" | Sobre a estrutura | Vagas de Cuidar vazias | Subir Cuidar, ou pausar outra estrutura |
| Ícone "sem berçário" | Câmara real | A rainha não tem onde pôr ovos | Novo berçário, ou upgrade |
| Ícone "refugo" | Jardim | Lixo acumulado derrubando a produção | Lixeira mais perto, ou mais Carregar |
| Túnel engarrafado | Túnel vermelho, com pontos de fila na boca | Capacidade do sentido esgotada (D52) | Upgrade do túnel, mudar o sentido (circuito) ou abrir uma rota alternativa |
| Formigas paradas | Aviso "sem rota de volta" (ou de ida) | Nenhum túnel permite aquele sentido | Voltar um túnel para mão dupla ou abrir um túnel no outro sentido |
| Barra de fungo com saldo/min | Topo da tela | Positivo ou negativo e quanto | — |
| "Estoque dura X:XX de inverno" | Topo, só no outono | Previsão de sobrevivência | Estocar mais |
| Aviso de fome | Tela inteira com borda pulsando | Fungo zerado; contador de 60 s da rainha | Emergência |
| Linha do tempo (D25) | Topo | Estações e ondas previstas, direção 45 s antes | Planejar castas |
| **Relatório de fim de fase** | Tela final | 3 frases do que deu errado (ex.: "O fungo zerou às 4:10. Os 2 jardins ficaram 70% do tempo sem cuidadoras.") | Aprender para a próxima tentativa |

- **Problema que resolve:** o jogador sempre sabe **onde** olhar. A derrota é explicada, então parece justa.
- **Risco:** excesso de ícones numa colônia grande. **Mitigação (etapa c):** mostrar só o problema mais grave de cada estrutura e, quando houver vários, destacar o pior da colônia.

## 10. Valores iniciais de uma fase média

| Item | Valor |
|---|---|
| Começo | Câmara real + 1 jardim + 1 berçário (dieta operária) já construídos e conectados |
| Operárias iniciais | 12 (sugestão de sliders: 4 Carregar, 4 Escavar, 3 Cuidar, 1 Guardar) |
| Estoque inicial | 30 fungo, 10 folha |
| Fontes no mapa | 2 plantas; 2 bolsões (300 perto e 600 fundo); 1 boca rival |
| Vida do ninho rival | 400 |
| Aladas para vencer | 6 |
| Tamanho do mapa | 15 × 30 células (sem limite de câmaras) |
| Velocidades de jogo | pausa (dá para planejar obras pausado), 1× e 2× (a confirmar na etapa c) |

## 11. Riscos de balanceamento do sistema

1. **Jardim de fungo:** é o centro de tudo. Um erro de 20% nele muda a fase inteira. Calibrar primeiro, isolado.
2. **Começo lento:** com 12 operárias, a primeira obra pode demorar. Meta: o primeiro cortadouro funcionando antes de 0:30.
3. **Distribuição ótima fixa:** se os sliders tiverem uma resposta certa que não muda, o jogo vira planilha. As estações precisam mudar o gargalo. Medir no protótipo.
4. **Expedição de inverno dominante:** ver alvo em 7.2.
5. **Excesso de regras para o MVP:** a árvore do MVP (`07` §12) tem 14 recursos, 8 castas e cerca de 22 estruturas, bem mais que o Achikaps. A campanha (etapa d) precisa introduzir as regras uma de cada vez. O protótipo (etapa e) usará só uma fração disso.
