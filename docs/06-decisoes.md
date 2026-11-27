# 06 — Registro de decisões

> Fonte da verdade para o que foi decidido. Os outros documentos devem seguir este arquivo; em caso de conflito, este vence e o outro documento é corrigido.
>
> Status possíveis: **Decidida** · **Provisória** (decidida, mas o protótipo pode derrubar) · **Substituída** (mantida para histórico)

---

## Decisões

### D01. Fantasia: "você é a colônia"
- **Status:** Decidida · **Data:** 2026-11-24 · **Etapa:** (a)
- **Decisão:** o jogador é o superorganismo. A rainha é a peça frágil e central do tabuleiro, não o avatar.
- **Alternativas:** jogador como rainha (fantasia mais fácil de vender, mas sugere controle direto); jogador como feromônio (original, mas vira um jogo de roteamento que briga com os sliders).
- **Motivo:** é coerente com "não controlar unidades" e com os sliders.

### D02. Base do jogo: população como cadeia + estações como ritmo
- **Status:** Decidida · **Data:** 2026-11-24 · **Etapa:** (a)
- **Decisão:** formigas não são compradas: nascem de rainha → ovo → larva → casta, com atraso de minutos. Estações dão ritmo à fase.
- **Alternativas:** feromônio como sistema central (caro, comportamento emergente difícil de depurar); túneis escaváveis livremente em terreno contínuo (o mais caro de todos).
- **Motivo:** é o que mais muda as decisões em relação ao Achikaps e custa pouco de implementar (fila + timers).

### D03. Formato de sessão
- **Status:** Decidida · **Data:** 2026-11-24 · **Etapa:** (a)
- **Decisão:** fases curtas de cerca de 12 minutos, cada uma = 1 ano da colônia em 4 estações. Campanha + sandbox no MVP. Modo "ano com variações sorteadas" (roguelite leve) depois do MVP, reaproveitando o mesmo código.
- **Alternativas:** partidas longas roguelite como modo principal (balanceamento procedural difícil); colônia persistente/idle (mata a tensão das ondas).
- **Motivo:** bom para mobile, fácil de balancear fase a fase, e o modo sorteado vem quase de graça depois.

### D04. Vitória e derrota
- **Status:** Decidida · **Data:** 2026-11-24 · **Etapa:** (a)
- **Decisão:** vitória = produzir X aladas para o voo nupcial. Algumas fases podem ter como alternativa destruir o ninho rival (ver D17). Derrota = a rainha morre.
- **Alternativas:** sobreviver a N ondas (igual às referências); pontuação/infinito (bom para sandbox, fraco para campanha).
- **Motivo:** cria a tensão entre investir no futuro (aladas não trabalham nem lutam) e sobreviver agora.
- **Risco anotado:** estratégia ótima virar "ignorar aladas até o fim". Mitigação: aladas levam 120 s para amadurecer e a câmara nupcial tem poucas vagas. Regra detalhada em D31.

### D05. Monetização
- **Status:** Substituída por D82 (modelo híbrido) · **Data:** 2026-11-24 · **Etapa:** (a)
- **Decisão:** grátis com desbloqueio único (primeiras fases grátis, uma compra libera o resto e o sandbox). Sem anúncios, sem moedas, sem pay-to-win.
- **Alternativas:** jogo pago (baixo alcance no Android para um desenvolvedor desconhecido); F2P com anúncios e compras (exige operação contínua, conflita com o tom e é o que o público odeia nos jogos de formiga atuais).
- **Motivo:** alcance de app grátis sem o custo de design e operação de um F2P.

### D06. Idiomas
- **Status:** Decidida · **Data:** 2026-11-24 · **Etapa:** (a)
- **Decisão:** PT-BR e EN desde o início.
- **Motivo:** custo baixo se o jogo for planejado com pouco texto.

### D07. Tabuleiro em corte lateral, tela em retrato
- **Status:** Decidida · **Data:** 2026-11-24 · **Etapa:** (a)
- **Decisão:** visão de formicário: superfície numa faixa no topo, ninho crescendo para baixo, rolagem vertical. Por dentro, continua sendo uma rede de nós e ligações, com profundidade como atributo.
- **Alternativas:** rede vista de cima igual ao Achikaps (visualmente um clone); dois mapas separados, superfície e ninho (dobra a interface).
- **Motivo:** identidade visual imediata, encaixa no retrato, cria gargalos naturais e torna a profundidade uma regra.

### D08. Superfície fixa com olheiros, sem trilhas
- **Status:** Decidida · **Data:** 2026-11-24 · **Etapa:** (a) · **Substitui:** D08a
- **Decisão:** a superfície é uma faixa com plantas em posições fixas por fase. O jogador constrói um **olheiro** (entrada) embaixo de uma planta para colher folhas. Não existem trilhas. Toda a logística acontece pelos túneis.
- **Alternativas:** D08a (abaixo); tudo no subsolo, sem superfície.
- **Motivo:** o usuário achou a superfície dinâmica complicada. Ela era um segundo sistema competindo com o central e criava muitos estados passageiros, difíceis de representar de forma minimalista.

### D08a. Túneis + trilhas temporárias na superfície
- **Status:** Substituída por D08 · **Data:** 2026-11-24
- **Era:** túneis permanentes no subsolo + trilhas de feromônio baratas e temporárias até fontes de comida que aparecem e se esgotam (numa variante, a trilha era criada automaticamente ao tocar na comida).

### D09. Casta definida pela dieta do berçário
- **Status:** Decidida · **Data:** 2026-11-24 · **Etapa:** (a) · **Substitui:** D09a
- **Decisão:** existe **um tipo de berçário**. O jogador escolhe a dieta de cada berçário, e as carregadoras levam os recursos daquela dieta. A dieta define a casta que nasce.
- **Alternativas:** D09a (um berçário diferente por casta); slider de proporção de castas (abstrato, mais um slider); castas automáticas por tamanho da colônia (tira a decisão do jogador).
- **Motivo:** mantém a decisão espacial e logística e corta 3 tipos de estrutura.

### D09a. Um tipo de berçário por casta
- **Status:** Substituída por D09 · **Data:** 2026-11-24
- **Era:** berçário comum → operária; berçário proteico → soldado; câmara real → alada.

### D10. Direções de ataque
- **Status:** Decidida · **Data:** 2026-11-24 · **Etapa:** (a)
- **Decisão:** MVP: **de cima** (predadores descem pelos olheiros) e **dos lados** (o ninho rival cava túneis até você). Depois do MVP ou em fases tardias: **de baixo** (escavadores furam o solo em qualquer ponto, com aviso de cerca de 20 s).
- **Alternativas:** entrada única (rejeitada pelo usuário); inimigos vindo de todas as bordas, como no Achikaps.
- **Motivo:** três direções, cada uma com um tipo de ameaça fácil de reconhecer. Expandir o ninho sempre aumenta o que precisa ser defendido.

### D11. Upgrades com no máximo 2 níveis
- **Status:** Provisória · **Data:** 2026-11-24 · **Etapa:** (a)
- **Decisão:** túneis (nível 2 = mais fluxo e velocidade) e câmaras (nível 2 = mais capacidade) têm no máximo 2 níveis.
- **Alternativas:** só túneis com upgrade; árvore de melhorias por estrutura (multiplica balanceamento e interface).
- **Motivo:** custo de código baixo (multiplicador + botão). Um 3º nível só entra se o protótipo mostrar falta de progressão dentro da fase.
- **Exceção (2026-11-25):** túneis passam a ter 4 níveis, com capacidade e frente de combate próprias (D52, D53). O limite de 2 níveis continua para as estruturas.

### D12. Economia: 3 recursos naturais → 3 processados
- **Status:** Substituída por D44 (2026-11-25) · **Data:** 2026-11-24 · **Etapa:** (a)
- **Decisão:**

  | Natural | Origem | Estrutura | Processado | Usado para |
  |---|---|---|---|---|
  | Folha | Plantas da superfície, via olheiro (D20) | Jardim de fungo | Fungo (+ refugo) | Alimentar rainha e todas as castas |
  | Presa | Inimigos mortos | Câmara de presas | Proteína | Tanque (e explosiva, depois do MVP) |
  | Melada | Pulgões nas raízes, via curral (D20) | Câmara ácida | Ácido | Atiradora (e explosiva, depois do MVP) |

- **Alternativas:** 1 ou 2 recursos (economia rasa: "mais coleta ou mais defesa"); proteína vinda de insetos que aparecem na superfície (dependia da superfície dinâmica, descartada em D08).
- **Motivo:** cadeias de transformação são o que dá profundidade ao Achikaps. Presa vinda de inimigos mortos cria um ciclo: defender bem alimenta a próxima defesa.
- **Em aberto:** receitas exatas e valores → etapa (b).

### D13. Lixeira e refugo no MVP
- **Status:** Provisória · **Data:** 2026-11-24 · **Etapa:** (a)
- **Decisão:** o jardim de fungo gera refugo, que precisa ser levado à lixeira. Se acumular, a produção do jardim cai.
- **Alternativas:** sem refugo; refugo só depois do MVP.
- **Motivo:** cria uma carga logística constante, que gera engarrafamentos interessantes. É barato (igual a qualquer transporte).
- **Critério de corte:** se jogadores do protótipo descreverem a lixeira como tarefa chata, ela sai.

### D14. Papéis das operárias (sliders)
- **Status:** Decidida · **Data:** 2026-11-24 · **Etapa:** (a)
- **Decisão:** **Carregar** (transporte de todos os recursos e colheita no olheiro), **Escavar** (túneis, câmaras, upgrades), **Cuidar** (trabalho dentro das câmaras: jardim, câmaras de processamento, berçários), **Guardar** (defesa fraca nos postos e olheiros) e o restante na **Reserva** (antes "ocioso"; ver D30).
- **Alternativas:** papel separado para colheita na superfície (mais um slider sem decisão nova).
- **Motivo:** espelha Construir / Carregar / Defender / Ocioso do Achikaps, mais o trabalho dentro das estruturas.

### D15. Castas de combate
- **Status:** Substituída por D43 e D49 (2026-11-25) · **Data:** 2026-11-24 · **Etapa:** (a)
- **Decisão:** MVP: **operária** (também guarda), **tanque** (tampa passagens com a cabeça; inspirada em *Colobopsis*) e **atiradora** (ácido à distância que deixa o alvo lento; inspirada em *Formica archboldi*). Primeira adição depois do MVP: **explosiva** (dano em área que gruda os inimigos e mata a própria formiga; inspirada em *Colobopsis explodens*).
- **Cortada:** formiga-acrobata (redundante com a atiradora).
- **Motivo:** combate é a parte mais cara do jogo (comportamento, balanceamento e animação por casta). Três castas cobrem linha de frente + dano à distância. A explosiva acrescenta uma decisão de sacrifício quando houver base sólida.

### D16. Espécies: colônia fictícia com castas inspiradas em espécies reais
- **Status:** Decidida · **Data:** 2026-11-24 · **Etapa:** (a)
- **Decisão:** a colônia do jogador mistura castas inspiradas em espécies diferentes, sem justificativa biológica. Cada casta pode ter um cartão curto citando a espécie que a inspirou. A base econômica (jardim de fungo) é inspirada nas saúvas.
- **Alternativas:** uma espécie só, com castas por tamanho (perde as castas interessantes); parasitismo social, com castas de outras espécies vindas de pupas roubadas de rivais (coerente, porém mais complexo; fica como **ideia para expansão**).
- **Motivo:** ver D18.

### D17. Ninhos rivais: ninho fixo atacável por expedição
- **Status:** Decidida · **Data:** 2026-11-24 · **Etapa:** (a)
- **Decisão:** o ninho rival é uma estrutura do mapa (na lateral) com vida própria. Ele manda ondas num ritmo definido pela fase e pode ser atacado por **expedições**, que voltam com saque (presa e recursos). Ele não tem economia simulada.
- **Alternativas:** rival com IA econômica espelhada (2 a 3 vezes o trabalho do jogo); PvP online (fora do escopo).
- **Motivo:** atende ao desejo de atacar e ser atacado com custo médio.
- **Em aberto:** como a expedição é comandada (ver Q02).

### D18. A biologia é pano de fundo, a diversão decide
- **Status:** Decidida · **Data:** 2026-11-24 · **Etapa:** (a)
- **Decisão:** a biologia inspira mecânicas e tema, mas não precisa ser fiel. O jogo não é educacional. Em conflito entre fidelidade e diversão, vence a diversão.
- **Altera o briefing original**, que pedia a camada biológica "no centro do design". A biologia continua sendo a **fonte** das mecânicas (dieta define casta, porta-cabeça, explosão), mas deixa de ser restrição.
- **Motivo:** decisão do usuário.

### D19. Defesa por postos de guarda
- **Status:** Provisória · **Data:** 2026-11-24 · **Etapa:** (a)
- **Decisão:** o jogador constrói **postos de guarda** em cruzamentos de túneis e junto aos olheiros. Formigas de combate e operárias no papel Guardar se distribuem sozinhas entre os postos e reagem a ameaças num raio.
- **Alternativas:** formigas de combate patrulhando livremente (mais pathfinding e menos controle para o jogador).
- **Motivo:** dá ao jogador controle espacial da defesa sem micro (pilar P1). Equivale às estações de defesa do Achikaps.

### D20. Obtenção de recursos: extratores dentro do anel da fonte
- **Status:** Provisória · **Data:** 2026-11-24 · **Etapa:** (a) · **Resolve:** Q05
- **Decisão:** as fontes naturais ficam em posições fixas em cada fase, cada uma com um anel (zona de extração). O extrator só pode ser construído dentro desse anel.

  | Recurso | Fonte no mapa | Extrator | Quem trabalha | Esgota? (hipótese a calibrar) |
  |---|---|---|---|---|
  | Folha | Planta fixa na superfície | **Olheiro** (embaixo da planta; também é entrada de inimigos) | Carregar (sobe, corta, traz) | Não; produção sazonal (máxima na primavera, zero no inverno; ver `02-mecanicas.md` §4.3) |
  | Seiva (era "melada"; D40) | Bolsão de raízes fixo no solo | **Coletor de seiva** (ao lado do bolsão; era "curral") | Cuidar + Carregar | Sim; quantidade finita por bolsão (ex.: 300) |
  | Argila (D41) | Qualquer escavação | Nenhum, ou **Poço de argila** | Escavar | Não |
  | Presa | Nenhuma fonte fixa: inimigos mortos e saque de expedições | Nenhum (o corpo cai onde o inimigo morreu) | Carregar (recolhe) | Depende de haver combate |

- **Alternativas:** coleta à distância sem extrator (tira a decisão espacial); fontes que aparecem aleatoriamente (era a superfície dinâmica, descartada em D08).
- **Motivo:**
  - mantém o princípio do Achikaps descrito pelo usuário (estrutura perto do recurso; não verificado em fonte);
  - faz de cada fase um quebra-cabeça espacial;
  - o esgotamento dos bolsões empurra a expansão para áreas mais perigosas (pilar P3);
  - a presa vinda de combate cria o ciclo "defender bem → mais proteína → mais tanques".
- **Riscos para a etapa (b):**
  - começo travado sem presa: as primeiras ondas precisam ser fracas e frequentes;
  - logística longa demais: mitigada por upgrade de túnel (D11) e depósitos intermediários;
  - inverno parado: precisa ter decisões, não só espera.

### D21. Expedição por botão
- **Status:** Decidida · **Data:** 2026-11-24 · **Etapa:** (b) · **Resolve:** Q02
- **Decisão:** você toca no ninho rival, escolhe quantas castas de combate vão (um slider, naquele momento) e confirma. Elas caminham, lutam e voltam com saque. Detalhes em `02-mecanicas.md` §7.2.
- **Alternativas:** 5º slider "Atacar" (desgaste contínuo, sem momento de decisão); contra-ataque automático (sem decisão).
- **Motivo:** decisão grande, de momento e risco, sem micro (P1).

### D22. Colônia de tamanho médio
- **Status:** Decidida · **Data:** 2026-11-24 · **Etapa:** (b)
- **Decisão:** de 60 a 120 formigas no pico de uma fase.
- **Alternativas:** 20 a 40 (parece vazia); 200 a 400 (otimização pesada; cada formiga vale pouco).
- **Motivo:** o formigueiro parece vivo e o desempenho continua seguro em celular fraco.

