# EVA — O Mundo Que Você Alimenta

**Experiência interativa do Ministério Conexão para adolescentes.** A EVA é personagem digital fictícia com seis capítulos e dezoito consequências roteirizadas; não é IA generativa.

## Aplicações
- `/#/telao`: telão cinematográfico;
- `/#/controle`: painel do ministrante;
- `/#/participar`: votação pelo celular;
- `/#/inicio`: abertura.

## Status
O projeto contém React + TypeScript + Vite, motor narrativo e BFF Cloudflare Worker + D1. **Sem configuração do BFF, a interface opera em modo ensaio local e não consolida votos de aparelhos diferentes.** Conferir `ROADMAP_RELEASE.md` antes de promover ao vivo.

## Build
```sh
npm install
npm run build
npm run test:engine
```

## Produção real
1. Provisionar D1 exclusivo `eva-aula`, atribuir o ID real em `worker/wrangler.toml`.
2. Executar `worker/migrations/0001_init.sql` no D1 remoto.
3. Configurar no Worker os secrets distintos `ADMIN_KEY` e `VOTER_PEPPER`.
4. Definir `CORS_ORIGIN` como a origem HTTPS exata do site publicado.
5. Publicar Worker e conferir `GET /api/health`; no frontend definir `VITE_API_URL` no build.
6. Testar votação multiaparelho e os seis capítulos antes do evento.

Segredos nunca entram no GitHub, nem em variáveis `VITE_`. O workflow de CI faz build e testes do motor em cada push. GitHub Pages não está ativado; a publicação do frontend pode ser feita na Vercel.
