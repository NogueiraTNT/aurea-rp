const {
  GatewayIntentBits,
  Partials,
  Collection,
  Client,
} = require("discord.js");
const config = require("../config.json");
const fs = require("fs");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Channel, Partials.Message],
});

client.db = new Collection();
client.commands = new Collection();
client.aliases = new Collection();
client.slash = new Collection();

client.login(ProcessingInstruction.env.TOKEN_BOT);

fs.readdir("./src/events/", (err, eventosPath) => {
  eventosPath.forEach((f) => {
    if (!f.endsWith(".js")) return;

    const eventoFile = require(`./events/${f}`);
    let eventoNome = f.split(".")[0];

    console.log(`🥮 | [Eventos] ${eventoNome} carregado.`);
    console.log(`🔍 Verificando eventoFile:`, eventoFile); // Depuração

    if (typeof eventoFile !== "function") {
      console.error(
        `🚨 ERRO: O evento ${eventoNome} não está exportando uma função!`
      );
      return;
    }

    client.on(eventoNome, (...args) => {
      eventoFile(client, ...args);
    });
  });
});

let slashArray = [];
fs.readdirSync("./src/slashCommands/").forEach((cmdsPath) => {
  const botComandos = fs
    .readdirSync(`./src/slashCommands/${cmdsPath}`)
    .filter((fileJs) => fileJs.endsWith(".js"));

  for (let fileCmd of botComandos) {
    let acharCmd = require(`./slashCommands/${cmdsPath}/${fileCmd}`);

    if (acharCmd.name) {
      client.slash.set(acharCmd.name, acharCmd);
      slashArray.push(acharCmd);
      console.log(`💪 | [Comandos Slash] ${acharCmd.name} carregado.`);
    } else {
      console.log(`🚨 | [Erro] Falha ao carregar comando ${acharCmd.name}.`);
      continue;
    }
  }
});

module.exports = client;
module.exports = slashArray;
