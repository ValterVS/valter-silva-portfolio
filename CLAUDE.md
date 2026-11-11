# CLAUDE.md

Portfólio pessoal (Next.js, React, Tailwind CSS), publicado em https://www.valtersilva.dev.br via Vercel.
Repositório: `ValterVS/valter-silva-portfolio`.

## Publicação: nunca automática

A versão publicada no domínio deve continuar funcionando até o novo portfólio ser aprovado.

- **Não** executar `git push` (o autor faz os pushes manualmente).
- **Não** fazer merge na `main`.
- **Não** abrir Pull Requests sem autorização.
- **Não** fazer deploy na Vercel.
- **Não** usar `push --force`, `reset --hard` ou outros comandos destrutivos sem autorização.
- Trabalhar exclusivamente no branch `redesign/editorial`, salvo autorização expressa.

## Commits

Commits locais podem ser criados sem pedir autorização a cada tarefa. Ao concluir cada tarefa ou etapa que modifique arquivos:

1. Rodar as validações pertinentes: `npm run build`, `npm run lint`, `npm run typecheck` e os testes disponíveis
   (ainda não há script `test` no projeto).
2. Revisar `git status` e `git diff`.
3. Conferir que nenhum arquivo temporário, segredo, credencial ou artefato de teste será commitado.
4. Criar commits locais pequenos, claros e semânticos, no padrão Conventional Commits
   (`feat:`, `fix:`, `refactor:`, `style:`, `test:`, `docs:`, `chore:`).
5. Separar alterações independentes em commits coerentes.
6. Ao finalizar, informar hashes e mensagens dos commits, testes executados e estado do Git.

Não criar commits vazios. Se uma validação falhar, informar e resolver antes de considerar a tarefa concluída.
