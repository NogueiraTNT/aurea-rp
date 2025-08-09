const {
  ApplicationCommandType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  EmbedBuilder,
} = require("discord.js");

const config = require("../../../config.json");

module.exports = {
  name: "al",
  category: "utils",
  description: "Configura o sistema de Allowlist no canal.",
  type: ApplicationCommandType.ChatInput,
  run: async (client, interaction) => {
    if (!interaction.member.roles.cache.has(config.adminRole)) {
      return interaction.reply({
        content: "Você não tem o cargo necessário.",
        ephemeral: true,
      });
    }

    // Cria o embed com a mensagem inicial
    const embed = new EmbedBuilder()
      .setTitle("⭐ AUREA ROLEPLAY - Allowlist")
      .setThumbnail(config.setImage)
      .setImage(config.bannerWL)
      .setDescription(
        "Por favor, clique no botão abaixo para iniciar o processo de inclusão na Allowlist do servidor.\n\n(Lembre-se de ter seu passaporte em mãos para que o cadastro seja efetuado corretamente)."
      )
      .addFields(
        {
          name: "📌 Instruções",
          value:
            ">>> Leia atentamente as regras e requisitos antes de iniciar.",
        },
        {
          name: "❓ Suporte",
          value: ">>> Em caso de dúvidas, procure um administrador.",
        }
      )
      .setFooter({
        text: "Estamos felizes por você fazer parte!",
        iconURL: config.setImage,
      })
      .setColor(config.corEmbed);

    // Cria o botão de interação
    const button = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("al_request")
        .setLabel("✅ Iniciar Allowlist")
        .setStyle(ButtonStyle.Primary)
    );

    await interaction.channel.send({ embeds: [embed], components: [button] });
    return interaction.reply({
      content: "Mensagem de Allowlist configurada!",
      ephemeral: true,
    });
  },
};
