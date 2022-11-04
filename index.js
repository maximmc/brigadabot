require('dotenv').config()

const fs = require('fs');
const Discord = require('discord.js');
const Client = require('./client/Client');
const config = require('./config.json');
const {Player} = require('discord-player');

const { ActivityType } = require('discord.js');

const client = new Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

console.log(client.commands);

const player = new Player(client);

player.on('error', (queue, error) => {
  console.log(`[${queue.guild.name}] Error emitted from the queue: ${error.message}`);
});

player.on('connectionError', (queue, error) => {
  console.log(`[${queue.guild.name}] Error emitted from the connection: ${error.message}`);
});

player.on('trackStart', (queue, track) => {
  queue.metadata.send(`▶ | Ща буду жёстко хуярить: **${track.title}** в канале **${queue.connection.channel.name}**!`);
});

player.on('trackAdd', (queue, track) => {
  queue.metadata.send(`🎶 | Закинул **${track.title}** в очередь, теперь жди бля!`);
});

player.on('botDisconnect', queue => {
  queue.metadata.send('❌ | Ты нахуя меня из канала кикнул? Минус очередь, долбаеб...');
});

player.on('channelEmpty', queue => {
  queue.metadata.send('❌ | Пусто тут, даже очень...');
});

player.on('queueEnd', queue => {
  queue.metadata.send('✅ | Всё, закинь еще что-нибудь плз...');
});

client.once('ready', async () => {
  console.log('Ready!');
});

client.on('ready', function() {
  client.user.setPresence({
    activities: [{ name: config.activity, type: config.activityType }],
    status: 'Радую Бригаду ОХУЕННЫМИ треками',
  });
});

client.once('reconnecting', () => {
  console.log('Reconnecting!');
});

client.once('disconnect', () => {
  console.log('Disconnect!');
});

client.on('messageCreate', async message => {
  if (message.author.bot || !message.guild) return;
  if (!client.application?.owner) await client.application?.fetch();

  if (message.content === '!deploy' && message.author.id === client.application?.owner?.id) {
    await message.guild.commands
      .set(client.commands)
      .then(() => {
        message.reply('Готов к разъебу!');
      })
      .catch(err => {
        message.reply('Не могу развернуть команды! Нужно разрешение application.commands!');
        console.error(err);
      });
  }
});

client.on('interactionCreate', async interaction => {
  const command = client.commands.get(interaction.commandName.toLowerCase());

  try {
    if (interaction.commandName == 'ban' || interaction.commandName == 'userinfo') {
      command.execute(interaction, client);
    } else {
      command.execute(interaction, player);
    }
  } catch (error) {
    console.error(error);
    interaction.followUp({
      content: 'Ошибка при выполнении команды!',
    });
  }
});

client.login(process.env.DISCORD_TOKEN);
