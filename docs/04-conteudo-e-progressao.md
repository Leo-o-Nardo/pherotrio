# 04 · Conteúdo e progressão

> Etapa (d). Escrito em 2026-11-25.
>
> **Aplica as decisões:** D51, D62 a D64, D66 a D76.
>
> Os números são **hipóteses a calibrar** no protótipo, salvo quando indicado.
>
> Nomes de fases e de biomas são de trabalho.

## 0. Resumo em uma tela

- **Campanha:** 3 arcos de 5 fases, 15 fases ao todo. Cada fase é 1 ano da colônia.
- **Dentro do arco:**
  - a **mesma colônia cresce** de ano em ano (D67);
  - o mapa grande se abre por regiões (D74);
  - um inverno de transição evita começar num estado perdido (D72).
- **Fim do arco:**
  - o **voo nupcial** encerra o arco (D73);
  - as aladas fundam um ninho novo, em outro bioma;
  - o jogador escolhe **1 entre 3 traços** da linhagem (D75).
- **Árvore:** fica inteira aberta até a fase 10 (D62).
  - **Arco 1:** ensina a base.
  - **Arco 2:** abre o resto da árvore.
  - **Arco 3:** é de domínio.
- **Tutorial:** embutido. A fase 1 não tem inimigos, cada novidade ganha um cartão, e as dicas só aparecem quando o jogador trava (D63).
- **Estrelas:** 1 por vencer, e mais 2 por objetivos próprios de cada fase (D70). Elas liberam fases de desafio opcionais (D64).
- **Dificuldade:** Tranquilo, Normal ou Difícil (D69).
- **Sandbox:** tudo configurável, com ondas sem fim e a colônia para sempre (D68).

## 1. Estrutura da campanha

```
ARCO 1 · Solo de floresta          ARCO 2 · Barranco de argila        ARCO 3 · Campo aberto
 F1 → F2 → F3 → F4 → F5 ✦voo  ──►   F6 → F7 → F8 → F9 → F10 ✦voo ──►  F11 → F12 → F13 → F14 → F15 ✦voo
 (mesma colônia, mapa abre          (ninho novo + 1 traço)             (ninho novo + 2 traços)
  1 região por ano)

Fases de desafio (opcionais, liberadas por estrelas): D1 … D8
Sandbox: tudo liberado, configurável
```

| Arco | Bioma | O que o bioma favorece | Rival inicial | Traços ativos | Duração da fase |
|---|---|---|---|---|---|
| 1 | Solo de floresta | Muitas plantas e raízes, pouca argila; percalços: rocha e toca de predador | Colônia vizinha (enxame) | 0 | 12 a 13 min |
| 2 | Barranco de argila | Muita argila, poucas plantas, bolsões fundos; percalços: argila dura e água | Colônia de soldados (blindado) | 1 | 15 a 17 min |
| 3 | Campo aberto | Poucos abrigos, dois vizinhos, rochas e seca; percalços: areia solta e tocas | Dois rivais, um de cada lado | 2 | 18 a 20 min |

- **Duração total estimada:** cerca de 15 fases × 15 min, ou seja, perto de 4 horas na linha principal, sem contar repetições e desafios.
- **Sessão no celular:** o jogo salva entre fases e também ao sair do app (`03` §7). Um arco pode ser jogado em várias sessões.

## 2. As 15 fases

### Como ler as tabelas

- **Novidades:**
  - **Cartão:** o que ganha cartão de novidade (D63);
  - **Grupo:** várias novidades na mesma fase formam uma ideia só (D51).
- **Região nova:** o que a fase abre no mapa do arco (D74).
- **Objetivo:** a condição de vitória (D73). "Sobreviver" quer dizer chegar às 12:00 com a rainha viva.
- **★2 e ★3:** os objetivos das estrelas extras (D70). As estrelas são independentes: dá para fazer a 3ª sem a 2ª.
- **Força das ondas:** 1,0 é a fase média do `02` §6.5. Quantidade e vida dos inimigos são multiplicadas por esse número. Ver §4.

### 2.1 Arco 1 · Solo de floresta: "Fundação"

Começa com: rainha, 8 operárias, câmara real e um cortadouro aberto.

