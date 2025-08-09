const { execSync } = require("child_process");

try {
  console.log("🔍 | Checando atualizações no repositório...");

  // Atualiza refs remotas
  execSync("git fetch", { stdio: "inherit" });

  // Verifica se há commits novos
  const output = execSync("git rev-list HEAD...origin/main --count")
    .toString()
    .trim();

  if (parseInt(output) > 0) {
    console.log("📥 | Atualizações encontradas! Baixando...");
    execSync("git pull", { stdio: "inherit" });

    console.log("♻ | Reiniciando bot para aplicar mudanças...");
    process.exit(0); // vai reiniciar se estiver num gerenciador como PM2
  } else {
    console.log("✅ | Nenhuma atualização encontrada. Iniciando bot...");
  }
} catch (err) {
  console.error("❌ Erro ao verificar atualizações:", err);
}

// Carrega o resto do bot
require("dotenv").config();
require("./src/main.js");
require("./src/botUtils/antiCrash.js");
console.log("🎾 | [Anti-Crash] Carregado com sucesso.");
