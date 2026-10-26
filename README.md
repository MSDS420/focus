# FOCUS

Aplicativo pessoal de objetivos diários, feito em HTML, CSS e JavaScript puro. Os dados ficam no `localStorage` do navegador; não há conta nem sincronização entre dispositivos.

## Testar localmente

Execute `node tests/test-app.cjs` para validar as regras principais. Para usar o aplicativo, abra `index.html` no navegador ou sirva esta pasta com um servidor estático (por exemplo, `python -m http.server 8000`) e acesse `http://localhost:8000`. O servidor ajuda a simular melhor a publicação, embora o app também seja estático.

## Publicar no GitHub Pages

1. Crie um repositório GitHub e envie `index.html`, `style.css` e `app.js` para a branch principal.
2. No repositório, abra **Settings → Pages**.
3. Em **Build and deployment**, escolha **Deploy from a branch**, selecione a branch principal e a pasta `/ (root)`, e salve.
4. Aguarde a URL exibida pelo GitHub Pages e abra-a. Os dados permanecem neste navegador e neste dispositivo.

## Regras do histórico

Conclusões e recompensas individuais são registradas uma única vez. Um dia passado é fechado na primeira abertura posterior; nesse fechamento, só contam tarefas então agendadas para aquele dia e marcadas como concluídas na própria data. Depois de fechado, o registro de dia perfeito não é recalculado. A aplicação precisa ser aberta após o dia terminar para fechar o registro, já que esta versão não executa em segundo plano.