| Fase | Ideia | Novidades | Região nova | Ameaças | Objetivo | ★2 | ★3 | Força |
|---|---|---|---|---|---|---|---|---|
| **F1 · Primeira câmara** | Comer e crescer | Túnel em segmentos e nós; cortadouro; folha → jardim → fungo; berçário; operária; papéis Carregar, Escavar e Cuidar; depósito; lixeira e refugo; estações (inverno sem folha) | Centro e superfície | Nenhuma | Chegar a 20 operárias | Entrar no inverno com 30 fungos ou mais no estoque | Nenhum túnel vermelho por mais de 30 s | 0 |
| **F2 · Vizinhos** | Defender a casa | Formigas rivais pelo lado; túnel do rival (D27); posto de guarda; papel Guardar; a Reserva defende a rainha; ondas na linha do ano; frente de combate (D53) | Leste (território do rival) | Enxame | Sobreviver com 30 operárias | A rainha nunca abaixo de 50% da vida | Perder no máximo 5 operárias | 1,0 |
| **F3 · Doce da terra** | Uma segunda cadeia | Seiva; bolsão de raízes; coletor de seiva; destilaria; néctar; upgrade de estrutura (jardim nv2 pede néctar, D47); sentido dos túneis (D52) | Oeste profundo (bolsão) | Enxame maior | Sobreviver e ter o jardim no nv2 | Produzir 80 néctares | Montar um circuito (um túnel só de ida e um só de volta) | 1,3 |
| **F4 · Caçadas** | Inimigo vira comida | Presa dos corpos; câmara de presas; proteína e quitina; cozinha; pasta; soldado; cortadeira; aranha pelo cortadouro; **percalço: toca de aranha** | Segunda planta e segundo cortadouro | Enxame + aranha | Sobreviver com 6 soldados vivos | Criar 4 cortadeiras | Nenhuma câmara danificada no ano | 1,7 |
| **F5 · O primeiro voo** | Reproduzir | Câmara de geleia; geleia real; alada; câmara nupcial; lacraia (chefe do verão); voo nupcial; escolha de traço | Fundo (lugar protegido para a câmara nupcial) | Enxame + aranha + lacraia | **Voo: 6 aladas vivas às 12:00** | 9 aladas | A lacraia morre antes de chegar à câmara nupcial | 2,2 |

**Aranha na F4:** as respostas ideais contra a aranha (armadilha de cola, barricada, tanque; `07` §9) só chegam no arco 2. Na F4 ela precisa ser vencível com soldados em número, e por isso vem uma por onda.

**Traços de inimigo:** a regra "pelo menos dois traços por fase" (D46) vale a partir da F4. As fases F1 a F3 são de ensino.

**Expedição (D21):** aparece no arco 1 como opção a partir da F2, sem cartão obrigatório. O cartão de novidade da expedição entra na F4, junto com a presa, porque o saque da expedição traz presa.

### 2.2 Arco 2 · Barranco de argila: "Expansão"

Começa com: rainha, 6 operárias, câmara real, **1 traço** e mais operárias conforme as aladas do voo anterior (1 a cada 2 aladas acima da meta; hipótese).

| Fase | Ideia | Novidades | Região nova | Ameaças | Objetivo | ★2 | ★3 | Força |
|---|---|---|---|---|---|---|---|---|
| **F6 · Ninho novo** | A terra como material | Argila; poço de argila; olaria; barro; barricada; cavadora; túnel nv2; **percalço: argila dura** | Centro, superfície e veios de argila | Enxame leve | Chegar a 30 operárias | 2 barricadas antes do inverno | 40 operárias | 1,2 |
| **F7 · Blindados** | Atravessar e atrasar | Ácido; câmara ácida; atiradora; cola; câmara de cola; armadilha de cola; túnel nv3 | Leste (rival blindado) | Soldados rivais + enxame | Sobreviver | Ter 6 atiradoras ao mesmo tempo | Armadilhas de cola desaceleram 20 inimigos | 1,8 |
| **F8 · Segurar a porta** | Bloquear | Carapaça; câmara de carapaça; tanque; torre ácida; túnel nv4; upgrade do posto de guarda; **percalço: água que alaga na primavera** (dique de barro) | Superfície leste (mais cortadouros, mais portas) | Aranhas em bando + blindados | Nenhum inimigo chega à câmara real | Nenhum inimigo passa do primeiro posto | Usar um túnel nv4 | 2,4 |
| **F9 · Contra-ataque** (**fase de assalto**, D71) | Atacar | Curandeira; galeria de assalto; feromônio; câmara de feromônio; saqueadora; posto de guerra | Túnel até o ninho rival | Blindados + defesas do rival | **Destruir o ninho rival** | Destruir com no máximo 2 expedições | Nenhuma curandeira morta | 2,0 |
| **F10 · Química e voo** | Sacrifício em área | Gosma; câmara tóxica; explosiva; mina de gosma | Fundo (bolsão rico) | Nova colônia vizinha (D76) com enxame grande + lacraia | **Voo: 8 aladas** | 12 aladas | Uma explosão atinge 5 inimigos | 3,0 |

