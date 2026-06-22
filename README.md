<img width="1672" height="941" alt="LogicQuest" src="https://github.com/user-attachments/assets/6765b67e-170c-4720-9384-1c5a527a4998" />

## Logic Quest

Plataforma de estudo de lógica de programação com visual inspirado em editor, trilha do zero ao profissional e lições clicáveis com leitura, prática guiada e checkpoint.

## Site publicado

Quando o GitHub Pages terminar o deploy, o projeto ficará em:

https://wessyu.github.io/Logic-quest/

## O que tem no app

- 7 módulos com 28 lições.
- Navegação por explorer, tabs e painel inspector.
- Checkpoints corrigidos no próprio app.
- Sistema de contas com Supabase para salvar e carregar progresso na nuvem.
- Presença de estudo vinculada à conta, baseada nas lições concluídas por dia.
- Atalhos de teclado para navegar mais rápido pela trilha.
- Painel de progresso com XP, rank, lições restantes e última conquista.

## Supabase

O app já tem integração de conta e sincronização de progresso usando Supabase Auth + tabela `user_progress`.

### 1. Criar o banco

No Supabase, abra **SQL Editor > New query** e rode o arquivo:

```txt
supabase/schema.sql
```

Esse SQL cria a tabela `user_progress`, ativa RLS e garante que cada usuário só leia e altere o próprio progresso.

### 2. Configurar variáveis locais

Crie um arquivo `.env` com:

```env
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_ANON_KEY_AQUI
```

Tem um modelo em `.env.example`.

### 3. Configurar no GitHub Pages

No repositório, adicione as mesmas variáveis em:

`Settings > Secrets and variables > Actions > Variables`

Crie:

```txt
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

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
- Supabase Auth
- Supabase Database
