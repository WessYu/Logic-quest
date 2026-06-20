<img width="1672" height="941" alt="LogicQuest" src="https://github.com/user-attachments/assets/6765b67e-170c-4720-9384-1c5a527a4998" />
# Logic Quest

Plataforma de estudo de lógica de programação com visual inspirado em editor, trilha do zero ao profissional e lições clicáveis com leitura, prática guiada e checkpoint.

## Site publicado

Quando o GitHub Pages terminar o deploy, o projeto ficará em:

https://wessyu.github.io/Logic-quest/

## O que tem no app

- 7 módulos com 28 lições.
- Navegação por explorer, tabs e painel inspector.
- Checkpoints corrigidos no próprio app com progresso salvo em `localStorage`.
- Atalhos de teclado para navegar mais rápido pela trilha.
- Painel de progresso com XP, rank, lições restantes e última conquista.

## Atalhos

- `Ctrl/Cmd + K`: abre a busca do curso.
- `Ctrl/Cmd + 1`: abre a visão geral da lição.
- `Ctrl/Cmd + 2`: abre o conteúdo da lição.
- `Ctrl/Cmd + 3`: abre o checkpoint.
- `Ctrl/Cmd + Enter`: corrige o checkpoint quando a aba de quiz estiver aberta.
- `Alt + Left/Right`: volta ou avança entre lições.

## Como rodar

```bash
npm install
npm run dev
```

## Build de produção

```bash
npm run build
```

## Deploy

O deploy está configurado com GitHub Actions em `.github/workflows/deploy.yml`.

Para publicar no GitHub Pages, use **Settings > Pages > Build and deployment > Source: GitHub Actions**.

## Stack

- React
- Vite
- CSS puro
