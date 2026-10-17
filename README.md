# EVA — Quem Está no Controle? / O Caso Sete

Experiência visual investigativa para uma aula cristã de 100 minutos, com quatro equipes e 13 envelopes. Construída em **React + TypeScript + Vite** e publicada no GitHub Pages. Esta versão substitui o antigo roteiro de seis votações pelo Caso Sete, mantendo o motor e os arquivos históricos no repositório.

## Acesso

- `/#/inicio`: apresentação inicial e entrada para o estúdio;
- `/#/controle`: painel do professor com navegação, cronômetro, validação dos envelopes e desfechos;
- `/#/telao`: exibição pública em tela cheia, sem gabaritos.

## Experiência

14 cenas com falas progressivas em texto; composição visual distinta para investigação, nova evidência, leitura bíblica e desfecho; 12 códigos e chave final validados por hashes; acompanhamento visual das equipes; bloqueio de saltos para a cena de Lia; ocultação do telão pelo professor; memorização do andamento e sincronização entre janelas do **mesmo navegador e computador** pelo BroadcastChannel/localStorage.

**Atenção:** esta versão não oferece autenticação de professor nem votação sincronizada entre celulares. A antiga API Cloudflare Worker/D1 permanece no repositório, mas não é utilizada pelo Caso Sete atual. Quem tiver o URL de controle pode abrir o painel em seu próprio navegador, sem afetar a aula de outra pessoa. Para operação, mantenha controle e telão no mesmo computador/perfil do navegador e faça ensaio antes de projetar.

## Sequência e cuidado pedagógico

Envelopes A1–D1 → A2–D2 → mensagem de Lia (somente aos 43 min) → Marcos 10:17–27 → A3–D3 → envelope FINAL → um dos dois desfechos. O caso e os nomes são ficcionais; não colete dados pessoais nem exponha experiências privadas dos adolescentes.

## Desenvolvimento

```bash
npm install
npm run build
npm run test:engine
```

O workflow `.github/workflows/pages.yml` publica o build do Vite no GitHub Pages. Os componentes do Caso Sete estão em `src/main.tsx`, `src/case-styles.css`, `src/case-scenes.json` e as imagens em `public/eva-*.webp`.