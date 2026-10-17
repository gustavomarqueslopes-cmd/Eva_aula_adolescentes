# EVA — Quem Está no Controle? · O Caso Sete

Aplicação React + TypeScript + Vite para uma experiência investigativa de 100 minutos, com 4 equipes, 13 envelopes e apresentação visual controlada pelo ministrante.

## A aula (edição revisada)

- `/#/inicio`: abertura pública da história.
- `/#/controle`: painel local do ministrante, cronômetro, validação de códigos e desfecho.
- `/#/telao`: telão, sem gabaritos e sem link direto para o controle.
- **A vida do Projeto Ponte**: a cena 2 contém **oito atos visuais** que apresentam Sete, o propósito do Projeto Ponte, as quatro pessoas envolvidas, o processo de criação e a oportunidade da Mostra. O ministrante pode clicar manualmente em cada fala ou usar `REPRODUZIR HISTÓRIA` (uma fala a cada 22 segundos). Não é vídeo MP4; é uma sequência cinematográfica de imagem e texto, sem inteligência artificial.
- Cenas 3–14: distribuição dos envelopes, investigação, revelação de Lia somente na cena 7, Marcos 10:17–27 com leitura fiel ao texto, decisão coletiva e dois desfechos.

## Operação e limites importantes

A sincronização entre painel e telão funciona **apenas em janelas no mesmo computador/perfil de navegador**. Não há login real, nem backend conectado ao Caso Sete, nem votação sincronizada entre celulares. O BFF Worker/D1 histórico permanece no repositório, mas não participa desta aula. Se o usuário abrir o painel noutro dispositivo, verá uma sessão local diferente. Não use a mesma janela projetada para acessar o controle.

A sequência é **ficção educativa**. Sete, Lia, Nando e Bia são personagens fictícios. A introdução foi aprofundada sem mudar os fatos e pistas dos 13 envelopes impressos. Não mostre a revelação de Lia antes do minuto 43. O código da chave final é conferido localmente por hash. Os hashes não devem ser tratados como autenticação ou segredo seguro.

## Garantia de qualidade

`npm run test:case` confere a estrutura das 14 cenas, a introdução em oito quadros, a ordem da revelação, os 13 hashes e os controles principais.

O teste de composição visual examinou **todas as 51 falas** em 1280×720, 1366×768, 1920×1080 e 1024×768, sem sobreposição com cabeçalho/rodapé do telão. A compilação Vite/TypeScript e a publicação são verificadas pelo GitHub Actions. Isso **não substitui o ensaio real** do telão com o notebook/projetor da igreja.

## Execução

```bash
npm install
npm run test:case
npm run test:engine
npm run build
```