const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [ // サーバーの基本情報を取得するためのIntent
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('ready', () => {
  console.log(`✓ Bot がログインしました: ${client.user.tag}`);
});

// トークンでログイン
// 任意のApplicationのBotのTokenから入手
client.login(process.env.DISCORD_TOKEN);

module.exports = client;