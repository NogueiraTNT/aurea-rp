const mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.CONNECT_DB,
  user: process.env.USER_DB,
  password: process.env.PASSWORD_DB,
  database: process.env.DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 100,
  connectTimeout: 10000,
});

pool.on("error", (err) => {
  console.error("Erro no pool de conexões:", err);
  // Se quiser, aqui você pode notificar ou tentar lógica de fallback
});

// Keep-alive pra não deixar conexão morrer
const keepConnectionAlive = () => {
  pool
    .promise()
    .query("SELECT 1")
    .then(() => {
      console.log("Conexão com o banco está ativa.");
    })
    .catch((err) => {
      console.error("Erro no keep-alive:", err);
    });
};

// Intervalo de 1 minuto já é suficiente pra maioria dos casos
setInterval(keepConnectionAlive, 60000);

console.log("Pool de conexões com banco configurado.");

module.exports = pool.promise();
