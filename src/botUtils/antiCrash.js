module.exports = async (client) => {
  // Trata múltiplas resoluções de promessas
  process.on("multipleResolves", (type, promise, reason) => {
    console.log(
      `🚨 | [Multiple Resolves] Tipo: ${type}\nPromessa: ${promise}\nRazão: ${reason}`
    );
  });

  // Trata rejeições não tratadas
  process.on("unhandledRejection", (reason, promise) => {
    console.log(
      `🚨 | [Unhandled Rejection] Razão: ${reason}\nPromessa: ${promise}`
    );
    // Loga o erro no console e impede o crash
    if (reason instanceof Error) {
      console.error(reason.stack || reason);
    } else {
      console.error(reason);
    }

    // Tratamento específico para Unknown Interaction
    if (reason?.code === 10062) {
      console.warn(
        "⚠️ | [Unknown Interaction] Interação desconhecida ignorada."
      );
    }
  });

  // Trata exceções não capturadas
  process.on("uncaughtException", (error, origin) => {
    console.log(
      `🚨 | [Uncaught Exception] Erro: ${error.message}\nOrigem: ${origin}`
    );
    console.error(error.stack || error);
    // Opcional: Reinicia o bot de forma segura (não recomendado para todos os casos)
  });

  // Mo nitora exceções não capturadas
  process.on("uncaughtExceptionMonitor", (error, origin) => {
    console.log(
      `🚨 | [Uncaught Exception Monitor] Erro: ${error.message}\nOrigem: ${origin}`
    );
    console.error(error.stack || error);
  });

  // Trata eventos que possam causar travamentos
  process.on("warning", (warning) => {
    console.warn(`⚠️ | [Warning] Aviso: ${warning.message}`);
    console.warn(warning.stack || warning);
  });

  process.on("unhandledRejection", (reason, promise) => {
    if (reason instanceof Error) {
      // Ignora erro de mensagem desconhecida (código 10008)
      if (reason.code === 10008) {
        console.warn(
          "⚠️ | [Mensagem Desconhecida] Tentativa de deletar uma mensagem inexistente. Ignorando o erro."
        );
        return;
      }
      console.error(reason.stack || reason);
    } else {
      console.error(reason);
    }
  });

  console.log("✅ | Sistema de anticrash ativo.");

  // Evento para capturar interações desconhecidas diretamente
  client.on("interactionCreate", async (interaction) => {
    try {
      if (!interaction.isCommand() && !interaction.isModalSubmit()) return;
      // Processa a interação normalmente
      // Exemplo: await interaction.reply('Interação processada com sucesso!');
    } catch (error) {
      if (error.code === 10062) {
        console.warn(
          "⚠️ | [Unknown Interaction] Interação desconhecida ignorada no processamento."
        );
      } else {
        console.error(
          "🚨 | [Interaction Error] Erro ao processar interação:",
          error
        );
      }
    }
  });
};