### D23. Arco fixo de estações
- **Status:** Decidida · **Data:** 2026-11-24 · **Etapa:** (b) · **Resolve:** Q04
- **Decisão:** toda fase segue outono → inverno → primavera → verão, 3 min cada. Outono: montar e estocar, ondas fracas. Inverno: sem folha, rival quieto, janela de expedição. Primavera: folha máxima, crescimento. Verão: ondas fortes, chefe, voo nupcial às 12:00.
- **Alternativas:** estações mudando só a produção; ordem e duração variáveis por fase.
- **Motivo:** dá um arco que termina no clímax e transforma o inverno em janela de escavação e ataque.

### D24. Manutenção contínua, sem envelhecimento
- **Status:** Decidida · **Data:** 2026-11-24 · **Etapa:** (b) · **Resolve:** Q06
- **Decisão:** toda formiga consome fungo por minuto (castas de combate consomem mais), e ninguém morre de velhice. A fome tem uma ordem definida de consequências (`02-mecanicas.md` §5.3).
- **Alternativas:** envelhecimento (perda de unidades sem motivo visível, difícil de balancear); as duas coisas.
- **Motivo:** limita a população pelo fungo e dá peso à decisão de criar soldados cedo. O envelhecimento fica como candidato para o modo "ano sorteado".

### D25. Linha do tempo do ano com ondas previstas
- **Status:** Decidida · **Data:** 2026-11-24 · **Etapa:** (b) · **Resolve:** Q07
- **Decisão:** linha do tempo no topo da tela com as estações e um ícone para cada onda prevista. A direção (qual olheiro ou boca rival) aparece cerca de 45 s antes.
- **Alternativas:** só aviso de 60 s (a cadeia de castas não reage a tempo); surpresa total.
- **Motivo:** a produção de castas leva minutos, então o jogador precisa planejar.

### D26. Limite de 12 câmaras por fase
- **Status:** Substituída por D32 (2026-11-25) · **Data:** 2026-11-24 · **Etapa:** (b)
- **Decisão:** no máximo 12 câmaras. Olheiros, postos de guarda e nós não contam.
- **Alternativas:** 10 (não cabe a lista de estruturas do MVP com 2 jardins e 2 berçários); sem limite (a tela vertical satura).
- **Motivo:** leitura da tela (P4). A conta da lista do MVP dá cerca de 11 câmaras numa colônia completa.

### D27. Ondas laterais cavam túneis permanentes
- **Status:** Provisória · **Data:** 2026-11-24 · **Etapa:** (b)
- **Decisão:** uma onda lateral sai da boca rival e cava em linha reta (0,5 cél/s) até a estrutura mais próxima. O túnel permanece e passa a servir de acesso para os rivais **e** para as suas expedições.
- **Alternativas:** túneis rivais fixos, desenhados no mapa (menos dinâmico); inimigos que aparecem dentro da rede (sem leitura espacial).
- **Motivo:** "a ameaça entra por onde você cresceu" (P3). Liga defesa e ataque.
- **Risco:** com várias ondas, a rede pode ficar cheia de túneis rivais. Calibrar o número de ondas laterais por fase.

### D28. Transporte por sistema de pedidos
- **Status:** Provisória · **Data:** 2026-11-24 · **Etapa:** (b)
- **Decisão:** estruturas emitem pedidos quando o estoque de entrada cai abaixo da metade. Carregadoras atendem por `urgência ÷ distância`, uma unidade por viagem. Saídas cheias vão para o depósito; sem depósito, a estrutura para.
- **Alternativas:** rotas fixas definidas pelo jogador (micro); transporte instantâneo dentro da rede (perde a logística visível).
- **Motivo:** regra simples, determinística e legível. Cada pedido parado aparece como ícone.

### D29. O tanque bloqueia a passagem
- **Status:** Provisória · **Data:** 2026-11-24 · **Etapa:** (b)
- **Decisão:** enquanto houver um tanque vivo num posto, inimigos não passam por aquela célula.
- **Motivo:** transforma a inspiração (formiga que tampa a porta com a cabeça) numa regra clara e dá aos postos uma função espacial forte.
- **Atualização (D53):** cada tanque bloqueia uma faixa da frente de combate. Em túneis largos são precisos até 3 tanques para fechar a passagem.
- **Risco:** um tanque no lugar certo pode parar tudo. Calibrar a vida do tanque e o dano dos soldados rivais.

### D30. A Reserva defende a rainha
- **Status:** Provisória · **Data:** 2026-11-24 · **Etapa:** (b)
- **Decisão:** as operárias que sobram (antes "ociosas") viram **Reserva**: ficam na câmara real e lutam se um inimigo chegar até ela.
- **Motivo:** dá função ao papel "ocioso" e cria uma última linha de defesa compreensível.

### D31. Vitória por aladas vivas às 12:00
- **Status:** Provisória · **Data:** 2026-11-24 · **Etapa:** (b) · **Detalha:** D04
- **Atualizada por D73 (2026-11-25):** o voo com X aladas é a vitória **da última fase de cada arco**. As fases intermediárias têm objetivo próprio.
- **Decisão:**
  - as aladas nascem da dieta "alada" no berçário e esperam na câmara nupcial (6 vagas; 10 no nível 2);
  - às 12:00, vence quem tiver pelo menos X aladas vivas (fase média: X = 6);
  - com menos que X, a fase termina sem vitória e pode ser repetida;
  - o chefe do verão mira a câmara nupcial.
- **Motivo:** a vitória vira um investimento físico, que pode ser atacado e que compete com a defesa.

### D32. Sem limite de câmaras; mapa maior com scroll e zoom
- **Status:** Provisória · **Data:** 2026-11-25 · **Etapa:** (b) · **Substitui:** D26
- **Decisão:** não há limite de câmaras. A colônia cresce para baixo e para os lados num mapa maior que a tela, com rolagem nos dois eixos e zoom de pinça. O mapa continua **finito por fase** (tamanho definido pela fase), por desempenho e para desenhar as fases.
- **Alternativas:** D26 (12 câmaras); mapa infinito (sem desenho de fase, risco de desempenho).
- **Motivo:** decisão do usuário. A colônia grande é parte da fantasia, e a leitura passa a ser resolvida por zoom e nível de detalhe (ver P4 revisado em `01-visao.md`), não por limite.
- **Riscos:**
  - desempenho com rede e população maiores;
  - a D22 (60 a 120 formigas) pode precisar ser revista depois da árvore de criação (Q18);
  - perder a noção do todo: exige uma visão de colônia inteira com zoom afastado e alertas que apontam para fora da tela.

### D33. Tema visual: solo escuro com elementos luminosos
- **Status:** Decidida · **Data:** 2026-11-25 · **Etapa:** (c)
- **Decisão:** um único tema no MVP: terra em tons escuros, câmaras e recursos em cores vivas. Uma versão clara pode vir depois, se pedirem.
- **Alternativas:** tema claro como no Achikaps (mais parecido com a referência); caderno de naturalista (baixo contraste, caro de manter).
- **Motivo:** o corte lateral parece um formicário, os fluxos se destacam, economiza bateria em OLED, e um só tema reduz o trabalho de testar a paleta.

### D34. Formigas desenhadas com três círculos e detalhe por zoom
- **Status:** Decidida · **Data:** 2026-11-25 · **Etapa:** (c)
- **Decisão:** cabeça, tórax e abdômen como círculos, sem pernas. As castas se distinguem pela forma (e não só pela cor). Com zoom afastado, cada formiga vira um ponto colorido.
- **Alternativas:** um ponto só (sem personalidade); silhueta com pernas animadas (caro e pesado).
- **Motivo:** identidade barata, legível com muitas formigas, acessível para daltônicos.

### D35. Sliders como botões + e − com a Reserva como pote
- **Status:** Decidida · **Data:** 2026-11-25 · **Etapa:** (c) · **Resolve parte de:** Q13
- **Decisão:** cada papel tem botões + e −. "+" move 1 operária da Reserva para o papel; "−" devolve 1. Segurar o botão repete.
- **Alternativas:** sliders de arrastar (o problema "finicky" do Achikaps); barra única segmentada (divisórias pequenas, só troca entre vizinhos).
- **Motivo:** precisão no toque, alvos grandes, a Reserva visível como o "caixa" de formigas.

### D36. Pausa, 1× e 2×, com obras planejadas em pausa
- **Status:** Decidida · **Data:** 2026-11-25 · **Etapa:** (c) · **Resolve parte de:** Q13
- **Decisão:** o jogo tem pausa, 1× e 2×. Em pausa, o jogador pode marcar obras; elas entram na fila e as escavadoras começam ao despausar. A pausa automática ao abrir o menu de construção pode virar opção nas configurações.
- **Alternativas:** sem pausa (hostil no celular); pausa automática obrigatória.
- **Motivo:** celular é interrompido o tempo todo, e planejar em pausa reduz a pressão do toque.

### D37. "Pherotrio" é o nome provisório
- **Status:** Decidida · **Data:** 2026-11-25 · **Resolve parte de:** Q01
- **Decisão:** usar "Pherotrio" como nome de trabalho. O nome final será decidido mais tarde, com checagem nas lojas de apps.

### D38. Nova etapa: árvore de criação
- **Status:** Decidida · **Data:** 2026-11-25
- **Decisão:** o centro do jogo passa a ser a **árvore de criação**: recursos combinados em novos recursos, que criam novos tipos de formiga e novas estruturas de defesa e de ataque, com upgrades que pedem recursos específicos. Ela ganha uma etapa própria, com o documento `07-arvore-de-criacao.md`.
- **Nova ordem das etapas:** (a) visão ✅ → (b) mecânicas ✅ → **(b2) árvore de criação** → (c) arte e interface → (d) conteúdo e progressão → (e) escopo e protótipo.
- **Motivo:** decisão do usuário. A árvore vem antes da arte porque o número de recursos e castas define a linguagem visual (quantas cores e formas são necessárias).
- **Consequência:** as seções de recursos, estruturas e castas de `02-mecanicas.md` foram movidas para o `07` (feito em 2026-11-25).

### D39. Diversidade: campanha abre a árvore rápido, e cada fase favorece galhos
- **Status:** Decidida · **Data:** 2026-11-25 · **Etapa:** (b2)
- **Atualizada por D62 (2026-11-25):** a árvore abre até a fase 9 ou 10 de cerca de 15, e não em 5.
- **Decisão:** a campanha libera a maior parte da árvore em cerca de 5 fases. O sandbox começa com tudo aberto. Em cada fase, as fontes do mapa e os traços dos inimigos favorecem galhos diferentes (`07` §10).
- **Alternativas:** árvore inteira desde a fase 1 (assusta o jogador novo); árvore grande com só alguns galhos por fase (limita demais).
- **Motivo:** diversidade logo no começo sem afogar o jogador, e nenhuma fase com a mesma resposta certa.

### D40. "Melada" vira "Seiva"
- **Status:** Decidida · **Data:** 2026-11-25 · **Etapa:** (b2) · **Resolve:** Q16
- **Decisão:** o recurso se chama **seiva**. A fonte é um **bolsão de raízes** e o extrator é o **coletor de seiva** (antes, bolsão de pulgões e curral).
- **Motivo:** decisão do usuário.

### D41. Argila: 4º recurso natural, gerado pela escavação
- **Status:** Decidida · **Data:** 2026-11-25 · **Etapa:** (b2)
- **Decisão:** toda escavação rende 1 argila a cada 5 pt. O poço de argila gera argila continuamente quando a expansão para.
- **Motivo:** dá uso econômico a escavar e alimenta barro, barricadas e upgrades.
- **Risco:** mais um recurso para carregar.

### D42. Duração da fase variável
- **Status:** Decidida · **Data:** 2026-11-25 · **Etapa:** (b2) · **Resolve:** Q17 · **Atualiza:** D03, D23
- **Decisão:** de 12 min nas fases iniciais (estações de 3 min) a 20 min nas finais (estações de 5 min). A ordem das estações (D23) não muda.
- **Alternativas:** 12 min sempre (não dá tempo de subir até o N3); 18 a 20 min sempre (pesado para as primeiras fases).
- **Motivo:** fases curtas para aprender, fases longas para usar a árvore funda.

### D43. Castas econômicas
- **Status:** Decidida · **Data:** 2026-11-25 · **Etapa:** (b2)
- **Decisão:** além da operária, duas castas econômicas presas ao seu papel: **cortadeira** (Carregar; leva 2 por viagem) e **cavadora** (Escavar; 2,5 pt/s, mais argila).
- **Motivo:** decisões econômicas sem comportamento novo (só números diferentes).

### D44. Árvore de criação v1
- **Status:** Provisória · **Data:** 2026-11-25 · **Etapa:** (b2) · **Substitui:** D12
- **Decisão:** a árvore descrita no `07`: 4 naturais, 5 processados N1, 5 combinados N2, 2 combinados N3, 10 castas e 26 estruturas.
- **Motivo:** o pedido do usuário de que recursos combinados criem castas, defesas, ataques e upgrades seja o centro do jogo.

### D45. Castas e estruturas sobre comportamentos base; processadoras genéricas
- **Status:** Decidida · **Data:** 2026-11-25 · **Etapa:** (b2)
- **Decisão:**
  - todas as castas e estruturas de combate são montadas sobre 7 comportamentos base (trabalho, corpo a corpo, bloqueio, distância, sacrifício em área, suporte, expedição) mais 3 efeitos (dano, lentidão, cura);
  - as 11 processadoras são uma única estrutura genérica que lê a receita dos dados;
  - a árvore inteira vive numa planilha exportada para dados (JSON).
- **Motivo:** conteúdo novo passa a custar dados e ícones, não código. O sistema fica coerente (regras iguais para itens parecidos) e fácil de iterar no balanceamento.

### D46. Inimigos com traços e vantagens
- **Status:** Provisória · **Data:** 2026-11-25 · **Etapa:** (b2)
- **Exceção (D67, 2026-11-25):** as fases F1 a F3, que são de ensino, têm menos de dois traços. A regra vale a partir da F4 (`04` §2.1).
- **Decisão:** enxame (formiga rival), blindado (soldado rival), rápido e caçador (aranha), chefe (lacraia), cada um fraco contra castas e estruturas diferentes (`07` §9). Toda fase tem pelo menos dois traços.
- **Motivo:** dá a cada galho da árvore um motivo para existir e evita que uma casta resolva tudo.

### D47. Upgrades exigem um recurso específico
- **Status:** Decidida · **Data:** 2026-11-25 · **Etapa:** (b2) · **Atualiza:** D11
- **Decisão:** todo upgrade custa 25 pt mais um recurso específico daquela estrutura (ex.: jardim pede néctar, berçário pede geleia, túnel pede barro). O máximo de 2 níveis (D11) continua para estruturas. Túneis têm 4 níveis, com custos por célula (D52).
- **Motivo:** pedido do usuário; dá uso a cada galho da árvore.

### D48. Linguagem visual dos recursos: forma única, cor por família
- **Status:** Decidida em (c) com ajuste de cor (D54) · **Data:** 2026-11-25 · **Etapa:** (b2)
- **Decisão:**
  - cada recurso tem uma **forma geométrica única**, como no Achikaps;
  - a **cor indica a família** (vegetal, açúcar, animal, mineral);
  - os combinados têm forma própria pintada com as cores dos ingredientes em metades;
  - os do N3 têm contorno duplo.
- **Motivo:** pedido do usuário (formas como no Achikaps), leitura para daltônicos, e a receita se lê no próprio ícone.

### D49. Conteúdo do MVP (proposta)
- **Status:** Substituída por D77 (2026-11-25) · **Data:** 2026-11-25 · **Etapa:** (b2) · **Substitui:** D15
- **Decisão:** o MVP leva 14 recursos (sem o N3), 8 castas (operária, cortadeira, cavadora, soldado, tanque, atiradora, curandeira, alada), 4 defesas (posto, barricada, torre ácida, armadilha de cola) e 1 ataque (galeria de assalto). A 1ª atualização traz o N3: gosma, feromônio, explosiva, saqueadora, mina de gosma e posto de guerra.
- **Motivo:** muita diversidade já no lançamento, deixando fora a camada mais cara de balancear.
- **Revisar em (e) à luz da D50:** com qualidade acima de prazo, o N3 pode entrar no lançamento se o balanceamento estiver pronto.

