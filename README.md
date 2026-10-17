# EVA · Quem Está no Controle? — Caso Sete

Aplicação da aula imersiva de 100 minutos para adolescentes, com a personagem EVA em imagem e texto, sem IA generativa nem vídeos obrigatórios. Conteúdo alinhado ao kit impresso do Projeto Ponte: quatro equipes, 13 envelopes, 12 validações e Protocolo Final.

## Acesso público

- Aula: https://gustavomarqueslopes-cmd.github.io/Eva_aula_adolescentes/
- Controle do professor: `/#/controle`
- Telão: `/#/telao`

O controle e o telão sincronizam em abas e janelas do **mesmo navegador/origem** via `BroadcastChannel` + `localStorage`, inclusive se atualizados. Esta implantação não sincroniza aparelhos diferentes pela internet. O controle é operacional e não tem autenticação de servidor; mantenha-o na máquina do professor. Para sincronização remota e contas, implantar o BFF Cloudflare Worker + D1 já presente neste repositório, adaptando sua API do motor anterior para os eventos do Caso Sete. Não colocar segredos no frontend.

## Condução

A liberação é manual: Rodada 1 no minuto 13; Rodada 2 no minuto 30; mensagem de Lia só após o minuto 43; texto bíblico Marcos 10:17–27; Rodada 3 minuto 63; FINAL minuto 80; desfecho minuto 90. Nenhum dado pessoal é coletado. A validação usa hashes SHA-256, não exibe o gabarito no telão. Não trate o hash como controle de segurança forte.

## Desenvolvimento

`npm install && npm run dev` para desenvolvimento. `npm run build` compila para Vite. GitHub Actions compila/publica automaticamente no Pages em push para `main`, com `GITHUB_PAGES=true`. O roteiro anterior de seis votações permanece em arquivos do motor como referência de legado, mas não está conectado a esta aula.