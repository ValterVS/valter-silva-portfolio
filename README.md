# Valter Silva — Portfolio

Portfólio pessoal de Valter da Silva, publicado em [valtersilva.dev.br](https://valtersilva.dev.br). Bilíngue (português e inglês), com uma cena 3D na abertura e todo o conteúdo separado em arquivos de dados.

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Motion · Three.js com React Three Fiber e Drei · Lucide

## Rodando localmente

Requer Node.js 20.9 ou superior.

```bash
npm install
npm run dev        # http://localhost:3000
```

Outros comandos: `npm run lint`, `npm run typecheck`, `npm run build` e `npm start`.

## Estrutura

```
src/
  app/[locale]/        páginas (home e /projects/[slug]), layout e metadata
  app/og/              imagem de compartilhamento gerada no build
  components/          seções do site
  components/scene/    cena 3D da hero e versão em SVG
  data/                todo o conteúdo do portfólio
  i18n/                idiomas e textos fixos da interface
  proxy.ts             escolha de idioma (cookie) e rotas / e /en
public/
  resume/              currículos em PDF
  projects/            imagens dos projetos
```

O português fica em `/` e o inglês em `/en`. A escolha do visitante é salva no cookie `lang` e respeitada nas próximas visitas.

## Atualizando conteúdo

Todo texto que aparece no site está em `src/data` ou em `src/i18n/ui.ts`. Campos traduzidos seguem sempre o formato `{ pt: "...", en: "..." }`.

| O quê | Onde |
|---|---|
| Nome, links, e-mail, telefone, texto "sobre" | `src/data/profile.ts` |
| Experiências | `src/data/experience.ts` |
| Formação e cursos | `src/data/education.ts` |
| Tecnologias | `src/data/skills.ts` |
| Projetos | `src/data/projects.ts` |
| Menus, botões e títulos das seções | `src/i18n/ui.ts` |

**Novo projeto:** adicione um objeto em `projects` (`src/data/projects.ts`). Com `featured: true` ele vai para o destaque; com `details` preenchido ganha a página `/projects/<slug>`. Campos que não forem preenchidos simplesmente não aparecem.

**Screenshots:** coloque as imagens em `public/projects/<slug>/` e referencie no projeto, por exemplo `image: "/projects/eitanol/cover.png"` e `screenshots: ["/projects/eitanol/01.png"]`. Sem `image`, o card usa uma capa gerada.

**Tecnologias:** cada item tem `usage` com `professional`, `projects` e/ou `studies`, o que indica no site onde ela foi usada.

**Novo idioma:** inclua o código em `locales` (`src/i18n/config.ts`). O TypeScript passa a apontar todos os textos que precisam da nova tradução.

## Currículo

Coloque os arquivos com estes nomes:

```
public/resume/curriculo-valter-silva-pt.pdf
public/resume/resume-valter-silva-en.pdf
```

O botão usa o PDF do idioma atual. Se só um existir, ele é usado nos dois idiomas; sem nenhum, o botão some. Os nomes podem ser alterados em `profile.resume`.

## Deploy

1. Suba o repositório para o GitHub.
2. Na Vercel, **Add New → Project** e importe o repositório. As configurações padrão de Next.js funcionam sem ajustes.
3. Em **Settings → Domains**, adicione `valtersilva.dev.br` e configure o DNS conforme indicado pela Vercel.

A URL usada em metadata, sitemap e Open Graph fica em `siteUrl` (`src/data/profile.ts`).
