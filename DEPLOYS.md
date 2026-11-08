# Controle de Deploys — oscarcarvalho.com.br

**Projeto Cloudflare Pages:** `oscarcarvalho` — integração nativa com GitHub (produção: https://oscarcarvalho.com.br · https://oscarcarvalho.pages.dev)
**Repositório:** https://github.com/OscarSCarvalho/miha-LangePage (branch `master`)

## Fluxo
1. Alteração feita na pasta local `C:\athos\projetos\OscarCarvalho\LandingPagePalestras`
2. Commit no Git com mensagem descritiva
3. `git push` para o `master` → a Cloudflare publica automaticamente
4. Registrar o deploy na tabela abaixo

## Histórico

| Data | Commit | Deploy Cloudflare | Modificações |
|------|--------|-------------------|--------------|
| 2026-11-08 | — | `9a8aace1` (upload manual) | Versão em produção antes do controle automatizado — referência inicial (repo em `3cb9136`) |
| 2026-11-08 | (este commit) | automático (push no master) | Card "Hoje": curso superior 0 → 1 (Análise e Desenvolvimento de Sistemas); remove workflow do GitHub Actions |
| 2026-11-08 | (este commit) | automático (push no master) | Seção Família: carrossel horizontal estilo Spotify com 5 fotos, animação em cascata, hover com zoom e brilho, botões de navegação; Antes/Hoje em cards de destaque |
| 2026-11-08 | (este commit) | automático (push no master) | Nova seção "A Jornada" (motion em canvas, 10s em loop: escadaria 3D da vida perdida à conquista); card da foto do carro corrigido para "Eu e minha filha Julia"; card Athos Tecnologia removido da seção Hoje |
