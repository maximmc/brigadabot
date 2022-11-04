const {GuildMember, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
  name: 'remove',
  description: 'Удалить трек из очереди',
  options: [
    {
      name: 'number',
      type: ApplicationCommandOptionType.Integer,
      description: 'Номер трека, который нужно убрать нахуй',
      required: true,
    },
  ],
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
    if (!queue || !queue.playing) return void interaction.followUp({content: '❌ | Нету ничего...'});
    const number = interaction.options.getInteger('number') - 1;
    if (number > queue.tracks.length)
      return void interaction.followUp({content: '❌ | Чет ты с цифрой проебался, нет столько треков'});
    const removedTrack = queue.remove(number);
    return void interaction.followUp({
      content: removedTrack ? `✅ | Убрал нахуй, больше эту хуйню сюда не закидывай! **${removedTrack}**!` : '❌ | Что-то сломалось...',
    });
  },
};
