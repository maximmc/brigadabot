const {GuildMember} = require('discord.js');

module.exports = {
  name: 'stop',
  description: 'Остановить все треки в очереди',
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
    if (!queue || !queue.playing)
      return void interaction.followUp({
        content: '❌ | Ниче не играет...',
      });
    queue.destroy();
    return void interaction.followUp({content: '🛑 | Стопнул!'});
  },
};