**Fim da F10:** a árvore inteira está aberta (D62).

**Atenção:** as fases 7 e 9 trazem 6 ou mais novidades. Elas estão agrupadas por ideia (atravessar e atrasar, atacar), mas são as fases mais densas da campanha. Se o protótipo mostrar sobrecarga, a cola e a armadilha de cola vão da F7 para a F6, porque néctar e barro já estão disponíveis ali.

**Ordem das receitas conferida com o `07`:** cada novidade só usa recursos já liberados. Por exemplo, a torre ácida pede carapaça e por isso fica na F8; a curandeira e a galeria pedem cola, liberada na F7.

**Dependência:** se o N3 ficar fora do MVP (D49), a F9 perde feromônio, saqueadora e posto de guerra, e a F10 perde todas as novidades. Ver Q28, a decidir na etapa (e).

### 2.3 Arco 3 · Campo aberto: "Domínio"

Começa com: rainha, 6 operárias, câmara real, **2 traços** e o bônus de aladas do arco anterior. A árvore inteira está liberada desde a F11.

| Fase | Ideia | Regra especial (D66) | Região nova | Ameaças | Objetivo | ★2 | ★3 | Força |
|---|---|---|---|---|---|---|---|---|
| **F11 · Dois vizinhos** | Defender dois lados | **Percalço: areia solta** (reforço de barro) | Centro, superfície e os dois lados | 2 rivais (enxame e blindado) | Chegar a 50 operárias | Uma expedição bem-sucedida | Nenhum túnel vermelho no verão | 2,2 |
| **F12 · Ano seco** | Economia apertada | Primavera curta, plantas com −40% de folha | Bolsões fundos e ricos | 2 rivais | Sobreviver sem o fungo zerar | Manter 50 néctares no fim do inverno | Nenhuma operária morta de fome | 2,6 |
| **F13 · Assalto duplo** (**fase de assalto**) | Guerra em duas frentes | Os rivais se ajudam (um ataca quando o outro é atacado) | Túneis até os dois ninhos | 2 rivais fortes | **Destruir os dois ninhos** | Destruir os dois no mesmo ano, antes do verão | Usar o posto de guerra em todas as expedições | 2,8 |
| **F14 · Pedra e túnel** | Rotas estreitas | Muita rocha, passagens de 1 célula | Labirinto de rocha | Novos vizinhos (D76) + aranhas e lacraia | Sobreviver | Nenhum túnel do arco acima do nv2 | Perder no máximo 10 formigas de combate | 3,4 |
| **F15 · O grande voo** | Tudo junto | Verão com 2 lacraias | Fundo e todo o mapa | 2 rivais + aranhas + 2 lacraias | **Voo: 15 aladas** | 20 aladas | A rainha nunca abaixo de 75% da vida | 4,0 |

## 3. Como o arco funciona por dentro

### 3.1 Transição entre anos (D72)

No fim de cada ano, menos no último do arco, aparece a tela "Inverno de transição", antes da fase seguinte. Ela mostra:
- o que foi conquistado: estrelas, aladas que voaram e operárias;
- o que muda: região nova, novidades e ameaças previstas.

| O que acontece | Regra |
|---|---|
| Túneis, câmaras, upgrades e defesas | Continuam como estavam |
| Estruturas danificadas | Reparadas |
| Rainha | Recupera a vida toda |
| População | Fica entre o **piso** e o **teto** da fase: piso = 60% da meta da fase anterior; teto = 130% dessa meta |
| Estoques | Cada recurso fica entre o piso (2 min de consumo da colônia) e o teto (capacidade dos depósitos) |
| Castas de combate | Continuam, limitadas a 40% da população |
| Rival | Cresce: vida do ninho +20% e ondas mais fortes (§4) |
| Rival destruído | Outra colônia ocupa o território (D76) |
| Checkpoint | Salvo aqui. "Tentar de novo" volta a este ponto |

