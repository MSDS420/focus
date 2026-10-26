# FOCUS

Aplicativo pessoal de objetivos diários, feito em HTML, CSS e JavaScript puro. Os dados ficam no `localStorage` do navegador; não há conta nem sincronização entre dispositivos.

## Testar localmente

Execute `node tests/test-app.cjs` para validar as regras principais. Para usar o aplicativo, abra `index.html` no navegador ou sirva esta pasta com um servidor estático (por exemplo, `python -m http.server 8000`) e acesse `http://localhost:8000`. O servidor ajuda a simular melhor a publicação, embora o app também seja estático.

## Publicar no GitHub Pages

1. Crie um repositório GitHub e envie os arquivos `index.html`, `style.css`, `app.js`, `manifest.webmanifest`, `sw.js` e `focus-icon.svg` para a raiz da branch principal.
2. No repositório, abra **Settings → Pages**.
3. Em **Build and deployment**, escolha **Deploy from a branch**, selecione a branch principal e a pasta `/ (root)`, e salve.
4. Aguarde a URL exibida pelo GitHub Pages e abra-a. Os dados permanecem neste navegador e neste dispositivo.
5. Para ativar o lembrete diário, abra o FOCUS pela URL HTTPS do GitHub Pages, permita notificações e toque em **Ativar lembrete**.

Os lembretes das 07h e das 19h aparecem enquanto o FOCUS está aberto. Sem um serviço de push no servidor, o navegador não consegue agendar notificações quando o app está fechado. O projeto inclui `manifest.webmanifest`, `sw.js` e `focus-icon.svg` para suporte básico a PWA.

## Regras do histórico

Conclusões e recompensas individuais são registradas uma única vez. Um dia passado é fechado na primeira abertura posterior; nesse fechamento, só contam tarefas então agendadas para aquele dia e marcadas como concluídas na própria data. Depois de fechado, o registro de dia perfeito não é recalculado. A aplicação precisa ser aberta após o dia terminar para fechar o registro, já que esta versão não executa em segundo plano.


