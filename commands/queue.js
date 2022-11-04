const {GuildMember} = require('discord.js');

module.exports = {

    name: 'queue',
    description: 'Вывести очередь треков (еще хуже, чем узнать, что сейчас играет...)',

    async execute (interaction, player) {

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
          var queue = player.getQueue(interaction.guildId);
          if (typeof(queue) != 'undefined') {
            trimString = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);
              return void interaction.reply({
                embeds: [
                  {
                    title: 'Сейчас ебашит',
                    description: trimString(`Сейчас ебашит 🎶 | **${queue.current.title}**! \n 🎶 | ${queue}! `, 4095),
                  }
                ]
              })
          } else {
            return void interaction.reply({
              content: 'Пусто в очереди!'
            })
          }
    }
}
