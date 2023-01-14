const { Client, Intents, GatewayIntentBits, Discord, Collection } = require('discord.js');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
});

const { token } = require('./util/config.json');
const fs = require('fs');

client.on('ready', () => {
  console.log('online!')
})

client.commands = new Collection();
const Slashcommands = fs.readdirSync('./src/comandos').filter(file => file.endsWith('.js'));

for (const file of Slashcommands) {
  const command = require(`../src/comandos/${file}`);
  client.commands.set(command.data.name, command);
}

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
  }
});

client.login(token);