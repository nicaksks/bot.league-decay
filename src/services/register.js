const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
const { clientId, guildId, token } = require('../util/config.json');

const commands = [];
const commandFiles = fs.readdirSync('../comandos/').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`../comandos/${file}`);
	if (["MESSAGE", "USER"].includes(file.type)) delete file.description;
	commands.push(command.data)
}

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
	try {
		await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		console.log('Os comandos com de Slash Commands foram registrados com sucesso no servidor local!');
	} catch (error) {
		console.error(error);
	}
})();