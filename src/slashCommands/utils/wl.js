const {
  Application,
  ApplicationCommand,
  ApplicationCommandType,
  EmbedBuilder,
  ActionRow,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

const config = require("../../../config.json");

module.exports = {
  name: "wl",
  category: "utils",
  descruption: "Comando para configurar o canal de WL",
  type: ApplicationCommandType.ChatInput,
  run: async (Client, interaction) => {
    if (!interaction.member.roles.cache.has(config.adminRole)) {
      return interaction.reply({
        content: "Epa, você não tem cargo para executar essa ação!",
        ephelmeral: true,
      });
    }

    const embed = new EmbedBuilder()
      .setTitle("💸 Aurea RolePlay - Allowlist")
      .setThumbnail(config.setImage)
      .setDescription(
        "Por favor, clique no botão abaixo para iniciar o processo de allowlist na nossa cidade!"
      )
      .addFields({
        name: "texto",
        value: "LEE AQUI DESGRAÇA",
      })
      .setFooter({
        text: "Estamos felizes por você fazer parte!",
        iconURL: config.setImage,
      })
      .setColor(config.corEmbed);

    const button = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("al_request")
        .setCustomId("✅ Iniciar Allowlist")
        .setLabel.setStyle(ButtonStyle.Primary)
    );

    await interaction.channel.send({ embeds: [embed], components: [button] });
    return interaction.reply({
      content: "Você acabou de configurar a Canal para iniciar uam Allowlist",
      ephelmeral: true,
    });
  },
};