- **Por que piso e teto:**
  - o piso impede começar a fase num estado perdido (bola de neve negativa);
  - o teto impede que um ano ótimo deixe o próximo trivial (bola de neve positiva).
- **Recomeçar o arco:** fica disponível no menu da campanha, para quem quiser refazer desde o começo.

### 3.2 Mapa do arco (D74)

- **Tamanho:** cerca de **80 × 80 células** (D94). O tamanho exato vem do protótipo.
- **Regiões:**
  - são cerca de 5, desenhadas à mão, uma liberada por fase, **do centro para os lados** (D95): centro superior, um lado, o outro lado, centro fundo e lados fundos;
  - as regiões fechadas aparecem escurecidas, com os ícones das fontes e dos rivais. Os percalços só aparecem perto da colônia; mais longe, viram "?" (D98);
- **Percalços (D96, D97):** rocha em todos os arcos; cada arco enfatiza outros (tabela do §1). Eles obrigam a dividir o fluxo em rotas diferentes;
  - não é possível escavar nelas antes da hora.
- **Liberdade:** dentro do que está aberto, o jogador escolhe onde e como crescer. As regiões são grandes, com várias fontes e vários caminhos possíveis.
- **Zoom:** afastando ao máximo, o mapa inteiro cabe na tela, numa visão geral (D92). Problemas fora da vista aparecem como setas na borda da tela (D93).

### 3.3 Voo nupcial e novo ninho (D73, D75)

1. Às 12:00 da última fase do arco, as aladas vivas voam. É preciso ter pelo menos X: 6, 8 e 15 nos arcos 1, 2 e 3.
2. **Pontos de linhagem** = aladas do voo final + aladas que voaram nos anos intermediários do arco.
3. O jogador escolhe 1 entre 3 traços (§5). Os pontos definem a qualidade das opções:

| Pontos de linhagem (arco 1 / 2) | Opções |
|---|---|
| Até X + 3 | 3 comuns |
| X + 4 a X + 9 | 2 comuns + 1 raro |
| X + 10 ou mais | 1 comum + 2 raros |

4. O arco seguinte começa no novo bioma, com os traços escolhidos.
5. **Colônia salva:** a colônia final do arco fica disponível no sandbox, para continuar para sempre (D68).

## 4. Curva de dificuldade

A curva da campanha é em **dente de serra**: sobe dentro do arco e cai no início do arco seguinte, quando o ninho é novo e pequeno. Cada queda fica acima da anterior.

```
Força
das ondas
 4,0 |                                                         ●  F15
 3,5 |                                                    ●
 3,0 |                               ●  F10                         
 2,5 |                       ●                     ●   ●
 2,0 |               ●            ●            ●
 1,5 |         ●            ●
 1,0 |    ●            ●
 0,5 |
 0,0 | ●
     +--F1-F2-F3-F4-F5----F6-F7-F8-F9-F10----F11-F12-F13-F14-F15--
         arco 1               arco 2               arco 3
```

- **Por que cai no começo do arco:**
  - o jogador recomeça pequeno e precisa reaprender o ritmo num bioma novo;
  - o traço ganho e o domínio do jogador compensam parte da subida.
- **Dentro da fase:** as ondas seguem as estações do `02` §6.5, com a força da fase multiplicando quantidade e vida.

| Nível (D69) | Vida dos inimigos | Quantidade | Aviso antes da onda | Liberação |
|---|---|---|---|---|
| Tranquilo | × 0,7 | × 0,75 | +50% | Desde o início |
| Normal | × 1,0 | × 1,0 | normal | Desde o início |
| Difícil | × 1,3 | × 1,3 | −30% | Em aberto (proposta: depois da campanha) |

- **A economia não muda entre níveis.** O jogo ensina o mesmo sistema em qualquer dificuldade.
- **Trocar de nível:** é possível ao repetir uma fase. As estrelas registram em qual nível foram ganhas.

## 5. Traços da linhagem (D75)

