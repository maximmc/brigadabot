const {GuildMember} = require('discord.js');

module.exports = {
  name: 'shuffle',
  description: 'Перемешать очередь',
  async execute(interaction, player) {
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
    if (!queue || !queue.playing) return void interaction.followUp({content: '❌ | Нету ничего'});
    try {
      queue.shuffle();
      trimString = (str, max) => (str.length > max ? `${str.slice(0, max - 3)}...` : str);
      return void interaction.followUp({
        embeds: [
          {
            title: 'Сейчас играет',
            description: trimString(
              `Сейчас ебашит 🎶 | **${queue.current.title}**! \n 🎶 | ${queue}! `,
              4095,
            ),
          },
        ],
      });
    } catch (error) {
      console.log(error);
      return void interaction.followUp({
        content: '❌ | Что-то сломалось...',
      });
    }
  },
};
