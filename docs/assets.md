# Currículos e capturas de tela

Arquivos que o site espera, mas que só podem ser adicionados pelo autor. Enquanto faltarem,
o site não mostra links nem imagens provisórias.

## Currículos (PDF)

| Idioma | Arquivo |
|---|---|
| Português | `public/resume/curriculo-valter-silva-pt.pdf` |
| Inglês | `public/resume/resume-valter-silva-en.pdf` |

- A existência do arquivo é verificada no build (`src/lib/resume.ts`). Depois de adicionar um PDF,
  rode `npm run build` de novo.
- Cada idioma mostra apenas o próprio arquivo, no cabeçalho ("Baixar currículo (PDF)") e no
  contato. Sem o PDF daquele idioma, o link não aparece.
- Os links fazem download direto do arquivo local.

## Capturas de tela dos projetos

Pastas já criadas: `public/projects/orca-ai/`, `public/projects/jurimetria-ia/`, `public/projects/eitanol/`.

1. Use apenas telas reais da aplicação em funcionamento.
2. Formato WebP (ou PNG), proporção 16:9, pelo menos 1600 px de largura, de preferência abaixo de 400 KB.
3. Nomeie em ordem: `01-<tela>.webp`, `02-<tela>.webp`…
4. Declare cada captura em `src/data/projects.ts`, com texto alternativo nos dois idiomas:

   ```ts
   screenshots: [
     {
       src: "/projects/orca-ai/01-clientes.webp",
       alt: { pt: "Lista de clientes com busca paginada", en: "Customer list with paginated search" },
     },
   ],
   ```

5. A primeira captura também vira a imagem de compartilhamento (Open Graph) da página do projeto.
6. Rode `npm run test:e2e`: a suíte confere se cada captura declarada existe.

### Revisão de privacidade antes de publicar

Obrigatória para todas as capturas, especialmente as do Jurimetria IA (dados de processos judiciais):

- [ ] Nenhum nome real de parte, advogado, juiz ou servidor.
- [ ] Nenhum CPF, CNPJ, RG, e-mail, telefone, endereço, CEP ou dado bancário.
- [ ] Nenhum número de processo real (use dados fictícios de demonstração).
- [ ] Nenhuma chave de API, token, URL interna ou credencial visível.
- [ ] Coautor do projeto (Jurimetria IA) de acordo com a publicação das telas.
- [ ] Dados de demonstração preferíveis a dados mascarados: borrões podem ser revertidos.
