# 07 — Árvore de criação

> Status: **etapa (b2) aprovada**. Última revisão: 2026-11-25.
> Este documento é a **fonte da verdade** para recursos, receitas, castas, estruturas e upgrades. Os sistemas (transporte, combate, estações, expedição) continuam em `02-mecanicas.md`.
> Todos os números são **hipóteses a calibrar**. Na implementação, esta árvore vive numa planilha exportada para dados (JSON), não no código.

---

## 0. Princípios

1. **A árvore é o centro do jogo** (D38). Cada formiga nova e cada estrutura de defesa ou ataque exige recursos específicos, feitos em estruturas específicas.
2. **Diversidade de conteúdo é barata; comportamento novo é caro.**
   - Um recurso, uma receita ou uma processadora nova é uma linha de dados mais um ícone.
   - Uma formiga com comportamento novo exige código, animação e balanceamento.
   - Por isso, todas as castas e estruturas são montadas sobre **7 comportamentos base** (§8).
3. **Árvore grande, mas cada fase favorece galhos** (D39). A campanha abre a árvore rápido. O mapa de cada fase (quais fontes existem) e o tipo de inimigo empurram estratégias diferentes. Nenhuma fase tem a mesma resposta certa.
4. **Níveis:** naturais → N1 (processados de um ingrediente) → N2 (combinações) → N3 (combinações de combinações).

## 1. Visão geral

| Grupo | Quantidade | Itens |
|---|---|---|
| Recursos naturais | 4 | Folha, Seiva, Presa, Argila |
| Processados N1 | 5 | Fungo, Néctar, Proteína, Quitina, Barro |
| Combinados N2 | 5 | Pasta nutritiva, Ácido, Carapaça, Geleia real, Cola |
| Combinados N3 | 2 | Gosma tóxica, Feromônio de guerra |
| Subproduto | 1 | Refugo |
| Castas | 10 | 3 econômicas, 6 de combate, 1 de reprodução |
| Estruturas | 26 | 3 extratoras, 11 processadoras, 5 de base, 5 de defesa (incluindo o posto de guarda), 2 de ataque |

**Mapa da árvore** (o que entra em quê):

```
NATURAL     N1            N2                         N3
Folha  ──►  Fungo  ──┬─►  Pasta (2 fungo + 1 proteína)
                     └─►  Geleia (2 fungo + 2 néctar) ──────┐
Seiva  ──►  Néctar ──┼─►  Geleia                            ├─►  Feromônio (geleia + ácido)
                     ├─►  Ácido (néctar + proteína) ────────┤
                     └─►  Cola (néctar + barro) ────────────┴─►  Gosma (ácido + cola)
Presa  ──►  Proteína ┬─►  Pasta, Ácido
        └►  Quitina ─┴─►  Carapaça (2 quitina + 1 barro)
Argila ──►  Barro  ──┬─►  Carapaça
                     └─►  Cola
```

## 2. Recursos

### 2.1 Naturais

| Recurso | Fonte no mapa | Extrator | Observação |
|---|---|---|---|
| **Folha** | Planta fixa na superfície | Olheiro | Produção por estação (máx. na primavera, zero no inverno). |
| **Seiva** | Bolsão de raízes fixo no solo | Coletor de seiva | Finito por bolsão (300 a 600). |
| **Presa** | Inimigos mortos e saque de expedição | — (corpos recolhidos) | Depende de combate. |
| **Argila** | Qualquer escavação | — (sai de toda obra) e Poço de argila | 1 argila a cada 5 pt escavados. O Poço de argila gera argila continuamente. |

### 2.2 Processados e combinados