### D50. Qualidade do sistema acima de prazo
- **Status:** Decidida · **Data:** 2026-11-25
- **Decisão:** o critério principal deixa de ser "cabe para um dev solo" e passa a ser **qualidade do sistema**, mesmo que o jogo demore mais. Claude ajuda também na programação.
- **Altera o briefing original**, que pedia mover para pós-MVP tudo o que não justificasse o custo para um dev solo.
- **O que continua valendo:** complexidade para o jogador, leitura da tela, risco de balanceamento e desempenho em celular fraco são argumentos válidos para mudar ou adiar uma mecânica. Custo de implementação sozinho, não.
- **Motivo:** decisão do usuário.

### D51. Introdução gradual por fases
- **Status:** Provisória · **Data:** 2026-11-25 (revisada no mesmo dia) · **Detalha:** D39 · **Fechar em:** (d)
- **Decisão:**
  - a campanha apresenta formigas, estruturas e regras aos poucos, ao longo de cerca de 15 fases;
  - uma fase pode trazer **mais de uma novidade** quando elas se explicam juntas. Ex.: câmara de presas, proteína e soldado formam uma única ideia, "caçar vira exército";
  - o critério é o jogador entender, não uma contagem fixa por fase;
  - a ordem detalhada vai para o `04` (etapa d).
- **Revisão:** a primeira versão pedia uma novidade principal por fase. O usuário flexibilizou essa regra.
- **Motivo:** pedido do usuário, para que o jogador entenda bem cada peça sem a campanha ficar arrastada.

### D52. Trânsito nos túneis: limite rígido com fila, sentido e 4 níveis
- **Status:** Provisória (números a calibrar) · **Data:** 2026-11-25 · **Etapa:** (b) revisada · **Atualiza:** D11, D47
- **Decisão:**
  - **Capacidade fixa e fila:** cada túnel tem capacidade = células × formigas por célula. Quando está cheio, as formigas esperam numa fila por ordem de chegada na boca do túnel. A velocidade é sempre 1 s por célula.
  - **4 níveis**, ou seja, 3 upgrades:
    - nível 1: 2 formigas por célula, 4 pt;
    - nível 2: 3 por célula, +4 pt e +2 barro;
    - nível 3: 4 por célula, +4 pt, +2 barro e +1 cola;
    - nível 4: 5 por célula, +6 pt, +3 barro e +1 carapaça.

    Custos por célula. Túneis são exceção ao máximo de 2 níveis da D11.
  - **Sentido definido pelo jogador** em cada túnel: mão dupla (cada sentido usa metade da capacidade), só ida ou só volta (a capacidade inteira num sentido). Isso permite montar circuitos.
  - **Escolha de rota:** a carregadora vai pelo túnel permitido com menor tempo estimado, contando a fila. O jogo avisa quando não há rota, mas não impede a configuração.
- **Alternativas:**
  - congestionamento suave, em que a velocidade cai com a lotação (era a recomendação de Claude, testada num simulador anterior);
  - túneis sem limite, como no Achikaps.
- **Motivo:**
  - escolha do usuário;
  - o limite rígido é mais fácil de ler (cheio ou não cheio);
  - o sentido transforma o layout em planejamento de rotas, que o usuário quer como parte central da logística.
- **Risco:**
  - mais microgestão: cada túnel tem nível e sentido;
  - fila invisível em zoom distante.
  - Mitigação:
    - túnel novo nasce em mão dupla;
    - indicadores da D53;
    - aviso de "sem rota".

### D53. A largura do túnel muda o combate; indicadores de trânsito
- **Status:** Provisória · **Data:** 2026-11-25 · **Atualiza:** D29
- **Decisão:**
  - **Frente de combate:** é quantas formigas lutam lado a lado corpo a corpo numa célula. Vale 1 no nível 1, 2 nos níveis 2 e 3, e 3 no nível 4.
  - **Tanque:** cada tanque bloqueia uma faixa. No nível 1 um tanque fecha o túnel; no nível 4 são precisos três.
  - **Atiradoras e explosões** não dependem da frente.
  - **Inimigos** ignoram o sentido e não contam na capacidade (provisório; ver Q21).
  - **Indicadores:**
    - cor pela ocupação: verde-água abaixo de 70%, amarelo de 70% a 99%, vermelho cheio com fila;
    - espessura pelo nível;
    - setas de sentido;
    - pontos de fila na boca;
    - aviso de sem rota.
- **Alternativas:** largura só para logística, sem efeito no combate.
- **Motivo:**
  - pedido do usuário;
  - cria um dilema: alargar a rota de carga também alarga a porta do inimigo. Túnel estreito vira gargalo defensivo, e túnel largo serve para expedição e para muitos soldados juntos.

### D54. Paleta com códigos de cor e regra "cor nunca sozinha"
- **Status:** Provisória · **Data:** 2026-11-25 · **Etapa:** (c) · **Fecha:** D48
- **Decisão:**
  - **Fundos:** solo `#15110E`, escavado `#2B231D` e painel `#211B17`.
  - **Famílias:**
    - vegetal `#7FD16B`;
    - açúcar `#F5B841`;
    - animal `#F06E9A`, que deixou de ser coral e passou a ser rosa;
    - mineral `#BFA88A`.
  - **Perigo:** `#FF4F5E`, reservado a perigo.
  - **Lados do jogador:** defesa `#6FB3E8` e ataque `#9A6BFF`.
  - **Estados do túnel:** livre `#4FD1B0`, quase cheio `#FFD23F` e cheio `#FF4F5E`.
  - Tabela completa e contrastes no `03` §2.
  - **Regras:**
    - todo estado com cor tem também um sinal que não é cor;
    - vermelho só significa perigo.
- **Alternativas:**
  - coral para a família animal, como na proposta do `07`. Foi rejeitado porque se confunde com o vermelho de perigo e, na deuteranopia, com o verde;
  - um modo daltônico com paleta trocada. Foi rejeitado porque a forma já resolve.
- **Motivo:**
  - todos os pares de texto passam de 4,5:1, e todas as cores de jogo passam de 3:1 contra os fundos (WCAG 1.4.3 e 1.4.11);
  - a simulação de daltonismo mostra estados de túnel e lados bem separados;
  - vegetal e animal ficam parecidos na deuteranopia (ΔE 13), mas forma é identidade.

### D55. Grade, zoom e três níveis de detalhe
- **Status:** Provisória · **Data:** 2026-11-25 · **Etapa:** (c) · **Detalha:** D32, D34
- **Decisão:**
  - **Tela de referência:** 360 × 800 dp.
  - **Zoom:** até 64 dp por célula, começando em 24 dp. No zoom inicial, 15 células ocupam a largura da tela. O zoom mínimo passou a ser o que faz o mapa inteiro caber na tela (D92).
  - **Níveis de detalhe:**
    - perto (36 dp ou mais): três círculos, ícones e números;
    - médio (18 a 35 dp): símbolos;
    - longe (12 a 17 dp): pontos, estado dos túneis e alertas;
    - visão geral (abaixo de 12 dp, D92): sem formigas, só a rede, as câmaras, o pulso e os alertas.
  - **Alertas:** sempre com 24 dp na tela, em qualquer zoom.
- **Alternativas:** zoom contínuo sem níveis, que desenha todo o detalhe sempre e é ruim para leitura e desempenho.
- **Motivo:** resolve o risco de "fila invisível no zoom distante" (D52) e o custo de desenhar muitas formigas.

### D56. Layout da tela de jogo em retrato
- **Status:** Provisória · **Data:** 2026-11-25 · **Etapa:** (c)
- **Decisão:**
  - **No topo:** a linha do ano, com as ondas e a velocidade, e a barra de estado com fungo, rainha, aladas em relação à meta e população.
  - **No centro:** o mapa.
  - **Embaixo:** a faixa de papéis sempre visível e os botões Construir, Expedição e ☰.
  - **Painéis:** sobem de baixo, ocupam no máximo 45% da tela e só um fica aberto por vez.
  - Wireframes no `03` §6.
- **Alternativas:**
  - HUD lateral, que não cabe em retrato;
  - papéis escondidos num menu, que exigem toques demais para o controle mais usado.
- **Motivo:** informação onde o olho procura e ações onde o polegar alcança.

### D57. Gestos: túnel só no modo de construção
- **Status:** Provisória · **Data:** 2026-11-25 · **Etapa:** (c)
- **Decisão:**
  - **Fora do modo de construção:**
    - arrastar com 1 dedo sempre move a câmera;
    - pinça dá zoom;
    - toque seleciona;
    - toque longo mostra informação rápida.
  - **No modo de construção:**
    - arrastar a partir de um nó ou câmara desenha um túnel;
    - toque coloca estruturas;
    - "Confirmar" manda as obras para a fila.
  - **Alvos de toque:** pelo menos 48 dp, e 32 dp no mapa.
- **Alternativas:**
  - desenhar túnel com dois toques, origem e destino. É preciso, mas mais lento, e fica como opção de acessibilidade se o teste pedir;
  - desenhar túnel em qualquer momento, que causa escavação acidental.
- **Motivo:** separa olhar de construir sem pedir um gesto difícil.

### D58. Tipografia
- **Status:** Provisória · **Data:** 2026-11-25 · **Etapa:** (c)
- **Decisão:**
  - **Fonte:** Atkinson Hyperlegible (OFL), com dois pesos. Se ela não tiver algarismos tabulares, os números do HUD usam Inter.
  - **Tamanhos:** 20, 16, 14 e 12 sp. 12 sp só para número ao lado de ícone.
  - **Escala:** até 130%.
- **Alternativas:** Inter para tudo, que é neutra e tem algarismos tabulares, mas pior para baixa visão; fonte "temática", que tem pior leitura.
- **Motivo:** leitura em tela pequena e acessibilidade.

### D59. Acessibilidade mínima do MVP
- **Status:** Provisória · **Data:** 2026-11-25 · **Etapa:** (c)
- **Decisão:**
  - forma como identidade;
  - nada pisca acima de 1 Hz;
  - sem tremor de tela;
  - opção de movimento reduzido;
  - escala de texto;
  - alvos de 48 dp;
  - pausa sempre disponível;
  - jogável sem som;
  - vibração opcional e nunca como único sinal;
  - opção de inverter a barra de ações para canhotos.
  - Leitor de tela fica fora do MVP, mas os menus já usam componentes com rótulo.
- **Motivo:** cobre daltonismo, baixa visão, fotossensibilidade e uso com uma mão, sem custo de design depois.

### D60. Minimalismo rígido só em menus e HUD; o mundo ganha detalhe com o zoom
- **Status:** Substituída por D61 (2026-11-25) · **Data:** 2026-11-25 · **Etapa:** (c)
- **Decisão:**
  - menus e HUD seguem planos e minimalistas;
  - o mapa pode ter mais detalhe. De perto, a formiga aparece completa: pernas animadas, antenas, mandíbulas e o recurso carregado;
  - câmaras e solo também ganham ilustração;
  - de longe, a leitura exata não é exigida, basta uma ideia geral do sistema, guiada pela cor;
  - o estilo final do mundo vai sendo definido a partir do protótipo visual.
- **Alternativas:** manter tudo no estilo de diagrama (D34 original, formigas sem pernas).
- **Motivo:** pedido do usuário. As silhuetas aprovadas continuam sendo a base. O detalhe é somado por cima delas, no zoom perto.

### D61. Volta ao minimalismo; etapa própria de direção de arte
- **Status:** Decidida · **Data:** 2026-11-25 · **Substitui:** D60
- **Decisão:**
  - **Estilo:** o jogo volta ao estilo minimalista. As formigas não têm patas (D34 volta a valer).
  - **O que o usuário não aprovou no protótipo visual:**
    - estruturas simples e feias;
    - túneis todos retos;
    - azul repetido em vários elementos.
  - **Etapa (c2), direção de arte do mundo:** a aparência do mundo passa para essa etapa própria. Ela cobre formigas, câmaras, traçado dos túneis, solo e cores do mundo.
  - **O `03`** continua valendo para interface e UX.
  - **O protótipo visual** em `prototipo-visual/` fica só como rascunho de interação (zoom, painéis, toques), não como referência de estilo.
  - **Ordem das etapas (escolha do usuário):** (d) → (e) → (c2). A (c2) acontece depois da escolha da engine e pode correr em paralelo com o protótipo jogável, que usa arte provisória.
- **Motivo:** pedido do usuário. A engine muda o que é possível na arte (curvas, efeitos, desempenho), e nada na (d) e na (e) depende da arte final.

### D62. Ritmo de abertura da árvore: tudo aberto até a fase 9 ou 10 de cerca de 15
- **Status:** Provisória · **Data:** 2026-11-25 · **Etapa:** (d) · **Concilia:** D39 e D51
- **Decisão:**
  - **Fases 1 a 9 ou 10:** apresentam os galhos da árvore aos poucos, com mais de uma novidade por fase quando elas se explicam juntas (D51).
  - **Fases restantes:** são de domínio, e combinam galhos em vez de ensinar.
- **Alternativas:**
  - abertura linear até a fase 15, em que o N3 chega tarde demais;
  - abertura em 5 fases (D39 original), que atropela o entendimento.
- **Motivo:** a diversidade chega cedo, que é o ponto principal para o usuário, sem atropelar o entendimento.

### D63. Tutorial embutido nas fases
- **Status:** Provisória · **Data:** 2026-11-25 · **Etapa:** (d)
- **Decisão:**
  - **Fase 1:** não tem inimigos e tem objetivos curtos (ex.: "produza 10 fungos").
  - **Cartões de novidade:** cada novidade ganha um cartão quando aparece pela primeira vez (`03` §6.7).
  - **Dicas contextuais:** só aparecem quando o jogador trava, por exemplo com uma estrutura parada há 20 s, uma fila longa ou ninguém em Carregar.
  - **Sem passos obrigatórios.**
- **Alternativas:**
  - fase guiada com passos obrigatórios, que irrita o público de estratégia;
  - só cartões, que deixa o sistema de pedidos e as filas sem explicação.
- **Motivo:** o jogador aprende fazendo, no próprio ritmo.

### D64. Campanha linear com fases de desafio opcionais
- **Status:** Provisória · **Data:** 2026-11-25 · **Etapa:** (d)
- **Decisão:**
  - **Linha principal:** cerca de 15 fases em sequência, que ensinam tudo.
  - **Fases de desafio:** são opcionais, liberadas por estrelas, e têm regras especiais (ex.: "sem bolsões", "ataques pelos dois lados").
- **Alternativas:**
  - linear pura, em que travar numa fase trava tudo;
  - mapa com ramificações, em que o jogador pode pular o ensino de um galho e há quase o dobro de fases para desenhar.
- **Motivo:** a linha principal garante o ensino, e os desafios dão variedade e uma saída quando o jogador trava.

### D65. Linhagem da rainha: progressão persistente entre fases
- **Status:** Substituída por D67 (2026-11-25) · **Data:** 2026-11-25 · **Etapa:** (d)
- **Decisão:**
  - ao vencer, a colônia "funda" a próxima;
  - o jogador acumula bônus permanentes entre as fases da campanha;
  - a forma dos bônus (poder, troca ou vagas limitadas) será definida na 2ª rodada da etapa (d).
- **Alternativas:**
  - nenhuma progressão (cada fase do zero), que era a opção do Achikaps;
  - progressão leve, sem poder, com estrelas, enfeites e álbum. **Era a recomendação de Claude.**
- **Motivo:** escolha do usuário. Dá sensação de jornada e motivo para voltar.
- **Risco (registrado por Claude):**
  - cada fase passa a ser jogada com níveis de poder diferentes, o que dificulta o balanceamento;
  - bônus acumulados podem tornar as fases finais fáceis demais, ou exigir que quem não tem bônus "farme" fases antigas.
