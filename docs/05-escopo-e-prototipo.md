# 05 · Escopo e protótipo

> Etapa (e). Escrito em 2026-11-25.
>
> **Aplica as decisões:** D50, D77 a D86.
>
> Prazos, desempenho e receita são **hipóteses a calibrar**. Eles servem para planejar e para perceber quando algo saiu do trilho, e não para cortar conteúdo (D50).

## 0. Resumo em uma tela

- **Lançamento (D77):** conteúdo completo no Android.
  - 3 arcos e 15 fases;
  - 17 recursos, 10 castas e 26 estruturas;
  - 8 desafios e o sandbox;
  - PT-BR e EN;
  - monetização híbrida (D82).
- **Depois do lançamento:**
  - versão para PC na **Steam** (D83);
  - **chinês simplificado** pela Steam (D84);
  - a China pelo celular fica fora por enquanto.
- **Caminho:**
  - **Protótipo 1:** a logística é divertida?
  - **Protótipo 2:** a árvore e o combate geram escolhas?
  - **Protótipo 3:** o arco 1 ensina e prende?
  - Depois vêm a produção, o teste fechado e o lançamento.
- **Esforço estimado:** de **46 a 72 semanas de trabalho focado**, já com a margem (§3). Em calendário, depende de quantas horas por semana o usuário tiver.
- **Primeira tarefa de código:** o portão de desempenho (D81, D85).
- **Itens novos que apareceram nesta etapa:**
  - **som e música** (Q31), que nenhum documento cobria;
  - **layout em paisagem** para a Steam (D83), que precisa ser previsto desde já.

## 1. Escopo

### 1.1 Entra no lançamento

| Área | O que entra | Onde está definido |
|---|---|---|
| Campanha | 3 arcos de 5 fases, inverno de transição, voo nupcial, 12 traços, fases de assalto | `04` §1 a §5 |
| Conteúdo | 17 recursos, 10 castas, 26 estruturas, 4 inimigos com traços, rival substituível, 5 percalços do terreno | `07`, `02` §4.4, §6 e §7 |
| Sistemas | Túneis com fila, sentido e 4 níveis; pedidos de transporte; papéis; fome; estações; ondas; expedição | `02` |
| Modos | 8 desafios, sandbox configurável, 3 dificuldades, estrelas | `04` §4, §7 e §8 |
| Interface | As 10 telas do `03`, gestos, indicadores de trânsito, tutorial embutido | `03` §6 a §9, `04` §6 |
| Arte | Direção de arte do mundo (etapa c2), paleta D54, 3 níveis de detalhe | `03`, `08` (a escrever) |
| Som | Efeitos e música (escopo a definir em Q31) | — |
| Acessibilidade | Itens da D59 | `03` §11 |
| Idiomas | PT-BR e EN, com os textos fora do código | D06, `03` §12 |
| Plataforma | Android, retrato, offline, save local com checkpoint | D07, D72, D81 |
| Monetização | Compra única + anúncios premiados opcionais + consentimento LGPD/GDPR | D82 |
| Loja | Ficha, ícone, capturas, vídeo curto, política de privacidade, formulário de Segurança dos Dados | §8 |

### 1.2 Depois do lançamento (planejado)

| Item | Quando | Preparar desde já? |
|---|---|---|
| **Steam (PC)**: paisagem, mouse e teclado, conquistas, save na nuvem | Depois que o Android estiver estável | **Sim** (§9.1) |
| **Chinês simplificado** pela Steam | Junto com a Steam ou logo depois | **Sim**: fonte CJK, textos externos, sem texto dentro de imagem |
| Novos arcos ou biomas | Atualização de conteúdo | A estrutura de dados já permite |
| iOS | Só se o Android e a Steam derem retorno (exige Mac e US$ 99 por ano) | Não, mas o Capacitor já suporta |

### 1.3 Fora

- Multiplayer e PvP online.
- Energia, moedas, loot box, pay-to-win (D82).
- Anúncio que interrompe o jogo (D82).
- China pelo celular (D84).
- Servidor próprio: o jogo é offline. A única exceção futura seria o save na nuvem da Steam, que é da própria Steam.

## 2. Arquitetura em uma página

