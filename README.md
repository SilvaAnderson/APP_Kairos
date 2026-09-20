# Kairos

App de microlearning e gamificação para grupos de jovens da Igreja Católica.

## Visão geral

Este repositório foi reorganizado para permitir:

- desenvolvimento local do monorepo
- build estática da interface web
- deploy via GitHub Pages usando GitHub Actions

## Estrutura atual

```text
apps/
  web/        Front-end em Next.js para GitHub Pages
  api/        Backend em Fastify (opcional para desenvolvimento local)
packages/
  db/         Prisma e acesso ao banco
.github/
  workflows/
    deploy-pages.yml
```

## Como rodar localmente

```bash
npm install
npm run dev:web
```

## Como publicar no GitHub

1. Crie um repositório no GitHub.
2. Faça push do código.
3. Vá em Settings > Pages.
4. Selecione "GitHub Actions" como fonte.
5. O workflow em `.github/workflows/deploy-pages.yml` já gera e publica a app.

## Build estática

```bash
npm run build:web
```

A saída fica em `apps/web/out` e pode ser hospedada em Pages.

## Observação importante

A versão pública do app no GitHub é uma interface estática. O backend e o banco continuam no monorepo para desenvolvimento local, mas não precisam estar ativos em produção no GitHub Pages.