| Recurso | Nível | Receita | Estrutura | Tempo | Usado em |
|---|---|---|---|---|---|
| **Fungo** | N1 | 2 folha | Jardim de fungo | 4 s | Manutenção, quase todas as dietas, Pasta, Geleia |
| **Néctar** | N1 | 2 seiva | Destilaria | 5 s | Geleia, Ácido, Cola, upgrade do jardim |
| **Proteína** | N1 | 1 presa → **2 proteína + 1 quitina** | Câmara de presas | 5 s | Pasta, Ácido |
| **Quitina** | N1 | (subproduto da câmara de presas) | Câmara de presas | — | Carapaça, Cavadora, upgrades |
| **Barro** | N1 | 2 argila | Olaria | 4 s | Carapaça, Cola, Barricada, Galeria, upgrades |
| **Pasta nutritiva** | N2 | 2 fungo + 1 proteína | Cozinha | 6 s | Cortadeira, Soldado, Saqueadora |
| **Ácido** | N2 | 1 néctar + 1 proteína | Câmara ácida | 6 s | Atiradora, Torre ácida, Gosma, Feromônio |
| **Carapaça** | N2 | 2 quitina + 1 barro | Câmara de carapaça | 8 s | Tanque, Torre ácida, Posto de guerra, upgrades |
| **Geleia real** | N2 | 2 fungo + 2 néctar | Câmara de geleia | 10 s | Alada, Curandeira, Feromônio, upgrades nobres |
| **Cola** | N2 | 1 néctar + 1 barro | Câmara de cola | 6 s | Curandeira, Armadilha, Galeria, Gosma, upgrades N2 |
| **Gosma tóxica** | N3 | 1 ácido + 1 cola | Câmara tóxica | 10 s | Explosiva, Mina de gosma |
| **Feromônio de guerra** | N3 | 1 geleia + 1 ácido | Câmara de feromônio | 12 s | Saqueadora, Posto de guerra |
| **Refugo** | sub | 1 a cada 5 fungo | Jardim de fungo | — | Vai para a lixeira (D13) |

**Custo em N1 dos combinados** (para balancear):

| Combinado | Em N1 | Em naturais (aprox.) |
|---|---|---|
| Pasta | 2 fungo + 1 proteína | 4 folha + 0,5 presa |
| Ácido | 1 néctar + 1 proteína | 2 seiva + 0,5 presa |
| Carapaça | 2 quitina + 1 barro | 2 presa + 2 argila |
| Geleia | 2 fungo + 2 néctar | 4 folha + 4 seiva |
| Cola | 1 néctar + 1 barro | 2 seiva + 2 argila |
| Gosma | 2 néctar + 1 proteína + 1 barro | 4 seiva + 0,5 presa + 2 argila |
| Feromônio | 2 fungo + 3 néctar + 1 proteína | 4 folha + 6 seiva + 0,5 presa |

Na conta em naturais, a presa é contada pelo produto principal (1 presa rende 2 proteína **e** 1 quitina ao mesmo tempo).

## 3. Estruturas de produção

Todas as processadoras usam **o mesmo código** (uma processadora genérica que lê a receita dos dados). Elas diferem só na receita, no tempo, nas vagas e no desenho (D44).

| Estrutura | Tipo | Receita | Tempo nv1 / nv2 | Vagas de Cuidar nv1 / nv2 | Upgrade (nv2) |
|---|---|---|---|---|---|
| **Olheiro** | extratora | planta → folha (corte de 3 s) | — | 4 / 6 cortadoras (Carregar) | 4 quitina |
| **Coletor de seiva** | extratora | bolsão → 1 seiva a cada 4 s por cuidadora | — | 3 / 4 | 6 barro |
| **Poço de argila** | extratora | escavadoras geram 1 argila a cada 5 pt | — | 2 / 4 escavadoras | 4 quitina |
| **Jardim de fungo** | N1 | 2 folha → 1 fungo + refugo | 4 s / 2,7 s | 2 / 3 | 10 néctar |
| **Destilaria** | N1 | 2 seiva → 1 néctar | 5 s / 3,5 s | 1 / 2 | 6 barro |
| **Câmara de presas** | N1 | 1 presa → 2 proteína + 1 quitina | 5 s / 3,5 s | 1 / 2 | 6 barro |
| **Olaria** | N1 | 2 argila → 1 barro | 4 s / 2,7 s | 1 / 2 | 4 quitina |
| **Cozinha** | N2 | 2 fungo + 1 proteína → 1 pasta | 6 s / 4 s | 2 / 3 | 3 cola |
| **Câmara ácida** | N2 | 1 néctar + 1 proteína → 1 ácido | 6 s / 4 s | 2 / 3 | 3 cola |
| **Câmara de carapaça** | N2 | 2 quitina + 1 barro → 1 carapaça | 8 s / 5,5 s | 2 / 3 | 3 cola |
| **Câmara de geleia** | N2 | 2 fungo + 2 néctar → 1 geleia | 10 s / 7 s | 2 / 3 | 3 cola |
| **Câmara de cola** | N2 | 1 néctar + 1 barro → 1 cola | 6 s / 4 s | 1 / 2 | 4 carapaça |
| **Câmara tóxica** | N3 | 1 ácido + 1 cola → 1 gosma | 10 s / 7 s | 2 / 3 | 2 geleia |
| **Câmara de feromônio** | N3 | 1 geleia + 1 ácido → 1 feromônio | 12 s / 8 s | 2 / 3 | 2 geleia |

