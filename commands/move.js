const {GuildMember, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
  name: 'move',
  description: 'Подвинуть трек в очереди.',
  options: [
    {
      name: 'track',
      type: ApplicationCommandOptionType.Integer,
      description: 'Номер трека в очереди, который нужно подвинуть',
      required: true,
    },
    {
      name: 'position',
      type: ApplicationCommandOptionType.Integer,
      description: 'Куда подвинуть трек',
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
    const queueNumbers = [interaction.options.getInteger('track') - 1, interaction.options.getInteger('position') - 1];
    if (queueNumbers[0] > queue.tracks.length || queueNumbers[1] > queue.tracks.length)
      return void interaction.followUp({content: '❌ | Чет ты с цифрой проебался, треков в очереди меньше'});

    try {
      const track = queue.remove(queueNumbers[0]);
      queue.insert(track, queueNumbers[1]);
      return void interaction.followUp({
        content: `✅ | Переместил **${track}**!`,
      });
    } catch (error) {
      console.log(error);
      return void interaction.followUp({
        content: '❌ | Что-то сломалось...',
      });
    }
  },
};