São 12 traços, todos hipóteses a calibrar. Os comuns são **trocas**; os raros são vantagens puras, mas moderadas.

| Traço | Tipo | Efeito | Custo |
|---|---|---|---|
| Pernas longas | Comum | Operárias 15% mais rápidas | Manutenção +10% |
| Mandíbulas largas | Comum | Escavação +25% | Carregar 10% mais lento |
| Jardineiras | Comum | Jardim de fungo 20% mais rápido | Refugo +30% |
| Doceiras | Comum | Destilaria e coletor de seiva +25% | Plantas −10% de folha |
| Rainha fértil | Comum | 1 ovo a cada 12 s, em vez de 15 | Rainha com −25% de vida |
| Couraça | Comum | Castas de combate com +20% de vida | Larvas de combate levam +15% de tempo |
| Sentinelas | Comum | Operárias em Guardar causam 2× dano | Operárias comem +10% |
| Celeiro | Comum | Depósitos com +50% de capacidade | Câmaras custam +10% de escavação |
| Herança | Raro | Começa o arco com 12 operárias a mais | — |
| Ácido concentrado | Raro | Ácido causa +30% de dano; a torre ácida gasta metade | — |
| Trilha de feromônio | Raro | Túneis nv1 com a capacidade do nv2 (3 por célula) | — |
| Memória do ninho | Raro | Começa o arco com um jardim nv2 já construído | — |

- **Regra de balanceamento:** cada fase do arco 2 é testada com o pior e o melhor traço; cada fase do arco 3, com as piores e as melhores combinações de 2. Nenhuma fase pode exigir um traço específico.
- **Traços repetidos:** não é possível escolher o mesmo traço duas vezes. A segunda escolha nunca oferece o traço já escolhido.

## 6. Tutorial embutido (D63)

### 6.1 Fase 1 sem inimigos

- Os objetivos curtos aparecem um por vez na linha do ano:
  1. "Cave até a câmara real";
  2. "Leve 10 folhas ao jardim";
  3. "Crie a primeira operária";
  4. "Chegue a 20 operárias".
- Nada é obrigatório no sentido de travar a tela. O jogador pode ignorar a ordem.

### 6.2 Cartões de novidade

- Aparecem quando uma novidade fica disponível pela primeira vez. Mostram: forma, função em uma frase, receita, e a espécie que inspirou, se houver (D16).
- O jogo pausa enquanto o cartão está aberto (opção nas configurações).
- Todos os cartões vistos ficam consultáveis na árvore (`03` §6.9).

### 6.3 Dicas quando o jogador trava

| Gatilho | Dica (texto de trabalho) |
|---|---|
| Estrutura parada por falta de ingrediente por mais de 20 s | "O jardim está sem folha. Ponha mais operárias em Carregar ou abra outro cortadouro." |
| Fila com mais de 5 formigas por mais de 15 s | "Túnel congestionado. Faça um upgrade, mude o sentido ou abra outro caminho." |
| Pedidos sem carregadora por mais de 20 s | "Há coisas para levar e ninguém em Carregar." |
| Saldo de fungo negativo por mais de 30 s | "A colônia come mais do que produz. Mais jardins ou menos castas caras." |
| Onda a 20 s e ninguém em Guardar nem em postos | "Uma onda está chegando pela direita e a entrada está sem guardas." |
| Formigas paradas sem rota | "Não há caminho de volta. Ponha um túnel em mão dupla." |
| Upgrade tocado sem o recurso | "Falta cola. A câmara de cola transforma néctar e barro em cola." |

- **Regras:**
  - no máximo 1 dica a cada 60 s;
  - cada dica aparece no máximo 3 vezes na campanha;
  - as dicas podem ser desligadas;
  - tocar numa dica leva a câmera até o problema.

## 7. Fases de desafio (D64)

- São fases avulsas, fora dos arcos. Começam de um ponto fixo, sem traços.
- Uma nova é liberada a cada **6 estrelas** da campanha.
- A campanha tem 45 estrelas, então todos os 8 desafios ficam disponíveis antes do fim, e o último pede 48 estrelas, o que inclui estrelas de outros desafios.