```
┌─────────────────────────────────────────────────────────────┐
│  dados/   planilha → JSON (receitas, castas, fases, textos) │
├─────────────────────────────────────────────────────────────┤
│  sim/     TypeScript puro, sem navegador                    │
│           • tick fixo (proposta: 20 por segundo)            │
│           • determinística com semente → replays e bots     │
│           • roda sem tela, em velocidade alta, nos testes   │
├───────────────────────────┬─────────────────────────────────┤
│  render/  PixiJS (mundo)  │  ui/  HTML + CSS (HUD, painéis) │
│  interpola entre ticks    │  layout responsivo (retrato     │
│  3 níveis de detalhe      │  agora, paisagem na Steam)      │
├───────────────────────────┴─────────────────────────────────┤
│  entrada/  toque hoje; mouse e teclado depois (mesmas ações)│
├─────────────────────────────────────────────────────────────┤
│  plataforma/  save · compras · anúncios · conquistas        │
│     Android: Capacitor      PC: Electron ou Tauri (Q29)     │
└─────────────────────────────────────────────────────────────┘
```

**Por que assim:**
- **Simulação separada (D81):**
  - Claude consegue testar e balancear rodando milhares de anos de colônia sem abrir a tela;
  - trocar de engine ou de plataforma não mexe nas regras.
- **Determinística:**
  - a mesma semente e as mesmas ações dão o mesmo resultado;
  - isso permite reproduzir um bug a partir de um arquivo e comparar versões de balanceamento.
- **Camada de plataforma:**
  - compras, anúncios e conquistas passam por uma interface única;
  - a Steam vira um "adaptador novo", e não uma reescrita.
- **Entrada por ações:**
  - o toque e o mouse geram as mesmas ações ("cavar segmento", "mudar sentido");
  - a lógica não sabe de onde veio o comando.

## 3. Estimativa de esforço

- A unidade é **semana de trabalho focado** (cerca de 40 horas de Claude e usuário juntos).
- As faixas são largas de propósito. Elas são revistas no fim de cada protótipo.

| Bloco | Semanas | Observação |
|---|---|---|
| **Protótipo 1** | | |
| Base do projeto: Vite, PixiJS, Capacitor, gerar APK, laço da simulação | 1 a 2 | |
| Portão de desempenho (D85) | 0,5 a 1,5 | Inclui até 1 semana de otimização |
| Núcleo: mapa, escavação, túneis com fila, sentido e níveis, pedidos, papéis, rainha, fome, enxame | 3 a 5 | O bloco mais difícil de acertar |
| Métricas e ferramentas de teste (D86) | 0,5 a 1 | |
| **Protótipo 2** | | |
| Árvore completa: 17 recursos, processadoras genéricas, planilha → JSON | 2 a 3 | |
| Castas e combate: 5 lógicas, 3 efeitos, 4 inimigos, ondas, estações | 3 a 5 | |
| Rival, expedição e assalto | 2 a 3 | |
| Percalços do terreno, névoa perto da colônia e alagamento na primavera (D96 a D98) | 2 a 3 | |
| **Protótipo 3** | | |
| Estrutura da campanha: arcos, transição, regiões, voo, traços, estrelas, objetivos, save | 3 a 4 | |
| Arco 1 jogável com tutorial | 2 a 3 | |
| **Produção** | | |
| Fases 6 a 15 e os 8 desafios (montagem e balanceamento) | 5 a 8 | |
| Sandbox | 1 a 2 | |
| Interface completa, acessibilidade, idiomas | 3 a 5 | Parte acontece durante os protótipos |
| Arte do mundo aplicada (depois da etapa c2) | 3 a 5 | |
| Som e música (Q31) | 2 a 4 | Menos se a música for licenciada ou encomendada |
| Monetização: compras, AdMob, consentimento | 1 a 2 | D82 |
| Ficha da loja e materiais | 1 | |
| Teste fechado (14 dias) e correções | 3 a 4 | §7.3 |
| **Subtotal** | **38 a 60** | |
| **Margem de 20%** | **8 a 12** | Imprevistos e retrabalho |
| **Total** | **46 a 72** | |

**Leitura:**
- Com cerca de 20 horas por semana, isso dá algo entre **1,8 e 2,8 anos de calendário**.
- É bastante, e é coerente com "qualidade acima de prazo" (D50).
- Se um dia o prazo apertar, a alternativa guardada na D77 continua valendo: o arco 3 vira uma atualização.

