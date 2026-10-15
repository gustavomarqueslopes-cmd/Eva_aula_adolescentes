# EVA — O Mundo Que Você Alimenta

Experiência interativa para adolescentes do Ministério Conexão: uma personagem digital fictícia muda de acordo com decisões coletivas. **A EVA não é uma IA generativa nem possui consciência**; os resultados seguem roteiro e regras definidos.

## Estado da primeira publicação

- `index.html`: **prévia demonstrativa interativa e responsiva**, com telão, estúdio e tela de participação.
- Este site está **em modo de ensaio local**, não em votação multiaparelho. Votos de celulares diferentes não são sincronizados nesta publicação.
- O próximo marco é integrar a aplicação React/TypeScript com Cloudflare Worker + D1 para votação centralizada.
- Sem cadastro, nome, telefone ou identificação pessoal dos adolescentes.

## Experimentar

Abra o site no navegador. No **Estúdio**, inicie uma votação; em **Participar**, registre a decisão; retorne ao Estúdio para revelar o resultado e avançar nas consequências. A prévia pode simular votos para ensaio.

## Publicação

O workflow `.github/workflows/pages.yml` publica esta prévia HTML no GitHub Pages a cada push na `main`. Em **Settings → Pages → Build and deployment**, escolha **GitHub Actions**. Não divulgue como votação ao vivo antes de configurar e testar a API real.

## Próximas etapas

1. Publicar e validar frontend React + TS.
2. Implantar BFF Cloudflare Worker + banco D1 com chave administrativa e prevenção simples de voto duplicado.
3. Conectar frontend ao BFF, realizar homologação com múltiplos celulares e ensaio de falha de rede.
4. Revisão de narrativa e privacidade com a liderança do ministério.

**Atenção:** GitHub Pages serve somente arquivos estáticos; não hospeda banco de dados nem protege secrets de backend.
