const {GuildMember, ApplicationCommandOptionType } = require('discord.js');
const {QueryType} = require('discord-player');

module.exports = {
  name: 'play',
  description: 'Жестко навалить какого-нибудь трека!',
  options: [
    {
      name: 'query',
      type: ApplicationCommandOptionType.String,
      description: 'Что нужно навалить',
      required: true,
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

      const query = interaction.options.getString('query');
      const searchResult = await player
        .search(query, {
          requestedBy: interaction.user,
          searchEngine: QueryType.AUTO,
        })
        .catch(() => {});
      if (!searchResult || !searchResult.tracks.length)
        return void interaction.followUp({content: 'Пусто!'});

      const queue = await player.createQueue(interaction.guild, {
        ytdlOptions: {
				quality: "highest",
				filter: "audioonly",
				highWaterMark: 1 << 30,
				dlChunkSize: 0,
			},
        metadata: interaction.channel,
      });

      try {
        if (!queue.connection) await queue.connect(interaction.member.voice.channel);
      } catch {
        void player.deleteQueue(interaction.guildId);
        return void interaction.followUp({
          content: 'Чет зайти не могу, пацаны, пофиксите пж...',
        });
      }

      await interaction.followUp({
        content: `⏱ | Загрузка ${searchResult.playlist ? 'плейлиста' : 'трека'}...`,
      });
      searchResult.playlist ? queue.addTracks(searchResult.tracks) : queue.addTrack(searchResult.tracks[0]);
      if (!queue.playing) await queue.play();
    } catch (error) {
      console.log(error);
      interaction.followUp({
        content: 'Ошибка при выполнении команды: ' + error.message,
      });
    }
  },
};