- **Mitigações propostas:**
  - **Limite de vagas:** os bônus ocupam um número limitado de vagas escolhidas antes de cada fase, e não se somam sem fim.
  - **Bônus de troca:** preferir bônus que trocam uma coisa por outra a bônus de poder puro.
  - **Balanceamento:** cada fase é balanceada para o número de vagas disponível naquele ponto da campanha.
  - Ver a 2ª rodada.

### D66. Variedade entre fases: mapas, regras especiais e desafios
- **Status:** Provisória · **Data:** 2026-11-25 · **Etapa:** (d) · **Detalha:** D39
- **Decisão:**
  - **Mapas desenhados à mão** com fontes, rochas e entradas de inimigos que favorecem galhos diferentes;
  - **regra especial** (ex.: "inverno longo", "sem argila", "rival só com blindados") em **parte** das fases, e não em todas;
  - **fases de desafio** da D64.
- **Alternativas:**
  - só mapas, que pode não bastar contra a construção que sempre funciona;
  - regra especial em toda fase, que vira truque.
- **Motivo:** evita a "colônia de sempre" sem soar artificial.

### D67. Campanha em arcos: a mesma colônia por várias fases, depois um novo ninho
- **Status:** Provisória (detalhes em D72 a D76) · **Data:** 2026-11-25 · **Etapa:** (d) · **Substitui:** D65 · **Atualiza:** D03, D31
- **Decisão (ideia do usuário):**
  - **Arcos:** a campanha é dividida em 3 arcos de cerca de 5 fases, cerca de 15 fases ao todo.
  - **Dentro de um arco:**
    - a **mesma colônia** continua de uma fase para a outra, crescendo e melhorando;
    - cada fase continua sendo 1 ano com 4 estações e ondas (D03).
  - **Fim do arco:**
    - a última fase termina com o **voo nupcial**;
    - as aladas fundam um **novo ninho**, onde começa o arco seguinte;
    - nesse momento o jogador **escolhe um benefício** (traço da linhagem) que vale dali em diante.
  - **Encaixe com a D62:**
    - o arco 1 ensina a base;
    - o arco 2 abre o resto da árvore até a fase 9 ou 10;
    - o arco 3 é de domínio.
- **Alternativas:**
  - bônus a cada fase (D65), difícil de balancear;
  - cada fase do zero, sem sensação de crescimento.
- **Motivo:**
  - sensação de colônia crescendo, com recomeço periódico que renova o desafio;
  - poucos benefícios na campanha (2 trocas de ninho), fáceis de balancear: o arco 2 com 1 traço, o arco 3 com 2;
  - muito temático: na natureza, as aladas fundam colônias novas.
- **Riscos:**
  - **Bola de neve:** quem termina uma fase mal começa a próxima mal e pode ficar preso num estado perdido. Mitigação em discussão: transição entre anos com piso e teto, e checkpoint no início de cada fase.
  - **O mapa precisa sustentar 5 anos de crescimento.**
  - **Perder uma colônia grande pode frustrar.** Mitigação proposta: a colônia final de cada arco fica salva e pode ser aberta no sandbox.
- **Em aberto:**
  - transição entre fases;
  - vitória das fases intermediárias;
  - mapa dentro do arco;
  - forma do benefício;
  - rival destruído dentro do arco.

### D68. Sandbox: tudo configurável, ondas crescentes e colônia para sempre
- **Status:** Provisória · **Data:** 2026-11-25 · **Etapa:** (d)
- **Decisão:**
  - **Configurável:** tudo liberado; dá para ajustar mapa, fontes, estações, frequência das ondas, traços dos inimigos e a opção "sem derrota".
  - **Ondas crescentes:** um modo de progressão em que as ondas aumentam cada vez mais.
  - **Colônia para sempre:** o jogador pode manter a mesma colônia indefinidamente.
  - **Proposta de Claude:** abrir no sandbox a colônia final de cada arco da campanha.
  - **Mapas sorteados:** ficam para depois do MVP, no modo "ano com variações sorteadas" (D03).
- **Motivo:** decisão do usuário. É o laboratório da árvore e o lugar de quem quer só construir.

### D69. Três níveis de dificuldade
- **Status:** Provisória · **Data:** 2026-11-25 · **Etapa:** (d)
- **Decisão:**
  - **Níveis:** Tranquilo, Normal e Difícil.
  - **O que muda:** a vida e a quantidade de inimigos e o tempo de aviso das ondas.
  - **O que não muda:** a economia.
- **Em aberto:** se o Difícil fica liberado desde o início ou só depois da campanha. A proposta de Claude é liberá-lo depois da campanha.
- **Motivo:** decisão do usuário. É barato de fazer (são multiplicadores) e alcança mais jogadores.

### D70. Estrelas: vitória e dois objetivos próprios da fase
- **Status:** Provisória · **Data:** 2026-11-25 · **Etapa:** (d) · **Resolve:** Q14
- **Decisão:**
  - **1 estrela:** por vencer.
  - **2ª e 3ª estrelas:** por objetivos escritos para cada fase (ex.: "não perca nenhuma câmara", "faça 2 expedições", "vença sem tanques").
- **Motivo:** empurra para estratégias diferentes e reforça a D66.

### D71. Destruir o rival não vence a fase, exceto nas fases de assalto
- **Status:** Provisória · **Data:** 2026-11-25 · **Etapa:** (d) · **Resolve:** Q12
- **Decisão:**
  - **Regra geral:** destruir o ninho rival acaba com as ondas laterais e dá um saque grande, mas a vitória continua sendo a da fase (D31 e D67).
  - **Fases de assalto:** algumas fases, principais ou de desafio, têm como objetivo destruir o rival.
- **Motivo:** os dois estilos existem sem competir na mesma fase.

### D72. Transição entre anos: inverno de transição com piso e teto, e checkpoint
- **Status:** Provisória · **Data:** 2026-11-25 · **Etapa:** (d) · **Detalha:** D67
- **Decisão:**
  - **O que continua de uma fase para a seguinte dentro do arco:** túneis, câmaras, upgrades e defesas.
  - **O que o inverno de transição ajusta:**
    - população e estoques ficam dentro de uma faixa definida pela fase, com piso e teto;
    - a rainha recupera a vida;
    - as estruturas danificadas são reparadas.
  - **Checkpoint:** "tentar de novo" volta ao começo da fase, e não ao começo do arco.
- **Alternativas:**
  - continuar tudo exatamente, o que traz a bola de neve inteira;
  - começar cada fase de um ponto fixo, o que perde a ideia do arco.
- **Motivo:** o jogador sente a colônia crescer e nunca começa num estado perdido.

### D73. Vitória das fases intermediárias: objetivo próprio; voo só no fim do arco
- **Status:** Provisória · **Data:** 2026-11-25 · **Etapa:** (d) · **Atualiza:** D31
- **Decisão:**
  - **Fases intermediárias:** cada uma tem um objetivo próprio (sobreviver ao ano mais uma meta que ensina a novidade da fase).
  - **Fim do arco:** o voo nupcial com X aladas vivas às 12:00 (D31) é obrigatório só na última fase do arco.
  - **Aladas em anos intermediários:** são opcionais e contam para melhorar as opções de traço (D75).
- **Alternativas:**
  - voo em toda fase, que daria 15 voos e tiraria o peso do voo final;
  - só sobreviver, que é fraco e não ensina.
- **Motivo:** o voo vira o grande final de cada arco, e os objetivos ensinam (D63).

### D74. Mapa grande por arco, que se abre por regiões
- **Status:** Provisória · **Data:** 2026-11-25 · **Etapa:** (d) · **Atualiza:** D32
- **Decisão:**
  - **Um mapa por arco,** grande (80 × 80 células, D94).
  - **Regiões:** o mapa é dividido em cerca de 5 regiões, e cada fase do arco libera uma nova, com fontes, profundidade ou um rival vizinho novo.
  - **Planejamento:** as regiões ainda fechadas aparecem escurecidas, com os ícones do que existe nelas, para o jogador planejar.
  - **Liberdade:** dentro das regiões abertas, o jogador escava e coloca o que quiser, onde quiser.
- **Alternativas:**
  - mapa inteiro aberto desde a fase 1, grande demais para o começo;
  - mapa do tamanho de uma fase, sem espaço para crescer.
- **Motivo:** escolha do usuário, que pediu o mapa bem grande para dar liberdade de escolha. As regiões trazem novidade a cada ano.
- **Risco:** com o zoom mínimo de 12 dp por célula (D55), um mapa de 40 × 80 não cabe na tela, Resolvido pela visão geral (D92) e pelas setas na borda (D93).

### D75. Benefício do novo ninho: escolher 1 entre 3 traços
- **Status:** Provisória · **Data:** 2026-11-25 · **Etapa:** (d) · **Detalha:** D67
- **Decisão:**
  - no voo do fim do arco, o jogador escolhe **1 entre 3 traços** da linhagem;
  - o total de aladas que voaram no arco, contando o voo final e os anos intermediários, melhora as opções: acima de certos limites, aparecem traços raros;
  - os traços comuns são de troca (ganha uma coisa, perde outra); os raros são mais fortes;
  - a lista de traços está no `04` §5.
- **Alternativas:**
  - escolha livre numa lista, em que todos escolhem o mesmo traço;
  - benefício fixo, sem escolha.
- **Motivo:** dá motivo para caprichar no voo, e a escolha é rápida.

### D76. Rival destruído é substituído por outra colônia no ano seguinte
- **Status:** Provisória · **Data:** 2026-11-25 · **Etapa:** (d) · **Detalha:** D71
- **Decisão:**
  - destruir o ninho rival dá o saque e o resto daquele ano sem ondas laterais;
  - no ano seguinte, outra colônia ocupa o território, possivelmente com outro traço de inimigo.
- **Alternativas:**
  - o rival volta reconstruído, e a vitória perde valor;
  - o rival fica destruído até o fim do arco, e as fases seguintes ficam fáceis demais.
- **Motivo:** a vitória vale e o desafio se renova.

### D77. Lançamento com o conteúdo completo
- **Status:** Decidida · **Data:** 2026-11-25 · **Etapa:** (e) · **Substitui:** D49
- **Decisão:** o lançamento traz:
  - os 3 arcos;
  - os 17 recursos, incluindo o N3 (gosma e feromônio);
  - as 10 castas e todas as estruturas;
  - as 8 fases de desafio;
  - o sandbox.
- **Alternativas:**
  - sem o N3, com o arco 2 reorganizado;
  - arcos 1 e 2 no lançamento e o arco 3 numa atualização.
- **Motivo:** qualidade acima de prazo (D50). O arco 2 depende do N3 (`04` §2.2).
- **Alternativa guardada:** se um dia for preciso lançar antes, o melhor corte é deixar o arco 3 para uma atualização, e não tirar o N3.

### D78. Protótipo 1: o núcleo de logística é divertido por 15 minutos?
- **Status:** Provisória · **Data:** 2026-11-25 · **Etapa:** (e)
- **Decisão:**
  - **Escopo do primeiro protótipo jogável:**
    - 1 mapa;
    - folha → fungo → operária;
    - os papéis Carregar, Escavar, Cuidar e Guardar;
    - túneis com fila, sentido e níveis;
    - 1 ameaça (enxame).
  - Os critérios de sucesso e fracasso ficam no `05` §5 (portão em D85, métricas em D86).
  - **Depois dele:**
    - protótipo 2: árvore e combate com castas;
    - protótipo 3: arco 1 completo.
- **Alternativas:** começar pela árvore; começar por uma fatia vertical das fases F1 e F2.
- **Motivo:** se o núcleo não for divertido, nada mais salva o jogo.

### D79. Testes: usuário e Claude nos protótipos; teste fechado da Play Store antes do lançamento
- **Status:** Provisória · **Data:** 2026-11-25 · **Etapa:** (e)
- **Decisão:**
  - **Protótipos:** quem testa são o usuário e Claude.
  - **Antes do lançamento:** com o jogo pronto, ele vai para o teste fechado da Play Store.
- **Alternativas:**
  - de 5 a 8 pessoas de fora a cada protótipo, com roteiro e observação. **Era a recomendação de Claude;**
  - teste aberto cedo.
- **Motivo:** escolha do usuário.
- **Risco (registrado por Claude):**
  - quem desenhou o jogo não trava onde um jogador novo trava;
  - problemas de entendimento (tutorial, leitura da tela) podem aparecer só no teste fechado, quando é mais caro mudar.
- **Mitigação sugerida:**
  - medir dentro do jogo desde o protótipo 1 (ex.: tempo até a primeira operária, filas, mortes por fome);
  - se possível, uma sessão informal com 2 ou 3 pessoas antes do teste fechado.

### D80. Celulares de teste
- **Status:** Provisória · **Data:** 2026-11-25 · **Etapa:** (e) · **Resolve:** Q24
- **Decisão:**
  - **Critério de aprovação de desempenho:** um Android de entrada de cerca de 3 anos atrás, com 3 a 4 GB de RAM. O modelo exato ainda vai ser escolhido.
  - **Testes do dia a dia:** um Redmi Note 14, celular do usuário.
- **Motivo:** se roda num aparelho de entrada, roda em quase todos. O celular do usuário é prático, mas pode esconder problemas de desempenho.

### D81. Tecnologia: TypeScript + PixiJS + Capacitor, com teste de desempenho como portão
- **Status:** Decidida · **Data:** 2026-11-25 · **Etapa:** (e) · **Resolve:** Q11
- **Decisão:**
  - **Pilha:**
    - o jogo é escrito em **TypeScript**;
    - o **Vite** gera a versão web;
    - o **PixiJS** desenha o mapa e as formigas (WebGL);
    - **HTML e CSS** fazem os menus, painéis e HUD;
    - o **Capacitor** empacota tudo como app Android (APK para testes, AAB para a Play Store).
  - **Mapas:** desenhados no Tiled (exporta JSON).
  - **Dados:** a árvore de criação fica em planilha e é exportada para JSON (D45).
  - **Simulação separada do desenho:**
    - a simulação fica em TypeScript puro, sem depender de PixiJS nem do navegador;
    - ela é testada com testes automáticos;
    - isso também facilita trocar de engine, se for preciso.
- **Portão de desempenho (primeira tarefa do protótipo 1):** 300 formigas andando em túneis com filas.
  - **Critério:** 60 quadros por segundo no Redmi Note 14 e pelo menos 30 no celular de entrada (D80).
  - **Se falhar:** troca para Godot 4. A simulação e os dados são aproveitados.
- **Alternativas:**
  - Godot 4: desempenho nativo e editor visual, mas Claude não vê o editor e o ciclo de teste passa pelo usuário;
  - Unity: pesado para um jogo minimalista.
- **Motivo:**
  - o usuário nunca fez jogos, e Claude vai escrever boa parte do código;
  - na web, Claude roda, joga e corrige o jogo sozinho no navegador, o que acelera muito e melhora a qualidade;
  - o jogo é quase todo simulação e painéis, e painéis são o ponto forte de HTML e CSS.
- **Risco:** o desempenho do navegador interno do Android em celulares fracos. Por isso o portão vem primeiro.

### D82. Monetização híbrida: compra única ou anúncios opcionais, sem energia
- **Status:** Decidida · **Data:** 2026-11-25 · **Etapa:** (e) · **Substitui:** D05 · **Atualiza:** Q10
- **Decisão:**
  - **Arco 1 grátis** (F1 a F5), sem anúncio nenhum.
  - **Arcos 2 e 3, desafios e sandbox** podem ser liberados de duas formas:
    - **compra única**, que libera tudo de uma vez;
    - **por fase, com 2 anúncios premiados**. A fase fica liberada para sempre. Desafios e sandbox só pela compra (proposta).
  - **Anúncio opcional extra:** sortear de novo os 3 traços, uma vez por voo nupcial. Quem comprou ganha esse sorteio sem anúncio.
  - **Nunca:** anúncio intersticial (o que interrompe o jogo), energia ou limite diário, moedas, pay-to-win.
  - **Preço (proposta, ainda a calibrar):** preço regional. Brasil por volta de **R$ 9,90**, com promoção de lançamento; fora do Brasil por volta de **US$ 2,99 a 3,99**.
