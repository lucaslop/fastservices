require("dotenv/config");
module.exports = {
  dialect: "postgres", //nome do tipo do BD
  host: process.env.DB_HOST, // a host
  username: process.env.DB_USER, //login usarnem
  password: process.env.DB_PASSWORD, //login password
  database: process.env.DB_DATABASE, //nome da database
  define: {
    timestamp: true, //salvar data de criação e alteração de arquivso
    underscored: true, // poder criar por ex:  user_brasil
    underscoredAll: true
  }
};
