require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('⌛ スラッシュコマンドを登録中...');

    await rest.put(
      // CLIENT_IDはApplicationのOAuth2のClient informationから入手
      // GUILD_IDは開発者モードでbotが居るサーバーを右クリックしてコピー
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands },
    );

    console.log('✅ スラッシュコマンドの登録完了！');
  } catch (error) {
    console.error(error);
  }
})();