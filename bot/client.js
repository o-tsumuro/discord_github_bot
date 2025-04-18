const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [ // サーバーの基本情報を取得するためのIntent
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

module.exports = client;