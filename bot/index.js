const fs = require('fs');
const path = require('path');
client.commands = new Map();

// コマンド読み込み
const commandsPath = path.join(__dirname, '../commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  client.commands.set(command.data.name, command);
}

// コマンドが使われた時の処理
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch(error) {
    console.error(error);
    await interaction.reply({ content: 'エラーが発生しました。', ephemeral: true });
  }
});