Custo de escavação: câmaras 20 pt, extratoras 15 pt. Todo upgrade custa **25 pt + o recurso específico** da tabela (D47).

## 4. Castas

### 4.1 Tabela de castas

| Casta | Grupo | Dieta | Custo em N1 | Larva | Manutenção (fungo/min) | Comportamento base |
|---|---|---|---|---|---|---|
| **Operária** | econômica | 5 fungo | 5 fungo | 40 s | 0,2 | Trabalho |
| **Cortadeira** | econômica | 3 fungo + 2 pasta | 7 fungo + 2 proteína | 50 s | 0,3 | Trabalho |
| **Cavadora** | econômica | 3 fungo + 2 quitina | 3 fungo + 2 quitina | 50 s | 0,3 | Trabalho |
| **Soldado** | combate | 3 pasta | 6 fungo + 3 proteína | 60 s | 0,6 | Corpo a corpo |
| **Tanque** | combate | 4 fungo + 2 carapaça | 4 fungo + 4 quitina + 2 barro | 90 s | 0,6 | Corpo a corpo + bloqueio |
| **Atiradora** | combate | 4 fungo + 3 ácido | 4 fungo + 3 néctar + 3 proteína | 75 s | 0,6 | Distância |
| **Curandeira** | combate (suporte) | 2 geleia + 1 cola | 4 fungo + 5 néctar + 1 barro | 80 s | 0,5 | Suporte |
| **Explosiva** | combate | 2 fungo + 2 gosma | 2 fungo + 4 néctar + 2 proteína + 2 barro | 60 s | 0,4 | Sacrifício em área |
| **Saqueadora** | combate (ataque) | 2 pasta + 1 feromônio | 6 fungo + 3 néctar + 3 proteína | 70 s | 0,5 | Expedição |
| **Alada** | reprodução | 5 fungo + 3 geleia | 11 fungo + 6 néctar | 120 s | 0,5 | Reprodução |

### 4.2 Atributos e regras especiais

| Casta | Vida | Dano/s | Alcance | Velocidade | Regra especial |
|---|---|---|---|---|---|
| Operária | 10 | 1 | corpo | 1,0 | Trabalha em qualquer papel (D14) |
| Cortadeira | 12 | 1 | corpo | 1,1 | Só no papel Carregar; leva **2 unidades** por viagem e corta folha 2× mais rápido |
| Cavadora | 14 | 1 | corpo | 0,9 | Só no papel Escavar; escava **2,5 pt/s** e rende +50% de argila |
| Soldado | 30 | 4 | corpo | 1,0 | Dano alto contra enxames |
| Tanque | 60 | 2 | corpo | 0,6 | **Bloqueia** a passagem no posto (D29) |
| Atiradora | 15 | 4 | 1,5 cél | 0,9 | Deixa o alvo 30% lento por 2 s; ignora a armadura de blindados |
| Curandeira | 15 | 0 | 1,5 cél | 0,9 | Cura 3 vida/s das formigas próximas; não ataca |
| Explosiva | 8 | — | raio 1 cél | 1,1 | 30 de dano em área, gruda por 4 s, **morre** |
| Saqueadora | 20 | 2 | corpo | 1,6 | Em expedição: dobra o saque e anda rápido; na defesa é fraca |
| Alada | 12 | 0 | — | — | Espera na câmara nupcial; conta para a vitória (D31) |

