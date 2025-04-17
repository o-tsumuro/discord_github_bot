const { SlashCommandBuilder } = require('discord.js');

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
      await interaction.reply(`✅ GitHubリポジトリを登録しました: ${url}`);
    }
};