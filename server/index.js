require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const client = require('../bot/client');

  // サーバー起動
const app = express();
const PORT = 3000;

const CONFIG_FILE = path.join(__dirname, '../data/repo-config.json');

// JSONボディを読み取る設定
app.use(bodyParser.json());

// GitHub Webhook の受信エンドポイント
app.post('/webhook', async (req, res) => {
  const event = req.headers['x-github-event'];
  const payload = req.body;

  console.log(`✓ GitHubイベント受信: ${event}`);

  if (event === 'push') {
    const repoName = payload.repository.full_name;
    const pusher = payload.pusher.name;
    const commits = payload.commits.map(commit => `- ${commit.message}`).join('\n');
    const repoUrl = payload.repository.html_url;

    const message = `>> ${pusher} が ${repoName} にプッシュしました: \n ${commits}`;
    const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
    const entry = Object.entries(config).find(([guildId, info]) => info.url === repoUrl);

    if (entry) {
    const [guildId, { channelId }] = entry;

      try {
        const channel = await client.channels.fetch(channelId);
        if (channel && channel.isTextBased()) {
          channel.send(message);
        } else {
          console.warn(`⚠ 通知先のチャンネルが見つからない: guildId=${guildId} channelId=${channelId}`);
        }
      } catch (error) {
        console.error('チャンネル取得エラー:', error);
      }
    } else {
      console.log(`⚠ 通知先が見つからないリポジトリ: ${repoUrl}`);
    }
  }

  res.status(200).send('OK');
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`🌐　Webhook サーバーが起動しました: http://localhost:${PORT}/webhook`);
});