- **Alternativas:**
  - só compra única (D05): mais simples, mas quem não pode pagar para no arco 1;
  - energia recarregada com anúncio: dá mais receita por jogador, mas pune quem gosta do jogo e briga com o tom (rejeitada);
  - jogo pago na loja: alcance muito baixo para um desenvolvedor desconhecido.
- **Motivo:**
  - o anúncio vira uma porta de acesso para quem não pode pagar, não uma punição;
  - no Brasil o preço pesa, e a rota por anúncios reduz esse peso;
  - a compra continua sendo a forma principal de receita (estimativa em `05` §9.3).
- **Custo:** AdMob (plugin do Capacitor mantido pela comunidade), tela de consentimento (LGPD/GDPR), formulário de Segurança dos Dados da Play Store. Estimativa de +1 a 2 semanas de trabalho.
- **Riscos:**
  - os anúncios rendem pouco no Brasil (o valor por 1.000 vídeos é baixo) e podem tirar algumas compras;
  - plugin de comunidade pode quebrar com versões novas do Capacitor.

### D83. Versão para PC na Steam depois do lançamento no Android
- **Status:** Decidida · **Data:** 2026-11-25 · **Etapa:** (e)
- **Decisão:**
  - quando o jogo estiver pronto e estável no celular, ele é adaptado e vendido na Steam;
  - **modelo proposto:** jogo pago, sem anúncios, com conquistas e save na nuvem;
  - **preparar desde já**, sem custo extra relevante:
    - interface responsiva (retrato no celular, paisagem no PC);
    - entrada por ações (toque, mouse e teclado geram os mesmos comandos);
    - camada de plataforma (save, compras, anúncios, conquistas).
- **Alternativas:** Steam ao mesmo tempo que o Android (divide o foco antes do núcleo estar provado); só Android.
- **Motivo:** decisão do usuário. Estratégia e simulação vendem bem no PC, e o TypeScript facilita a porta.
- **Custo:** US$ 100 por jogo (Steam Direct). Paisagem e mouse estimados em algumas semanas na hora da porta. Detalhes no `05` §9.1.
- **Em aberto:** Electron ou Tauri (Q29).

### D84. China: exploração futura pela Steam, não pelo celular
- **Status:** Provisória · **Data:** 2026-11-25 · **Etapa:** (e)
- **Decisão:**
  - o caminho realista é a **Steam com tradução para chinês simplificado**;
  - a China pelo celular fica fora por enquanto.
- **Motivo:**
  - a Google Play não funciona na China;
  - jogos com compra no celular precisam de licença do governo (ISBN), pedida por uma publicadora chinesa, num processo de cerca de 1 ano e com vagas limitadas;
  - na Steam, o chinês simplificado já é o idioma principal de cerca de um terço dos usuários (dado da Valve, GDC 2025).
- **Preparar desde já:**
  - textos fora do código;
  - nada de texto dentro de imagens;
  - fonte de reserva com caracteres chineses.
- **Em aberto:** Q30.

### D85. Portão de desempenho: critérios e uma rodada de otimização antes de trocar de engine
- **Status:** Decidida · **Data:** 2026-11-25 · **Etapa:** (e) · **Refina:** D81
- **Decisão:**
  - **Cena de estresse:** 300 formigas, cerca de 60 segmentos com filas, zoom mínimo, 20 minutos seguidos.
  - **Redmi Note 14:** média de 60 fps, 1% mais lento ≥ 45 fps.
  - **Celular de entrada:** média ≥ 30 fps, tick da simulação ≤ 8 ms.
  - **Se falhar:** até 1 semana de otimização antes de trocar para Godot 4.
- **Motivo:** muitas falhas de desempenho na web têm solução barata (desenho em lote, menos detalhe, Web Worker). Trocar de engine é caro.

### D86. Métricas locais e bots de teste desde o protótipo 1
- **Status:** Decidida · **Data:** 2026-11-25 · **Etapa:** (e) · **Atende:** risco da D79
- **Decisão:**
  - a simulação é **determinística** (mesma semente e mesmas ações dão o mesmo resultado);
  - o jogo grava métricas num arquivo local exportável, sem servidor e sem SDK de terceiros nos protótipos;
  - Claude usa **bots sem tela** para testar regras e procurar estratégias dominantes.
- **Motivo:** compensa em parte o fato de só o usuário e Claude testarem os protótipos (D79).
- **Em aberto:** métricas anônimas no lançamento (Q33).

### D87. Túneis em curvas bem suaves
- **Status:** Provisória · **Data:** 2026-11-25 · **Etapa:** (c2) · **Resolve:** Q25
- **Decisão:**
  - cada segmento é desenhado como uma curva leve entre dois nós;
  - a curvatura é pequena (proposta: desvio de 5% a 9% do comprimento) e o lado é sorteado;
  - a lógica continua igual: segmentos de até 3 células, nós, capacidade, fila e sentido (D52);
  - a largura continua sendo o sinal do nível (D53), por isso as bordas são lisas.
- **Alternativas:**
  - retos, que o usuário achou esquisitos;
  - orgânicos com bordas irregulares, que atrapalhariam a leitura do nível pela largura.
- **Motivo:** escolha do usuário. Tira a rigidez sem perder a leitura.

### D88. Câmaras em bolha, cada uma com forma própria
- **Status:** ~~Provisória~~ **Substituída pela D101** em 2026-11-26 (a variação própria por semente continua, só no teto) · **Data:** 2026-11-25 · **Etapa:** (c2) · **Substitui:** o formato de `03` §3.3
- **Decisão:**
  - a câmara é uma oval deformada por uma variação suave, gerada a partir de uma semente própria. Cada câmara fica diferente, e a mesma câmara fica sempre igual;
  - a variação é limitada (proposta: até cerca de 15% do raio), para garantir uma área central livre para o ícone, o anel de progresso e as vagas de cuidadoras;
  - o túnel abre a borda onde entra.
- **Alternativas:** retângulo arredondado (antes); oval regular.
- **Motivo:** escolha do usuário. Dá cara de formigueiro.
- **Risco:** encaixar os indicadores da câmara. Mitigação: a área central segura.

### D89. Solo com faixas suaves, pedrinhas e raízes
- **Status:** Provisória · **Data:** 2026-11-25 · **Etapa:** (c2)
- **Decisão:**
  - o solo escurece com a profundidade numa **transição contínua**, sem degraus visíveis entre as faixas. É uma exceção à regra "plano, sem degradê" (`03` §1), pedida pelo usuário depois de ver as faixas em degraus no protótipo;
  - pedrinhas pequenas e raízes finas, sempre com pouco contraste;
  - as raízes ficam perto da superfície;
  - a cor de cada arco pode mudar o tom das faixas (bioma).
- **Regra:** a decoração nunca pode ser clara ou do tamanho de uma formiga ou de um recurso (regra 3 do `03` §1).
- **Motivo:** escolha do usuário. Dá noção de profundidade num mapa grande e dá vida ao fundo.

### D90. Formiga em elipses com cintura e antenas no zoom perto
- **Status:** Provisória · **Data:** 2026-11-25 · **Etapa:** (c2) · **Refina:** D34 · **Revista em parte por D109** (sem antenas; carrega pela boca)
- **Decisão:**
  - **corpo:** abdômen e cabeça em elipse, com um ponto fino entre o abdômen e o tórax (a "cintura");
  - **sem patas**;
  - **antenas:** dois traços curtos, que só aparecem no zoom perto;
  - **zoom longe:** a formiga vira um ponto;
  - as castas continuam se diferenciando pela proporção e por um detalhe (`03` §3.5, a ser reajustado no `08`).
- **Alternativas:** 3 círculos (D34); elipses sem antenas.
- **Motivo:** escolha do usuário. Lê como formiga sem precisar de patas.

### D91. Túnel mais claro e trânsito mostrado por pulso na borda
- **Status:** Provisória · **Data:** 2026-11-25 · **Etapa:** (c2) · **Resolve:** Q26 · **Substitui:** a linha central colorida da D53 e do `03` §3.2
- **Decisão:**
  - **Destaque:** o interior dos túneis, nós e câmaras fica bem mais claro que o solo (proposta: `#43362B`, no lugar do Escavado `#2B231D`), sem borda;
  - **Túnel livre:** sem cor nenhuma;
  - **Quase cheio:** aparece uma borda que pulsa devagar (cerca de 0,5 Hz) em **amarelo suave**;
  - **Cheio:** a borda pulsa uma vez por segundo em **vermelho suave**;
  - **Fila e lentidão:** continuam valendo como sinal principal, sem cor (formigas coladas e fila fora da boca do túnel);
  - **Força do pulso:** 40% (escolha do usuário em 2026-11-25). O quase cheio também pulsa.
- **Alternativas testadas no protótipo:**
  - parede acesa sem cor;
  - medidor de barrinhas;
  - listras;
  - pulso no interior;
  - túnel com borda fixa.
- **Motivo:** escolha do usuário. O túnel livre fica calmo, e a cor só aparece quando há problema. Com isso, o azul repetido some (o azul fica só nas defesas).
- **Regra "cor nunca sozinha" (D54) continua atendida:** o estado também aparece pela fila, pelo ritmo do pulso (lento ou rápido) e pela borda, que só existe quando há problema.
- **Protótipo:** `prototipo-arte/c2-transito.html` (v3).

### D92. Zoom mínimo mostra o mapa inteiro (visão geral)
- **Status:** Provisória · **Data:** 2026-11-25 · **Etapa:** (c2) · **Resolve:** Q27 (com a D93) · **Atualiza:** D55
- **Decisão:**
  - a pinça continua dando e tirando zoom (D57);
  - **afastando ao máximo, o mapa inteiro do arco cabe na tela.** O limite não é mais fixo em 12 dp por célula; ele é calculado para cada mapa.
    - Exemplo: um mapa de 80 × 80 (D94) numa área útil de cerca de 360 × 600 dp dá cerca de **4,5 dp por célula**, limitado pela largura.
  - as regiões ainda fechadas aparecem escurecidas, com os ícones do que existe nelas (D74);
  - **novo nível de detalhe, "visão geral"**, abaixo de 12 dp por célula:
    - formigas não aparecem (o desenho fica leve, e o movimento não é legível nesse tamanho);
    - túneis como linhas na cor do interior, com pelo menos 3 dp de largura na tela;
    - câmaras como formas cheias, com a borda na cor da categoria;
    - o pulso na borda dos túneis (D91) continua, mais grosso;
    - alertas com 24 dp na tela, como em qualquer zoom (D55).
  - **toque duplo** na visão geral aproxima direto para o zoom médio no ponto tocado.
- **Alternativas:**
  - minimapa fixo no canto: ocupa espaço numa tela pequena e fica pequeno demais para ler;
  - manter o limite de 12 dp: menos da metade do mapa cabe na tela.
- **Motivo:** escolha do usuário. Planejar a rede inteira sem botão novo, usando o mesmo gesto de pinça.
- **Testar no protótipo:** se 7 a 8 dp por célula ainda permitem ler a rede no Redmi e no celular de entrada. Protótipo: `prototipo-arte/c2-visao-geral.html` (mapa 40 × 80, os 4 níveis de detalhe e as setas da D93).

### D93. Setas na borda da tela para problemas fora da vista
- **Status:** Provisória · **Data:** 2026-11-25 · **Etapa:** (c2) · **Resolve:** Q27 (com a D92) · **Detalha:** `03` §9
- **Decisão:**
  - quando um problema está fora da tela, aparece uma **seta na beirada**, apontando na direção dele;
  - **dentro da seta:** o ícone do tipo de problema (inimigo, onda, túnel cheio, fome, rainha);
  - **cor pela gravidade:** vermelho de perigo para inimigo, onda e rainha; amarelo para túnel cheio e outros gargalos. O ícone repete a informação, então a cor nunca está sozinha (D54);
  - **toque na seta:** a câmera desliza até o problema;
  - **limite:** no máximo 4 setas por vez. Problemas na mesma direção viram uma seta com número;
  - na visão geral (D92) as setas somem, porque tudo já está na tela.
- **Alternativas:** só alertas no topo; nenhuma indicação fora da tela.
- **Motivo:** escolha do usuário. O mapa grande não pode esconder problemas.

### D94. Mapa do arco com 80 × 80 células
- **Status:** Provisória · **Data:** 2026-11-25 · **Etapa:** (c2) · **Atualiza:** D74, D92
- **Decisão:**
  - o mapa de cada arco passa a ter cerca de **80 × 80 células**, o dobro da largura anterior (40 × 80);
  - a visão geral (D92) mostra o mapa inteiro a cerca de **4,5 dp por célula**. Nesse zoom ela é um "mapa esquemático": serve para ver a rede, os pulsos e os problemas, e para escolher aonde ir; para construir, o jogador aproxima.
- **Alternativas:**
  - 60 × 80 (cerca de 6 dp por célula na visão geral);
  - 100 × 100 (cerca de 3,6 dp por célula, com os túneis virando fios).
- **Motivo:** o usuário quer muito espaço lateral, com percalços que obriguem a montar rotas diferentes.
- **Risco:** a leitura da visão geral a 4,5 dp por célula. Testar no Redmi e no celular de entrada.

### D95. O mapa se abre do centro para os lados
- **Status:** Provisória · **Data:** 2026-11-25 · **Etapa:** (c2) · **Detalha:** D74
- **Decisão:**
  - **fase 1 do arco:** começa numa faixa central;
  - **cada ano seguinte:** abre uma região à esquerda ou à direita, e depois as regiões fundas, com recursos e percalços novos;
  - **proposta de 5 regiões:**
    - centro superior;
    - lado esquerdo superior;
    - lado direito superior;
    - centro fundo;
    - lados fundos.
  - A ordem dos lados pode mudar de arco para arco.
- **Alternativas:** abrir de cima para baixo; tudo aberto desde o começo.
- **Motivo:** escolha do usuário. Força a rede a crescer para os lados.

### D96. Percalços do terreno
- **Status:** Provisória · **Data:** 2026-11-25 · **Etapa:** (c2) · **Resolve:** Q09 (a água traz um evento ambiental para o lançamento)
- **Decisão:** 5 percalços, cada um criando uma decisão de rota diferente. Os números são hipóteses a calibrar.

| Percalço | Regra | Decisão que cria |
|---|---|---|
| **Rocha** | Não pode ser escavada | Desviar |
| **Argila dura** | Escavar custa 3 vezes mais pontos e tempo, mas rende o dobro de argila (D41) | Rota curta e cara, ou longa e barata |
| **Areia solta** | Túnel em areia não passa do nível 2. Para chegar ao 3 ou 4, cada célula precisa de reforço com barro. Estruturas não podem ficar em areia sem reforço | Gargalo de capacidade: uma rota só não dá conta |
| **Água** | Bolsões fixos. Na primavera, túneis e câmaras a até 2 células de um bolsão alagam: ficam fechados até o verão, e as formigas lá dentro saem. Um aviso aparece no inverno. Contra-ataque proposto: **dique de barro**, que protege uma célula (se confirmado, vira a 27ª estrutura no `07`) | Ter rota reserva, ou investir em diques |
| **Toca de predador** | Uma aranha mora ali. Formigas que passam a até 4 células podem ser atacadas. A toca pode ser destruída em combate e rende presa | Rota rápida e perigosa, rota segura e longa, ou limpar a toca |

- **Alternativas também consideradas:** raízes grossas e cavernas naturais. Ficaram de fora por escolha do usuário; as raízes continuam só como decoração (D89).
- **Motivo:** o sistema de capacidade dos túneis (D52) fica muito mais interessante quando o terreno obriga a dividir o fluxo.
- **Cor da água:** a definir na (c2). Precisa se distinguir da cor de defesa e não trazer de volta o "azul em tudo".

### D97. Cada arco enfatiza alguns percalços
- **Status:** Provisória · **Data:** 2026-11-25 · **Etapa:** (c2)
- **Decisão:**
  - a **rocha** aparece em todos os arcos;
  - **arco 1, solo de floresta:** toca de predador, que entra na F4 junto com a aranha;
  - **arco 2, barranco de argila:** argila dura (F6) e água (F8);
  - **arco 3, campo aberto:** areia solta (F11), com tocas de predador. Água é rara (a F12 é um ano seco);
  - os percalços são apresentados aos poucos, como as outras novidades (D51), com cartão de tutorial (D63).
