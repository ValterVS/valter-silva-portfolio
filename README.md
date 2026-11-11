# Valter Silva — Portfolio

Meu portfólio pessoal, desenvolvido para apresentar minha experiência, projetos e tecnologias que utilizo.

🌐 [valtersilva.dev.br](https://www.valtersilva.dev.br)

## Tecnologias

- Next.js
- TypeScript
- Tailwind CSS
- Motion
- Three.js
- React Three Fiber

## Rodando o projeto

Requer Node.js 20.9 ou superior.

```bash
npm install
npm run dev
```

## Verificações

```bash
npm run lint
npm run typecheck
npm run build
```

## Testes de ponta a ponta (Playwright)

Na primeira vez, instale o navegador usado pelos testes (fica no cache do Playwright, fora do repositório):

```bash
npx playwright install chromium
```

Depois:

```bash
npm run test:e2e
```

O comando gera o build de produção, sobe o site na porta 3100 (ou na definida em `E2E_PORT`) e roda os
testes em dois perfis: desktop (1440 px) e celular (Pixel 7). Em caso de falha, screenshots e traces ficam
em `test-results/`, que não vai para o Git.

## Currículos e capturas de tela

Veja [docs/assets.md](docs/assets.md).
