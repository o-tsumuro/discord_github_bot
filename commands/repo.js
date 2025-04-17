const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const CONFIG_FILE = path.join(__dirname, '../data/repo-config.json');

function saveRepoURL(guildId, url) {
  let data = {};
  if (fs.existsSync(CONFIG_FILE)) {
    data = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
  }

  data[guildId] = { url };

  fs.writeFileSync(CONFIG_FILE, JSON.stringify(data, null, 2));
}

module.exports = {
  data: new SlashCommandBuilder()
  .setName('repo')
  .setDescription('通知う対象のGitHubリポジトリを設定します')
  .addStringOption(option =>
    option.setName('url')
      .setDescription('GitHubのリポジトリのURLを入力してください')
      .setRequired(true)),

    async execute(interaction) {
      const url = interaction.options.getString('url');
      const guildId = interaction.guildId;

      saveRepoURL(guildId, url);
      
      await interaction.reply(`✓ GitHubリポジトリを登録しました: ${url}`);
    }
};