- **Alternativa:** todos os percalços em todos os arcos.
- **Motivo:** escolha do usuário. Cada arco ganha um jeito próprio de montar rotas.

### D98. Percalços visíveis só perto da colônia
- **Status:** Provisória · **Data:** 2026-11-25 · **Etapa:** (c2) · **Atualiza:** D74
- **Decisão:**
  - **perto da colônia:** o terreno aparece por completo até cerca de **3 células** de qualquer túnel, nó ou câmara;
  - **mais longe:** um percalço aparece só como uma marca vaga de "algo aqui" (?). Escavar até lá revela o que é;
  - **sempre visíveis, mesmo longe:** fontes de recurso, plantas e ninhos rivais, que o jogador precisa para planejar (D74);
  - **regiões fechadas:** seguem a mesma regra.
- **Alternativas:** tudo visível sempre; percalço só aparece ao bater nele.
- **Motivo:** escolha do usuário. Dá surpresa sem ser injusto: uma rota já construída nunca é destruída por algo que estava escondido.

### D99. Túneis, câmaras e formigas menores
- **Status:** Provisória · **Data:** 2026-11-26 · **Etapa:** (c2) · **Atualiza:** `03` §3.2 (largura dos túneis) e D88 (tamanho das câmaras)
- **Decisão:**
  - **túnel:** largura por nível de 0,25, 0,33, 0,42 e 0,5 célula, ou seja, **6, 8, 10 e 12 dp** no zoom inicial de 24 dp (antes 6, 9, 12 e 15 dp). O protótipo testou os níveis 1 e 2;
  - a **espessura mínima na tela** continua (2 dp nos zooms perto e médio, 2,5 dp no longe, 3 dp na visão geral), para o túnel não sumir de longe;
  - **câmara:** o desenho fica com cerca de **60%** do tamanho do protótipo anterior, de 2,5 a 4 células de largura e de 1,3 a 2 de altura. A câmara real é a maior. Ao encolher, a borda virada para o túnel fica no mesmo lugar;
  - **formiga:** **80%** do tamanho anterior, com corpo de cerca de 0,29 célula (cerca de 7 dp no zoom inicial). Na mão dupla, as duas faixas ficam a 20% da largura do túnel, a partir do centro.
- **Alternativas:**
  - tamanho antigo: túneis de 9 e 12 dp nos níveis 1 e 2, câmaras de 4 a 6 células;
  - mínimo: túneis de 4 e 6 dp, câmaras a 45%, formigas a 65%.
- **Motivo:** escolha do usuário depois de comparar os três tamanhos no protótipo. A rede ficava pesada e tomava muito espaço do mapa 80 × 80.
- **Conflito resolvido pela D105:** o desenho da câmara era maior que a 1 célula que ela ocupava na mecânica (`02` §1). Agora cada estrutura ocupa de 2 × 1 a 3 × 2 células, e o desenho cabe nelas. O tamanho das câmaras desta decisão vale só para o protótipo de 2026-11-26.
- **Risco:** com 2 dp de diferença entre um nível e o próximo, pode ficar difícil ler o nível pela largura, e a largura muda o combate (D53). Verificar com os 4 níveis lado a lado no protótipo 1. Se não der para ler, reforçar com um detalhe, como uma borda dupla no nível 4.

### D100. Bonito e bem feito acima do minimalismo
- **Status:** Decidida · **Data:** 2026-11-26 · **Etapa:** (c2) · **Atualiza:** D61 e `03` §1
- **Decisão:**
  - o objetivo da arte é um jogo **bonito e bem feito**. O minimalismo do Achikaps é uma referência de partida, não uma regra a seguir 100%;
  - as regras 1 e 5 do `03` §1 (plano, sem textura; menos movimento que informação) viram **guias**. Elas cedem quando um detalhe deixa o jogo mais bonito sem atrapalhar a leitura, como o solo em transição contínua (D89);
  - continuam como **regras firmes**, porque protegem a leitura:
    - forma antes de cor (regra 2);
    - o fundo some e o fluxo aparece (regra 3);
    - vermelho só para perigo (regra 4);
  - o que já foi testado e rejeitado continua como referência: formigas com patas e mundo ilustrado (D61), túneis retos e azul repetido (D91).
- **Motivo:** esclarecimento do usuário em 2026-11-26.

### D101. Câmara em cúpula de chão plano
- **Status:** Provisória · **Data:** 2026-11-26 · **Etapa:** (c2) · **Resolve:** Q34 (junto com D102 a D105) · **Substitui:** D88
- **Decisão:**
  - **forma:** teto arredondado e chão reto, sempre na horizontal, com o chão para baixo;
  - **entrada:** o túnel entra pela lateral ou pelo teto, nunca pelo chão;
  - **variação:** cada câmara tem uma leve variação própria no teto, de no máximo 10% da altura, gerada por semente (como na D88). Assim duas câmaras iguais não ficam idênticas;
  - **proporção:** a categoria pode mudar a proporção. Câmaras de base são mais altas e as de defesa, mais baixas.
- **Alternativas:** bolha (D88); forma por categoria; hexágono regular.
- **Motivo:** escolha do usuário. Tem cara de câmara de formigueiro, e o chão dá lugar ao conteúdo (D102).

### D102. Conteúdo real dentro da câmara
- **Status:** Provisória · **Data:** 2026-11-26 · **Etapa:** (c2) · **Substitui:** o ícone central do `03` §3.3
- **Decisão:**
  - **produção:**
    - os **ingredientes** ficam empilhados no chão, no lado por onde chegam, com a forma de cada recurso (D48);
    - as **cuidadoras** ficam visíveis no meio, com um movimento curto de trabalho enquanto a receita roda;
    - o **produto pronto** fica empilhado no outro canto, esperando a carregadora;
    - um **ícone pequeno do produto** aparece no teto só quando a câmara está vazia, para dizer o que ela faz;
  - **base:**
    - câmara real: a rainha (formiga grande) e os ovos saindo;
    - berçário: as larvas;
    - depósito: pilhas por família;
    - câmara nupcial: as aladas esperando;
    - lixeira: um monte de refugo;
  - **limite das pilhas:** até 5 itens por pilha. Acima disso a pilha para de crescer, e o número aparece no zoom perto;
  - **entrada e saída das carregadoras** (acrescentado em 2026-11-26, a pedido do usuário):
    - a formiga **nunca some**: ela entra pela porta, anda pelo chão até a pilha de ingredientes, deixa o item (a pilha cresce na hora) e sai pela mesma porta;
    - quem busca o produto anda até a pilha do outro canto, pega um item e sai carregando;
    - pela porta do teto, a formiga desce andando pelo teto e pela parede até o chão;
    - nos nós, ela só passa de um túnel para o outro;
  - **por zoom:**
    - perto e médio mostram tudo;
    - longe mostra as pilhas como pontos coloridos;
    - visão geral mostra só a forma tingida (D103).
- **Alternativas:** ícone no centro (antes); tudo só no toque, num painel.
- **Motivo:** escolha do usuário. Segue a regra "o fluxo aparece" e mostra o que falta sem precisar ler número.
- **Risco:** muita coisa num espaço de 3 × 1 células. Mitigação: o limite das pilhas e os níveis de zoom.

### D103. Câmara tingida pela família, sem borda
- **Status:** Provisória · **Data:** 2026-11-26 · **Etapa:** (c2) · **Substitui:** a borda de 2 dp na cor da categoria do `03` §3.3
- **Decisão:**
  - **interior:** a cor dos túneis (`#43362B`, D91) misturada com 10 a 15% da cor da família do produto. Defesa usa a cor Defesa, ataque usa a cor Ataque, e a base fica sem tinta;
  - **combinados (N2 e N3):** a tinta segue as metades do produto (D48), com divisão vertical;
  - **sem borda:** a borda fica reservada aos alertas, com o mesmo pulso dos túneis (D91):
    - amarelo suave para atenção (falta ingrediente, falta cuidadora, saída cheia);
    - vermelho suave para sob ataque;
  - **nível 2:** no lugar da borda dupla, o chão ganha uma faixa mais clara de piso reforçado (proposta, a confirmar no protótipo).
- **Alternativas:** borda colorida (antes); só o chão colorido; sem cor.
- **Motivo:** escolha do usuário. Fica coerente com os túneis, e um único sinal de alerta vale para túnel e câmara.

### D104. Indicadores dentro da cena
- **Status:** Provisória · **Data:** 2026-11-26 · **Etapa:** (c2) · **Substitui:** a tabela de estados da estrutura do `03` §3.3
- **Decisão:**

  | Estado | Sinal |
  |---|---|
  | Produzindo | Linha fina no chão que enche da esquerda para a direita durante a receita, na cor do produto; cuidadoras trabalhando |
  | Falta ingrediente | Selo pequeno acima da câmara com a forma do ingrediente que falta, em cinza, e pulso amarelo na borda |
  | Falta cuidadora | A vaga vazia aparece como silhueta tracejada de formiga, no lugar onde ela ficaria, e pulso amarelo na borda |
  | Saída cheia | A pilha de produto chega ao máximo e a borda pulsa em amarelo |
  | Pausada pelo jogador | Interior 50% mais escuro e ícone ‖ no teto |
  | Sob ataque | Pulso vermelho na borda e barra de vida acima da câmara |

  - **números** (estoque, vagas, tempo) aparecem só no zoom perto. O resto fica no painel, ao tocar na câmara;
  - os **alertas** continuam com 24 dp fixos na tela em qualquer zoom (`03` §3.1).
- **Alternativas:** anel de progresso, pontos de vagas e ingredientes em cima (antes); só os problemas na tela.
- **Motivo:** escolha do usuário. Os sinais fazem parte da cena em vez de ficarem por cima dela.

### D105. Tamanho das estruturas por tipo
- **Status:** Provisória · **Data:** 2026-11-26 · **Etapa:** (c2) · **Resolve:** o conflito da D99 · **Atualiza:** `02` §1 e §4.2, `07` §3
- **Decisão:**
  - **pequena, 2 × 1 células:** as extratoras e as estruturas de defesa e ataque com lugar fixo (posto de guarda, torre ácida, armadilha de cola, mina de gosma e posto de guerra);
  - **média, 3 × 1 células:** as 11 estruturas de produção e a lixeira;
  - **grande, 3 × 2 células:** câmara real, berçário, depósito e câmara nupcial;
  - a barricada e a galeria de assalto continuam dentro do túnel, sem câmara própria;
  - o **desenho ocupa exatamente as células** da estrutura: a cúpula (D101) fica dentro do retângulo. Isso resolve o conflito da D99;
  - todas ficam na horizontal e não giram;
  - **custo de escavação** (hipótese a calibrar): 12 pt + 4 pt por célula. A média custa **24 pt** e a grande, **36 pt** (antes, 20 pt para qualquer câmara). As pequenas mantêm o custo atual: extratoras 15 pt e defesa de 10 a 15 pt mais recursos.
- **Alternativas:** tudo com 1 célula e o desenho encolhido; todas com 3 × 1.
- **Motivo:** escolha do usuário. O espaço vira decisão, e os percalços (D96) pesam ainda mais na hora de montar as rotas.
- **Risco:** a câmara grande mais cara pode deixar o começo lento. Calibrar junto com o custo da câmara, que já era a primeira variável a ajustar (`02` §4.2).

### D106. Visual completo e aprovado antes do código; revisão geral no fim
- **Status:** Decidida · **Data:** 2026-11-26 · **Etapa:** (c2) · **Substitui:** a parte da D61 que deixava a (c2) correr em paralelo ao protótipo · **Atualiza:** `05` §8 e `00` §7
- **Decisão:**
  - o código só começa depois de **todo o visual pronto e aprovado**;
  - a etapa (c2) entrega três peças:
    - o `08-direcao-de-arte.md`;
    - um **catálogo visual**: uma página com todas as cores, recursos, castas, inimigos, estruturas, túneis, percalços, ícones e componentes de interface;
    - um **app de exemplo** navegável, que mostra como vai ser o jogo final;
  - **revisão geral:** quando o design estiver perto do final, todas as decisões são revistas para melhorar ainda mais. Até lá, elas valem como estão, sem buscar a perfeição em cada uma.
- **Motivo:** pedido do usuário.
- **Risco:** o portão de desempenho agora vem depois do visual. Se a arte aprovada pesar demais no celular de entrada, ela volta para ajuste.
- **Mitigação:** o catálogo e o app de exemplo usam o mesmo tipo de desenho da engine (formas vetoriais desenhadas em tempo real), e o portão de desempenho mede exatamente a arte aprovada.

### D107. Zoom em dois modos: acompanhar de perto, decidir de longe
- **Status:** Decidida · **Data:** 2026-11-26 · **Etapa:** (c2) · **Refina:** D55 e D92
- **Decisão:**
  - **de perto, o formigueiro vivo:** tudo detalhado, com cada formiga trabalhando e indo a um destino. O jogador pode acompanhar uma formiga do começo ao fim da tarefa;
  - **de longe, a visão de comando:** a colônia como um todo, para as decisões macro, como onde expandir, que rota abrir e onde defender;
  - **detalhe pequeno é aceitável:** formas nas pilhas, antenas e outros detalhes finos podem ficar pequenos no zoom médio, porque o jogador aproxima quando quer ver;
  - **proposta para avaliar no app de exemplo:** seguir uma formiga com um toque, com a câmera acompanhando.
- **Motivo:** visão do usuário. Acompanhar as formiguinhas é parte da graça do jogo.

### D108. Como fazer o catálogo visual e o app de exemplo
- **Status:** Decidida · **Data:** 2026-11-26 · **Etapa:** (c2) · **Detalha:** D106
- **Decisão:**
  - **ordem:** primeiro o catálogo, depois o app. O app só monta peças já aprovadas no catálogo;
  - **o que ainda não tem design** (castas, inimigos, água, superfície, barricada, galeria de assalto, ícones de interface) é desenhado direto no catálogo. Onde houver dúvida real, aparecem 2 ou 3 variantes lado a lado para escolher;
  - **o app de exemplo** cobre todas as telas do `03` §6, navegáveis, com a colônia viva e dados de exemplo. Ele não tem economia nem fase jogável, que ficam para o protótipo 1;
  - **cada item do catálogo** aparece nos 4 zooms (perto, médio, longe, visão geral) e em todos os estados, com nome, cor e onde é usado;
  - **teste:** no Chrome do computador, no modo de dispositivo das ferramentas do desenvolvedor. O teste no Redmi fica para o final de tudo;
  - **técnica:** catálogo e app usam a mesma biblioteca de desenho, para que o app mostre exatamente o que foi aprovado.
- **Alternativas:** app primeiro; os dois juntos; uma rodada de perguntas para cada grupo; só o tamanho de perto; página publicada no claude.ai.
- **Motivo:** escolhas do usuário.

