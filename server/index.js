const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// JSONボディを読み取る設定
app.use(bodyParser.json());

// GitHub Webhook の受信エンドポイント
app.post('/webhook', (req, res) => {
  const event = req.headers['x-github-event'];
  const payload = req.body;

  console.log(`✓ GitHubイベント受信: ${event}`);

  if (event === 'push') {
    const repoName = payload.repository.full_name;
    const pusher = payload.pusher.name;
    const commits = payload.commits.map(commit => `- ${commit.message}`).join('\n');

    console.log(`>> ${pusher} が ${repoName} にプッシュしました: \n <<< コミット内容 >>> \n ${commits}`);
  }

  res.status(200).send('OK')
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`🌐　Webhook サーバーが起動しました: http://localhost:${PORT}/webhook`);
});