**Castas econômicas no slider:** cortadeiras e cavadoras ficam presas ao seu papel. Os botões + e − (D35) movem só operárias comuns, e o painel mostra a soma (ex.: "Carregar 8 + 3 cortadeiras").

## 5. Estruturas de defesa e ataque

| Estrutura | Tipo | Custo | Comportamento base | Efeito | Upgrade (nv2) |
|---|---|---|---|---|---|
| **Posto de guarda** | defesa | 10 pt | — (ponto de reunião) | 4 vagas de combate; as formigas reagem a até 2 cél | 2 carapaça (6 vagas) |
| **Barricada** | defesa | 10 pt + 6 barro | Bloqueio | Vida 150. Inimigos não passam; suas formigas passam | 6 barro (vida 300) |
| **Torre ácida** | defesa | 15 pt + 3 carapaça | Distância (fixa) | 5 dano/s a até 2 cél, deixa lento. **Consome 1 ácido a cada 10 s** de disparo | 2 carapaça (+50% dano) |
| **Armadilha de cola** | defesa | 10 pt + 4 cola | Efeito em área | Célula onde inimigos ficam 50% lentos. **Consome 1 cola a cada 20 s** com inimigo dentro | 3 cola (raio maior) |
| **Mina de gosma** | defesa | 10 pt + 2 gosma | Sacrifício em área (fixa) | Uso único: 40 de dano em raio 1,5 cél e gruda por 5 s | — |
| **Galeria de assalto** | ataque | 8 barro + 2 cola | — (túnel especial) | Túnel que se cava sozinho (3 cél/s) até uma boca rival. Expedições por ela andam 50% mais rápido. Rivais não podem usá-la | — |
| **Posto de guerra** | ataque | 15 pt + 2 carapaça | Efeito em área | Expedições que partem dele causam +30% de dano. **Consome 1 feromônio por expedição** | 2 carapaça (+50%) |

## 6. Estruturas de base e upgrades

| Estrutura | Função | Upgrade (nv2) | Efeito do nv2 |
|---|---|---|---|
| **Câmara real** | Rainha: 1 ovo a cada 15 s (1 fungo cada) | 4 geleia | 1 ovo a cada 10 s |
| **Berçário** | 3 larvas; dieta escolhida pelo jogador (D09) | 2 geleia | 5 larvas, 3 vagas de Cuidar |
| **Câmara nupcial** | 6 aladas esperando o voo | 3 geleia | 10 aladas |
| **Depósito** | Capacidade 100 (qualquer recurso) | 10 barro | 200 |
| **Lixeira** | Capacidade 200 de refugo | 6 barro | 400 |
| **Túnel** | 2 formigas por célula; frente de combate 1 | ver a tabela abaixo | 4 níveis (D52) |

Upgrades de estrutura: máximo de 2 níveis (D11) e **25 pt + o recurso específico** (D47).

**Túneis são a exceção: 4 níveis, com custo por célula (D52, D53).** Regras de fila, sentido e indicadores em `02` §4.2.

| Nível | Formigas por célula | Frente de combate | Custo por célula (além do anterior) | Galho que pede |
|---|---|---|---|---|
| 1 | 2 | 1 | 4 pt | — |
| 2 | 3 | 2 | +4 pt, +2 barro | Mineral (N1) |
| 3 | 4 | 2 | +4 pt, +2 barro, +1 cola | Mineral + açúcar (N2) |
| 4 | 5 | 3 | +6 pt, +3 barro, +1 carapaça | Mineral + animal (N2) |

Assim, alargar túneis puxa o galho mineral e ainda cria demanda de cola e carapaça fora das castas.

## 7. Exemplo de leitura: o caminho até uma atiradora

1. Abrir um **olheiro** numa planta → folha → **jardim** → fungo.
2. Abrir um **coletor de seiva** num bolsão de raízes → seiva → **destilaria** → néctar.
3. Matar inimigos (ondas do outono) → presa → **câmara de presas** → proteína (+ quitina de brinde).
4. Néctar + proteína → **câmara ácida** → ácido.
5. Trocar a dieta de um **berçário** para "atiradora": as carregadoras levam 4 fungo + 3 ácido para cada larva. Depois de 75 s nasce a atiradora.