## 4. Riscos técnicos

| Risco | Efeito | Mitigação | Quando se sabe |
|---|---|---|---|
| Navegador interno do Android lento em celular fraco | Quedas de quadros, aquecimento, bateria | Portão de desempenho primeiro (D85); simulação num Web Worker se preciso | Semana 1 a 2 |
| Rotas e filas com 300 formigas | Simulação pesada, travadas | Rotas calculadas por segmento e guardadas; recálculo só quando a rede muda | Protótipo 1 |
| Coleta de lixo do JavaScript causando engasgos | Travadas curtas e periódicas | Reaproveitar objetos (pools) e evitar criar objetos por tick | Protótipo 1 |
| Save corrompido ou incompatível entre versões | Jogador perde a campanha | Save com versão e migração; cópia do último checkpoint | Protótipo 3 |
| Plugins de anúncio e compra mantidos pela comunidade | Quebrar numa atualização do Capacitor | Isolar na camada de plataforma; fixar versões; testar antes de atualizar | Produção |
| Determinismo quebrado por números decimais | Replays e testes deixam de bater | Simulação em inteiros ou com arredondamento controlado | Protótipo 1 |
| Layout em retrato rígido demais | Porta para a Steam vira reescrita | Interface responsiva desde o início (§9.1) | Protótipo 3 |
| Fonte sem caracteres chineses | Chinês exige trocar a fonte | Prever fonte de reserva com chinês simplificado | Antes da Steam |

## 5. Protótipo 1: o núcleo de logística (D78, D85, D86)

### 5.1 A pergunta

> Montar e manter a rede de túneis e a cadeia **folha → fungo → operária** é divertido por 15 minutos, mesmo sem a árvore completa?

Se a resposta for não, nada mais salva o jogo. Por isso ele vem antes de tudo.

### 5.2 Escopo

| Entra | Fica fora |
|---|---|
| 1 mapa pequeno (cerca de 15 × 40 células) com superfície | Campanha, arcos, regiões |
| Rainha, ovos, larvas, operárias, fome (D24) | Outras castas |
| Folha → cortadeira de folhas → fungo | Os outros 16 recursos |
| Papéis Carregar, Escavar, Cuidar e Guardar com os controles + e − (D35) | Árvore, painel de consulta |
| Túneis em segmentos de até 3 células, fila, sentido, 4 níveis, indicadores (D52, D53) | Rival, expedição |
| 1 ameaça: enxame de formigas rivais em ondas | Outros inimigos, estações completas |
| Velocidades 1×, 2× e 4× e pausa | Menus, save, idiomas |
| Formas simples na paleta D54 | Arte final (etapa c2), som |
| Painel de métricas e de depuração (D86) | Monetização |

### 5.3 Ordem de trabalho

1. **Portão de desempenho:** cena de estresse, medida no Redmi Note 14 e no celular de entrada (§5.4).
2. **Simulação sem tela** com testes automáticos: túneis, filas, pedidos, fome.
3. **Desenho e toque:** câmera, zoom, 3 níveis de detalhe, modo de construção (D57).
4. **Jogo:** ondas, condição de derrota, 15 minutos de partida.
5. **Métricas** (D86).
6. **Sessões de teste:** o usuário joga no celular, e Claude joga no navegador e roda bots sem tela.
7. **Revisão:** decisão de seguir, ajustar ou repensar (§5.6).

### 5.4 Portão de desempenho (D81, D85)

- **Cena de estresse:**
  - 300 formigas;
  - cerca de 60 segmentos de túnel, com filas formadas;
  - zoom no mínimo, que é o pior caso de desenho;
  - 20 minutos seguidos.
- **O que medir:**
  - quadros por segundo, a média e o 1% mais lento;
  - tempo de um tick da simulação;
  - memória;
  - temperatura e queda de desempenho depois de 20 minutos.

| Celular | Critério |
|---|---|
| Redmi Note 14 | Média de 60 fps; 1% mais lento ≥ 45 fps |
| Celular de entrada (D80; modelo a escolher, Q32) | Média ≥ 30 fps; tick da simulação ≤ 8 ms |

- **Se falhar:**
  - primeiro, até 1 semana de otimização: desenho em lote, menos detalhe no zoom mínimo, simulação num Web Worker;
  - se ainda falhar, troca para Godot 4 (D81), aproveitando a simulação e os dados.

