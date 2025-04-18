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
    const repoUrl = payload.repository.html_url;

    const message = `>> ${pusher} が ${repoName} にプッシュしました: \n ${commits}`;
    const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
    const entry = Object.entries(config).find(([guildId, info]) => info.url === repoUrl);

    if (entry) {
      const [guildId, { channelId }] = entry;
      const channel = client.channels.cache.get(channelId);
      console.log('🔍 探してるチャンネルID:', channelId);
      console.log('📦 client.channels.cache.has(channelId):', client.channels.cache.has(channelId));
      console.log('🧾 全チャンネル一覧:', [...client.channels.cache.keys()]);
      if (channel && channel.isTextBased()) {
        channel.send(message);
      } else {
        console.warn(`⚠ 通知先のチャンネルが見つからない: guildId=${guildId} channelId=${channelId}`);
      }
    } else {
      console.log(`⚠ 通知先が見つからないリポジトリ: ${repoUrl}`);
    }
  }

  res.status(200).send('OK')
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`🌐　Webhook サーバーが起動しました: http://localhost:${PORT}/webhook`);
});