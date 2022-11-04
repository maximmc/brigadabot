const fs = require('fs');

module.exports = {
  name: 'help',
  description: 'Список всех доступных команд. Вроде и так понятно, зачем ты это вообще читаешь...',
  execute(interaction) {
    let str = '';
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
      const command = require(`./${file}`);
      str += `Команда: ${command.name}, Описание: ${command.description} \n`;
    }

    return void interaction.reply({
      content: str,
      ephemeral: true,
    });
  },
};