### D109. Primeiras escolhas do catálogo visual
- **Status:** Decidida · **Data:** 2026-11-26 · **Etapa:** (c2) · **Detalha:** D96, D98, D108 · **Revê:** a cor provisória da água no `03`, o contorno dos inimigos no `03` §3.6 e as antenas e o jeito de carregar do D90
- **Decisão:**
  - **água:** verde-lodo, com corpo #41604F e ondas #5F8670, nos túneis alagados e nos bolsões de água. Ela não repete o azul da defesa;
  - **galeria de assalto:** túnel normal com a borda tracejada violeta (#9A6BFF) andando no sentido do ataque;
  - **barricada:** blocos de barro desencontrados atravessando o túnel, com barra de vida;
  - **inimigos:** sem contorno escuro; a leitura vem do vermelho de perigo e da silhueta;
  - **obra planejada** (túnel e câmara): tracejado mais espaçado, com traços de 5 dp e vãos de 8 dp;
  - **formigas sem antenas** em todas as castas, porque as antenas confundiam com as mandíbulas da cortadeira;
  - **carregar pela boca:** o item vai na frente da cabeça, e não mais em cima do corpo.
- **Em aberto, com modelos para decidir em `prototipo-arte/catalogo/modelos.html`:**
  - fundo do jogo (o atual ficou pesado e cansativo);
  - recursos com mais detalhe no zoom perto, já que o zoom permite (D107);
  - diferenciação melhor entre as castas;
  - personalidade das estruturas;
  - superfície menos lisa;
  - vários tipos de planta com a mesma função e desenhos diferentes;
  - estilo dos ícones de interface;
  - nome novo para o olheiro, que é difícil de entender.
- **Alternativas:** água azul-acinzentada ou cinza-azulada clara; galeria tingida de violeta; barricada em tampão arredondado; contorno de 1 ou 2 dp nos inimigos.
- **Motivo:** escolhas do usuário vendo as variantes lado a lado no catálogo.

### D110. Rodada 2 do catálogo: fundo, superfície, recursos, castas, estruturas, ícones e nome
- **Status:** Decidida · **Data:** 2026-11-26 · **Etapa:** (c2) · **Detalha:** D109 · **Revê:** as cores de solo e túnel do D91 e do `03` §1, os recursos lisos do D48 no zoom perto, a cor única das formigas do D90, a cúpula lisa do D103 e o nome "olheiro" do D08 e do D20
- **Decisão:**
  - **fundo em terra clara:** o solo passa a ser claro e quente, em camadas onduladas que escurecem pouco com a profundidade (#8E765C → #695441), com pedrinhas e pouco granulado. Túneis e câmaras ficam escuros (#30261F). O contraste se inverte: antes o túnel era mais claro que o solo;
  - **superfície viva:** chão ondulado com faixa de húmus, grama baixa, pedrinhas, folhas caídas, flores pequenas, morros e mato em silhueta ao fundo e céu em degradê;
  - **plantas:** capim, trevo, samambaia, folha larga e dente-de-leão, todos com a mesma função. A haste com losangos sai; a substituta está em decisão em `prototipo-arte/catalogo/modelos.html`;
  - **recursos de perto:** viram objeto ilustrado dentro da silhueta da forma (folha com nervura, gota com brilho, favo, tijolo, torrão…). Abaixo de 9 px na tela volta à forma simples; no zoom longe, ponto. A forma continua sendo a identidade (D48);
  - **castas:** silhueta marcada (cortadeira com mandíbula grande e espinhos, cavadora com pá, soldado de cabeça enorme, tanque largo com escudo, atiradora com gota de ácido, saqueadora listrada, explosiva inchada) e corpo **levemente** tingido pelo grupo: defesa (azul), ataque (violeta) e reprodução (dourado); trabalho fica creme. A tinta é fraca, para não virar uma "boate"; a intensidade final está em teste no mesmo arquivo de modelos;
  - **estruturas com ofício:** cada câmara ganha cenário do próprio trabalho no fundo, em tons apagados e atrás do conteúdo: fungo crescendo e fios pendurados no jardim, gotas pingando na destilaria, tachos borbulhando na câmara ácida, prateleiras na olaria, almofada e nichos de ovos na câmara real, estacas e escudos na defesa, flâmulas no posto de guerra, nichos no depósito. Continua sem borda fora de alerta (D103);
  - **ícones sólidos:** preenchidos, de cantos redondos, com recortes. Reserva vira lua, construir vira cúpula com +, expedição vira bandeira e população vira formiga vista de cima;
  - **nome:** o "olheiro" passa a se chamar **cortadouro**. Nas decisões anteriores, onde estiver escrito olheiro, leia cortadouro.
- **Alternativas:** fundo atual, em estratos escuros, com profundidade ilustrada ou terracota; superfície lisa ou só com relevo; recursos geométricos com volume; castas só com silhueta ou com uma marca de cor; câmara com parede de terra batida; ícones de traço ou duotom; "posto de corte", "saída de folhas" ou manter "olheiro".
- **Motivo:** escolhas do usuário vendo os modelos lado a lado. O fundo claro tira o peso e o cansaço da tela.

### D111. Rodada 3 do catálogo: arbusto no lugar da haste
- **Status:** Decidida · **Data:** 2026-11-26 · **Etapa:** (c2) · **Detalha:** D110
- **Decisão:**
  - **planta nova:** o **arbusto de folhinhas** entra no lugar da haste com losangos. Galhos finos e copa de folhinhas em três tufos, com luz em cima e sombra embaixo. Tem flores brancas na primavera, folhas cor de ferrugem no outono e galhos pelados no inverno. Dá folha como as outras;
  - **tinta das castas:** o usuário acha que 25% fica bom, mas quer testar a força junto com o número de cores. Sai da regra de 3 cores por grupo do D110 e vai para teste em `prototipo-arte/catalogo/modelos.html`: 3 cores (por grupo), 4 cores (trabalho também com cor), 6 cores (por função) e 11 cores (uma por casta), com a força ajustável.
- **Alternativas:** junco (taboa) ou flor alta.
- **Motivo:** o arbusto é a única planta redonda e é a que mais varia a linha da superfície. A flor alta fazia uma mancha amarela grande, perto do dourado da reprodução.

### D112. Rodada 4 do catálogo: castas em 6 tons, com 25% de tinta
- **Status:** Decidida · **Data:** 2026-11-26 · **Etapa:** (c2) · **Revê:** as 3 cores por grupo do D110
- **Decisão:**
  - **6 tons por função:** coleta (operária e cortadeira) fica creme; obra (cavadora) em barro #C98A55; linha de frente (soldado e tanque) em azul; apoio (atiradora e curandeira) em verde-água #5CC6A8; ataque (explosiva e saqueadora) em violeta; reprodução (alada e rainha) em dourado;
  - **força:** 25% de mistura da cor com o creme. A silhueta continua sendo a diferença principal (D110).
- **Alternativas:** 3 cores por grupo, 4 cores (trabalho em ocre) e 11 tons (um por casta); forças de 15% a 35%.
- **Motivo:** escolha do usuário vendo os esquemas lado a lado com a força ajustável. A cor por função separa quem faz coisas diferentes dentro do mesmo grupo sem chegar nas 11 cores, que ficavam parecidas entre si com a tinta fraca.
- **Em teste na rodada 5** (`prototipo-arte/catalogo/modelos.html`): pernas e antenas no zoom perto, o item saltando da câmara ao ficar pronto e uma pausa curta entre um item e o próximo. Resolvido no D113.

### D113. Rodada 5 do catálogo: pernas, antenas, item saltando e pausa
- **Status:** Decidida · **Data:** 2026-11-26 · **Etapa:** (c2) · **Revê:** a retirada das antenas do D109 e as formigas sem patas do D90
- **Decisão:**
  - **pernas e antenas, só no zoom perto:** seis pernas finas saindo do tórax, um pouco mais escuras que o corpo. Mexem no passo de tripé quando a formiga anda e param quando ela trabalha numa câmara. As antenas são finas, mais escuras que o corpo, dobradas no cotovelo para fora e abertas em V, para não parecerem a mandíbula da cortadeira. No zoom médio e no longe a formiga continua sem pernas nem antenas;
  - **item saltando ("moedinha"):** quando a barra de produção enche, o item recém-feito pula de onde as formigas trabalham até acima do teto da câmara, girando como moeda, dá um brilho e some, em 0,9 s. Tem no mínimo 12 px na tela, para aparecer no zoom médio; no longe não aparece. Vale para câmaras de produção e extratoras. Cada câmara termina numa hora diferente, então os saltos não acontecem todos juntos;
  - **pausa de 0,8 s entre itens:** a barra fica cheia e clareia, e as formigas param de trabalhar; depois zera e começa o próximo item. A pausa entra no tempo de cada receita (Q03).
- **Alternativas:** sem pernas; pernas paradas; pernas sem antenas; pernas e antenas também no zoom médio. Item pulando para a pilha de saída, selo subindo de 22 px ou moedinha com "+1". Sem pausa ou com a barra esvaziando; pausas de 0,3 e 0,5 s.
- **Motivo:** escolhas do usuário vendo os modelos animados. Pernas e antenas dão vida de perto sem pesar no zoom médio; a moedinha mostra o que cada câmara faz sem precisar tocar nela, e a pausa dá o ritmo de "pronto, próximo".
- **Próximo:** o encaixe dos túneis nas estruturas. Resolvido no D114.

### D114. Rodada 6 do catálogo: encaixe do túnel na porta, com batente
- **Status:** Decidida · **Data:** 2026-11-26 · **Etapa:** (c2) · **Detalha:** D101 (o túnel entra pela lateral ou pelo teto)
- **Decisão:**
  - **chegada reta:** o túnel chega reto na porta da câmara. Nas portas de lado, no nível do chão; nas de teto, de cima. O último trecho (cerca de meia célula) é sempre reto;
  - **abertura:** a cor do túnel entra na câmara e se desfaz em degradê, e o chão da câmara continua um pouco para fora da porta;
  - **batente de terra batida:** num tom entre o solo e o túnel, com um fio de luz. Nas portas de lado tem lintel em cima e soleira no chão; na porta de teto, dois postes. Aparece também no zoom médio;
  - **formigas:** passam por cima da abertura, sem sumir na parede. A fila espera do lado de fora da porta.
- **Alternativas:** como estava (túnel mirando o meio da parede, coberto pela cúpula); só a sombra em degradê, sem batente; boca em funil.
- **Motivo:** escolha do usuário. O batente é o único em que a porta se nota no zoom médio, o que ajuda a ler filas e trânsito.
- **Consequência para o 02:** para o túnel chegar reto, a porta precisa de espaço livre na frente (cerca de 1 célula). Com o nó colado na câmara, a curva faz um gancho. A regra exata de construção fica para o protótipo.

### D115. Rodada 7 do catálogo: formigas animadas dentro das câmaras
- **Status:** Decidida · **Data:** 2026-11-26 · **Etapa:** (c2) · **Detalha:** D107 (zoom perto mostra o formigueiro vivo), D113 (ciclo com pausa)
- **Decisão:**
  - **ciclo de trabalho, "vai e volta" (B):** cada formiga do posto faz a receita inteira. Leva o produto pronto à pilha de saída, busca um ingrediente na pilha de entrada, põe no posto e trabalha até a barra encher. Na pausa de 0,8 s ela para. Com 2 vagas, as viagens são divididas entre as duas;
  - **no posto, o ingrediente vira produto (C no perto, B no médio):** enquanto a barra enche, os ingredientes encolhem e o produto cresce no lugar deles. No zoom perto, farelinhos da cor do ingrediente pulam do posto; no médio, não;
  - **carregadoras entram pela frente (A):** a carregadora entra pela porta, passa na frente das pilhas, deixa o ingrediente na pilha de entrada e, quando há pedido, atravessa até a pilha de saída, pega o produto e sai. As formigas genéricas do túnel não somem mais na porta;
  - **câmara parada, "esperam pelo que falta" (C):** sem ingrediente, as formigas do posto vão para a pilha vazia e esperam viradas para a porta. Com a saída cheia, ficam na pilha de saída segurando o produto;
  - **câmaras da base, a proposta:** a rainha respira, põe o ovo na ponta do abdômen e uma operária traz fungo até a boca dela. No berçário, as cuidadoras levam fungo a cada larva, que se mexe ao comer. No depósito, a carregadora desce pela parede da cúpula até a pilha. No posto de guarda, um soldado vai até a porta olhar e volta, e os outros viram a cabeça;
  - **meia-volta:** quando a formiga dá meia-volta no chão, ela vira "de lado", como a moedinha, em vez de girar pela vertical (que parecia subir na parede);
  - **zoom:** a animação vale no perto e no médio. No longe e no geral, a câmara fica como antes.
- **Alternativas:**
  - ciclo: como estava (paradas balançando a cabeça), posto fixo (só os itens pulam), divisão de tarefas;
  - posto: só o gesto (vira produto de uma vez no fim);
  - carregadoras: somem na porta, sobem por cima das pilhas;
  - parada: como estava, congelam, andam à toa;
  - base: como estava.
- **Motivo:** escolha do usuário. O "vai e volta" deixa seguir uma formiga só (D107), e a posição das formigas paradas já mostra o problema junto com o selo (D103). Os farelos ficam só no perto para não poluir quando há várias câmaras na tela.
- **Para o protótipo:**
  - os tempos são do catálogo (4 s por item, 0,8 s de pausa; 7,2 s na câmara real). No jogo valem os da receita (Q03, Q18);
  - no catálogo, as carregadoras seguem um roteiro fixo (2 por ingrediente a cada 2 ciclos). No jogo elas vêm dos pedidos de transporte (02 §2), 1 unidade por viagem;
  - ficam de fora por enquanto, com o desenho antigo: o nível 2 (3 vagas), as extratoras e as defesas sem soldado.

### D116. Rodada 8 do catálogo: combate
- **Status:** Decidida (rodadas 8 e 8b) · **Data:** 2026-11-26 · **Etapa:** (c2) · **Detalha:** 02 §6 (combate), 03 §5 (animação), D103 (câmara sob ataque)
- **Decisão:**
  - **luta corpo a corpo, "investida com tranco" (B):** cada lutador avança e recua em golpes curtos, um a cada 0,6 s, com um risquinho claro no contato. Quem apanha fica branco por um instante (0,09 s) e é empurrado um pouco para trás;
  - **vida, "só em quem está ferido":** a barrinha aparece enquanto a formiga leva dano ou está com menos de 100% de vida. Quando a cura a deixa cheia, a barrinha some. É vermelha nos inimigos e verde nas suas. Formiga inteira não tem barrinha. O usuário corrigiu a resposta da rodada 8, que tinha sido a B ("barrinha em todo inimigo"). Na faixa de baixo do túnel, a barrinha fica embaixo da formiga, para não cobrir a de cima;
  - **morte, "tomba" (A):** a formiga tomba de lado, perde a cor e, em menos de 1 s, vira presa no chão. As suas formigas tombam e somem, sem deixar presa;
  - **efeitos das castas, "vivo" (B):** o ácido respinga no alvo, e o alvo lento solta bolhinhas por 2 s. A curandeira tem um anel verde pulsando devagar e cruzinhas subindo de quem é curado. A explosiva incha e explode num anel com estilhaços;
  - **cola da explosiva, "teia de terra" (rodada 8b):** a explosão deixa por 4 s cinco fios finos, quase da cor da terra, esticados do teto ao chão do túnel. Os fios balançam devagar, têm gotinhas brilhando como orvalho e arrebentam no fim. Não há poça. Os inimigos que passam por ali ficam lentos;
  - **rastro do ácido, "fio" (rodada 8b, B):** um fio fino desenha o arco inteiro da atiradora até o alvo e se apaga 0,3 s depois do impacto, como um traçante. A gota tem um brilho branco na cabeça;
  - **câmara atacada, "entram" (B):** os inimigos entram na câmara e mordem o posto e a pilha de entrada, soltando lascas da cor do recurso. As formigas de dentro largam o trabalho e se encolhem no fundo, tremendo. A borda vermelha e a barra de vida da câmara continuam (D103).
- **Alternativas:**
  - luta: parados frente a frente, só a investida, bolo de poeira;
  - vida: nenhuma, barrinha só em quem luta (some 1 s depois do último golpe), barrinha em todo inimigo o tempo todo, escurecer com o dano;
  - morte: troca direta pela presa, esfarelar, fumacinha;
  - efeitos: nenhum, sóbrio;
  - rastro do ácido: três bolinhas atrás da gota (rodada 8), gota com cauda, pingos no chão, sem rastro;
  - cola: mancha oval com riscos (rodada 8), poça com pingos, respingos, fios cremes, violetas (com e sem poça) ou cor de resina. O branco pegajoso pareceu esquisito;
  - câmara: como estava, inimigos mordendo a porta.
- **Motivo:** escolha do usuário. O tranco mostra quem bate em quem mesmo com várias lutas na tela. A barrinha só em quem está ferido mostra quem está perdendo sem encher a tela de barras cheias. Os efeitos vivos mostram o que cada casta faz, inclusive a lentidão e a cola, que antes eram invisíveis. O fio liga a atiradora ao alvo, então dá para ver quem atirou em quem. A teia de terra é a cola mais discreta e combina com o túnel. Com os inimigos dentro da câmara, o ataque fica claro: a câmara para de trabalhar.
- **A conferir no app de exemplo:**
  - **barrinhas no zoom longe:** numa luta longa, muitas formigas ficam feridas ao mesmo tempo. Testar se, no zoom longe e no geral, a barrinha deve sumir ou virar só um traço;
  - **o branco do tranco:** pisca mais de uma vez por segundo, mas ocupa a área de uma formiga, abaixo do limite de área do WCAG 2.3.1. Com movimento reduzido, fica só o tranco, sem o branco;
  - **a teia aparece no zoom médio?** Ela é discreta de propósito. Se sumir demais, as gotinhas podem ficar um pouco mais claras;
  - **muitos fios:** com várias atiradoras, os fios podem se cruzar e encher a tela. Cada um dura só 0,65 s, mas vale conferir numa onda grande;
  - **inimigos dentro da câmara:** é só visual. O dano continua sendo na estrutura (02 §6), e a animação da D115 para enquanto houver inimigo dentro.

### D117. Rodada 9 do catálogo: eventos dentro do formigueiro
- **Status:** Decidida · **Data:** 2026-11-27 · **Etapa:** (c2) · **Detalha:** 02 §4.2 (escavação e obra), 02 §6 (ondas e expedição), 03 §5 (animação), D25 (aviso das ondas)
- **Decisão:**
  - **escavação de túnel, "terra vira argila" (B):** a ponta do túnel fica irregular e a cavadora joga farelos claros de terra para trás. Duas operárias vão e voltam entre a ponta e o nó: vão vazias, pegam uma bolinha de argila e voltam com ela. Mostra que escavar rende argila (1 a cada 5 pt, 02 §4.2);
  - **obra de câmara, "da porta, com contorno" (C):** a câmara abre da porta para o fundo, com a frente irregular, e duas cavadoras trabalham nela. O contorno tracejado da cúpula vai enchendo como uma barra, para ler o progresso no zoom médio. O custo que falta aparece no meio. As argileiras da escavação também vão e voltam aqui. No fim, a câmara escura recebe o conteúdo aos poucos, sem piscar;
  - **nascimento, "pulo" (B):** a larva cresce, se encolhe e estoura num anel da cor da casta. A formiga sai pulando, como a moedinha dos itens (D113), e anda até a porta;
  - **onda chegando, "prévia tracejada com terra voando" (C + A):** uma linha vermelha tracejada liga a ponta do túnel rival à câmara que vai ser atacada, com um anel pulsando devagar no ponto de impacto. A ponta do túnel rival fica irregular e joga farelos para trás, como a escavação das suas formigas. A rival da frente cava e as outras seguem;
  - **expedição saindo, "rastro violeta" (B):** os soldados saem das vagas do posto, um atrás do outro, e deixam no túnel um rastro pontilhado de feromônio violeta (cor de ataque) que some em 5 s. As vagas que ficaram vazias aparecem tracejadas.
- **Alternativas:**
  - escavação: como estava (só a cavadora na ponta), terra voando sem as argileiras, frente fofa com poeira;
  - obra: como estava (bloco de terra correndo por dentro), da porta sem o contorno, escurecer por igual com o contorno enchendo;
  - nascimento: troca direta da larva pela formiga, casulo que abre ao meio, casulo com o ícone da casta pulando;
  - onda: como estava, só a terra voando, só a prévia, rachaduras na terra à frente da ponta;
  - expedição: como estava, bandeirinha na primeira da coluna, halo com o número de formigas.
- **Motivo:** escolha do usuário. As argileiras ligam a escavação à argila que ela rende, sem precisar de número. O contorno enchendo lê o progresso da obra de longe, e a frente cavada mostra de onde ela começa. O pulo repete a moedinha que o jogador já conhece e é mais rápido que o casulo. A prévia diz onde a onda vai bater, e os farelos dizem que o túnel ainda está sendo cavado. O rastro mostra o caminho da expedição mesmo no zoom longe.
- **A conferir no app de exemplo:**
  - **as argileiras no jogo:** no modelo, elas vão e voltam entre a ponta e o nó. No jogo, a argila sai da ponta com carregadoras de verdade e vai para o depósito pela rota normal (02 §4.2). Conferir se, com muitas obras ao mesmo tempo, elas não lotam os túneis;
  - **a prévia e o aviso da onda:** a linha tracejada só aparece depois do aviso da D25. Conferir se ela não briga com as setas de borda (D93) quando a câmara alvo está fora da tela;
  - **o anel do nascimento:** tem a cor da casta. Nas castas de cor parecida (D111), conferir se o anel diz qual nasceu, ou se vale juntar o ícone da casta;
  - **os estados parados do catálogo:** resolvido na D119.

### D118. Rodada 10 do catálogo: eventos da superfície
- **Status:** Decidida · **Data:** 2026-11-27 · **Etapa:** (c2) · **Detalha:** 02 §4.3 (folha e cortadouro), 02 §6 (ataque por cima), 04 §3.3 (voo nupcial), D23 (estações), 03 §3.7 e §5
- **Decisão:**
  - **corte na planta, "sobe e leva vela" (C):** a cortadeira sai do cortadouro, sobe pelo caule até uma folha e corta um pedaço. A folha fica mordida e cresce de novo aos poucos. Ela desce com o pedaço em pé sobre a cabeça, como uma vela verde, e entra no cortadouro. No túnel, a carga volta a ser o ícone de folha de sempre;
  - **aviso de ataque por cima, "boca em alerta" (C):** durante o aviso, o arco do cortadouro que vai ser atacado fica vermelho e pulsa a 1 Hz. A aranha chega pela superfície e morde a primeira cortadeira que encontra (02 §6);
  - **aranha andando:** as oito pernas mexem em dois grupos alternados, como o tripé das formigas (D113), e param quando ela morde. Só no zoom perto;
  - **voo nupcial, "revoada" (A):** às 12:00, as aladas saem do cortadouro quase juntas, abrem as asas e sobem em leque, girando, batendo as asas e ficando menores até sumir no céu;
  - **troca de estação, "aos poucos, com folhas e brotos" (B):** em 1,6 s as plantas murcham ou crescem e as cores do céu e das folhas passam de uma estação para a outra. No inverno as folhas caem rodando e o vento leva; no começo do outono caem as primeiras folhas amarelas; na primavera brotos e flores abrem no chão;
  - **chão sem vão:** os morros e o mato do fundo ficam recortados no céu. Antes, eles vazavam abaixo da linha do chão e deixavam uma faixa escura entre a superfície e a terra.
- **Alternativas:**
  - corte: como estava (só até o pé da planta), subir e descer com a folha na boca, pedaços caindo da planta para as outras buscarem;
  - aviso: nenhum na superfície, mato mexendo na borda, prévia tracejada da borda até a boca;
  - voo: nada na superfície, uma a uma com rastro dourado, uma a uma com a contagem acima da boca;
  - estação: troca de uma vez, aos poucos sem folhas e brotos.
- **Motivo:** escolha do usuário. A vela é a imagem mais conhecida das cortadeiras e mostra de longe que a planta está sendo colhida. A boca em alerta marca o cortadouro que vai ser atacado sem riscar a superfície. A revoada é a mais bonita para fechar o arco. A troca aos poucos deixa a estação ser vista no mundo, não só no nome no topo da tela.
- **A conferir no app de exemplo:**
  - **a vela e o ícone:** a folha tem dois desenhos, a vela na superfície e o ícone no túnel. Conferir se a troca na boca do cortadouro não chama atenção;
  - **a boca em alerta não diz de onde a aranha vem.** Se o jogador não souber de que lado defender, juntar uma seta na borda (D93) ou o mato mexendo;
  - **o aviso de 45 s:** na cena ele dura 6 s. Conferir se o arco pulsando por 45 s cansa, ou se ele deve começar fraco e crescer;
  - **a meta no voo:** a revoada não mostra a contagem de aladas (D31). A meta continua na interface; conferir se faz falta na hora do voo;
  - **a mordida na folha** é um furo da cor do céu. Na frente de morro ou mato ela aparece como um buraco do céu; no jogo, recortar a folha de verdade.

### D119. Pendências do catálogo: armadilha e estados parados de escavação
- **Status:** Decidida · **Data:** 2026-11-27 · **Etapa:** (c2) · **Detalha:** D116 (teia de terra), D117 (escavação e obra), 03 §5
- **Decisão:**
  - **armadilha de cola:** a poça amarela com fios saiu. Dentro da câmara ficam cinco fios da teia de terra da D116, do teto ao chão, com gotinhas brilhando e balançando devagar. Em combate os fios tremem. Sem munição, sobram só os tocos dos fios, apagados. A pilha de cola continua no canto;
  - **túnel "escavando":** é o quadro do meio da cena da D117. 60% do túnel está cavado e o resto continua tracejado. Na ponta há calombos de terra, a cavadora balançando a cabeça e farelos voando. Duas argileiras vão e voltam entre a ponta e o começo do túnel;
  - **câmara "escavando":** metade da câmara está cavada a partir do lado da porta, com a frente irregular, e o resto continua solo. O contorno é tracejado e a barra branca cobre metade dele, crescendo a partir da porta. As cavadoras trabalham na frente e uma argileira leva a argila até a porta. No meio fica o custo que falta. Na porta de cima, a câmara é cavada de cima para baixo.
- **Alternativas:** manter os desenhos antigos (o bloco de solo correndo e a poça amarela), que já não batiam com a D116 e a D117.
- **Motivo:** acerto de consistência, sem rodada. Os estados parados agora mostram o mesmo desenho das animações escolhidas.

### D120. Formigas e aranha de perfil na superfície e nas câmaras
- **Status:** Decidida · **Data:** 2026-11-27 · **Etapa:** (c2) · **Detalha:** D113 (pernas e antenas), D115 (formigas na câmara), D118 (eventos da superfície), 03 §3.5 e §5
- **Decisão (rodada 11):**
  - **onde (B):** na superfície e dentro das câmaras, as formigas e a aranha aparecem **de perfil, de pé**. Nos túneis continuam vistas de cima. A troca acontece na porta da câmara e na boca do cortadouro;
  - **estilo (C):** corpo com volume, com a parte de baixo mais escura e um brilho em cima, e **sem olho**;
  - **andar (B):** pernas, corpo e antenas se mexem. As pernas andam em tripé, o corpo balança de leve e as antenas tateiam;
  - **aranha (A):** pernas altas, com os joelhos acima do corpo;
  - **detalhes:** a cortadeira leva a vela presa na boca. Na parede e no teto da cúpula, a formiga anda com os pés na terra. Ao virar no chão, ela encolhe de lado em vez de girar pela vertical. A lacraia continua vista de cima;
  - vale nos zooms perto e médio. No longe e no geral nada muda.
- **Alternativas:**
  - onde: manter tudo visto de cima; (A) perfil só na superfície; (C) perfil em todo lugar, túneis inclusive;
  - estilo: (A) lisa; (B) com volume e olho forte; (D) com volume e olho discreto;
  - andar: (A) só as pernas;
  - aranha: (B) pernas baixas e abertas.
- **Motivo:** escolha do usuário depois do teste. Vistas de cima, as formigas na superfície e nas câmaras pareciam esquisitas, porque o chão é visto de lado. De pé, a cena fica coerente. O olho saiu porque o volume sozinho já dá vida.
- **A conferir no protótipo:** se a troca de vista na porta fica natural; a leitura no zoom médio; as formigas do túnel perto da porta.

---

## Questões em aberto

| # | Questão | Quando resolver |
|---|---|---|
| Q01 | Nome final do jogo ("Pherotrio" é provisório; ver D37) | Antes do protótipo 3 (os testadores já veem o nome; `05` §8) |
| ~~Q02~~ | ~~Como a expedição é comandada?~~ **Resolvida por D21.** | — |
| Q03 | Receitas e tempos de cada casta: **valores iniciais propostos** em `02-mecanicas.md` §5.2; fica aberta até a calibração no protótipo | Protótipo |
| ~~Q04~~ | ~~O que muda em cada estação?~~ **Resolvida por D23.** | — |
| ~~Q05~~ | ~~Onde ficam os pulgões (fonte de melada)?~~ **Resolvida por D20:** bolsões fixos no solo, extraídos por curral. | — |
| ~~Q06~~ | ~~Envelhecimento e manutenção?~~ **Resolvida por D24.** | — |
| ~~Q07~~ | ~~Ritmo e aviso das ondas?~~ **Resolvida por D25.** | — |
| ~~Q08~~ | ~~Limite de câmaras?~~ **Resolvida por D32** (sem limite; mapa finito com scroll e zoom). | — |
| ~~Q09~~ | ~~Eventos ambientais?~~ **Resolvida por D96:** a água alaga túneis na primavera, já no lançamento. | — |
| Q10 | Preço final do desbloqueio. Fases grátis já definidas (arco 1, D82); preço proposto por volta de R$ 9,90 no Brasil e US$ 2,99 a 3,99 fora. Confirmar perto do lançamento, com o teste fechado e, se possível, experimento de preço no Play Console | Lançamento |
| ~~Q11~~ | ~~Engine?~~ **Resolvida por D81** (TypeScript + PixiJS + Capacitor). | — |
| ~~Q12~~ | ~~Vitória alternativa por destruir o rival?~~ **Resolvida por D71.** | — |
| ~~Q13~~ | ~~Velocidades de jogo e interface dos sliders?~~ **Resolvida por D35 e D36.** | — |
| ~~Q14~~ | ~~Critério de estrelas?~~ **Resolvida por D70.** | — |
| Q15 | Prioridade das cuidadoras é fixa no MVP; o jogador precisa poder mudá-la além de pausar estruturas? | Protótipo |
| ~~Q16~~ | ~~Novo nome para "melada"?~~ **Resolvida por D40** (seiva). | — |
| ~~Q17~~ | ~~Duração da fase?~~ **Resolvida por D42** (12 a 20 min). | — |
| Q18 | Rever o tamanho da colônia (D22) depois da árvore e do fim do limite de câmaras | Protótipo |
| ~~Q19~~ | ~~Aprovar o conteúdo do MVP?~~ **Resolvida por D77.** | — |
| Q20 | Teste de leitura das 17 formas de recurso a 10 e 12 dp em celular real (formas e cores definidas no `03`; trocas de reserva propostas no `03` §3.4) | Protótipo |
| Q21 | Inimigos dentro de um túnel: as carregadoras desviam, esperam ou lutam? Os inimigos ocupam capacidade? | Protótipo |
| Q22 | Mudar o sentido de um túnel com formigas dentro: elas terminam a travessia (proposta) ou voltam? | Protótipo |
| Q23 | As 11 silhuetas de casta se leem a 8 dp, ou é preciso um ícone flutuante? (`03` §3.5) | Protótipo |
| ~~Q24~~ | ~~Celular de referência?~~ **Resolvida por D80** (modelo de entrada exato a escolher). | — |
| ~~Q25~~ | ~~Traçado dos túneis?~~ **Resolvida por D87** (curvas bem suaves). | — |
| ~~Q26~~ | ~~Cores do mundo e o azul repetido?~~ **Resolvida por D91** (túnel mais claro, pulso na borda, força de 40%). | — |
| ~~Q27~~ | ~~Visão geral ou minimapa?~~ **Resolvida por D92 e D93** (zoom mínimo mostra o mapa inteiro; setas na borda). | — |
| ~~Q28~~ | ~~Arco 2 sem N3?~~ **Resolvida por D77:** o N3 entra no lançamento. | — |
| Q29 | Steam: Electron ou Tauri para a versão de PC (D83) | Porta para a Steam |
| Q30 | China: quando traduzir para chinês simplificado e quem traduz (D84) | Porta para a Steam |
| Q31 | Som e música: estilo, quantidade, e se é feito, licenciado ou encomendado. Nenhum documento cobria áudio | Durante o protótipo 2 (antes do M3, `05` §8) |
| Q32 | Modelo exato do celular de entrada (D80, D85) | Antes do portão de desempenho |
| Q33 | Métricas anônimas no lançamento: sim ou não, e qual ferramenta (D86) | Antes do teste fechado |
| ~~Q34~~ | ~~Visual das estruturas e câmaras?~~ **Resolvida por D101 a D105** (cúpula de chão plano, conteúdo real, tinta sem borda, indicadores na cena, tamanho por tipo). | — |
