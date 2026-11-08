# Controle de Deploys — oscarcarvalho.com.br

**Projeto Cloudflare Pages:** `oscar-carvalho` (produção: https://oscarcarvalho.com.br · https://oscar-carvalho.pages.dev)
**Repositório:** https://github.com/OscarSCarvalho/miha-LangePage (branch `master`)

## Fluxo
1. Alteração feita na pasta local `C:\athos\projetos\OscarCarvalho\LandingPagePalestras`
2. Commit no Git com mensagem descritiva
3. **Pedir autorização ao Oscar** antes de publicar
4. `git push` para o `master` → GitHub Actions (`.github/workflows/deploy.yml`) publica no Cloudflare Pages
5. Registrar o deploy na tabela abaixo

> Vão para o ar apenas: `index.html`, `css/`, `js/`, `assets/`.

## Histórico

| Data | Commit | Deploy Cloudflare | Modificações |
|------|--------|-------------------|--------------|
| 2026-11-08 | — | `9a8aace1` (upload manual) | Versão em produção antes do controle automatizado — referência inicial (repo em `3cb9136`) |
