# Kairos Web

Aplicação front-end do Kairós, pronta para build estática e publicação via GitHub Pages.

## Rodar localmente

```bash
npm install
npm run dev --workspace=apps/web
```

Acesse http://localhost:3000.

## Build para GitHub Pages

O projeto foi configurado para exportar uma versão estática do front-end.

```bash
npm run build --workspace=apps/web
```

A saída é gerada em `apps/web/out`.

## Deploy no GitHub

1. Crie um repositório no GitHub.
2. Faça o push do projeto.
3. Ative o GitHub Pages em Settings > Pages.
4. Use a opção "GitHub Actions".
5. A action já está pronta em `.github/workflows/deploy-pages.yml`.

## Observações

- A aplicação foi adaptada para funcionar como site estático sem backend em produção.
- A API e o banco continuam no monorepo, mas a camada web foi separada para hospedar em Pages.