### 5.5 Critérios de sucesso

Os critérios são de **comportamento**, para não depender só de "achei legal". O usuário julga a diversão, e Claude traz os números.

| # | Critério | Como medir |
|---|---|---|
| 1 | O usuário quer jogar outra partida sem ser pedido, em pelo menos 3 de 5 sessões | Anotação após cada sessão |
| 2 | Há decisões frequentes: em média, uma ação relevante a cada 30 a 60 s, e nenhum trecho de mais de 2 min sem decisão (fora de espera escolhida, em 4×) | Registro de ações (D86) |
| 3 | O congestionamento é interessante, não caótico: as formigas passam de 5% a 25% do tempo em fila, e o jogador resolve com as ferramentas (nível, sentido, rota nova) | Métrica de fila |
| 4 | A tela explica a falha: olhando por 10 s, dá para dizer por que a colônia está mal (fome, fila, falta de folha) | Teste com 2 ou 3 pessoas de fora, se possível (D79) |
| 5 | O jogo roda 15 minutos sem travar nem corromper estado | Bots sem tela + sessões no celular |

### 5.6 Leitura do resultado

| Resultado | O que significa | Próximo passo |
|---|---|---|
| Critérios 1 a 5 ok | O núcleo funciona | Protótipo 2 |
| 2 ou 3 falham | O núcleo tem potencial, mas os números ou as ferramentas estão errados | Ajustar e testar de novo (até 2 rodadas) |
| 1 falha mesmo depois de ajustes | O núcleo não diverte | Repensar a mecânica antes de seguir |

**Ajustes possíveis já previstos:**
- se as filas nunca importam: capacidade menor ou mais demanda;
- se o caos vence: túnel nível 2 mais barato ou rotas mais visíveis;
- se manter os túneis vira tarefa repetitiva: mais automação nos pedidos.

## 6. Protótipos 2 e 3

### 6.1 Protótipo 2: árvore e combate

- **Pergunta:** a árvore gera escolhas diferentes, e cada casta resolve um problema que só ela resolve?
- **Escopo:**
  - árvore completa (17 recursos, 26 estruturas);
  - 10 castas;
  - 4 inimigos com traços;
  - estações;
  - rival e expedição;
  - 2 ou 3 mapas de teste.
- **Responde:** Q03 (receitas), Q15 (prioridade das cuidadoras), Q18 (tamanho da colônia), Q21 (inimigos dentro do túnel), Q22 (mudar sentido com formigas dentro).
- **Critérios de sucesso:**
  - em 3 partidas no mesmo mapa, o usuário termina com composições diferentes;
  - nenhuma casta fica sem uso em todas as partidas;
  - o simulador de economia (`07` §13) não mostra caminho dominante;
  - o desempenho continua dentro do portão com tudo ligado.

### 6.2 Protótipo 3: o arco 1

- **Pergunta:** um jogador novo aprende sozinho e, no fim do arco 1, quer continuar?
  - Isso é exatamente o gancho da compra (D82).
- **Escopo:**
  - F1 a F5 com tutorial embutido (D63);
  - transição de inverno;
  - voo e escolha de traço;
  - save;
  - PT-BR e EN;
  - arte da etapa c2 aplicada;
  - APK instalável.
- **Responde:** Q20 (leitura dos ícones), Q23 (silhuetas), D92 (leitura da visão geral a 7 ou 8 dp por célula).
- **Critérios de sucesso:**
  - quem não conhece o jogo termina o arco 1 sem ajuda;
  - leva de 60 a 75 minutos;
  - a pessoa diz espontaneamente que quer ver o arco 2.
- Aqui pelo menos **2 ou 3 pessoas de fora** fazem muita diferença (risco da D79).

## 7. Plano de testes

### 7.1 Testes automáticos (desde o protótipo 1)

- **Testes da simulação:** regras de fila, pedidos, receitas, dano, fome.
- **Cenários gravados:** semente + ações → resultado esperado. Eles pegam regressões.
- **Bots de balanceamento:**
  - jogam fases inteiras sem tela, em alta velocidade;
  - procuram estratégias dominantes e fases impossíveis.

### 7.2 Métricas dentro do jogo (D86)

