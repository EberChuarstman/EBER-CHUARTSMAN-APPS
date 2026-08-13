# SaúdeHub

Plataforma digital para compra e venda de conteúdos profissionais de saúde.

O projeto reúne:

- marketplace de cursos, documentos, planilhas e videoaulas;
- biblioteca do aluno;
- painel do produtor;
- painel administrativo financeiro;
- aplicativo Android conectado à plataforma.

## Site

[Abrir SaúdeHub](https://saudehub.eberchuarstman.chatgpt.site)

## Aplicativo Android

[Baixar a versão mais recente do APK](https://github.com/EberChuarstman/EBER-CHUARTSMAN-APPS/releases/latest/download/SaudeHub-Android-v1.0.0.apk)

Versão atual: `1.0.0`. O APK abre a plataforma SaúdeHub em uma experiência otimizada para celular e recebe automaticamente as atualizações publicadas no site.

## Desenvolvimento

Requisitos:

- Node.js 22.13 ou superior;
- npm.

Comandos principais:

```bash
npm install
npm run dev
npm run build
```

O código do aplicativo Android está em `android-app/`. O instalador publicado fica em `public/downloads/` e também é anexado automaticamente à Release correspondente no GitHub.

## Tecnologias

- React e TypeScript;
- Vinext/Vite;
- Cloudflare Workers;
- Android WebView.

## Situação do projeto

Esta é uma versão demonstrativa. Login definitivo, pagamentos reais, armazenamento de conteúdos e publicação na Google Play exigem as integrações comerciais correspondentes.
