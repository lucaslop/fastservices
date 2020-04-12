"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      //qual tabela quero add
      "users",
      //o nome da coluna que quero add
      "avatar_id",
      //informações sobre a coluna
      {
        type: Sequelize.INTEGER,
        //referencia a tabela users com a files pelo id
        references: { model: "files", key: "id" },
        //se caso o user for alterado, altera a foto tbm
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
        allowNull: true
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("users", "avatar_id");
  }
};