São **6 estruturas** e 3 fontes diferentes para uma casta de nível N2. É isso que dá a sensação de "fábrica viva". É também por isso que a campanha precisa abrir a árvore em etapas (§10).

## 8. Comportamentos base e custo de implementação

| Comportamento | Quem usa | O que precisa no código | Custo |
|---|---|---|---|
| **Trabalho** | Operária, Cortadeira, Cavadora | Papéis, pedidos e escavação (já existe para a operária); variações são números | G para o primeiro; P para as variações |
| **Corpo a corpo** | Soldado, Tanque | Mirar o inimigo mais próximo e atacar em contato | M |
| **Bloqueio** | Tanque, Barricada | Flag: "célula bloqueada enquanto vivo" | P |
| **Distância** | Atiradora, Torre ácida | Mirar a até X células, projétil, efeito de lentidão | M |
| **Sacrifício em área** | Explosiva, Mina de gosma | Ir até o grupo e explodir: dano em raio + "grudado" + morrer | M |
| **Suporte** | Curandeira, Posto de guerra | Efeito em área contínuo sobre formigas aliadas (cura ou dano) | M |
| **Expedição** | Saqueadora (e todas as castas de combate) | Sair do posto, ir até o rival, lutar e voltar com saque (já existe por D21) | P (variação) |
| **Reprodução** | Alada | Ficar parada na câmara nupcial | P |
| **Efeito em área (estrutura)** | Armadilha de cola | Lentidão em quem estiver na célula | P (reusa a lentidão) |

P = pequeno (horas a 1 dia) · M = médio (2 a 5 dias) · G = grande (1 a 2 semanas). Estimativas grosseiras; a estimativa por blocos está no `05` §3.

**Leitura:** as 10 castas e as 7 estruturas de defesa e ataque saem de **5 lógicas de combate e 3 efeitos** (dano, lentidão, cura). Isso mantém o sistema coerente para o jogador (itens parecidos seguem as mesmas regras) e permite iterar o balanceamento mexendo só na planilha.

## 9. Inimigos: traços e vantagens

Para que cada galho da árvore tenha motivo de existir, os inimigos têm traços que favorecem respostas diferentes. Isso substitui os atributos genéricos de `02-mecanicas.md` §6.3, que continuam valendo como números.

| Inimigo | Traço | Fraco contra | Resiste a |
|---|---|---|---|
| Formiga rival | **Enxame** (muitas e fracas) | Soldado, Explosiva, Mina, Armadilha | Tanque sozinho (lento para matar muitas) |
| Soldado rival | **Blindado** (−50% de dano corpo a corpo leve) | Atiradora, Torre ácida (ácido ignora a armadura) | Operária, Soldado |
| Aranha | **Rápida e caçadora** | Armadilha de cola, Barricada, Tanque (lentidão e bloqueio) | Expedições (não fica no ninho) |
| Lacraia (chefe) | **Muita vida, mira a câmara nupcial** | Combinação: bloqueio + distância + cura | Qualquer resposta única |

**Regra de design:** toda fase deve ter pelo menos dois traços de inimigo, para que nenhuma casta sozinha resolva tudo.

## 10. Como a árvore aparece no jogo (D39)

### 10.1 Ordem de liberação na campanha

A ordem detalhada, fase a fase, está no `04` §2.
- A campanha tem 3 arcos de 5 fases (D67).
- A árvore inteira fica aberta até a F10 (D62).
- **Arco 1:** folha e fungo → defesa → seiva e néctar → presa, proteína e soldado → geleia e alada.
- **Arco 2:** argila e barro → ácido e cola → carapaça e tanque → ataque e feromônio → gosma e explosiva.
- **Arco 3:** domínio, com a árvore inteira.
- O **sandbox** começa com tudo liberado.

### 10.2 Cada fase favorece galhos (o "cardápio" da fase)
- **Fontes no mapa:** uma fase sem bolsões de raízes não tem néctar e, portanto, não tem ácido nem geleia. Uma fase com muitas plantas e poucos inimigos favorece economia e aladas.
- **Traços dos inimigos** (§9) definem quais castas compensam.
- **Duração variável (D42):** fases iniciais de 12 min (estações de 3 min); fases finais de até 20 min (estações de 5 min), para dar tempo de subir até N3.

