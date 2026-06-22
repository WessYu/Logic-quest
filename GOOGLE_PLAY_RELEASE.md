# Publicar Logic Quest na Google Play

Este projeto está preparado para virar app Android usando Capacitor.

## 1. Criar conta na Google Play Console

Crie uma conta em: https://play.google.com/console

A conta de desenvolvedor da Google Play normalmente exige taxa única de cadastro. Depois de aprovada, você consegue criar o app.

## 2. Preparar ambiente local

Instale:

- Node.js LTS
- Android Studio
- Java/JDK compatível com Android Studio

Depois rode:

```bash
npm install
npm run build
npx cap add android
npx cap sync android
npx cap open android
```

## 3. Gerar o arquivo para a loja

No Android Studio:

1. Abra o projeto Android gerado pelo Capacitor.
2. Vá em **Build > Generate Signed Bundle / APK**.
3. Escolha **Android App Bundle**.
4. Crie ou selecione uma keystore.
5. Gere o arquivo `.aab` em modo release.

A Google Play usa Android App Bundle (`.aab`) para publicação de novos apps.

## 4. Criar app na Play Console

Na Play Console:

1. Clique em **Create app**.
2. Nome: `Logic Quest`.
3. Idioma: Português (Brasil).
4. Tipo: App.
5. Gratuito ou pago.
6. Preencha as declarações iniciais.

## 5. Informações obrigatórias

Prepare:

- Ícone do app em alta resolução.
- Screenshots de celular.
- Descrição curta.
- Descrição completa.
- Política de privacidade.
- Classificação indicativa.
- Formulário de segurança dos dados.
- Público-alvo.

## 6. Textos sugeridos

Descrição curta:

```txt
Aprenda lógica de programação do zero ao profissional com trilha, XP e progresso salvo.
```

Descrição completa:

```txt
Logic Quest é uma plataforma gamificada para aprender lógica de programação do zero ao profissional.

Estude fundamentos, variáveis, operadores, decisões, laços, funções, estruturas de dados, JavaScript, interface, APIs, testes, backend e arquitetura de fluxo.

O app possui trilha guiada, leitura prática, checkpoints, XP, progresso por conta e presença de estudo baseada nas lições concluídas.
```

## 7. Política de privacidade

Como o app usa login e salva progresso com Supabase, publique uma política de privacidade antes de enviar para análise.

Você pode hospedar em uma página simples no GitHub Pages, no próprio site do app ou em um documento público.

## 8. Enviar para análise

Depois que tudo estiver preenchido:

1. Crie uma release de produção.
2. Envie o `.aab`.
3. Revise erros e avisos.
4. Envie para análise.

A aprovação depende da análise da Google Play.