| # | Desafio | Regra | Objetivo |
|---|---|---|---|
| D1 | Sem doce | Nenhum bolsão de raízes | Voo com 6 aladas |
| D2 | Cerco | Ataques pelos dois lados desde o outono | Sobreviver |
| D3 | Só operárias | Nenhuma casta de combate | Sobreviver |
| D4 | Assalto relâmpago | O rival começa fraco, mas cresce rápido | Destruir o rival até o fim do inverno |
| D5 | Inverno eterno | Inverno de 6 min, e as outras estações encurtam | Voo com 6 aladas |
| D6 | Labirinto | Rocha em 60% do mapa | Sobreviver |
| D7 | Sem tanques | Não há tanques nem barricadas | Sobreviver a ondas de força 3,0 |
| D8 | Colônia gigante | Começa com 100 operárias e ondas enormes | Voo com 20 aladas |

## 8. Sandbox (D68)

| Opção | Valores |
|---|---|
| Mapa | Tamanho (pequeno, médio, grande), bioma, quantidade de plantas, bolsões, argila e rocha |
| Estações | Duração de cada uma; ano infinito ligado ou desligado |
| Inimigos | Desligados, fixos ou **ondas crescentes** (a força sobe a cada ano, sem fim) |
| Traços dos inimigos | Escolher quais aparecem |
| Rivais | 0, 1 ou 2 |
| Derrota | Ligada ou "sem derrota" |
| Começo | Colônia nova ou **colônia salva** de um arco da campanha |

- **Ondas crescentes:** guardam o recorde de anos sobrevividos.
- **Colônia para sempre:** com "ano infinito", a colônia continua de ano em ano, sem voo obrigatório.

## 9. Como o jogo evita a "colônia de sempre" (D66)

1. **Três biomas** com economias diferentes: folha, argila e seca.
2. **Mapas com regiões** que mudam onde estão as fontes e as ameaças a cada ano.
3. **Ameaças com traços** (`07` §9) que pedem respostas diferentes.
4. **Regras especiais** em parte das fases (arco 3) e nos desafios.
5. **Estrelas com objetivos próprios** que pedem estilos diferentes (ex.: "vença sem passar do nv2").
6. **Traços da linhagem** que mudam o jeito de jogar o arco seguinte.

## 10. Monetização na campanha (D82)

- O **arco 1 inteiro (F1 a F5) é grátis**, sem anúncios.
  - Ele termina com o primeiro voo nupcial e a escolha de traço, que é o melhor gancho para continuar.
- Os **arcos 2 e 3** podem ser liberados de duas formas:
  - **compra única**, que libera tudo, incluindo desafios e sandbox;
  - **2 anúncios premiados por fase**, e a fase fica liberada para sempre.
- **Sortear de novo os traços:** 1 anúncio opcional por voo; grátis para quem comprou.
- **Nunca** energia, anúncio que interrompe, moedas ou pay-to-win.
- O preço final continua em aberto (Q10). Proposta: por volta de R$ 9,90 no Brasil.

## 11. Riscos

| Risco | Efeito | Mitigação |
|---|---|---|
| Fases 7 e 9 com muitas novidades | Sobrecarga | Agrupamento por ideia; mover a cola para a F6 se o teste pedir |
| Piso e teto mal calibrados | Bola de neve volta, ou o jogador sente que "o jogo tirou" o que ele ganhou | Mostrar com clareza na tela de transição o que foi ajustado e por quê; calibrar no protótipo |
| Mapa grande demais no celular | Jogador se perde | Regiões liberadas aos poucos; visão geral (D92) e setas na borda (D93) |
| Traços desequilibrados | Uma escolha domina | Testes com pior e melhor traço por fase (§5) |
| Arco longo (cerca de 1 h 15 min) | Cansaço | Salvar entre fases; cada fase é uma sessão completa |
| N3 fora do MVP | Arco 2 incompleto | Q28 na etapa (e) |
| Fase de assalto difícil para quem só defende | Jogador trava na F9 | Tranquilo reduz a vida do ninho rival; dicas de expedição |

## 12. Questões em aberto desta etapa

- ~~**Q27:** visão geral ou minimapa?~~ Resolvida por D92 e D93.
- **Q28:** o que fazer com o arco 2 se o N3 ficar fora do MVP. Vai para a etapa (e).
- **D69:** quando o Difícil é liberado.
- **Q10:** preço. A proposta de arco 1 grátis está na §10.
