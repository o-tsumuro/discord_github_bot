const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds], // サーバーの基本情報を取得するためのIntent
});

// 起動時の処理
client.once('ready', () => {
  console.log(`✅ Bot がログインしました: ${client.user.tag}`);
});

// トークンでログイン
client.login(process.env.DISCORD_TOKEN);