- **Gravadas localmente**, num arquivo exportável, sem servidor e sem SDK de terceiros nos protótipos.
- **Exemplos:**
  - tempo até a primeira operária;
  - tempo em fila;
  - mortes por fome;
  - ações por minuto;
  - trechos sem decisão;
  - motivo da derrota.
- No lançamento, a decisão sobre usar métricas anônimas fica em aberto (Q33). Se forem usadas, entram no consentimento da D82.

### 7.3 Teste fechado da Play Store

- **Regra confirmada:** contas pessoais criadas depois de 13/11/2023 precisam de um teste fechado com pelo menos **12 testadores inscritos de forma contínua por 14 dias** antes de pedir acesso à produção.
  - Relatos da comunidade dizem que o prazo pode recomeçar se testadores saírem.
  - Por isso a recomendação é **recrutar de 15 a 20 pessoas**.
  - Contas de organização não precisam disso, mas exigem número D-U-N-S.
- **Recrutar cedo**, já no protótipo 3: amigos, família e comunidades de jogos de estratégia.
- **O teste fechado também é o teste do funil:**
  - quantos terminam o arco 1;
  - quantos compram ou usam anúncios;
  - onde travam.

### 7.4 Celulares

- **Redmi Note 14:** todos os dias.
- **Celular de entrada:** a cada marco. O modelo ainda vai ser escolhido (Q32).

## 8. Roteiro até o lançamento

| Marco | Conteúdo | Em paralelo |
|---|---|---|
| **V** | Visual completo aprovado: `08`, catálogo visual e app de exemplo (D106). É trabalho de design, fora da tabela de esforço, que conta só a construção | — |
| **M0** | Projeto base, gerar APK de teste (o repositório git já existe) | — |
| **M1** | Portão de desempenho aprovado | — |
| **M2** | Protótipo 1 aprovado | — |
| **M3** | Protótipo 2 aprovado | Planilha da árvore; esboço de som (Q31) |
| **M4** | Protótipo 3 aprovado (arco 1 completo) | Recrutar testadores; nome final (Q01) |
| **M5** | Conteúdo completo: arcos 2 e 3, desafios, sandbox | Ficha da loja, ícone, vídeo |
| **M6** | Monetização, consentimento, polimento, acessibilidade | Política de privacidade, Segurança dos Dados |
| **M7** | Teste fechado de 14 dias, correções | Preço final (Q10) |
| **M8** | **Lançamento no Android** | — |
| **M9** | Porta para a Steam + chinês simplificado (D83, D84) | — |

## 9. Depois do lançamento

### 9.1 Steam (D83)

- **Por quê:**
  - jogos de estratégia e simulação vendem melhor no PC;
  - o jogo em TypeScript roda no PC com pouca mudança.
- **Custo de entrada:** US$ 100 por jogo (Steam Direct). Segundo o anúncio original da Valve, esse valor volta depois de US$ 1.000 em vendas.
- **Modelo proposto:**
  - jogo pago, sem anúncios;
  - preço acima do celular (a calibrar);
  - conquistas e save na nuvem da Steam.
- **O que muda:**
  - **Tela em paisagem.** O ninho continua crescendo para baixo, e os painéis vão para as laterais em vez da parte de baixo.
  - **Mouse e teclado:** passar o mouse mostra informação, e há atalhos.
  - **Steam Deck:** controle e tela de 1280 × 800, se valer a pena.
- **O que fazer desde já, sem custo extra relevante:**
  - interface em HTML e CSS com layout responsivo;
  - nada de posição fixa que só funciona em 360 × 800;
  - entrada por ações (§2);
  - camada de plataforma (§2).
- **Ferramenta para o PC:** Electron ou Tauri (Q29). Decidir na hora da porta.

### 9.2 China (D84)

- **Pelo celular:**
  - a Google Play não funciona na China;
  - jogos com compra precisam de licença do governo (ISBN, emitido pela NPPA);
  - empresas estrangeiras não podem pedir essa licença sozinhas: precisam de uma publicadora chinesa;
  - o processo leva cerca de 1 ano, e as vagas por mês são limitadas.
  - **Fica fora** por enquanto.
- **Pela Steam:**
  - o chinês simplificado passou o inglês como idioma principal dos usuários da Steam (33,7% contra 33,5%, dado da Valve na GDC 2025);
  - esse é o caminho realista: **Steam + tradução para chinês simplificado**.
