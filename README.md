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

## Deploy gratuito da API

A API pode ser hospedada em serviços gratuitos como Render, Railway ou Fly.io. A opção mais simples e estável para este projeto é o Render, usando um banco gratuito como Supabase ou Neon.

### Opção recomendada: Render + Supabase/Neon

1. Crie conta no Render.
2. Conecte o repositório GitHub.
3. Crie um Web Service usando o arquivo `render.yaml` deste repositório.
4. Crie um banco PostgreSQL gratuito em Supabase ou Neon.
5. Configure as variáveis de ambiente:
   - `DATABASE_URL` → URL do PostgreSQL gratuito
   - `JWT_SECRET` → string forte aleatória
   - `PORT` → `10000` (Render define isso automaticamente em muitos casos)
6. Faça o deploy.

> Render e Supabase/Neon são uma combinação muito acessível para um projeto em free tier, e servem bem para a API do Kairos.

### Build da API

```bash
npm install
npm run generate --workspace=packages/db
npm run build --workspace=apps/api
```

### Iniciar a API em produção

```bash
npm run start --workspace=apps/api
```

## Build estática

```bash
npm run build:web
```

A saída fica em `apps/web/out` e pode ser hospedada em Pages.

## Observação importante

A versão pública do app no GitHub é uma interface estática. O backend precisa ficar em um serviço externo para funcionar em produção. O banco também deve ficar em um provedor externo gratuito ou em uma instância dedicada.
