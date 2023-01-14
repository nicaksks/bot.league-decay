const { SlashCommandBuilder } = require('discord.js');
const decay = require('../api/riot'); 

module.exports = {
  data: new SlashCommandBuilder()
    .setName('decay')
    .setDescription('Verificar a inatividade da sua conta. (SOLOQ)')
    .addStringOption(option => option
      .setName('nickname')
      .setDescription('Nome de invocador.')
      .setRequired(true)),
  async execute(interaction) {

    await interaction.reply({ content: 'Aguarde uns segundos.', ephemeral: true });

    const nickname = await interaction.options.getString('nickname');
    if(nickname.length < 3) return interaction.reply('O nome de invocador precisa ter mais de **3 digitos**.');
    if(nickname.length > 16) return interaction.reply('O nome de invocador precisa ter **16 digitos** ou menos');

    decay(nickname, interaction);

  },
};