- **O que fazer desde já:**
  - textos fora do código (já previsto);
  - nada de texto dentro de imagens;
  - prever uma fonte de reserva com chinês, porque a Atkinson Hyperlegible não tem esses caracteres;
  - layouts que aguentem textos mais curtos ou mais longos.

### 9.3 Receita esperada no Android (1º ano, D82)

As hipóteses:
- **Por venda, depois dos 15% do Google:**
  - Brasil: cerca de R$ 8,40;
  - outros países: cerca de R$ 14 (US$ 1 ≈ R$ 5,50);
  - média de cerca de R$ 11, com metade dos compradores de cada lado.
- **Anúncios:**
  - cerca de 1.200 vídeos a cada 1.000 instalações;
  - cerca de US$ 5 por 1.000 vídeos, misturando o Brasil com os outros países;
  - isso dá cerca de R$ 33 a cada 1.000 instalações.

| Cenário | Downloads | Compram | **Total por ano** |
|---|---|---|---|
| Pessimista | 3 mil | 1% | cerca de R$ 400 |
| Realista | 20 mil | 2% | cerca de R$ 5 mil |
| Otimista (destaque ou viral) | 150 mil | 3% | cerca de R$ 55 mil |

- Os totais não descontam imposto.
- Os anúncios dão de 10% a 15% da receita: são a porta de acesso, não a fonte principal.
- O que mais muda o resultado é o número de downloads. O preço muda pouco.

## 10. Riscos do projeto

| Risco | Efeito | Mitigação |
|---|---|---|
| O núcleo não diverte | O jogo todo cai | Protótipo 1 com critérios claros e decisão explícita (§5.6) |
| Desempenho em celular fraco | Avaliações ruins, menos alcance | Portão na semana 1 e medição a cada marco |
| Projeto longo (de 1,8 a 2,8 anos) | Cansaço e perda de ritmo | Marcos curtos com algo jogável no fim de cada um |
| Só quem desenhou testa os protótipos | Falhas de entendimento aparecem tarde | Métricas, bots, e 2 ou 3 pessoas de fora no protótipo 3 |
| Poucos downloads | Receita baixa (§9.3) | Ficha caprichada, vídeo do formigueiro funcionando, divulgação em comunidades; Steam como segunda chance |
| Escopo de conteúdo grande | Balanceamento infinito | Planilha + bots + simulador de economia |

## 11. Questões em aberto desta etapa

| # | Questão | Quando resolver |
|---|---|---|
| Q01 | Nome final do jogo | Antes do M4 (os testadores já veem o nome) |
| Q10 | Preço final (proposta: R$ 9,90 / US$ 2,99 a 3,99) | M7 |
| Q29 | Steam: Electron ou Tauri | M9 |
| Q30 | China: quando traduzir para chinês simplificado e quem traduz | M9 |
| Q31 | Som e música: estilo, quantidade, fazer, licenciar ou encomendar | Durante o protótipo 2 (antes do M3) |
| Q32 | Modelo exato do celular de entrada (D80) | Antes do M1 |
| Q33 | Métricas anônimas no lançamento: sim ou não, e qual ferramenta | M6 |

## Fontes externas citadas

- Teste fechado da Play Store: [Google Play Console Help](https://support.google.com/googleplay/android-developer/answer/14151465)
- Taxa da Steam: [Steamworks · App fee](https://partner.steamgames.com/doc/gettingstarted/appfee), [Game Developer](https://gamedeveloper.com/business/valve-will-charge-devs-100-to-publish-games-through-steam-direct)
- Idiomas na Steam: [PC Gamer](https://pcgamer.com/uk/chinese-is-now-steams-most-popular-language-according-to-its-hardware-survey), [GamesRadar](https://www.gamesradar.com/games/english-is-no-longer-the-biggest-language-on-steam-as-chinese-gamers-embrace-pc-gaming-even-harder-after-black-myth-wukong)
- Licença na China: [MFAT (governo da Nova Zelândia)](https://www.mfat.govt.nz/cn/trade/mfat-market-reports/entering-chinas-mobile-gaming-market-a-guide-to-licensing-and-regulatory-approval), [Pocket Gamer.biz / Yodo1](https://www.pocketgamer.biz/news/74835/yodo1s-guide-to-publishing-your-mobile-game-in-china-part-1-isbn-copyright-and-taxes/)
