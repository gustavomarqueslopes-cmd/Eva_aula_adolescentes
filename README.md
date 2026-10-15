# EVA — O Mundo Que Você Alimenta

Experiência interativa para adolescentes do Ministério Conexão: uma personagem digital fictícia muda de acordo com decisões coletivas. **A EVA não é uma IA generativa nem possui consciência**; os resultados seguem roteiro e regras definidos.

## Site publicado

**Prévia pública da EVA:** https://eva-aula-adolescentes.vercel.app/

Publicado na Vercel como site HTML estático. A implantação de produção foi marcada READY em 15/10/2026, com proteção de login desativada. A publicação atual é manual: atualizações no GitHub não disparam automaticamente uma nova implantação na Vercel.

## Estado da primeira publicação

- `index.html`: **prévia demonstrativa interativa e responsiva**, com telão, estúdio e tela de participação.
- Este site está **em modo de ensaio local**, não em votação multiaparelho. Votos de celulares diferentes não são sincronizados nesta publicação.
- O próximo marco é integrar a aplicação React/TypeScript com Cloudflare Worker + D1 para votação centralizada.
- Sem cadastro, nome, telefone ou identificação pessoal dos adolescentes.

## Experimentar

Abra o site no navegador. No **Estúdio**, inicie uma votação; em **Participar**, registre a decisão; retorne ao Estúdio para revelar o resultado e avançar nas consequências. A prévia pode simular votos para ensaio.

## Publicação

A prévia pública está disponível na Vercel: https://eva-aula-adolescentes.vercel.app/ . O GitHub Pages **não está ativado** no repositório; por isso o workflow `.github/workflows/pages.yml` ficou em execução manual para evitar falhas automáticas a cada commit. A ativação futura exige a configuração em **Settings → Pages → Build and deployment → GitHub Actions**. Não divulgue esta prévia como votação ao vivo antes de configurar e testar a API real.

## Próximas etapas

1. Publicar e validar frontend React + TS.
2. Implantar BFF Cloudflare Worker + banco D1 com chave administrativa e prevenção simples de voto duplicado.
3. Conectar frontend ao BFF, realizar homologação com múltiplos celulares e ensaio de falha de rede.
4. Revisão de narrativa e privacidade com a liderança do ministério.

**Atenção:** GitHub Pages serve somente arquivos estáticos; não hospeda banco de dados nem protege secrets de backend.
