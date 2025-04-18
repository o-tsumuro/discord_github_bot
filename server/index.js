const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const client = require('../bot/client');

const app = express();
const PORT = 3000;

const CONFIG_FILE = path.join(__dirname, '../data/repo-config.json');

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

    const message = `>> ${pusher} が ${repoName} にプッシュしました: \n ${commits}`;
    console.log(message);

    // 通知対象のチャンネル取得
    const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
    for (const guildId in config) {
      const guild = client.guilds.cache.get(guildId);
      if (!guild) continue;

      // チャンネルは仮で最初に見つかったテキストチャンネルに送信
      const channel = guild.channels.cache.find(c => c.isTextBased() && c.viewable);
      if (channel) {
        channel.send(message);
      }
    }
  }

  res.status(200).send('OK')
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`🌐　Webhook サーバーが起動しました: http://localhost:${PORT}/webhook`);
});