## 11. Linguagem visual dos recursos (cores finais no `03` §2)

Referência do Achikaps (✅ pelo print do usuário): os recursos são formas geométricas coloridas, e as receitas aparecem como ícones do tipo "▲▲■ → ▲".

**Regra proposta:**
- **forma = identidade** (única por recurso; garante leitura para daltônicos);
- **cor = família** (vegetal verde, açúcar âmbar, animal rosa, mineral cinza-terra);
- **combinados** usam uma forma nova pintada **com as cores dos ingredientes em metades**, para que a receita "se leia" no próprio ícone;
- **N3** ganha contorno duplo.

| Recurso | Forma | Cor | Lógica |
|---|---|---|---|
| Folha | losango | verde | lembra uma folha |
| Seiva | gota | âmbar | líquido |
| Presa | triângulo | rosa | ponta, caça |
| Argila | quadrado | cinza-terra | bloco de terra |
| Fungo | círculo | verde | bolota de fungo |
| Néctar | hexágono | âmbar | favo |
| Proteína | cápsula | rosa | pílula |
| Quitina | pentágono | rosa | placa de armadura |
| Barro | retângulo deitado | cinza-terra | tijolo |
| Pasta | dois círculos encostados ("amendoim") | verde + rosa | mistura de fungo e proteína |
| Ácido | triângulo invertido | âmbar + rosa | gota de veneno |
| Carapaça | trapézio | rosa + cinza-terra | escudo |
| Geleia real | estrela de 4 pontas | verde + âmbar | nobre |
| Cola | anel | âmbar + cinza-terra | pegajoso |
| Gosma tóxica | estrela de 8 pontas, contorno duplo | âmbar + rosa | explosão |
| Feromônio | estrela de 5 pontas, contorno duplo | verde + âmbar | sinal químico |
| Refugo | cruz pequena | cinza | descarte |

Os códigos hex, os testes de contraste e de daltonismo e a troca de coral para rosa na família animal estão no `03` §2 (D54).

## 12. Conteúdo do MVP (proposta original, substituída)

> **Substituída pela D77:** o lançamento traz o conteúdo completo, incluindo o N3. A tabela abaixo fica como histórico e como corte de reserva.

| | MVP (lançamento) | 1ª atualização |
|---|---|---|
| Recursos | 4 naturais + 5 N1 + 5 N2 (14) | Gosma, Feromônio (N3) |
| Castas | Operária, Cortadeira, Cavadora, Soldado, Tanque, Atiradora, Curandeira, Alada (8) | Explosiva, Saqueadora |
| Defesa | Posto, Barricada, Torre ácida, Armadilha de cola | Mina de gosma |
| Ataque | Galeria de assalto (+ expedição por botão) | Posto de guerra |
| Processadoras | 3 extratoras + 4 N1 + 5 N2 | 2 N3 |

O MVP já tem 14 recursos e 8 castas, o que atende ao pedido de diversidade desde o lançamento. O N3 fica fora porque é a camada mais cara de balancear e só aparece em fases longas.

## 13. Riscos

1. **Complexidade para o jogador:** 6 estruturas para uma atiradora é muito para quem está começando. Mitigação: abertura em etapas (§10.1) e ícones de receita sempre visíveis no berçário e nas processadoras.
2. **Explosão logística:** 16 recursos circulando podem gerar engarrafamento caótico em vez de interessante. Mitigação: depósitos genéricos, upgrade de túnel, cortadeiras. **Medir no protótipo.**
3. **Balanceamento combinatório:** cada mudança de receita afeta várias castas. Mitigação: planilha com o custo em naturais calculado automaticamente (§2.2) e um simulador simples de economia antes de mexer no jogo.
4. **Castas redundantes:** se duas castas resolvem o mesmo problema, uma morre. Mitigação: traços de inimigos (§9) e revisão casta a casta: "que problema só ela resolve?".
5. **Leitura de ícones:** 17 formas em tamanho pequeno no celular. Mitigação: teste a 10 e 12 dp em celular real no protótipo (Q20), com as trocas de reserva do `03` §3.4.
