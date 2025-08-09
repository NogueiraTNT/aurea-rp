const config = require("../../config.json");
const {
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} = require("discord.js");
const db = require("../db/db");

module.exports = async (client, interaction) => {
  if (interaction.isCommand()) {
    const slashCmd = client.slash.get(interaction.commandName);
    if (!slashCmd) return interaction.reply({ content: "Ocorreu um erro." });

    const argsCmd = [];
    for (let optionCmd of interaction.options.data) {
      if (optionCmd.type === "SUB_COMMAND") {
        if (optionCmd.name) argsCmd.push(optionCmd.name);
        optionCmd.options?.forEach((x) => {
          if (x.value) argsCmd.push(x.value);
        });
      } else if (optionCmd.value) {
        argsCmd.push(optionCmd.value);
      }
    }

    try {
      await slashCmd.run(client, interaction, argsCmd);
    } catch (err) {
      const logs = new EmbedBuilder()
        .setTitle("🚨 | Ocorreu um erro! __**interactionCreate.js**__")
        .setColor("Red")
        .setDescription(`Descrição do erro:\n\n${err}`);
      client.channels.cache.get(chanelLogs).send({ embeds: [logs] });
      console.error("🚨 | [Erro] " + err);
    }
    return;
  }

  if (interaction.isButton() && interaction.customId === "al_request") {
    const modal = new ModalBuilder()
      .setCustomId("al_modal")
      .setTitle("Solicitação de whitelisted");

    const idInput = new TextInputBuilder()
      .setCustomId("player_id")
      .setLabel("Qual é o seu ID no jogo?")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const nameInput = new TextInputBuilder()
      .setCustomId("player_name")
      .setLabel("Qual é o seu Nome?")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const secondRow = new ActionRowBuilder().addComponents(idInput);
    const finishRow = new ActionRowBuilder().addComponents(nameInput);
    modal.addComponents(secondRow, finishRow);
    await interaction.showModal(modal);
    return;
  }

  if (interaction.isModalSubmit() && interaction.customId === "al_modal") {
    const id = interaction.fields.getTextInputValue("player_id");
    const nameInput = interaction.fields.getTextInputValue("player_name");
    console.log(id)
    const memberRole = interaction.guild.roles.cache.get(
      config.aprMemberRoleId
    );
    const memberRoleR = interaction.guild.roles.cache.get(
      config.newMemberRoleId
    );
    if (!memberRole)
      return interaction.reply({
        content: "Cargo de membro não encontrado.",
        ephemeral: true,
      });

    try {
      const [results] = await db.execute(
        "SELECT * FROM id_users WHERE id = ?",
        [id]
      );
      if (results.length > 0) {
        const whitelisted = results[0].whitelisted;
        if (whitelisted == 0) {
          await interaction.member.roles.add(memberRole);
          await interaction.member.roles.remove(memberRoleR);
          const userid = interaction.member.id;

          await db.execute(
            "UPDATE id_users SET whitelisted = ? WHERE id = ?",
            [1, id]
          );

          const logChannel = interaction.guild.channels.cache.get(
            config.logChannel
          );
          if (logChannel) {
            const embed = new EmbedBuilder()
              .setTitle("✅ Nova WL Liberada")
              .setDescription("Uma nova whitelisted foi enviada com sucesso.")
              .addFields(
                { name: "Jogador", value: `<@${userid}>` },
                { name: "Licença do Jogador", value: `\`\`\`${id}\`\`\`` }
              )
              .setColor("#00FF00")
              .setTimestamp();

            await logChannel.send({ embeds: [embed] });
          }
          // await interaction.member.setNickname(`${name} #${id}`);
          return interaction.reply({
            content: `✅ Sua whitelisted foi aprovada! Bem-vindo(a), **${id}**!`,
            ephemeral: true,
          });
        } else {
          return interaction.reply({
            content: `💢 Sua whitelisted foi recusada!`,
            ephemeral: true,
          });
        }
      }
    } catch (error) {
      console.error("Erro ao alterar o apelido:", error);
      return interaction.reply({
        content:
          "Ocorreu um erro ao configurar sua whitelisted. Certifique-se de que o bot tenha permissões suficientes.",
        ephemeral: true,
      });
    }
  }
};
