const mysql = require("mysql2");

// Crie o pool de conexões com o banco de dados
const pool = mysql.createPool({
  host: process.env.CONNECT_DB, // Endereço do servidor MySQL
  user: process.env.USER_DB, // Usuário do MySQL
  password: process.env.PASSWORD_DB, // Senha do MySQL
  database: process.env.DATABASE, // Nome do banco de dados
  waitForConnections: true, // Aguarda conexão em vez de retornar erro
  connectionLimit: 10, // Máximo de conexões simultâneas
  queueLimit: 0, // Sem limite de fila para requisições
  connectTimeout: 10000, // Tempo de conexão aumentado para 10 segundos
});

// Função para manter a conexão ativa (keep-alive)
const keepConnectionAlive = () => {
  pool
    .promise()
    .query("SELECT 1") // Usando Promises
    .then(() => {
      console.log("Conexão com o banco de dados está ativa.");
    })
    .catch((err) => {
      console.error("Erro ao manter conexão ativa:", err);
    });
};

// Executa o keep-alive a cada 30 segundos
setInterval(keepConnectionAlive, 30000);

// Log de confirmação para o pool
console.log("Conexão com o pool de banco de dados estabelecida.");

// Ouvindo eventos de conexão para lidar com reconexão em caso de erro
pool.on("connection", (connection) => {
  connection.on("error", (err) => {
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      // Reconectar automaticamente
      console.log(
        "Conexão com o banco de dados perdida. Tentando reconectar..."
      );
      pool.getConnection((err, connection) => {
        if (err) {
          console.error("Erro ao reconectar:", err);
        } else {
          console.log("Reconectado ao banco de dados!");
          connection.release();
        }
      });
    } else {
      console.error("Erro de conexão com o banco de dados:", err);
    }
  });
});

module.exports = pool.promise(); // Exporta com Promises para facilitar uso com async/await
