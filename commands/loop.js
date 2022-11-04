const {GuildMember, ApplicationCommandOptionType} = require('discord.js');
const {QueueRepeatMode} = require('discord-player');

module.exports = {
  name: 'loop',
  description: 'Зацикливание очереди, просто и понятно.',
  options: [
    {
      name: 'mode',
      type: ApplicationCommandOptionType.Integer,
      description: 'Тип зацикливания (трек, очередь, без зацикливания)',
      required: true,
      choices: [
        {
          name: 'Off',
          value: QueueRepeatMode.OFF,
        },
        {
          name: 'Track',
          value: QueueRepeatMode.TRACK,
        },
        {
          name: 'Queue',
          value: QueueRepeatMode.QUEUE,
        },
      ],
    },
  ],
  async execute(interaction, player) {
    try {
      if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) {
        return void interaction.reply({
          content: 'Ты с людьми когда разговаривать начнешь? Быстро бля зайди в голосовуху!',
          ephemeral: true,
        });
      }

      if (
        interaction.guild.members.me.voice.channelId &&
        interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId
      ) {
        return void interaction.reply({
          content: 'Ты ко мне сюда один приходи, мы тоже одни будем!',
          ephemeral: true,
        });
      }

      await interaction.deferReply();

      const queue = player.getQueue(interaction.guildId);
      if (!queue || !queue.playing) {
        return void interaction.followUp({content: '❌ | Нету ничего...'});
      }

      const loopMode = interaction.options.getInteger('mode');
      const success = queue.setRepeatMode(loopMode);
      const mode = loopMode === QueueRepeatMode.TRACK ? '🔂' : loopMode === QueueRepeatMode.QUEUE ? '🔁' : '▶';

      return void interaction.followUp({
        content: success ? `${mode} | Режим зацикливания обновлен!` : '❌ | Не могу обновить!',
      });
    } catch (error) {
      console.log(error);
      interaction.followUp({
        content: 'Ошибка при выполнении данной команды: ' + error.message,
      });
    }
  },
};
